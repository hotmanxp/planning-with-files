---
name: gemini-extension-creator
description:
  Guide for creating extensions for Gemini CLI. Use when user wants to create, package, or publish extensions that add skills, themes, custom commands, hooks, or MCP servers to Gemini CLI.
---

# Gemini CLI Extension Creator

This skill guides you through creating extensions for Gemini CLI.

## What Are Extensions

Extensions are packages that extend Gemini CLI's capabilities by bundling:
- Skills
- Themes
- Custom Commands
- Hooks
- MCP Servers
- Exclude Tools configurations

## Extension Structure

```
my-extension/
├── gemini-extension.json    # Required: Extension metadata
├── package.json             # Optional: For npm publishing
├── README.md                # Optional: Documentation
├── skills/                  # Optional: Skill bundles
│   └── my-skill/
│       └── SKILL.md
├── themes/                  # Optional: Custom themes
│   └── my-theme.json
├── commands/                # Optional: Custom commands
│   └── my-command.toml
├── hooks/                   # Optional: Event hooks
│   └── my-hook.js
└── mcp/                     # Optional: MCP servers
    └── server.js
```

## gemini-extension.json Format

### Basic Structure

```json
{
  "name": "my-extension",
  "version": "1.0.0"
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
# From local directory
gemini extensions install ./my-extension

# From npm
gemini extensions install gemini-cli-extension-my-extension

# Scope options
gemini extensions install ./my-extension --scope workspace
gemini extensions install ./my-extension --scope user
```

### Link Extension (Development)

```bash
gemini extensions link ./my-extension
```

### List Extensions

```bash
gemini extensions list
```

### Enable/Disable Extension

```bash
gemini extensions enable my-extension
gemini extensions disable my-extension
```

### Update Extension

```bash
gemini extensions update my-extension
gemini extensions update --all
```

### Uninstall Extension

```bash
gemini extensions uninstall my-extension
```

## Best Practices

### 1. Naming Conventions

- Use lowercase with hyphens: `my-extension`
- Prefix npm packages: `gemini-cli-extension-`
- Be descriptive: `productivity-skills` not `skills`

### 2. Version Management

- Follow semantic versioning: `1.0.0`
- Update version when adding features
- Document changes in README

### 3. Documentation

- Include README.md with usage instructions
- Document all skills/commands/themes
- Provide examples

### 4. Testing

- Test with `gemini extensions link`
- Verify all features work
- Test on clean installation

### 5. Distribution

- Publish to npm for easy installation
- Include package.json for npm extensions
- Use .zip for direct sharing

## Troubleshooting

### Extension Not Found

```bash
# Check extension is linked/installed
gemini extensions list

# Reload extensions
gemini extensions reload
```

### Invalid Extension Format

- Verify `gemini-extension.json` is valid JSON
- Check all paths are correct
- Ensure required fields (name, version) exist

### Skills Not Loading

- Check skill paths in `gemini-extension.json`
- Verify each skill has valid `SKILL.md`
- Run `/skills reload` in Gemini CLI

## When to Use This Skill

Use this skill when:
- User wants to create a Gemini CLI extension
- User needs to bundle multiple skills
- User wants to publish custom themes
- User needs to distribute MCP servers
- User asks about extension format
- User wants to share extensions
