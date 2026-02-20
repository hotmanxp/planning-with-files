# task-with-files 使用指南

## 快速开始

### 1. 开始新任务

```bash
/planning:start [任务名称]
```

示例：
```bash
/planning:start build-api
```

这将：
- 创建任务目录 `.agent_working_dir/task_build-api_2026-02-19/`
- 复制 3 个模板文件
- 设置当前活动任务

### 2. 查看任务列表

```bash
/planning:list
```

显示所有任务及其状态。

### 3. 恢复任务

```bash
/planning:resume
```

加载最近的任务并恢复上下文。

### 4. 查看状态

```bash
/planning:status
```

显示当前进度。

### 5. 完成任务

```bash
/planning:complete
```

验证完成并生成总结。

## 工作流程

### 标准工作流

1. **开始任务** → `/planning:start my-task`
2. **编辑 task_plan.md** → 设置目标和阶段
3. **执行工作** → 按照计划逐步完成
4. **更新文件** → 标记完成的任务
5. **完成任务** → `/planning:complete`

### 中途中断后恢复

1. **恢复任务** → `/planning:resume`
2. **查看状态** → `/planning:status`
3. **继续阅读** → 查看 progress.md 了解上次进度
4. **继续工作** → 从未完成的地方继续

## 核心原则

### 1. 先规划后执行

在写代码之前：
- 明确目标（一句话）
- 分解阶段（3-7 个）
- 识别风险
- 记录决策

### 2. 2-Action Rule

每进行 2 次 view/read 操作后：
- 更新 `findings.md`
- 记录发现
- 保存决策

### 3. 5-Question Reboot Check

中断后恢复前，确认能回答：
1. 我在哪？ → 当前阶段
2. 要去哪？ → 剩余阶段
3. 目标是什么？ → 目标陈述
4. 学到了什么？ → findings.md
5. 做了什么？ → progress.md

## 文件说明

### task_plan.md
- **用途**：路线图和工作记忆
- **更新时机**：完成每个阶段后
- **关键部分**：目标、阶段、决策、错误

### findings.md
- **用途**：知识库
- **更新时机**：每 2 次查看操作后（2-Action Rule）
- **关键部分**：研究发现、技术决策

### progress.md
- **用途**：会话日志
- **更新时机**：完成阶段或遇到错误时
- **关键部分**：操作记录、测试结果、错误日志

## 最佳实践

### ✅ 应该做的

1. **创建 task_plan.md FIRST** - 在任何工作之前
2. **问澄清问题** - 在规划之前
3. **提供多个方案** - 2-3 个方案及优缺点
4. **更新文件** - 每个阶段后
5. **记录错误** - 立即记录
6. **重读规划** - 重大决策前

### ❌ 不应该做的

1. **无规划就编码** - 会导致返工
2. **让发现消失** - 写入 findings.md
3. **重复失败** - 3 次失败后改变方法
4. **忘记更新状态** - 保持文件最新
5. **跳过文档** - 为了"省时间"不值得

## 故障排除

### 问题：找不到任务

**解决**：
```bash
/planning:list
```
检查任务是否存在。

### 问题：文件未创建

**解决**：
手动复制模板：
```bash
cp templates/task_plan.md .agent_working_dir/task_*/*/
```

### 问题：Hook 不工作

**解决**：
检查 hooks/hooks.json 配置
确保 Node.js 可用

## 快捷键参考

| 命令 | 作用 |
|------|------|
| `/planning:start [name]` | 开始新任务 |
| `/planning:resume` | 恢复任务 |
| `/planning:status` | 查看状态 |
| `/planning:list` | 列出任务 |
| `/planning:complete` | 完成任务 |

## 示例会话

### 示例 1: 创建 API

```bash
# 开始任务
/planning:start create-api

# 编辑 task_plan.md 设置目标
# 目标：创建用户认证 API

# 工作...
# 完成 Phase 1
# 更新 task_plan.md

# 查看状态
/planning:status

# 继续工作...

# 完成
/planning:complete
```

### 示例 2: 修复 Bug

```bash
# 开始任务
/planning:start fix-login-bug

# 记录问题
# 编辑 findings.md

# 调查...
# 更新 findings.md (2-Action Rule)

# 修复...
# 更新 progress.md

# 验证
# 完成任务
```

## 进阶技巧

### 1. 多任务管理

使用 `/planning:list` 查看所有任务，但一次只专注一个活动任务。

### 2. 模板自定义

复制并修改 `templates/` 目录中的模板以适应你的工作流。

### 3. 错误日志

在 task_plan.md 中详细记录错误，避免重复同样的问题。

### 4. 决策追踪

在"Decisions Made"表中记录所有技术决策及其原因。

## 支持

遇到问题？
1. 查看 README.md
2. 查看 OPTIMIZATION_SUMMARY.md
3. 检查 hooks/hooks.json 配置
4. 确保 Node.js >= 18.0.0

---

**基于 Manus AI Pattern** - 上下文工程的革命性方法
