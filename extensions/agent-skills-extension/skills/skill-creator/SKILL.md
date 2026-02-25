---
name: skill-creator
description:
  Use this skill when creating new skills for Gemini CLI. This skill provides a complete workflow for designing, implementing, packaging, and installing skills.
---

# Skill Creator

This skill guides you through creating effective skills for Gemini CLI.

## What Are Skills

Skills are modular packages that extend Gemini CLI's capabilities with specialized knowledge, workflows, and tools.

### Skill Structure

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/          - Executable code
    ├── references/       - Documentation
    └── assets/           - Templates, files
```

## Creation Workflow

### Step 1: Understand the Need

Identify what the skill should accomplish:
- What repetitive task does it solve?
- What specialized knowledge does it provide?
- When should this skill trigger?

### Step 2: Plan Resources

Determine what bundled resources are needed:

**Scripts** (`scripts/`):
- Use for deterministic, repeatable operations
- Example: `scripts/rotate_pdf.cjs`, `scripts/generate_report.py`

**References** (`references/`):
- Documentation, schemas, API specs
- Example: `references/schema.md`, `references/api-docs.md`

**Assets** (`assets/`):
- Templates, boilerplate files
- Example: `assets/template.html`, `assets/config-template.json`

### Step 3: Create SKILL.md

Create the skill file with:

**Frontmatter** (YAML):
```yaml
---
name: skill-name
description: Single-line description with triggers and use cases
---
```

**Body** (Markdown):
- Use imperative/infinitive form
- Keep under 500 lines
- Reference bundled resources clearly
- Include concrete examples

### Step 4: Implement Resources

Create the planned resources:
1. Write and test scripts
2. Document references
3. Prepare asset templates

### Step 5: Test the Skill

Test in development:
1. Link the skill: `gemini skills link ~/.agents/skills/skill-name`
2. Test with real queries
3. Iterate based on results

### Step 6: Package (Optional)

For distribution:
```bash
# Use the built-in skill-creator scripts if available
node <skill-creator-path>/scripts/package_skill.cjs <skill-folder>
```

### Step 7: Install

Install the skill:
```bash
# User scope (global)
gemini skills install <path/to/skill.skill> --scope user

# Workspace scope (local)
gemini skills install <path/to/skill.skill> --scope workspace
```

After installation, run `/skills reload` to enable.

## Design Principles

### Progressive Disclosure

Three-level loading:
1. **Metadata** (name + description) - Always loaded
2. **SKILL.md body** - When skill triggers
3. **Bundled resources** - As needed

### Concise is Key

- Only add context Gemini CLI doesn't already have
- Prefer concise examples over verbose explanations
- Move detailed references to separate files

### Appropriate Freedom

**High freedom**: Text instructions for flexible tasks
**Medium freedom**: Pseudocode or parameterized scripts
**Low freedom**: Specific scripts for critical operations

## Skill Naming

- Lowercase, digits, hyphens only
- Under 64 characters
- Verb-led phrases (e.g., `code-review`, `pdf-editor`)
- Namespace by tool when helpful (e.g., `gh-pr-review`)

## Examples

### Simple Skill: PDF Rotator

```markdown
---
name: pdf-rotator
description: Rotate PDF pages. Use when user needs to rotate PDF files by 90, 180, or 270 degrees.
---

# PDF Rotator

Rotate PDF files using the bundled script.

## Usage

```bash
node scripts/rotate_pdf.cjs <input.pdf> <output.pdf> <degrees>
```

## Parameters

- `degrees`: 90, 180, or 270 (clockwise)
- `input.pdf`: Source file
- `output.pdf`: Destination file

## Example

```bash
node scripts/rotate_pdf.cjs input.pdf output_rotated.pdf 90
```
```

### Complex Skill: BigQuery Analyst

```markdown
---
name: bigquery-analyst
description: Query and analyze BigQuery data. Use when user needs to run SQL queries, explore schemas, or generate reports from BigQuery datasets.
---

# BigQuery Analyst

## Quick Start

Use the schema reference to understand available tables:
- See [references/schema.md](references/schema.md) for table structures
- See [references/metrics.md](references/metrics.md) for metric definitions

## Query Patterns

### Daily Active Users

Reference: [references/queries/dau.md](references/queries/dau.md)

### Revenue Analysis

Reference: [references/queries/revenue.md](references/queries/revenue.md)

## Scripts

Generate report:
```bash
node scripts/generate_report.py --query <query_name> --output <file>
```
```

## Common Pitfalls

### Don't Include

- README.md or INSTALLATION_GUIDE.md
- CHANGELOG.md or version history
- Auxiliary documentation about the skill creation process

### Do Include

- Essential procedural instructions
- Scripts for repeatable operations
- Reference documentation for domain knowledge
- Templates and assets for output generation

## Iteration

After deployment:
1. Monitor skill performance
2. Identify struggles or inefficiencies
3. Update SKILL.md or resources
4. Re-test and re-package
