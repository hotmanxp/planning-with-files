---
name: opencode-agent-creator
description:
  Guide for creating custom agents in OpenCode. Use when user wants to create primary agents or subagents with custom prompts, models, tools, and permissions for specialized workflows.
---

# OpenCode Agent Creator

This skill guides you through creating custom agents for OpenCode.

## What Are Agents

Agents are specialized AI assistants configured for specific tasks and workflows:
- **Primary agents**: Main assistants you interact with directly (Tab to switch)
- **Subagents**: Specialized assistants invoked for specific tasks (@mention or auto-delegate)

## Agent Types

### Primary Agents

Main conversation partners:
- Switchable via **Tab** key or `switch_agent` keybind
- Handle main conversation
- Configurable tool permissions

**Built-in primary agents**:
- **Build**: Default agent with all tools enabled
- **Plan**: Restricted agent for planning/analysis (no edits, bash requires permission)

### Subagents

Specialized assistants:
- Invoked via **@mention** or auto-delegated by primary agents
- Focused on specific tasks
- Can create child sessions

**Built-in subagents**:
- **General**: Full tool access for complex tasks
- **Explore**: Read-only for codebase exploration

## Configuration Methods

### Method 1: JSON Configuration

Configure in `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/build.txt}",
      "tools": {
        "write": true,
        "edit": true,
        "bash": true
      }
    },
    "plan": {
      "mode": "primary",
      "model": "anthropic/claude-haiku-4-20250514",
      "tools": {
        "write": false,
        "edit": false,
        "bash": false
      }
    },
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "tools": {
        "write": false,
        "edit": false
      }
    }
  }
}
```

### Method 2: Markdown Files

Create agent files in:
- **Global**: `~/.config/opencode/agents/`
- **Project**: `.opencode/agents/`

**File naming**: The filename becomes the agent name (e.g., `review.md` → `review` agent)

```markdown
# ~/.config/opencode/agents/review.md
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
---

You are in code review mode. Focus on:

- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

## Configuration Options

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | **Required**. Brief description of what agent does and when to use it |

### Mode

| Value | Description |
|-------|-------------|
| `primary` | Primary agent (switchable via Tab) |
| `subagent` | Subagent (invoked via @mention or auto-delegate) |
| `all` | Can be used as both (default if not specified) |

```json
{
  "agent": {
    "review": {
      "mode": "subagent"
    }
  }
}
```

### Model

Override the model for this agent:

```json
{
  "agent": {
    "plan": {
      "model": "anthropic/claude-haiku-4-20250514"
    },
    "deep-thinker": {
      "model": "openai/gpt-5"
    }
  }
}
```

**Format**: `provider/model-id`

**Default**:
- Primary agents: Globally configured model
- Subagents: Model of invoking primary agent

### Temperature

Control randomness (0.0 - 1.0+):

```json
{
  "agent": {
    "analyze": {
      "temperature": 0.1
    },
    "build": {
      "temperature": 0.3
    },
    "brainstorm": {
      "temperature": 0.7
    }
  }
}
```

**Guidelines**:
- `0.0-0.2`: Very focused (code analysis, planning)
- `0.3-0.5`: Balanced (general development)
- `0.6-1.0`: Creative (brainstorming, exploration)

**Default**: Model-specific (typically 0, or 0.55 for Qwen models)

### Steps (Max Steps)

Maximum agentic iterations before forced response:

```json
{
  "agent": {
    "quick-thinker": {
      "description": "Fast reasoning with limited iterations",
      "steps": 5
    }
  }
}
```

When limit reached, agent receives system prompt to summarize work and recommend remaining tasks.

### Tools

Control which tools are available:

```json
{
  "agent": {
    "plan": {
      "tools": {
        "write": false,
        "edit": false,
        "bash": false
      }
    },
    "readonly": {
      "tools": {
        "mymcp_*": false,
        "write": false,
        "edit": false
      }
    }
  }
}
```

**Note**: Agent-specific config overrides global config.

### Permissions

Fine-grained control over tool permissions:

```json
{
  "agent": {
    "build": {
      "permission": {
        "edit": "ask",
        "bash": {
          "git push": "ask",
          "git status *": "allow",
          "*": "ask"
        },
        "webfetch": "deny"
      }
    }
  }
}
```

**Permission values**:
- `ask`: Prompt for approval
- `allow`: Allow without approval
- `deny`: Disable tool

**Bash command patterns**:
- Exact match: `"git push": "ask"`
- Glob patterns: `"git *": "ask"`, `"grep *": "allow"`
- Wildcard: `"*": "ask"` (matches all)

**Rule evaluation**: Last matching rule wins

### Prompt

Specify custom system prompt file:

```json
{
  "agent": {
    "review": {
      "prompt": "{file:./prompts/code-review.txt}"
    }
  }
}
```

Path is relative to config file location.

### Disable

Temporarily disable an agent:

```json
{
  "agent": {
    "review": {
      "disable": true
    }
  }
}
```

### Hidden

Hide subagent from @autocomplete (still callable by other agents):

```json
{
  "agent": {
    "internal-helper": {
      "mode": "subagent",
      "hidden": true
    }
  }
}
```

### Task Permissions

Control which subagents an agent can invoke:

```json
{
  "agent": {
    "orchestrator": {
      "mode": "primary",
      "permission": {
        "task": {
          "*": "deny",
          "orchestrator-*": "allow",
          "code-reviewer": "ask"
        }
      }
    }
  }
}
```

**Note**: Users can always invoke any subagent directly via @autocomplete.

### Color

Customize UI appearance:

```json
{
  "agent": {
    "creative": {
      "color": "#ff6b6b"
    },
    "code-reviewer": {
      "color": "accent"
    }
  }
}
```

**Values**: Hex color or theme color (`primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`)

### Top P

Alternative to temperature for controlling diversity:

```json
{
  "agent": {
    "brainstorm": {
      "top_p": 0.9
    }
  }
}
```

Range: 0.0 - 1.0

### Additional Options

Any other options pass through to provider:

```json
{
  "agent": {
    "deep-thinker": {
      "description": "Uses high reasoning effort",
      "model": "openai/gpt-5",
      "reasoningEffort": "high",
      "textVerbosity": "low"
    }
  }
}
```

## Creation Workflow

### Step 1: Identify Agent Purpose

Determine agent type and specialization:
- Primary or subagent?
- What task domain?
- What tools needed?

### Step 2: Choose Configuration Method

**JSON** (`opencode.json`):
- Quick setup
- Inline configuration
- Good for simple agents

**Markdown** (`.opencode/agents/*.md`):
- Better for complex prompts
- Version control friendly
- Separates config from instructions

### Step 3: Create Agent

#### JSON Method

```json
// opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "security-auditor": {
      "description": "Performs security audits and identifies vulnerabilities",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.2,
      "tools": {
        "write": false,
        "edit": false
      },
      "permission": {
        "bash": "ask"
      }
    }
  }
}
```

#### Markdown Method

```markdown
# .opencode/agents/security-auditor.md
---
description: Performs security audits and identifies vulnerabilities
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.2
tools:
  write: false
  edit: false
permission:
  bash: ask
---

You are a security expert. Focus on identifying potential security issues:

1. **Input Validation**
   - SQL injection
   - XSS vulnerabilities
   - Command injection

2. **Authentication & Authorization**
   - Weak authentication
   - Authorization flaws
   - Session management

3. **Data Security**
   - Data exposure risks
   - Encryption issues
   - Hardcoded credentials

4. **Dependencies**
   - Known vulnerabilities
   - Outdated packages

5. **Configuration**
   - Insecure defaults
   - Exposed secrets
   - Debug modes

Provide clear explanations and remediation steps for each finding.
```

### Step 4: Test Agent

```bash
# Start OpenCode
opencode

# Switch to primary agent (Tab key)
# Or invoke subagent
@security-auditor Check src/auth.ts for vulnerabilities

# Or let primary agent auto-delegate
"Analyze the authentication system for security issues"
```

### Step 5: Use CLI Command (Interactive)

```bash
opencode agent create
```

This interactive command:
1. Asks where to save (global or project)
2. Gets description
3. Generates system prompt and identifier
4. Selects tools
5. Creates markdown file

## Agent Templates

### Template 1: Code Reviewer

```markdown
# .opencode/agents/code-reviewer.md
---
description: Reviews code for quality, security, and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.2
tools:
  write: false
  edit: false
  bash:
    "git diff *": allow
    "git log *": allow
    "grep *": allow
---

You are an experienced Code Reviewer. Focus on:

## Review Areas

1. **Code Quality**
   - Readability and clarity
   - Naming conventions
   - Code organization
   - Function length and complexity

2. **Best Practices**
   - Language idioms
   - Design patterns
   - Error handling
   - Type safety

3. **Security**
   - Input validation
   - Authentication/authorization
   - Data protection
   - Common vulnerabilities (OWASP Top 10)

4. **Performance**
   - Algorithm efficiency
   - Memory usage
   - Unnecessary operations
   - Caching opportunities

5. **Maintainability**
   - Code duplication
   - Test coverage
   - Documentation
   - Modularity

## Output Format

For each finding:
1. **Location**: File and line number
2. **Issue**: Clear description
3. **Impact**: Why it matters
4. **Suggestion**: How to fix

Provide constructive, actionable feedback.
```

### Template 2: Documentation Writer

```markdown
# .opencode/agents/docs-writer.md
---
description: Writes and maintains technical documentation
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.4
tools:
  write: true
  edit: true
  bash: false
---

You are a Technical Writer specializing in software documentation.

## Documentation Types

1. **API Documentation**
   - Function signatures
   - Parameters and return values
   - Usage examples
   - Error cases

2. **User Guides**
   - Installation instructions
   - Getting started
   - Tutorials
   - FAQs

3. **Architecture Docs**
   - System overview
   - Component diagrams
   - Data flow
   - Design decisions

4. **README Files**
   - Project overview
   - Features
   - Quick start
   - Contribution guidelines

## Writing Principles

- **Clear**: Simple, direct language
- **Complete**: Cover all aspects
- **Concise**: No unnecessary words
- **Correct**: Accurate information
- **Current**: Up-to-date with code

## Structure

Use proper heading hierarchy, code blocks, and links. Include examples for all concepts.
```

### Template 3: Debug Specialist

```markdown
# .opencode/agents/debug-specialist.md
---
description: Expert at diagnosing and fixing software bugs
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.3
steps: 20
tools:
  read: true
  edit: true
  bash: true
---

You are a Debug Specialist with deep expertise in diagnosing and fixing software bugs.

## Debugging Process

1. **Understand the Problem**
   - Read error messages carefully
   - Ask clarifying questions
   - Reproduce the issue

2. **Investigate**
   - Trace execution flow
   - Check recent changes (git log)
   - Review related code
   - Add logging if needed

3. **Hypothesize**
   - List potential causes
   - Rank by likelihood
   - Design tests for each

4. **Test Hypotheses**
   - Run targeted tests
   - Check edge cases
   - Verify assumptions

5. **Implement Fix**
   - Minimal, targeted change
   - Consider side effects
   - Add error handling
   - Write regression test

6. **Verify**
   - Test the fix
   - Check related functionality
   - Document the issue and solution

## Communication

Explain your reasoning step-by-step. Share what you're testing and why.
```

### Template 4: Testing Expert

```markdown
# .opencode/agents/testing-expert.md
---
description: Specializes in writing and improving tests
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.3
tools:
  read: true
  write: true
  edit: true
  bash: true
---

You are a Testing Expert focused on software quality assurance.

## Test Strategy

1. **Test Pyramid**
   - Unit tests (base)
   - Integration tests (middle)
   - E2E tests (top)

2. **Test Types**
   - Functional tests
   - Regression tests
   - Performance tests
   - Security tests

## Test Quality

- **Clear Assertions**: Specific, meaningful checks
- **Proper Mocking**: Isolate unit under test
- **Edge Cases**: Boundary conditions, error cases
- **Test Isolation**: No inter-test dependencies

## Test Patterns

- **Arrange-Act-Assert**: Clear structure
- **Given-When-Then**: BDD style
- **Data-Driven**: Multiple test cases
- **Parameterized**: Reusable test logic

## Best Practices

- Fast, reliable tests
- Descriptive names
- Minimal duplication (DRY)
- CI/CD integration
- Coverage goals (but not 100% obsession)

Help users write comprehensive, maintainable test suites.
```

### Template 5: Performance Analyst

```markdown
# .opencode/agents/performance-analyst.md
---
description: Analyzes and optimizes code performance
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.2
tools:
  read: true
  bash: true
---

You are a Performance Analyst specializing in code optimization.

## Analysis Focus

1. **Bottlenecks**
   - Time complexity (Big O)
   - Memory leaks
   - Unnecessary allocations
   - I/O operations

2. **Optimization Strategies**
   - Algorithm improvements
   - Caching/memoization
   - Lazy loading
   - Parallelization/async

3. **Profiling**
   - Benchmark setup
   - Performance metrics
   - Flame graphs
   - Memory profiles

## Approach

1. **Measure First**: Never optimize without data
2. **Focus on Hot Paths**: 80/20 rule
3. **Consider Trade-offs**: Memory vs CPU, readability vs performance
4. **Document Changes**: Why and what was optimized

## Output

Provide:
- Current performance metrics
- Identified bottlenecks
- Optimization recommendations
- Expected improvement estimates
- Implementation guidance
```

### Template 6: Git Expert

```markdown
# .opencode/agents/git-expert.md
---
description: Expert in Git operations and version control
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.2
permission:
  bash:
    "git *": ask
---

You are a Git Expert specializing in version control operations.

## Expertise Areas

1. **Git Operations**
   - Branching strategies
   - Merging vs rebasing
   - Cherry-picking
   - Stashing

2. **History Management**
   - Interactive rebase
   - Commit message editing
   - `git bisect` for bug hunting
   - `git blame` and annotation

3. **Remote Workflows**
   - Pull request workflows
   - Code review processes
   - Conflict resolution
   - Sync strategies

4. **Advanced Features**
   - Git hooks
   - Submodules
   - Worktrees
   - Reflog recovery

## Best Practices

- Atomic commits
- Meaningful commit messages
- Feature branch workflow
- Regular rebasing on main
- Clean git history

Help users navigate complex Git scenarios and maintain clean version history.
```

## Built-in Agents

### Primary Agents

| Agent | Mode | Tools | Purpose |
|-------|------|-------|---------|
| **Build** | Primary | All enabled | Default development work |
| **Plan** | Primary | Read-only, bash=ask | Analysis without changes |

### Subagents

| Agent | Mode | Tools | Purpose |
|-------|------|-------|---------|
| **General** | Subagent | All (except todo) | Complex, multi-step tasks |
| **Explore** | Subagent | Read-only | Fast codebase exploration |

### System Agents (Hidden)

| Agent | Purpose |
|-------|---------|
| **Compaction** | Compacts long context into summary |
| **Title** | Generates session titles |
| **Summary** | Creates session summaries |

## Usage Patterns

### Switching Primary Agents

```
Tab key → Cycle through primary agents
```

### Invoking Subagents

```
@general help me search for this function
@code-reviewer Review src/auth.ts
```

### Auto-delegation

Primary agents automatically delegate to subagents based on task and agent descriptions.

### Session Navigation

Subagents create child sessions. Navigate between:
```
<Leader>+Right → Parent → Child1 → Child2 → Parent
<Leader>+Left → Parent ← Child1 ← Child2 ← Parent
```

## Best Practices

### 1. Clear Descriptions

Make descriptions specific and actionable:

```json
// Good
"description": "Git expert for commits, rebasing, bisect, PR workflows, GitHub/GitLab integration"

// Bad
"description": "Helps with git"
```

### 2. Appropriate Tool Access

Restrict tools to what's necessary:

```json
// Review agent: read-only
"tools": {
  "write": false,
  "edit": false
}

// Debug agent: needs execution
"tools": {
  "read": true,
  "edit": true,
  "bash": true
}
```

### 3. Conservative Permissions

Use `ask` for destructive operations:

```json
"permission": {
  "bash": {
    "git push": "ask",
    "rm *": "deny",
    "git status *": "allow"
  }
}
```

### 4. Model Selection

Choose models based on task:

```json
{
  "plan": {
    "model": "anthropic/claude-haiku-4-20250514"
  },
  "deep-analysis": {
    "model": "anthropic/claude-sonnet-4-20250514"
  }
}
```

### 5. Temperature Tuning

```json
{
  "code-review": {
    "temperature": 0.1
  },
  "brainstorming": {
    "temperature": 0.7
  }
}
```

## Troubleshooting

### Agent Not Appearing

1. Check file location (`.opencode/agents/` or `~/.config/opencode/agents/`)
2. Verify YAML frontmatter is valid
3. Check filename matches agent name
4. Restart OpenCode

### Agent Not Being Auto-Selected

1. Improve description clarity
2. Add use case examples to description
3. Check agent is not disabled
4. Verify mode is appropriate (subagent vs primary)

### Agent Making Mistakes

1. Refine system prompt
2. Reduce temperature
3. Limit tool access
4. Add explicit constraints

### Agent Taking Too Long

1. Reduce `steps` limit
2. Use faster model
3. Simplify agent scope
4. Add explicit stopping criteria

## When to Use This Skill

Use this skill when:
- User wants to create a custom agent
- User needs specialized agent for specific workflow
- User asks about agent configuration
- User wants agent templates or examples
- User needs help with agent permissions or tools
