/**
 * Qwen Login Plugin - 通义千问认证插件
 * 
 * 为 opencode 提供 Qwen 模型认证支持
 * 自动从 qwen-code OAuth 配置导入认证信息
 * 支持自动 token 刷新和 401 错误重试
 */

import { configureOpencodeFromQwenOAuth, getValidOAuthCredentials, getApiConfigFromOAuth } from "./qwen-oauth.js"
import { qwenHttpClient, initQwenHttpClient } from "./qwen-http-client.js"

/**
 * Token 刷新定时器 ID
 */
let refreshTimerId: NodeJS.Timeout | null = null

/**
 * 启动定时 token 刷新检查
 * 每 4 分钟检查一次，如果 token 即将过期（< 5 分钟）则自动刷新
 */
function startTokenRefreshTimer() {
  // 清除已有的定时器（如果有）
  if (refreshTimerId) {
    clearInterval(refreshTimerId)
  }
  
  // 每 4 分钟检查一次
  refreshTimerId = setInterval(async () => {
    try {
      const { getValidOAuthCredentials } = await import("./qwen-oauth.js")
      await getValidOAuthCredentials()
    } catch (error) {
      // 静默失败，等待下次检查
    }
  }, 4 * 60 * 1000) // 4 分钟
  
  // 确保定时器不会阻止进程退出
  if (refreshTimerId && typeof refreshTimerId.unref === 'function') {
    refreshTimerId.unref()
  }
}

/**
 * 停止定时 token 刷新检查
 */
function stopTokenRefreshTimer() {
  if (refreshTimerId) {
    clearInterval(refreshTimerId)
    refreshTimerId = null
  }
}

/**
 * Qwen 认证插件主函数
 */
async function plugin(pluginInput: any) {
  // 插件加载时立即初始化 HTTP 客户端并写入配置文件
  try {
    await initQwenHttpClient()
    await configureOpencodeFromQwenOAuth()
  } catch (error) {
    // 静默失败，使用其他认证方式
  }
  
  // 启动定时 token 刷新检查
  startTokenRefreshTimer()

  return {
    // 配置钩子 - 修改运行时配置
    config: async (config: any) => {
      try {
        // 1. 获取有效的 OAuth 凭证 (自动刷新过期 token)
        const creds = await getValidOAuthCredentials()
        
        if (!creds) {
          return
        }
        
        // 2. 生成 API 配置
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
                context: 1048576,
                output: 131072
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
    },
    
    // 提供 HTTP 客户端用于 API 调用（自动处理 token 刷新）
    clients: {
      qwen: qwenHttpClient
    }
  }
}

// 只导出默认函数
export default plugin
