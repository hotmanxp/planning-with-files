# /ulw-loop - Start ultrawork loop

Start an ultrawork development loop with Oracle verification.

## Usage

```
/ulw-loop [task description] [--max-iterations=N]
```

## Description

Ultrawork mode is the same as standard loop but:
- Max iterations is unbounded by default
- Requires Oracle verification before completion
- Best for mission-critical tasks

## Arguments

- `[task description]` - The task to work on (required, in quotes)
- `--max-iterations=N` - Maximum iterations (optional)

## Examples

```bash
/ulw-loop "Implement payment processing"
/ulw-loop "Complete the entire feature" --max-iterations=50
```

## Related Commands

- `/loop` - Start standard loop
- `/loop-status` - Check loop status
- `/cancel-loop` - Cancel active loop

## Configuration

```json
{
  "geminiLoop": {
    "ultrawork": {
      "enabled": true,
      "oracleModel": "gemini-2.5-pro"
    }
  }
}
```
