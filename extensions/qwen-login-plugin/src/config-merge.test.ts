/**
 * 配置合并测试 - 集成测试
 * 
 * 测试 saveToOpencodeConfig 函数的合并行为
 */

import { describe, it, beforeEach, afterEach } from 'node:test'
import { writeFile, mkdir, rm, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import assert from 'node:assert'
import { saveToOpencodeConfig, type QwenApiConfig } from './qwen-oauth.js'

describe('saveToOpencodeConfig - 配置合并', () => {
  let testConfigDir: string
  let testConfigPath: string
  let originalHOME: string

  beforeEach(async () => {
    originalHOME = process.env.HOME
    testConfigDir = await mkdtemp('opencode-config-test-')
    testConfigPath = join(testConfigDir, '.config', 'opencode')
    await mkdir(testConfigPath, { recursive: true })
    process.env.HOME = testConfigDir
  })

  afterEach(async () => {
    process.env.HOME = originalHOME
    await rm(testConfigDir, { recursive: true, force: true }).catch(() => {})
  })

  it('应该保留现有的 plugin 数组', async () => {
    // 创建初始配置
    const initialConfig = {
      plugin: ['oh-my-opencode', 'another-plugin'],
      agent: {
        build: {
          max_steps: 10
        }
      }
    }
    
    const configPath = join(testConfigPath, 'opencode.json')
    await writeFile(configPath, JSON.stringify(initialConfig, null, 2))
    
    // 调用 saveToOpencodeConfig
    await saveToOpencodeConfig({
      apiKey: 'Bearer test-token',
      baseURL: 'https://portal.qwen.ai/v1',
      headers: {
        'user-agent': 'QwenCode/test'
      }
    } as QwenApiConfig)
    
    // 读取更新后的配置
    const updatedConfig = JSON.parse(await readFile(configPath, 'utf-8'))
    
    // 验证 plugin 数组被保留
    assert.ok(updatedConfig.plugin.includes('oh-my-opencode'), 'Should contain oh-my-opencode')
    assert.ok(updatedConfig.plugin.includes('another-plugin'), 'Should contain another-plugin')
    
    // 验证 agent 配置被保留
    assert.ok(updatedConfig.agent, 'Should have agent config')
    assert.ok(updatedConfig.agent.build, 'Should have build agent')
    assert.strictEqual(updatedConfig.agent.build.max_steps, 10)
    
    // 验证 qwen provider 被添加
    assert.ok(updatedConfig.provider, 'Should have provider config')
    assert.ok(updatedConfig.provider.qwen, 'Should have qwen provider')
  })

  it('应该保留现有的其他 provider', async () => {
    // 创建初始配置，包含其他 provider
    const initialConfig = {
      provider: {
        anthropic: {
          options: {
            apiKey: 'sk-ant-xxx'
          }
        },
        openai: {
          options: {
            apiKey: 'sk-openai-xxx'
          }
        }
      },
      model: 'anthropic/claude-sonnet-4-20250514'
    }
    
    const configPath = join(testConfigPath, 'opencode.json')
    await writeFile(configPath, JSON.stringify(initialConfig, null, 2))
    
    // 调用 saveToOpencodeConfig
    await saveToOpencodeConfig({
      apiKey: 'Bearer test-token',
      baseURL: 'https://portal.qwen.ai/v1',
      headers: {}
    } as QwenApiConfig)
    
    // 读取更新后的配置
    const updatedConfig = JSON.parse(await readFile(configPath, 'utf-8'))
    
    // 验证其他 provider 被保留
    assert.ok(updatedConfig.provider.anthropic, "should be defined")
    assert.strictEqual(updatedConfig.provider.anthropic.options.apiKey, 'sk-ant-xxx')
    
    assert.ok(updatedConfig.provider.openai, "should be defined")
    assert.strictEqual(updatedConfig.provider.openai.options.apiKey, 'sk-openai-xxx')
    
    // 验证 qwen provider 被添加
    assert.ok(updatedConfig.provider.qwen, "should be defined")
    assert.strictEqual(updatedConfig.provider.qwen.options.apiKey, 'Bearer test-token')
  })

  it('不应该覆盖现有的 model 配置', async () => {
    // 创建初始配置，包含自定义 model
    const initialConfig = {
      provider: {
        anthropic: {
          options: {
            apiKey: 'sk-ant-xxx'
          }
        }
      },
      model: 'anthropic/claude-sonnet-4-20250514'
    }
    
    const configPath = join(testConfigPath, 'opencode.json')
    await writeFile(configPath, JSON.stringify(initialConfig, null, 2))
    
    // 调用 saveToOpencodeConfig
    await saveToOpencodeConfig({
      apiKey: 'Bearer test-token',
      baseURL: 'https://portal.qwen.ai/v1',
      headers: {}
    } as QwenApiConfig)
    
    // 读取更新后的配置
    const updatedConfig = JSON.parse(await readFile(configPath, 'utf-8'))
    
    // 验证原有 model 被保留（不覆盖）
    assert.strictEqual(updatedConfig.model, 'anthropic/claude-sonnet-4-20250514')
  })

  it('不应该设置默认 model', async () => {
    // 创建初始配置，没有 model
    const initialConfig = {
      plugin: ['test-plugin']
    }

    const configPath = join(testConfigPath, 'opencode.json')
    await writeFile(configPath, JSON.stringify(initialConfig, null, 2))

    // 调用 saveToOpencodeConfig
    await saveToOpencodeConfig({
      apiKey: 'Bearer test-token',
      baseURL: 'https://portal.qwen.ai/v1',
      headers: {}
    } as QwenApiConfig)

    // 读取更新后的配置
    const updatedConfig = JSON.parse(await readFile(configPath, 'utf-8'))

    // 验证不设置默认 model（让用户自己配置）
    assert.strictEqual(updatedConfig.model, undefined, 'Should not set default model')

    // 验证 plugin 被保留
    assert.ok(updatedConfig.plugin.includes('test-plugin'), 'Should include test-plugin')
  })

  it('应该保留其他顶层配置', async () => {
    // 创建初始配置，包含各种配置
    const initialConfig = {
      $schema: 'https://opencode.ai/config.json',
      agent: {
        build: { max_steps: 10 },
        plan: { read_only: true }
      },
      mode: {
        default: 'build'
      },
      instructions: ['./instructions.md'],
      plugin: ['plugin-a', 'plugin-b'],
      provider: {
        anthropic: { options: { apiKey: 'sk-ant' } }
      }
    }
    
    const configPath = join(testConfigPath, 'opencode.json')
    await writeFile(configPath, JSON.stringify(initialConfig, null, 2))
    
    // 调用 saveToOpencodeConfig
    await saveToOpencodeConfig({
      apiKey: 'Bearer test-token',
      baseURL: 'https://portal.qwen.ai/v1',
      headers: {}
    } as QwenApiConfig)
    
    // 读取更新后的配置
    const updatedConfig = JSON.parse(await readFile(configPath, 'utf-8'))
    
    // 验证所有配置都被保留
    assert.strictEqual(updatedConfig.$schema, 'https://opencode.ai/config.json')
    assert.strictEqual(updatedConfig.agent.build.max_steps, 10)
    assert.strictEqual(updatedConfig.agent.plan.read_only, true)
    assert.strictEqual(updatedConfig.mode.default, 'build')
    assert.ok(updatedConfig.instructions.includes('./instructions.md'), "should include")
    assert.ok(updatedConfig.plugin.includes('plugin-a'), "should include")
    assert.ok(updatedConfig.plugin.includes('plugin-b'), "should include")
    assert.strictEqual(updatedConfig.provider.anthropic.options.apiKey, 'sk-ant')
    
    // 验证 qwen 被添加
    assert.ok(updatedConfig.provider.qwen, "should be defined")
  })
})

// 辅助函数
async function mkdtemp(template: string): Promise<string> {
  const fs = await import('node:fs/promises')
  const path = await import('node:path')
  const os = await import('node:os')
  
  const dir = path.join(os.tmpdir(), `${template}${Date.now()}-${Math.random().toString(36).slice(2)}`)
  await fs.mkdir(dir, { recursive: true })
  return dir
}
