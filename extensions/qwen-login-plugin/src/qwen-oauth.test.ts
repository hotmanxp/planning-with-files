/**
 * Qwen Login Plugin - 单元测试
 * 
 * 测试配置合并、OAuth 读取等功能
 */

import { describe, it, beforeEach, afterEach } from 'node:test'
import { writeFile, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import assert from 'node:assert'
import { readOAuthCredentials, isTokenValid, getApiConfigFromOAuth, buildBaseUrl, buildDefaultHeaders } from './qwen-oauth.js'

// 测试用的临时目录
let testDir: string
let testQwenDir: string

describe('Qwen Login Plugin', () => {
  beforeEach(async () => {
    // 创建临时测试目录
    testDir = await mkdtemp('qwen-login-plugin-test-')
    testQwenDir = join(testDir, '.qwen')
    await mkdir(testQwenDir, { recursive: true })
  })

  afterEach(async () => {
    // 清理临时目录
    await rm(testDir, { recursive: true, force: true }).catch(() => {})
  })

  describe('buildBaseUrl', () => {
    it('应该从 resource_url 构建正确的 endpoint', () => {
      assert.strictEqual(buildBaseUrl('portal.qwen.ai'), 'https://portal.qwen.ai/v1')
    })

    it('应该在没有 resource_url 时使用默认值', () => {
      assert.strictEqual(buildBaseUrl(''), 'https://dashscope.aliyuncs.com/compatible-mode/v1')
      assert.strictEqual(buildBaseUrl(undefined as any), 'https://dashscope.aliyuncs.com/compatible-mode/v1')
    })
  })

  describe('buildDefaultHeaders', () => {
    it('应该生成完整的请求头', () => {
      const headers = buildDefaultHeaders('test-token-123')
      
      assert.ok(headers.authorization, 'Should have authorization header')
      assert.strictEqual(headers.authorization, 'Bearer test-token-123')
      
      assert.ok(headers['user-agent'], 'Should have user-agent header')
      assert.match(headers['user-agent'], /QwenCode\/.*\(.*;.*\)/)
      
      assert.ok(headers['x-dashscope-authtype'], 'Should have x-dashscope-authtype header')
      assert.strictEqual(headers['x-dashscope-authtype'], 'qwen-oauth')
      
      assert.ok(headers['content-type'], 'Should have content-type header')
      assert.strictEqual(headers['content-type'], 'application/json')
      
      assert.ok(headers['accept'], 'Should have accept header')
      assert.strictEqual(headers['accept'], 'application/json')
    })

    it('应该包含所有 stainless 相关 headers', () => {
      const headers = buildDefaultHeaders('test-token')
      
      assert.strictEqual(headers['x-stainless-lang'], 'js')
      assert.strictEqual(headers['x-stainless-package-version'], '4.104.0')
      assert.strictEqual(headers['x-stainless-os'], 'MacOS')
      assert.strictEqual(headers['x-stainless-runtime'], 'node')
    })
  })

  describe('isTokenValid', () => {
    it('应该返回 true 当 token 未过期', () => {
      const futureDate = Date.now() + 1000 * 60 * 60 * 24 // 1 天后
      assert.strictEqual(isTokenValid({ expiry_date: futureDate } as any), true)
    })

    it('应该返回 false 当 token 已过期', () => {
      const pastDate = Date.now() - 1000 * 60 * 60 // 1 小时前
      assert.strictEqual(isTokenValid({ expiry_date: pastDate } as any), false)
    })
  })

  describe('readOAuthCredentials', () => {
    it('应该成功读取 OAuth 凭证', async () => {
      // 模拟 OAuth 凭证文件
      const mockCreds = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        refresh_token: 'test-refresh-token',
        resource_url: 'portal.qwen.ai',
        expiry_date: Date.now() + 1000000
      }
      
      await writeFile(join(testQwenDir, 'oauth_creds.json'), JSON.stringify(mockCreds))
      
      // 临时修改 home 目录
      const originalHome = process.env.HOME
      process.env.HOME = testDir
      
      try {
        const creds = await readOAuthCredentials()
        assert.deepStrictEqual(creds, mockCreds)
      } finally {
        process.env.HOME = originalHome
      }
    })

    it('应该在文件不存在时返回 null', async () => {
      const originalHome = process.env.HOME
      process.env.HOME = testDir
      
      try {
        const creds = await readOAuthCredentials()
        assert.strictEqual(creds, null)
      } finally {
        process.env.HOME = originalHome
      }
    })
  })

  describe('getApiConfigFromOAuth', () => {
    it('应该从 OAuth 凭证生成正确的 API 配置', () => {
      const mockCreds = {
        access_token: 'test-token',
        token_type: 'Bearer',
        refresh_token: 'test-refresh',
        resource_url: 'portal.qwen.ai',
        expiry_date: Date.now() + 1000000
      }
      
      const config = getApiConfigFromOAuth(mockCreds)
      
      assert.strictEqual(config.apiKey, 'Bearer test-token')
      assert.strictEqual(config.baseURL, 'https://portal.qwen.ai/v1')
      assert.ok(config.headers)
      assert.strictEqual(config.headers?.authorization, 'Bearer test-token')
    })
  })
})

// 辅助函数
async function mkdtemp(template: string): Promise<string> {
  const dir = join(tmpdir(), `${template}${Date.now()}-${Math.random().toString(36).slice(2)}`)
  await mkdir(dir, { recursive: true })
  return dir
}
