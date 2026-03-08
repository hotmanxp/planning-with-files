#!/usr/bin/env node

/**
 * Cancel Loop Command
 * Usage: /cancel-loop
 */

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

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
console.log('║              Cancel Gemini Loop                          ║')
console.log('╚══════════════════════════════════════════════════════════╝')
console.log('')

if (!existsSync(stateFile)) {
  console.log('❌ No active loop found.')
  console.log('')
  console.log('There is no loop currently running in this session.')
  console.log('Use /loop to start a new loop.')
  process.exit(0)
}

try {
  // Read current state
  const content = readFileSync(stateFile, 'utf-8')
  const match = content.match(/^---\n([\s\S]*?)\n---/s)
  
  if (match) {
    const frontmatter = match[1]
    const iterationMatch = frontmatter.match(/iteration:\s*(\d+)/)
    const promptMatch = content.match(/---\n[\s\S]*?\n---\n([\s\S]*)/)
    
    const iteration = iterationMatch ? iterationMatch[1] : '?'
    const prompt = promptMatch ? promptMatch[1].trim().substring(0, 50) : 'Unknown task'
    
    console.log('📊 Current loop state:')
    console.log(`   Iteration: ${iteration}`)
    console.log(`   Task: ${prompt}...`)
    console.log('')
  }
  
  // Delete state file
  unlinkSync(stateFile)
  
  console.log('✅ Loop cancelled successfully.')
  console.log('')
  console.log('The agent has been notified to stop the loop.')
  console.log('You can start a new loop anytime with /loop.')
} catch (error) {
  console.error('❌ Error cancelling loop:', error.message)
  console.error('')
  console.error('You may need to manually delete the state file:')
  console.error(`   rm ${stateFile}`)
  process.exit(1)
}