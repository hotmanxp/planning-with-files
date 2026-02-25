#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PreToolUse Hook
 * 
 * Reminds orchestrator to delegate or update progress when modifying files.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_PATH = process.env.WORKSPACE_PATH || '';
const currentTaskFile = path.join(WORKSPACE_PATH, '.agent_working_dir', 'current_task.json');

const WRITE_TOOLS = ['write_file', 'edit_file'];

/**
 * Get current task directory
 * @returns {string|null} - Task directory path or null
 */
function getCurrentTask() {
  if (!WORKSPACE_PATH) {
    return null;
  }

  if (!fs.existsSync(currentTaskFile)) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(currentTaskFile, 'utf-8'));
    return data.current || null;
  } catch (err) {
    return null;
  }
}

/**
 * Check if path is in sisyphus directory
 * @param {string} filePath - File path to check
 * @returns {boolean} - True if in sisyphus directory
 */
function isSisyphusPath(filePath) {
  const sisyphusDirs = ['.sisyphus', '.agent_working_dir', '.gemini'];
  const pathParts = filePath.split(path.sep);
  for (const part of pathParts) {
    if (sisyphusDirs.includes(part)) {
      return true;
    }
  }
  return false;
}

/**
 * Output JSON to stdout
 * @param {object} data - Data to output
 */
function outputJson(data) {
  console.log(JSON.stringify(data));
}

function main() {
  // Read stdin
  let input_data = {};
  try {
    const stdin = fs.readFileSync(0, 'utf-8');
    input_data = JSON.parse(stdin);
  } catch (err) {
    outputJson({ decision: 'allow' });
    return;
  }

  const tool_name = input_data.tool_name || '';

  if (!WRITE_TOOLS.includes(tool_name)) {
    outputJson({ decision: 'allow' });
    return;
  }

  const currentTask = getCurrentTask();

  if (!currentTask) {
    outputJson({ decision: 'allow' });
    return;
  }

  const tool_input = input_data.tool_input || {};
  const file_path = tool_input.file_path || tool_input.file || '';

  if (file_path && !isSisyphusPath(file_path)) {
    const additional_context = `

---

**[oh-my-gemini] ORCHESTRATOR REMINDER**

You are about to directly modify a file outside planning directories.

As an ORCHESTRATOR:
- Consider DELEGATING to a subagent instead
- If you must modify directly, keep it minimal
- After modifying, update **progress.md** with what was done

**Delegation is preferred for substantial work.**
`;

    outputJson({
      decision: 'allow',
      hookSpecificOutput: { additionalContext: additional_context },
    });
  } else {
    outputJson({ decision: 'allow' });
  }
}

main();
