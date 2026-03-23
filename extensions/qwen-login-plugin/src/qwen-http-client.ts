/**
 * Qwen OAuth HTTP 客户端 - 自动处理 token 刷新和重试
 */

import { OAuthCredentials, TokenRefreshResponse, getOAuthCredsPath, isTokenValid, refreshOAuthToken } from "./qwen-oauth.js"
import { writeFile, mkdir } from "node:fs/promises"
import { join, dirname } from "node:path"

/**
 * HTTP 请求选项
 */
export interface HttpRequestOptions extends RequestInit {
  /**
   * 最大重试次数（默认 1）
   */
  maxRetries?: number
}

/**
 * HTTP 响应
 */
export interface HttpResponse<T = any> {
  ok: boolean
  status: number
  statusText: string
  data?: T
  headers: Headers
}

/**
 * Qwen OAuth HTTP 客户端类
 * 
 * 自动处理：
 * - Token 有效性检查
 * - Token 刷新
 * - 401 错误重试
 */
export class QwenHttpClient {
  private creds: OAuthCredentials | null = null
  private refreshPromise: Promise<OAuthCredentials | null> | null = null

  /**
   * 获取当前凭证
   */
  async getCredentials(): Promise<OAuthCredentials | null> {
    if (!this.creds || !isTokenValid(this.creds)) {
      // 尝试刷新
      this.creds = await this.refreshTokenInternal()
    }
    return this.creds
  }

  /**
   * 设置凭证（外部加载）
   */
  setCredentials(creds: OAuthCredentials | null) {
    this.creds = creds
  }

  /**
   * 刷新 token（带锁，防止并发刷新）
   */
  private async refreshTokenInternal(): Promise<OAuthCredentials | null> {
    // 如果已有刷新请求，等待它完成
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      const credsPath = getOAuthCredsPath()
      
      // 重新读取最新凭证（可能已被其他进程刷新）
      try {
        const { readFile } = await import("node:fs/promises")
        const content = await readFile(credsPath, "utf-8")
        const freshCreds = JSON.parse(content) as OAuthCredentials
        
        if (isTokenValid(freshCreds)) {
          this.creds = freshCreds
          return freshCreds
        }
      } catch {
        // 文件读取失败，继续刷新流程
      }

      // 使用 refresh_token 刷新
      if (!this.creds?.refresh_token) {
        console.error("No refresh token available")
        this.creds = null
        return null
      }

      console.log("Refreshing OAuth token...")
      const refreshedCreds = await refreshOAuthToken(this.creds.refresh_token)

      if (refreshedCreds) {
        // 保存新凭证
        try {
          await mkdir(dirname(credsPath), { recursive: true })
          await writeFile(credsPath, JSON.stringify(refreshedCreds, null, 2), "utf-8")
          console.log("OAuth token refreshed successfully")
          this.creds = refreshedCreds
        } catch (error) {
          console.error("Failed to save refreshed credentials:", error)
          // 即使保存失败也返回新凭证
          this.creds = refreshedCreds
        }
      } else {
        console.error("Failed to refresh OAuth token")
        this.creds = null
      }

      return this.creds
    })()

    try {
      return await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * 发送 HTTP 请求（自动处理 token 刷新和重试）
   * 
   * @param url 请求 URL
   * @param options 请求选项
   * @returns HTTP 响应
   */
  async request<T = any>(
    url: string,
    options: HttpRequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const maxRetries = options.maxRetries ?? 1
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // 获取有效凭证
        const creds = await this.getCredentials()
        if (!creds) {
          return {
            ok: false,
            status: 401,
            statusText: "Unauthorized - No valid credentials",
            data: undefined,
            headers: new Headers()
          }
        }

        // 构建请求头
        const headers = new Headers(options.headers)
        headers.set("authorization", `Bearer ${creds.access_token}`)
        headers.set("content-type", "application/json")
        headers.set("accept", "application/json")

        // 发送请求
        const response = await fetch(url, {
          ...options,
          headers
        })

        // 处理响应
        if (response.status === 401 && attempt < maxRetries) {
          // Token 失效，尝试刷新后重试
          console.log(`Request failed with 401, refreshing token (attempt ${attempt + 1}/${maxRetries + 1})`)
          await this.refreshTokenInternal()
          continue
        }

        // 解析响应数据
        let data: T | undefined
        const contentType = response.headers.get("content-type")
        if (contentType?.includes("application/json")) {
          data = await response.json() as T
        }

        return {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          data,
          headers: response.headers
        }
      } catch (error) {
        lastError = error as Error
        
        // 网络错误，尝试刷新后重试
        if (attempt < maxRetries) {
          console.log(`Request failed, refreshing token and retrying (attempt ${attempt + 1}/${maxRetries + 1})`)
          await this.refreshTokenInternal()
          continue
        }
      }
    }

    // 所有重试失败
    return {
      ok: false,
      status: lastError ? 500 : 401,
      statusText: lastError?.message || "Request failed after retries",
      data: undefined,
      headers: new Headers()
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: "GET" })
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    url: string,
    body?: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined
    })
  }
}

/**
 * 创建单例 HTTP 客户端实例
 */
export const qwenHttpClient = new QwenHttpClient()

/**
 * 初始化 HTTP 客户端（从文件加载凭证）
 */
export async function initQwenHttpClient(): Promise<void> {
  const { readOAuthCredentials } = await import("./qwen-oauth.js")
  const creds = await readOAuthCredentials()
  qwenHttpClient.setCredentials(creds)
}
