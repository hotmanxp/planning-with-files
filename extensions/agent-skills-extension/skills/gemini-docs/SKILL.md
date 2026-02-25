---
name: gemini-docs
description:
  Query and search Gemini CLI documentation. Use when user asks about features, commands, settings, tools, or how to accomplish tasks with Gemini CLI. Provides access to complete official documentation including CLI usage, tools, configuration, and tutorials.
---

# Gemini CLI Documentation

This skill provides comprehensive access to Gemini CLI documentation.

## Documentation Structure

All documentation is available in the `references/` directory, organized by topic:

### Quick Reference

| Topic | Location | Description |
|-------|----------|-------------|
| **Getting Started** | `references/get-started/` | Installation, setup, first steps |
| **CLI Commands** | `references/cli/` | All CLI commands and features |
| **Tools** | `references/tools/` | Built-in tools documentation |
| **Settings** | `references/cli/settings.md` | Complete settings reference |
| **Tutorials** | `references/cli/tutorials/` | Step-by-step guides |
| **Core Concepts** | `references/core/` | Architecture, agents, routing |
| **API Reference** | `references/reference/` | Technical API documentation |
| **Resources** | `references/resources/` | FAQ, troubleshooting, quotas |
| **Changelogs** | `references/changelogs/` | Version history and updates |

## How to Search

### 1. Use Grep for Fast Search

```bash
# Search for specific feature
rg "pattern" references/

# Search in specific category
rg "pattern" references/cli/

# Case-insensitive search
rg -i "pattern" references/
```

### 2. Browse by Category

**CLI Features** (`references/cli/`):
- `settings.md` - All configuration options
- `plan-mode.md` - Planning and execution
- `skills.md` - Skills system
- `themes.md` - UI customization
- `telemetry.md` - Usage analytics
- `sandbox.md` - Security isolation
- `model.md` - Model selection
- `model-routing.md` - Automatic model routing

**Tools** (`references/tools/`):
- `index.md` - Tools overview
- `file-system.md` - Read/write files
- `shell.md` - Command execution
- `web-search.md` - Web search
- `web-fetch.md` - URL fetching
- `mcp-server.md` - MCP protocol
- `activate-skill.md` - Skill activation
- `todos.md` - Task management

**Tutorials** (`references/cli/tutorials/`):
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

### 3. Use the Index

Start with `references/index.md` for an overview of all documentation.

### 4. Check sidebar.json

The `references/sidebar.json` file contains the complete documentation structure and navigation hierarchy.

## Common Queries

### "How do I configure X?"
→ Check `references/cli/settings.md`

### "What tools are available?"
→ Check `references/tools/index.md`

### "How do I use skill X?"
→ Check `references/cli/skills.md` or `references/cli/creating-skills.md`

### "How do I set up MCP?"
→ Check `references/cli/tutorials/mcp-setup.md`

### "What's new in the latest version?"
→ Check `references/changelogs/latest.md` or `references/releases.md`

### "How do I troubleshoot X?"
→ Check `references/resources/troubleshooting.md`

### "What are the quotas and limits?"
→ Check `references/resources/quota-and-pricing.md`

## Documentation Categories

### Admin & Enterprise
- `references/admin/enterprise-controls.md` - Enterprise features
- `references/cli/enterprise.md` - Enterprise controls

### IDE Integration
- `references/ide-integration/` - IDE-specific features

### Extensions
- `references/extensions/` - Extension system

### Hooks
- `references/hooks/` - Hook system for customization

### Get Started
- `references/get-started/` - Onboarding guides

## File Locations

All documentation files are stored in:
```
~/.agents/skills/gemini-docs/references/
```

## Usage Examples

### Example 1: Find Settings for a Feature

```bash
# Search for a specific setting
rg "model.*routing" references/cli/settings.md
```

### Example 2: Find Tool Usage

```bash
# Find how to use a specific tool
rg -A 5 "ReadFileTool" references/tools/file-system.md
```

### Example 3: Find Tutorial

```bash
# Find relevant tutorial
ls references/cli/tutorials/ | grep -i "file"
```

## Tips

1. **Use the changelogs** - Check `references/changelogs/preview.md` for latest features
2. **Check FAQ first** - `references/resources/faq.md` has common answers
3. **Settings are comprehensive** - `references/cli/settings.md` covers most configuration
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
2. Re-copy docs: `cp -r docs/* ~/.agents/skills/gemini-docs/references/`
3. Test with sample queries
