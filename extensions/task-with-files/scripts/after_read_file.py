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

    tool_input = input_data.get("tool_input", {})
    file_path = tool_input.get("file_path", "")

    if file_path:
        try:
            ws = Path(workspace_path)
            rel_path = Path(file_path).relative_to(ws)
        except ValueError:
            rel_path = Path(file_path)

        additional_context = f"""

---

**[task-with-files] File Read: {rel_path}**

If this contains useful information for your current task, consider adding a summary to **findings.md**.
"""
    else:
        additional_context = """

---

**[task-with-files] You just read a file.**

If this contains useful information for your current task, consider adding a summary to **findings.md**.
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


if __name__ == "__main__":
    main()
