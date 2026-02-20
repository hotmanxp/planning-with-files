#!/usr/bin/env python3
"""
SessionStart Hook

检查 current_task.json，如果有活动任务，打印 session ID
"""

import json
import os
import sys
from pathlib import Path

def main():
    # 从环境变量获取扩展路径
    extension_path = os.environ.get('EXTENSION_PATH', '')
    
    # 如果没有环境变量，使用默认路径
    if extension_path:
        working_dir_base = Path(extension_path) / '.agent_working_dir'
    else:
        working_dir_base = Path(os.getcwd()) / '.agent_working_dir'
    
    current_task_file = working_dir_base / 'current_task.json'
    
    # 读取 stdin 中的输入（Hook 输入）
    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError:
        input_data = {}
    
    # 检查 current_task.json 是否存在
    if not current_task_file.exists():
        # 没有活动任务，静默退出
        print(json.dumps({"decision": "allow"}))
        sys.exit(0)
    
    try:
        with open(current_task_file, 'r') as f:
            current_task_data = json.load(f)
        
        current_task = current_task_data.get('current')
        
        if not current_task:
            # 没有活动任务
            print(json.dumps({"decision": "allow"}))
            sys.exit(0)
        
        # 有活动任务，打印 session ID
        session_id = input_data.get('session_id', 'unknown')
        
        # 通过 stderr 输出日志
        print(f"[task-with-files] SessionStart: 活动任务：{current_task}", file=sys.stderr)
        print(f"[task-with-files] Session ID: {session_id}", file=sys.stderr)
        
        # 通过 stdout 输出 JSON
        print(json.dumps({
            "decision": "allow",
            "context": f"活动任务：{current_task}\nSession ID: {session_id}"
        }))
        
    except (json.JSONDecodeError, IOError) as e:
        # 错误情况，静默允许
        print(json.dumps({"decision": "allow"}))
        sys.exit(0)

if __name__ == '__main__':
    main()
