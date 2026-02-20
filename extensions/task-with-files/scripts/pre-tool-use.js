#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PreToolUse Hook
 * 
 * Re-reads task plan before major decisions to maintain context.
 * Helps with "attention manipulation" - keeping the AI focused on the goal.
 * 
 * Note: Always exits with code 0 to avoid blocking tool execution
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const workingDirBase = join(process.cwd(), '.agent_working_dir');

// Get current task directory
const currentTaskFile = join(workingDirBase, 'current_task.json');

if (!existsSync(currentTaskFile)) {
  // No active task, skip
  process.exit(0);
}

try {
  const currentTaskData = JSON.parse(readFileSync(currentTaskFile, 'utf-8'));
  
  if (!currentTaskData.current) {
    process.exit(0);
  }

  const taskDir = currentTaskData.current;
  const planFile = join(taskDir, 'task_plan.md');

  if (existsSync(planFile)) {
    const planContent = readFileSync(planFile, 'utf-8');
    const lines = planContent.split('\n');
    
    // Extract key sections for context
    const goalMatch = lines.find(l => l.startsWith('## Goal'));
    const currentPhaseMatch = lines.find(l => l.startsWith('## Current Phase'));
    
    if (goalMatch || currentPhaseMatch) {
      console.log('[task-with-files] Plan context:');
      if (goalMatch) {
        const goalLine = lines[lines.indexOf(goalMatch) + 1]?.trim() || '';
        console.log(`[task-with-files]   Goal: ${goalLine.substring(0, 100)}${goalLine.length > 100 ? '...' : ''}`);
      }
      if (currentPhaseMatch) {
        const phaseLine = lines[lines.indexOf(currentPhaseMatch) + 1]?.trim() || '';
        console.log(`[task-with-files]   Current: ${phaseLine}`);
      }
    }
  }
} catch (err) {
  // Non-fatal error, continue silently
}

process.exit(0);
