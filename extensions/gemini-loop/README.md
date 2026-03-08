# Gemini Loop Extension - README

**A self-referential development loop for Gemini CLI**

---

## 🚀 Quick Start

```bash
# Install the extension
cd /path/to/planning-with-files/extensions/gemini-loop

# Start a loop
/loop "Build a REST API with user authentication"

# Start ultrawork mode (with Oracle verification)
/ulw-loop "Implement payment processing with fraud detection"

# Check status
/loop-status

# Cancel
/cancel-loop
```

---

## 📖 What is Gemini Loop?

Gemini Loop enables **autonomous, continuous work** toward a goal. The agent:

1. Works on your task
2. Detects when it claims completion (`<promise>DONE</promise>`)
3. **Automatically continues** if the task isn't truly done
4. Repeats until 100% complete

### Two Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Standard Loop** | Continuous work until completion | General development |
| **Ultrawork Loop** | + Oracle verification before completion | Mission-critical tasks |

---

## 🎯 Features

- 🔄 **Auto-continuation** - Never stops until done
- 🎯 **Completion detection** - Scans for promise signals
- ⚡ **Ultrawork mode** - Oracle verification for quality assurance
- 📊 **State persistence** - Survives session restarts
- 🛑 **Configurable limits** - Max iterations, custom signals
- 📈 **Progress tracking** - Real-time status updates

---

## 📦 Installation

1. **Copy extension** to your Gemini CLI extensions directory:
   ```bash
   cp -r gemini-loop ~/.gemini/extensions/
   ```

2. **Enable in config** (`gemini-extension.json`):
   ```json
   {
     "extensions": {
       "gemini-loop": {
         "enabled": true
       }
     }
   }
   ```

3. **Restart Gemini CLI**

---

## 💡 Usage Examples

### Basic Loop

```bash
# Simple task
/loop "Add user authentication to the app"

# Complex refactoring
/loop "Refactor the payment module to use Stripe"

# With custom max iterations
/loop "Fix all TypeScript errors" --max-iterations=50

# Ultrawork mode (recommended for important work)
/ulw-loop "Implement the entire feature specification"
```

### During Loop

```bash
# Check progress
/loop-status

# Cancel if needed
/cancel-loop

# List historical loops
/loop-list
```

---

## ⚙️ Configuration

Add to your `gemini-extension.json`:

```json
{
  "geminiLoop": {
    "enabled": true,
    "stateDir": ".agent_working_dir/loops",
    "defaultMaxIterations": 100,
    "defaultStrategy": "continue",
    "apiTimeoutMs": 5000,
    "ultrawork": {
      "enabled": true,
      "oracleModel": "gemini-2.5-pro"
    }
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable extension |
| `stateDir` | string | `.agent_working_dir/loops` | State directory |
| `defaultMaxIterations` | number | `100` | Default max iterations |
| `defaultStrategy` | string | `"continue"` | `"continue"` or `"reset"` |
| `apiTimeoutMs` | number | `5000` | API timeout |
| `ultrawork.enabled` | boolean | `true` | Enable ultrawork |
| `ultrawork.oracleModel` | string | `"gemini-2.5-pro"` | Oracle model |

---

## 🔄 How It Works

### Standard Loop

```
1. User runs: /loop "Build API"
2. Agent works on task
3. Loop detects idle → scans for <promise>DONE</promise>
4. If NOT found → Inject continuation prompt → Continue
5. If FOUND → Complete loop ✅
```

### Ultrawork Loop

```
1. User runs: /ulw-loop "Build API"
2. Agent works on task
3. Loop detects idle → scans for <promise>DONE</promise>
4. If FOUND → Trigger Oracle Verification
5. Oracle reviews work:
   - VERIFIED → Complete loop ✅
   - FAILED → Inject retry prompt → Continue ↩️
```

---

## 📊 State File

State persists to `.gemini-loop-state.md`:

```markdown
---
active: true
iteration: 3
max_iterations: 100
completion_promise: "DONE"
started_at: "2026-03-08T10:30:00.000Z"
session_id: "sess_abc123"
ultrawork: true
verification_pending: true
---
Build a REST API with user authentication
```

---

## 🧪 When to Use

### ✅ Good Use Cases

- Complex refactoring
- Feature development
- Bug fixes requiring iteration
- Test-driven development
- Code reviews with fixes

### ❌ Not Recommended

- Simple one-shot tasks
- Tasks needing frequent user input
- Time-sensitive operations
- External dependency tasks

---

## 🛠️ Troubleshooting

### Loop won't start

```bash
# Cancel any existing loop
/cancel-loop

# Try again
/loop "task"
```

### Stuck in verification

Check Oracle transcript:
```bash
cat .gemini/sessions/sess-oracle-xxx.jsonl
```

### Max iterations reached

Increase limit:
```bash
/loop "task" --max-iterations=200
```

---

## 📁 File Structure

```
gemini-loop/
├── GEMINI.md                    # Main documentation
├── README.md                    # This file
├── gemini-extension.json        # Extension metadata
├── hooks/
│   ├── gemini-loop-hook.js      # Main hook
│   ├── constants.js             # Constants
│   ├── types.js                 # Type definitions
│   ├── storage.js               # State persistence
│   ├── state-controller.js      # State management
│   ├── prompt-builder.js        # Prompt generation
│   ├── completion-detector.js   # Completion detection
│   └── event-handler.js         # Event handling
├── scripts/
│   ├── start-loop.js            # Start command
│   ├── cancel-loop.js           # Cancel command
│   └── loop-status.js           # Status command
├── commands/
│   ├── loop.cmd                 # /loop command
│   ├── ulw-loop.cmd             # /ulw-loop command
│   └── cancel-loop.cmd          # /cancel-loop command
└── docs/
    └── implementation-notes.md  # Technical notes
```

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Follow existing patterns
4. Add tests
5. Update docs

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

- **Original**: Oh-My-OpenCode's `ralph-loop` hook
- **Inspiration**: Anthropic's Ralph Wiggum plugin
- **Pattern**: Self-referential AI agent loops

---

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Docs**: See `GEMINI.md`
