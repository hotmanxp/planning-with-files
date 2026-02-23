#!/usr/bin/env node

/**
 * Qwen Login Plugin - CLI 工具
 * 
 * 从 qwen-code OAuth 配置 opencode
 * 
 * 使用方法:
 *   node dist/cli.js
 */

import { configureOpencodeFromQwenOAuth } from "./qwen-oauth.js"

configureOpencodeFromQwenOAuth()
  .then((success) => {
    if (success) {
      console.log("✅ 配置成功！现在可以在 opencode 中使用 Qwen 模型")
    } else {
      console.log("❌ 配置失败，请检查是否已使用 qwen-code 认证")
    }
  })
  .catch((error) => {
    console.error("❌ 发生错误:", error.message)
    process.exit(1)
  })
