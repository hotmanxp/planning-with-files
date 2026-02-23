---
name: playwright
description: Browser automation via Playwright/agent-browser - verification, browsing, scraping, testing, screenshots.
---

# Playwright Skill

Browser automation via Playwright MCP or agent-browser CLI.

## Quick Start

```bash
agent-browser open <url>
agent-browser snapshot -i
agent-browser click @e1
agent-browser fill @e2 "text"
```

## Core Workflow

1. `agent-browser open <url>`
2. `agent-browser snapshot -i` (get refs)
3. Interact using refs
4. Re-snapshot after changes

## Commands

### Navigation
```bash
agent-browser open <url>
agent-browser back
agent-browser forward
agent-browser reload
```

### Snapshot
```bash
agent-browser snapshot -i  # Interactive elements
agent-browser snapshot     # Full tree
```

### Interactions
```bash
agent-browser click @e1
agent-browser fill @e2 "text"
agent-browser hover @e1
agent-browser select @e1 "value"
```

### Get Info
```bash
agent-browser get text @e1
agent-browser get title
agent-browser get url
```

### Wait
```bash
agent-browser wait @e1
agent-browser wait 2000
agent-browser wait --text "Success"
```

### Screenshots
```bash
agent-browser screenshot path.png
agent-browser screenshot --full
```

## Example: Form

```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password"
agent-browser click @e3
```

## Global Options

| Option | Description |
|--------|-------------|
| `--headed` | Show browser |
| `--json` | JSON output |
| `--session` | Isolated session |

## Installation

```bash
bun add -g agent-browser && agent-browser install
```
