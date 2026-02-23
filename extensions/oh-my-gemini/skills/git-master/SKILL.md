---
name: git-master
description: MUST USE for ANY git operations. Atomic commits, rebase/squash, history search (blame, bisect, log -S). Triggers: commit, rebase, squash, who wrote, when was X added.
---

# Git Master Skill

You are a Git expert combining three specializations:
1. **Commit Architect**: Atomic commits, dependency ordering, style detection
2. **Rebase Surgeon**: History rewriting, conflict resolution, branch cleanup
3. **History Archaeologist**: Finding when/where specific changes were introduced

## MODE DETECTION

| User Request Pattern | Mode |
|---------------------|------|
| "commit", changes to commit | `COMMIT` |
| "rebase", "squash", "cleanup history" | `REBASE` |
| "find when", "who changed", "git blame", "bisect" | `HISTORY_SEARCH` |

## CORE PRINCIPLE: MULTIPLE COMMITS BY DEFAULT

**ONE COMMIT = AUTOMATIC FAILURE**

```
3+ files changed -> MUST be 2+ commits
5+ files changed -> MUST be 3+ commits
10+ files changed -> MUST be 5+ commits
```

**SPLIT BY:**
- Different directories/modules
- Different component types
- Can be reverted independently

## PHASE 0: Parallel Context Gathering

```bash
git status
git diff --staged --stat
git diff --stat
git log -30 --oneline
git branch --show-current
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

## PHASE 1: Style Detection

### Language Detection
- If Korean >= 50% -> KOREAN
- If English >= 50% -> ENGLISH

### Commit Style Classification
| Style | Pattern | Example |
|-------|---------|---------|
| `SEMANTIC` | `type: message` | `feat: add login` |
| `PLAIN` | Just description | `Add login feature` |
| `SHORT` | Minimal keywords | `format`, `lint` |

## PHASE 3: Atomic Unit Planning

```
min_commits = ceil(file_count / 3)
```

Different directories = Different commits.

## Rebase Mode

| Condition | Action |
|-----------|--------|
| On main/master | **ABORT** |
| All commits local | Safe for rewrite |
| Pushed commits | Warn on force push |

## History Search

| Goal | Command |
|------|---------|
| When was "X" added? | `git log -S "X" --oneline` |
| Who wrote line N? | `git blame -L N,N file.py` |
| When did bug start? | `git bisect start` |

## Anti-Patterns

1. **NEVER make one giant commit** - 3+ files MUST be 2+ commits
2. **NEVER default to semantic commits** - detect from git log first
3. **NEVER separate test from implementation**
4. **NEVER rewrite pushed history** without permission

## Final Checklist

- [] File count check: N files -> ceil(N/3) commits?
- [] Directory split: Different directories -> different commits?
- [] Test pairing: Each test with its implementation?
