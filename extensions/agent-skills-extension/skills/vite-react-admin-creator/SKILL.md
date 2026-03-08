---
name: vite-react-admin-creator
description: 创建 Vite + React 管理后台项目。使用 Vite 7 + React 19 + TypeScript + Ant Design 6 + React Router + Zustand + (TailwindCSS + Less Modules)。当用户需要创建现代化管理后台、Dashboard 或 React 项目时使用此 skill。
---

# Vite React Admin Creator

专门用于创建基于最新技术栈的现代化管理后台项目。

## 技术栈规范

### 核心依赖

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **构建工具** | Vite | 7.x | 极速 HMR 和构建 |
| **框架** | React | 19.x | 最新版本 |
| **语言** | TypeScript | 5.x | 严格模式 |
| **UI 框架** | Ant Design | 6.x | 企业级组件库 |
| **路由** | React Router | 7.x | 嵌套路由 |
| **状态管理** | Zustand | 5.x | 轻量级 Store |
| **样式方案** | TailwindCSS + Less Modules | 4.x | Tailwind 为主，Less 为辅 |
| **图标** | @ant-design/icons | 6.x | Ant Design 图标库 |

### 样式规范

**核心原则：**
- **主要使用 TailwindCSS**：布局、间距、颜色、字体等基础样式
- **Less Modules 辅助**：复杂动画、自定义 keyframes、特殊伪元素效果
- **CSS 变量**：在 `global.less` 中定义全局主题变量

## 项目结构规范

```
project-name/
├── src/
│   ├── main.tsx              # 入口文件，配置 RouterProvider
│   ├── App.tsx               # 根布局组件（Header + Content + Footer）
│   ├── App.module.less       # 可选：组件级复杂样式
│   ├── index.css             # 导入 global.less
│   ├── router/
│   │   └── index.tsx         # 路由配置（createBrowserRouter）
│   ├── store/
│   │   └── authStore.ts      # Zustand 状态管理
│   ├── pages/
│   │   ├── Welcome/
│   │   │   ├── index.tsx     # 页面组件（< 200 行）
│   │   │   ├── Welcome.module.less  # 组件复杂样式
│   │   │   └── mockData.ts   # MOCK 数据
│   │   └── Dashboard/
│   │       ├── index.tsx
│   │       ├── Dashboard.module.less
│   │       └── mockData.ts
│   ├── components/           # 可复用组件
│   │   ├── PageHeader/
│   │   │   ├── index.tsx
│   │   │   └── PageHeader.module.less
│   │   └── DataCard/
│   │       ├── index.tsx
│   │       └── DataCard.module.less
│   ├── styles/
│   │   └── global.less       # 全局样式（Tailwind + CSS 变量）
│   └── assets/               # 静态资源
├── public/                   # 公共资源
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── eslint.config.js
```

## 代码规范要求

### 组件化要求

**文件大小限制：**
- 每个 `.tsx` 文件不超过 **200 行**
- 超过 200 行必须拆分为子组件
- 单个组件职责单一

**组件拆分原则：**
1. **功能独立**：独立的功能逻辑拆分为独立组件
2. **复用性**：可在多处使用的 UI 片段提取为组件
3. **数据展示**：复杂数据展示拆分为子组件
4. **页面结构**：页面只负责组合组件，不直接渲染复杂 UI

**示例：**
```
❌ 错误：Welcome.tsx (500 行)
  - 直接渲染所有卡片
  - 内联所有数据
  - 混合布局和逻辑

✅ 正确：
  - Welcome.tsx (80 行)：组合 FeatureCard 组件
  - FeatureCard.tsx (60 行)：单个卡片组件
  - mockData.ts：独立数据文件
```

### MOCK 数据规范

**数据文件位置：**
- 页面级数据：`src/pages/PageName/mockData.ts`
- 组件级数据：`src/components/ComponentName/mockData.ts`
- 全局通用数据：`src/data/common.ts`

**数据文件格式：**
```typescript
// mockData.ts
export interface DataType {
  id: string;
  name: string;
  value: number;
}

export const featureData: DataType[] = [
  { id: '1', name: '特性 1', value: 100 },
  { id: '2', name: '特性 2', value: 200 },
];

export const chartData = {
  labels: ['周一', '周二', '周三'],
  values: [120, 150, 180],
};
```

**数据使用：**
```typescript
import { featureData } from './mockData';

function FeatureList() {
  return (
    <div>
      {featureData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### 样式规范

**TailwindCSS 优先：**
```typescript
// ✅ 优先使用 TailwindCSS
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
  <span className="text-lg font-semibold text-gray-800">标题</span>
</div>

// ❌ 避免：简单样式也用 Less
<div className={styles.container}>
```

**Less Modules 辅助：**
```less
/* Welcome.module.less - 复杂动画和特殊效果 */
.hero {
  animation: fadeIn 0.6s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.featureCard {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}
```

**使用方式：**
```typescript
import styles from './Welcome.module.less';

function Welcome() {
  return (
    <div className={`${styles.hero} text-center p-16 bg-gradient-to-br`}>
      {/* TailwindCSS + Less Modules 组合使用 */}
    </div>
  );
}
```

## 创建流程

### 步骤 1：初始化项目

```bash
# 创建 Vite + React + TypeScript 项目
pnpm create vite project-name --template react-ts
cd project-name

# 安装基础依赖
pnpm install
```

### 步骤 2：安装核心依赖

```bash
# UI 和路由
pnpm add antd react-router-dom zustand @ant-design/icons

# 样式
pnpm add -D tailwindcss @tailwindcss/vite less @types/react-router-dom
```

### 步骤 3：配置 Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
```

### 步骤 4：创建全局样式

```less
/* src/styles/global.less */
@import 'tailwindcss';

:root {
  --primary-color: #1677ff;
  --text-color: #000000e0;
  --text-color-secondary: #000000a6;
  --bg-color: #ffffff;
  --header-bg: #001529;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #f5f5f5;
}

#root {
  min-height: 100vh;
}
```

```css
/* src/index.css */
@import './styles/global.less';
```

### 步骤 5：配置状态管理

```typescript
// src/store/authStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
```

### 步骤 6：配置路由

**使用 Hash 路由（推荐用于静态部署）：**

```typescript
// src/router/index.tsx
import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import App from '../App';
import Welcome from '../pages/Welcome';

// 使用 Hash 路由（适合静态部署，如 GitHub Pages、Nginx 等）
export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
    ],
  },
]);

// 或使用 Browser 路由（需要服务器配置支持）
// export const router = createBrowserRouter([...])
```

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

**路由配置说明：**
- **Hash 路由**（`createHashRouter`）：URL 带 `#` 符号（如 `http://localhost/#/about`），无需服务器配置，适合静态部署
- **Browser 路由**（`createBrowserRouter`）：URL 更简洁（如 `http://localhost/about`），需要服务器配置支持 History API

### 步骤 7：创建基础布局

```typescript
// src/App.tsx
import { Outlet } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { HomeOutlined, DashboardOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;

function App() {
  const menuItems: MenuProps['items'] = [
    { key: '1', icon: <HomeOutlined />, label: '首页' },
    { key: '2', icon: <DashboardOutlined />, label: '控制台' },
    { key: '3', icon: <SettingOutlined />, label: '系统设置' },
  ];

  const userMenuItems: MenuProps['items'] = [
    { key: '1', label: '个人中心' },
    { key: '2', label: '退出登录' },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-6 bg-[#001529]">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-white">Vite Admin</span>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={menuItems}
          className="flex-1 mx-6 bg-transparent border-b-0"
        />
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer px-2 py-2 rounded hover:bg-white/10">
            <Avatar icon={<UserOutlined />} />
            <span className="text-white text-sm">Admin</span>
          </div>
        </Dropdown>
      </Header>
      <Content className="m-6 p-6 bg-white rounded-lg min-h-[calc(100vh-128px)]">
        <Outlet />
      </Content>
      <Footer className="text-center text-gray-600 py-4 px-6">
        Vite Admin ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
}

export default App;
```

### 步骤 8：创建页面组件（示例）

```typescript
// src/pages/Welcome/index.tsx
import { Card, Row, Col, Statistic, Button, Typography } from 'antd';
import { RocketOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.less';
import { featureData } from './mockData';

const { Title, Paragraph } = Typography;

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <div className={`${styles.hero} text-center p-16 mb-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white`}>
        <Title level={1} className="!text-white text-5xl mb-4">
          🎉 欢迎使用 Vite Admin
        </Title>
        <Paragraph className="text-white/90 text-lg mb-8">
          基于 Vite + React + Ant Design + TypeScript 的现代化管理后台
        </Paragraph>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button type="primary" size="large" icon={<RocketOutlined />}>
            开始使用
          </Button>
          <Button size="large" icon={<ThunderboltOutlined />} onClick={() => window.open('https://ant.design', '_blank')}>
            查看文档
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]} className="mb-10">
        {featureData.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.id}>
            <Card className={`${styles.featureCard} h-full rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.icon}
                valueStyle={{ color: item.color }}
              />
              <Paragraph className="mt-3 text-gray-600 text-sm">
                {item.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Welcome;
```

```typescript
// src/pages/Welcome/mockData.ts
import { HomeOutlined, ThunderboltOutlined, SafetyCertificateOutlined, RocketOutlined } from '@ant-design/icons';

export interface FeatureItem {
  id: string;
  title: string;
  value: string;
  color: string;
  description: string;
  icon: React.ReactNode;
}

export const featureData: FeatureItem[] = [
  {
    id: '1',
    title: '技术栈',
    value: 'Vite 7',
    color: '#1677ff',
    description: '极速开发体验，热更新秒级响应',
    icon: <HomeOutlined className="text-2xl" />,
  },
  {
    id: '2',
    title: 'UI 框架',
    value: 'Ant Design 6',
    color: '#52c41a',
    description: '企业级组件库，开箱即用',
    icon: <ThunderboltOutlined className="text-2xl" />,
  },
  {
    id: '3',
    title: '类型安全',
    value: 'TypeScript',
    color: '#faad14',
    description: '完整的类型定义，开发更安全',
    icon: <SafetyCertificateOutlined className="text-2xl" />,
  },
  {
    id: '4',
    title: '状态管理',
    value: 'Zustand',
    color: '#722ed1',
    description: '轻量级状态管理，简单易用',
    icon: <RocketOutlined className="text-2xl" />,
  },
];
```

```less
// src/pages/Welcome/Welcome.module.less
/* 复杂动画效果 */
.hero {
  animation: fadeIn 0.6s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* 卡片悬停光泽效果 */
.featureCard {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}
```

## 验证步骤

### 构建验证
```bash
pnpm build
```
确保无 TypeScript 错误和构建警告。

### 开发服务器
```bash
pnpm dev
```
访问 http://localhost:5173 查看效果。

### 代码检查
```bash
pnpm lint
```

## 质量检查清单

- [ ] 每个组件文件 ≤ 200 行
- [ ] MOCK 数据在独立文件
- [ ] 优先使用 TailwindCSS
- [ ] Less 仅用于复杂样式
- [ ] 组件职责单一
- [ ] 类型定义完整
- [ ] 构建无错误
- [ ] 路由配置正确
- [ ] 状态管理规范

## 常见场景

### 添加新页面
1. 在 `src/pages/` 创建页面文件夹
2. 创建 `index.tsx`（组件）、`mockData.ts`（数据）、`PageName.module.less`（样式）
3. 在 `src/router/index.tsx` 添加路由
4. 在 `App.tsx` 菜单中添加导航项

### 添加可复用组件
1. 在 `src/components/` 创建组件文件夹
2. 创建 `index.tsx` 和 `ComponentName.module.less`
3. 如有静态数据，创建 `mockData.ts`
4. 在页面中导入使用

### 添加全局状态
1. 在 `src/store/` 创建 store 文件
2. 使用 `create()` 定义状态和 actions
3. 在组件中通过 hook 使用

## 技术更新记录

- **Vite 7**: 更快的构建速度和 HMR
- **React 19**: 最新的 React 特性
- **Ant Design 6**: 全新的设计语言
- **React Router v7**: 改进的数据加载 API
- **TailwindCSS v4**: 更小的包体积和更好的性能
