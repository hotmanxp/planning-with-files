# Gemini Loop Extension

**Version:** 1.0.0  
**Author:** Generated from oh-my-opencode's ralph-loop implementation  
**Compatibility:** Gemini CLI with custom commands and hooks support

---

## Overview

**Gemini Loop** brings the powerful self-referential development loop pattern from Oh-My-OpenCode to Gemini CLI. It enables continuous, autonomous work toward a goal until the task is 100% complete.

### Key Features

- 🔄 **Self-Referential Loop** - Automatically continues working until completion
- 🎯 **Completion Detection** - Scans for `<promise>DONE</promise>` or custom signals
- ⚡ **Ultrawork Mode** - Enhanced mode with Oracle verification for critical tasks
- 🔍 **Oracle Verification** - Independent validation before marking complete (Ultrawork only)
- 📊 **State Persistence** - Survives session restarts via `.gemini-loop-state.md`
- 🛑 **Configurable Limits** - Max iterations, custom completion signals, strategies

---

## Quick Start

```bash
# Start a loop (standard mode)
/loop "Build a REST API with user authentication"

# Start a loop (ultrawork mode with verification)
/ulw-loop "Implement payment processing with fraud detection"

# Customize max iterations
/loop "Refactor the entire codebase" --max-iterations=50

# Check loop status
/loop-status

# Cancel active loop
/cancel-loop
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/loop [task]` | Start a standard development loop |
| `/ulw-loop [task]` | Start ultrawork loop with Oracle verification |
| `/loop-status` | Show current loop state and progress |
| `/loop-list` | List all historical loop sessions |
| `/cancel-loop` | Cancel the active loop |
| `/loop-resume` | Resume a previously interrupted loop |

---

## Configuration

Add to your `gemini-extension.json` or project config:

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
      "oracleModel": "gemini-2.5-pro",
      "verificationPrompt": "Verify this task is complete"
    }
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable the extension |
| `stateDir` | string | `.agent_working_dir/loops` | Directory for state files |
| `defaultMaxIterations` | number | `100` | Default iteration limit |
| `defaultStrategy` | string | `"continue"` | `"continue"` or `"reset"` |
| `apiTimeoutMs` | number | `5000` | API call timeout |
| `ultrawork.enabled` | boolean | `true` | Enable ultrawork mode |
| `ultrawork.oracleModel` | string | `"gemini-2.5-pro"` | Model for verification |
| `ultrawork.verificationPrompt` | string | (auto-generated) | Prompt for Oracle |

---

## How It Works

### Standard Loop Flow

```
/loop "Build API"
    ↓
[Agent works on task]
    ↓
[Idle detected] → Scan for <promise>DONE</promise>
    ↓
    ├─→ NOT FOUND → Inject continuation prompt → Continue loop
    ↓
    └─→ FOUND → Complete loop → Show success toast
```

### Ultrawork Loop Flow

```
/ulw-loop "Build API"
    ↓
[Agent works on task]
    ↓
[Idle detected] → Scan for <promise>DONE</promise>
    ↓
    ├─→ NOT FOUND → Continue loop
    ↓
    └─→ FOUND → Trigger Oracle Verification
                    ↓
            [Oracle reviews work]
                    ↓
            ├─→ VERIFIED → Complete loop ✅
            ↓
            └─→ FAILED → Inject retry prompt → Continue loop ↩️
```

---

## State File Format

State is persisted to `.gemini-loop-state.md`:

```markdown
---
active: true
iteration: 3
max_iterations: 100
completion_promise: "DONE"
initial_completion_promise: "DONE"
started_at: "2026-03-08T10:30:00.000Z"
session_id: "sess_abc123"
ultrawork: true
verification_pending: true
verification_session_id: "sess_oracle_456"
strategy: "continue"
message_count_at_start: 15
---
Build a REST API with user authentication
```

---

## Iteration Strategies

### Continue Strategy (Default)

- Maintains full conversation history
- Agent has complete context of prior attempts
- Better for complex, multi-phase tasks
- Uses more tokens

### Reset Strategy

- Starts fresh each iteration
- Only the original task prompt is retained
- More token-efficient
- Better for simple, repetitive tasks

---

## Completion Detection

The extension detects completion via:

1. **Promise Signal** - `<promise>DONE</promise>` (configurable)
2. **Transcript Scanning** - Checks session transcript files
3. **API Message Query** - Queries session messages via API

### Custom Completion Signals

```bash
/loop "Task" --completion-promise="<final>COMPLETE</final>"
```

---

## Oracle Verification (Ultrawork)

When ultrawork mode detects completion:

1. **Pauses the loop**
2. **Spawns Oracle session** with verification prompt
3. **Scans Oracle output** for `<promise>VERIFIED</promise>`
4. **Decides next action**:
   - ✅ Verified → Complete loop
   - ❌ Failed → Inject failure prompt, continue loop

### Oracle Prompt Template

```
[ULTRAWORK LOOP VERIFICATION {{ITERATION}}/{{MAX}}]

You already emitted <promise>{{INITIAL_PROMISE}}</promise>. This does NOT finish the loop yet.

REQUIRED NOW:
- Review the work completed so far
- Verify whether the original task is actually complete
- Check for: requirements met, tests passing, edge cases handled
- If complete: output <promise>VERIFIED</promise>
- If incomplete: explain what's missing
```

---

## Error Handling

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Loop won't start | State file corrupted | Run `/cancel-loop` then retry |
| Stuck in verification | Oracle session failed | Check Oracle transcript, manually verify |
| Max iterations reached | Task too complex | Increase `--max-iterations` |
| State not persisting | Wrong `stateDir` | Check directory permissions |

### Recovery

If a loop session crashes:

```bash
# List all loops
/loop-list

# Resume a specific loop
/loop-resume --session-id="sess_abc123"
```

---

## Best Practices

### When to Use Loop

✅ **Good candidates:**
- Complex refactoring tasks
- Feature development requiring iteration
- Bug fixes needing thorough verification
- Test-driven development cycles

❌ **Not recommended:**
- Simple one-shot tasks
- Tasks requiring frequent user input
- Time-sensitive operations
- Tasks with external dependencies

### Optimization Tips

1. **Set appropriate limits** - Start with 50 iterations, increase if needed
2. **Use continue strategy** for complex tasks
3. **Enable ultrawork** for mission-critical work
4. **Monitor state file** - Check `.gemini-loop-state.md` for progress
5. **Cancel early** if the approach isn't working

---

## Architecture

### File Structure

```
gemini-loop/
├── GEMINI.md                    # This documentation
├── gemini-extension.json        # Extension metadata
├── hooks/
│   └── gemini-loop-hook.js      # Main hook implementation
├── scripts/
│   ├── start-loop.js            # Loop starter script
│   ├── cancel-loop.js           # Cancellation script
│   └── loop-status.js           # Status query script
├── docs/
│   └── implementation-notes.md  # Technical documentation
├── agents/
│   └── oracle-agent.md          # Oracle verification agent spec
└── commands/
    ├── loop.cmd                 # /loop command
    ├── ulw-loop.cmd             # /ulw-loop command
    └── cancel-loop.cmd          # /cancel-loop command
```

### Hook Integration

The extension registers these event handlers:

- `session.idle` - Triggers loop continuation logic
- `session.deleted` - Cleanup orphaned state
- `session.error` - Error recovery

---

## Comparison: Loop vs Ultrawork

| Feature | Standard Loop | Ultrawork Loop |
|---------|---------------|----------------|
| Completion detection | ✅ | ✅ |
| Auto-continuation | ✅ | ✅ |
| Oracle verification | ❌ | ✅ |
| Max iterations | Configurable | Unbounded (default) |
| Use case | General development | Mission-critical tasks |
| Token usage | Moderate | Higher (verification) |

---

## Troubleshooting

### Debug Mode

Enable verbose logging:

```json
{
  "geminiLoop": {
    "debug": true,
    "logFile": ".gemini-loop-debug.log"
  }
}
```

### Common Errors

**Error: "State file corrupted"**
```bash
# Solution: Clear state
rm .agent_working_dir/loops/.gemini-loop-state.md
```

**Error: "Session not found"**
```bash
# Solution: Session may have been deleted
/cancel-loop
# Then restart
```

**Error: "Oracle verification timeout"**
```bash
# Solution: Increase timeout or check Oracle model availability
{
  "geminiLoop": {
    "apiTimeoutMs": 10000
  }
}
```

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow the existing code structure
4. Add tests for new features
5. Update documentation

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- **Original Implementation**: Oh-My-OpenCode's `ralph-loop` hook
- **Inspiration**: Anthropic's Ralph Wiggum plugin
- **Pattern**: Self-referential AI agent loops

---

## Version History

### v1.0.0 (2026-03-08)

- Initial release
- Standard loop mode
- Ultrawork mode with Oracle verification
- State persistence
- CLI commands
- Debug logging

---

## Support

- **Issues**: File on GitHub
- **Discussions**: GitHub Discussions
- **Docs**: See `docs/` directory
