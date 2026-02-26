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

    # Ensure current_task is an absolute path
    current_task_path = current_task if Path(current_task).is_absolute() else str(Path(workspace_path) / ".agent_working_dir" / current_task)

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

**[task-with-files] File Modified: {rel_path}**

You just modified this file. Consider updating **progress.md** with what was accomplished.

Example format for progress.md:
```
## {rel_path}

- [x] Description of change made
```

**Current Task Folder:** `{current_task_path}`

> Temporary files (test files, scripts, scratch pads) created during this task can be written within the task folder to keep the workspace organized.
"""
    else:
        additional_context = f"""

---

**[task-with-files] You just modified a file.**

Consider updating **progress.md** with what was accomplished.

**Current Task Folder:** `{current_task_path}`

> Temporary files (test files, scripts, scratch pads) created during this task can be written within the task folder to keep the workspace organized.
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
