# Quick Start: Your First Custom Command

## 5-Minute Setup

### Step 1: Create Directory

```bash
mkdir -p ~/.gemini/commands
```

### Step 2: Create First Command

```bash
cat > ~/.gemini/commands/hello.toml << 'EOF'
description = "Friendly greeting"
prompt = """
Hello! I'm your Gemini CLI assistant.

How can I help you today? Feel free to ask me about:
- Code questions
- File operations
- Research tasks
- Or anything else!
"""
EOF
```

### Step 3: Reload Commands

In Gemini CLI:

```
/commands reload
```

### Step 4: Test It

```
/hello
```

---

## Your First Useful Command

### Git Status Analyzer

```bash
mkdir -p ~/.gemini/commands/git

cat > ~/.gemini/commands/git/status.toml << 'EOF'
description = "Analyze git status and suggest actions"
prompt = """
Analyze this git status and suggest next steps:

!{git status}

Consider:
1. Files ready to commit
2. Files needing staging
3. Untracked files
4. Any conflicts or issues
"""
EOF
```

Usage:

```
/git:status
```

---

## Command with Arguments

### Code Search

```bash
cat > ~/.gemini/commands/grep-code.toml << 'EOF'
description = "Search code and explain findings"
prompt = """
Search for this pattern and explain what you find:

Pattern: {{args}}

Results:
!{grep -r {{args}} . --include="*.ts" --include="*.js"}
"""
EOF
```

Usage:

```
/grep-code "function validateUser"
```

---

## File-Based Command

### Code Review

```bash
cat > ~/.gemini/commands/review.toml << 'EOF'
description = "Review a file for issues"
prompt = """
Review this file for bugs and improvements:

@{{args}}

Check:
1. Logical errors
2. Edge cases
3. Code clarity
4. Performance
"""
EOF
```

Usage:

```
/review src/main.ts
```

---

## Next Steps

1. **Explore templates** - See `references/templates.md` for more examples
2. **Create your own** - Identify repetitive tasks to automate
3. **Share with team** - Add project commands to `.gemini/commands/`

---

## Common Patterns

| Pattern      | Use Case          | Example                   |
| ------------ | ----------------- | ------------------------- |
| `!{git ...}` | Git operations    | Commit, status, diff      |
| `@{file}`    | File review       | Code review, analysis     |
| `{{args}}`   | User input        | Search, filter, specify   |
| Combined     | Complex workflows | Review + search + explain |

---

## Troubleshooting

**Command not found?**

```bash
# Check file exists
ls ~/.gemini/commands/

# Reload in CLI
/commands reload
```

**Arguments not working?**

- Check `{{args}}` is in prompt
- Test with simple text first

**Shell command fails?**

- Test command directly in terminal
- Check for balanced braces in `!{...}`
