#!/usr/bin/env python3
"""AfterTool Hook - write_file 专用"""
import json
import sys
print(json.dumps({"decision": "allow"}))
sys.exit(0)
