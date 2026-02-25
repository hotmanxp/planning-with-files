# Custom Command Templates

Copy and adapt these templates for your own commands.

## Git Commands

### Commit Message Generator

````toml
# ~/.gemini/commands/git/commit.toml
description = "Generate Conventional Commit message from staged changes"
prompt = """
Generate a Conventional Commit message based on staged changes:

```diff
!{git diff --staged}
````

Format: <type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
"""

````

### PR Description
```toml
# ~/.gemini/commands/git/pr.toml
description = "Generate PR description from commits"
prompt = """
Generate a pull request description based on commits:

!{git log --oneline main..HEAD}

Include:
1. Summary of changes
2. Type of PR
3. Testing notes
4. Breaking changes
"""
````

## Code Review

### File Review

```toml
# ~/.gemini/commands/review.toml
description = "Review a file for issues"
prompt = """
Review the following file:

@{{args}}

Check for:
1. Bugs and logical errors
2. Performance issues
3. Code clarity
4. Security concerns
5. Test coverage
"""
```

### Diff Review

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
"""
```

## Documentation

### API Docs

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
"""
```

## Testing

### Generate Tests

```toml
# ~/.gemini/commands/test:generate.toml
description = "Generate unit tests"
prompt = """
Generate unit tests for:

@{{args}}

Requirements:
1. Test all public functions
2. Include edge cases
3. Test error conditions
4. Use project's testing framework
"""
```

## Refactoring

### Extract Function

```toml
# ~/.gemini/commands/refactor:extract.toml
description = "Extract code into reusable function"
prompt = """
Extract this code into a well-named function:

Consider:
1. Clear function name
2. Minimal parameters
3. Explicit dependencies
4. Reusability
"""
```
