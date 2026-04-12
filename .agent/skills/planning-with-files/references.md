# Reference: Manus Context Engineering Principles

Based on Manus's context engineering documentation (acquired by Meta for $2B in Dec 2025).

## The 6 Manus Principles

### 1. KV-Cache is King
- ~100:1 input-to-output token ratio
- Cached: $0.30/MTok vs Uncached: $3/MTok (10x cost difference)
- Keep prompt prefixes **stable** — single-token change invalidates cache
- Make context **append-only** with deterministic serialization

### 2. Mask, Don't Remove
Don't dynamically remove tools (breaks KV-cache). Use logit masking instead.

### 3. Filesystem as External Memory
```
Context Window = RAM (volatile, limited)
Filesystem = Disk (persistent, unlimited)
```
**Compression must be restorable:** Keep URLs and file paths even if content is dropped.

### 4. Manipulate Attention Through Recitation
After ~50 tool calls, models forget original goals ("lost in the middle").
**Solution:** Re-read `task_plan.md` before each decision. Goals re-enter attention window.

### 5. Keep the Wrong Stuff In
Leave failed actions with stack traces — they let model implicitly update beliefs. Error recovery is "one of the clearest signals of TRUE agentic behavior."

### 6. Don't Get Few-Shotted
Uniformity breeds fragility. Introduce controlled variation — don't copy-paste patterns blindly.

## Context Engineering Strategies

### Context Reduction
```
Tool calls have TWO representations:
├── FULL: Raw tool content
└── COMPACT: Reference/file path only

Apply compaction to STALE results, keep RECENT results FULL.
```

### Context Isolation (Multi-Agent)
```
PLANNER AGENT → assigns tasks to sub-agents
KNOWLEDGE MANAGER → reviews conversations, determines filesystem store
EXECUTOR SUB-AGENTS → perform assigned tasks with own context windows
```

### Context Offloading
- <20 atomic functions total
- Store full results in filesystem, not context
- Progressive disclosure: load info only when needed

## Agent Loop (7 Steps)

1. ANALYZE CONTEXT — understand intent, assess state
2. THINK — should I update plan? What's next?
3. SELECT TOOL — choose ONE tool
4. EXECUTE ACTION
5. RECEIVE OBSERVATION — append to context
6. ITERATE — loop until complete
7. DELIVER OUTCOME — results + relevant files

## Key Quotes

> "if action_failed: next_action != same_action. Track what you tried. Mutate the approach."

> "Error recovery is one of the clearest signals of TRUE agentic behavior."

> "KV-cache hit rate is THE single most important metric for production AI agents."

## Source

https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
