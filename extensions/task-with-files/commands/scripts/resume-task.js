#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Resume Task Script
 * 
 * Called by /planning:resume command
 * Validates and loads a previously started task
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const workingDirBase = join(process.cwd(), '.agent_working_dir');

const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanWorkingDir = clean(workingDirBase);

const currentTaskFile = join(cleanWorkingDir, 'current_task.json');

try {
  // Check if current_task.json exists
  if (!existsSync(currentTaskFile)) {
    console.log(`[task-with-files] No current_task.json found. No task to resume.`);
    console.log(`TASK_RESUMED=false`);
    process.exit(0);
  }

  // Read current_task.json
  let currentTaskData = { current: null };
  try {
    currentTaskData = JSON.parse(readFileSync(currentTaskFile, 'utf-8'));
  } catch (parseErr) {
    console.log(`[task-with-files] current_task.json is invalid: ${parseErr.message}`);
    console.log(`TASK_RESUMED=false`);
    process.exit(0);
  }

  // Check if there's an active task
  if (!currentTaskData.current) {
    console.log(`[task-with-files] No active task in current_task.json`);
    console.log(`TASK_RESUMED=false`);
    process.exit(0);
  }

  const taskDir = currentTaskData.current;

  // Verify task directory exists
  if (!existsSync(taskDir)) {
    console.log(`[task-with-files] Task directory no longer exists: ${taskDir}`);
    console.log(`TASK_RESUMED=false`);
    process.exit(0);
  }

  // Check for planning files
  const planFile = join(taskDir, 'task_plan.md');
  const findingsFile = join(taskDir, 'findings.md');
  const progressFile = join(taskDir, 'progress.md');

  console.log(`[task-with-files] Resuming task: ${taskDir}`);

  let filesFound = 0;
  if (existsSync(planFile)) {
    console.log(`[task-with-files] Found: task_plan.md`);
    filesFound++;
  } else {
    console.log(`[task-with-files] Warning: No task_plan.md found`);
  }

  if (existsSync(findingsFile)) {
    console.log(`[task-with-files] Found: findings.md`);
    filesFound++;
  }

  if (existsSync(progressFile)) {
    console.log(`[task-with-files] Found: progress.md`);
    filesFound++;
  }

  // Load current phase and goal for context
  if (existsSync(planFile)) {
    const planContent = readFileSync(planFile, 'utf-8');
    const lines = planContent.split('\n');
    
    // Extract goal
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '## Goal' && i + 1 < lines.length) {
        const goal = lines[i + 1].trim();
        console.log(`\n[task-with-files] Goal: ${goal}`);
        break;
      }
    }
    
    // Extract current phase
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '## Current Phase' && i + 1 < lines.length) {
        const phase = lines[i + 1].trim();
        console.log(`[task-with-files] Current: ${phase}`);
        break;
      }
    }
  }

  console.log(`\n[task-with-files] Ready to resume (${filesFound}/3 planning files)`);
  console.log(`TASK_RESUMED=true`);
  console.log(`TASK_DIR=${taskDir}`);

} catch (err) {
  console.error(`[task-with-files] Error: ${err.message}`);
  process.exit(1);
}
