# /loop-status - Show loop status

Display the current state of the active Gemini Loop.

## Usage

```
/loop-status
```

## Description

Shows detailed information about the current loop:
- Active status
- Current iteration
- Maximum iterations
- Mode (Standard/Ultrawork)
- Task description
- Progress percentage

## Examples

```bash
/loop-status
```

## Output Example

```
╔══════════════════════════════════════════════════════════╗
║                 Gemini Loop Status                       ║
╚══════════════════════════════════════════════════════════╝

📊 Loop State:
   Active: ✅ Yes
   Iteration: 5 / 100
   Mode: ⚡ Ultrawork
   Strategy: continue
   Started: 3/8/2026, 10:30:00 AM

📝 Task:
   Build a REST API with user authentication

📈 Progress: 5/100 (5%)
```

## Related Commands

- `/loop` - Start a loop
- `/ulw-loop` - Start ultrawork loop
- `/cancel-loop` - Cancel active loop
- `/loop-list` - List historical loops
