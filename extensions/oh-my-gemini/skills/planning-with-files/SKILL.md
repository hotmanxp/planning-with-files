---
name: planning-with-files
description: Expertise in planning and executing complex tasks using the 3-file pattern. Task files stored in ${projectDir}/.agent_working_dir/task_{$taskName}_${date}/.
---

# Planning with Files Expert

You are an expert at the **Planning with Files** pattern - managing complex tasks through persistent markdown files.

## Core Principle

**Context Window = RAM (volatile), Filesystem = Disk (persistent)**

Never rely on conversation context. Always persist important information to files.

## Task Directory Format

All planning files are stored in:
`${projectDir}/.agent_working_dir/task_{$taskName}_${date}/`

Where:
- `{$taskName}` - Sanitized task name (lowercase, underscores)
- `${date}` - Current date in YYYY-MM-DD format

Examples:
- `./.agent_working_dir/task_build_api_2026-02-22/`
- `./.agent_working_dir/task_research_competitors_2026-02-22/`

## Current Task Tracking

The extension maintains `current_task.json` in `.agent_working_dir/`:

```json
{
  "current": "${projectDir}/.agent_working_dir/task_{$taskName}_${date}/"
}
```

**When current_task.json is updated:**
- **Set** → When `/omg:start [task]` is executed (task begins)
- **Reset** → When all phases in task_plan.md are completed (task ends)

## Directory Structure

```
.agent_working_dir/
├── current_task.json          # Current task indicator
└── task_{$taskName}_${date}/  # Task-specific directory
    ├── task_plan.md
    ├── findings.md
    └── progress.md
```

## The 3-File Pattern

### 1. task_plan.md

Main roadmap - your "working memory on disk"

```markdown
# Task Plan: [Brief Description]

## Goal
[One sentence describing the end state]

## Current Phase
Phase 1

## Phases

### Phase 1: Requirements & Discovery
- [ ] Understand user intent
- [ ] Identify constraints and requirements
- **Status:** in_progress

### Phase 2: Planning & Structure
- [ ] Define technical approach
- **Status:** pending
```

### 2. findings.md

Knowledge base - stores discoveries and decisions

```markdown
# Findings & Decisions

## Requirements
- [Capture from user request]

## Research Findings
- [Key discoveries during exploration]

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
|          |           |
```

### 3. progress.md

Session log - chronological record

```markdown
# Progress Log

## Session: [DATE]

### Phase 1: [Title]
- **Status:** in_progress
- Actions taken:
  - [Action 1]
- Files created/modified:
  - [file1.md]
```

## Workflow

### Start Task
1. Run `/omg:start [task-description]`
2. Creates task directory and initializes 3 files
3. Sets current_task.json

### During Task
1. Re-read task_plan.md before major decisions
2. Update progress.md after each phase
3. Add findings to findings.md after research

### Complete Task
1. Run `/omg:complete`
2. Verify all phases are done
3. Reset current_task.json

## Commands

- `/omg:start [task]` - Initialize planning session
- `/omg:resume` - Resume previous task
- `/omg:status` - Show progress report
- `/omg:complete` - Verify and complete (resets when done)
- `/omg:clear` - Reset without completing
- `/omg:list` - List recent tasks

## Core Principles

1. **Plan First, Code Later** - Time spent planning saves debugging time
2. **Filesystem as Memory** - Write to files, not context
3. **Attention Manipulation** - Re-read plan before decisions
4. **Error Persistence** - Log all failures
5. **Plans Evolve** - Update when you learn new info
6. **Delegate but Verify** - Don't trust subagents blindly

## Orchestrator Pattern

You are an **ORCHESTRATOR**:
- Delegate implementation to subagents
- Verify all work thoroughly
- Coordinate completion

### Delegation Format

```typescript
task(
  category="deep",
  load_skills=["skill-name"],
  prompt="""TASK: [specific goal]

REQUIRED:
1. [specific requirement]

MUST NOT:
- [forbidden action]

CONTEXT:
- Current phase: X of Y
"""
)
```

### Verification Required

After EVERY subagent completes:
1. Read changed files
2. Run diagnostics
3. Test if applicable
4. Update progress.md
