#!/usr/bin/env node
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const workingDirBase = join(process.cwd(), '.agent_working_dir');
const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanWorkingDir = clean(workingDirBase);

try {
  console.log('[oh-my-gemini] Listing all tasks...\n');

  if (!existsSync(cleanWorkingDir)) {
    console.log('[oh-my-gemini] No tasks found (working directory does not exist)');
    console.log('[oh-my-gemini] Use /omg:start [task-name] to create your first task');
    process.exit(0);
  }

  const currentTaskFile = join(cleanWorkingDir, 'current_task.json');
  let currentTaskDir = null;

  if (existsSync(currentTaskFile)) {
    try {
      const currentTaskData = JSON.parse(readFileSync(currentTaskFile, 'utf-8'));
      currentTaskDir = currentTaskData.current;
    } catch (err) {
    }
  }

  const entries = readdirSync(cleanWorkingDir, { withFileTypes: true });
  const taskDirs = entries
    .filter(entry => entry.isDirectory() && entry.name.startsWith('task_'))
    .map(entry => {
      const taskDir = join(cleanWorkingDir, entry.name);
      const stat = statSync(taskDir);
      return {
        name: entry.name,
        path: taskDir,
        modified: stat.mtime,
        isCurrent: currentTaskDir && taskDir === currentTaskDir
      };
    })
    .sort((a, b) => b.modified - a.modified)
    .slice(0, 5);

  if (taskDirs.length === 0) {
    console.log('[oh-my-gemini] No tasks found');
    console.log('[oh-my-gemini] Use /omg:start [task-name] to create your first task');
    process.exit(0);
  }

  console.log(`Found ${taskDirs.length} task(s):\n`);

  for (const task of taskDirs) {
    const status = task.isCurrent ? '* ACTIVE' : '  ';
    const date = task.modified.toISOString().split('T')[0];

    const match = task.name.match(/task_(.+)_(\d{4}-\d{2}-\d{2})/);
    const taskName = match ? match[1].replace(/_/g, ' ') : task.name;

    const planFile = join(task.path, 'task_plan.md');
    let goal = 'No goal set';
    if (existsSync(planFile)) {
      try {
        const planContent = readFileSync(planFile, 'utf-8');
        const lines = planContent.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i] === '## Goal' && i + 1 < lines.length) {
            goal = lines[i + 1].trim();
            if (goal.length > 60) {
              goal = goal.substring(0, 60) + '...';
            }
            break;
          }
        }
      } catch (err) {
      }
    }

    console.log(`${status} ${taskName}`);
    console.log(`   Date: ${date}`);
    console.log(`   Goal: ${goal}`);
    console.log(`   Path: ${task.path}`);
    console.log('');
  }

  console.log('[oh-my-gemini] Use /omg:resume to resume the active task');
  console.log('[oh-my-gemini] Use /omg:start [new-task] to create a new task');

} catch (err) {
  console.error(`[oh-my-gemini] Error: ${err.message}`);
  process.exit(1);
}
