#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AfterToolUse Hook
 *
 * Tracks progress after tool execution.
 * Implements the "2-Action Rule" reminder for updating findings.md
 *
 * Note: Always exits with code 0 to avoid blocking workflow
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const workspacePath = process.env.WORKSPACE_PATH || process.cwd();
const workingDirBase = join(process.cwd(), '.agent_working_dir');

const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanWorkspacePath = clean(workspacePath);

// Get current task directory
const currentTaskFile = join(workingDirBase, 'current_task.json');

// 如果没有进行中的任务，直接退出（不输出任何内容）
if (!existsSync(currentTaskFile)) {
  process.exit(0);
}

try {
  const currentTaskData = JSON.parse(readFileSync(currentTaskFile, 'utf-8'));

  // 如果没有当前任务，直接退出（不输出任何内容）
  if (!currentTaskData.current) {
    process.exit(0);
  }

  const taskDir = currentTaskData.current;
  const progressFile = join(taskDir, 'progress.md');
  const findingsFile = join(taskDir, 'findings.md');

  // Check if findings.md needs updating (2-Action Rule reminder)
  if (existsSync(findingsFile)) {
    console.log('[task-with-files] Remember the 2-Action Rule');
    console.log('[task-with-files] After 2 view/read operations, update findings.md');
  }

  // Log tool usage to progress if file exists
  if (existsSync(progressFile)) {
    console.log('[task-with-files] Progress tracked');
  }

} catch (err) {
  // Non-fatal error, continue silently
}

console.log(`[task-with-files] Workspace: ${cleanWorkspacePath}`);
process.exit(0);
