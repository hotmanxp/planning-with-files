/**
 * Qwen Login Plugin - 通义千问认证插件
 * 
 * 为 opencode 提供 Qwen 模型认证支持
 * 自动从 qwen-code OAuth 配置导入认证信息
 */

import { configureOpencodeFromQwenOAuth, readOAuthCredentials, isTokenValid, getApiConfigFromOAuth } from "./qwen-oauth.js"

/**
 * Qwen 认证插件主函数
 */
async function plugin(pluginInput: any) {
  // 插件加载时立即写入配置文件
  try {
    await configureOpencodeFromQwenOAuth()
  } catch (error) {
    // 静默失败，使用其他认证方式
  }

  return {
    // 配置钩子 - 修改运行时配置
    config: async (config: any) => {
      try {
        // 1. 读取 OAuth 凭证
        const creds = await readOAuthCredentials()
        
        if (!creds) {
          return
        }
        
        // 2. 检查 token 是否有效
        if (!isTokenValid(creds)) {
          return
        }
        
        // 3. 生成 API 配置
        const apiConfig = getApiConfigFromOAuth(creds)
        
        // 4. 按照 opencode provider schema 配置
        if (!config.provider) {
          config.provider = {}
        }
        
        config.provider.qwen = {
          name: "Qwen (通义千问)",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: {
            "coder-model": {
              name: "Qwen Coder Model",
              tool_call: true,
              reasoning: false,
              attachment: true,
              temperature: true,
              interleaved: true,
              limit: {
                context: 256000,
                output: 8192
              }
            },
            "qwen-plus": {
              name: "Qwen Plus",
              tool_call: true,
              reasoning: false,
              attachment: true,
              temperature: true,
              interleaved: true,
              limit: {
                context: 131072,
                output: 8192
              }
            }
          },
          options: {
            apiKey: apiConfig.apiKey,
            baseURL: apiConfig.baseURL,
            headers: apiConfig.headers
          }
        }
        
      } catch (error) {
        // 静默失败
      }
    }
  }
}

// 只导出默认函数
export default plugin
