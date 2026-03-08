# Gemini Loop - Implementation Notes

**Technical documentation for developers**

---

## Architecture Overview

The Gemini Loop extension is ported from Oh-My-OpenCode's `ralph-loop` hook, adapted for Gemini CLI's extension system.

### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                   Gemini CLI Runtime                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Event Handler                           │
│  - session.idle listener                                 │
│  - Completion detection                                  │
│  - Continuation injection                                │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────┐
│ State Controller│ │  Prompt     │ │ Completion  │
│                 │ │  Builder    │ │  Detector   │
└─────────────────┘ └─────────────┘ └─────────────┘
          │
          ▼
┌─────────────────┐
│ Storage (Disk)  │
│ .gemini-loop-   │
│ state.md        │
└─────────────────┘
```

---

## Key Design Decisions

### 1. State Persistence

State is stored in a markdown file with frontmatter:

```markdown
---
active: true
iteration: 3
...
---
Task description
```

**Why?**
- Human-readable
- Survives session restarts
- Easy debugging
- Git-ignorable

### 2. Completion Detection

Two methods:
1. **Transcript scanning** - Fast, file-based
2. **API message query** - Fallback, comprehensive

**Why both?**
- Transcript is faster but may not exist
- API is slower but always available

### 3. Ultrawork Verification

When completion is detected in ultrawork mode:

1. Mark `verification_pending: true`
2. Inject Oracle verification prompt
3. Monitor Oracle session
4. If verified → Complete
5. If failed → Inject retry prompt

### 4. Iteration Strategies

- **continue** (default): Maintain full history
- **reset**: Start fresh each iteration

**Why?**
- `continue` better for complex tasks
- `reset` more token-efficient

---

## Event Flow

### Standard Loop

```
session.idle
    │
    ▼
┌─────────────────┐
│ Get loop state  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Detect          │
│ completion?     │
└─────────────────┘
    │
    ├─→ YES → Complete loop
    │
    └─→ NO  → Check max iterations
                │
                ├─→ EXCEEDED → Stop loop
                │
                └─→ OK → Inject continuation → Continue
```

### Ultrawork Loop

```
session.idle
    │
    ▼
┌─────────────────┐
│ Detect          │
│ completion?     │
└─────────────────┘
    │
    └─→ YES → Mark verification_pending
                │
                ▼
        ┌───────────────┐
        │ Inject Oracle │
        │ prompt        │
        └───────────────┘
                │
                ▼
        Monitor Oracle session
                │
                ▼
        ┌───────────────┐
        │ Verified?     │
        └───────────────┘
                │
        ├─→ YES → Complete
        │
        └─→ NO → Inject retry → Continue
```

---

## File Descriptions

### Core Files

| File | Purpose | LOC |
|------|---------|-----|
| `gemini-loop-hook.js` | Main entry point, factory function | ~100 |
| `event-handler.js` | Session event handling, loop logic | ~250 |
| `state-controller.js` | State lifecycle management | ~200 |
| `storage.js` | Disk I/O, frontmatter parsing | ~200 |
| `prompt-builder.js` | Prompt template generation | ~100 |
| `completion-detector.js` | Completion signal detection | ~150 |
| `constants.js` | Magic strings, defaults | ~50 |
| `types.js` | JSDoc type definitions | ~50 |

### Scripts

| File | Purpose |
|------|---------|
| `start-loop.js` | `/loop` command implementation |
| `cancel-loop.js` | `/cancel-loop` command |
| `loop-status.js` | `/loop-status` command |

---

## Gemini CLI Integration

### Hook Registration

The extension registers these hooks:

```javascript
export default {
  hooks: {
    session: {
      idle: loopHook.event,
      deleted: loopHook.event,
      error: loopHook.event,
    },
  },
}
```

### Command Registration

```javascript
export default {
  commands: [
    { name: 'loop', handler: './scripts/start-loop.js' },
    { name: 'ulw-loop', handler: './scripts/ulw-loop.js' },
    { name: 'cancel-loop', handler: './scripts/cancel-loop.js' },
    { name: 'loop-status', handler: './scripts/loop-status.js' },
  ],
}
```

---

## API Compatibility

### Gemini CLI Session API

```javascript
// Get messages
await ctx.client.session.messages({
  path: { id: sessionID },
  query: { directory },
})

// Inject prompt
await ctx.client.session.promptAsync({
  path: { id: sessionID },
  body: { parts: [{ type: 'text', text: prompt }] },
  query: { directory },
})

// Show toast
await ctx.client.tui?.showToast?.({
  body: { title, message, variant, duration },
})
```

---

## State Transitions

### Standard Loop

```
START → ACTIVE → [IDLE → CONTINUE] × N → COMPLETE → CLEARED
```

### Ultrawork Loop

```
START → ACTIVE → [IDLE → CONTINUE] × N
    │
    └─→ DONE DETECTED → VERIFICATION_PENDING
                            │
                            ├─→ VERIFIED → COMPLETE
                            │
                            └─→ FAILED → ACTIVE → ...
```

---

## Error Handling

### State File Corruption

```javascript
try {
  const state = readState(directory, stateDir)
  if (!state) {
    console.error('State corrupted, clearing...')
    clearState(directory, stateDir)
  }
} catch (err) {
  console.error('State read failed:', err)
}
```

### API Timeout

```javascript
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), apiTimeoutMs)

try {
  await ctx.client.session.messages({
    path: { id: sessionID },
    query: { directory },
    signal: controller.signal,
  })
} finally {
  clearTimeout(timeoutId)
}
```

### Session Not Found

```javascript
if (checkSessionExists) {
  const exists = await checkSessionExists(state.session_id)
  if (!exists) {
    clearState() // Orphaned session
    return
  }
}
```

---

## Performance Considerations

### 1. Transcript Scanning (Fast Path)

```javascript
// Check transcript first (file I/O, no network)
const viaTranscript = detectCompletionInTranscript(...)
if (viaTranscript) return true // Early exit
```

### 2. API Query (Slow Path)

```javascript
// Only query API if transcript doesn't have it
const viaApi = await detectCompletionInSessionMessages(...)
```

### 3. In-Flight Prevention

```javascript
const inFlightSessions = new Set()

if (inFlightSessions.has(sessionID)) {
  return // Skip concurrent calls
}
inFlightSessions.add(sessionID)
// ... process ...
inFlightSessions.delete(sessionID)
```

---

## Testing Strategy

### Unit Tests

```javascript
// storage.test.js
describe('readState', () => {
  test('returns null if file does not exist', () => {})
  test('parses frontmatter correctly', () => {})
  test('handles ultrawork flag', () => {})
})
```

### Integration Tests

```javascript
// loop-integration.test.js
describe('ultrawork loop', () => {
  test('transitions to verification on DONE', async () => {})
  test('completes on VERIFIED', async () => {})
  test('continues on verification failure', async () => {})
})
```

---

## Future Enhancements

### Planned Features

1. **Loop history** - Store completed loops for reference
2. **Statistics** - Track iterations, time, success rate
3. **Export/Import** - Share loop configurations
4. **Custom triggers** - User-defined completion signals
5. **Multi-session** - Coordinate multiple loop sessions

### Possible Optimizations

1. **Incremental transcript parsing** - Only parse new lines
2. **Batched API calls** - Reduce network overhead
3. **State compression** - Minimize disk I/O
4. **Smart continuation** - Context-aware prompts

---

## Debugging Tips

### Enable Debug Logging

```javascript
// Add to gemini-extension.json
{
  "geminiLoop": {
    "debug": true,
    "logFile": ".gemini-loop-debug.log"
  }
}
```

### Inspect State

```bash
cat .agent_working_dir/loops/.gemini-loop-state.md
```

### View Transcripts

```bash
cat .gemini/sessions/sess-xxx.jsonl
```

### Check Loop History

```bash
/loop-list
```

---

## Migration from ralph-loop

### Differences

| Feature | ralph-loop (Opencode) | gemini-loop |
|---------|----------------------|-------------|
| Plugin API | `@opencode-ai/plugin` | Gemini CLI native |
| State file | `.sisyphus/ralph-loop.local.md` | `.gemini-loop-state.md` |
| Hook tier | Session | Session |
| Commands | Built-in | Extension scripts |

### Porting Guide

1. Replace `PluginInput` → Gemini CLI context
2. Update API calls to Gemini format
3. Change state file path
4. Adapt command scripts

---

## References

- **Original**: `oh-my-opencode/src/hooks/ralph-loop/`
- **Gemini CLI Docs**: `docs/` directory
- **Extension Format**: `gemini-extension.json` schema

---

## Changelog

### v1.0.0 (2026-03-08)

- Initial port from oh-my-opencode
- Standard loop mode
- Ultrawork mode with Oracle verification
- CLI commands
- State persistence
- Debug logging
