# GitHub Copilot Hooks 实现分析

> 生成日期: 2026-02-25  
> 来源: `.github/hooks/scripts/` 脚本分析

---

## 一、概述

GitHub Copilot Hooks 是 planning-with-files 项目的 Copilot 集成实现。通过 4 个 hooks 在 Copilot Agent 模式下实现 Manus 风格的规划工作流：

| Hook | 触发时机 | 功能 |
|------|---------|------|
| `sessionStart` | 会话开始 | 恢复会话 / 注入 SKILL.md |
| `preToolUse` | 工具执行前 | 注入任务计划上下文 |
| `postToolUse` | 工具执行后 | 提醒更新任务状态 |
| `agentStop` | Agent 停止前 | 检查任务完成状态 |

---

## 二、配置文件

**文件**: `.github/hooks/planning-with-files.json`

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "...", "powershell": "...", "timeout": 15 }],
    "preToolUse": [{ "type": "command", "bash": "...", "powershell": "...", "timeout": 5 }],
    "postToolUse": [{ "type": "command", "bash": "...", "powershell": "...", "timeout": 5 }],
    "agentStop": [{ "type": "command", "bash": "...", "powershell": "...", "timeout": 10 }]
  }
}
```

---

## 三、各 Hook 详细分析

### 3.1 SessionStart Hook

**脚本**: `session-start.sh` / `session-start.ps1`

**功能逻辑**:

```
┌────────────────────────────────────────┐
│          session-start.sh 流程          │
└────────────────────────────────────────┘

            检查 task_plan.md 是否存在
                    │
         ┌──────────┴──────────┐
         │                     │
        是                    否
         │                     │
         ▼                     ▼
  ┌──────────────┐      ┌──────────────────┐
  │ 尝试运行     │      │ 读取 SKILL.md   │
  │session-catchup│      │ 注入规划工作流   │
  │  .py         │      │                  │
  └──────────────┘      └──────────────────┘
         │
         ▼ (无输出时)
  ┌──────────────┐
  │ 读取 plan   │
  │ 前 5 行      │
  └──────────────┘
```

**核心代码**:

```bash
# 存在计划文件
if [ -f "$PLAN_FILE" ]; then
    CATCHUP=$($PYTHON "$SKILL_DIR/scripts/session-catchup.py" "$(pwd)" 2>/dev/null)
    if [ -n "$CATCHUP" ]; then
        CONTEXT="$CATCHUP"
    else
        CONTEXT=$(head -5 "$PLAN_FILE")
    fi
# 不存在计划文件
else
    CONTEXT=$(cat "$SKILL_DIR/SKILL.md")
fi
```

---

### 3.2 PreToolUse Hook

**脚本**: `pre-tool-use.sh` / `pre-tool-use.ps1`

**功能**: 每次工具执行前，将 `task_plan.md` 前 30 行注入上下文

**核心代码**:

```bash
# 读取 task_plan.md 前 30 行
CONTEXT=$(head -30 "$PLAN_FILE")

# 输出 JSON，允许工具执行
echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"allow\",\"additionalContext\":$ESCAPED}}"
```

**特点**:
- **始终允许工具执行** (`permissionDecision: "allow"`)
- 只读取前 30 行，避免上下文溢出

---

### 3.3 PostToolUse Hook

**脚本**: `post-tool-use.sh` / `post-tool-use.ps1`

**功能**: 工具执行后提醒更新任务状态

**核心代码**:

```bash
echo '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"[planning-with-files] File updated. If this completes a phase, update task_plan.md status."}}'
```

---

### 3.4 AgentStop Hook (重点)

**脚本**: `agent-stop.sh` / `agent-stop.ps1`

**功能**: Agent 停止前检查所有阶段是否完成，未完成则阻止停止并提示继续。

#### 3.4.1 流程图

```
                         开始
                          │
                          ▼
              ┌───────────────────────┐
              │ 检查 task_plan.md      │
              │ 是否存在?               │
              └───────────────────────┘
                    │           │
                   否           是
                    │           │
                    ▼           ▼
              ┌─────────┐   ┌───────────────────────┐
              │  返回 {} │   │ 统计 "### Phase"     │
              │  退出 0  │   │ 数量 = TOTAL         │
              └─────────┘   └───────────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │  尝试匹配格式1: **Status:** complete │
                    │           **Status:** in_progress    │
                    │           **Status:** pending         │
                    └─────────────────────────────────────┘
                                       │
                              ┌────────┴────────┐
                              │ 格式1 有匹配?   │
                              └────────────────┘
                                   │   │
                                  否   是
                                   │   │
                                   ▼   ▼
                    ┌──────────────────┐  ┌────────────┐
                    │ 尝试匹配格式2:    │  │  使用格式1  │
                    │ [complete]        │  │  的计数结果  │
                    │ [in_progress]    │  └────────────┘
                    │ [pending]         │
                    └──────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │  判断: COMPLETE == TOTAL 且 TOTAL > 0 │
                    └─────────────────────────────────────┘
                                   │   │
                                  是   否
                                   │   │
                                   ▼   ▼
                         ┌─────────────┐  ┌────────────────────────┐
                         │  返回 {}    │  │ 输出 JSON:             │
                         │  退出 0     │  │ AgentStop + 消息       │
                         │  (任务完成)  │  │ "$COMPLETE/$TOTAL..." │
                         └─────────────┘  └────────────────────────┘
```

#### 3.4.2 核心实现代码

```bash
# 1. 统计总阶段数
TOTAL=$(grep -c "### Phase" "$PLAN_FILE")

# 2. 尝试匹配格式1: **Status:** 标记
COMPLETE=$(grep -cF "**Status:** complete" "$PLAN_FILE")
IN_PROGRESS=$(grep -cF "**Status:** in_progress" "$PLAN_FILE")
PENDING=$(grep -cF "**Status:** pending" "$PLAN_FILE")

# 3. Fallback: 匹配格式2 [inline] 标记
if [ "$COMPLETE" -eq 0 ] && [ "$IN_PROGRESS" -eq 0 ] && [ "$PENDING" -eq 0 ]; then
    COMPLETE=$(grep -c "\[complete\]" "$PLAN_FILE")
    IN_PROGRESS=$(grep -c "\[in_progress\]" "$PLAN_FILE")
    PENDING=$(grep -c "\[pending\]" "$PLAN_FILE")
fi

# 4. 判断完成状态
if [ "$COMPLETE" -eq "$TOTAL" ] && [ "$TOTAL" -gt 0 ]; then
    echo '{}'      # 任务完成，正常停止
    exit 0
fi

# 5. 任务未完成，阻止停止
MSG="[planning-with-files] Task incomplete ($COMPLETE/$TOTAL phases done). Read task_plan.md and continue working on the remaining phases."
echo "{\"hookSpecificOutput\":{\"hookEventName\":\"AgentStop\",\"additionalContext\":\"$MSG\"}}"
exit 0
```

#### 3.4.3 支持的状态格式

**格式1 (新版)**: `**Status:**` 标记

```markdown
### Phase 1: 实现登录
**Status:** complete

### Phase 2: 实现注册
**Status:** in_progress

### Phase 3: 完善文档
**Status:** pending
```

**格式2 (旧版)**: `[inline]` 标记

```markdown
### Phase 1: 实现登录
- [ ] 任务1 [complete]

### Phase 2: 实现注册
- [x] 任务2 [in_progress]

### Phase 3: 完善文档
- [ ] 任务3 [pending]
```

#### 3.4.4 Copilot 行为响应

| Hook 输出 | Copilot 行为 |
|----------|-------------|
| `{}` | 正常停止 |
| `{"hookSpecificOutput":{...}}` | 继续执行剩余阶段 |

---

## 四、脚本文件列表

| 脚本 | 平台 | 功能 |
|------|------|------|
| `session-start.sh` | Bash | 会话开始 hook |
| `session-start.ps1` | PowerShell | 会话开始 hook |
| `pre-tool-use.sh` | Bash | 工具执行前 hook |
| `pre-tool-use.ps1` | PowerShell | 工具执行前 hook |
| `post-tool-use.sh` | Bash | 工具执行后 hook |
| `post-tool-use.ps1` | PowerShell | 工具执行后 hook |
| `agent-stop.sh` | Bash | Agent 停止前 hook |
| `agent-stop.ps1` | PowerShell | Agent 停止前 hook |

---

## 五、与 OpenCode/Sisyphus 集成对比

| 特性 | GitHub Copilot Hooks | Sisyphus Hooks |
|------|---------------------|----------------|
| 实现语言 | Bash + PowerShell | JavaScript/Python |
| 配置格式 | `hooks.json` | `hooks.json` |
| 状态检测 | grep 文本匹配 | 文件读取 + 正则 |
| 阶段标记 | `### Phase` + Status | 相似格式 |
| 会话恢复 | session-catchup.py | session_end.js |

---

## 六、扩展建议

1. **状态格式统一**: 建议统一使用 `**Status:**` 格式，避免 fallback 逻辑
2. **正则表达式优化**: 当前使用 `grep -c`，可考虑使用 `grep -oP` 精确匹配
3. **多语言支持**: 可添加对其他语言状态标记的支持
4. **详细统计**: 可增加统计每个阶段的详细完成情况
