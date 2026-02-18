/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Script to set current task in current_task.json
// Called by /planning:start command
const workingDirBase = process.env.WORKING_DIR_BASE || `${process.cwd()}/.agent_working_dir`;
const workspacePath = process.env.WORKSPACE_PATH || process.cwd();
const taskName = process.argv[2] || "default";

const fs = require("fs");
const path = require("path");

const currentTaskFile = path.join(workingDirBase, "current_task.json");

// Generate task directory: ${projectDir}/.agent_working_dir/task_{$taskName}_${date}/
function getTaskDir(taskName) {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const safeTaskName = taskName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const taskDirName = `task_${safeTaskName}_${dateStr}`;
  return path.join(workingDirBase, taskDirName);
}

// Ensure working directory base exists
if (!fs.existsSync(workingDirBase)) {
  fs.mkdirSync(workingDirBase, { recursive: true });
  console.log(`[task-with-files] Created working directory: ${workingDirBase}`);
}

// Get task directory
const taskDir = getTaskDir(taskName);

// Update current_task.json
const currentTaskData = { current: taskDir };
fs.writeFileSync(currentTaskFile, JSON.stringify(currentTaskData, null, 2));

console.log(`[task-with-files] Task started: ${taskName}`);
console.log(`[task-with-files] Task directory: ${taskDir}`);
console.log(`[task-with-files] Updated current_task.json: ${currentTaskFile}`);

// Output task directory for use in commands
console.log(`TASK_DIR=${taskDir}`);
