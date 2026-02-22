# Examples: Planning with Files in Action

## Example 1: Research Task

**User Request:** "Research the benefits of morning exercise and write a summary"

### Loop 1: Create Plan
```bash
Write task_plan.md
```

```markdown
# Task Plan: Morning Exercise Benefits Research

## Goal
Create a research summary on the benefits of morning exercise.

## Phases
- [ ] Phase 1: Create this plan ✓
- [ ] Phase 2: Search and gather sources
- [ ] Phase 3: Synthesize findings
- [ ] Phase 4: Deliver summary

## Key Questions
1. What are the physical health benefits?
2. What are the mental health benefits?
3. What scientific studies support this?

## Status
**Currently in Phase 1** - Creating plan
```

### Loop 2: Research
```bash
Read task_plan.md           # Refresh goals
WebSearch "morning exercise benefits"
Write notes.md              # Store findings
Edit task_plan.md           # Mark Phase 2 complete
```

### Loop 3: Synthesize
```bash
Read task_plan.md           # Refresh goals
Read notes.md               # Get findings
Write morning_exercise_summary.md
Edit task_plan.md           # Mark Phase 3 complete
```

### Loop 4: Deliver
```bash
Read task_plan.md           # Verify complete
Deliver morning_exercise_summary.md
```

---

## Example 2: Bug Fix Task

**User Request:** "Fix the login bug in the authentication module"

### task_plan.md
```markdown
# Task Plan: Fix Login Bug

## Goal
Identify and fix the bug preventing successful login.

## Phases
- [x] Phase 1: Understand the bug report ✓
- [x] Phase 2: Locate relevant code ✓
- [ ] Phase 3: Identify root cause (CURRENT)
- [ ] Phase 4: Implement fix
- [ ] Phase 5: Test and verify

## Key Questions
1. What error message appears?
2. Which file handles authentication?
3. What changed recently?

## Decisions Made
- Auth handler is in src/auth/login.ts
- Error occurs in validateToken() function

## Errors Encountered
- [Initial] TypeError: Cannot read property 'token' of undefined
  → Root cause: user object not awaited properly

## Status
**Currently in Phase 3** - Found root cause, preparing fix
```

---

## Example 3: Feature Development

**User Request:** "Add a dark mode toggle to the settings page"

### The 3-File Pattern in Action

**task_plan.md:**
```markdown
# Task Plan: Dark Mode Toggle

## Goal
Add functional dark mode toggle to settings.

## Phases
- [x] Phase 1: Research existing theme system ✓
- [x] Phase 2: Design implementation approach ✓
- [ ] Phase 3: Implement toggle component (CURRENT)
- [ ] Phase 4: Add theme switching logic
- [ ] Phase 5: Test and polish

## Decisions Made
- Using CSS custom properties for theme
- Storing preference in localStorage
- Toggle component in SettingsPage.tsx

## Status
**Currently in Phase 3** - Building toggle component
```

**findings.md:**
```markdown
# Findings & Decisions

## Requirements
- Add dark mode toggle to settings page
- Persist user preference
- Smooth theme transition

## Project Structure
- src/styles/ - Theme and CSS
- src/components/ - UI components
- src/hooks/ - React hooks

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| CSS custom properties | Easy theme switching, no JS overhead |
| localStorage | Persist preference across sessions |
| useTheme hook | Reusable, clean separation of concerns |

## Proposed Solutions

### Solution A: CSS Custom Properties
**Affected Files:**
- `src/styles/theme.ts` - Add dark theme color definitions
- `src/components/SettingsPage.tsx` - Add toggle UI
- `src/hooks/useTheme.ts` - Create new hook
- `src/App.tsx` - Wrap with ThemeProvider

**Effort:** Medium (2-3 hours)

**Pros:**
- Clean separation of concerns
- No external dependencies
- Follows React best practices

**Cons:**
- Requires creating new hook
- Multiple file changes

### Solution B: CSS-in-JS Theme Provider
**Affected Files:**
- `src/theme/ThemeProvider.tsx` - Create provider
- `src/components/SettingsPage.tsx` - Add toggle

**Effort:** Low (1 hour)

**Pros:**
- Single file for theme logic
- Built-in type safety

**Cons:**
- Adds styled-components dependency
- Less flexible for non-JS contexts

### Recommendation
**Solution A** is recommended. It uses native CSS features, requires no new dependencies, and aligns with the existing codebase patterns.
```

**dark_mode_implementation.md:** (deliverable)
```markdown
# Dark Mode Implementation

## Changes Made

### 1. Added dark theme colors
File: src/styles/theme.ts
```typescript
export const darkTheme = {
  background: '#1a1a2e',
  surface: '#16213e',
  text: '#eaeaea',
};
```

### 2. Created useTheme hook
File: src/hooks/useTheme.ts
```typescript
export function useTheme() {
  // Implementation
}
```

### 3. Added toggle to settings
File: src/components/SettingsPage.tsx
```tsx
<Toggle label="Dark Mode" onChange={toggleTheme} />
```
```

---

## Example 4: Code Project with Multiple Solutions

**User Request:** "Add authentication to the API endpoints"

### Phase 1: Project Research (task_plan.md)
```markdown
# Task Plan: Add API Authentication

## Goal
Secure API endpoints with JWT-based authentication.

## Current Phase
Phase 1: Project Research & Solution Design

## Phases

### Phase 1: Project Research & Solution Design
- [x] Analyze project structure and architecture
- [x] Identify affected modules and files
- [x] Research existing patterns and conventions
- [x] Develop 2-3 alternative solutions
- [x] Document findings in findings.md
- [ ] Present solutions to user and get confirmation
- **Status:** in_progress

### Phase 2: Implementation (depends on chosen solution)
- [ ] [Tasks based on confirmed solution]
- **Status:** pending

### Phase 3: Testing & Verification
- [ ] Write unit tests for auth middleware
- [ ] Test protected endpoints
- [ ] Verify token refresh works
- **Status:** pending

## Decisions Made
| Decision | Rationale | Date |
|----------|-----------|------|
|          |           |      |
```

### findings.md (After Research)
```markdown
# Findings & Decisions

## Requirements
- Add JWT authentication to API endpoints
- Protect /api/users, /api/data endpoints
- Allow public access to /api/health, /api/auth/login

## Project Structure
- src/api/routes.ts - Main API router
- src/api/controllers/ - Request handlers
- src/middleware/ - Express middleware
- src/utils/jwt.ts - JWT utilities (exists)

## Entry Points
- src/app.ts - Express app initialization
- src/api/routes.ts - API route definitions

## Core Modules
- routes.ts - Defines all API endpoints
- controllers/user.controller.ts - User operations
- controllers/data.controller.ts - Data operations

## Technology Stack
- Node.js 18.x
- Express 4.x
- jsonwebtoken package (already installed)
- TypeScript

## Coding Conventions
- Middleware pattern: (req, res, next) => {}
- Error handling: try-catch with next(err)
- Route guards as separate middleware functions

## Proposed Solutions

### Solution A: Custom Auth Middleware
**Description:** Create express middleware that validates JWT tokens on protected routes.

**Affected Files:**
- `src/middleware/auth.middleware.ts` - Create new auth middleware
- `src/api/routes.ts` - Apply middleware to protected routes
- `src/controllers/auth.controller.ts` - Add token generation logic

**Effort:** Medium (2-3 hours)

**Pros:**
- Full control over auth logic
- Follows existing middleware patterns
- Easy to customize and extend
- No new dependencies

**Cons:**
- More code to maintain
- Need to handle edge cases (expired tokens, etc.)

### Solution B: express-jwt Package
**Description:** Use the express-jwt middleware package for standardized JWT handling.

**Affected Files:**
- `src/api/routes.ts` - Apply express-jwt middleware
- `src/middleware/errorHandler.ts` - Add JWT error handling
- `src/controllers/auth.controller.ts` - Add token generation

**Effort:** Low (1 hour)

**Pros:**
- Well-tested, industry standard
- Minimal code changes
- Built-in error handling

**Cons:**
- Adds new dependency
- Less flexible for custom requirements
- May need configuration for edge cases

### Solution C: Hybrid Approach (Recommended)
**Description:** Start with custom middleware (Solution A) but structure it like express-jwt for future replacement.

**Affected Files:** Same as Solution A

**Effort:** Medium (2-3 hours)

**Pros:**
- Best of both worlds
- Can migrate to express-jwt later if needed
- Maintains flexibility
- No new dependencies

**Cons:**
- Slightly more initial work
- Need to design clean interface

### Recommendation
I recommend **Solution C (Hybrid Approach)** because:
1. The project already has jsonwebtoken installed
2. Custom middleware allows for project-specific requirements
3. Clean design allows easy migration to express-jwt if complexity grows
4. No new dependencies to manage
```

### After User Confirmation
```markdown
## Technical Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Use Solution C (Hybrid) | Balances flexibility with clean design, no new deps | 2026-02-22 |
```

---

## Example 5: Error Recovery Pattern

When something fails, DON'T hide it:

### Before (Wrong)
```
Action: Read config.json
Error: File not found
Action: Read config.json  # Silent retry
Action: Read config.json  # Another retry
```

### After (Correct)
```
Action: Read config.json
Error: File not found

# Update task_plan.md:
## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| config.json not found | 1 | Will create default config |

Action: Write config.json (default config)
Action: Read config.json
Success!
```

---

## The Read-Before-Decide Pattern

**Always read your plan before major decisions:**

```
[Many tool calls have happened...]
[Context is getting long...]
[Original goal might be forgotten...]

→ Read task_plan.md          # This brings goals back into attention!
→ Now make the decision       # Goals are fresh in context
```

This is why planning files work. The plan file acts as a "goal refresh" mechanism.

---

## Example 6: Adaptive Planning

**Scenario:** You chose Solution A, but discovered it won't work during implementation.

### Initial Plan (task_plan.md)
```markdown
## Current Phase
Phase 2: Implementation

## Phases
### Phase 2: Implement Solution A
- [ ] Create auth middleware
- [ ] Apply to routes
- **Status:** in_progress

## Decisions Made
| Use Solution A | Custom middleware approach | 2026-02-22 |
```

### Problem Discovered
```markdown
## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Circular dependency in middleware | 1 | Need to refactor module structure |
| Circular dependency persists | 2 | Solution A architecture is flawed |

## Decisions Made
| Decision | Rationale | Date |
|----------|-----------|------|
| Switch to Solution B | Solution A has architectural issues (circular deps). express-jwt handles this cleanly. | 2026-02-22 |
```

### Updated Plan
```markdown
## Current Phase
Phase 2: Implementation (Solution B)

## Phases
### Phase 2: Implement Solution B (express-jwt)
- [ ] Install express-jwt package
- [ ] Configure middleware
- [ ] Apply to routes
- **Status:** in_progress

## Decisions Made
| Switch to Solution B | Solution A has circular dependency issues | 2026-02-22 |
```

---

## Key Takeaways

1. **Plan First** - Always create task_plan.md before starting work
2. **Multiple Solutions** - Present 2-3 options with pros/cons for code tasks
3. **Document Everything** - Use findings.md for research, decisions, and issues
4. **Log Errors** - Never silently retry; document failures and resolutions
5. **Adapt When Needed** - Update the plan when you learn new information
6. **Read Before Deciding** - Refresh goals by re-reading task_plan.md
