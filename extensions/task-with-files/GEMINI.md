## Task Analysis Rules

When a user presents a task, follow these rules:

### Complex Tasks → Activate `planning-with-files`

Activate the `planning-with-files` skill if the task meets ANY of these conditions:
- Multi-step tasks (3+ steps)
- Requires changes across multiple modules or files
- Research tasks (requiring lookup, exploration, analysis)
- Requires parallel execution of multiple subtasks
- Involves external libraries or unfamiliar tech stacks
- Open-ended tasks ("improve", "refactor", "add feature")

### Simple Tasks → Use WriteTodos

If the task doesn't meet the complex conditions above, use the built-in `WriteTodos` tool:
- Single file modifications
- Simple question answers
- Clear fix tasks
- Simple changes at known locations

### Critical Rule

**Once `planning-with-files` is activated, you MUST follow these rules:**

1. **Stop using TodoWrite tool** — All task management must go through `task_plan.md`, `findings.md`, `progress.md`
2. **Write all discoveries to files** — Don't rely on context to store information
3. **Follow the skill specification** — Execute according to planning-with-files workflow and principles

---

## Quick Decision Guide

| Pattern | Action |
|---------|--------|
| "How to...", "Explain..." | WriteTodos |
| "Implement...", "Add...", "Create..." | Analyze complexity |
| "Look into...", "Check...", "Investigate..." | Analyze complexity |
| Complex requirements, multiple modules | planning-with-files |
| Simple fixes, single file | WriteTodos |
---

## Commands

| Command | Description |
|---------|-------------|
| `/task:start [task]` | Start a new planning task |
| `/task:resume` | Resume an incomplete task |
| `/task:complete` | Mark task as complete and reset |
| `/task:clear` | Force reset current task (use when task is abandoned) |
| `/task:status` | Show current task progress |
| `/task:list` | List all tasks |

**Summary**: Complex tasks use planning-with-files, simple tasks use WriteTodos. Once the former is activated, you must abandon TodoWrite.
