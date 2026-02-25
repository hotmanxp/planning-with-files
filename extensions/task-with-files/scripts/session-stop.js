#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SessionEnd Hook
 * 
 * Verifies task completion status.
 * 
 * Note: Always exits with code 0 to avoid blocking session end
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const workspacePath = process.env.WORKSPACE_PATH || process.cwd();
const workingDirBase = join(process.cwd(), '.agent_working_dir');

const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanWorkspacePath = clean(workspacePath);

const currentTaskFile = join(workingDirBase, 'current_task.json');

try {
  // Check if there's an active task
  if (!existsSync(currentTaskFile)) {
    console.log('[task-with-files] Session completed');
    console.log(`[task-with-files] Workspace: ${cleanWorkspacePath}`);
    process.exit(0);
  }

  const currentTaskData = JSON.parse(readFileSync(currentTaskFile, 'utf-8'));
  
  if (!currentTaskData.current) {
    console.log('[task-with-files] Session completed');
    console.log(`[task-with-files] Workspace: ${cleanWorkspacePath}`);
    process.exit(0);
  }

  const taskDir = currentTaskData.current;
  const planFile = join(taskDir, 'task_plan.md');

  // Check if all phases are complete
  if (existsSync(planFile)) {
    const planContent = readFileSync(planFile, 'utf-8');
    const lines = planContent.split('\n');
    
    // Count phase statuses
    let totalPhases = 0;
    let completePhases = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('**Status:**')) {
        totalPhases++;
        if (line.includes('complete')) {
          completePhases++;
        }
      }
    }

    if (totalPhases > 0 && completePhases === totalPhases) {
      console.log('[task-with-files] All phases complete!');
      console.log('[task-with-files] Run /planning:complete to finalize');
    } else if (totalPhases > 0) {
      const remaining = totalPhases - completePhases;
      console.log(`[task-with-files] ${completePhases}/${totalPhases} phases done`);
    }
  }

  console.log('[task-with-files] Session completed');
  console.log(`[task-with-files] Workspace: ${cleanWorkspacePath}`);
  
} catch (err) {
  // Non-fatal error
  console.log(`[task-with-files] SessionEnd: ${err.message}`);
}

process.exit(0);
