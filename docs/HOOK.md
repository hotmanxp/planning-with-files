# Gemini CLI Hooks 完整指南

## 📖 什么是 Hooks

**Hooks** 是 Gemini CLI 在代理循环（agentic loop）特定阶段执行的脚本或程序，允许您拦截和自定义行为，而无需修改 CLI 源代码。

### 核心特性

- Hooks **同步运行**：当钩子事件触发时，Gemini CLI 会等待所有匹配的 hooks 完成后再继续
- 通过 `stdin` 接收输入，通过 `stdout` 输出 JSON 进行通信
- 以用户权限执行任意代码

---

## 🎯 Hooks 用途

| 用途 | 说明 |
|------|------|
| **添加上下文** | 在处理请求前注入相关信息（如 git 历史） |
| **验证操作** | 审查工具参数并阻止潜在危险操作 |
| **执行政策** | 实现安全扫描器和合规性检查 |
| **记录交互** | 跟踪工具使用和模型响应以进行审计 |
| **优化行为** | 动态过滤可用工具或调整模型参数 |

---

## 🔔 Hook 事件类型

| 事件 | 触发时机 | 影响 | 常见用例 |
|------|----------|------|----------|
| `SessionStart` | 会话开始时（启动、恢复、清除） | 阻止回合/添加上下文 | 初始化资源、加载上下文 |
| `SessionEnd` | 会话结束时（退出、清除） | 建议性 | 清理、保存状态 |
| `BeforeAgent` | 用户提交提示后，规划前 | 阻止回合/添加上下文 | 添加上下文、验证提示、阻止回合 |
| `AfterAgent` | 代理循环结束时 | 重试/停止 | 审查输出、强制重试或停止 |
| `BeforeModel` | 发送请求到 LLM 前 | 阻止回合/模拟 | 修改提示、交换模型、模拟响应 |
| `AfterModel` | 接收 LLM 响应后 | 阻止回合/编辑 | 过滤/编辑响应、记录交互 |
| `BeforeToolSelection` | LLM 选择工具前 | 过滤工具 | 过滤可用工具、优化选择 |
| `BeforeTool` | 工具执行前 | 阻止工具/重写 | 验证参数、阻止危险操作 |
| `AfterTool` | 工具执行后 | 阻止结果/添加上下文 | 处理结果、运行测试、隐藏结果 |
| `PreCompress` | 上下文压缩前 | 建议性 | 保存状态、通知用户 |
| `Notification` | 系统通知发生时 | 建议性 | 转发到桌面提醒、记录 |

---

## ⚙️ 配置方法

### 配置层级（优先级从高到低）

1. **项目设置**: `.gemini/settings.json`（当前目录）
2. **用户设置**: `~/.gemini/settings.json`
3. **系统设置**: `/etc/gemini-cli/settings.json`
4. **扩展**: 已安装扩展定义的 hooks

### 配置 Schema

```json
{
  "hooks": {
    "BeforeTool": [
      {
        "matcher": "write_file|replace",
        "hooks": [
          {
            "name": "security-check",
            "type": "command",
            "command": "$GEMINI_PROJECT_DIR/.gemini/hooks/security.sh",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

### 配置字段说明

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | string | 是 | 执行引擎，目前仅支持 `"command"` |
| `command` | string | 是* | 要执行的 shell 命令（当 type 为 command 时必填） |
| `name` | string | 否 | 用于日志和 CLI 命令的友好名称 |
| `timeout` | number | 否 | 执行超时（毫秒），默认 60000 |
| `description` | string | 否 | 钩子目的的简要说明 |

### 匹配器（Matchers）

- **工具事件**（BeforeTool, AfterTool）: 使用**正则表达式**（如 `"write_.*"`）
- **生命周期事件**: 使用**精确字符串**（如 `"startup"`）
- **通配符**: `"*"` 或 `""`（空字符串）匹配所有情况

---

## 🌍 环境变量

Hooks 在净化的环境中执行，可用环境变量：

| 变量 | 说明 |
|------|------|
| `GEMINI_PROJECT_DIR` | 项目根目录的绝对路径 |
| `GEMINI_SESSION_ID` | 当前会话的唯一 ID |
| `GEMINI_CWD` | 当前工作目录 |
| `CLAUDE_PROJECT_DIR` | （别名）为兼容性提供 |

---

## 📝 示例代码

### 安全检查 Hook 示例

```bash
#!/bin/bash
# .gemini/hooks/security.sh

# 读取 stdin 中的输入
input=$(cat)

# 解析并检查危险操作
if echo "$input" | grep -q "rm -rf /"; then
    echo '{"decision": "deny", "reason": "禁止删除根目录"}' >&1
    exit 0
fi

# 允许操作
echo '{"decision": "allow"}' >&1
exit 0
```

### 添加上下文 Hook 示例

```bash
#!/bin/bash
# .gemini/hooks/git-context.sh

# 获取 git 分支信息
branch=$(git branch --show-current 2>/dev/null)

# 输出 JSON 到 stdout
cat <<EOF
{
  "context": "当前 git 分支：$branch",
  "decision": "allow"
}
EOF

exit 0
```

---

## ⚠️ 核心机制与规则

### JSON 通信的"黄金法则"

1. **静默是强制的**: 脚本不得在最终 JSON 对象之前向 `stdout` 打印任何纯文本
2. **污染 = 失败**: 如果 `stdout` 包含非 JSON 文本，解析将失败，CLI 将默认为"Allow"
3. **通过 stderr 调试**: 使用 `stderr` 进行所有日志记录和调试（如 `echo "debug" >&2`）

### 退出代码

| 退出码 | 标签 | 行为影响 |
|--------|------|----------|
| `0` | Success | stdout 被解析为 JSON，所有逻辑的首选代码（包括故意阻止） |
| `2` | System Block | 关键阻止，目标操作（工具、回合或停止）被中止，stderr 用作拒绝原因 |
| 其他 | Warning | 非致命失败，显示警告但交互继续使用原始参数进行 |

---

## 🔒 安全与风险

> ⚠️ **警告**: Hooks 以用户权限执行任意代码。通过配置 hooks，您允许脚本在您的机器上运行 shell 命令。

**项目级 hooks 尤其危险**，特别是在打开不受信任的项目时。Gemini CLI 会对项目 hooks 进行指纹识别，如果 hook 的名称或命令发生变化（如通过 git pull），它将被视为新的、不受信任的 hook，您会收到警告。

---

## 🛠️ 管理 Hooks

使用 CLI 命令管理 hooks，无需手动编辑 JSON：

| 命令 | 功能 |
|------|------|
| `/hooks` | 查看 hooks 面板 |
| `/hooks enable-all` | 启用所有 hooks |
| `/hooks disable-all` | 禁用所有 hooks |
| `/hooks enable <name>` | 启用单个 hook |
| `/hooks disable <name>` | 禁用单个 hook |

---

## ✅ 最佳实践

1. **始终通过 stderr 输出日志**，保持 stdout 纯净
2. **快速失败**，使用适当的退出代码
3. **设置合理的超时时间**，避免阻塞代理循环
4. **验证所有输入**，防止注入攻击
5. **使用命名 hooks** 便于日志追踪
6. **定期审查项目 hooks**，确保安全
7. **在受信任的环境中使用 hooks**，特别是项目级 hooks

---

## 📚 相关资源

- **Writing hooks guide**: 创建第一个 hook 的教程，包含综合示例
- **Best practices**: 关于安全、性能和调试的指南
- **Hooks reference**: I/O 模式和退出代码的技术规范

---

## 参考链接

- 官方文档：https://geminicli.com/docs/hooks/
