# Planning Guidelines

> **Fail to plan, plan to fail.** — Good planning prevents rework.

This document defines the planning process that agents must follow before executing any complex task.

## Core Principle

**Plan thoroughly before acting.** Every minute spent planning saves 10 minutes of debugging and rework.

## Planning Process

### Phase 0: Pre-Planning (Before Any Work)

#### 1. Clarify Task Goals

**Before creating any plan, ensure you understand what the user wants.**

**DO:**
- Restate the task in your own words to confirm understanding
- Ask clarifying questions if any aspect is ambiguous
- Identify the **success criteria** — how will the user know this is complete?
- Document the goal in `task_plan.md` under "## Goal"

**Example clarifying questions:**
```
- "You mentioned adding authentication — do you want email/password, OAuth, or both?"
- "Should this feature work offline, or require an internet connection?"
- "What's the priority: speed of implementation or code maintainability?"
- "Are there any constraints I should know about (budget, timeline, technology)?"
```

**DON'T:**
- Start planning without confirming you understand the task
- Make assumptions about requirements without asking
- Begin coding until the goal is crystal clear

#### 2. Analyze Project Structure

**For tasks involving code changes, understand the codebase first.**

**Steps:**
1. **Map the project structure**
   ```bash
   !{find . -type f -name "*.py" -o -name "*.js" -o -name "*.ts" | head -50}
   ```

2. **Identify relevant files** — Find files that will need modification
   - Look for existing similar functionality
   - Understand the architecture pattern (MVC, layers, modules)
   - Note naming conventions and code style

3. **Pinpoint modification points** — Document exact locations:
   ```markdown
   ## Code Modification Points
   
   | File | Lines | Change Type | Description |
   |------|-------|-------------|-------------|
   | `src/api/routes.py` | 45-60 | Modify | Add new `/users` endpoint |
   | `src/models/user.py` | 1-30 | Create | New User model class |
   | `tests/test_api.py` | 100-120 | Add | Test for new endpoint |
   ```

4. **Check dependencies** — What libraries or modules are already in use?
   - Review `package.json`, `requirements.txt`, `Cargo.toml`, etc.
   - Note existing dependencies that could be leveraged
   - Identify if new dependencies are needed

**Document findings in `findings.md` under "## Project Analysis"**

#### 3. Research and Knowledge Gathering

**Before deciding on an approach, gather relevant information.**

**What to research:**
- **Existing solutions** — Has this been solved before in the codebase?
- **Best practices** — What's the standard approach for this type of problem?
- **Library/API documentation** — If using external tools, read the docs first
- **Similar implementations** — Look for patterns you can follow

**Apply the 2-Action Rule:**
- After every 2 view/read/search operations, **update `findings.md`**
- Don't let discoveries get lost in context

**Document in `findings.md`:**
```markdown
## Research Findings

### Topic: [What you researched]
- **Source:** [File/URL/Documentation]
- **Key insights:**
  - Insight 1
  - Insight 2
- **How it applies to this task:** [Connection to your implementation]
```

#### 4. Develop Multiple Solutions

**Create 2-3 viable approaches before recommending one.**

**For each solution, document:**

| Aspect | Description |
|--------|-------------|
| **Approach** | Brief description of the solution |
| **Pros** | Advantages (speed, maintainability, simplicity) |
| **Cons** | Disadvantages (complexity, dependencies, risk) |
| **Effort** | Estimated time/complexity (S/M/L/XL) |
| **Dependencies** | New libraries or changes required |

**Example:**

```markdown
## Proposed Solutions

### Solution A: Use Existing Library X
- **Description:** Leverage library X which provides built-in functionality
- **Pros:** Fast implementation, well-tested, minimal code
- **Cons:** Adds new dependency, less customization
- **Effort:** Small (2-3 hours)
- **Dependencies:** `npm install library-x`

### Solution B: Custom Implementation
- **Description:** Build the functionality from scratch
- **Pros:** Full control, no new dependencies, tailored to needs
- **Cons:** More code to maintain, longer implementation time
- **Effort:** Medium (1-2 days)
- **Dependencies:** None

### Recommendation
**Solution A** is recommended because [rationale]. It provides the best balance of speed and reliability for this use case.
```

**Let the user choose** — Present options and let them decide which approach to take.

#### 5. Create Detailed Plan

**Once the approach is confirmed, create a detailed phase breakdown.**

**In `task_plan.md`:**

```markdown
## Phases

### Phase 1: Setup and Preparation
- [ ] Install required dependencies
- [ ] Create new files: `src/new_module.py`, `tests/test_module.py`
- [ ] Set up configuration in `.env`
- **Status:** pending

### Phase 2: Core Implementation
- [ ] Implement function A in `src/module.py` (lines 10-50)
- [ ] Implement function B in `src/module.py` (lines 52-100)
- [ ] Add error handling
- **Status:** pending

### Phase 3: Testing
- [ ] Write unit tests for function A
- [ ] Write unit tests for function B
- [ ] Run test suite: `npm test`
- [ ] Fix any failing tests
- **Status:** pending

### Phase 4: Integration
- [ ] Connect new module to existing codebase
- [ ] Test end-to-end flow
- [ ] Update documentation
- **Status:** pending
```

**Each task should be:**
- **Specific** — Clear what needs to be done
- **Actionable** — Can be completed in one sitting
- **Testable** — You can verify when it's done
- **Located** — Include file paths and line numbers where applicable

---

### Phase 1+: Execution with Adaptive Planning

#### 6. Execute According to Plan

**Follow the plan you created, but remain flexible.**

**During execution:**

1. **Update progress as you go**
   - Mark tasks as complete: `- [x] Task name`
   - Update phase status: `**Status:** in_progress` → `**Status:** complete`
   - Log what you did in `progress.md`

2. **Log errors immediately**
   - When something fails, add it to `task_plan.md` under "Errors Encountered"
   - Note the attempt number and what you tried
   - Document the resolution

3. **Apply the 2-Action Rule**
   - After every 2 view/read operations, update `findings.md`
   - Capture discoveries before they're forgotten

#### 7. Adapt When Necessary

**If you encounter obstacles that require changing the plan:**

**DO:**
1. **Pause and assess** — Don't keep trying the same failing approach
2. **Document the issue** — Add to "Errors Encountered" table
3. **Update the plan** — Modify `task_plan.md` to reflect the new approach
4. **Note the change** — In "Decisions Made" table, document why you changed direction
5. **Continue with updated plan** — Proceed with the new approach

**Example plan update:**
```markdown
## Decisions Made

| Decision | Rationale | Date |
|----------|-----------|------|
| Switched from Solution A to Solution B | Solution A had compatibility issues with existing auth system | 2026-02-18 |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| TypeError: Cannot read property of undefined | 1 | Added null check before accessing property |
| ModuleNotFoundError: No module named 'x' | 2 | Switched to alternative library 'y' |
```

**DON'T:**
- Silently change approach without documenting why
- Keep repeating the same failing action
- Forget to update `task_plan.md` when the plan changes

#### 8. Verify Completion

**Before marking the task as complete:**

**Checklist:**
- [ ] All phases in `task_plan.md` are marked complete
- [ ] All checkboxes are checked (`- [x]`)
- [ ] `findings.md` contains all research and decisions
- [ ] `progress.md` has session log with test results
- [ ] All deliverables are created and working
- [ ] Tests pass (if applicable)
- [ ] Documentation is updated (if applicable)

**Run `/planning:complete` to verify.**

---

## Planning Templates

### Pre-Planning Checklist

Before starting any task, verify:

- [ ] **Goal is clear** — Can restate in one sentence
- [ ] **Success criteria defined** — Know what "done" looks like
- [ ] **Clarifying questions asked** — No ambiguities remaining
- [ ] **Project structure analyzed** — Know which files to modify
- [ ] **Research completed** — Gathered relevant information
- [ ] **Multiple solutions considered** — Have options to present
- [ ] **User confirmed approach** — Got approval on recommended solution
- [ ] **Detailed plan created** — Phases with specific tasks

### Task Plan Structure

```markdown
# Task Plan: [Title]

## Goal
[One clear sentence]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Project Analysis
| File | Lines | Change | Description |
|------|-------|--------|-------------|
|      |       |        |             |

## Proposed Solutions
[Present 2-3 options with pros/cons]

## Recommended Approach
[Your recommendation and why]

## Phases
[Detailed phase breakdown with tasks]

## Decisions Made
[Track changes and rationale]

## Errors Encountered
[Log every error and resolution]
```

---

## Key Principles

### 1. Plan First, Code Later

> "Give me six hours to chop down a tree and I will spend the first four sharpening the axe." — Abraham Lincoln

Time spent planning is never wasted. Rushing to code without a plan leads to:
- Missed requirements
- Wrong implementation
- Rework and debugging
- Frustrated users

### 2. Document Everything

Your context window is limited. Files are permanent:
- **Discoveries** → `findings.md`
- **Decisions** → `task_plan.md` (Decisions Made table)
- **Progress** → `progress.md`
- **Errors** → `task_plan.md` (Errors Encountered table)

### 3. Never Repeat Failures

The "Errors Encountered" table exists for a reason:
- Log every error, even if fixed quickly
- Note the attempt number
- Document what worked

**If you try the same thing 3 times and it fails, mutate your approach.**

### 4. Plans Evolve

A plan is not a contract. It's a living document:
- Update when you learn new information
- Change when obstacles appear
- Document why changes were made

**The goal is not to follow the plan perfectly — it's to complete the task successfully.**

### 5. User Collaboration

Planning is collaborative:
- Ask clarifying questions
- Present multiple options
- Let the user decide on approach
- Confirm before making major changes

---

## Quick Reference

| When | Action | File to Update |
|------|--------|----------------|
| Task unclear | Ask clarifying questions | — |
| Starting research | Map project structure | `findings.md` |
| After 2 view ops | Capture findings | `findings.md` |
| Before coding | Present solutions | `task_plan.md` |
| After decision | Document rationale | `task_plan.md` |
| Task complete | Mark checkbox | `task_plan.md` |
| Error occurs | Log immediately | `task_plan.md` |
| Approach changes | Note why | `task_plan.md` |
| Phase done | Update status | `task_plan.md`, `progress.md` |
| Session ends | Log progress | `progress.md` |
