---
name: opencode-docs
description:
  Query and search OpenCode documentation. Use when user asks about OpenCode features, CLI commands, SDK usage, agents, tools, plugins, or configuration. Provides access to complete documentation including getting started, API reference, and development guides.
---

# OpenCode Documentation

This skill provides comprehensive access to OpenCode documentation.

## Documentation Structure

All documentation is available in the `references/` directory, organized by topic:

### Quick Reference

| Topic | Location | Description |
|-------|----------|-------------|
| **Getting Started** | `references/index.mdx` | Introduction and quickstart |
| **CLI** | `references/cli.mdx` | Command line interface |
| **SDK** | `references/sdk.mdx` | Software development kit |
| **Agents** | `references/agents/` | Agent definitions and behaviors |
| **Tools** | `references/tools.mdx` | Available tools |
| **Plugins** | `references/plugins.mdx` | Plugin system |
| **Enterprise** | `references/enterprise/` | Enterprise features |
| **Web/Desktop** | `references/web/` | UI applications |
| **Development** | `references/development.mdx` | Contributing guide |

## How to Search

### 1. Use Grep for Fast Search

```bash
# Search for specific feature
rg "pattern" references/

# Search in specific category
rg "pattern" references/agents/

# Case-insensitive search
rg -i "pattern" references/
```

### 2. Browse by Category

**Core Documentation** (`references/*.mdx`):
- `index.mdx` - Documentation homepage
- `quickstart.mdx` - Getting started guide
- `cli.mdx` - CLI usage and commands
- `sdk.mdx` - SDK API reference
- `agents.mdx` - Agent system
- `tools.mdx` - Available tools
- `plugins.mdx` - Plugin architecture
- `config.mdx` - Configuration options
- `formatters.mdx` - Code formatters

**Agent Definitions** (`references/agents/`):
- `docs.md` - Documentation writing guidelines
- `translator.md` - Translation agent
- `triage.md` - Issue triage agent
- `duplicate-pr.md` - Duplicate PR detection

**Commands** (`references/commands/`):
- `learn.md` - Learning command
- `commit.md` - Commit helper
- `issues.md` - Issue management
- `ai-deps.md` - AI dependencies
- `rmslop.md` - Remove slop
- `spellcheck.md` - Spell checking

**Essentials** (`references/essentials/`):
- `settings.mdx` - Settings reference
- `markdown.mdx` - Markdown guide
- `code.mdx` - Code guidelines
- `navigation.mdx` - Navigation
- `images.mdx` - Image handling

**AI Tools** (`references/ai-tools/`):
- `cursor.mdx` - Cursor integration
- `claude-code.mdx` - Claude Code integration
- `windsurf.mdx` - Windsurf integration

### 3. Use the Index

Start with `references/index.mdx` for an overview.

### 4. Check docs.json

The `references/docs.json` file contains the complete documentation structure and navigation.

## Common Queries

### "How do I install OpenCode?"
→ Check `references/quickstart.mdx`

### "What CLI commands are available?"
→ Check `references/cli.mdx`

### "How do I use the SDK?"
→ Check `references/sdk.mdx` and `references/openapi.json`

### "How do I create an agent?"
→ Check `references/agents/` directory

### "How do I configure settings?"
→ Check `references/essentials/settings.mdx`

### "How do I contribute?"
→ Check `references/development.mdx` or `CONTRIBUTING.md`

### "What tools are available?"
→ Check `references/tools.mdx`

### "How do I set up MCP servers?"
→ Check `references/mcp-servers.mdx` (if exists) or `references/plugins.mdx`

## Documentation Categories

### Core
- CLI interface and commands
- SDK and API
- Configuration
- Agents system
- Tools
- Plugins

### Integrations
- GitHub
- GitLab
- MCP servers
- IDE integrations
- Cursor
- Claude Code
- Windsurf

### Development
- Local development setup
- Building
- Testing
- Documentation guidelines

### Enterprise
- Enterprise controls
- Team features
- Administration

## File Locations

All documentation files are stored in:
```
~/.agents/skills/opencode-docs/references/
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
- User needs information about features, commands, or configuration
- User wants to understand agent or tool capabilities
- User needs troubleshooting help
- User asks about SDK or API usage
- User wants to contribute or develop
- User needs integration setup help

## Search Strategy

1. **Identify the topic** - CLI, SDK, agents, tools, etc.
2. **Navigate to category** - Go to appropriate subdirectory
3. **Search or browse** - Use grep for specific terms or browse files
4. **Cross-reference** - Check related documents
5. **Verify with openapi.json** - For API questions

## Build & Development Commands

From `AGENTS.md`:

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

## Code Style

From `AGENTS.md`:

- Keep things in one function unless composable
- Avoid `try`/`catch` where possible
- Avoid using `any` type
- Use Bun APIs when possible
- Prefer functional array methods
- Single word names for variables

## Documentation Updates

To update documentation:
1. Pull latest changes from main repository
2. Re-copy docs: `cp -r packages/docs/* ~/.agents/skills/opencode-docs/references/`
3. Test with sample queries
