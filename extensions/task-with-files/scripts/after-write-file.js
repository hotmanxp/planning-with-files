#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AfterTool Hook: write_file 专用
 *
 * 在文件写入后，提醒 agent 如果进度有更新，记得更新 task_plan.md 和 progress.md
 * 仅在有进行中的任务时输出
 *
 * 通信方式：
 * - stdout: JSON 格式输出 (decision, context)
 * - stderr: 调试日志
 *
 * Note: Always exits with code 0
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const workspacePath = process.env.WORKSPACE_PATH || process.cwd();
const workingDirBase = join(process.cwd(), '.agent_working_dir');

const clean = (str) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanWorkspacePath = clean(workspacePath);

// Get current task directory
const currentTaskFile = join(workingDirBase, 'current_task.json');

/**
 * 输出 JSON 到 stdout（必须保持纯净）
 */
function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * 调试日志输出到 stderr
 */
function logDebug(message) {
  console.error(`[after-write-file] ${message}`);
}

// 如果没有进行中的任务，输出 allow 并退出
if (!existsSync(currentTaskFile)) {
  logDebug('No current_task.json, skipping');
  output({ decision: 'allow' });
  process.exit(0);
}

try {
  const currentTaskData = JSON.parse(readFileSync(currentTaskFile, 'utf-8'));

  // 如果没有当前任务，输出 allow 并退出
  if (!currentTaskData.current) {
    logDebug('No active task, skipping');
    output({ decision: 'allow' });
    process.exit(0);
  }

  const taskDir = currentTaskData.current;
  const planFile = join(taskDir, 'task_plan.md');
  const progressFile = join(taskDir, 'progress.md');
  const findingsFile = join(taskDir, 'findings.md');

  const planRelativePath = planFile.replace(cleanWorkspacePath + '/', '');
  const progressRelativePath = progressFile.replace(cleanWorkspacePath + '/', '');
  const findingsRelativePath = findingsFile.replace(cleanWorkspacePath + '/', '');

  // 通过 context 添加提示
  const context = `
📝 文件已写入

✅ 如果此次写入代表某个任务步骤完成，请更新：

1. **task_plan.md** - 标记对应步骤为 completed
   📄 ${planRelativePath}

2. **progress.md** - 记录本次进展
   📄 ${progressRelativePath}

3. **findings.md** - 如果有新发现的知识
   📄 ${findingsRelativePath}

📌 记住：完成一个任务步骤后，立即更新文档，不要累积到最后。
`.trim();

  output({
    decision: 'allow',
    context: context
  });

} catch (err) {
  logDebug(`Error: ${err.message}`);
  output({ decision: 'allow' });
}

process.exit(0);
