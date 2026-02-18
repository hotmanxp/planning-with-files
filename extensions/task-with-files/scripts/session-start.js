/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// SessionStart hook - Initialize session
// Note: Does NOT automatically resume tasks. User must run /planning:resume to resume.
const workingDirBase = process.env.WORKING_DIR_BASE || `${process.cwd()}/.agent_working_dir`;
const workspacePath = process.env.WORKSPACE_PATH || process.cwd();

const fs = require("fs");
const path = require("path");

const currentTaskFile = path.join(workingDirBase, "current_task.json");

// Ensure working directory base exists
if (!fs.existsSync(workingDirBase)) {
  fs.mkdirSync(workingDirBase, { recursive: true });
  console.log(`[task-with-files] Created working directory: ${workingDirBase}`);
}

// Read current_task.json to show current task (if any)
let currentTaskData = { current: null };
if (fs.existsSync(currentTaskFile)) {
  try {
    currentTaskData = JSON.parse(fs.readFileSync(currentTaskFile, "utf-8"));
    if (currentTaskData.current) {
      console.log(`[task-with-files] SessionStart: Previous task available for resume: ${currentTaskData.current}`);
      console.log(`[task-with-files] SessionStart: Run /planning:resume to continue`);
    } else {
      console.log(`[task-with-files] SessionStart: No active task (current_task.json is empty)`);
    }
  } catch (e) {
    console.log(`[task-with-files] SessionStart: current_task.json is invalid`);
  }
} else {
  console.log(`[task-with-files] SessionStart: No current_task.json found (new session)`);
}

console.log(`[task-with-files] Workspace: ${workspacePath}`);
