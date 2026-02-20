#!/usr/bin/env python3
"""PostToolUse Hook"""
import json
import os
import sys

def main():
    extension_path = os.environ.get('EXTENSION_PATH', '')
    # 读取 stdin
    try:
        input_data = json.load(sys.stdin)
    except:
        input_data = {}
    
    # 静默允许
    print(json.dumps({"decision": "allow"}))
    sys.exit(0)

if __name__ == '__main__':
    main()
