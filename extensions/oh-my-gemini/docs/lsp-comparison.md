# OpenCode 原生 LSP vs oh-my-opencode 插件 LSP 对比分析

> 生成日期：2026-02-25  
> 分析对象：OpenCode 原生 LSP (`~/code/opencode/packages/opencode/src/lsp/`)  
> 对比对象：oh-my-opencode 插件 LSP (`~/code/oh-my-opencode/src/tools/lsp/`)

---

## 一、架构对比

### OpenCode 原生 LSP 架构

```
┌─────────────────────────────────────────────┐
│  LspTool (tool/lsp.ts)                     │
│  统一工具：operation 参数选择功能            │
│  - goToDefinition                           │
│  - findReferences                           │
│  - hover                                    │
│  - documentSymbol                           │
│  - workspaceSymbol                          │
│  - goToImplementation                       │
│  - prepareCallHierarchy                     │
│  - incomingCalls/outgoingCalls              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LSP 命名空间 (lsp/index.ts)               │
│  • state(): 全局状态管理                    │
│  • getClients(): 按文件解析客户端           │
│  • touchFile(): 打开文件并等待诊断          │
│  • diagnostics(): 获取所有诊断              │
│  • definition/references/hover/etc()        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LSPClient (lsp/client.ts)                 │
│  • vscode-jsonrpc MessageConnection        │
│  • 诊断通知监听 (publishDiagnostics)       │
│  • 文件版本控制 (didOpen/didChange)        │
│  • waitForDiagnostics(): 3s 超时等待        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LSPServer (lsp/server.ts)                 │
│  • 30+ 内置服务器定义                       │
│  • 自动下载安装 (Flag 控制)                 │
│  • RootFunction: 项目根目录解析             │
└─────────────────────────────────────────────┘
```

### oh-my-opencode 插件 LSP 架构

```
┌─────────────────────────────────────────────┐
│  6 个独立工具                               │
│  - lsp_goto_definition                     │
│  - lsp_find_references                     │
│  - lsp_symbols                             │
│  - lsp_diagnostics                         │
│  - lsp_prepare_rename                      │
│  - lsp_rename                              │
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
│  • 引用计数、5 分钟空闲超时                  │
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

## 二、工具设计对比

| 维度 | OpenCode 原生 | oh-my-opencode 插件 |
|------|--------------|---------------------|
| **工具数量** | 1 个统一工具 (`lsp`) | 6 个独立工具 |
| **调用方式** | `lsp(operation="goToDefinition", ...)` | `lsp_goto_definition(...)` |
| **参数风格** | 统一参数 (operation, filePath, line, character) | 各工具独立参数 |
| **权限控制** | 需要用户确认 (`ctx.ask`) | 无权限确认 |
| **实验性标志** | `OPENCODE_EXPERIMENTAL_LSP_TOOL` | 始终可用 |

### OpenCode 原生工具特点

```typescript
// 统一工具，通过 operation 参数选择功能
export const LspTool = Tool.define("lsp", {
  parameters: z.object({
    operation: z.enum([
      "goToDefinition", "findReferences", "hover",
      "documentSymbol", "workspaceSymbol",
      "goToImplementation", "prepareCallHierarchy",
      "incomingCalls", "outgoingCalls"
    ]),
    filePath: z.string(),
    line: z.number().int().min(1),
    character: z.number().int().min(1),
  }),
  execute: async (args, ctx) => {
    // 需要用户权限确认
    await ctx.ask({ permission: "lsp", patterns: ["*"] })
    // ...
  }
})
```

### oh-my-opencode 插件工具特点

```typescript
// 独立工具定义
export const lsp_goto_definition = Tool.define("lsp_goto_definition", {
  parameters: z.object({
    filePath: z.string(),
    line: z.number().int().min(1),
    character: z.number().int().min(0), // 0-based
  }),
  execute: async (args) => {
    // 无需权限确认
    // ...
  }
})
```

---

## 三、服务器管理对比

### 服务器数量

| 类别 | OpenCode 原生 | oh-my-opencode 插件 |
|------|--------------|---------------------|
| **内置服务器** | 30+ | 40+ |
| **配置方式** | `config.lsp` | `.opencode/oh-my-opencode.jsonc` |
| **自动下载** | ✅ (Flag 控制) | ❌ (用户自行安装) |

### OpenCode 原生服务器管理

```typescript
// lsp/index.ts - 全局状态管理
const state = Instance.state(
  async () => {
    const clients: LSPClient.Info[] = []
    const servers: Record<string, LSPServer.Info> = {}
    const cfg = await Config.get()
    
    if (cfg.lsp === false) {
      log.info("all LSPs are disabled")
      return { broken: new Set(), servers, clients, spawning: new Map() }
    }
    
    // 加载内置服务器
    for (const server of Object.values(LSPServer)) {
      servers[server.id] = server
    }
    
    // 加载用户配置
    for (const [name, item] of Object.entries(cfg.lsp ?? {})) {
      // 用户自定义服务器覆盖
    }
  },
  async (state) => {
    // 清理：关闭所有客户端
    await Promise.all(state.clients.map((client) => client.shutdown()))
  }
)
```

**特点**：
- 使用 `Instance.state()` 全局单例
- 支持实验性标志 (`OPENCODE_EXPERIMENTAL_LSP_TY`)
- 自动下载缺失的 LSP 服务器 (可通过 `OPENCODE_DISABLE_LSP_DOWNLOAD` 禁用)
- `spawning` Map 防止重复启动

### oh-my-opencode 插件服务器管理

```typescript
// lsp-server.ts - LSPServerManager
export class LSPServerManager {
  private static instance: LSPServerManager
  private clients: Map<string, LSPClient> = new Map()
  private idleTimeouts: Map<string, NodeJS.Timeout> = new Map()
  private refCounts: Map<string, number> = new Map()
  
  // 5 分钟空闲超时
  private static readonly IDLE_TIMEOUT = 5 * 60 * 1000
  
  // 60s 初始化超时
  private static readonly INIT_TIMEOUT = 60 * 1000
}
```

**特点**：
- 独立单例管理器
- 引用计数防止重复启动
- 5 分钟空闲自动关闭
- 60s 初始化超时保护
- 注册 exit/SIGINT/SIGTERM 处理器

---

## 四、诊断 (Diagnostics) 对比

### OpenCode 原生诊断

```typescript
// lsp/index.ts
export async function diagnostics() {
  const results: Record<string, LSPClient.Diagnostic[]> = {}
  for (const result of await runAll(async (client) => client.diagnostics)) {
    for (const [path, diagnostics] of result.entries()) {
      const arr = results[path] || []
      arr.push(...diagnostics)
      results[path] = arr
    }
  }
  return results
}

// lsp/client.ts - 诊断通知监听
connection.onNotification("textDocument/publishDiagnostics", (params) => {
  const filePath = Filesystem.normalizePath(fileURLToPath(params.uri))
  diagnostics.set(filePath, params.diagnostics)
  Bus.publish(Event.Diagnostics, { path: filePath, serverID: input.serverID })
})

// waitForDiagnostics - 3s 超时等待
async waitForDiagnostics(input: { path: string }) {
  return await withTimeout(
    new Promise<void>((resolve) => {
      unsub = Bus.subscribe(Event.Diagnostics, (event) => {
        if (event.properties.path === normalizedPath) {
          // 150ms 去抖动
          debounceTimer = setTimeout(resolve, DIAGNOSTICS_DEBOUNCE_MS)
        }
      })
    }),
    3000
  )
}
```

**特点**：
- 被动接收 `publishDiagnostics` 通知
- 使用 `Bus` 事件系统广播
- 150ms 去抖动
- 3s 超时等待

### oh-my-opencode 插件诊断

```typescript
// diagnostics-tool.ts
export const lsp_diagnostics = Tool.define("lsp_diagnostics", {
  parameters: z.object({
    filePath: z.string(),
    severity: z.enum(["error", "warning", "information", "hint", "all"]).optional(),
  }),
  execute: async (args) => {
    return await withLspClient(args.filePath, async (client, lspClient) => {
      // Pull 模式：主动请求
      const diagnostics = await client.connection.sendRequest(
        "textDocument/diagnostic",
        { textDocument: { uri: pathToFileURL(args.filePath).href } }
      )
      // 或回退到存储的诊断结果
    })
  }
})
```

**特点**：
- Pull 模式 (LSP 3.17 `textDocument/diagnostic`)
- 回退到存储的诊断结果
- 支持按 severity 过滤
- 无等待机制

---

## 五、关键差异总结

| 维度 | OpenCode 原生 | oh-my-opencode 插件 |
|------|--------------|---------------------|
| **设计哲学** | 统一工具，实验性标志 | 独立工具，始终可用 |
| **权限控制** | 需要用户确认 | 自动执行 |
| **诊断模式** | Push (通知监听) | Pull (主动请求) |
| **诊断等待** | 3s 超时 + 去抖动 | 无等待 |
| **服务器管理** | Instance.state 全局状态 | 独立单例管理器 |
| **空闲清理** | 无明确超时 | 5 分钟自动关闭 |
| **初始化超时** | 45s | 60s |
| **自动下载** | ✅ | ❌ |
| **Windows 兼容** | Bun spawn | Node child_process (避免 segfault) |
| **引用计数** | 无 | ✅ (防止重复启动) |
| **Hook 集成** | 有限 | 深度集成 (atlas, ultrawork 等) |

---

## 六、为什么 oh-my-opencode 保留自己的 LSP 实现？

### 1. 历史原因
- oh-my-opencode 的 LSP 实现早于 OpenCode 原生 LSP 工具
- 2026-01-16 的 commit `48167a69` 移除了重复工具，但保留了核心功能

### 2. 功能差异

| 功能 | OpenCode 原生 | oh-my-opencode 插件 |
|------|--------------|---------------------|
| `lsp_diagnostics` | ❌ (仅内部使用) | ✅ (独立工具) |
| `lsp_rename` | ❌ | ✅ |
| `lsp_prepare_rename` | ❌ | ✅ |
| `lsp_hover` | ✅ | ❌ (已移除) |
| `lsp_code_actions` | ✅ | ❌ (已移除) |

### 3. 集成深度
- oh-my-opencode 的 LSP 与插件的 hooks 深度集成：
  - `tool-output-truncator`: 截断诊断输出
  - `atlas`: 修改文件后提醒运行诊断
  - `keyword-detector` (ultrawork): 要求诊断验证
  - `event` (session.deleted): 清理临时目录客户端

### 4. 控制权
- 独立的进程管理 (引用计数、空闲超时)
- 自定义服务器解析逻辑
- 灵活的配置系统

---

## 七、未来趋势

根据 git 历史分析：

1. **逐步收敛**: oh-my-opencode 正在移除与 OpenCode 重复的工具
   - `lsp_hover`, `lsp_code_actions`, `lsp_code_action_resolve` 已移除
   - `lsp_document_symbols` + `lsp_workspace_symbols` → `lsp_symbols`

2. **保留差异化**: 保留 OpenCode 没有的核心功能
   - `lsp_diagnostics` (诊断获取)
   - `lsp_rename` (重命名)

3. **深度集成**: 加强与插件生态的集成
   - hooks 系统
   - ultrawork 模式
   - 会话管理

---

## 八、源码位置

### OpenCode 原生
- **LSP 核心**: `packages/opencode/src/lsp/`
  - `index.ts` - LSP 命名空间，全局状态
  - `client.ts` - LSPClient 创建
  - `server.ts` - 30+ 服务器定义
- **工具定义**: `packages/opencode/src/tool/lsp.ts`
- **工具描述**: `packages/opencode/src/tool/lsp.txt`

### oh-my-opencode 插件
- **工具目录**: `src/tools/lsp/`
- **管理器**: `src/tools/lsp/lsp-server.ts`
- **客户端**: `src/tools/lsp/lsp-client.ts`
- **传输层**: `src/tools/lsp/lsp-client-transport.ts`
- **进程管理**: `src/tools/lsp/lsp-process.ts`

---

## 附录：服务器列表对比

### OpenCode 原生 (30+)

| 语言 | 服务器 | 自动下载 |
|------|--------|----------|
| TypeScript | typescript | ✅ |
| Deno | deno | ❌ |
| Vue | vue | ✅ |
| ESLint | eslint | ✅ |
| Oxlint | oxlint | ❌ |
| Biome | biome | ❌ |
| Go | gopls | ✅ |
| Ruby | rubocop | ✅ |
| Python (实验) | ty | ✅ (Flag) |
| Python | pyright | ✅ |
| Elixir | elixir-ls | ✅ |
| Zig | zls | ✅ |
| C# | csharp | ✅ |
| F# | fsautocomplete | ✅ |
| Swift | sourcekit-lsp | ❌ |
| Rust | rust-analyzer | ❌ |
| C/C++ | clangd | ✅ |
| Svelte | svelte | ✅ |
| Astro | astro | ✅ |
| Java | jdtls | ✅ |
| Kotlin | kotlin-ls | ✅ |
| YAML | yaml-ls | ✅ |
| Lua | lua-ls | ✅ |
| PHP | php intelephense | ✅ |
| Prisma | prisma | ❌ |
| Dart | dart | ❌ |
| OCaml | ocaml-lsp | ❌ |
| Bash | bash | ✅ |
| Terraform | terraform-ls | ✅ |

### oh-my-opencode 插件 (40+)

额外支持：
- Haskell
- Nix
- Typst (LaTeX)
- Gleam
- Clojure
- Dockerfile
- HTML/CSS
- 更多...

(通过 `server-definitions.ts` 配置)
