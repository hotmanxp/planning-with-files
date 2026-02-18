/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// PostToolUse hook - Remind to update status after file writes
const workingDirBase = process.env.WORKING_DIR_BASE || `${process.cwd()}/.agent_working_dir`;

const fs = require("fs");
const path = require("path");

const currentTaskFile = path.join(workingDirBase, "current_task.json");

// Read current_task.json to get current task directory
let taskDir = null;
if (fs.existsSync(currentTaskFile)) {
  try {
    const currentTaskData = JSON.parse(fs.readFileSync(currentTaskFile, "utf-8"));
    taskDir = currentTaskData.current;
  } catch (e) {
    console.log(`[task-with-files] PostToolUse: current_task.json is invalid`);
  }
}

if (taskDir) {
  console.log(`[task-with-files] PostToolUse: Active task: ${taskDir}`);
  console.log(`[task-with-files] Reminder: Update task_plan.md and progress.md after significant changes`);
} else {
  console.log(`[task-with-files] PostToolUse: No active task`);
}
