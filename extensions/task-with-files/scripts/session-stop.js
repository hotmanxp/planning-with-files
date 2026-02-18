/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Stop hook - Verify completion and reset current_task.json when task is complete
const workingDirBase = process.env.WORKING_DIR_BASE || `${process.cwd()}/.agent_working_dir`;
const workspacePath = process.env.WORKSPACE_PATH || process.cwd();

const fs = require("fs");
const path = require("path");

const currentTaskFile = path.join(workingDirBase, "current_task.json");

// Generate task directory: ${projectDir}/.agent_working_dir/task_{$taskName}_${date}/
function getTaskDir(taskName = "default") {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const safeTaskName = taskName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const taskDirName = `task_${safeTaskName}_${dateStr}`;
  return path.join(workingDirBase, taskDirName);
}

const taskDir = getTaskDir(process.env.CURRENT_TASK_NAME || "default");
const planFile = path.join(taskDir, "task_plan.md");

console.log(`[task-with-files] Stop hook triggered`);
console.log(`[task-with-files] Task directory: ${taskDir}`);

// Read current_task.json to verify current task
let currentTaskData = { current: null };
if (fs.existsSync(currentTaskFile)) {
  try {
    currentTaskData = JSON.parse(fs.readFileSync(currentTaskFile, "utf-8"));
    console.log(`[task-with-files] Current task from file: ${currentTaskData.current || "none"}`);
  } catch (e) {
    console.log(`[task-with-files] current_task.json is invalid`);
    currentTaskData = { current: null };
  }
}

let allCompleted = false;

if (fs.existsSync(planFile)) {
  const content = fs.readFileSync(planFile, "utf-8");
  const unchecked = content.match(/^- \\[ \\]/g);
  const checked = content.match(/^- \\[x\\]/gi);
  
  console.log(`[task-with-files] Plan status:`);
  console.log(`[task-with-files]   Completed: ${checked ? checked.length : 0}`);
  console.log(`[task-with-files]   Pending: ${unchecked ? unchecked.length : 0}`);
  
  if (unchecked && unchecked.length > 0) {
    console.log(`[task-with-files] Warning: ${unchecked.length} items still pending`);
    allCompleted = false;
  } else if (checked && checked.length > 0) {
    console.log(`[task-with-files] All items completed!`);
    allCompleted = true;
  } else {
    console.log(`[task-with-files] No tasks in plan yet`);
    allCompleted = false;
  }
} else {
  console.log(`[task-with-files] No plan file found at ${planFile}`);
  allCompleted = false;
}

// If all tasks are completed, reset current_task.json
if (allCompleted) {
  console.log(`[task-with-files] Task completed! Resetting current_task.json...`);
  fs.writeFileSync(currentTaskFile, JSON.stringify({ current: null }, null, 2));
  console.log(`[task-with-files] current_task.json reset (no active task)`);
} else {
  console.log(`[task-with-files] Task still in progress, keeping current_task.json`);
}
