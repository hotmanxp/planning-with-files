#!/usr/bin/env python3
"""SessionStart Hook - checks for ongoing tasks on session start."""

import json
import os
import re
import sys
from pathlib import Path


def check_task_completed(task_path: Path) -> bool:
    task_plan_file = task_path / "task_plan.md"
    if not task_plan_file.exists():
        return False

    try:
        content = task_plan_file.read_text()
        status_pattern = r"- \*\*Status:\*\* (\w+)"
        statuses = re.findall(status_pattern, content)

        if not statuses:
            return False

        return all(s == "complete" for s in statuses)

    except Exception:
        return False


def main():
    project_workspace_path = os.environ.get("WORKSPACE_PATH", "")

    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError:
        print(json.dumps({"decision": "allow"}), flush=True)
        return

    if project_workspace_path:
        working_dir_base = Path(project_workspace_path) / ".agent_working_dir"
    else:
        working_dir_base = Path(os.getcwd()) / ".agent_working_dir"

    current_task_file = working_dir_base / "current_task.json"

    if not current_task_file.exists():
        print(json.dumps({"decision": "allow"}), flush=True)
        return

    try:
        with open(current_task_file, "r") as f:
            current_task_data = json.load(f)

        current_task = current_task_data.get("current")

        if not current_task:
            print(json.dumps({"decision": "allow"}), flush=True)
            return

        task_path = Path(current_task)

        if check_task_completed(task_path):
            current_task_data["current"] = None
            with open(current_task_file, "w") as f:
                json.dump(current_task_data, f, indent=2)

            task_name = task_path.name.replace("task_", "").replace("_", " ")

            print(
                json.dumps(
                    {
                        "decision": "allow",
                        "systemMessage": f"[task-with-files] Previous task '{task_name}' completed! Current reset.",
                    }
                ),
                flush=True,
            )
        else:
            task_name = task_path.name.replace("task_", "").replace("_", " ")

            print(
                json.dumps(
                    {
                        "decision": "allow",
                        "systemMessage": f"[task-with-files] Found incomplete task: '{task_name}'\n\nTo continue, run: /task:resume\nOr start a new task with: /task:start [task-name]",
                    }
                ),
                flush=True,
            )

    except (json.JSONDecodeError, IOError):
        print(json.dumps({"decision": "allow"}), flush=True)


if __name__ == "__main__":
    main()
