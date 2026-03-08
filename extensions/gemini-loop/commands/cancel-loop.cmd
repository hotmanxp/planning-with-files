# /cancel-loop - Cancel active loop

Cancel the currently running Gemini Loop.

## Usage

```
/cancel-loop
```

## Description

Stops the active development loop and clears the state file.
The agent will stop iterating and you can start a new loop anytime.

## Examples

```bash
/cancel-loop
```

## Related Commands

- `/loop` - Start a loop
- `/ulw-loop` - Start ultrawork loop
- `/loop-status` - Check loop status

## Output

Success:
```
✅ Loop cancelled successfully.
The agent has been notified to stop the loop.
You can start a new loop anytime with /loop.
```

No active loop:
```
❌ No active loop found.
There is no loop currently running.
Use /loop to start a new loop.
```
