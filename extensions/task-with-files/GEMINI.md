# task-with-files Extension

基于 **Manus AI Pattern** 的复杂任务规划扩展。

## 核心命令

| 命令 | 说明 |
|------|------|
| `/planning:start [task]` | 开始新的规划任务 |
| `/planning:resume` | 恢复之前的任务 |
| `/planning:status` | 显示当前进度 |
| `/planning:list` | 列出所有任务 |
| `/planning:complete` | 验证并完成任务 |

## 快速开始

### 1. 开始任务

```bash
/planning:start [任务名称]
```

自动创建：
- 任务目录：`.agent_working_dir/task_[任务名]_YYYY-MM-DD/`
- 三个规划文件：`task_plan.md`、`findings.md`、`progress.md`
- 设置当前活动任务

### 2. 恢复任务

```bash
/planning:resume
```

加载之前的任务和上下文。

### 3. 查看状态

```bash
/planning:status
```

一目了然地查看进度。

### 4. 列出所有任务

```bash
/planning:list
```

显示所有任务的目标和状态。

### 5. 完成任务

```bash
/planning:complete
```

验证完成并生成总结报告。

## 工作原理

使用 **3-File Pattern** 将上下文持久化到磁盘：
- `task_plan.md` - 任务路线图（工作记忆）
- `findings.md` - 研究和发现（知识库）
- `progress.md` - 会话日志（进度记录）

详情参考技能文档：`skills/planning-with-files/SKILL.md`

## 目录结构

```
.agent_working_dir/
├── current_task.json          # 当前任务追踪
└── task_{$taskName}_${date}/  # 任务工作目录
    ├── task_plan.md           # 路线图
    ├── findings.md            # 知识库
    └── progress.md            # 会话日志
```

## 核心原则

### 1. 先规划，后执行

> "磨刀不误砍柴工"

花在规划上的时间能节省 10 倍的调试和返工时间。

### 2. 文件系统即内存

写入文件，而不是上下文窗口。上下文有限，文件是持久的。

### 3. 2-Action Rule

每进行 2 次 view/read/search 操作后，**必须更新 `findings.md`**。

### 4. 注意力管理

在做重大决策前重新阅读 `task_plan.md`，保持对目标的专注。

### 5. 错误持久化

记录所有错误。不要重复同样的失败超过 3 次。

### 6. 规划是动态的

学到新信息时更新规划。目标是成功，不是僵化执行。

## Hooks

扩展在以下时机触发脚本：
- **SessionStart** - 检查之前的任务
- **BeforeTool** - 重新阅读规划以获取上下文
- **AfterTool** - 提醒 2-Action Rule
- **SessionEnd** - 验证任务完成状态

## 5-Question Reboot Check

中断后恢复前，验证能否回答：

1. **我在哪？** → `task_plan.md` 中的当前阶段
2. **我要去哪？** → 剩余阶段
3. **目标是什么？** → 目标陈述
4. **我学到了什么？** → 见 `findings.md`
5. **我做了什么？** → 见 `progress.md`

能回答所有 5 个问题，说明上下文完整。

## 最佳实践

### 应该 ✅
- 首先创建 `task_plan.md`
- 规划前问澄清问题
- 提供 2-3 个方案及其优缺点
- 每个阶段后更新文件
- 立即记录错误
- 重大决策前重读规划

### 不应该 ❌
- 没有规划就开始写代码
- 让发现消失在上下文中
- 重复失败的方法
- 忘记更新阶段状态
- 为了"省时间"跳过文档

---

**详细使用指南**: 激活 `planning-with-files` 技能或阅读 `skills/planning-with-files/SKILL.md`
