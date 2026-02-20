# task-with-files

**Transform your workflow with persistent markdown files for planning, progress tracking, and knowledge storage.**

Based on the **Manus AI Pattern** — the workflow that made Manus AI worth $2 billion to Meta.

## Core Principle

```
Context Window = RAM (volatile, limited)
Filesystem = Disk (persistent, unlimited)

→ Anything important gets written to disk.
```

## Quick Start

### Start a Planning Session

```bash
/planning:start [your-task-name]
```

This creates:
- A task directory: `.agent_working_dir/task_[task-name]_YYYY-MM-DD/`
- Three planning files: `task_plan.md`, `findings.md`, `progress.md`
- Tracks the task as active in `current_task.json`

### Resume a Task

```bash
/planning:resume
```

Loads your previous task and restores context.

### Check Status

```bash
/planning:status
```

Shows current progress at a glance.

### List All Tasks

```bash
/planning:list
```

Display all tasks with their goals and status.

### Complete a Task

```bash
/planning:complete
```

Verifies completion and generates a summary.

## Commands

| Command | Description |
|---------|-------------|
| `/planning:start [task]` | Start a new planning session |
| `/planning:resume` | Resume a previous task |
| `/planning:status` | Show current progress |
| `/planning:list` | List all tasks |
| `/planning:complete` | Verify and complete a task |

## The 3-File Pattern

Every task uses three persistent files:

### 1. task_plan.md — Your Roadmap

**Purpose:** Main roadmap for the task — your "working memory on disk"

**Contains:**
- Goal (one sentence)
- Current phase
- Phase breakdown with checkboxes
- Key questions
- Decisions made
- Errors encountered

**When to update:** After completing each phase or encountering errors

### 2. findings.md — Your Knowledge Base

**Purpose:** Stores discoveries, research, and decisions

**Contains:**
- Requirements
- Research findings
- Technical decisions
- Issues encountered
- Resources and links
- Visual/browser findings

**When to update:** After EVERY 2 view/read operations (**2-Action Rule**)

### 3. progress.md — Your Session Log

**Purpose:** Chronological record of what happened

**Contains:**
- Session entries with dates
- Actions taken
- Files modified
- Test results
- Error log with timestamps
- 5-Question Reboot Check

**When to update:** After completing each phase or encountering errors

## Directory Structure

```
.agent_working_dir/
├── current_task.json          # Tracks active task
└── task_[task-name]_YYYY-MM-DD/
    ├── task_plan.md           # Roadmap
    ├── findings.md            # Knowledge base
    └── progress.md            # Session log
```

## Key Principles

### 1. Plan First, Code Later

> "Give me six hours to chop down a tree and I will spend the first four sharpening the axe."

Time spent planning saves 10x in debugging and rework.

### 2. Filesystem as Memory

Write to files, not context. Your context window is limited — files are not.

### 3. The 2-Action Rule

After every 2 view/read/search operations, **update `findings.md`**. This prevents context loss.

### 4. Attention Manipulation

Re-read `task_plan.md` before major decisions to stay focused on the goal.

### 5. Error Persistence

Log ALL errors in `task_plan.md`. Never try the same thing 3 times — mutate your approach.

### 6. Plans Evolve

Update your plan when you learn new information. The goal is success, not rigid adherence.

## Hooks

The extension uses hooks to enhance your workflow:

| Hook | Trigger | Action |
|------|---------|--------|
| **SessionStart** | Session begins | Checks for resumable tasks |
| **BeforeTool** | Before tool use | Re-reads plan for context |
| **AfterTool** | After tool use | Reminds 2-Action Rule |
| **SessionEnd** | Session ends | Verifies completion status |

## Workflow Example

### 1. Start Task

```bash
/planning:start build-api
```

Output:
```
[task-with-files] ✓ Created task directory: .agent_working_dir/task_build-api_2026-02-19
[task-with-files] ✓ Created task_plan.md
[task-with-files] ✓ Created findings.md
[task-with-files] ✓ Created progress.md
```

### 2. Plan Your Approach

Edit `task_plan.md`:
```markdown
## Goal
Create REST API with user authentication

## Phases

### Phase 1: Requirements
- [x] Understand user needs
- [x] Identify constraints
- **Status:** complete

### Phase 2: Implementation
- [ ] Set up Express.js
- [ ] Add authentication
- **Status:** in_progress
```

### 3. Execute and Track

As you work:
- Mark tasks complete: `- [x]`
- Update phase status: `pending` → `in_progress` → `complete`
- Log discoveries in `findings.md`
- Record progress in `progress.md`

### 4. Complete

```bash
/planning:complete
```

Output:
```
✓ All phases complete!
✓ Task completed successfully
```

## The 5-Question Reboot Check

Before resuming after a break, verify you can answer:

1. **Where am I?** → Current phase in `task_plan.md`
2. **Where am I going?** → Remaining phases
3. **What's the goal?** → Goal statement
4. **What have I learned?** → See `findings.md`
5. **What have I done?** → See `progress.md`

If you can answer all 5, your context is solid.

## Error Handling

When something fails:

1. **Log it immediately** in `task_plan.md` under "Errors Encountered"
2. **Note the attempt number**
3. **Document the resolution**
4. **Never try the same thing 3 times** — mutate your approach

Example:
```markdown
## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| TypeError: Cannot read property | 1 | Added null check |
| ModuleNotFoundError | 2 | Switched to alternative library |
```

## Best Practices

### Do ✅
- Create `task_plan.md` FIRST, before any work
- Ask clarifying questions before planning
- Present 2-3 solutions with pros/cons
- Update files after every phase
- Log errors immediately
- Re-read plan before major decisions

### Don't ❌
- Start coding without a plan
- Let discoveries get lost in context
- Repeat the same failing approach
- Forget to update phase status
- Skip documentation to "save time"

## License

MIT

---

**Based on the Manus AI Pattern** — Context Engineering that transformed AI agent workflows.
