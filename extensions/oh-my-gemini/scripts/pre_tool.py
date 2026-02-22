#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path

WRITE_TOOLS = {"write_file", "edit_file"}


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


def is_sisyphus_path(file_path: str) -> bool:
    sisyphus_dirs = {".sisyphus", ".agent_working_dir", ".gemini"}
    path = Path(file_path)
    for part in path.parts:
        if part in sisyphus_dirs:
            return True
    return False


def main():
    workspace_path = os.environ.get("WORKSPACE_PATH", "")

    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError:
        print(json.dumps({"decision": "allow"}), flush=True)
        return

    tool_name = input_data.get("tool_name", "")

    if tool_name not in WRITE_TOOLS:
        print(json.dumps({"decision": "allow"}), flush=True)
        return

    current_task = get_current_task(workspace_path)

    if not current_task:
        print(json.dumps({"decision": "allow"}), flush=True)
        return

    tool_input = input_data.get("tool_input", {})
    file_path = tool_input.get("file_path", "") or tool_input.get("file", "")

    if file_path and not is_sisyphus_path(file_path):
        additional_context = """

---

**[oh-my-gemini] ORCHESTRATOR REMINDER**

You are about to directly modify a file outside planning directories.

As an ORCHESTRATOR:
- Consider DELEGATING to a subagent instead
- If you must modify directly, keep it minimal
- After modifying, update **progress.md** with what was done

**Delegation is preferred for substantial work.**
"""

        print(
            json.dumps(
                {
                    "decision": "allow",
                    "hookSpecificOutput": {"additionalContext": additional_context},
                }
            ),
            flush=True,
        )
    else:
        print(json.dumps({"decision": "allow"}), flush=True)


if __name__ == "__main__":
    main()
