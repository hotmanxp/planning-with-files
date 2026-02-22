#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const workingDirBase = join(process.cwd(), '.agent_working_dir');
const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanWorkingDir = clean(workingDirBase);
const currentTaskFile = join(cleanWorkingDir, 'current_task.json');

try {
  if (!existsSync(currentTaskFile)) {
    console.log(`[oh-my-gemini] No current_task.json found. No task to resume.`);
    console.log(`TASK_RESUMED=false`);
    process.exit(0);
  }

  let currentTaskData = { current: null };
  try {
    currentTaskData = JSON.parse(readFileSync(currentTaskFile, 'utf-8'));
  } catch (parseErr) {
    console.log(`[oh-my-gemini] current_task.json is invalid: ${parseErr.message}`);
    console.log(`TASK_RESUMED=false`);
    process.exit(0);
  }

  if (!currentTaskData.current) {
    console.log(`[oh-my-gemini] No active task in current_task.json`);
    console.log(`TASK_RESUMED=false`);
    process.exit(0);
  }

  const taskDir = currentTaskData.current;

  if (!existsSync(taskDir)) {
    console.log(`[oh-my-gemini] Task directory no longer exists: ${taskDir}`);
    console.log(`TASK_RESUMED=false`);
    process.exit(0);
  }

  const planFile = join(taskDir, 'task_plan.md');
  const findingsFile = join(taskDir, 'findings.md');
  const progressFile = join(taskDir, 'progress.md');

  console.log(`[oh-my-gemini] Resuming task: ${taskDir}`);

  let filesFound = 0;
  if (existsSync(planFile)) {
    console.log(`[oh-my-gemini] Found: task_plan.md`);
    filesFound++;
  } else {
    console.log(`[oh-my-gemini] Warning: No task_plan.md found`);
  }

  if (existsSync(findingsFile)) {
    console.log(`[oh-my-gemini] Found: findings.md`);
    filesFound++;
  }

  if (existsSync(progressFile)) {
    console.log(`[oh-my-gemini] Found: progress.md`);
    filesFound++;
  }

  if (existsSync(planFile)) {
    const planContent = readFileSync(planFile, 'utf-8');
    const lines = planContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '## Goal' && i + 1 < lines.length) {
        const goal = lines[i + 1].trim();
        console.log(`\n[oh-my-gemini] Goal: ${goal}`);
        break;
      }
    }

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '## Current Phase' && i + 1 < lines.length) {
        const phase = lines[i + 1].trim();
        console.log(`[oh-my-gemini] Current: ${phase}`);
        break;
      }
    }
  }

  console.log(`\n[oh-my-gemini] Ready to resume (${filesFound}/3 planning files)`);
  console.log(`TASK_RESUMED=true`);
  console.log(`TASK_DIR=${taskDir}`);

} catch (err) {
  console.error(`[oh-my-gemini] Error: ${err.message}`);
  process.exit(1);
}
