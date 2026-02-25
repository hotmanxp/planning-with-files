# Agent Skills Extension

A comprehensive collection of 9 professional skills + 1 custom command for Gemini CLI.

## Included Skills

### 1. skill-creator

Guide for creating new skills for Gemini CLI with complete workflow for designing, implementing, packaging, and installing.

**Use when**: Creating new skills for Gemini CLI

---

### 2. gemini-docs

Query and search Gemini CLI documentation including CLI usage, tools, settings, tutorials, and API reference.

**Use when**: User asks about Gemini CLI features, commands, or configuration

**Contains**: 84 documentation files covering:

- CLI commands and settings
- Tools reference
- Tutorials
- Core concepts
- Extensions and hooks

---

### 3. gemini-custom-commands-creator

Guide for creating custom commands in Gemini CLI for automating workflows and reusing prompts.

**Use when**: User wants to create `/command` shortcuts

**Contains**:

- Command format and structure
- Argument handling
- Shell injection
- 10+ command templates

---

### 4. opencode-docs

Query and search OpenCode documentation including CLI, SDK, agents, tools, plugins, and development guides.

**Use when**: User asks about OpenCode features or configuration

**Contains**: 47 documentation files covering:

- OpenCode CLI
- SDK and API
- Agents system
- Plugins
- Tools reference

---

### 5. opencode-plugin-creator

Guide for creating plugins for OpenCode with hooks, custom tools, and event handlers.

**Use when**: User wants to create OpenCode plugins

**Contains**:

- Plugin format and structure
- Hooks reference (20+ events)
- Custom tool creation
- 6 plugin templates

---

### 6. gemini-extension-creator

Guide for creating Gemini CLI extensions with skills, themes, commands, hooks, and MCP servers.

**Use when**: User wants to create Gemini CLI extensions

**Contains**:

- Extension format (gemini-extension.json)
- 6 extension templates
- MCP server setup
- Publishing guide

---

### 7. opencode-custom-commands-creator

Guide for creating custom commands in OpenCode with arguments, shell injection, and file references.

**Use when**: User wants to create OpenCode `/command` shortcuts

**Contains**:

- Markdown command format
- `$ARGUMENTS`, `!`cmd``, `@file` syntax
- 10 command templates
- JSON configuration

---

### 8. gemini-agent-creator

Guide for creating custom subagents in Gemini CLI with templates and best practices.

**Use when**: User wants to create Gemini CLI subagents

**Contains**:

- Agent definition format (.md + YAML)
- Configuration schema
- 6 agent templates
- Browser agent setup

---

### 9. opencode-agent-creator

Guide for creating custom agents in OpenCode with JSON and Markdown configuration.

**Use when**: User wants to create OpenCode agents (primary or subagent)

**Contains**:

- JSON and Markdown configuration
- Permission system
- Tool access control
- 6 agent templates

---

## Installation

### Link for Development

```bash
gemini extensions link /Users/ai-claw/code/planning-with-files/extensions/agent-skills-extension
```

### Install Globally

```bash
gemini extensions install /Users/ai-claw/code/planning-with-files/extensions/agent-skills-extension --scope user
```

### Install Locally

```bash
gemini extensions install /Users/ai-claw/code/planning-with-files/extensions/agent-skills-extension --scope workspace
```

## Usage

After installation, the skills are automatically available. Use them naturally in conversation:

```
"How do I create a new skill for Gemini CLI?"
→ Activates: skill-creator

"Show me how to create a custom command"
→ Activates: gemini-custom-commands-creator or opencode-custom-commands-creator

"I need to create an OpenCode plugin"
→ Activates: opencode-plugin-creator

"Create a subagent for code review"
→ Activates: gemini-agent-creator
```

## Extension Structure

```
agent-skills-extension/
├── gemini-extension.json      # Extension manifest
├── README.md                   # This file
└── skills/
    ├── skill-creator/
    │   ├── SKILL.md
    │   └── gemini-extension.json
    ├── gemini-docs/
    │   ├── SKILL.md
    │   └── gemini-extension.json
    ├── gemini-custom-commands-creator/
    │   ├── SKILL.md
    │   └── gemini-extension.json
    ├── opencode-docs/
    │   ├── SKILL.md
    │   └── gemini-extension.json
    ├── opencode-plugin-creator/
    │   ├── SKILL.md
    │   └── gemini-extension.json
    ├── gemini-extension-creator/
    │   ├── SKILL.md
    │   └── gemini-extension.json
    ├── opencode-custom-commands-creator/
    │   ├── SKILL.md
    │   └── gemini-extension.json
    ├── gemini-agent-creator/
    │   ├── SKILL.md
    │   └── gemini-extension.json
    └── opencode-agent-creator/
        ├── SKILL.md
        └── gemini-extension.json
```

## Version

1.0.0

## License

MIT


---

## Included Commands

### activate-skill

**Description**: Interactively activate a skill

**Use when**: You want to activate a skill but don't know the exact name, or prefer visual selection

**Usage**:
```bash
# Interactive mode - shows all available skills with descriptions
/activate-skill

# Direct activation
/activate-skill skill-name
```

**Features**:
- Automatically lists all discovered skills (workspace + user)
- Interactive selection dialog with descriptions
- Activates the chosen skill using `activate_skill` tool
- Confirms activation with skill details

