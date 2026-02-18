/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// PreToolUse hook - Re-read plan before major decisions
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
    if (taskDir) {
      console.log(`[task-with-files] PreToolUse: Active task: ${taskDir}`);
    }
  } catch (e) {
    console.log(`[task-with-files] PreToolUse: current_task.json is invalid`);
  }
}

if (taskDir) {
  const planFile = path.join(taskDir, "task_plan.md");
  console.log(`[task-with-files] PreToolUse: Checking for ${planFile}...`);
} else {
  console.log(`[task-with-files] PreToolUse: No active task`);
}
