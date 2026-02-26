/**
 * Qwen-code OAuth 认证配置工具
 * 
 * 从 ~/.qwen/oauth_creds.json 读取 OAuth token
 * 用于配置 opencode 使用 Qwen API
 */

import { readFile, writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { homedir } from "node:os"

/**
 * OAuth 凭证接口
 */
export interface OAuthCredentials {
  access_token: string
  token_type: string
  refresh_token: string
  resource_url: string
  expiry_date: number
}

/**
 * Qwen API 配置接口
 */
export interface QwenApiConfig {
  apiKey: string
  baseURL: string
  headers?: Record<string, string>
}

/**
 * 默认 Qwen API 基础 URL（阿里云 DashScope）
 */
export const DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"

/**
 * Qwen Code 版本信息
 */
export const QWEN_CODE_VERSION = "unknown"

/**
 * 获取当前平台信息
 */
export function getPlatformInfo() {
  return {
    platform: process.platform === 'darwin' ? 'darwin' : process.platform,
    arch: process.arch === 'arm64' ? 'arm64' : process.arch,
    nodeVersion: process.version.replace('v', '')
  }
}

/**
 * 构建默认的 Qwen Code User-Agent
 * 
 * 格式：QwenCode/<version> (<platform>; <arch>)
 * 示例：QwenCode/unknown (darwin; arm64)
 */
export function buildUserAgent(): string {
  const platformInfo = getPlatformInfo()
  return `QwenCode/${QWEN_CODE_VERSION} (${platformInfo.platform}; ${platformInfo.arch})`
}

/**
 * 构建 Qwen API 的默认请求头
 * 
 * @param token OAuth token
 * @returns 请求头对象
 */
export function buildDefaultHeaders(token: string): Record<string, string> {
  const userAgent = buildUserAgent()
  const platformInfo = getPlatformInfo()
  
  return {
    'accept': 'application/json',
    'content-type': 'application/json',
    'user-agent': userAgent,
    'x-stainless-lang': 'js',
    'x-stainless-package-version': '4.104.0',
    'x-stainless-os': 'MacOS',
    'x-stainless-arch': platformInfo.arch,
    'x-stainless-runtime': 'node',
    'x-stainless-runtime-version': platformInfo.nodeVersion,
    'authorization': `Bearer ${token}`,
    'x-dashscope-cachecontrol': 'enable',
    'x-dashscope-useragent': userAgent,
    'x-dashscope-authtype': 'qwen-oauth',
    'x-stainless-retry-count': '0',
    'x-stainless-timeout': '120'
  }
}

/**
 * 从 resource_url 构建最终的 API endpoint
 * 
 * @param resourceUrl resource_url from OAuth credentials (e.g., "portal.qwen.ai")
 * @returns 完整的 API endpoint URL
 */
export function buildBaseUrl(resourceUrl: string): string {
  // 从 resource_url 构建 endpoint
  // resource_url: "portal.qwen.ai" -> "https://portal.qwen.ai/v1"
  if (resourceUrl) {
    return `https://${resourceUrl}/v1`
  }
  return DEFAULT_BASE_URL
}

/**
 * 获取 qwen-code OAuth 凭证文件路径
 */
function getOAuthCredsPath(): string {
  return join(homedir(), ".qwen", "oauth_creds.json")
}

/**
 * 读取 OAuth 凭证
 * 
 * @returns OAuth 凭证，如果文件不存在或读取失败则返回 null
 */
export async function readOAuthCredentials(): Promise<OAuthCredentials | null> {
  try {
    const credsPath = getOAuthCredsPath()
    const content = await readFile(credsPath, "utf-8")
    return JSON.parse(content) as OAuthCredentials
  } catch (error) {
    // 文件不存在或读取失败
    return null
  }
}

/**
 * 检查 OAuth token 是否过期
 * 
 * @param creds OAuth 凭证
 * @returns boolean - 是否有效（未过期）
 */
export function isTokenValid(creds: OAuthCredentials): boolean {
  const now = Date.now()
  return creds.expiry_date > now
}

/**
 * 从 OAuth 凭证获取 API 配置
 * 
 * @param creds OAuth 凭证
 * @returns API 配置（apiKey、baseURL 和 headers）
 */
export function getApiConfigFromOAuth(creds: OAuthCredentials): QwenApiConfig {
  const baseURL = buildBaseUrl(creds.resource_url)
  const headers = buildDefaultHeaders(creds.access_token)
  
  return {
    apiKey: `${creds.token_type} ${creds.access_token}`,
    baseURL: baseURL,
    headers: headers
  }
}

/**
 * 获取 Qwen API 配置（从 OAuth）
 * 
 * @returns API 配置，如果 OAuth 凭证无效则返回 null
 */
export async function getQwenConfigFromOAuth(): Promise<QwenApiConfig | null> {
  const creds = await readOAuthCredentials()
  
  if (!creds) {
    return null
  }
  
  if (!isTokenValid(creds)) {
    return null
  }
  
  return getApiConfigFromOAuth(creds)
}

/**
 * 保存配置到 opencode.json
 * 
 * @param config API 配置
 */
export async function saveToOpencodeConfig(config: QwenApiConfig): Promise<void> {
  // 优先使用 ~/.config/opencode/opencode.json (XDG 标准路径)
  let opencodeConfigPath = join(homedir(), ".config", "opencode", "opencode.json")
  
  // 如果 XDG 路径不存在，使用 macOS 标准路径
  try {
    await readFile(opencodeConfigPath, "utf-8")
  } catch {
    // XDG 路径不存在，使用 macOS 路径
    opencodeConfigPath = join(homedir(), "Library", "Application Support", "opencode", "opencode.json")
  }
  
  await saveConfigToFile(opencodeConfigPath, config, "opencode")
}

/**
 * 保存配置到 .gemini/settings.json
 * 
 * @param config API 配置
 */
export async function saveToGeminiSettings(config: QwenApiConfig): Promise<void> {
  const geminiSettingsPath = join(homedir(), ".gemini", "settings.json")
  await saveConfigToFile(geminiSettingsPath, config, "gemini")
}

/**
 * 通用函数：保存配置到文件
 * 
 * @param configPath 配置文件路径
 * @param config API 配置
 * @param targetType 目标类型 ("opencode" | "gemini")
 */
async function saveConfigToFile(
  configPath: string,
  config: QwenApiConfig,
  targetType: "opencode" | "gemini"
): Promise<void> {
  try {
    // 确保目录存在
    await mkdir(join(configPath, ".."), { recursive: true })
    
    // 读取现有配置
    let existingConfig: any = {}
    try {
      const content = await readFile(configPath, "utf-8")
      existingConfig = JSON.parse(content)
    } catch {
      // 配置文件不存在，创建新的
    }
    
    // 更新配置
    if (!existingConfig.provider) {
      existingConfig.provider = {}
    }
    
    existingConfig.provider.qwen = {
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
        // Gemini 只需要 token，不需要 "Bearer " 前缀
        apiKey: targetType === "gemini" ? config.apiKey.replace("Bearer ", "") : config.apiKey,
        baseURL: config.baseURL,
        // 保存自定义请求头
        ...(config.headers ? { headers: config.headers } : {})
      }
    }
    
    // 不设置默认 model，让用户自己在配置文件中配置
    // 用户可以选择：qwen/coder-model, qwen/qwen-plus 等
    
    // 保存配置
    await writeFile(configPath, JSON.stringify(existingConfig, null, 2), "utf-8")
  } catch (error) {
    throw error
  }
}

/**
 * 主函数：从 qwen-code OAuth 配置 opencode 和 .gemini/settings.json
 * 
 * @returns 是否成功配置
 */
export async function configureOpencodeFromQwenOAuth(): Promise<boolean> {
  try {
    // 1. 读取 OAuth 凭证
    const creds = await readOAuthCredentials()
    
    if (!creds) {
      return false
    }
    
    // 2. 检查 token 是否有效
    if (!isTokenValid(creds)) {
      return false
    }
    
    // 3. 获取 API 配置（包含 headers）
    const apiConfig = getApiConfigFromOAuth(creds)
    
    // 4. 保存到 opencode 配置
    await saveToOpencodeConfig(apiConfig)
    
    // 5. 保存到 .gemini/settings.json
    await saveToGeminiSettings(apiConfig)
    
    return true
  } catch (error) {
    return false
  }
}
