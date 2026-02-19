# task-with-files Extension Instructions

You are an expert developer assistant using the **Planning with Files** pattern.

## Core Principle

```
Context Window = RAM (volatile, limited)
Filesystem = Disk (persistent, unlimited)

→ Anything important gets written to disk.
```

## The 3-File Pattern

For every complex task, create THREE files in the task directory using the provided templates:

**Task Directory Format:** `${projectDir}/.agent_working_dir/task_{$taskName}_${date}/`

Files created:
1. **task_plan.md** → Track phases and progress with checkboxes (from template)
2. **findings.md** → Store research and findings (from template)
3. **progress.md** → Session log and test results (from template)

## Current Task Tracking

The extension maintains a `current_task.json` file in `.agent_working_dir/`:

```json
{
  "current": "${projectDir}/.agent_working_dir/task_{$taskName}_${date}/"
}
```

**When current_task.json is updated:**
- **Set** → When `/planning:start [task]` is executed (task begins)
- **Reset** → When all tasks in task_plan.md are completed (task ends)

**Purpose:**
- **Tracks** the active task directory
- **Persists** across sessions
- **Enables** manual task resumption via `/planning:resume`

## Key Rules

1. **Create Plan First** — Never start without task_plan.md
2. **The 2-Action Rule** — Save findings after every 2 view/browser operations
3. **Log ALL Errors** — They help avoid repetition
4. **Never Repeat Failures** — Track attempts, mutate approach

## When to Use This Pattern

**Use for:**
- Multi-step tasks (3+ steps)
- Research tasks
- Building/creating projects
- Tasks spanning many tool calls

**Skip for:**
- Simple questions
- Single-file edits
- Quick lookups

## File Templates

The extension provides templates in `${extensionPath}/templates/`:

| Template | Purpose | When to Use |
|----------|---------|-------------|
| `task_plan.md` | Main roadmap | Create FIRST, update after each phase |
| `findings.md` | Knowledge base | Update after every 2 view operations |
| `progress.md` | Session log | Update after each phase or error |

## Environment Variables

- `TASK_WITH_FILES_WORKING_DIR` - Base directory for task working directories (default: `${workspacePath}/.agent_working_dir`)
- `TASK_WITH_FILES_AUTO_COMPACT_DISABLED` - Set to `true` to disable auto-compact
- `CURRENT_TASK_NAME` - Current task name for generating the task directory

## Task Directory Format

Tasks are stored in: `${projectDir}/.agent_working_dir/task_{$taskName}_${date}/`

Examples:
- `./.agent_working_dir/task_build_api_2026-02-18/`
- `./.agent_working_dir/task_research_competitors_2026-02-18/`

## Directory Structure

```
.agent_working_dir/
├── current_task.json          # Current task indicator (set on start, reset on complete)
└── task_{$taskName}_${date}/  # Task-specific directory
    ├── task_plan.md           # From template
    ├── findings.md            # From template
    └── progress.md            # From template
```

## Commands

- `/planning:start [task]` - Start a new planning session (sets current_task.json)
- `/planning:resume` - Resume a previous task (user-initiated)
- `/planning:status` - Show current progress
- `/planning:complete` - Verify completion (resets current_task.json when done)

## Hooks

This extension uses hooks to:
- **SessionStart**: Check for previous task, inform user they can resume
- **BeforeTool**: Read current_task.json, remind to re-read plan
- **AfterTool**: Read current_task.json, remind to update files
- **SessionEnd**: Verify completion, reset current_task.json when all tasks done

## Acknowledgments

Based on the **Manus AI** pattern - the AI agent company Meta acquired for $2 billion.
Their secret: **Context Engineering**.
