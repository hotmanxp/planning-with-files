#!/usr/bin/env node
// 最简单的测试脚本 - 只输出 JSON 到 stdout，日志到 stderr
console.error('[task-with-files] SessionStart hook executing...');
console.log(JSON.stringify({ decision: 'allow' }));
process.exit(0);
