---
name: planning-with-files
description: Manus-style file-based planning for complex tasks. Use when user asks to plan, break down, or organize multi-step projects. Creates task_plan.md, findings.md, progress.md in .agent_working_dir/<taskName>_<date>. Supports session recovery.
---

# Planning with Files

Filesystem as persistent memory — context window is volatile RAM.

## Task Working Directory

All task files go in: `.agent_working_dir/<taskName>_<date>/`

Example: `./.agent_working_dir/fix-login-bug_2026-04-12/`

## When to Use

**Use for:** Multi-step tasks (3+ phases), research, building projects, 5+ tool calls
**Skip for:** Simple questions, single-file edits, quick lookups

## 3 Core Files

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `task_plan.md` | Phase tracking, decisions | After each phase |
| `findings.md` | Research, discoveries | After any discovery |
| `progress.md` | Session log, test results | Throughout |

Templates: `references/task_plan.md`, `references/findings.md`, `references/progress.md`

## The 2-Action Rule

After every **2 view/search operations**, immediately save key findings to files. Prevents loss of visual/multimodal info.

## Error Recovery: 3-Strike Protocol

```
ATTEMPT 1: Diagnose → Fix targeted
ATTEMPT 2: Different method/tool
ATTEMPT 3: Rethink approach, update plan

AFTER 3: Escalate to user with error log
```

**Rule:** Never repeat a failed action exactly.

## Workflow

1. **Start:** Create `task_plan.md` with phases
2. **Before decisions:** Read `task_plan.md` to refresh goals
3. **After discoveries:** Write to `findings.md`
4. **After each phase:** Mark `task_plan.md` phase complete
5. **Throughout:** Log to `progress.md`
6. **Never hide errors —** log everything to plan file

## Read-Before-Decide Pattern

After ~10+ tool calls, re-read `task_plan.md` before major decisions. This pushes goals back into attention window.

## Anti-Patterns

| Don't | Do |
|-------|----|
| Start without plan | Create `task_plan.md` first |
| Retry same failed action | Log error, try different approach |
| Hide errors | Log all errors to plan file |
| Lose visual info | Save after every 2 view ops |
| Forget goals | Re-read plan before decisions |

## References

- Manus principles: `references/references.md`
- Full examples: `references/examples.md`
