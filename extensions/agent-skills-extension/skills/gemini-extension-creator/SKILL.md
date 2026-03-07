---
name: gemini-extension-creator
description:
  Guide for creating extensions for Gemini CLI. Use when user wants to create, package, or publish extensions that add skills, themes, custom commands, hooks, or MCP servers to Gemini CLI.
---

# Gemini CLI Extension Creator

This skill guides you through creating extensions for Gemini CLI.

## What Are Extensions

Extensions are packages that extend Gemini CLI's capabilities by bundling:
- **MCP servers**: Model Context Protocol servers for new tools and data sources
- **Custom commands**: Shortcuts for repetitive tasks and complex prompts
- **Context files** (`GEMINI.md`): Persistent context loaded at session start
- **Agent skills**: Specialized workflows activated when needed
- **Hooks**: Lifecycle event interception and customization
- **Themes**: Custom UI color schemes
- **Sub-agents**: Delegable specialized agents (preview feature)
- **Policy Engine**: Safety rules and checkers

## Extension Structure

```
my-extension/
├── gemini-extension.json    # Required: Extension metadata
├── package.json             # Optional: For npm publishing
├── GEMINI.md                # Optional: Context file (or use contextFileName)
├── README.md                # Optional: Documentation
├── src/                     # Optional: Source code
│   └── index.ts
├── dist/                    # Optional: Build output
├── skills/                  # Optional: Skill bundles
│   └── my-skill/
│       └── SKILL.md
├── themes/                  # Optional: Custom themes (in manifest)
├── commands/                # Optional: Custom commands
│   └── my-command.toml
├── hooks/                   # Optional: Event hooks
│   └── hooks.json
├── agents/                  # Optional: Sub-agents (preview)
│   └── my-agent.md
├── policies/                # Optional: Policy Engine rules
│   └── policies.toml
└── mcp/                     # Optional: MCP servers
    └── server.js
```

## gemini-extension.json Format

### Basic Structure

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "description": "My awesome extension"
}
```

### With MCP Servers

```json
{
  "name": "mcp-extension",
  "version": "1.0.0",
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["${extensionPath}/mcp/server.js"],
      "cwd": "${extensionPath}"
    }
  }
}
```

### With Settings

```json
{
  "name": "my-api-extension",
  "version": "1.0.0",
  "settings": [
    {
      "name": "API Key",
      "description": "Your API key for the service.",
      "envVar": "MY_API_KEY",
      "sensitive": true
    }
  ]
}
```

### With Context File

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "contextFileName": "GEMINI.md",
  "excludeTools": ["run_shell_command(rm -rf *)"]
}
```

### With Themes

```json
{
  "name": "my-green-extension",
  "version": "1.0.0",
  "themes": [
    {
      "name": "shades-of-green",
      "type": "custom",
      "background": {
        "primary": "#1a362a"
      },
      "text": {
        "primary": "#a6e3a1",
        "secondary": "#6e8e7a"
      },
      "status": {
        "success": "#76c076",
        "warning": "#d9e689",
        "error": "#b34e4e"
      }
    }
  ]
}
```

### With Planning

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "plan": {
    "directory": ".gemini/plans"
  }
}
```

### With Skills

```json
{
  "name": "skills-bundle",
  "version": "1.0.0",
  "skills": {
    "my-skill": "./skills/my-skill"
  }
}
```

### With Themes

```json
{
  "name": "themes-bundle",
  "version": "1.0.0",
  "themes": [
    {
      "name": "my-theme",
      "type": "custom",
      "background": {
        "primary": "#1a362a"
      },
      "text": {
        "primary": "#a6e3a1",
        "secondary": "#6e8e7a"
      },
      "status": {
        "success": "#76c076",
        "warning": "#d9e689",
        "error": "#b34e4e"
      }
    }
  ]
}
```

### With MCP Servers

```json
{
  "name": "mcp-extension",
  "version": "1.0.0",
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["${extensionPath}/server.js"],
      "cwd": "${extensionPath}"
    }
  }
}
```

### With Custom Commands

```json
{
  "name": "commands-extension",
  "version": "1.0.0",
  "commands": {
    "my-command": "./commands/my-command.toml"
  }
}
```

## Creation Workflow

### Step 1: Plan Extension Content

Decide what your extension will include:
- **Skills bundle**: Multiple related skills
- **Theme pack**: Custom UI themes
- **Command pack**: Reusable custom commands
- **MCP server**: External tool integration
- **Mixed**: Combination of above

### Step 2: Create Directory Structure

```bash
mkdir -p my-extension/skills
mkdir -p my-extension/themes
mkdir -p my-extension/commands
cd my-extension
```

### Step 3: Create gemini-extension.json

```bash
cat > gemini-extension.json << 'EOF'
{
  "name": "my-extension",
  "version": "1.0.0"
}
EOF
```

### Step 4: Add Extension Content

#### Adding Skills

```bash
mkdir -p skills/my-skill
cat > skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Description of what the skill does
---

# My Skill

Skill instructions here.
EOF
```

Update `gemini-extension.json`:
```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "skills": {
    "my-skill": "./skills/my-skill"
  }
}
```

#### Adding Themes

```bash
mkdir -p themes
cat > themes/my-theme.json << 'EOF'
{
  "name": "my-theme",
  "type": "custom",
  "background": {
    "primary": "#1a362a"
  },
  "text": {
    "primary": "#a6e3a1"
  }
}
EOF
```

#### Adding Custom Commands

```bash
mkdir -p commands
cat > commands/my-command.toml << 'EOF'
description = "My custom command"
prompt = """
Your command prompt here.
"""
EOF
```

#### Adding MCP Servers

```bash
mkdir -p mcp
cat > mcp/server.js << 'EOF'
import { Server } from "@modelcontextprotocol/sdk/server/index.js"

const server = new Server({
  name: "my-mcp-server",
  version: "1.0.0"
})

// Define tools and prompts
EOF
```

Update `gemini-extension.json`:
```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["${extensionPath}/mcp/server.js"],
      "cwd": "${extensionPath}"
    }
  }
}
```

### Step 5: Test Extension

#### Link for Development

```bash
gemini extensions link /path/to/my-extension
```

#### Install Locally

```bash
gemini extensions install /path/to/my-extension --scope workspace
```

#### Install Globally

```bash
gemini extensions install /path/to/my-extension --scope user
```

### Step 6: Package for Distribution

#### For npm Publishing

```bash
# Create package.json
cat > package.json << 'EOF'
{
  "name": "gemini-cli-extension-my-extension",
  "version": "1.0.0",
  "description": "My Gemini CLI extension",
  "keywords": ["gemini-cli", "extension"],
  "files": [
    "gemini-extension.json",
    "skills/",
    "themes/",
    "commands/"
  ]
}
EOF

# Publish to npm
npm publish
```

#### For Direct Sharing

Create a `.zip` file:
```bash
zip -r my-extension.zip my-extension/
```

## Extension Templates

### Template 1: Skills Bundle

```
skills-bundle/
├── gemini-extension.json
├── package.json
└── skills/
    ├── skill-1/
    │   └── SKILL.md
    ├── skill-2/
    │   └── SKILL.md
    └── skill-3/
        └── SKILL.md
```

`gemini-extension.json`:
```json
{
  "name": "productivity-skills",
  "version": "1.0.0",
  "skills": {
    "code-reviewer": "./skills/code-reviewer",
    "documentation": "./skills/documentation",
    "testing": "./skills/testing"
  }
}
```

### Template 2: Theme Pack

```
theme-pack/
├── gemini-extension.json
└── themes/
    ├── ocean-blue.json
    ├── forest-green.json
    └── sunset-orange.json
```

`gemini-extension.json`:
```json
{
  "name": "nature-themes",
  "version": "1.0.0",
  "themes": [
    "./themes/ocean-blue.json",
    "./themes/forest-green.json",
    "./themes/sunset-orange.json"
  ]
}
```

### Template 3: Command Library

```
command-library/
├── gemini-extension.json
└── commands/
    ├── git-commit.toml
    ├── git-pr.toml
    └── review-code.toml
```

### Template 4: MCP Integration

```
mcp-integration/
├── gemini-extension.json
├── package.json
└── mcp/
    ├── server.js
    └── tools/
        └── custom-tool.js
```

`gemini-extension.json`:
```json
{
  "name": "database-mcp",
  "version": "1.0.0",
  "mcpServers": {
    "postgres": {
      "command": "node",
      "args": ["${extensionPath}/mcp/server.js"],
      "cwd": "${extensionPath}",
      "env": {
        "DATABASE_URL": "${env:DATABASE_URL}"
      }
    }
  }
}
```

## Extension Commands Reference

### Install Extension

```bash
# From GitHub repository
gemini extensions install https://github.com/user/repo

# From local directory
gemini extensions install ./my-extension

# From specific git ref (branch, tag, commit)
gemini extensions install https://github.com/user/repo --ref dev

# With auto-update enabled
gemini extensions install https://github.com/user/repo --auto-update

# Skip confirmation prompt
gemini extensions install https://github.com/user/repo --consent
```

### Link Extension (Development)

```bash
gemini extensions link ./my-extension
```

Creates a symbolic link for local development. Changes are reflected immediately after rebuild and session restart.

### List Extensions

```bash
# List all extensions
gemini extensions list

# In CLI interactive mode
/extensions list
```

### Enable/Disable Extension

```bash
# Disable for workspace
gemini extensions disable my-extension --scope workspace

# Disable globally
gemini extensions disable my-extension --scope user

# Enable for workspace
gemini extensions enable my-extension --scope workspace

# Enable globally
gemini extensions enable my-extension --scope user
```

### Update Extension

```bash
# Update specific extension
gemini extensions update my-extension

# Update all extensions
gemini extensions update --all
```

### Uninstall Extension

```bash
# Uninstall one or more extensions
gemini extensions uninstall my-extension
gemini extensions uninstall ext1 ext2 ext3
```

### Configure Extension Settings

```bash
# Configure settings
gemini extensions config my-extension
gemini extensions config my-extension "API Key"
```

### Create Extension from Template

```bash
# Create new extension with template
gemini extensions new my-extension mcp-server
gemini extensions new my-extension context
gemini extensions new my-extension custom-commands
```

## Best Practices

### 1. Naming Conventions

- Use lowercase with hyphens: `my-extension`, `gcp-tools`
- Prefix npm packages: `gemini-cli-extension-my-extension`
- Be descriptive: `productivity-skills` not `skills`
- Match directory name to `name` field in manifest

### 2. Version Management

- Follow [Semantic Versioning](https://semver.org/): `1.0.0`
  - **Major**: Breaking changes (renaming tools, changing arguments)
  - **Minor**: New features (adding tools, commands)
  - **Patch**: Bug fixes, performance improvements
- Document changes in changelog or README
- Use git tags for releases: `v1.0.0`

### 3. Documentation

- Include README.md with:
  - Extension description
  - Installation instructions
  - Usage examples
  - Configuration options
- Document all skills, commands, and tools
- Provide code examples and screenshots

### 4. Security

- **Minimal permissions**: Only request necessary tool access
- **Validate inputs**: Always validate tool inputs in MCP servers
- **Secure secrets**: Use `sensitive: true` for API keys
- **Exclude dangerous commands**: Use `excludeTools` to block risky operations

```json
{
  "excludeTools": ["run_shell_command(rm -rf *)"]
}
```

### 5. Testing

- Test with `gemini extensions link` for rapid iteration
- Verify tools appear in debug console (F12)
- Test custom commands resolve correctly
- Manual verification in live CLI session
- Write unit tests for MCP server logic

### 6. Distribution

- **Git repository**: Simple, flexible, supports dev branches
- **GitHub Releases**: Faster installation, platform-specific builds
- Use release channels: `stable`, `dev`, `preview` branches
- List in gallery: Add `gemini-cli-extension` topic to GitHub repo

## Troubleshooting

### Extension Not Loading

If extension doesn't appear in `/extensions list`:

1. **Check manifest location**: Ensure `gemini-extension.json` is in root directory
2. **Verify JSON syntax**: Validate JSON is properly formatted
3. **Check name match**: `name` field must match directory name exactly
4. **Restart CLI**: Extensions load at session start
5. **Reinstall**: Try uninstall and reinstall

```bash
gemini extensions list
gemini extensions uninstall my-extension
gemini extensions install ./my-extension
```

### MCP Server Failures

If tools aren't working:

1. **Check logs**: View CLI logs for MCP server startup errors
2. **Test command directly**: Run `command` and `args` in terminal
3. **Debug console**: Press F12 in interactive mode to inspect tool calls
4. **Verify dependencies**: Run `npm install` in extension directory
5. **Check paths**: Ensure `${extensionPath}` variables resolve correctly

### Command Conflicts

If custom commands don't respond:

1. **Check precedence**: User/project commands override extension commands
2. **Use prefixed name**: Try `/extension.command` format
3. **Run /help**: See all available commands and their sources

```bash
# Check available commands
/help
```

### Skills Not Loading

1. **Check skill paths**: Verify paths in `gemini-extension.json`
2. **Validate SKILL.md**: Ensure each skill has valid frontmatter
3. **Reload skills**: Run `/skills reload` in CLI
4. **Check discovery**: Skills auto-discover from `skills/` directory

### Extension Not Listed in Gallery

1. **Public repository**: Ensure GitHub repo is public
2. **Add topic**: Add `gemini-cli-extension` topic to repository
3. **Manifest at root**: `gemini-extension.json` must be in root
4. **Wait for crawl**: Gallery crawls tagged repos daily

## When to Use This Skill

Use this skill when:
- User wants to create a Gemini CLI extension
- User needs to bundle multiple skills
- User wants to publish custom themes
- User needs to distribute MCP servers
- User asks about extension format
- User wants to share extensions
