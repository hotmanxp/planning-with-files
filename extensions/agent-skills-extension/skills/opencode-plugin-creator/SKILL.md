---
name: opencode-plugin-creator
description:
  Guide for creating plugins for OpenCode. Use when user wants to create plugins that hook into OpenCode events, add custom tools, modify behavior, or integrate external services.
---

# OpenCode Plugin Creator

This skill guides you through creating plugins for OpenCode.

## What Are Plugins

Plugins are JavaScript/TypeScript modules that extend OpenCode by:
- Hooking into events (file changes, tool execution, sessions, etc.)
- Adding custom tools
- Modifying AI parameters
- Injecting environment variables
- Customizing behavior

## Plugin Structure

### Simple Plugin (Single File)

```
.opencode/plugins/
└── my-plugin.js
```

### Plugin with Dependencies

```
.opencode/
├── plugins/
│   └── my-plugin.ts
└── package.json
```

### Published Plugin (npm)

```
my-plugin/
├── src/
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Plugin Format

### Basic Structure

```javascript
// .opencode/plugins/my-plugin.js
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Plugin initialized!")
  
  return {
    // Hook implementations
  }
}
```

### TypeScript Plugin

```typescript
// .opencode/plugins/my-plugin.ts
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
    // Type-safe hooks
  }
}
```

### With Custom Tool

```typescript
import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: "My custom tool",
        args: {
          input: tool.schema.string().describe("Input text"),
        },
        async execute(args, context) {
          return `Processed: ${args.input}`
        },
      }),
    },
  }
}
```

## Available Hooks

### Session Events

```typescript
"session.created": async (input, output) => {
  // Session started
}

"session.deleted": async (input, output) => {
  // Session deleted
}

"session.idle": async (input, output) => {
  // Session completed (no more messages)
}

"session.updated": async (input, output) => {
  // Session updated
}

"session.error": async (input, output) => {
  // Session error occurred
}
```

### Tool Events

```typescript
"tool.execute.before": async (input, output) => {
  // input: { tool, sessionID, callID }
  // output: { args }
  // Modify tool arguments before execution
  output.args.command = sanitize(output.args.command)
}

"tool.execute.after": async (input, output) => {
  // input: { tool, sessionID, callID, args }
  // output: { title, output, metadata }
  // Modify tool output after execution
  output.title = "Custom Title"
}

"tool.definition": async (input, output) => {
  // input: { toolID }
  // output: { description, parameters }
  // Modify tool definitions sent to LLM
}
```

### File Events

```typescript
"file.edited": async (input, output) => {
  // File was edited
}

"file.watcher.updated": async (input, output) => {
  // File watcher updated
}
```

### Shell Events

```typescript
"shell.env": async (input, output) => {
  // input: { cwd, sessionID, callID }
  // output: { env }
  // Inject environment variables
  output.env.MY_API_KEY = "secret"
  output.env.PROJECT_ROOT = input.cwd
}
```

### Chat Events

```typescript
"chat.params": async (input, output) => {
  // input: { sessionID, agent, model, provider, message }
  // output: { temperature, topP, topK, options }
  // Modify AI parameters
  output.temperature = 0.7
}

"chat.headers": async (input, output) => {
  // output: { headers }
  // Add custom headers
  output.headers["X-Custom"] = "value"
}

"chat.message": async (input, output) => {
  // output: { message, parts }
  // Modify incoming messages
}
```

### Permission Events

```typescript
"permission.ask": async (input, output) => {
  // input: Permission
  // output: { status: "ask" | "deny" | "allow" }
  // Control permission prompts
}
```

### Command Events

```typescript
"command.execute.before": async (input, output) => {
  // input: { command, sessionID, arguments }
  // output: { parts }
  // Modify command before execution
}
```

### LSP Events

```typescript
"lsp.client.diagnostics": async (input, output) => {
  // LSP diagnostics received
}

"lsp.updated": async (input, output) => {
  // LSP configuration updated
}
```

### TUI Events

```typescript
"tui.prompt.append": async (input, output) => {
  // Text appended to prompt
}

"tui.command.execute": async (input, output) => {
  // Command executed
}

"tui.toast.show": async (input, output) => {
  // Toast notification shown
}
```

### Compaction Hook

```typescript
"experimental.session.compacting": async (input, output) => {
  // input: { sessionID }
  // output: { context: string[], prompt?: string }
  
  // Add custom context to compaction
  output.context.push(`
## Custom Context
- Current task: ${currentTask}
- Important decisions: ${decisions}
  `)
  
  // Or replace entire prompt
  output.prompt = "Custom compaction prompt..."
}
```

### Event Listener

```typescript
event: async ({ event }) => {
  // Listen to all events
  if (event.type === "session.idle") {
    console.log("Session completed!")
  }
}
```

## Creation Workflow

### Step 1: Choose Plugin Type

**Local Plugin** (project-specific):
- Location: `.opencode/plugins/`
- Use case: Project-specific customizations

**Global Plugin** (user-wide):
- Location: `~/.config/opencode/plugins/`
- Use case: Personal utilities

**Published Plugin** (npm):
- Install via `opencode.json`
- Use case: Share with community

### Step 2: Create Plugin File

```bash
# Create plugin directory
mkdir -p .opencode/plugins

# Create plugin file
cat > .opencode/plugins/my-plugin.js << 'EOF'
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {
  return {
    "shell.env": async (input, output) => {
      output.env.MY_VAR = "value"
    },
  }
}
EOF
```

### Step 3: Add Dependencies (Optional)

```json
// .opencode/package.json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

Use in plugin:

```typescript
// .opencode/plugins/my-plugin.ts
import { escape } from "shescape"

export const MyPlugin = async (ctx) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        output.args.command = escape(output.args.command)
      }
    },
  }
}
```

### Step 4: Test Plugin

Restart OpenCode or reload configuration:

```bash
# Plugins load automatically at startup
# Check logs for errors
```

### Step 5: Publish (Optional)

```bash
# Create package.json
cat > package.json << 'EOF'
{
  "name": "opencode-my-plugin",
  "version": "1.0.0",
  "type": "module",
  "exports": "./src/index.js"
}
EOF

# Publish to npm
npm publish
```

## Plugin Examples

### Example 1: Environment Protection

```javascript
// Prevent reading .env files
export const EnvProtection = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read" && output.args.filePath.includes(".env")) {
        throw new Error("Do not read .env files")
      }
    },
  }
}
```

### Example 2: Send Notifications

```javascript
// Send macOS notification on session completion
export const NotificationPlugin = async ({ project, client, $, directory, worktree }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "Session completed!" with title "opencode"'`
      }
    },
  }
}
```

### Example 3: Custom Tool

```typescript
import { type Plugin, tool } from "@opencode-ai/plugin"

export const CustomToolsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      greet: tool({
        description: "Greet someone",
        args: {
          name: tool.schema.string().describe("Name to greet"),
        },
        async execute(args, context) {
          return `Hello, ${args.name}!`
        },
      }),
    },
  }
}
```

### Example 4: Logging

```typescript
// Use structured logging instead of console.log
export const MyPlugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "my-plugin",
      level: "info",
      message: "Plugin initialized",
      extra: { foo: "bar" },
    },
  })
}
```

### Example 5: Modify AI Parameters

```typescript
export const ModelTweaker = async () => {
  return {
    "chat.params": async (input, output) => {
      // Increase temperature for creative tasks
      if (input.agent === "creative") {
        output.temperature = 0.9
      }
      // Decrease for coding tasks
      if (input.agent === "coder") {
        output.temperature = 0.3
      }
    },
  }
}
```

### Example 6: Command Prefix

```typescript
export const CommandPrefix = async () => {
  return {
    "command.execute.before": async (input, output) => {
      // Add timestamp to all commands
      output.parts.push({
        type: "text",
        text: `[${new Date().toISOString()}] `,
      })
    },
  }
}
```

## Installation Methods

### Method 1: Local Plugin Directory

Place files in plugin directory:
- Project: `.opencode/plugins/`
- Global: `~/.config/opencode/plugins/`

Files are automatically loaded at startup.

### Method 2: npm Package

Add to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "opencode-helicone-session",
    "opencode-wakatime",
    "@my-org/custom-plugin"
  ]
}
```

### Method 3: Local with Dependencies

Create `.opencode/package.json`:

```json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

OpenCode runs `bun install` at startup.

## Plugin Context

The plugin function receives:

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | `Project` | Current project information |
| `directory` | `string` | Current working directory |
| `worktree` | `string` | Git worktree path |
| `client` | `Client` | OpenCode SDK client |
| `$` | `BunShell` | Bun's shell API |
| `serverUrl` | `URL` | Server URL |

## Best Practices

### 1. Use Structured Logging

```typescript
// Good
await client.app.log({
  body: {
    service: "my-plugin",
    level: "info",
    message: "Something happened",
  },
})

// Bad
console.log("Something happened")
```

### 2. Handle Errors Gracefully

```typescript
"tool.execute.before": async (input, output) => {
  try {
    // Your logic
  } catch (error) {
    // Handle error appropriately
    throw new Error(`Plugin error: ${error.message}`)
  }
}
```

### 3. Use TypeScript for Type Safety

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async (ctx) => {
  // Type-safe access to hooks
}
```

### 4. Keep Plugins Focused

- One responsibility per plugin
- Small, composable plugins
- Clear naming

### 5. Document Your Plugins

- Add comments explaining hooks
- Document expected inputs/outputs
- Include usage examples

## Troubleshooting

### Plugin Not Loading

1. Check file location (`.opencode/plugins/` or `~/.config/opencode/plugins/`)
2. Verify file extension (`.js` or `.ts`)
3. Check for syntax errors
4. Restart OpenCode

### Dependencies Not Found

1. Create `.opencode/package.json`
2. Add dependencies
3. Restart OpenCode (triggers `bun install`)

### Hook Not Firing

1. Verify hook name is correct
2. Check event is actually triggered
3. Add logging to debug

### TypeScript Errors

1. Install types: `bun add -d @opencode-ai/plugin`
2. Check import paths
3. Verify type compatibility

## When to Use This Skill

Use this skill when:
- User wants to create an OpenCode plugin
- User needs to hook into OpenCode events
- User wants to add custom tools
- User asks about plugin format or structure
- User needs to modify OpenCode behavior
- User wants to integrate external services
