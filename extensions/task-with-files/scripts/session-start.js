#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SessionStart Hook
 * 
 * Initializes session and checks for resumable tasks.
 * Does NOT automatically resume - user must run /planning:resume
 * 
 * Note: Always exits with code 0 to avoid blocking session start
 */

import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const workspacePath = process.env.WORKSPACE_PATH || process.cwd();
const extensionPath = process.env.EXTENSION_PATH || '';

// Clean environment variables
const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';

const workingDirBase = join(process.cwd(), '.agent_working_dir');
const cleanWorkingDir = clean(workingDirBase);
const cleanWorkspacePath = clean(workspacePath);

const currentTaskFile = join(cleanWorkingDir, 'current_task.json');

try {
  // Ensure working directory exists
  if (!existsSync(cleanWorkingDir)) {
    mkdirSync(cleanWorkingDir, { recursive: true });
    console.log(`[task-with-files] Created working directory: ${cleanWorkingDir}`);
  }

  // Check for current task
  if (existsSync(currentTaskFile)) {
    try {
      const currentTaskData = JSON.parse(readFileSync(currentTaskFile, 'utf-8'));
      if (currentTaskData.current) {
        console.log(`[task-with-files] Previous task available: ${currentTaskData.current}`);
        console.log('[task-with-files] Run /planning:resume to continue');
      } else {
        console.log('[task-with-files] No active task (current_task.json is empty)');
      }
    } catch (parseErr) {
      // Non-fatal error, continue
      console.log(`[task-with-files] Could not read current_task.json`);
    }
  } else {
    console.log('[task-with-files] No current_task.json found (new session)');
  }

  console.log(`[task-with-files] Workspace: ${cleanWorkspacePath}`);
} catch (err) {
  // Log error but don't fail - hooks should be best-effort
  console.log(`[task-with-files] SessionStart: ${err.message}`);
}

// Always exit with 0 to avoid blocking session start
process.exit(0);
