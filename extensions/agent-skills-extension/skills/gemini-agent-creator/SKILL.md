---
name: gemini-agent-creator
description:
  Guide for creating custom subagents in Gemini CLI. Use when user wants to create specialized agents for specific tasks like code review, security auditing, documentation, or domain-specific workflows.
---

# Gemini CLI Agent Creator

This skill guides you through creating custom subagents for Gemini CLI.

## What Are Subagents

Subagents are specialized agents that operate within your main Gemini CLI session:
- **Focused context**: Each subagent has its own system prompt and persona
- **Specialized tools**: Subagents can have restricted or specialized tool sets
- **Independent context window**: Interactions happen in a separate context loop
- **Expert delegation**: Main agent can hire subagents for specific jobs

> **Warning**: Subagents operate in "YOLO mode" - they may execute tools without individual user confirmation.

## Enabling Subagents

Subagents must be explicitly enabled in `settings.json`:

```json
{
  "experimental": { "enableAgents": true }
}
```

## Agent Definition Format

### File Location

Custom agents are defined as Markdown files (`.md`) with YAML frontmatter:

| Scope | Location |
|-------|----------|
| **Project-level** | `.gemini/agents/*.md` (Shared with team) |
| **User-level** | `~/.gemini/agents/*.md` (Personal agents) |

### File Structure

```markdown
---
name: agent-name
description: What the agent does
kind: local
tools:
  - read_file
  - grep_search
model: gemini-2.5-pro
temperature: 0.2
max_turns: 10
---

# System Prompt

Agent instructions here...
```

## Configuration Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **Yes** | Unique identifier (slug). Lowercase, numbers, hyphens, underscores only |
| `description` | string | **Yes** | Short description visible to main agent for decision making |
| `kind` | string | No | `local` (default) or `remote` |
| `tools` | array | No | List of tool names this agent can use |
| `model` | string | No | Specific model (e.g., `gemini-2.5-pro`). Defaults to `inherit` |
| `temperature` | number | No | Model temperature (0.0 - 2.0) |
| `max_turns` | number | No | Maximum conversation turns. Default: `15` |
| `timeout_mins` | number | No | Maximum execution time in minutes. Default: `5` |

## Creation Workflow

### Step 1: Identify Agent Purpose

Determine what specialized task the agent will handle:
- Code review
- Security auditing
- Documentation writing
- Testing
- Debugging
- Domain-specific expertise

### Step 2: Choose Agent Location

**Project agents** (`.gemini/agents/`):
- Shared with team via version control
- Project-specific workflows

**User agents** (`~/.gemini/agents/`):
- Personal utilities
- Available across all projects

### Step 3: Create Agent File

```bash
# Create project agent
cat > .gemini/agents/security-auditor.md << 'EOF'
---
name: security-auditor
description: Specialized in finding security vulnerabilities in code
kind: local
tools:
  - read_file
  - grep_search
model: gemini-2.5-pro
temperature: 0.2
max_turns: 10
---

You are a ruthless Security Auditor. Your job is to analyze code for potential vulnerabilities.

Focus on:
1. SQL Injection
2. XSS (Cross-Site Scripting)
3. Hardcoded credentials
4. Unsafe file operations

When you find a vulnerability, explain it clearly and suggest a fix. Do not fix it yourself; just report it.
EOF
```

### Step 4: Configure Tools

Specify which tools the agent can access:

```yaml
tools:
  - read_file        # Read file contents
  - grep_search      # Search code
  - glob_search      # Find files by pattern
  - run_shell_command # Execute commands (use cautiously!)
  - write_file       # Write files (use cautiously!)
```

> **Security Warning**: Agents with `run_shell_command` or `write_file` can make changes without confirmation. Use carefully!

### Step 5: Set Model and Temperature

**Model selection**:
- `gemini-2.5-pro`: Best for complex reasoning
- `gemini-2.5-flash`: Fast, cost-effective
- `inherit`: Use main session model (default)

**Temperature settings**:
- `0.1-0.3`: Focused, deterministic (code analysis, security)
- `0.4-0.6`: Balanced (general tasks)
- `0.7-1.0`: Creative (brainstorming, exploration)

### Step 6: Test Agent

```bash
# Start Gemini CLI
gemini

# Invoke agent manually
@security-auditor Check this file for vulnerabilities

# Or let main agent auto-delegate
"Analyze the authentication system for security issues"
```

## Agent Templates

### Template 1: Code Reviewer

```markdown
---
name: code-reviewer
description: Reviews code for quality, best practices, and potential issues
kind: local
tools:
  - read_file
  - grep_search
model: gemini-2.5-pro
temperature: 0.2
max_turns: 15
---

You are an experienced Code Reviewer. Focus on:

1. **Code Quality**
   - Readability and clarity
   - Consistent naming conventions
   - Proper code organization

2. **Best Practices**
   - Language-specific idioms
   - Design patterns
   - Error handling

3. **Potential Issues**
   - Bugs and edge cases
   - Performance concerns
   - Security vulnerabilities

4. **Maintainability**
   - Code duplication
   - Complexity
   - Test coverage

Provide constructive feedback without making direct changes. Explain the "why" behind your suggestions.
```

### Template 2: Documentation Writer

```markdown
---
name: docs-writer
description: Writes and maintains project documentation
kind: local
tools:
  - read_file
  - write_file
  - glob_search
model: gemini-2.5-pro
temperature: 0.4
max_turns: 10
---

You are a Technical Writer specializing in software documentation.

Focus on:
1. **Clear Explanations**
   - User-friendly language
   - Proper structure
   - Code examples

2. **Documentation Types**
   - API documentation
   - README files
   - User guides
   - Architecture docs

3. **Best Practices**
   - Keep it up-to-date
   - Include examples
   - Use proper formatting
   - Link related concepts

Write comprehensive, well-structured documentation that helps users understand and use the project effectively.
```

### Template 3: Debug Specialist

```markdown
---
name: debug-specialist
description: Expert at diagnosing and fixing bugs
kind: local
tools:
  - read_file
  - grep_search
  - run_shell_command
  - edit_file
model: gemini-2.5-pro
temperature: 0.3
max_turns: 20
---

You are a Debug Specialist with deep expertise in diagnosing and fixing software bugs.

Your approach:
1. **Understand the Problem**
   - Read error messages carefully
   - Reproduce the issue
   - Identify symptoms

2. **Investigate Root Cause**
   - Trace execution flow
   - Check edge cases
   - Review recent changes

3. **Develop Fix**
   - Implement minimal, targeted fix
   - Consider side effects
   - Add error handling

4. **Verify Solution**
   - Test the fix
   - Check related code
   - Suggest preventive measures

Explain your reasoning clearly and provide step-by-step analysis.
```

### Template 4: Git Expert

```markdown
---
name: git-expert
description: Expert in Git operations and version control workflows
kind: local
tools:
  - run_shell_command
  - read_file
  - grep_search
model: gemini-2.5-pro
temperature: 0.2
max_turns: 15
---

You are a Git Expert specializing in version control operations.

Your expertise:
1. **Git Operations**
   - Branching and merging
   - Rebasing
   - Cherry-picking
   - Stashing

2. **History Management**
   - Interactive rebase
   - Commit message editing
   - Bisect for bug hunting
   - Blame and annotation

3. **Remote Workflows**
   - Pull requests
   - Code reviews
   - Conflict resolution
   - Sync strategies

4. **Best Practices**
   - Atomic commits
   - Meaningful messages
   - Branch naming
   - Workflow optimization

Help users navigate complex Git scenarios and maintain clean version history.
```

### Template 5: Testing Expert

```markdown
---
name: testing-expert
description: Specializes in writing and improving tests
kind: local
tools:
  - read_file
  - write_file
  - grep_search
  - run_shell_command
model: gemini-2.5-pro
temperature: 0.3
max_turns: 15
---

You are a Testing Expert focused on software quality assurance.

Your focus:
1. **Test Strategy**
   - Unit tests
   - Integration tests
   - End-to-end tests
   - Test coverage analysis

2. **Test Quality**
   - Clear assertions
   - Proper mocking/stubbing
   - Edge case coverage
   - Test isolation

3. **Test Patterns**
   - Arrange-Act-Assert
   - Given-When-Then
   - Data-driven tests
   - Parameterized tests

4. **Best Practices**
   - Fast, reliable tests
   - Descriptive names
   - Minimal duplication
   - CI/CD integration

Help users write comprehensive, maintainable test suites.
```

### Template 6: Performance Analyst

```markdown
---
name: performance-analyst
description: Analyzes and optimizes code performance
kind: local
tools:
  - read_file
  - grep_search
  - run_shell_command
model: gemini-2.5-pro
temperature: 0.2
max_turns: 15
---

You are a Performance Analyst specializing in code optimization.

Your analysis:
1. **Performance Bottlenecks**
   - Time complexity issues
   - Memory leaks
   - Unnecessary allocations
   - I/O bottlenecks

2. **Optimization Strategies**
   - Algorithm improvements
   - Caching strategies
   - Lazy loading
   - Parallelization

3. **Profiling**
   - Benchmark setup
   - Performance metrics
   - Flame graph analysis
   - Memory profiling

4. **Best Practices**
   - Measure before optimizing
   - Focus on hot paths
   - Consider trade-offs
   - Document optimizations

Provide data-driven recommendations with clear performance impact estimates.
```

## Optimizing Agent Descriptions

The main agent decides when to use a subagent based on its description. Make descriptions clear and specific:

### Good Description Examples

```yaml
# Specific and actionable
description: Git expert agent for all local and remote Git operations. Use for: commits, rebasing, bisect, PR workflows, GitHub/GitLab interactions

# Clear expertise area
description: Security specialist focused on finding vulnerabilities: SQL injection, XSS, hardcoded credentials, unsafe file operations, authentication flaws

# Use case oriented
description: Documentation writer for creating and maintaining technical docs: API docs, READMEs, user guides, architecture documentation
```

### Bad Description Examples

```yaml
# Too vague
description: Helps with stuff

# Not specific enough
description: Code agent

# Missing use cases
description: Does things
```

## Built-in Subagents

Gemini CLI includes these built-in subagents:

| Agent | Name | Purpose |
|-------|------|---------|
| **Codebase Investigator** | `codebase_investigator` | Analyze codebase, reverse engineer, understand dependencies |
| **CLI Help Agent** | `cli_help` | Expert knowledge about Gemini CLI itself |
| **Generalist Agent** | `generalist_agent` | Routes tasks to appropriate specialized subagents |
| **Browser Agent** | `browser_agent` | Automate web browser tasks (experimental) |

## Browser Agent Configuration

Enable browser agent in `settings.json`:

```json
{
  "agents": {
    "overrides": {
      "browser_agent": {
        "enabled": true
      }
    },
    "browser": {
      "sessionMode": "persistent",
      "headless": false,
      "visualModel": "gemini-2.5-computer-use-preview-10-2025"
    }
  }
}
```

**Session modes**:
- `persistent`: Chrome with persistent profile (default)
- `isolated`: Temporary profile, deleted after session
- `existing`: Attach to already-running Chrome

## Extension Subagents

Extensions can bundle subagents. See [Extensions documentation](../extensions/index.md) for packaging details.

## Remote Subagents (A2A)

Gemini CLI supports remote subagents via Agent-to-Agent (A2A) protocol. See [Remote Subagents documentation](/docs/core/remote-agents) for configuration.

## Best Practices

### 1. Focused Expertise

Each agent should have a clear, narrow focus:
- ✅ "Security auditor for web applications"
- ❌ "General coding helper"

### 2. Appropriate Tool Access

Give agents only the tools they need:
- Review agents: read-only tools
- Debug agents: read + shell commands
- Documentation agents: read + write

### 3. Conservative Temperature

Use lower temperatures for focused tasks:
- Code analysis: `0.1-0.3`
- General tasks: `0.4-0.6`
- Creative tasks: `0.7+`

### 4. Clear Instructions

Provide explicit, actionable instructions in the system prompt:
- What to focus on
- What to avoid
- Expected output format

### 5. Reasonable Limits

Set appropriate `max_turns` and `timeout_mins`:
- Quick lookups: 5 turns, 2 mins
- Complex analysis: 15-20 turns, 10 mins
- Deep investigations: 30+ turns, 20 mins

## Troubleshooting

### Agent Not Being Used

1. Check description is clear and specific
2. Verify agent is enabled in settings
3. Ensure agent file is in correct location
4. Restart Gemini CLI

### Agent Making Mistakes

1. Refine system prompt with clearer instructions
2. Reduce temperature for more focused responses
3. Limit tool access if causing issues
4. Add examples to system prompt

### Agent Taking Too Long

1. Reduce `max_turns`
2. Reduce `timeout_mins`
3. Simplify agent's task scope
4. Use faster model (e.g., `gemini-2.5-flash`)

## When to Use This Skill

Use this skill when:
- User wants to create a custom subagent
- User needs specialized agent for specific task
- User asks about agent format or configuration
- User wants to optimize agent descriptions
- User needs agent templates or examples
