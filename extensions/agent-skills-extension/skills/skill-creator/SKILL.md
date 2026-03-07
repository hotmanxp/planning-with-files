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
│   └── Markdown instructions (under 500 lines)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code for deterministic operations
    ├── references/       - Documentation, schemas, API specs
    └── assets/           - Templates, boilerplate files
```

### SKILL.md Format

```markdown
---
name: skill-name
description: Single-line description with triggers and use cases
---

# Skill Title

Skill instructions here.

## Usage

How to use the skill.

## Examples

Concrete examples.
```

**Frontmatter requirements:**
- `name`: Lowercase, digits, hyphens only, under 64 characters
- `description`: Clear description with when-to-use guidance

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

**Link for development:**
```bash
# Link skill directory
gemini skills link ~/.agents/skills/skill-name

# Or link from extension
gemini skills link /path/to/extension/skills/skill-name
```

**Test with real queries:**
1. Start Gemini CLI
2. Test trigger conditions: "When should this skill activate?"
3. Verify skill behavior matches expectations
4. Check context usage and response quality

**Iterate based on results:**
- Refine description if not triggering correctly
- Simplify instructions if responses are verbose
- Add examples if behavior is unclear

### Step 6: Package and Publish

**Package skill (optional):**
```bash
# Skills are typically bundled in extensions
# No separate packaging needed

# If distributing standalone:
zip -r skill-name.zip skill-name/
```

**Publish via extension:**
1. Add skill to extension's `skills/` directory
2. Update `gemini-extension.json` with skill reference
3. Publish extension to GitHub or npm
4. Add `gemini-cli-extension` topic for gallery listing

**Skills auto-discover:**
- Skills in `skills/` directory are automatically loaded
- No manifest entry required for skills
- Each skill needs valid `SKILL.md` with frontmatter

### Step 7: Install (for users)

**Install skill via extension:**
```bash
# Install from GitHub
gemini extensions install https://github.com/user/repo

# Install from local path
gemini extensions install ./my-extension
```

**Reload skills:**
```bash
# In Gemini CLI
/skills reload
```

## Design Principles

### Progressive Disclosure

Three-level loading:
1. **Metadata** (name + description) - Always loaded for agent decision-making
2. **SKILL.md body** - Loaded when skill is triggered
3. **Bundled resources** - Loaded on-demand as needed

This approach saves context tokens and keeps the main session lean.

### Concise is Key

- Only add context Gemini CLI doesn't already have
- Prefer concise examples over verbose explanations
- Move detailed references to separate files in `references/`
- Keep SKILL.md under 500 lines
- Use imperative/infinitive form in instructions

### Appropriate Freedom

**High freedom**: Text instructions for flexible tasks
- Example: "Review the code for security issues"

**Medium freedom**: Pseudocode or parameterized scripts
- Example: "Run `scripts/analyze.py --input={{file}}`"

**Low freedom**: Specific scripts for critical operations
- Example: "Execute `scripts/rotate_pdf.cjs` with exact parameters"

### Skill Naming

- Lowercase, digits, hyphens only: `code-review`, `pdf-rotator`
- Under 64 characters
- Verb-led phrases when helpful: `rotate-pdf`, `audit-security`
- Namespace by tool when helpful: `gh-pr-review`, `npm-audit`

### Trigger Design

The `description` field determines when the main agent activates the skill:

**Good descriptions:**
- "Rotate PDF pages by 90, 180, or 270 degrees"
- "Security auditor for web applications: SQL injection, XSS, hardcoded credentials"
- "Git expert for commits, rebasing, bisect, PR workflows"

**Bad descriptions:**
- "Helps with stuff" (too vague)
- "Code agent" (not specific)
- "Does things" (no use cases)

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

- **README.md or installation guides**: Skills auto-install via extensions
- **CHANGELOG.md or version history**: Keep version info in git tags
- **Auxiliary documentation**: About the skill creation process itself
- **Verbose explanations**: Move detailed docs to `references/`
- **Redundant context**: Information Gemini CLI already has

### Do Include

- **Essential procedural instructions**: Clear, actionable steps
- **Scripts for repeatable operations**: Deterministic, tested code
- **Reference documentation**: Schemas, API specs, domain knowledge
- **Templates and assets**: Boilerplate for output generation
- **Concrete examples**: Show, don't just tell
- **Trigger conditions**: When to activate the skill

## Iteration

After deployment:
1. Monitor skill performance in real usage
2. Identify struggles or inefficiencies
3. Update SKILL.md or resources based on feedback
4. Re-test and re-package
5. Release updated version with changelog

## Troubleshooting

### Skill Not Triggering

**Check description:**
- Is it specific enough?
- Does it mention use cases?
- Would the main agent understand when to use it?

**Test trigger conditions:**
```bash
# Ask directly
"Use the <skill-name> skill to..."

# Check available skills
/skills list
```

### Skill Making Mistakes

**Refine instructions:**
- Add clearer constraints
- Provide more examples
- Reduce temperature in complex tasks

**Add guardrails:**
- Specify what NOT to do
- Include error handling
- Add validation steps

### Skill Taking Too Long

**Optimize instructions:**
- Set clear scope boundaries
- Add explicit stopping criteria
- Limit iterations with "do X, then stop"

**Reduce context:**
- Move verbose references to separate files
- Use progressive disclosure
- Keep SKILL.md concise
