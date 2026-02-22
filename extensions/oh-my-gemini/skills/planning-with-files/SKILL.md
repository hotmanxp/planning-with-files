---
name: planning-with-files
description: Expertise in planning and executing complex tasks using the 3-file pattern. Task files stored in ${projectDir}/.agent_working_dir/task_{$taskName}_${date}/.
---

# Planning with Files Expert

You are an expert at the **Planning with Files** pattern, the exact workflow that made Manus AI worth $2 billion to Meta.

## Utility Scripts

This skill includes utility scripts in `scripts/` for task management:

| Script | Purpose | Called By |
|--------|---------|-----------|
| `set-current-task.js` | Create task directory, initialize files, set current_task.json | `/planning:start` |
| `resume-task.js` | Validate and load existing task | `/planning:resume` |
| `list-tasks.js` | List all planning tasks | `/planning:list` |

**Usage:**
```bash
# Start a new task
node scripts/set-current-task.js [task-name]

# Resume existing task
node scripts/resume-task.js

# List all tasks
node scripts/list-tasks.js
```

## Activation Triggers

Activate this skill when the user:
- Has a multi-step task (3+ steps)
- Needs to research and synthesize information
- Is building or creating something complex
- Mentions "planning", "roadmap", or "structured approach"

## Task Directory Format

All planning files are stored in:
`${projectDir}/.agent_working_dir/task_{$taskName}_${date}/`

Where:
- `{$taskName}` - Sanitized task name (lowercase, underscores)
- `${date}` - Current date in YYYY-MM-DD format

Examples:
- `./.agent_working_dir/task_build_api_2026-02-18/`
- `./.agent_working_dir/task_research_competitors_2026-02-18/`

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

## Planning Guidelines

**Before starting any task, follow the planning process defined in `references/planning.md`.**

### Pre-Planning Checklist

Before creating any plan, verify:

- [ ] **Goal is clear** — Can restate in one sentence
- [ ] **Clarifying questions asked** — No ambiguities remaining
- [ ] **Project structure analyzed** — Know which files to modify (for code tasks)
- [ ] **Code modification points identified** — File paths + line numbers documented
- [ ] **Research completed** — Gathered relevant information
- [ ] **Multiple solutions proposed** — 2-3 options with pros/cons
- [ ] **User confirmed approach** — Got approval on recommended solution
- [ ] **Detailed plan created** — Phases with specific, actionable tasks

### Planning Process Summary

1. **Clarify Goals** — Ask questions, confirm understanding, define success criteria
2. **Analyze Structure** — Map codebase, identify modification points (file + lines)
3. **Research** — Gather information, apply 2-Action Rule, document in findings.md
4. **Propose Solutions** — Present 2-3 options with pros/cons/effort
5. **Create Plan** — Detailed phases with tasks in task_plan.md
6. **Execute & Adapt** — Follow plan, log errors, update when needed
7. **Verify Completion** — All phases done, all files updated

**See `references/planning.md` for the complete planning guidelines.**

---

## Code Project Analysis Workflow

**If the task involves modifying project code, the FIRST phase of your plan MUST be project research and solution proposal.**

### Plan Structure for Code Tasks

When creating `task_plan.md` for code modification tasks, structure it as follows:

```markdown
# Task Plan: [Brief Description]

## Goal
[One sentence describing the end state]

## Current Phase
Phase 1

## Phases

### Phase 1: Project Research & Solution Design
- [ ] Analyze project structure and architecture
- [ ] Identify affected modules and files
- [ ] Research existing patterns and conventions
- [ ] Develop 2-3 alternative solutions
- [ ] Document findings in findings.md
- [ ] Present solutions to user and get confirmation
- **Status:** in_progress

### Phase 2: [Implementation Phase - depends on chosen solution]
- [ ] [Tasks based on confirmed solution]
- **Status:** pending

[Continue with more phases...]

## Decisions Made
| Decision | Rationale | Date |
|----------|-----------|------|
|          |           |      |
```

### Phase 1: Project Research & Solution Design

This phase MUST be completed BEFORE any implementation. The goal is to:

1. **Understand the project architecture**
2. **Identify all affected modules/files**
3. **Develop multiple solutions with trade-offs**
4. **Get user confirmation on the approach**

#### Research Activities

During this phase, perform these research activities:

| Activity | Purpose | Output |
|----------|---------|--------|
| Read project structure | Understand module organization | Directory map in findings.md |
| Find entry points | Locate main application flow | File paths in findings.md |
| Identify patterns | Understand coding conventions | Pattern notes in findings.md |
| Analyze dependencies | Find external/internal dependencies | Dependency list in findings.md |
| Review similar code | Find existing patterns to follow | Code references in findings.md |

#### Document in findings.md

After every 2 research actions (2-Action Rule), update `findings.md`:

```markdown
# Findings & Decisions

## Requirements
- [User's original request]

## Project Structure
- [Key directories and purposes]
- [Module organization]

## Entry Points
- [Main entry files]
- [Related module entry points]

## Core Modules
- [Important modules and responsibilities]

## Technology Stack
- [Frameworks, libraries, languages]

## Coding Conventions
- [Observed patterns and conventions]
- [File naming conventions]
- [Code style patterns]

## Proposed Solutions

### Solution A: [Name]
**Description:** [What this approach entails]

**Affected Files:**
- `path/to/file1.ts` - [what changes]
- `path/to/file2.ts` - [what changes]

**Effort:** Low/Medium/High (time estimate)

**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

### Solution B: [Name]
[Same structure as Solution A]

### Solution C: [Name] (Optional)
[Same structure as Solution A]

### Recommendation
I recommend **Solution [X]** because [rationale]. It balances [factors] while minimizing [risks].

## Technical Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Chose Solution A | [Reason] | [Date] |
```

#### Present Solutions to User

After completing research and developing solutions:

1. **Present all 2-3 solutions** to the user with clear trade-offs
2. **Explain your recommendation** and reasoning
3. **Wait for user confirmation** before proceeding
4. **Document the decision** in both `findings.md` and `task_plan.md`

### After Solution Confirmation

Once the user confirms the approach:

1. **Update `task_plan.md` Phase 1** — Mark as complete
2. **Update `task_plan.md` Phase 2+** — Ensure implementation tasks reflect the chosen solution
3. **Update `findings.md`** — Add the decision to "Technical Decisions" table
4. **Proceed with implementation** — Follow the updated plan

### Adaptive Planning During Execution

During implementation, if you discover:

- Additional files need modification
- The chosen approach has unforeseen issues
- A better solution exists

**Then:**

1. **Pause implementation** — Don't continue with a flawed plan
2. **Document in `task_plan.md`** — Add to "Errors Encountered" table
3. **Update `findings.md`** — Add new discoveries to "Research Findings"
4. **Re-evaluate solutions** — May need to present alternative to user
5. **Update the plan** — Modify `task_plan.md` phases to reflect new approach
6. **Document the change** — Add to "Decisions Made" table with rationale
7. **Inform the user** — Explain the change and get confirmation if significant

---

## File Templates

The skill provides templates for each planning file in `templates/`. Use these as starting points:

### task_plan.md Template

Location: `templates/task_plan.md`

**Purpose:** Main roadmap for the task - your "working memory on disk"

**Key sections:**
- Goal - One sentence describing the end state
- Current Phase - Track which phase you're working on
- Phases - Break task into 3-7 phases with checkboxes
- Key Questions - Questions to answer during the task
- Decisions Made - Technical decisions with rationale
- Errors Encountered - Log every error and resolution

**When to create:** FIRST, before starting any work

**When to update:** After completing each phase or encountering errors

### findings.md Template

Location: `templates/findings.md`

**Purpose:** Knowledge base - stores discoveries and decisions

**Key sections:**
- Requirements - What the user asked for
- Research Findings - Key discoveries from exploration
- Technical Decisions - Architecture choices with reasoning
- Issues Encountered - Problems and solutions
- Resources - URLs, file paths, API references
- Visual/Browser Findings - Capture from images/browser

**When to update:** After EVERY 2 view/browser/search operations (2-Action Rule)

### progress.md Template

Location: `templates/progress.md`

**Purpose:** Session log - chronological record of what happened

**Key sections:**
- Session entries with date and phase
- Actions taken
- Files created/modified
- Test Results table
- Error Log with timestamps
- 5-Question Reboot Check

**When to update:** After completing each phase or encountering errors

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

[Continue with more phases...]
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

## Core Principles

1. **Plan First, Code Later** — Time spent planning saves 10x in debugging
2. **Filesystem as Memory** — Write to files, not context
3. **Attention Manipulation** — Re-read plan before major decisions
4. **Error Persistence** — Log all failures, never repeat the same mistake
5. **Plans Evolve** — Update the plan when you learn new information
6. **User Collaboration** — Present options, let user decide approach

## The 2-Action Rule

After every 2 view/read operations, save findings to `findings.md`. This prevents context stuffing.

## Error Handling

When something fails:
1. Log it in `task_plan.md` under "Errors Encountered"
2. Note the attempt number
3. Document the resolution
4. **Never try the same thing 3 times** — mutate your approach

## Adaptive Planning

When the plan needs to change:

1. **Pause and assess** — Don't keep trying the same failing approach
2. **Document the issue** — Add to "Errors Encountered" table
3. **Update the plan** — Modify task_plan.md to reflect new approach
4. **Note the change** — In "Decisions Made" table, document why
5. **Continue** — Proceed with the updated plan

## Completion Checklist

Before stopping, verify:
- [ ] All checkboxes in task_plan.md are checked
- [ ] All phases marked complete
- [ ] Findings documented in findings.md
- [ ] Progress logged in progress.md
- [ ] Deliverables created and working
- [ ] Tests pass (if applicable)

## Commands Available

- `/planning:start [task]` - Initialize planning session (sets current_task.json)
- `/planning:resume` - Resume a previous task (user-initiated)
- `/planning:status` - Show progress report
- `/planning:complete` - Verify completion (resets current_task.json when done)

## Related Documentation

- **Planning Guidelines** — `references/planning.md` (complete planning process)
- **Templates** — `templates/` (task_plan.md, findings.md, progress.md)
- **Examples** — `references/examples.md` (real-world usage patterns)
