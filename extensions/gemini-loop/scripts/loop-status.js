#!/usr/bin/env node

/**
 * Loop Status Command
 * Usage: /loop-status
 */

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const extensionDir = join(__dirname, '..')

// Load config
const configPath = join(extensionDir, 'gemini-extension.json')
let config = {}
if (existsSync(configPath)) {
  config = JSON.parse(readFileSync(configPath, 'utf-8'))
}

const loopConfig = config.config?.geminiLoop || {}
const stateDir = loopConfig.stateDir || '.agent_working_dir/loops'
const stateFile = join(process.cwd(), stateDir, '.gemini-loop-state.md')

console.log('╔══════════════════════════════════════════════════════════╗')
console.log('║                 Gemini Loop Status                       ║')
console.log('╚══════════════════════════════════════════════════════════╝')
console.log('')

if (!existsSync(stateFile)) {
  console.log('ℹ️  No active loop.')
  console.log('')
  console.log('There is no loop currently running.')
  console.log('Use /loop to start a new loop.')
  process.exit(0)
}

try {
  const content = readFileSync(stateFile, 'utf-8')
  const { data, body } = parseFrontmatter(content)
  
  const status = {
    active: data.active === true || data.active === 'true',
    iteration: data.iteration || '?',
    maxIterations: data.max_iterations || 'unbounded',
    ultrawork: data.ultrawork === true || data.ultrawork === 'true',
    prompt: body?.trim() || 'Unknown',
    startedAt: data.started_at || 'Unknown',
    strategy: data.strategy || 'continue',
  }
  
  console.log('📊 Loop State:')
  console.log(`   Active: ${status.active ? '✅ Yes' : '❌ No'}`)
  console.log(`   Iteration: ${status.iteration} / ${status.maxIterations}`)
  console.log(`   Mode: ${status.ultrawork ? '⚡ Ultrawork' : '📋 Standard'}`)
  console.log(`   Strategy: ${status.strategy}`)
  console.log(`   Started: ${new Date(status.startedAt).toLocaleString()}`)
  console.log('')
  console.log('📝 Task:')
  console.log(`   ${status.prompt}`)
  console.log('')
  
  // Calculate progress
  if (status.maxIterations !== 'unbounded') {
    const max = parseInt(status.maxIterations, 10)
    const current = parseInt(status.iteration, 10)
    const percent = Math.round((current / max) * 100)
    console.log(`📈 Progress: ${current}/${max} (${percent}%)`)
    
    if (percent > 80) {
      console.log('⚠️  Warning: Approaching max iterations!')
    }
  }
  
  console.log('')
  console.log('Commands:')
  console.log('   /cancel-loop  - Cancel this loop')
  console.log('   /loop-list    - List all historical loops')
  
} catch (error) {
  console.error('❌ Error reading loop state:', error.message)
  console.error('')
  console.error('The state file may be corrupted.')
  console.error('Use /cancel-loop to reset.')
  process.exit(1)
}

/**
 * Parse frontmatter YAML-like header
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/s)
  if (!match) {
    return { data: {}, body: content }
  }
  
  const [, frontmatter, body] = match
  const data = {}
  
  for (const line of frontmatter.split('\n')) {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim()
      value = value.replace(/^["]|["]$/g, '')
      data[key.trim()] = value
    }
  }
  
  return { data, body }
}