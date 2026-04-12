# Examples: Planning with Files

## Complete Task Example

**Request:** "Fix the login bug in the authentication module"

### Phase 1: Create Plan
```bash
Write task_plan.md
```

```markdown
# Task Plan: Fix Login Bug

## Goal
Identify and fix the login bug.

## Phases
- [x] Phase 1: Understand bug report ✓
- [ ] Phase 2: Locate relevant code (CURRENT)
- [ ] Phase 3: Identify root cause
- [ ] Phase 4: Implement fix
- [ ] Phase 5: Test and verify

## Status
**Currently in Phase 2**
```

### Phase 2: Research
```bash
Read task_plan.md        # Refresh goals
Grep "login" src/        # Find auth files
Write findings.md         # Store discovered files/errors
Edit task_plan.md         # Mark Phase 2 complete
```

### Phase 3-5: Iterate
```bash
Read task_plan.md         # Before each phase
Read findings.md          # Get context
# ... implement fix ...
Edit task_plan.md         # Update phase status
Write progress.md         # Log test results
```

## Error Recovery Pattern

### Wrong (Silent Retry)
```
Action: Read config.json
Error: File not found
Action: Read config.json  # Silent retry — loses error info
```

### Correct (Log and Pivot)
```
Action: Read config.json
Error: File not found

# Update task_plan.md:
## Errors
- config.json not found → Will create default config

Action: Write config.json (default)
Action: Read config.json
Success!
```

## Read-Before-Decide Pattern

```
[Many tool calls later...]
[Original goal may be forgotten...]

→ Read task_plan.md      # Goals return to attention
→ Make decision          # Informed by fresh plan
```

This prevents "lost in the middle" — plan acts as goal refresh mechanism.
