#!/usr/bin/env node

/**
 * Gemini Loop - AfterAgent Hook
 * 
 * Integrates full loop functionality:
 * - Check loop state
 * - Detect completion signals
 * - Handle Ultrawork verification
 * - Inject continuation prompts
 * - Enforce max iterations
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_ITERATIONS = 100
const COMPLETION_PROMISE = 'DONE'
const ULTRAWORK_VERIFICATION_PROMISE = 'VERIFIED'

// ============================================================================
// Logging
// ============================================================================

function log(...args) {
  console.error('[GeminiLoop]', ...args)
}

function logDebug(message, data) {
  const projectDir = process.env.GEMINI_PROJECT_DIR || process.cwd()
  const logFile = join(projectDir, '.gemini-loop-debug.log')
  
  const timestamp = new Date().toISOString()
  const line = `[${timestamp}] ${message} ${JSON.stringify(data || {})}\n`
  
  try {
    appendFileSync(logFile, line)
  } catch (e) {
    // Ignore log errors
  }
}

// ============================================================================
// State Management
// ============================================================================

function getStateFilePath(projectDir, stateDir) {
  return join(projectDir, stateDir, '.gemini-loop-state.md')
}

function parseStateFile(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/s)
  if (!match) return null
  
  const [, frontmatter, prompt] = match
  const data = {}
  
  for (const line of frontmatter.split('\n')) {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim()
      value = value.replace(/^["']|["']$/g, '')
      data[key.trim()] = value
    }
  }
  
  return {
    data,
    prompt: prompt.trim(),
    raw: content
  }
}

function readState(projectDir, stateDir) {
  const stateFile = getStateFilePath(projectDir, stateDir)
  
  if (!existsSync(stateFile)) {
    return null
  }
  
  try {
    const content = readFileSync(stateFile, 'utf-8')
    const parsed = parseStateFile(content)
    
    if (!parsed) return null
    
    const { data, prompt } = parsed
    
    const active = data.active === 'true' || data.active === true
    const iteration = parseInt(data.iteration || '1', 10)
    const maxIterationsRaw = data.max_iterations
    const maxIterations = maxIterationsRaw === 'unbounded' 
      ? Infinity 
      : (parseInt(maxIterationsRaw || '100', 10) || DEFAULT_MAX_ITERATIONS)
    const ultrawork = data.ultrawork === 'true' || data.ultrawork === true
    const completionPromise = data.completion_promise || COMPLETION_PROMISE
    const verificationPending = data.verification_pending === 'true' || data.verification_pending === true
    const verificationSessionId = data.verification_session_id
    const strategy = data.strategy || 'continue'
    
    return {
      active,
      iteration,
      max_iterations: maxIterations,
      ultrawork,
      completion_promise: completionPromise,
      verification_pending: verificationPending,
      verification_session_id: verificationSessionId,
      strategy,
      prompt,
      session_id: data.session_id,
      started_at: data.started_at,
      file: stateFile,
      raw: data
    }
  } catch (error) {
    log('Failed to read state:', error.message)
    return null
  }
}

function writeState(state, updates) {
  const newContent = `---
active: ${updates.active !== undefined ? updates.active : state.active}
iteration: ${updates.iteration !== undefined ? updates.iteration : state.iteration}
max_iterations: ${state.max_iterations === Infinity ? 'unbounded' : (updates.max_iterations !== undefined ? updates.max_iterations : state.max_iterations)}
completion_promise: "${updates.completion_promise || state.completion_promise}"
started_at: "${state.started_at || new Date().toISOString()}"
${state.session_id ? `session_id: "${state.session_id}"` : ''}
${state.ultrawork !== undefined ? `ultrawork: ${updates.ultrawork !== undefined ? updates.ultrawork : state.ultrawork}` : ''}
${updates.verification_pending !== undefined ? `verification_pending: ${updates.verification_pending}` : ''}
${updates.verification_session_id !== undefined ? `verification_session_id: "${updates.verification_session_id}"` : ''}
${state.strategy ? `strategy: "${state.strategy}"` : ''}
---
${state.prompt}
`
  
  try {
    writeFileSync(state.file, newContent, 'utf-8')
    return true
  } catch (error) {
    log('Failed to write state:', error.message)
    return false
  }
}

function clearState(state) {
  try {
    writeFileSync(state.file, `---
active: false
iteration: ${state.iteration}
max_iterations: ${state.max_iterations === Infinity ? 'unbounded' : state.max_iterations}
ended_at: ${new Date().toISOString()}
reason: ${state.ended_reason || 'completed'}
---
${state.prompt}
`)
    return true
  } catch (error) {
    log('Failed to clear state:', error.message)
    return false
  }
}

// ============================================================================
// Completion Detection
// ============================================================================

function detectCompletionInOutput(output, promise) {
  if (!output) return false
  
  const outputStr = typeof output === 'string' ? output : JSON.stringify(output)
  return outputStr.includes(`<promise>${promise}</promise>`)
}

function extractLastMessage(llmResponse) {
  if (!llmResponse) return ''
  
  // Try to get the last assistant message
  if (llmResponse.content) {
    return llmResponse.content
  }
  
  if (llmResponse.text) {
    return llmResponse.text
  }
  
  if (llmResponse.output) {
    return llmResponse.output
  }
  
  return JSON.stringify(llmResponse)
}

// ============================================================================
// Prompt Building
// ============================================================================

function getMaxIterationsLabel(maxIterations) {
  return maxIterations === Infinity ? 'unbounded' : String(maxIterations)
}

function buildContinuationPrompt(state) {
  const template = `[SYSTEM DIRECTIVE - RALPH LOOP ${state.iteration}/${getMaxIterationsLabel(state.max_iterations)}]

Your previous attempt did not output the completion promise. Continue working on the task.

IMPORTANT:
- Review your progress so far
- Continue from where you left off
- When FULLY complete, output: <promise>${state.completion_promise}</promise>
- Do not stop until the task is truly done

Original task:
${state.prompt}`

  return state.ultrawork ? `ultrawork ${template}` : template
}

function buildUltraworkVerificationPrompt(state) {
  const template = `[SYSTEM DIRECTIVE - ULTRAWORK LOOP VERIFICATION ${state.iteration}/${getMaxIterationsLabel(state.max_iterations)}]

You already emitted <promise>${state.completion_promise}</promise>. This does NOT finish the loop yet.

REQUIRED NOW:
- Call Oracle using task(subagent_type="oracle", load_skills=[], run_in_background=false, ...)
- Ask Oracle to verify whether the original task is actually complete
- The system will inspect the Oracle session directly for the verification result
- If Oracle does not verify, continue fixing the task and do not consider it complete

Original task:
${state.prompt}`

  return `ultrawork ${template}`
}

function buildVerificationFailurePrompt(state) {
  const template = `[SYSTEM DIRECTIVE - ULTRAWORK LOOP VERIFICATION FAILED ${state.iteration}/${getMaxIterationsLabel(state.max_iterations)}]

Oracle did not emit <promise>VERIFIED</promise>. Verification failed.

REQUIRED NOW:
- Verification failed. Fix the task until Oracle's review is satisfied
- Oracle does not lie. Treat the verification result as ground truth
- Do not claim completion early or argue with the failed verification
- After fixing the remaining issues, request Oracle review again using task(subagent_type="oracle", load_skills=[], run_in_background=false, ...)
- Only when the work is ready for review again, output: <promise>${state.completion_promise}</promise>

Original task:
${state.prompt}`

  return `ultrawork ${template}`
}

// ============================================================================
// Main Hook Logic
// ============================================================================

function main() {
  const projectDir = process.env.GEMINI_PROJECT_DIR || process.cwd()
  const stateDir = process.env.GEMINI_LOOP_STATE_DIR || '.agent_working_dir/loops'
  const sessionId = process.env.GEMINI_SESSION_ID || 'unknown'
  
  log('AfterAgent hook triggered')
  log('Session:', sessionId)
  
  try {
    // Read hook input from stdin
    const inputRaw = readFileSync(0, 'utf-8')
    const input = JSON.parse(inputRaw)
    
    logDebug('Hook input', { eventType: input.event_type, sessionId })
    
    // Get LLM response to check for completion
    const llmResponse = input.llm_response || input.prompt_response || {}
    const lastOutput = extractLastMessage(llmResponse)
    
    logDebug('LLM response', { outputLength: lastOutput?.length || 0 })
    
    // Check if there's an active loop
    const state = readState(projectDir, stateDir)
    
    if (!state) {
      log('No state file found - no active loop')
      console.log(JSON.stringify({}))
      process.exit(0)
    }
    
    if (!state.active) {
      log('Loop is not active')
      console.log(JSON.stringify({}))
      process.exit(0)
    }
    
    log('Loop state:', {
      iteration: state.iteration,
      max: state.max_iterations,
      ultrawork: state.ultrawork,
      verificationPending: state.verification_pending
    })
    
    // ========================================================================
    // Case 1: Verification Pending (Ultrawork mode)
    // ========================================================================
    
    if (state.ultrawork && state.verification_pending) {
      log('Ultrawork verification pending')
      
      // Check if Oracle verified
      if (detectCompletionInOutput(lastOutput, ULTRAWORK_VERIFICATION_PROMISE)) {
        log('Oracle verification successful!')
        
        clearState({ ...state, ended_reason: 'oracle_verified' })
        
        console.log(JSON.stringify({
          systemMessage: `✅ **ULTRAWORK LOOP COMPLETE!**\n\nOracle verified! Task completed after ${state.iteration} iteration(s).`
        }))
        process.exit(0)
      }
      
      // Check if Oracle rejected
      const rejectionKeywords = ['verification failed', 'incomplete', 'missing', 'not complete', 'does not verify']
      const isRejected = rejectionKeywords.some(keyword => 
        lastOutput.toLowerCase().includes(keyword)
      )
      
      if (isRejected) {
        log('Oracle verification failed - restarting loop')
        
        // Increment iteration and restart
        const newIteration = state.iteration + 1
        
        if (newIteration > state.max_iterations) {
          clearState({ ...state, ended_reason: 'max_iterations_verification_failed' })
          
          console.log(JSON.stringify({
            systemMessage: `⛔ **Loop Stopped**: Max iterations (${state.max_iterations}) reached during verification.`
          }))
          process.exit(0)
        }
        
        writeState(state, {
          iteration: newIteration,
          verification_pending: false,
          verification_session_id: undefined,
          completion_promise: state.completion_promise
        })
        
        console.log(JSON.stringify({
          systemMessage: `⚠️ **Oracle verification failed**. Continuing to iteration ${newIteration}/${getMaxIterationsLabel(state.max_iterations)}.\n\nFix the issues and try again.`
        }))
        process.exit(0)
      }
      
      // Still waiting for verification
      log('Still waiting for Oracle verification')
      console.log(JSON.stringify({}))
      process.exit(0)
    }
    
    // ========================================================================
    // Case 2: Check for Completion Signal
    // ========================================================================
    
    if (detectCompletionInOutput(lastOutput, state.completion_promise)) {
      log('Completion signal detected!')
      
      if (state.ultrawork) {
        // Ultrawork mode: trigger Oracle verification
        log('Ultrawork mode - triggering Oracle verification')
        
        writeState(state, {
          verification_pending: true,
          completion_promise: ULTRAWORK_VERIFICATION_PROMISE
        })
        
        console.log(JSON.stringify({
          systemMessage: `🔍 **Ultrawork Verification Required**\n\nDONE detected. Please call Oracle to verify:\n\n\`\`\`\ntask(subagent_type="oracle", prompt="Verify this task is complete: ${state.prompt.substring(0, 100)}...")\n\`\`\`\n\nIteration: ${state.iteration}/${getMaxIterationsLabel(state.max_iterations)}`
        }))
        process.exit(0)
      } else {
        // Standard mode: complete the loop
        log('Standard mode - completing loop')
        
        clearState({ ...state, ended_reason: 'completed' })
        
        console.log(JSON.stringify({
          systemMessage: `✅ **LOOP COMPLETE!**\n\nTask completed after ${state.iteration} iteration(s).`
        }))
        process.exit(0)
      }
    }
    
    // ========================================================================
    // Case 3: Check Max Iterations
    // ========================================================================
    
    if (state.iteration >= state.max_iterations) {
      log('Max iterations reached')
      
      clearState({ ...state, ended_reason: 'max_iterations' })
      
      console.log(JSON.stringify({
        systemMessage: `⛔ **Loop Stopped**\n\nMax iterations (${state.max_iterations}) reached without completion.\n\nTask: ${state.prompt.substring(0, 200)}`
      }))
      process.exit(0)
    }
    
    // ========================================================================
    // Case 4: Continue Loop
    // ========================================================================
    
    log('No completion detected - continuing loop')
    
    // Increment iteration
    const newIteration = state.iteration + 1
    writeState(state, { iteration: newIteration })
    
    // Build continuation prompt
    const continuationPrompt = state.ultrawork && state.iteration > 1
      ? buildUltraworkVerificationPrompt({ ...state, iteration: newIteration })
      : buildContinuationPrompt({ ...state, iteration: newIteration })
    
    log(`Continuing to iteration ${newIteration}/${getMaxIterationsLabel(state.max_iterations)}`)
    
    console.log(JSON.stringify({
      systemMessage: `🔄 **Loop Continuing** (Iteration ${newIteration}/${getMaxIterationsLabel(state.max_iterations)})\n\n${state.ultrawork ? '⚡ Ultrawork mode active.' : ''}\n\nContinue working on:\n\n> ${state.prompt.substring(0, 200)}${state.prompt.length > 200 ? '...' : ''}`
    }))
    
    process.exit(0)
    
  } catch (error) {
    log('Hook failed:', error.message)
    log(error.stack)
    logDebug('Error', { message: error.message, stack: error.stack })
    
    // Don't block agent execution
    console.log(JSON.stringify({}))
    process.exit(0)
  }
}

main()
