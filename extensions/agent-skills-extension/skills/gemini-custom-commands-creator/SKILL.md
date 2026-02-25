---
name: gemini-custom-commands-creator
description:
  Guide for creating custom commands in Gemini CLI. Use when user wants to create, edit, or understand custom commands for automating workflows, reusing prompts, or extending CLI functionality with personal shortcuts.
---

# Custom Commands Creator

This skill guides you through creating effective custom commands for Gemini CLI.

## What Are Custom Commands

Custom commands let you save and reuse favorite prompts as personal shortcuts within Gemini CLI. They streamline workflows and ensure consistency across projects.

## File Locations & Precedence

Commands are loaded from two locations (in order):

| Location | Path | Scope |
|----------|------|-------|
| **User commands** | `~/.gemini/commands/` | Global (all projects) |
| **Project commands** | `<project>/.gemini/commands/` | Local (current project) |

> **Precedence**: Project commands override user commands with the same name.

## Command Naming

Command names are derived from file paths:
- Subdirectories become namespaces separated by `:`
- File extension must be `.toml`

**Examples:**
```
~/.gemini/commands/test.toml           → /test
~/.gemini/commands/git/commit.toml     → /git:commit
~/.gemini/commands/refactor/pure.toml  → /refactor:pure
```

## TOML File Format

### Required Fields

```toml
prompt = "The prompt sent to the model"
```

### Optional Fields

```toml
description = "Brief description shown in /help menu"
```

## Creation Workflow

### Step 1: Identify the Use Case

Determine what repetitive task the command will automate:
- Code review workflows
- Git operations
- Documentation generation
- Testing patterns
- Project scaffolding

### Step 2: Choose Scope

**User scope** (`~/.gemini/commands/`):
- Personal productivity commands
- Cross-project utilities
- General purpose tools

**Project scope** (`<project>/.gemini/commands/`):
- Project-specific workflows
- Team-shared commands
- Repository-specific operations

### Step 3: Create Directory Structure

```bash
# Ensure commands directory exists
mkdir -p ~/.gemini/commands

# Create namespace subdirectory (optional)
mkdir -p ~/.gemini/commands/git

# Create the command file
touch ~/.gemini/commands/git/status.toml
```

### Step 4: Write the Command

Open the `.toml` file and add:

```toml
description = "Show git status and explain"
prompt = """
Please analyze the following git status and explain what actions are needed:

!{git status}
"""
```

### Step 5: Reload Commands

In Gemini CLI:
```
/commands reload
```

### Step 6: Test the Command

```
/git:status
```

---

## Argument Handling

### Method 1: Explicit Placeholder `{{args}}`

If `prompt` contains `{{args}}`, it gets replaced with user input.

**Example (`~/.gemini/commands/grep-code.toml`):**
```toml
description = "Search code and summarize findings"
prompt = """
Please search for the following pattern and summarize results:

Search pattern: {{args}}

Results:
!{grep -r {{args}} .}
"""
```

Usage: `/grep-code "function test"`

**Security**: Inside `!{...}`, `{{args}}` is automatically shell-escaped.

### Method 2: Default Append

If `prompt` does **not** contain `{{args}}`:
- Arguments are appended after two newlines
- If no arguments, prompt is sent as-is

**Example (`~/.gemini/commands/changelog.toml`):**
```toml
description = "Add new changelog entry"
prompt = """
You are a maintainer updating CHANGELOG.md.

Parse the version, type, and message from user input below.

Expected format: /changelog <version> <type> <message>
- type: added, changed, fixed, removed
"""
```

Usage: `/changelog 1.2.0 added "New feature"`

---

## Advanced Features

### Shell Command Execution `!{...}`

Execute shell commands and inject output:

```toml
prompt = """
Current git branch:
!{git branch --show-current}

Staged changes:
!{git diff --staged}
"""
```

**Security:**
1. Prompts for confirmation before execution
2. Shows exact command to be run
3. Errors are injected (stderr + exit code)

### File Content Injection `@{...}`

Embed file contents directly:

```toml
prompt = """
Please review this file:

@{src/main.ts}

Use these guidelines:

@{docs/code-review.md}
"""
```

**Supports:**
- Text files: Content injected directly
- Images/PDF/Audio/Video: Multimodal encoding
- Directories: Traverses all files (respects .gitignore)

### Combined Example

```toml
description = "Review code with guidelines"
prompt = """
You are a code review expert.

Review the following: {{args}}

Use these best practices:

@{docs/best-practices.md}

Search for related patterns:
!{rg -t ts "{{args}}"}
"""
```

---

## Command Templates

### Git Commands

#### Generate Commit Message
```toml
# ~/.gemini/commands/git/commit.toml
description = "Generate commit message from staged changes"
prompt = """
Generate a Conventional Commit message based on staged changes:

```diff
!{git diff --staged}
```

Format: <type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
"""
```

#### Show Status
```toml
# ~/.gemini/commands/git/status.toml
description = "Analyze git status and suggest actions"
prompt = """
Analyze this git status and suggest next steps:

!{git status}

Consider:
1. Files ready to commit
2. Files needing staging
3. Untracked files to consider
"""
```

#### Create PR Description
```toml
# ~/.gemini/commands/git:pr.toml
description = "Generate PR description from commits"
prompt = """
Generate a pull request description based on commits since main:

!{git log --oneline main..HEAD}

Include:
1. Summary of changes
2. Type of PR (feature, bugfix, refactor)
3. Testing notes
4. Breaking changes (if any)
"""
```

### Code Review Commands

#### Review File
```toml
# ~/.gemini/commands/review.toml
description = "Review a file for issues"
prompt = """
You are a senior code reviewer.

Review the following file for:
1. Bugs and logical errors
2. Performance issues
3. Code clarity and maintainability
4. Security concerns
5. Test coverage gaps

@{{args}}

Provide specific, actionable feedback.
"""
```

#### Review Changes
```toml
# ~/.gemini/commands/review:diff.toml
description = "Review staged changes"
prompt = """
Review these staged changes:

!{git diff --staged}

Focus on:
1. Correctness
2. Edge cases
3. Error handling
4. Consistency with existing code
"""
```

### Documentation Commands

#### Generate API Docs
```toml
# ~/.gemini/commands/docs:api.toml
description = "Generate API documentation"
prompt = """
Generate JSDoc API documentation for:

@{{args}}

Include:
- Function description
- @param for each parameter
- @returns with type
- @example with usage
- @throws if applicable
"""
```

#### Update README
```toml
# ~/.gemini/commands/docs:readme.toml
description = "Update README with new features"
prompt = """
Update the README.md to reflect recent changes.

Current README:
@{README.md}

Recent commits:
!{git log --oneline -10}

Add a section describing new features or changes.
"""
```

### Testing Commands

#### Generate Tests
```toml
# ~/.gemini/commands/test:generate.toml
description = "Generate unit tests for a file"
prompt = """
Generate comprehensive unit tests for:

@{{args}}

Requirements:
1. Test all public functions
2. Include edge cases
3. Test error conditions
4. Use project's testing framework
5. Aim for >80% coverage

Output tests in a new test file.
"""
```

#### Run Tests
```toml
# ~/.gemini/commands/test:run.toml
description = "Run tests and analyze failures"
prompt = """
Run the test suite and analyze any failures:

!{npm test}

For failing tests:
1. Explain the root cause
2. Suggest fixes
3. Identify if it's a test or code issue
"""
```

### Refactoring Commands

#### Make Pure Function
```toml
# ~/.gemini/commands/refactor:pure.toml
description = "Refactor code into a pure function"
prompt = """
Analyze the provided code and refactor it into a pure function.

Your response should include:
1. The refactored pure function
2. Explanation of changes made
3. Why these changes improve purity

Pure functions:
- No side effects
- Same input → same output
- No external state dependencies
"""
```

#### Extract Function
```toml
# ~/.gemini/commands/refactor:extract.toml
description = "Extract code into a reusable function"
prompt = """
Extract the highlighted code into a well-named, reusable function.

Consider:
1. Function name (clear, descriptive)
2. Parameters (minimal, clear)
3. Return value (meaningful)
4. Dependencies (explicit)
5. Reusability (general purpose)
"""
```

---

## Best Practices

### 1. Always Add Description

```toml
# Good
description = "Generate commit message from staged changes"
prompt = "..."

# Bad (generic description auto-generated)
prompt = "..."
```

### 2. Use Namespaces for Organization

```
~/.gemini/commands/
├── git/
│   ├── commit.toml
│   ├── status.toml
│   └── pr.toml
├── review/
│   ├── file.toml
│   └── diff.toml
└── docs/
    ├── api.toml
    └── readme.toml
```

### 3. Document Expected Arguments

```toml
prompt = """
Expected format: /command <version> <type> <message>
- version: Semantic version (e.g., 1.2.0)
- type: added, changed, fixed, removed
- message: Description of the change
"""
```

### 4. Test Shell Commands Thoroughly

Ensure `!{...}` commands work across different environments.

### 5. Use Version Control for Project Commands

Project commands can be committed to share with team:

```bash
git add .gemini/commands/
git commit -m "Add team custom commands"
```

---

## Troubleshooting

### Command Not Found

1. Check file location: `~/.gemini/commands/` or `<project>/.gemini/commands/`
2. Verify `.toml` extension
3. Run `/commands reload`

### Arguments Not Working

1. Check `{{args}}` placement
2. Verify shell escaping in `!{...}` blocks
3. Test with simple arguments first

### Shell Command Fails

1. Check command syntax
2. Verify permissions
3. Look for unbalanced braces in `!{...}`
4. Test command directly in terminal

### File Injection Fails

1. Verify file path is correct
2. Check file exists relative to workspace
3. Ensure balanced braces in `@{...}`

---

## Quick Reference

| Feature | Syntax | Example |
|---------|--------|---------|
| Shell command | `!{...}` | `!{git status}` |
| File content | `@{...}` | `@{src/main.ts}` |
| Arguments | `{{args}}` | `Review: {{args}}` |
| Namespace | `dir/file.toml` | `/git:commit` |
| Reload | CLI command | `/commands reload` |

---

## When to Use This Skill

Use this skill when:
- User wants to create a new custom command
- User needs help with command syntax
- User wants to automate a repetitive workflow
- User asks about argument handling
- User needs examples of shell/file injection
- User wants to share commands with team
