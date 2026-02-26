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

const WORKSPACE_PATH = process.env.WORKSPACE_PATH || process.env.workspace_path || process.cwd();
const workingDirBase = path.join(WORKSPACE_PATH, '.agent_working_dir');
const currentTaskFile = path.join(workingDirBase, 'current_task.json');

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
  // Read stdin (required for hook protocol)
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

  const toolInput = input_data.tool_input || {};
  const filePath = toolInput.file_path || '';

  let additionalContext;

  if (filePath) {
    try {
      const relPath = path.relative(WORKSPACE_PATH, filePath);
      additionalContext = `

---

**[task-with-files] File Modified: ${relPath}**

You just modified this file. Consider updating **progress.md** with what was accomplished.

Example format for progress.md:
\`\`\`
## ${relPath}

- [x] Description of change made
\`\`\`
**Current Task Folder:** \`${currentTask}\`
`;
    } catch (err) {
      additionalContext = `

---

**[task-with-files] You just modified a file.**

Consider updating **progress.md** with what was accomplished.
**Current Task Folder:** \`${currentTask}\`
`;
    }
  } else {
    additionalContext = `

---

**[task-with-files] You just modified a file.**

Consider updating **progress.md** with what was accomplished.
**Current Task Folder:** \`${currentTask}\`
`;
  }

  outputJson({
    decision: 'allow',
    hookSpecificOutput: { additionalContext },
  });
}

main();
