# OpenCode AGENTS.md

- **Default branch**: `dev`. Local `main` ref may not exist; use `dev` or `origin/dev` for diffs.
- **ALWAYS USE PARALLEL TOOLS** when applicable.
- **Prefer automation**: Execute requested actions without confirmation unless blocked by missing info or safety/irreversibility.
- **To regenerate JS SDK**: Run `./packages/sdk/js/script/build.ts`.
- **Tests cannot run from repo root** (guard: `do-not-run-tests-from-root`); run from package dirs.

---

## Build, Lint & Test Commands

### Root Commands

```bash
bun install          # Install all dependencies
bun dev              # Start OpenCode dev server (packages/opencode)
bun dev <dir>        # Start OpenCode TUI in specific directory
bun dev serve        # Start headless API server (port 4096)
bun dev web          # Start server + open web interface
bun turbo typecheck  # Run typecheck across all packages
```

### Single Package Commands (run from package directory)

#### packages/opencode

```bash
cd packages/opencode
bun test                    # Run all tests (30s timeout)
bun test <file>             # Run single test file
bun test --watch            # Watch mode
bun test --coverage         # Run with coverage
bun run typecheck           # TypeScript check
bun run lint                # Lint checks
bun run db generate --name <slug>  # Generate Drizzle migration
```

#### packages/app

```bash
cd packages/app
bun test                    # Run all unit tests
bun test <file>            # Run single test file
bun test --watch           # Watch mode
bun test:unit              # Unit tests (with happy-dom)
bun test:e2e               # Playwright e2e tests
bun test:e2e:local         # E2E with local sandbox
bun test:e2e:ui            # E2E with Playwright UI
bun run typecheck          # TypeScript check
bun run dev                # Start Vite dev server
bun run build              # Production build
```

### Building Executable

```bash
./packages/opencode/script/build.ts --single
# Run: ./packages/opencode/dist/opencode-<platform>/bin/opencode
```

---

## Code Style Guidelines

### General Principles

- **Keep things in one function** unless composable or reusable
- **Avoid `try`/`catch`** where possible; prefer `.catch()` chaining
- **Avoid using the `any` type** — use precise types
- **Use Bun APIs** when possible, like `Bun.file()`
- **Rely on type inference** — avoid explicit type annotations unless needed for exports
- **Prefer functional array methods** (`flatMap`, `filter`, `map`) over for loops
- Use type guards on `filter` to maintain type inference

### Naming

Prefer **single word** names for variables and functions. Only use multiple words if necessary.

```ts
// Good
const foo = 1
function journal(dir: string) {}

// Bad
const fooBar = 1
function prepareJournal(dir: string) {}
```

### Variables

**Inline** when a value is only used once. Prefer `const` over `let`. Use ternaries or early returns.

```ts
// Good
const journal = await Bun.file(path.join(dir, "journal.json")).json()
const foo = condition ? 1 : 2

// Bad
const journalPath = path.join(dir, "journal.json")
const journal = await Bun.file(journalPath).json()
let foo
if (condition) foo = 1
else foo = 2
```

### Destructuring

Avoid unnecessary destructuring. Use dot notation to preserve context.

```ts
// Good
obj.a
obj.b

// Bad
const { a, b } = obj
```

### Control Flow

Avoid `else` statements. Prefer **early returns**.

```ts
// Good
function foo() {
  if (condition) return 1
  return 2
}

// Bad
function foo() {
  if (condition) return 1
  else return 2
}
```

### Imports

Use workspace imports for internal packages:

```ts
import { something } from "@opencode-ai/sdk"
import { util } from "@opencode-ai/util"
```

### Error Handling

Prefer `.catch()` chaining over `try`/`catch` blocks when possible:

```ts
// Good
const result = await someOperation().catch((e) => handleError(e))

// Avoid
try {
  const result = await someOperation()
} catch (e) {
  handleError(e)
}
```

### Schema Definitions (Drizzle)

Use **snake_case** for field names so column names don't need redefinition:

```ts
// Good
const table = sqliteTable("session", {
  id: text().primaryKey(),
  project_id: text().notNull(),
  created_at: integer().notNull(),
})

// Bad
const table = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectID: text("project_id").notNull(),
  createdAt: integer("created_at").notNull(),
})
```

### Database Conventions

- **Schema**: Drizzle schema in `src/**/*.sql.ts`
- **Tables/columns**: snake_case
- **Join columns**: `<entity>_id`
- **Indexes**: `<table>_<column>_idx`
- **Migrations**: Generated via `drizzle.config.ts`, output to `./migration`

### Testing

- **Avoid mocks** — test actual implementation
- **Don't duplicate logic** into tests
- Test the real behavior, not your own implementation

### Prettier Config (from package.json)

```json
{
  "semi": false,
  "printWidth": 120
}
```

---

## Key Packages

- `packages/opencode` — Core business logic & server
- `packages/opencode/src/cli/cmd/tui/` — TUI (SolidJS + opentui)
- `packages/app` — Shared web UI (SolidJS)
- `packages/desktop` — Native desktop app (Tauri)
- `packages/plugin` — `@opencode-ai/plugin` source
