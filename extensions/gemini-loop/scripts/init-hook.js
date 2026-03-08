#!/usr/bin/env node

/**
 * Gemini Loop - Session Start Hook
 * Initialize loop state and configuration on session start
 */

import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

// Get environment variables
const projectDir = process.env.GEMINI_PROJECT_DIR || process.cwd()
const stateDir = process.env.GEMINI_LOOP_STATE_DIR || '.agent_working_dir/loops'

console.error('[GeminiLoop] Session start hook triggered')
console.error(`[GeminiLoop] Project directory: ${projectDir}`)
console.error(`[GeminiLoop] State directory: ${stateDir}`)

try {
  // Create state directory if it doesn't exist
  const stateDirPath = join(projectDir, stateDir)
  if (!existsSync(stateDirPath)) {
    mkdirSync(stateDirPath, { recursive: true })
    console.error(`[GeminiLoop] Created state directory: ${stateDirPath}`)
  }

  // Output success (empty JSON means no changes)
  console.log(JSON.stringify({
    systemMessage: undefined // No message needed on every session start
  }))
  
  process.exit(0)
} catch (error) {
  console.error('[GeminiLoop] Initialization failed:', error.message)
  
  // Output error but don't block session start
  console.log(JSON.stringify({
    systemMessage: `⚠️ Gemini Loop initialization warning: ${error.message}`
  }))
  
  process.exit(0) // Exit 0 to not block session
}
