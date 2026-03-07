---
name: opencode-docs
description:
  Query and search OpenCode documentation. Use when user asks about OpenCode features, CLI commands, SDK usage, agents, tools, plugins, or configuration. Provides access to complete documentation including getting started, API reference, and development guides.
---

# OpenCode Documentation

This skill provides comprehensive access to OpenCode documentation.

## Documentation Structure

OpenCode documentation is located in `packages/docs/` and `.opencode/` directories:

### Quick Reference

| Topic | Location | Description |
|-------|----------|-------------|
| **Getting Started** | `packages/docs/index.mdx` | Introduction and quickstart |
| **Quickstart** | `packages/docs/quickstart.mdx` | Installation and setup |
| **Development** | `packages/docs/development.mdx` | Contributing guide |
| **Essentials** | `packages/docs/essentials/` | Core usage guides |
| **AI Tools** | `packages/docs/ai-tools/` | IDE integrations |
| **Agents** | `.opencode/agents/` | Agent definitions |
| **Commands** | `.opencode/commands/` | Custom commands |
| **Glossary** | `.opencode/glossary/` | Locale-specific glossaries |

## How to Search

### 1. Use Grep for Fast Search

```bash
# Search for specific feature
rg "pattern" packages/docs/

# Search in specific category
rg "pattern" packages/docs/essentials/

# Search agent definitions
rg "pattern" .opencode/agents/

# Case-insensitive search
rg -i "pattern" packages/docs/
```

### 2. Browse by Category

**Core Documentation** (`packages/docs/*.mdx`):
- `index.mdx` - Documentation homepage
- `quickstart.mdx` - Getting started guide
- `development.mdx` - Development and contributing

**Essentials** (`packages/docs/essentials/`):
- `settings.mdx` - Settings reference
- `markdown.mdx` - Markdown guide
- `code.mdx` - Code guidelines
- `navigation.mdx` - Navigation
- `images.mdx` - Image handling
- `reusable-snippets.mdx` - Reusable snippets

**AI Tools** (`packages/docs/ai-tools/`):
- `cursor.mdx` - Cursor integration
- `claude-code.mdx` - Claude Code integration
- `windsurf.mdx` - Windsurf integration

**Agent Definitions** (`.opencode/agents/`):
- `docs.md` - Documentation writing guidelines
- `translator.md` - Translation agent
- `triage.md` - Issue triage agent
- `duplicate-pr.md` - Duplicate PR detection

**Commands** (`.opencode/commands/`):
- `learn.md` - Extract learnings to AGENTS.md
- `commit.md` - Git commit and push
- `issues.md` - Search GitHub issues
- `ai-deps.md` - AI dependencies
- `rmslop.md` - Remove slop
- `spellcheck.md` - Spell checking

**Glossary** (`.opencode/glossary/`):
- Locale-specific translation glossaries (e.g., `zh-cn.md`, `br.md`)
- Used by translator agent for localization

### 3. Use docs.json

The `packages/docs/docs.json` file contains the documentation structure.

### 4. Use openapi.json

The `packages/docs/openapi.json` file contains the complete API specification.

## Common Queries

### "How do I install OpenCode?"
→ Check `packages/docs/quickstart.mdx`

### "How do I configure settings?"
→ Check `packages/docs/essentials/settings.mdx`

### "How do I create an agent?"
→ Check `.opencode/agents/` directory for examples

### "How do I create a custom command?"
→ Check `.opencode/commands/` directory for examples

### "How do I contribute?"
→ Check `packages/docs/development.mdx` or `CONTRIBUTING.md`

### "How do I use the SDK?"
→ Check `packages/docs/openapi.json` for API spec

### "How do I set up translation?"
→ Check `.opencode/agent/translator.md` and `.opencode/glossary/`

### "How do I search issues?"
→ Check `.opencode/command/issues.md`

## Documentation Categories

### Core
- Installation and quickstart
- Development workflow
- Settings and configuration
- Navigation and UI

### Agents
- Primary agents (Build, Plan)
- Subagents (General, Explore)
- Custom agents (`.opencode/agents/`)
- Agent configuration

### Commands
- Built-in commands (`/help`, `/undo`, `/redo`)
- Custom commands (`.opencode/commands/`)
- Command templates

### Integrations
- GitHub (issues, PRs)
- GitLab
- MCP servers
- IDE integrations (Cursor, Claude Code, Windsurf, Zed)
- LSP

### Development
- Building from source
- Testing
- Documentation guidelines
- Code style

## File Locations

All documentation files are stored in:
```
~/.agents/skills/opencode-docs/packages/docs/
.opencode/agents/
.opencode/commands/
.opencode/glossary/
```

**Note**: To update this skill, copy the latest docs from opencode repository:

```bash
# Pull latest docs
cp -r /path/to/opencode/packages/docs/* ~/.agents/skills/opencode-docs/packages/docs/
cp -r /path/to/opencode/.opencode/agents ~/.agents/skills/opencode-docs/.opencode/
cp -r /path/to/opencode/.opencode/commands ~/.agents/skills/opencode-docs/.opencode/
cp -r /path/to/opencode/.opencode/glossary ~/.agents/skills/opencode-docs/.opencode/
```

## Usage Examples

### Example 1: Find CLI Command

```bash
# Search for a specific command
rg "dev " references/cli.mdx
```

### Example 2: Find Agent Definition

```bash
# Find agent behavior
cat references/agents/translator.md
```

### Example 3: Find SDK Usage

```bash
# Search SDK patterns
rg "client\." references/sdk.mdx
```

## Tips

1. **Check AGENTS.md** - Root `AGENTS.md` has development guidelines
2. **Use openapi.json** - Complete API specification in `references/openapi.json`
3. **Essentials first** - `references/essentials/` has core concepts
4. **Agent docs are concise** - Agent files are short, read them fully
5. **Check Polish docs** - `references/pl/` has Polish language versions

## When to Use This Skill

Use this skill when:
- User asks "How do I..." questions about OpenCode
- User needs information about features, commands, agents, or configuration
- User wants to understand agent capabilities or command behavior
- User needs troubleshooting help
- User asks about SDK or API usage
- User wants to contribute or develop for OpenCode
- User needs integration setup help (MCP, LSP, IDE)
- User asks about translation/localization

## Search Strategy

1. **Identify the topic**
   - Agents → `.opencode/agents/`
   - Commands → `.opencode/commands/`
   - Usage docs → `packages/docs/essentials/`
   - API → `packages/docs/openapi.json`

2. **Navigate to category** - Go to the appropriate subdirectory

3. **Search or browse** - Use grep for specific terms or browse files

4. **Cross-reference** - Check related documents (e.g., AGENTS.md for code style)

5. **Check glossary** - For translation questions, see `.opencode/glossary/<locale>.md`

## Build & Development Commands

From `AGENTS.md` and `packages/docs/development.mdx`:

### Root Commands
```bash
bun install          # Install all dependencies
bun dev              # Start OpenCode dev server
bun dev <dir>        # Start in specific directory
bun dev serve        # Start headless API (port 4096)
bun dev web          # Start server + open web UI
bun turbo typecheck  # Run typecheck
```

### Package Commands
```bash
cd packages/opencode
bun test                    # Run all tests
bun test <file>             # Run single test
bun test --watch            # Watch mode
bun run typecheck           # TypeScript check
bun run db generate --name <slug>  # Generate migration
```

### Building Executable
```bash
./packages/opencode/script/build.ts --single
```

### SDK
```bash
# Regenerate JavaScript SDK
./packages/sdk/js/script/build.ts
```

## Code Style

From `AGENTS.md`:

### General Principles
- Keep things in one function unless composable or reusable
- Avoid `try`/`catch` where possible
- Avoid using the `any` type
- Prefer single word variable names where possible
- Use Bun APIs when possible
- Rely on type inference; avoid explicit type annotations unless necessary

### Naming
- Use single word names by default for locals, params, helper functions
- Multi-word names only when necessary for clarity
- Prefer: `pid`, `cfg`, `err`, `opts`, `dir`, `root`, `child`, `state`
- Avoid: `inputPID`, `existingClient`, `connectTimeout`

### Destructuring
- Avoid unnecessary destructuring
- Use dot notation to preserve context

### Control Flow
- Avoid `else` statements
- Prefer early returns

### Schema Definitions (Drizzle)
- Use snake_case for field names
- Don't redefine column names as strings

### Testing
- Avoid mocks as much as possible
- Test actual implementation
- Run tests from package directories (not repo root)

## Documentation Updates

To update this skill's documentation:

1. Pull latest changes from opencode repository
2. Re-copy docs:
   ```bash
   cp -r /path/to/opencode/packages/docs/* ~/.agents/skills/opencode-docs/packages/docs/
   cp -r /path/to/opencode/.opencode/agents ~/.agents/skills/opencode-docs/.opencode/
   cp -r /path/to/opencode/.opencode/commands ~/.agents/skills/opencode-docs/.opencode/
   cp -r /path/to/opencode/.opencode/glossary ~/.agents/skills/opencode-docs/.opencode/
   ```
3. Test with sample queries
