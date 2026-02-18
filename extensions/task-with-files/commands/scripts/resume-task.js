/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Script to resume a task from current_task.json
// Called by /planning:resume command
const workingDirBase = process.env.WORKING_DIR_BASE || `${process.cwd()}/.agent_working_dir`;

const fs = require("fs");
const path = require("path");

const currentTaskFile = path.join(workingDirBase, "current_task.json");

// Read current_task.json
if (!fs.existsSync(currentTaskFile)) {
  console.log(`[task-with-files] No current_task.json found. No task to resume.`);
  console.log(`TASK_RESUMED=false`);
  process.exit(0);
}

let currentTaskData = { current: null };
try {
  currentTaskData = JSON.parse(fs.readFileSync(currentTaskFile, "utf-8"));
} catch (e) {
  console.log(`[task-with-files] current_task.json is invalid`);
  console.log(`TASK_RESUMED=false`);
  process.exit(0);
}

if (!currentTaskData.current) {
  console.log(`[task-with-files] No active task in current_task.json`);
  console.log(`TASK_RESUMED=false`);
  process.exit(0);
}

const taskDir = currentTaskData.current;

// Verify task directory exists
if (!fs.existsSync(taskDir)) {
  console.log(`[task-with-files] Task directory no longer exists: ${taskDir}`);
  console.log(`TASK_RESUMED=false`);
  process.exit(0);
}

// Check for planning files
const planFile = path.join(taskDir, "task_plan.md");
const findingsFile = path.join(taskDir, "findings.md");
const progressFile = path.join(taskDir, "progress.md");

console.log(`[task-with-files] Resuming task: ${taskDir}`);

if (fs.existsSync(planFile)) {
  console.log(`[task-with-files] Found: ${planFile}`);
} else {
  console.log(`[task-with-files] Warning: No task_plan.md found`);
}

if (fs.existsSync(findingsFile)) {
  console.log(`[task-with-files] Found: ${findingsFile}`);
}

if (fs.existsSync(progressFile)) {
  console.log(`[task-with-files] Found: ${progressFile}`);
}

console.log(`TASK_RESUMED=true`);
console.log(`TASK_DIR=${taskDir}`);
