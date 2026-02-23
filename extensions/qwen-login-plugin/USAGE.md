# qwen-login-plugin 使用指南

## 快速开始

### 1. 安装依赖

在项目根目录执行：

```bash
cd /Users/ethan/code/planning-with-files/extensions/qwen-login-plugin
npm install
```

### 2. 构建项目

```bash
npm run build
```

构建完成后会在 `dist/` 目录生成编译后的 JavaScript 文件。

### 3. 在 opencode 中配置

#### 方法 1: 使用本地文件插件

在 `opencode.json` 中添加：

```json
{
  "provider": {
    "qwen": {
      "options": {
        "apiKey": "{env:DASHSCOPE_API_KEY}",
        "baseURL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  },
  "plugin": [
    "file:///Users/ethan/code/planning-with-files/extensions/qwen-login-plugin/dist/index.js"
  ],
  "model": "qwen/qwen-plus"
}
```

#### 方法 2: 发布为 NPM 包后使用

发布到 npm 后：

```bash
npm publish
```

然后在 opencode 配置中：

```json
{
  "provider": {
    "qwen": {
      "options": {
        "apiKey": "{env:DASHSCOPE_API_KEY}",
        "baseURL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  },
  "plugin": [
    "qwen-login-plugin@1.0.0"
  ],
  "model": "qwen/qwen-plus"
}
```

## 认证方式

插件支持三种认证方式，按优先级排列：

### 1. 环境变量 (最高优先级)

在终端或 `.env` 文件中设置：

```bash
export DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
export DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

或在 `.env` 文件中：

```
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

### 2. qwen-code 配置导入

如果你使用过 qwen-code，插件会自动从 `~/.qwen/settings.json` 导入配置。

### 3. 交互式配置

如果以上两种方式都未配置，启动 opencode 时会弹出交互式配置对话框：

1. 输入 API Key (必填)
2. 输入 Base URL (可选，默认为阿里云官方端点)

## 获取 API Key

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 登录/注册阿里云账号
3. 进入"API-KEY 管理"页面
4. 创建新的 API Key 或复制已有 API Key

## 支持的模型

| 模型 | 描述 | 适用场景 |
|------|------|----------|
| `qwen-turbo` | 快速推理，成本最低 | 简单任务，快速响应 |
| `qwen-plus` | 性能和成本平衡 | 日常开发，代码生成 |
| `qwen-max` | 最强推理能力 | 复杂问题，深度推理 |
| `qwen-max-longcontext` | 支持超长上下文 | 长文档分析，大文件处理 |

## 配置示例

### 基础配置

```json
{
  "provider": {
    "qwen": {
      "options": {
        "apiKey": "{env:DASHSCOPE_API_KEY}",
        "baseURL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  },
  "plugin": [
    "file:///path/to/qwen-login-plugin/dist/index.js"
  ],
  "model": "qwen/qwen-plus"
}
```

### 使用自定义 Base URL

```json
{
  "provider": {
    "qwen": {
      "options": {
        "apiKey": "sk-xxxxxxxxxxxxxxxx",
        "baseURL": "https://your-custom-endpoint.com/v1"
      }
    }
  },
  "plugin": [
    "file:///path/to/qwen-login-plugin/dist/index.js"
  ],
  "model": "qwen/qwen-plus"
}
```

### 配置多个模型

```json
{
  "provider": {
    "qwen": {
      "options": {
        "apiKey": "{env:DASHSCOPE_API_KEY}",
        "baseURL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      },
      "models": {
        "qwen-plus": {},
        "qwen-max": {},
        "qwen-turbo": {}
      }
    }
  },
  "plugin": [
    "file:///path/to/qwen-login-plugin/dist/index.js"
  ]
}
```

## 故障排查

### 1. API Key 无效

**错误信息**: `Invalid API key`

**解决方案**:
- 检查 API Key 是否正确复制（包含完整的 `sk-` 前缀）
- 确保 API Key 未过期
- 检查阿里云账号余额

### 2. Base URL 无法访问

**错误信息**: `Network error` 或 `Connection timeout`

**解决方案**:
- 检查网络连接
- 确认 Base URL 是否正确
- 检查防火墙设置

### 3. 插件未加载

**错误信息**: `Failed to load plugin`

**解决方案**:
- 检查插件路径是否正确
- 确保已运行 `npm run build`
- 查看 opencode 日志获取详细错误信息

### 4. 配置未生效

**解决方案**:
- 检查 `opencode.json` 格式是否正确
- 确保插件配置在 provider 之前
- 重启 opencode

## 开发模式

### 监听编译

```bash
npm run dev
```

这会在源代码修改时自动重新编译。

### 调试

在 opencode 启动日志中查找插件加载信息：

```
loading plugin: qwen-login-plugin
```

如果看到错误，检查：
1. TypeScript 编译是否成功
2. 插件导出是否正确
3. 依赖是否安装完整

## 清理认证信息

如需清除已保存的认证信息：

```bash
# macOS
rm ~/Library/Application\ Support/opencode/qwen-auth.json

# Linux
rm ~/.config/opencode/qwen-auth.json

# Windows
del %APPDATA%\opencode\qwen-auth.json
```

## 高级用法

### 自定义认证流程

可以通过扩展插件实现自定义认证逻辑：

```typescript
// src/custom-auth.ts
import { QwenLoginPlugin } from './index.js'

export const CustomQwenPlugin = async (input) => {
  const hooks = await QwenLoginPlugin(input)
  
  // 自定义逻辑
  hooks.auth.methods.push({
    type: "oauth",
    label: "企业 SSO",
    // ... 自定义 OAuth 配置
  })
  
  return hooks
}

export default CustomQwenPlugin
```

### 添加自定义 Hook

```typescript
// 添加自定义工具定义
hooks.tool = {
  "qwen-models": {
    description: "列出可用的 Qwen 模型",
    parameters: {},
    execute: async () => {
      // 调用 API 获取模型列表
    }
  }
}
```

## 相关资源

- [opencode 官方文档](https://opencode.ai/docs)
- [通义千问 API 文档](https://help.aliyun.com/zh/dashscope/)
- [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)

## 获取帮助

如有问题，请：
1. 查看本使用指南
2. 检查故障排查部分
3. 提交 Issue 到项目仓库
