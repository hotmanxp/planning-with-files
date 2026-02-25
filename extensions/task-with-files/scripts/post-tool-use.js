#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PostToolUse Hook
 * 
 * Currently a pass-through hook.
 */

const fs = require('fs');

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
    // Ignore parsing errors
  }

  // Allow all tool results silently
  outputJson({ decision: 'allow' });
}

main();
