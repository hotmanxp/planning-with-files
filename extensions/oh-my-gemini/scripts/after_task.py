#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path


def get_current_task(workspace_path: str):
    if not workspace_path:
        return None

    current_task_file = (
        Path(workspace_path) / ".agent_working_dir" / "current_task.json"
    )

    if not current_task_file.exists():
        return None

    try:
        with open(current_task_file, "r") as f:
            data = json.load(f)
        return data.get("current")
    except:
        return None


def main():
    workspace_path = os.environ.get("WORKSPACE_PATH", "")

    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError:
        print(json.dumps({"decision": "allow"}), flush=True)
        return

    current_task = get_current_task(workspace_path)

    if not current_task:
        print(json.dumps({"decision": "allow"}), flush=True)
        return

    tool_response = input_data.get("tool_response", {})
    response_content = tool_response.get("content", [])

    output_text = ""
    for item in response_content:
        if isinstance(item, dict) and item.get("type") == "text":
            output_text = item.get("text", "")
            break

    is_background = (
        "Background task launched" in output_text
        or "Background task continued" in output_text
    )

    if is_background:
        print(json.dumps({"decision": "allow"}), flush=True)
        return

    verification_reminder = """

---

**[oh-my-gemini] SUBAGENT COMPLETED - VERIFY BEFORE TRUSTING**

**PHASE 1: READ THE CODE**
1. `Bash("git diff --stat")` - see what changed
2. Read EVERY changed file - no exceptions
3. Check for: stubs, TODOs, logic errors, scope creep

**PHASE 2: RUN DIAGNOSTICS**
1. `lsp_diagnostics` on each changed file - zero errors
2. Run relevant tests

**PHASE 3: UPDATE PROGRESS**
- If verified complete: mark phase done in **progress.md**
- If issues found: note in progress, plan fix

**DO NOT proceed until verified.**
"""

    print(
        json.dumps(
            {
                "decision": "allow",
                "hookSpecificOutput": {"additionalContext": verification_reminder},
            }
        ),
        flush=True,
    )


if __name__ == "__main__":
    main()
