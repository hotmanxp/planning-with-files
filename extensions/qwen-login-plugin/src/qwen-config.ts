/**
 * Qwen-code 配置读取工具
 * 
 * 从 ~/.qwen/ 目录读取 qwen-code 的配置文件
 */

import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { homedir } from "node:os"

/**
 * Qwen-code 配置文件接口
 */
export interface QwenConfig {
  security?: {
    auth?: {
      apiKey?: string
    }
  }
  modelProviders?: {
    openai?: Array<{
      id?: string
      baseUrl?: string
      envKey?: string
    }>
  }
  model?: {
    name?: string
  }
}

/**
 * 认证信息接口
 */
export interface AuthConfig {
  apiKey?: string
  baseURL?: string
}

/**
 * 从 qwen-code 导入配置
 * 
 * @returns 认证信息，如果配置不存在或读取失败则返回 null
 */
export async function readQwenConfig(): Promise<AuthConfig | null> {
  try {
    const configPath = join(homedir(), ".qwen", "settings.json")
    const content = await readFile(configPath, "utf-8")
    const config = JSON.parse(content) as QwenConfig

    // 提取 API Key
    const apiKey = config.security?.auth?.apiKey

    // 提取 Base URL
    let baseURL: string | undefined
    if (config.modelProviders?.openai && config.modelProviders.openai.length > 0) {
      baseURL = config.modelProviders.openai[0].baseUrl
    }

    // 如果没有配置，返回 null
    if (!apiKey && !baseURL) {
      return null
    }

    return {
      apiKey,
      baseURL
    }
  } catch (error) {
    // 配置文件不存在或读取失败
    // 可能是用户没有使用过 qwen-code，这是正常情况
    return null
  }
}

/**
 * 检查是否存在 qwen-code 配置
 * 
 * @returns boolean - 是否存在配置
 */
export async function hasQwenConfig(): Promise<boolean> {
  const config = await readQwenConfig()
  return config !== null && (config.apiKey !== undefined || config.baseURL !== undefined)
}
