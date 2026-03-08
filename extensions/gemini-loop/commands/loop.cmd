# /loop - Start development loop

Start a self-referential development loop that continues until task completion.

## Usage

```
/loop [task description] [--max-iterations=N] [--ultrawork]
```

## Arguments

- `[task description]` - The task to work on (required, in quotes)
- `--max-iterations=N` - Maximum iterations (optional, default: 100)
- `--ultrawork, -u` - Enable ultrawork mode with Oracle verification

## Examples

```bash
/loop "Build a REST API with authentication"
/loop "Refactor the payment module" --max-iterations=50
/loop "Fix all bugs" --ultrawork
```

## Related Commands

- `/ulw-loop` - Start ultrawork loop (shortcut)
- `/loop-status` - Check loop status
- `/cancel-loop` - Cancel active loop
- `/loop-list` - List historical loops

## Configuration

Configure in `gemini-extension.json`:

```json
{
  "geminiLoop": {
    "defaultMaxIterations": 100,
    "ultrawork": {
      "enabled": true
    }
  }
}
```
