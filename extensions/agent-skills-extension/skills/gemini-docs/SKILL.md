---
name: gemini-docs
description:
  Query and search Gemini CLI documentation. Use when user asks about features, commands, settings, tools, or how to accomplish tasks with Gemini CLI. Provides access to complete official documentation including CLI usage, tools, configuration, and tutorials.
---

# Gemini CLI Documentation

This skill provides comprehensive access to Gemini CLI documentation.

## Documentation Structure

All documentation is located in the Gemini CLI repository under `docs/`, organized by topic:

### Quick Reference

| Topic | Location | Description |
|-------|----------|-------------|
| **Getting Started** | `docs/get-started/` | Installation, setup, first steps |
| **CLI Commands** | `docs/cli/` | All CLI commands and features |
| **Tools** | `docs/tools/` | Built-in tools documentation |
| **Settings** | `docs/cli/settings.md` | Complete settings reference |
| **Tutorials** | `docs/cli/tutorials/` | Step-by-step guides |
| **Core Concepts** | `docs/core/` | Architecture, agents, routing, subagents |
| **API Reference** | `docs/reference/` | Technical API documentation |
| **Resources** | `docs/resources/` | FAQ, troubleshooting, quotas |
| **Changelogs** | `docs/changelogs/` | Version history and updates |
| **Extensions** | `docs/extensions/` | Extension development guides |
| **Hooks** | `docs/hooks/` | Hook system documentation |
| **IDE Integration** | `docs/ide-integration/` | IDE-specific features |

## How to Search

### 1. Use Grep for Fast Search

```bash
# Search for specific feature
rg "pattern" docs/

# Search in specific category
rg "pattern" docs/cli/

# Case-insensitive search
rg -i "pattern" docs/
```

### 2. Browse by Category

**CLI Features** (`docs/cli/`):
- `settings.md` - All configuration options
- `plan-mode.md` - Planning and execution
- `skills.md` - Skills system
- `creating-skills.md` - Creating custom skills
- `themes.md` - UI customization
- `telemetry.md` - Usage analytics
- `sandbox.md` - Security isolation
- `model.md` - Model selection
- `model-routing.md` - Automatic model routing
- `custom-commands.md` - Custom commands
- `enterprise.md` - Enterprise controls

**Tools** (`docs/tools/`):
- `index.md` - Tools overview
- `file-system.md` - Read/write files
- `shell.md` - Command execution
- `web-search.md` - Web search
- `web-fetch.md` - URL fetching
- `mcp-server.md` - MCP protocol
- `activate-skill.md` - Skill activation
- `todos.md` - Task management

**Tutorials** (`docs/cli/tutorials/`):
- `getting-started.md` - First steps
- `file-management.md` - Working with files
- `shell-commands.md` - Shell usage
- `task-planning.md` - Planning workflows
- `memory-management.md` - Memory features
- `web-tools.md` - Web capabilities
- `mcp-setup.md` - MCP configuration
- `automation.md` - Automation patterns
- `session-management.md` - Session handling
- `skills-getting-started.md` - Skills tutorial

**Extensions** (`docs/extensions/`):
- `index.md` - Extension overview
- `writing-extensions.md` - Build extensions
- `reference.md` - Extension format reference
- `best-practices.md` - Development best practices
- `releasing.md` - Publishing extensions

**Core** (`docs/core/`):
- `subagents.md` - Subagents system
- `model-router.md` - Model routing
- `remote-agents.md` - Remote agents (A2A)

### 3. Use the Index

Start with `docs/index.md` for an overview of all documentation.

### 4. Check sidebar.json

The `docs/sidebar.json` file contains the complete documentation structure and navigation hierarchy.

## Common Queries

### "How do I configure X?"
→ Check `docs/cli/settings.md`

### "What tools are available?"
→ Check `docs/tools/index.md`

### "How do I use skill X?"
→ Check `docs/cli/skills.md` or `docs/cli/creating-skills.md`

### "How do I create a skill?"
→ Check `docs/cli/creating-skills.md`

### "How do I set up MCP?"
→ Check `docs/cli/tutorials/mcp-setup.md`

### "How do I create an extension?"
→ Check `docs/extensions/writing-extensions.md`

### "What's new in the latest version?"
→ Check `docs/changelogs/preview.md` or `docs/releases.md`

### "How do I troubleshoot X?"
→ Check `docs/resources/troubleshooting.md`

### "What are the quotas and limits?"
→ Check `docs/resources/quota-and-pricing.md`

### "How do I use subagents?"
→ Check `docs/core/subagents.md`

## Documentation Categories

### Admin & Enterprise
- `docs/admin/enterprise-controls.md` - Enterprise features
- `docs/cli/enterprise.md` - Enterprise controls

### IDE Integration
- `docs/ide-integration/` - IDE-specific features

### Extensions
- `docs/extensions/` - Extension development and publishing

### Hooks
- `docs/hooks/` - Hook system for customization

### Get Started
- `docs/get-started/` - Onboarding guides

### Examples
- `docs/examples/` - Usage examples and patterns

## File Locations

All documentation files are stored in:
```
~/.agents/skills/gemini-docs/docs/
```

**Note**: This skill copies documentation from the Gemini CLI repository (`docs/`). To update:

```bash
# Pull latest docs
cp -r /path/to/gemini-cli/docs/* ~/.agents/skills/gemini-docs/docs/
```

## Usage Examples

### Example 1: Find Settings for a Feature

```bash
# Search for a specific setting
rg "model.*routing" docs/cli/settings.md
```

### Example 2: Find Tool Usage

```bash
# Find how to use a specific tool
rg -A 5 "ReadFileTool" docs/tools/file-system.md
```

### Example 3: Find Tutorial

```bash
# Find relevant tutorial
ls docs/cli/tutorials/ | grep -i "file"
```

## Tips

1. **Use the changelogs** - Check `docs/changelogs/preview.md` for latest features
2. **Check FAQ first** - `docs/resources/faq.md` has common answers
3. **Settings are comprehensive** - `docs/cli/settings.md` covers most configuration
4. **Tools have examples** - Each tool doc includes usage examples
5. **Tutorials are step-by-step** - Follow tutorials for complete workflows

## When to Use This Skill

Use this skill when:
- User asks "How do I..." questions about Gemini CLI
- User needs information about features, commands, or settings
- User wants to understand tool capabilities
- User needs troubleshooting help
- User asks about configuration options
- User wants to learn about new features
- User needs reference for CLI syntax

## Search Strategy

1. **Identify the topic** - CLI, tools, settings, tutorials, etc.
2. **Navigate to category** - Go to the appropriate subdirectory
3. **Search or browse** - Use grep for specific terms or browse files
4. **Cross-reference** - Check related documents for complete information
5. **Verify version** - Check changelogs for latest changes

## Documentation Updates

To update documentation:
1. Pull latest changes from main repository
2. Re-copy docs: `cp -r docs/* ~/.agents/skills/gemini-docs/docs/`
3. Test with sample queries
