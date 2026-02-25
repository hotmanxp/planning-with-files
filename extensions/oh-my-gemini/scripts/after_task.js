#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AfterTask Hook
 * 
 * Reminds user to verify subagent work before trusting.
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

  const tool_response = input_data.tool_response || {};
  const response_content = tool_response.content || [];

  let output_text = '';
  for (const item of response_content) {
    if (typeof item === 'object' && item.type === 'text') {
      output_text = item.text || '';
      break;
    }
  }

  const is_background =
    output_text.includes('Background task launched') ||
    output_text.includes('Background task continued');

  if (is_background) {
    outputJson({ decision: 'allow' });
    return;
  }

  const verification_reminder = `

---

**[oh-my-gemini] SUBAGENT COMPLETED - VERIFY BEFORE TRUSTING**

**PHASE 1: READ THE CODE**
1. `Bash("git diff --stat")` - see what changed
2. Read EVERY changed file - no exceptions
3. Check for: stubs, TODOs, logic errors, scope creep

**PHASE 2: RUN DIAGNOSTICS**
1. `lsp_diagnostics` on each changed file - zero errors
2. Run relevant tests

**PHASE 3: UPDATE PROGRESS**
- If verified complete: mark phase done in **progress.md**
- If issues found: note in progress, plan fix

**DO NOT proceed until verified.**
`;

  outputJson({
    decision: 'allow',
    hookSpecificOutput: { additionalContext: verification_reminder },
  });
}

main();
