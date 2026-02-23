# Qwen Login Plugin

通义千问认证插件 - **自动从 qwen-code OAuth 配置 opencode**

## ✨ 功能特性

- 🔐 **自动导入 OAuth 配置**
  - 自动读取 `~/.qwen/oauth_creds.json`
  - 使用 `resource_url` 构建正确的 endpoint (`https://portal.qwen.ai/v1`)
  - 自动配置完整的请求头（User-Agent、x-dashscope-* 等）
  - 将 qwen-code 的 OAuth token 配置到 opencode
  - 无需手动输入 API Key

- ⚙️ **一键配置**
  - CLI 工具一键完成配置
  - 插件加载时自动配置
  - 支持手动认证作为备选

- 🔒 **安全可靠**
  - 使用 qwen-code 的 OAuth token
  - Token 过期检测
  - 敏感信息不硬编码

- 📝 **完整的请求头**
  - `User-Agent`: QwenCode/unknown (darwin; arm64)
  - `x-dashscope-authtype`: qwen-oauth
  - `x-stainless-*`: Stainless SDK 标识
  - `authorization`: Bearer token

## 📦 安装

```bash
cd /Users/ethan/code/planning-with-files/extensions/qwen-login-plugin
npm install
npm run build
```

## 🚀 使用方法

### 方法 1: CLI 工具（推荐）

```bash
# 运行配置工具
npm start

# 或直接使用
node dist/cli.js
```

输出示例:
```
🔐 Qwen Login Plugin - 配置工具

正在从 qwen-code 导入认证信息...

Qwen API configuration saved to opencode.json
Successfully configured opencode with Qwen OAuth credentials

✅ 配置成功!

现在可以在 opencode 中使用 Qwen 模型:
  opencode --model qwen/qwen-plus
```

### 方法 2: 作为 opencode 插件

在 `opencode.json` 中添加:

```json
{
  "plugin": [
    "file:///Users/ethan/code/planning-with-files/extensions/qwen-login-plugin/dist/index.js"
  ]
}
```

插件加载时会自动从 qwen-code 导入配置。

### 方法 3: 直接使用配置

运行 CLI 后，配置已写入 `~/.config/opencode/opencode.json`:

```json
{
  "provider": {
    "qwen": {
      "options": {
        "apiKey": "Bearer <token>",
        "baseURL": "https://portal.qwen.ai/v1"
      }
    }
  },
  "model": "qwen/qwen-plus"
}
```

直接启动 opencode 即可使用:

```bash
opencode --model qwen/qwen-plus
```

## 📝 工作原理

### 1. 读取 qwen-code OAuth 凭证

从 `~/.qwen/oauth_creds.json` 读取:

```json
{
  "access_token": "Ti3s_MI-n-HJSGEgEmgDy2qFHwnwbwK-...",
  "token_type": "Bearer",
  "refresh_token": "6aLiqAwXh-c10x9EetHuD_3cbxyOzA2d...",
  "resource_url": "portal.qwen.ai",
  "expiry_date": 1771852368630
}
```

### 2. 生成 API 配置

根据 `resource_url` 构建正确的 endpoint，并生成完整的请求头:

```javascript
{
  "apiKey": "Bearer <access_token>",
  "baseURL": "https://portal.qwen.ai/v1",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json",
    "user-agent": "QwenCode/unknown (darwin; arm64)",
    "x-stainless-lang": "js",
    "x-stainless-package-version": "4.104.0",
    "x-stainless-os": "MacOS",
    "x-stainless-arch": "arm64",
    "x-stainless-runtime": "node",
    "x-stainless-runtime-version": "24.11.1",
    "authorization": "Bearer <token>",
    "x-dashscope-cachecontrol": "enable",
    "x-dashscope-useragent": "QwenCode/unknown (darwin; arm64)",
    "x-dashscope-authtype": "qwen-oauth",
    "x-stainless-retry-count": "0",
    "x-stainless-timeout": "120"
  }
}
```

### 3. 保存到 opencode 配置

写入 `~/Library/Application Support/opencode/opencode.json`

### 4. Token 过期检测

自动检查 `expiry_date`，过期则提示重新认证

## 🔧 开发模式

```bash
# 监听编译
npm run dev

# 清理构建文件
npm run clean

# 重新构建
npm run build
```

## 📁 项目结构

```
qwen-login-plugin/
├── src/
│   ├── index.ts          # 插件入口
│   ├── cli.ts            # CLI 工具
│   └── qwen-oauth.ts     # OAuth 配置工具
├── dist/                 # 构建输出
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## 🛠️ API

### 从代码中调用

```typescript
import { 
  configureOpencodeFromQwenOAuth,
  readOAuthCredentials,
  getQwenConfigFromOAuth,
  buildBaseUrl
} from 'qwen-login-plugin'

// 一键配置
const success = await configureOpencodeFromQwenOAuth()

// 或分步调用
const creds = await readOAuthCredentials()
const config = await getQwenConfigFromOAuth()

// 使用 resource_url 构建 endpoint
const endpoint = buildBaseUrl(creds.resource_url)
// => "https://portal.qwen.ai/v1"
```

### 可用函数

| 函数 | 说明 |
|------|------|
| `readOAuthCredentials()` | 读取 OAuth 凭证 |
| `isTokenValid(creds)` | 检查 token 是否过期 |
| `getApiConfigFromOAuth(creds)` | 从 OAuth 生成 API 配置 |
| `getQwenConfigFromOAuth()` | 获取 Qwen API 配置 |
| `saveToOpencodeConfig(config)` | 保存到 opencode.json |
| `configureOpencodeFromQwenOAuth()` | 一键配置 |
| `buildBaseUrl(resourceUrl)` | 从 resource_url 构建 endpoint |

## 📋 配置说明

### OAuth 凭证字段

| 字段 | 说明 | 示例 |
|------|------|------|
| `access_token` | OAuth access token | `Ti3s_MI-n-HJSGEgEmgDy2qFHwnwbwK-...` |
| `token_type` | Token 类型 | `Bearer` |
| `refresh_token` | 刷新 token | `6aLiqAwXh-c10x9EetHuD_3cbxyOzA2d...` |
| `resource_url` | API 资源地址 | `portal.qwen.ai` |
| `expiry_date` | 过期时间戳（毫秒） | `1771852368630` |

### 生成的 API 配置

| 字段 | 说明 | 值 |
|------|------|------|
| `provider.qwen` | Qwen provider 配置 | 包含 apiKey、baseURL、headers |
| `models` | 可用模型列表 | `coder-model`, `qwen-plus` 等 |

**注意**: 插件不会设置默认 model，需要在 `opencode.json` 中手动配置：

```json
{
  "model": "qwen/coder-model"
}
```

可用模型：
- `qwen/coder-model` - 编程专用模型
- `qwen/qwen-plus` - 平衡性能和成本

#### Headers 详情

| Header | 值 | 说明 |
|--------|-----|------|
| `user-agent` | `QwenCode/unknown (darwin; arm64)` | 客户端标识 |
| `x-dashscope-authtype` | `qwen-oauth` | 认证类型 |
| `x-dashscope-useragent` | `QwenCode/unknown (darwin; arm64)` | DashScope 客户端标识 |
| `x-dashscope-cachecontrol` | `enable` | 启用缓存控制 |
| `x-stainless-*` | various | Stainless SDK 标识 |
| `authorization` | `Bearer <token>` | OAuth token |

### 最终 API 调用

opencode 会使用以下 endpoint 和请求头调用 Qwen API:

```
POST https://portal.qwen.ai/v1/chat/completions
Headers:
  user-agent: QwenCode/unknown (darwin; arm64)
  x-dashscope-authtype: qwen-oauth
  x-dashscope-useragent: QwenCode/unknown (darwin; arm64)
  x-dashscope-cachecontrol: enable
  authorization: Bearer <access_token>
  x-stainless-lang: js
  x-stainless-package-version: 4.104.0
  x-stainless-os: MacOS
  x-stainless-arch: arm64
  x-stainless-runtime: node
  x-stainless-runtime-version: 24.11.1
  x-stainless-retry-count: 0
  x-stainless-timeout: 120
  accept: application/json
  content-type: application/json
```

## ⚠️ 故障排查

### 1. "No Qwen OAuth credentials found"

**原因**: `~/.qwen/oauth_creds.json` 文件不存在

**解决**: 先使用 qwen-code 进行认证:
```bash
qwen login
```

### 2. "Qwen OAuth token has expired"

**原因**: OAuth token 已过期

**解决**: 重新认证:
```bash
qwen login
```

### 3. 配置未生效

**检查**:
1. 确认 `~/Library/Application Support/opencode/opencode.json` 存在
2. 确认配置格式正确
3. 重启 opencode

### 4. API 调用失败

**检查**:
1. 确认 `baseURL` 是 `https://portal.qwen.ai/v1`
2. 确认 `apiKey` 格式为 `Bearer <token>`
3. 检查网络连接

## 📋 前置要求

- Node.js 20+
- 已安装并认证 qwen-code
- opencode 已安装

## 📄 许可证

MIT

## 🔗 相关链接

- [opencode 文档](https://opencode.ai/docs)
- [通义千问 API](https://help.aliyun.com/zh/dashscope/)
- [qwen-code](https://github.com/QwenLM/qwen-code)
- [Qwen Portal](https://portal.qwen.ai)
