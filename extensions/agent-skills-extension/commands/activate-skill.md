---
description: Activate a skill. If no skill name provided, list available skills and ask user to choose.
agent: build
---

Activate a skill for the user.

## Process

### 1. Check if skill name was provided

If `$ARGUMENTS` contains a skill name, activate it directly and confirm.

### 2. List available skills

You already have access to all discovered skills/agents and their descriptions from your system context. List them for the user.

### 3. Ask user to choose

Present the list and ask which one they want to activate.

### 4. Activate selected skill

Once user selects, confirm the activation.

### 5. Confirm

Tell the user the skill is now active and ready to use.

## Args

$ARGUMENTS

If provided, use as the skill name directly.
