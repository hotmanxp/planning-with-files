/**
 * 认证管理工具
 * 
 * 使用 opencode 的 auth 系统存储和管理敏感认证信息
 */

import { readFile, writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { homedir } from "node:os"

/**
 * 认证信息接口
 */
export interface AuthInfo {
  apiKey: string
  baseURL: string
  provider: string
}

/**
 * 获取 opencode 配置目录
 */
function getOpencodeConfigDir(): string {
  switch (process.platform) {
    case "darwin":
      return join(homedir(), "Library", "Application Support", "opencode")
    case "win32":
      return join(process.env.APPDATA || "", "opencode")
    default:
      return join(homedir(), ".config", "opencode")
  }
}

/**
 * 获取认证信息存储文件路径
 */
function getAuthFilePath(): string {
  return join(getOpencodeConfigDir(), "qwen-auth.json")
}

/**
 * 保存认证信息
 * 
 * @param auth - 认证信息
 */
export async function saveAuth(auth: AuthInfo): Promise<void> {
  try {
    const configDir = getOpencodeConfigDir()
    const authFile = getAuthFilePath()

    // 确保目录存在
    await mkdir(configDir, { recursive: true })

    // 保存认证信息
    await writeFile(authFile, JSON.stringify(auth, null, 2), "utf-8")
  } catch (error) {
    console.error("Failed to save Qwen auth:", error)
    throw error
  }
}

/**
 * 获取认证信息
 * 
 * @param key - 认证信息键 (apiKey | baseURL)
 * @returns 认证信息值，如果不存在则返回 undefined
 */
export async function getAuth(key: "apiKey" | "baseURL"): Promise<string | undefined> {
  try {
    const authFile = getAuthFilePath()
    const content = await readFile(authFile, "utf-8")
    const auth = JSON.parse(content) as AuthInfo
    return auth[key]
  } catch (error) {
    // 文件不存在或读取失败，返回 undefined
    return undefined
  }
}

/**
 * 验证 API Key
 * 
 * 通过简单的格式检查和可选的 API 调用来验证 API Key 的有效性
 * 
 * @param apiKey - API Key
 * @param baseURL - Base URL
 * @returns boolean - 是否有效
 */
export async function validateApiKey(
  apiKey: string,
  baseURL: string
): Promise<boolean> {
  // 基本格式验证
  if (!apiKey || !apiKey.startsWith("sk-")) {
    return false
  }

  // 可选：通过 API 调用验证
  try {
    const response = await fetch(`${baseURL}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    })

    // 200 表示 API Key 有效
    return response.ok
  } catch (error) {
    // 网络错误或其他问题，不进行严格验证
    // 允许用户继续配置，真正的验证会在实际调用时进行
    console.warn("API Key validation request failed, skipping validation:", error)
    return true
  }
}

/**
 * 清除认证信息
 */
export async function clearAuth(): Promise<void> {
  try {
    const { rm } = await import("node:fs/promises")
    const authFile = getAuthFilePath()
    await rm(authFile, { force: true })
  } catch (error) {
    console.error("Failed to clear Qwen auth:", error)
    throw error
  }
}
