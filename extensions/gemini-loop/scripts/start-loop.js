#!/usr/bin/env node

/**
 * Loop Command - Start a development loop
 * Usage: /loop "task description" [--max-iterations=N] [--ultrawork]
 */

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const extensionDir = join(__dirname, '..')

// Parse arguments
const args = process.argv.slice(2)
let taskDescription = ''
let maxIterations = undefined
let isUltrawork = false

for (const arg of args) {
  if (arg.startsWith('--max-iterations=')) {
    maxIterations = parseInt(arg.split('=')[1], 10)
  } else if (arg === '--ultrawork' || arg === '-u') {
    isUltrawork = true
  } else if (!arg.startsWith('-')) {
    taskDescription = arg.replace(/^["']|["']$/g, '')
  }
}

if (!taskDescription) {
  console.error('Error: Task description required')
  console.error('Usage: /loop "task description" [--max-iterations=N] [--ultrawork]')
  process.exit(1)
}

// Load config
const configPath = join(extensionDir, 'gemini-extension.json')
let config = {}
if (existsSync(configPath)) {
  config = JSON.parse(readFileSync(configPath, 'utf-8'))
}

const loopConfig = config.config?.geminiLoop || {}

// Determine session ID (from environment or prompt user)
const sessionId = process.env.GEMINI_SESSION_ID || 'current'

console.log(`
╔══════════════════════════════════════════════════════════╗
║                    Gemini Loop                            ║
╠══════════════════════════════════════════════════════════╣
║  Task: ${taskDescription.substring(0, 50).padEnd(50)}║
║  Mode: ${isUltrawork ? 'Ultrawork (with Oracle verification)' : 'Standard' + ' '.repeat(41)}║
║  Max Iterations: ${(maxIterations || loopConfig.defaultMaxIterations || 100).toString().padEnd(39)}║
╚══════════════════════════════════════════════════════════╝
`)

console.log('🔄 Starting loop...')
console.log(`📝 Task: ${taskDescription}`)
console.log(`⚡ Mode: ${isUltrawork ? 'Ultrawork' : 'Standard'}`)
console.log(`🔢 Max iterations: ${maxIterations || loopConfig.defaultMaxIterations || 100}`)
console.log('')
console.log('The agent will now work continuously on your task.')
console.log('It will automatically continue until completion is detected.')
console.log('')
console.log('Commands:')
console.log('  /loop-status  - Check current loop status')
console.log('  /cancel-loop  - Cancel the active loop')
console.log('')

// Write state file to signal loop start
const stateDir = loopConfig.stateDir || '.agent_working_dir/loops'
const stateFile = join(process.cwd(), stateDir, '.gemini-loop-state.md')

// Create directory if needed
const stateDirPath = join(process.cwd(), stateDir)
if (!existsSync(stateDirPath)) {
  import('node:fs').then(({ mkdirSync }) => {
    mkdirSync(stateDirPath, { recursive: true })
  })
}

// Output for Gemini CLI to process
console.log('---LOOP_START---')
console.log(`SESSION_ID: ${sessionId}`)
console.log(`PROMPT: ${taskDescription}`)
console.log(`ULTRAWORK: ${isUltrawork}`)
console.log(`MAX_ITERATIONS: ${maxIterations || loopConfig.defaultMaxIterations || 100}`)
console.log('---LOOP_START_END---')
