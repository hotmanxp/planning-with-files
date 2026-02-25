#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SessionStart Hook - checks for ongoing tasks on session start.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_PATH = process.env.WORKSPACE_PATH || '';
const workingDirBase = WORKSPACE_PATH
  ? path.join(WORKSPACE_PATH, '.agent_working_dir')
  : path.join(process.cwd(), '.agent_working_dir');
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
    outputJson({ decision: 'allow' });
    return;
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

      const taskName = path.basename(currentTask).replace('task_', '').replace(/_/g, ' ');

      outputJson({
        decision: 'allow',
        systemMessage: `[oh-my-gemini] Previous task '${taskName}' completed! Current reset.`,
      });
    } else {
      // Task is incomplete, notify user
      const taskName = path.basename(currentTask).replace('task_', '').replace(/_/g, ' ');

      outputJson({
        decision: 'allow',
        systemMessage: `[oh-my-gemini] Found incomplete task: '${taskName}'

To continue: /omg:resume
Or start new: /omg:start [task]`,
      });
    }
  } catch (err) {
    outputJson({ decision: 'allow' });
  }
}

main();
