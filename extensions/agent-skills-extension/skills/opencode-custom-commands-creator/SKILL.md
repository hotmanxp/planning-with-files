---
name: opencode-custom-commands-creator
description:
  Guide for creating custom commands in OpenCode. Use when user wants to create reusable command shortcuts for repetitive tasks, workflows, or specialized operations with arguments, shell injection, and file references.
---

# OpenCode Custom Commands Creator

This skill guides you through creating custom commands for OpenCode.

## What Are Custom Commands

Custom commands let you specify prompts for repetitive tasks, executed via `/command-name` in the TUI.

**Benefits**:
- Reusable workflows
- Consistent operations
- Team standardization
- Time savings

**Built-in commands**: `/init`, `/undo`, `/redo`, `/share`, `/help`

---

## Creation Methods

### Method 1: Markdown Files (Recommended)

Create `.md` files in `commands/` directory:

| Scope | Location |
|-------|----------|
| **Project** | `.opencode/commands/*.md` |
| **Global** | `~/.config/opencode/commands/*.md` |

**File naming**: Filename becomes command name (`test.md` → `/test`)

### Method 2: JSON Configuration

Add to `opencode.json`:

```json
{
  "command": {
    "command-name": {
      "template": "Prompt text",
      "description": "Description shown in TUI"
    }
  }
}
```

---

## Markdown Command Format

### Structure

```markdown
---
description: What the command does
agent: build
model: anthropic/claude-3-5-sonnet-20241022
subtask: false
---

Command prompt template goes here.
Supports $ARGUMENTS, !`shell`, @file references.
```

### Frontmatter Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `description` | string | **Yes** | Shown in TUI autocomplete |
| `agent` | string | No | Agent to execute command (defaults to current) |
| `model` | string | No | Model override for this command |
| `subtask` | boolean | No | Force subagent execution (isolated context) |

---

## Advanced Features

### 1. Arguments

#### All Arguments: `$ARGUMENTS`

```markdown
# .opencode/commands/component.md
---
description: Create a new React component
---

Create a new React component named $ARGUMENTS with TypeScript support.
Include proper typing, props interface, and basic structure.
```

**Usage**:
```bash
/component Button
```

#### Positional Arguments: `$1`, `$2`, `$3`...

```markdown
# .opencode/commands/create-file.md
---
description: Create file with content
---

Create a file named $1 in directory $2 with content:
$3
```

**Usage**:
```bash
/create-file config.json src "{ \"key\": \"value\" }"
```

**Replacements**:
- `$1` → `config.json`
- `$2` → `src`
- `$3` → `{ "key": "value" }`

---

### 2. Shell Command Injection

Use `!`command`` to inject bash output:

```markdown
# .opencode/commands/test-coverage.md
---
description: Analyze test coverage
---

Current test results:
!`npm test`

Based on these results:
1. List failing tests
2. Suggest fixes for each failure
3. Recommend coverage improvements
```

```markdown
# .opencode/commands/review-commits.md
---
description: Review recent git commits
---

Recent commits:
!`git log --oneline -10`

Review these changes for:
1. Code quality
2. Conventional commit format
3. Potential issues
```

```markdown
# .opencode/commands/git-status.md
---
description: Analyze git status and suggest actions
---

Current git status:
!`git status`

Suggest next steps for:
1. Files ready to commit
2. Files needing staging
3. Untracked files to consider
```

**Notes**:
- Commands run in project root
- Output becomes part of prompt
- Shell escaping handled automatically

---

### 3. File References

Use `@filepath` to include file content:

```markdown
# .opencode/commands/review-component.md
---
description: Review a component for issues
---

Review the component in @src/components/Button.tsx.

Check for:
1. Performance issues
2. Accessibility problems
3. Type safety
4. Best practices

Suggest specific improvements.
```

```markdown
# .opencode/commands/explain-code.md
---
description: Explain how code works
---

Explain how this code works:
@src/lib/auth.ts

Cover:
1. Main functions and their purpose
2. Data flow
3. Dependencies
4. Potential improvements
```

**Features**:
- Relative paths from project root
- Multiple file references supported
- Content automatically injected

---

## Command Templates

### Template 1: Test Runner

```markdown
# .opencode/commands/test.md
---
description: Run tests with coverage report
agent: build
---

Run the full test suite with coverage report:
!`npm test -- --coverage`

Focus on:
1. List all failing tests
2. Show error messages
3. Suggest fixes for each failure
4. Identify coverage gaps

Prioritize fixes by impact.
```

**Usage**:
```bash
/test
```

---

### Template 2: Commit Message Generator

```markdown
# .opencode/commands/commit.md
---
description: Generate conventional commit message
agent: build
---

Analyze staged changes and generate a Conventional Commit message:

!`git diff --staged`

Use format: `<type>(<scope>): <subject>`

Types: feat, fix, docs, style, refactor, test, chore

Provide:
1. Commit message
2. Brief explanation of changes
3. Any breaking changes noted
```

**Usage**:
```bash
/commit
```

---

### Template 3: Code Review

```markdown
# .opencode/commands/review.md
---
description: Review code changes
agent: plan
---

Review the staged changes:
!`git diff --staged`

Check for:
1. **Code Quality**
   - Readability and clarity
   - Naming conventions
   - Function length

2. **Best Practices**
   - Language idioms
   - Error handling
   - Type safety

3. **Security**
   - Input validation
   - Authentication/authorization
   - Common vulnerabilities

4. **Performance**
   - Algorithm efficiency
   - Memory usage
   - Unnecessary operations

Provide specific, actionable feedback with line references.
```

**Usage**:
```bash
/review
```

---

### Template 4: PR Description Generator

```markdown
# .opencode/commands/pr-description.md
---
description: Generate pull request description
agent: build
---

Generate a pull request description based on commits:

!`git log --oneline main...HEAD`

Include:
1. **Summary** - Brief overview of changes
2. **Type** - Feature, bugfix, refactor, etc.
3. **Changes** - Bullet list of modifications
4. **Testing** - How to test these changes
5. **Breaking Changes** - If any

Format as Markdown for GitHub/GitLab.
```

**Usage**:
```bash
/pr-description
```

---

### Template 5: Component Generator

```markdown
# .opencode/commands/component.md
---
description: Create a new React component
agent: build
---

Create a new React component named "$ARGUMENTS" with:

1. **TypeScript** - Proper typing for props
2. **Props Interface** - Define all props with types
3. **Component Structure** - Functional component pattern
4. **Basic Styles** - Tailwind CSS classes
5. **Export** - Named and default exports

File location: `src/components/$ARGUMENTS/$ARGUMENTS.tsx`

Include a basic example of usage in comments.
```

**Usage**:
```bash
/component Button
/component Modal
```

---

### Template 6: API Endpoint Generator

```markdown
# .opencode/commands/api-endpoint.md
---
description: Create a new API endpoint
agent: build
---

Create a new API endpoint for: $ARGUMENTS

Include:
1. **Route Handler** - Express/Fastify handler
2. **Input Validation** - Zod/Joi schema
3. **Type Definitions** - Request/Response types
4. **Error Handling** - Try/catch with proper errors
5. **Tests** - Basic unit test structure

File location: `src/api/routes/$ARGUMENTS.ts`

Follow RESTful conventions.
```

**Usage**:
```bash
/api-endpoint users
/api-endpoint products
```

---

### Template 7: Debug Error

```markdown
# .opencode/commands/debug-error.md
---
description: Debug an error
agent: build
---

Analyze this error: $ARGUMENTS

Check recent logs:
!`tail -50 logs/error.log`

Check git changes:
!`git diff HEAD`

Tasks:
1. Identify root cause
2. Explain why error occurred
3. Suggest specific fix
4. Recommend preventive measures
```

**Usage**:
```bash
/debug-error "TypeError: Cannot read property 'map' of undefined"
```

---

### Template 8: Documentation Generator

```markdown
# .opencode/commands/generate-docs.md
---
description: Generate API documentation
agent: docs
---

Generate API documentation for: @src/index.ts

Include:
1. **Overview** - What this module does
2. **Exports** - All exported functions/classes
3. **Function Signatures** - Parameters and return types
4. **Examples** - Usage examples for each
5. **Edge Cases** - Important notes

Format as Markdown with proper headings and code blocks.
```

**Usage**:
```bash
/generate-docs
```

---

### Template 9: Security Audit

```markdown
# .opencode/commands/security-audit.md
---
description: Security audit of codebase
agent: plan
subtask: true
---

Perform a security audit of the codebase.

Check for:
1. **Input Validation**
   - SQL injection risks
   - XSS vulnerabilities
   - Command injection

2. **Authentication**
   - Weak auth patterns
   - Session management
   - Token handling

3. **Data Protection**
   - Hardcoded credentials
   - Sensitive data exposure
   - Encryption usage

4. **Dependencies**
   - Known vulnerabilities
   - Outdated packages

Use grep to search for patterns:
!`grep -r "eval(" src/`
!`grep -r "innerHTML" src/`

Provide severity-rated findings with remediation steps.
```

**Usage**:
```bash
/security-audit
```

---

### Template 10: Performance Analysis

```markdown
# .opencode/commands/perf-analysis.md
---
description: Analyze code performance
agent: plan
---

Analyze performance of: @src/lib/data-processor.ts

Check for:
1. **Time Complexity** - Big O of main functions
2. **Memory Usage** - Allocations and leaks
3. **I/O Operations** - Unnecessary reads/writes
4. **Optimization Opportunities**
   - Caching
   - Memoization
   - Lazy loading
   - Parallelization

Run benchmark if available:
!`npm run benchmark`

Provide specific optimization recommendations with expected impact.
```

**Usage**:
```bash
/perf-analysis
```

---

## JSON Configuration Method

### Basic Configuration

```json
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report.",
      "description": "Run tests with coverage"
    }
  }
}
```

### Full Configuration

```json
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "review": {
      "template": "Review staged changes:\n!`git diff --staged`\n\nCheck for code quality and security issues.",
      "description": "Code review",
      "agent": "plan",
      "model": "anthropic/claude-sonnet-4-20250514",
      "subtask": true
    },
    "deploy": {
      "template": "Deploy to production:\n!`npm run deploy`\n\nReport status and any errors.",
      "description": "Deploy to production",
      "agent": "build",
      "subtask": false
    }
  }
}
```

---

## Configuration Options Reference

### description (Required)

Brief description shown in TUI autocomplete.

```json
{
  "command": {
    "test": {
      "description": "Run tests with coverage"
    }
  }
}
```

### template (Required)

Prompt sent to LLM. Supports `$ARGUMENTS`, `!`cmd``, `@file`.

```json
{
  "command": {
    "component": {
      "template": "Create component: $ARGUMENTS\n@src/components/template.tsx"
    }
  }
}
```

### agent (Optional)

Which agent executes the command:

```json
{
  "command": {
    "review": {
      "agent": "plan"
    },
    "build": {
      "agent": "build"
    }
  }
}
```

**Values**:
- `build` - Full-access agent
- `plan` - Read-only agent
- Custom agent name

### model (Optional)

Override model for this command:

```json
{
  "command": {
    "analyze": {
      "model": "anthropic/claude-sonnet-4-20250514"
    }
  }
}
```

### subtask (Optional)

Force subagent execution (isolated context):

```json
{
  "command": {
    "security-audit": {
      "subtask": true
    }
  }
}
```

**Benefits**:
- Doesn't pollute main context
- Separate token budget
- Independent conversation

---

## Best Practices

### 1. Clear Descriptions

Make descriptions specific and actionable:

```markdown
<!-- Good -->
description: Run tests with coverage and analyze failures

<!-- Bad -->
description: Tests
```

### 2. Focused Commands

Each command should do one thing well:

```markdown
<!-- Good: Focused -->
/test          # Run tests
/lint          # Run linter
/format        # Format code

<!-- Bad: Too broad -->
/everything    # Do all the things
```

### 3. Use Arguments Wisely

Use arguments for variability:

```markdown
# Flexible
Create a component named $ARGUMENTS

# Rigid
Create a component named Button
```

### 4. Leverage Shell Injection

Automate data gathering:

```markdown
# Good: Auto-gather context
Recent changes:
!`git log --oneline -5`

# Bad: Manual
Tell me what changed
```

### 5. Include File References

Make commands context-aware:

```markdown
# Good: Includes context
Review @src/main.ts for issues

# Bad: No context
Review the code
```

### 6. Set Appropriate Agent

Match command to agent capabilities:

```markdown
# Analysis commands → plan agent
agent: plan

# Implementation commands → build agent
agent: build

# Documentation → docs agent
agent: docs
```

### 7. Use Subtask for Heavy Operations

Isolate long-running commands:

```markdown
# Good: Doesn't pollute main context
subtask: true  # For security audits, full test suites

# Bad: Quick commands don't need isolation
subtask: true  # For simple lookups
```

---

## Troubleshooting

### Command Not Found

1. Check file location (`.opencode/commands/` or `~/.config/opencode/commands/`)
2. Verify `.md` extension
3. Check filename matches command name
4. Restart OpenCode

### Arguments Not Working

1. Verify `$ARGUMENTS` or `$1`, `$2` in template
2. Check argument order matches placeholders
3. Test with simple arguments first

### Shell Command Fails

1. Test command directly in terminal
2. Check for proper escaping
3. Verify command exists in PATH
4. Check permissions

### File Reference Not Loading

1. Verify file path is correct
2. Check file exists relative to workspace
3. Ensure no typos in path

### Agent Not Switching

1. Verify agent name is correct
2. Check agent is enabled
3. Ensure agent has required tools

---

## Comparison: OpenCode vs Gemini CLI Commands

| Feature | OpenCode | Gemini CLI |
|---------|----------|------------|
| **File Format** | `.md` + YAML | `.toml` |
| **Arguments** | `$ARGUMENTS`, `$1`, `$2` | `{{args}}` |
| **Shell Injection** | `!`command`` | `!{command}` |
| **File References** | `@file` | `@{file}` |
| **Agent Selection** | `agent: build` | Not supported |
| **Model Selection** | `model: xxx` | Not supported |
| **Subtask Mode** | `subtask: true` | Not supported |

---

## When to Use This Skill

Use this skill when:
- User wants to create OpenCode custom commands
- User needs command templates for common tasks
- User asks about arguments or shell injection
- User wants to automate repetitive workflows
- User needs to share commands with team
