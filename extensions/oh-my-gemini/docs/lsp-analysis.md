# oh-my-opencode LSP 功能分析报告

> 生成日期: 2026-02-25  
> 来源: oh-my-opencode 插件源码分析

---

## 一、架构概览

oh-my-opencode 实现了**完整的独立 LSP 客户端栈**，提供 **6 个工具**。这是一个自定义实现，直接管理 LSP 服务器进程，**不依赖 OpenCode 内置的 LSP**。

### 架构层次

```
┌─────────────────────────────────────────────┐
│  6 LSP Tools                                │
│  lsp_goto_definition                        │
│  lsp_find_references                       │
│  lsp_symbols                               │
│  lsp_diagnostics                           │
│  lsp_prepare_rename                        │
│  lsp_rename                                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LspClientWrapper (lsp-client-wrapper.ts) │
│  • withLspClient() 入口                     │
│  • findWorkspaceRoot()                     │
│  • Server resolution + error formatting    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LSPServerManager (lsp-server.ts)          │
│  • 单例管理所有 LSP 客户端                   │
│  • 引用计数、5分钟空闲超时                  │
│  • 60s 初始化超时检测                       │
│  • 进程清理注册                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LSPClient (lsp-client.ts)                 │
│  • 文件追踪 (openedFiles Set)              │
│  • 文档版本控制                             │
│  • didOpen/didChange/didSave 通知          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LSPClientTransport (lsp-client-transport)│
│  • vscode-jsonrpc MessageConnection        │
│  • stdin/stdout 字节流                      │
│  • 诊断结果存储                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LSPProcess (lsp-process.ts)               │
│  • Bun spawn (Unix) / Node (Windows)       │
│  • 流桥接                                   │
└─────────────────────────────────────────────┘
```

---

## 二、6 个 LSP 工具

| 工具 | 文件 | 参数 | 功能 |
|------|------|------|------|
| `lsp_goto_definition` | goto-definition-tool.ts | filePath, line (1-based), character (0-based) | 跳转到符号定义 |
| `lsp_find_references` | find-references-tool.ts | filePath, line, character, includeDeclaration? | 查找所有引用（最多200条） |
| `lsp_symbols` | symbols-tool.ts | filePath, scope (document/workspace), query?, limit? | 文档大纲或工作区符号搜索 |
| `lsp_diagnostics` | diagnostics-tool.ts | filePath, severity? | 获取错误/警告/提示 |
| `lsp_prepare_rename` | rename-tools.ts | filePath, line, character | 验证重命名可行性 |
| `lsp_rename` | rename-tools.ts | filePath, line, character, newName | 应用跨文件重命名 |

---

## 三、服务器解析流程

```
file.ts → extension (.ts) 
  → EXT_TO_LANG (150+ 扩展名映射)
  → findServerForExtension()
    → 检查用户配置 (.opencode/oh-my-opencode.jsonc)
    → 回退到 server-definitions.ts (40+ 内置服务器)
  → isServerInstalled() 检查二进制是否存在
  → spawnProcess(command[])
```

### 内置服务器 (40+)

| 语言 | 服务器 | 安装命令 |
|------|--------|----------|
| TypeScript | typescript-language-server | `npm install -g typescript-language-server typescript` |
| Deno | deno | Install from https://deno.land |
| Vue | @vue/language-server | `npm install -g @vue/language-server` |
| ESLint | vscode-langservers-extracted | `npm install -g vscode-langservers-extracted` |
| Biome | @biomejs/biome | `npm install -g @biomejs/biome` |
| Go | gopls | `go install golang.org/x/tools/gopls@latest` |
| Python | pyright/basedpyright/ruff | `pip install pyright` |
| Rust | rust-analyzer | `rustup component add rust-analyzer` |
| C/C++ | clangd | See https://clangd.llvm.org/installation |
| Ruby | ruby-lsp | `gem install ruby-lsp` |
| PHP | intelephense | `npm install -g intelephense` |
| Java | jdtls | See https://github.com/eclipse-jdtls/eclipse.jdt.ls |
| Lua | lua-language-server | See https://github.com/LuaLS/lua-language-server |
| YAML | yaml-language-server | `npm install -g yaml-language-server` |
| Bash | bash-language-server | `npm install -g bash-language-server` |
| Dart | dart (included) | Included with Dart SDK |
| Terraform | terraform-ls | See https://github.com/hashicorp/terraform-ls |
| Prisma | prisma | `npm install -g prisma` |
| OCaml | ocaml-lsp | `opam install ocaml-lsp-server` |
| LaTeX | texlab | See https://github.com/latex-lsp/texlab |
| Haskell | haskell-language-server | `ghcup install hls` |
| Zig | zls | See https://github.com/zigtools/zls |
| Elixir | elixir-ls | See https://github.com/elixir-lsp/elixir-ls |
| Clojure | clojure-lsp | See https://clojure-lsp.io/installation/ |
| Nix | nixd | `nix profile install nixpkgs#nixd` |
| Typst | tinymist | See https://github.com/Myriad-Dreamin/tinymist |

---

## 四、生命周期管理

| 阶段 | 机制 |
|------|------|
| **启动** | `getClient()` 启动 LSP 进程，60s 初始化超时 |
| **请求** | `withLspClient()` 打开文件 (didOpen)，1s 延迟等待服务器就绪 |
| **空闲清理** | 每 60s 检查，5分钟空闲且 refCount=0 则关闭 |
| **退出** | 注册 exit/SIGINT/SIGTERM 处理器，同步关闭所有客户端 |
| **会话删除** | `lspManager.cleanupTempDirectoryClients()` 清理临时目录 |

### 关键配置

- **空闲超时**: 5 分钟 (`IDLE_TIMEOUT = 5 * 60 * 1000`)
- **初始化超时**: 60 秒 (`INIT_TIMEOUT = 60 * 1000`)
- **清理间隔**: 60 秒
- **最大结果限制**: 200 条

---

## 五、Hook 交互

| Hook | 交互方式 |
|------|----------|
| `tool-output-truncator` | 截断 `lsp_diagnostics` 输出（防止上下文膨胀） |
| `atlas` | 提醒 agents 在修改文件后运行 `lsp_diagnostics` |
| `keyword-detector` (ultrawork) | 要求 `lsp_diagnostics` 进行 lint 验证 |
| `event` (session.deleted) | 清理临时目录 LSP 客户端 |

---

## 六、配置方式

在 `.opencode/oh-my-opencode.jsonc` 中配置：

```jsonc
{
  "lsp": {
    "my-custom-server": {
      "command": ["my-lsp", "--stdio"],
      "extensions": [".ts", ".tsx"],
      "priority": 10,
      "env": { "MY_VAR": "value" }
    }
  }
}
```

**优先级**：项目配置 > 用户配置 > 内置默认值

---

## 七、关键文件清单

| 文件 | 职责 |
|------|------|
| `lsp-server.ts` | 单例管理器，生命周期，引用计数 |
| `lsp-client.ts` | 文件打开，文档同步，LSP 请求 |
| `lsp-client-connection.ts` | JSON-RPC 请求/响应层 |
| `lsp-client-transport.ts` | stdin/stdout 字节流封装 |
| `lsp-process.ts` | 进程生成（Bun/Node） |
| `lsp-client-wrapper.ts` | 高级入口，服务器解析 |
| `server-definitions.ts` | 40+ 内置服务器定义 |
| `server-resolution.ts` | 扩展名 → 服务器解析 |
| `server-config-loader.ts` | 多级配置加载 |
| `workspace-edit.ts` | 重命名结果应用到磁盘 |
| `diagnostics-tool.ts` | 诊断工具实现 |

---

## 八、Doctor 检查

`oh-my-opencode doctor` 会检查 LSP 服务器安装状态：

- typescript-language-server
- pyright
- rust-analyzer
- gopls

---

## 九、特殊设计

### Windows 兼容性
- Windows 上使用 Node.js `child_process` 替代 Bun spawn (避免 segfault)
- `validateCwd()` 验证工作目录存在性

### 进程管理
- **引用计数**: 防止重复启动同一服务器的多个实例
- **预热**: `warmupClient()` 可预初始化客户端
- **超时保护**: 防止初始化卡住导致永久阻塞

### 诊断处理
- 支持 pull 模式 (textDocument/diagnostic)
- 回退到存储的诊断结果 (publishDiagnostics 通知)

---

## 十、与 OpenCode 内置 LSP 的区别

| 特性 | oh-my-opencode LSP | OpenCode 内置 LSP |
|------|-------------------|------------------|
| 实现方式 | 自定义客户端栈 | 使用 OpenCode LspServers |
| 工具数量 | 6 个独立工具 | 依赖内置 LSP 工具 |
| 配置方式 | oh-my-opencode.jsonc | OpenCode 配置 |
| 进程管理 | 自行管理生命周期 | 委托给 OpenCode |

---

## 附录：源码位置

- **源码目录**: `src/tools/lsp/`
- **工具注册**: `src/tools/index.ts`
- **插件集成**: `src/plugin/event.ts` (会话清理)
