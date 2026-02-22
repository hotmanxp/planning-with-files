#!/usr/bin/env node
/**
 * Set Current Task Script
 *
 * Called by /omg:start command
 * Creates task directory and initializes current_task.json
 */

import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const extensionPath = resolve(__dirname, '..', '..');

const workspacePath = process.env.WORKSPACE_PATH || process.cwd();
const taskName = process.argv[2] || 'default';
const workingDirBase = join(process.cwd(), '.agent_working_dir');

const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanWorkingDir = clean(workingDirBase);

function getTaskDir(taskName) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const safeTaskName = taskName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  const taskDirName = `task_${safeTaskName}_${dateStr}`;
  return join(cleanWorkingDir, taskDirName);
}

try {
  if (!existsSync(cleanWorkingDir)) {
    mkdirSync(cleanWorkingDir, { recursive: true });
    console.log(`[oh-my-gemini] Created working directory: ${cleanWorkingDir}`);
  }

  const taskDir = getTaskDir(taskName);

  if (!existsSync(taskDir)) {
    mkdirSync(taskDir, { recursive: true });
    console.log(`[oh-my-gemini] Created task directory: ${taskDir}`);
  } else {
    console.log(`[oh-my-gemini] Task directory already exists: ${taskDir}`);
  }

  const templatesDir = join(extensionPath, 'templates');
  const taskPlanFile = join(taskDir, 'task_plan.md');
  const findingsFile = join(taskDir, 'findings.md');
  const progressFile = join(taskDir, 'progress.md');

  if (!existsSync(taskPlanFile) && existsSync(join(templatesDir, 'task_plan.md'))) {
    copyFileSync(join(templatesDir, 'task_plan.md'), taskPlanFile);
    console.log(`[oh-my-gemini] Created task_plan.md`);
  }

  if (!existsSync(findingsFile) && existsSync(join(templatesDir, 'findings.md'))) {
    copyFileSync(join(templatesDir, 'findings.md'), findingsFile);
    console.log(`[oh-my-gemini] Created findings.md`);
  }

  if (!existsSync(progressFile) && existsSync(join(templatesDir, 'progress.md'))) {
    copyFileSync(join(templatesDir, 'progress.md'), progressFile);
    console.log(`[oh-my-gemini] Created progress.md`);
  }

  const currentTaskFile = join(cleanWorkingDir, 'current_task.json');
  const currentTaskData = { current: taskDir };
  writeFileSync(currentTaskFile, JSON.stringify(currentTaskData, null, 2));
  console.log(`[oh-my-gemini] Updated current_task.json`);

  console.log(`\n[oh-my-gemini] Task started: ${taskName}`);
  console.log(`[oh-my-gemini] Task directory: ${taskDir}`);

  console.log(`\nTASK_DIR=${taskDir}`);

} catch (err) {
  console.error(`[oh-my-gemini] Error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}
