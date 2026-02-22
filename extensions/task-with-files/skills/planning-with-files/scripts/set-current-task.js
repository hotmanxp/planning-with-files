#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Set Current Task Script
 *
 * Called by /planning:start command
 * Creates task directory and initializes current_task.json
 */

import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Skill path is 1 level up from scripts/
const skillPath = resolve(__dirname, '..');

const workspacePath = process.env.WORKSPACE_PATH || process.cwd();
const taskName = process.argv[2] || 'default';
const workingDirBase = join(process.cwd(), '.agent_working_dir');

const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanWorkingDir = clean(workingDirBase);

// Generate task directory: ${projectDir}/.agent_working_dir/task_{$taskName}_${date}/
function getTaskDir(taskName) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const safeTaskName = taskName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  const taskDirName = `task_${safeTaskName}_${dateStr}`;
  return join(cleanWorkingDir, taskDirName);
}

try {
  // Ensure working directory base exists
  if (!existsSync(cleanWorkingDir)) {
    mkdirSync(cleanWorkingDir, { recursive: true });
    console.log(`[task-with-files] Created working directory: ${cleanWorkingDir}`);
  }

  // Get task directory
  const taskDir = getTaskDir(taskName);

  // Create task directory
  if (!existsSync(taskDir)) {
    mkdirSync(taskDir, { recursive: true });
    console.log(`[task-with-files] Created task directory: ${taskDir}`);
  } else {
    console.log(`[task-with-files] Task directory already exists: ${taskDir}`);
  }

  // Copy templates
  const templatesDir = join(skillPath, 'templates');
  const taskPlanFile = join(taskDir, 'task_plan.md');
  const findingsFile = join(taskDir, 'findings.md');
  const progressFile = join(taskDir, 'progress.md');

  if (!existsSync(taskPlanFile) && existsSync(join(templatesDir, 'task_plan.md'))) {
    copyFileSync(join(templatesDir, 'task_plan.md'), taskPlanFile);
    console.log(`[task-with-files] Created task_plan.md`);
  }

  if (!existsSync(findingsFile) && existsSync(join(templatesDir, 'findings.md'))) {
    copyFileSync(join(templatesDir, 'findings.md'), findingsFile);
    console.log(`[task-with-files] Created findings.md`);
  }

  if (!existsSync(progressFile) && existsSync(join(templatesDir, 'progress.md'))) {
    copyFileSync(join(templatesDir, 'progress.md'), progressFile);
    console.log(`[task-with-files] Created progress.md`);
  }

  // Update current_task.json
  const currentTaskFile = join(cleanWorkingDir, 'current_task.json');
  const currentTaskData = { current: taskDir };
  writeFileSync(currentTaskFile, JSON.stringify(currentTaskData, null, 2));
  console.log(`[task-with-files] Updated current_task.json`);

  console.log(`\n[task-with-files] Task started: ${taskName}`);
  console.log(`[task-with-files] Task directory: ${taskDir}`);

  // Output for command chaining
  console.log(`\nTASK_DIR=${taskDir}`);

} catch (err) {
  console.error(`[task-with-files] Error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}
