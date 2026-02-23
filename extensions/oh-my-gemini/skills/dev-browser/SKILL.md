---
name: dev-browser
description: Browser automation with persistent page state. Use for: navigate websites, fill forms, screenshots, web scraping, testing.
---

# Dev Browser Skill

Browser automation that maintains page state across script executions.

## Two Modes

### Standalone Mode
```bash
./skills/dev-browser/server.sh &
# Wait for "Ready" message
```

### Extension Mode
Connects to user's existing Chrome browser. Use when user is already logged in.

## Writing Scripts

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect } from "@/client.js";
const client = await connect();
const page = await client.page("example");
await page.goto("https://example.com");
await client.disconnect();
EOF
```

### Key Principles

1. **Small scripts**: Each does ONE thing
2. **Evaluate state**: Log state to decide next steps
3. **Descriptive page names**: "checkout", "login", not "main"
4. **Disconnect to exit**: pages persist on server

## Client API

```typescript
const client = await connect();
const page = await client.page("name");
const snapshot = await client.getAISnapshot("name");
const element = await client.selectSnapshotRef("name", "e5");
await client.disconnect();
```

## Waiting

```typescript
await waitForPageLoad(page);
await page.waitForSelector(".results");
await page.waitForURL("**/success");
```

## Screenshots

```typescript
await page.screenshot({ path: "tmp/screenshot.png" });
```

## Anti-Patterns

- Don't write huge monolithic scripts
- Don't forget to disconnect
- No TypeScript in page.evaluate()
