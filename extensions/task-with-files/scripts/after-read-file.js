#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AfterTool Hook: read_file 专用
 *
 * 在读取文件后，通过 context 提示 LLM 如果有用知识则更新 findings.md
 * 仅在有进行中的任务时输出
 *
 * 通信方式：
 * - stdout: JSON 格式输出 (decision, context)
 * - stderr: 调试日志
 *
 * Note: Always exits with code 0
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

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
  console.error(`[after-read-file] ${message}`);
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
  const findingsFile = join(taskDir, 'findings.md');
  const findingsRelativePath = findingsFile.replace(cleanWorkspacePath + '/', '');

  // 通过 context 添加提示
  const context = `
📄 文件已读取

💡 如果获得了以下类型的信息，请更新 findings.md:
- 项目架构或目录结构
- 关键配置或依赖关系
- 重要的代码逻辑或算法
- 用户偏好或项目规范
- 技术决策或设计模式

📝 findings.md: ${findingsRelativePath}
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
