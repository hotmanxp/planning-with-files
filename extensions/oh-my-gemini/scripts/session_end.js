#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SessionEnd Hook
 * 
 * Checks task completion status on session end.
 * - If task is complete, reset current task
 * - If task is incomplete, notify user (silently - user is exiting)
 * 
 * Note: Always exits with code 0 to avoid blocking session end
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_PATH = process.env.WORKSPACE_PATH || '';
const workingDirBase = path.join(WORKSPACE_PATH, '.agent_working_dir');
const currentTaskFile = path.join(workingDirBase, 'current_task.json');

/**
 * Check if all phases in task_plan.md are complete
 * @param {string} taskPath - Path to task directory
 * @returns {boolean} - True if all phases are complete
 */
function checkTaskCompleted(taskPath) {
  const taskPlanFile = path.join(taskPath, 'task_plan.md');
  
  if (!fs.existsSync(taskPlanFile)) {
    return false;
  }

  try {
    const content = fs.readFileSync(taskPlanFile, 'utf-8');
    const statusPattern = /-\s*\*\*Status:\*\*\s*(\w+)/g;
    const statuses = [];
    let match;
    
    while ((match = statusPattern.exec(content)) !== null) {
      statuses.push(match[1]);
    }

    if (statuses.length === 0) {
      return false;
    }

    return statuses.every(s => s === 'complete');
  } catch (err) {
    return false;
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
    // Ignore parsing errors
  }

  if (!fs.existsSync(currentTaskFile)) {
    outputJson({ decision: 'allow' });
    return;
  }

  try {
    const currentTaskData = JSON.parse(fs.readFileSync(currentTaskFile, 'utf-8'));
    const currentTask = currentTaskData.current;

    if (!currentTask) {
      outputJson({ decision: 'allow' });
      return;
    }

    if (checkTaskCompleted(currentTask)) {
      // Task is complete, reset
      currentTaskData.current = null;
      fs.writeFileSync(currentTaskFile, JSON.stringify(currentTaskData, null, 2));
    }
    // Task is incomplete - do nothing, user is exiting
  } catch (err) {
    // Non-fatal error
  }

  outputJson({ decision: 'allow' });
}

main();
