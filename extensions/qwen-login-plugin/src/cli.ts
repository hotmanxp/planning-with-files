#!/usr/bin/env node

/**
 * Qwen Login Plugin - CLI 工具
 * 
 * 从 qwen-code OAuth 配置 opencode 和 .gemini/settings.json
 * 
 * 使用方法:
 *   node dist/cli.js
 */

import { configureOpencodeFromQwenOAuth } from "./qwen-oauth.js"

console.log("🔐 Qwen Login Plugin - 配置工具\n")
console.log("正在从 qwen-code 导入认证信息...\n")

configureOpencodeFromQwenOAuth()
  .then((success) => {
    if (success) {
      console.log("✅ 配置成功！")
      console.log("\n已写入以下配置文件:")
      console.log("  - opencode.json")
      console.log("  - .gemini/settings.json")
      console.log("\n现在可以在 opencode 和 Gemini CLI 中使用 Qwen 模型:")
      console.log("  opencode --model qwen/qwen-plus")
    } else {
      console.log("❌ 配置失败，请检查是否已使用 qwen-code 认证")
    }
  })
  .catch((error) => {
    console.error("❌ 发生错误:", error.message)
    process.exit(1)
  })
