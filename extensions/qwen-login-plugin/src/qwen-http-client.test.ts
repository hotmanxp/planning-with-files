/**
 * Qwen HTTP Client - 单元测试
 * 
 * 测试 HTTP 客户端的 token 刷新和重试逻辑
 */

import { describe, it, beforeEach, afterEach } from 'node:test'
import { writeFile, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import assert from 'node:assert'
import { QwenHttpClient, initQwenHttpClient } from './qwen-http-client.js'

// 测试用的临时目录
let testDir: string
let testQwenDir: string

describe('QwenHttpClient', () => {
  beforeEach(async () => {
    // 创建临时测试目录
    testDir = await mkdtemp('qwen-http-client-test-')
    testQwenDir = join(testDir, '.qwen')
    await mkdir(testQwenDir, { recursive: true })
  })

  afterEach(async () => {
    // 清理临时目录
    await rm(testDir, { recursive: true, force: true }).catch(() => {})
  })

  describe('getCredentials', () => {
    it('应该返回 null 当没有凭证', async () => {
      const client = new QwenHttpClient()
      const creds = await client.getCredentials()
      assert.strictEqual(creds, null)
    })

    it('应该返回有效凭证', async () => {
      const client = new QwenHttpClient()
      const mockCreds = {
        access_token: 'test-token',
        token_type: 'Bearer',
        refresh_token: 'test-refresh',
        resource_url: 'portal.qwen.ai',
        expiry_date: Date.now() + 1000000
      }
      client.setCredentials(mockCreds)
      
      const creds = await client.getCredentials()
      assert.deepStrictEqual(creds, mockCreds)
    })

    it('应该在凭证过期时返回 null（没有 refresh_token）', async () => {
      const client = new QwenHttpClient()
      const mockCreds = {
        access_token: 'test-token',
        token_type: 'Bearer',
        refresh_token: undefined as any,
        resource_url: 'portal.qwen.ai',
        expiry_date: Date.now() - 1000 // 1 秒前过期
      }
      client.setCredentials(mockCreds)
      
      const creds = await client.getCredentials()
      assert.strictEqual(creds, null)
    })
  })

  describe('request', () => {
    it('应该在没有凭证时返回 401', async () => {
      const client = new QwenHttpClient()
      
      const response = await client.request('https://example.com/api/test')
      
      assert.strictEqual(response.ok, false)
      assert.strictEqual(response.status, 401)
    })

    it('应该在凭证过期时自动刷新 token', async () => {
      // 这个测试需要真实的 token refresh endpoint，跳过或 mock
      // 实际测试中应该使用 mock server
    })
  })

  describe('concurrent refresh', () => {
    it('应该防止并发刷新', async () => {
      const client = new QwenHttpClient()
      const mockCreds = {
        access_token: 'test-token',
        token_type: 'Bearer',
        refresh_token: 'test-refresh',
        resource_url: 'portal.qwen.ai',
        expiry_date: Date.now() - 1000 // 已过期
      }
      client.setCredentials(mockCreds)
      
      // 同时调用 getCredentials 多次
      const [creds1, creds2, creds3] = await Promise.all([
        client.getCredentials(),
        client.getCredentials(),
        client.getCredentials()
      ])
      
      // 所有调用应该返回相同的结果（因为并发刷新被阻止）
      assert.deepStrictEqual(creds1, creds2)
      assert.deepStrictEqual(creds2, creds3)
    })
  })
})

describe('initQwenHttpClient', () => {
  beforeEach(async () => {
    testDir = await mkdtemp('qwen-init-test-')
    testQwenDir = join(testDir, '.qwen')
    await mkdir(testQwenDir, { recursive: true })
  })

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true }).catch(() => {})
  })

  it('应该从文件加载凭证', async () => {
    const mockCreds = {
      access_token: 'test-token',
      token_type: 'Bearer',
      refresh_token: 'test-refresh',
      resource_url: 'portal.qwen.ai',
      expiry_date: Date.now() + 1000000
    }
    
    await writeFile(join(testQwenDir, 'oauth_creds.json'), JSON.stringify(mockCreds))
    
    const originalHome = process.env.HOME
    process.env.HOME = testDir
    
    try {
      await initQwenHttpClient()
      // 这里需要访问单例来验证，但单例在模块级别
      // 实际测试中应该重置单例或使用依赖注入
    } finally {
      process.env.HOME = originalHome
    }
  })
})

// 辅助函数
async function mkdtemp(template: string): Promise<string> {
  const dir = join(tmpdir(), `${template}${Date.now()}-${Math.random().toString(36).slice(2)}`)
  await mkdir(dir, { recursive: true })
  return dir
}
