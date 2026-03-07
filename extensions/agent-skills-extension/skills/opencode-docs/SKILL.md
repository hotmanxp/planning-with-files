---
name: opencode-docs
description:
  Query and search OpenCode documentation. Use when user asks about OpenCode features, CLI commands, SDK usage, agents, tools, plugins, or configuration. Provides access to complete documentation including getting started, API reference, and development guides.
---

# OpenCode Documentation

This skill provides comprehensive access to OpenCode documentation.

## Documentation Structure

All documentation is stored in the `docs/` directory as `.mdx` files:

### Quick Reference

| Topic | File | Description |
|-------|------|-------------|
| **Getting Started** | `docs/index.mdx` | Introduction and quickstart |
| **CLI** | `docs/cli.mdx` | Command line interface |
| **SDK** | `docs/sdk.mdx` | Software development kit |
| **Agents** | `docs/agents.mdx` | Agent definitions and behaviors |
| **Tools** | `docs/tools.mdx` | Available tools |
| **Plugins** | `docs/plugins.mdx` | Plugin system |
| **MCP Servers** | `docs/mcp-servers.mdx` | MCP server configuration |
| **LSP** | `docs/lsp.mdx` | Language Server Protocol |
| **Providers** | `docs/providers.mdx` | AI provider configuration |
| **Models** | `docs/models.mdx` | Model selection and routing |
| **Enterprise** | `docs/enterprise.mdx` | Enterprise features |
| **Troubleshooting** | `docs/troubleshooting.mdx` | Common issues and solutions |

### All Documentation Files

```
docs/
├── index.mdx           # Documentation homepage
├── cli.mdx             # CLI usage and commands
├── sdk.mdx             # SDK API reference
├── agents.mdx          # Agent system
├── commands.mdx        # Custom commands
├── tools.mdx           # Available tools
├── plugins.mdx         # Plugin architecture
├── mcp-servers.mdx     # MCP servers
├── lsp.mdx             # LSP integration
├── providers.mdx       # Provider configuration
├── models.mdx          # Model selection
├── config.mdx          # Configuration options
├── themes.mdx          # Custom themes
├── modes.mdx           # Agent modes
├── skills.mdx          # Agent skills
├── custom-tools.mdx    # Custom tools
├── formatters.mdx      # Code formatters
├── keybinds.mdx        # Keyboard shortcuts
├── permissions.mdx     # Permission system
├── server.mdx          # Server configuration
├── share.mdx           # Session sharing
├── web.mdx             # Web UI
├── tui.mdx             # Terminal UI
├── ide.mdx             # IDE integrations
├── github.mdx          # GitHub integration
├── gitlab.mdx          # GitLab integration
├── rules.mdx           # Rules and policies
├── network.mdx         # Network configuration
├── acp.mdx             # Agent Client Protocol
├── ecosystem.mdx       # Ecosystem overview
├── zen.mdx             # Zen (unlimited) mode
└── troubleshooting.mdx # Troubleshooting guide
```

## How to Search

### 1. Use Grep for Fast Search

```bash
# Search for specific feature
rg "pattern" docs/

# Search in specific category
rg "pattern" docs/ --glob="*.mdx"

# Case-insensitive search
rg -i "pattern" docs/
```

### 2. Browse by Category

**Core Documentation**:
- `index.mdx` - Documentation homepage
- `cli.mdx` - CLI usage and commands
- `sdk.mdx` - SDK API reference
- `tools.mdx` - Available tools
- `config.mdx` - Configuration options

**Agent System**:
- `agents.mdx` - Agent definitions
- `commands.mdx` - Custom commands
- `modes.mdx` - Agent modes
- `skills.mdx` - Agent skills

**Integrations**:
- `mcp-servers.mdx` - MCP servers
- `lsp.mdx` - Language Server Protocol
- `ide.mdx` - IDE integrations
- `github.mdx` - GitHub integration
- `gitlab.mdx` - GitLab integration

**UI**:
- `tui.mdx` - Terminal UI
- `web.mdx` - Web UI
- `keybinds.mdx` - Keyboard shortcuts
- `themes.mdx` - Custom themes

## Usage Examples

### Example 1: Find CLI Command

```bash
# Search for a specific command
rg "dev " docs/cli.mdx
```

### Example 2: Find MCP Configuration

```bash
# Find MCP settings
rg "mcp" docs/mcp-servers.mdx
```

### Example 3: Find SDK Usage

```bash
# Search SDK patterns
rg "client\." docs/sdk.mdx
```

## Tips

1. **Use openapi.json** - Complete API specification in `docs/openapi.json`
2. **Check troubleshooting** - `docs/troubleshooting.mdx` has common issues
3. **LSP docs are detailed** - `docs/lsp.mdx` has full LSP setup guide
4. **Theme config** - See `docs/themes.mdx` for custom themes
5. **Keybinds reference** - `docs/keybinds.mdx` lists all keyboard shortcuts

## When to Use This Skill

Use this skill when:
- User asks "How do I..." questions about OpenCode features
- User needs information about CLI commands, tools, or configuration
- User wants to understand agent capabilities
- User needs troubleshooting help
- User asks about SDK or API usage
- User needs integration setup help (MCP, LSP, GitHub, GitLab)
- User asks about model or provider configuration
- User wants to customize themes, keybinds, or modes

## Search Strategy

1. **Identify the topic**
   - CLI commands → `docs/cli.mdx`
   - Agents → `docs/agents.mdx`
   - MCP → `docs/mcp-servers.mdx`
   - LSP → `docs/lsp.mdx`
   - Troubleshooting → `docs/troubleshooting.mdx`

2. **Search with grep**
   ```bash
   rg "pattern" docs/ --glob="*.mdx"
   ```

3. **Cross-reference**
   - Check related documentation files
   - Verify with `docs/config.mdx` for settings

## Documentation Updates

To update this skill's documentation:

1. Pull latest changes from opencode repository
2. Re-copy docs:
   ```bash
   cp -r /path/to/opencode/packages/docs/* ~/.agents/skills/opencode-docs/docs/
   ```
3. Test with sample queries

## Common Queries

### "How do I install OpenCode?"
→ Check `docs/index.mdx` or `docs/cli.mdx`

### "How do I configure settings?"
→ Check `docs/config.mdx`

### "How do I create an agent?"
→ Check `docs/agents.mdx`

### "How do I create a custom command?"
→ Check `docs/commands.mdx`

### "How do I set up MCP servers?"
→ Check `docs/mcp-servers.mdx`

### "How do I use the SDK?"
→ Check `docs/sdk.mdx`

### "How do I configure LSP?"
→ Check `docs/lsp.mdx`

### "How do I set up providers?"
→ Check `docs/providers.mdx`

### "How do I use GitHub integration?"
→ Check `docs/github.mdx`

### "How do I troubleshoot issues?"
→ Check `docs/troubleshooting.mdx`


