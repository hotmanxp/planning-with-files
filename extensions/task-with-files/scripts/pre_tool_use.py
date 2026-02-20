#!/usr/bin/env python3
"""PreToolUse Hook - 简单版本"""
import json
import sys
print(json.dumps({"decision": "allow"}))
sys.exit(0)
