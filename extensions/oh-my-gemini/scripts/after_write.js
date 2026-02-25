#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AfterWriteFile Hook
 * 
 * Reminds user to update progress.md after modifying files.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_PATH = process.env.WORKSPACE_PATH || '';
const currentTaskFile = path.join(WORKSPACE_PATH, '.agent_working_dir', 'current_task.json');

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

  const currentTask = getCurrentTask();

  if (!currentTask) {
    outputJson({ decision: 'allow' });
    return;
  }

  const tool_input = input_data.tool_input || {};
  const file_path = tool_input.file_path || tool_input.file || '';

  let additional_context;

  if (file_path) {
    try {
      const relPath = path.relative(WORKSPACE_PATH, file_path);
      additional_context = `

---

**[oh-my-gemini] File Modified: ${relPath}**

Update **progress.md** with what was accomplished.
`;
    } catch (err) {
      additional_context = `

---

**[oh-my-gemini] File Modified**

Update **progress.md** with what was accomplished.
`;
    }
  } else {
    additional_context = `

---

**[oh-my-gemini] File Modified**

Update **progress.md** with what was accomplished.
`;
  }

  outputJson({
    decision: 'allow',
    hookSpecificOutput: { additionalContext: additional_context },
  });
}

main();
