# @xagi/ai-template-react-next-app

[![npm version](https://img.shields.io/npm/v/@xagi/ai-template-react-next-app.svg)](https://www.npmjs.com/package/@xagi/ai-template-react-next-app)
[![npm downloads](https://img.shields.io/npm/dm/@xagi/ai-template-react-next-app.svg)](https://www.npmjs.com/package/@xagi/ai-template-react-next-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Modern Next.js application with Pages mode, unstyled components and XAGI AI coding integration**

基于 Next.js 14 + shadcn/ui + Tailwind CSS 的 AI Agent 编码模板，专为 AI 驱动的开发工作流程优化。

## 🚀 快速开始

### 使用 npx 创建新项目

```bash
npx @xagi/ai-template-react-next-app@latest my-app
cd my-app
pnpm install
pnpm dev
```

### 使用 pnpm 创建

```bash
pnpm create @xagi/ai-template-react-next-app my-app
cd my-app
pnpm install
pnpm dev
```

### 手动安装

```bash
npm install @xagi/ai-template-react-next-app
# 或
yarn add @xagi/ai-template-react-next-app
# 或
pnpm add @xagi/ai-template-react-next-app
```

## ✨ 特性

- ⚡ **Next.js 14** with App Router
- 🎨 **shadcn/ui + Tailwind CSS** 现代 UI 组件库
- 📝 **TypeScript 严格模式** 完整类型安全
- 📦 **pnpm 强制使用** 快速包管理
- 🧪 **Vitest + React Testing Library** 测试框架
- 🔧 **ESLint + Prettier** 代码质量保证
- 🤖 **AI Agent 友好** 项目结构优化
- 📚 **内置提示词系统** 基于 V0 规范
- 🎯 **组件生成工具** 自动化开发流程
- ♿ **可访问性标准** WCAG 2.1 AA 支持
- 🌙 **暗色模式** 完整主题系统
- 🚀 **性能优化** Lighthouse 评分 90+
- 📱 **响应式设计** 移动端优先
- 🔒 **安全配置** CSP 和 HTTPS 支持

## 🛠 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (强制要求)
- **浏览器**: Chrome >= 87, Firefox >= 78, Safari >= 14, Edge >= 87

### 安装 pnpm

如果尚未安装 pnpm：

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用官方安装脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## 📁 项目结构

```
├── .ai/                    # AI Agent 配置目录
│   ├── agents/            # AI Agent 配置文件
│   │   ├── general.md     # 通用AI配置
│   │   └── claude.md      # Claude Code专用配置
│   └── README.md          # AI配置说明
├── scripts/               # 构建和工具脚本
│   ├── ai-agent-cli.js   # AI Agent CLI 工具
│   ├── template-publisher.js # 模板发布工具
│   └── check-package-manager.js
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx     # 首页
│   │   ├── globals.css  # 全局样式
│   │   └── examples/    # 示例页面
│   ├── components/       # React 组件
│   │   ├── ui/          # shadcn/ui 基础组件
│   │   ├── common/      # 通用组件
│   │   ├── forms/       # 表单组件
│   │   ├── layouts/     # 布局组件
│   │   └── index.ts     # 组件导出
│   ├── lib/             # 工具库
│   │   ├── utils.ts     # 通用工具函数
│   │   ├── ai-helpers.ts # AI 辅助函数
│   │   └── prompts/     # 提示词管理
│   ├── hooks/           # 自定义 React Hooks
│   ├── types/           # TypeScript 类型定义
│   └── test/            # 测试文件和工具
├── docs/                # 项目文档
├── components.json      # shadcn/ui 配置
├── template.json        # 模板配置
├── template-init.js     # 模板初始化脚本
├── pnpm-workspace.yaml  # pnpm 工作区配置
├── .npmrc              # pnpm 配置
└── package.json        # 项目配置
```

## 🤖 AI Agent 开发

本模板专为 AI Agent 辅助开发优化，支持多种AI工具：

### 支持的 AI Agent

- **Claude Code** - 深度代码分析和优化
- **GitHub Copilot** - 快速代码补全
- **Cursor** - AI 驱动的代码编辑器
- **Windsurf** - 智能代码生成
- **Gemini CLI** - Google AI 集成

### AI 开发工作流

#### 完整功能开发流程
```
/constitution → /specify → /clarify → /design → /plan → /tasks → /analyze → /implement
```

#### 快速开发命令
- `/component` - 快速生成组件
- `/page` - 快速生成页面
- `/hook` - 快速生成自定义Hook
- `/test` - 快速生成测试用例
- `/fix` - 修复代码问题  
- `/refactor` - 重构优化代码
- `/docs` - 生成文档

### AI Agent 工具命令

```bash
# 初始化 AI Agent 项目结构
pnpm ai:init

# 生成新组件
pnpm ai:component --name button --type ui

# 生成新页面
pnpm ai:page --name dashboard --layout default

# 代码质量验证
pnpm ai:validate
pnpm ai:validate --fix  # 自动修复

# AI 模型优化
pnpm ai:claude --task component    # 使用 Claude 优化模式
pnpm ai:codex --task fix          # 使用 Codex 快速模式
pnpm ai:optimize --task refactor  # 获取模型选择建议

# 性能监控
pnpm ai:report                    # 生成 AI 性能报告
pnpm ai:monitor record claude component  # 记录开发会话
```

## 📝 可用脚本

### 开发脚本
```bash
pnpm dev              # 启动开发服务器
pnpm dev:turbo        # 启动 Turbo 模式开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
```

### 代码质量
```bash
pnpm lint             # 运行 ESLint 检查
pnpm lint:fix         # 自动修复 ESLint 问题
pnpm type-check       # TypeScript 类型检查
pnpm format           # 格式化所有代码
pnpm format:check     # 检查代码格式
```

### 测试
```bash
pnpm test             # 运行测试
pnpm test:watch       # 监听模式运行测试
pnpm test:coverage    # 生成测试覆盖率报告
pnpm test:ui          # 启动测试 UI 界面
pnpm test:unit        # 运行单元测试
pnpm test:integration # 运行集成测试
pnpm test:a11y        # 运行可访问性测试
pnpm test:performance # 运行性能测试
```

### AI Agent 工具
```bash
pnpm ai:init          # 初始化 AI 项目结构
pnpm ai:component     # 生成组件
pnpm ai:page          # 生成页面
pnpm ai:validate      # 验证代码质量
pnpm ai:claude        # Claude 优化模式
pnpm ai:codex         # Codex 快速模式
pnpm ai:optimize      # 获取优化建议
pnpm ai:monitor       # 性能监控
pnpm ai:report        # 生成报告
```

### 依赖管理
```bash
pnpm check:deps       # 检查依赖安全性
pnpm check:outdated   # 检查过时的包
pnpm update:deps      # 交互式更新依赖
pnpm clean:deps       # 清理并重新安装依赖
```

### 模板发布
```bash
pnpm template:init        # 初始化模板
pnpm template:validate    # 验证模板
pnpm template:package     # 打包模板
pnpm template:publish     # 发布模板
pnpm template:publish:dry # 预览发布
pnpm template:list        # 列出模板
```

## 🎨 组件系统

模板包含基于 shadcn/ui 的完整组件系统：

### 基础 UI 组件
- **Button**: 多种变体和尺寸，支持 loading 状态
- **Input**: 文本输入，支持前缀、后缀、验证状态
- **Card**: 内容容器，支持标题、描述、操作区域
- **Dialog**: 模态对话框，支持可访问性
- **Select**: 下拉选择，支持搜索和多选
- **Toast**: 通知提示，支持多种类型
- **Tooltip**: 工具提示，支持多种位置
- **Avatar**: 用户头像，支持图片和文字
- **Badge**: 状态标识和计数器
- **Progress**: 进度条和环形进度

### 表单组件
- **Form**: 基于 React Hook Form + Zod 验证
- **FormField**: 统一的字段包装器
- **Label**: 语义化标签，支持必填标识
- **Validation**: 实时验证和错误提示
- **SearchForm**: 搜索表单组件
- **BasicForm**: 基础表单模板

### 布局组件
- **Container**: 响应式容器
- **Grid**: Flexbox 和 CSS Grid 布局
- **Stack**: 垂直和水平堆叠
- **Separator**: 分隔线组件
- **DashboardLayout**: 仪表板布局
- **ListPageLayout**: 列表页面布局
- **DetailPageLayout**: 详情页面布局
- **FormPageLayout**: 表单页面布局

### 数据展示
- **Table**: 基于 TanStack Table 的数据表格
- **DataTable**: 增强型数据表格
- **ProfileCard**: 用户资料卡片
- **DetailView**: 详情视图组件

### 开发工具组件
- **DevelopmentDashboard**: 开发仪表板
- **DevelopmentGuidance**: 开发指导
- **DevelopmentProgress**: 开发进度
- **SmartSuggestions**: 智能建议
- **StageIndicator**: 阶段指示器
- **StageTransition**: 阶段转换

所有组件都支持：
- 🎨 Tailwind CSS 样式定制
- 🌙 暗色模式
- ♿ 可访问性标准 (WCAG 2.1 AA)
- 📱 响应式设计
- 🔧 TypeScript 类型安全
- 🧪 完整测试覆盖

## 🔧 配置说明

### 端口配置
- 开发环境: `3000` (Next.js 默认)
- 生产环境: 通过环境变量配置

### shadcn/ui 配置
shadcn/ui 通过 `components.json` 配置：
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  }
}
```

### Tailwind CSS 配置
- 设计系统变量在 `src/app/globals.css`
- 主题配置在 `tailwind.config.ts`
- 支持暗色模式和自定义颜色
- 包含动画和过渡效果

### TypeScript 配置
- 严格模式启用 (`strict: true`)
- 路径别名配置 (`@/*` 指向 `src/*`)
- 增强的类型检查规则
- 支持最新的 TypeScript 特性

### pnpm 配置
- 强制使用 pnpm (`engine-strict=true`)
- 工作区支持 (`pnpm-workspace.yaml`)
- 优化的缓存和存储设置
- 自动安装对等依赖

### AI Agent 配置
- 配置文件位于 `.ai/agents/` 目录
- 支持多种 AI 工具和模型
- 内置提示词和最佳实践
- 可自定义开发工作流

## 🚨 故障排除

### pnpm 相关问题

**错误: "This project requires pnpm"**
```bash
# 1. 安装 pnpm
npm install -g pnpm

# 2. 删除其他锁文件
rm package-lock.json yarn.lock

# 3. 重新安装
pnpm install
```

**依赖冲突问题**
```bash
# 清理并重新安装
pnpm clean:deps

# 或手动清理
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 构建问题

**TypeScript 错误**
```bash
# 检查类型错误
pnpm type-check

# 清理构建缓存
pnpm clean
pnpm build
```

**样式问题**
```bash
# 重新生成 Tailwind CSS
rm -rf .next
pnpm dev
```

**AI Agent 问题**
```bash
# 重新初始化 AI 环境
pnpm ai:init

# 验证 AI 配置
pnpm ai:validate
```

## 📊 性能指标

- **Lighthouse 评分**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle 大小**: 优化的代码分割和懒加载
- **首屏加载**: < 2s (3G 网络)
- **可访问性**: WCAG 2.1 AA 标准
- **SEO 优化**: 完整的元数据和结构化数据

## 🚀 部署

### Vercel (推荐)
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 或连接 GitHub 仓库自动部署
```

### Netlify
```bash
# 构建命令
pnpm build

# 发布目录
out
```

### Docker
```bash
# 构建镜像
docker build -t my-app .

# 运行容器
docker run -p 3000:3000 my-app
```

## 🤝 贡献指南

本模板专为 AI 辅助开发设计。贡献时请：

1. 遵循 `.ai/agents/` 中的 AI 编码规范
2. 保持 TypeScript 类型安全
3. 使用 shadcn/ui 组件保持一致性
4. 维护项目结构的组织性
5. 必须使用 pnpm 进行包管理
6. 确保可访问性标准符合 WCAG 2.1 AA
7. 添加完整的测试覆盖
8. 更新相关文档

### 开发流程
1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 使用 pnpm 安装依赖: `pnpm install`
4. 开发并测试: `pnpm dev` 和 `pnpm test`
5. 代码质量检查: `pnpm ai:validate`
6. 提交更改: `git commit -m 'Add amazing feature'`
7. 推送分支: `git push origin feature/amazing-feature`
8. 创建 Pull Request

## 📄 许可证

MIT License - 可自由用于您的项目。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [shadcn/ui](https://ui.shadcn.com/) - 现代 UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [pnpm](https://pnpm.io/) - 快速、节省空间的包管理器
- [Radix UI](https://www.radix-ui.com/) - 无样式、可访问的 UI 原语
- [React Hook Form](https://react-hook-form.com/) - 高性能表单库
- [Zod](https://zod.dev/) - TypeScript 优先的模式验证
- [TanStack Query](https://tanstack.com/query) - 强大的数据同步库
- [Vitest](https://vitest.dev/) - 快速的单元测试框架
- [V0](https://v0.dev/) - AI 驱动的 UI 生成工具

## 📞 支持

- 📧 邮箱: support@xagi.ai
- 💬 讨论: [GitHub Discussions](https://github.com/xagi/ai-template-react-next-app/discussions)
- 🐛 问题: [GitHub Issues](https://github.com/xagi/ai-template-react-next-app/issues)
- 📖 文档: [项目文档](./docs/)

---

**Made with ❤️ by XAGI Team**

## 🚀 特性

- ⚡ **Next.js 14** with App Router
- 🎨 **shadcn/ui + Tailwind CSS** 现代 UI 组件库
- 📝 **TypeScript 严格模式** 完整类型安全
- 📦 **pnpm 强制使用** 快速包管理
- 🧪 **Vitest + React Testing Library** 测试框架
- 🔧 **ESLint + Prettier** 代码质量保证
- 🤖 **AI Agent 友好** 项目结构优化
- 📚 **内置提示词系统** 基于 V0 规范
- 🎯 **组件生成工具** 自动化开发流程
- ♿ **可访问性标准** WCAG 2.1 AA 支持
- 🌙 **暗色模式** 完整主题系统

## 🛠 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (强制要求)

### 安装 pnpm

如果尚未安装 pnpm：

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用官方安装脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 项目安装

1. 克隆模板
```bash
git clone <repository-url>
cd ai-agent-nextjs-template
```

2. 安装依赖 (必须使用 pnpm)
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
├── .kiro/                    # Kiro AI 配置目录
│   ├── settings/            # AI Agent 设置
│   │   └── ai-agent.json   # AI 配置文件
│   ├── templates/           # 代码生成模板
│   │   ├── component.template.tsx
│   │   ├── page.template.tsx
│   │   ├── hook.template.ts
│   │   └── test.template.tsx
│   └── steering/            # AI 指导规则
│       ├── ai-prompts.md   # AI 提示词库
│       ├── component-patterns.md
│       └── ai-coding-standards.md
├── scripts/                 # 构建和工具脚本
│   ├── ai-agent-cli.js     # AI Agent CLI 工具
│   └── check-package-manager.js
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx     # 根布局
│   │   ├── page.tsx       # 首页
│   │   └── globals.css    # 全局样式 (Tailwind + CSS 变量)
│   ├── components/         # React 组件
│   │   ├── ui/            # shadcn/ui 基础组件
│   │   ├── common/        # 通用组件
│   │   ├── forms/         # 表单组件
│   │   ├── layouts/       # 布局组件
│   │   └── index.ts       # 组件导出
│   ├── lib/               # 工具库
│   │   ├── utils.ts       # 通用工具函数
│   │   ├── ai-helpers.ts  # AI 辅助函数
│   │   └── prompts/       # 提示词管理
│   ├── hooks/             # 自定义 React Hooks
│   ├── types/             # TypeScript 类型定义
│   └── test/              # 测试文件和工具
├── components.json         # shadcn/ui 配置
├── pnpm-workspace.yaml    # pnpm 工作区配置
├── .npmrc                 # pnpm 配置
└── package.json           # 项目配置 (强制 pnpm)
```

## 🤖 AI Agent 开发

本模板专为 AI Agent 辅助开发优化，基于 V0 提示词规范和 GitHub Spec Kit 的 slash commands 系统。

### 📋 AI Agent 配置文件

- **.ai/agents/claude.md** - Claude Code 专用配置和 slash commands
- **.ai/agents/general.md** - 通用 AI Agent 配置指南
- **.ai/README.md** - AI 配置目录说明
- 支持 Claude Code、GitHub Copilot、Cursor、Windsurf、Gemini CLI 等

### 包管理工具强制要求

本项目强制使用 pnpm，原因如下：

- 🚀 **更快的安装速度**: 比 npm/yarn 快 2-3 倍
- 💾 **节省磁盘空间**: 全局存储，避免重复下载
- 🔒 **更严格的依赖管理**: 避免幽灵依赖问题
- 🎯 **更好的 monorepo 支持**: 原生工作区支持

如果尝试使用其他包管理工具，会收到错误提示。

### Slash Commands 系统

基于 GitHub Spec Kit 规范的结构化开发工作流：

#### 完整功能开发流程
```
/constitution → /specify → /clarify → /design → /plan → /tasks → /analyze → /implement
```

#### 快速开发命令
- `/component` - 快速生成组件
- `/fix` - 修复代码问题  
- `/refactor` - 重构优化代码
- `/test` - 生成测试用例
- `/docs` - 生成文档

#### AI 提示词系统
- **系统级提示词** - 基于 V0 规范的核心原则
- **组件生成模板** - shadcn/ui + Tailwind CSS 模式
- **代码质量标准** - TypeScript + 可访问性要求
- **性能优化指引** - 懒加载、代码分割等
- **测试生成模板** - 自动化测试代码

### AI Agent 工具

```bash
# 初始化 AI Agent 项目结构
pnpm ai:init

# 生成新组件
pnpm ai:component --name button --type ui

# 生成新页面
pnpm ai:page --name dashboard --layout default

# 代码质量验证
pnpm ai:validate
pnpm ai:validate --fix  # 自动修复

# AI 模型优化
pnpm ai:claude --task component    # 使用 Claude 优化模式
pnpm ai:codex --task fix          # 使用 Codex 快速模式
pnpm ai:optimize --task refactor  # 获取模型选择建议

# 性能监控
pnpm ai:report                    # 生成 AI 性能报告
pnpm ai:monitor record claude component  # 记录开发会话

# 代码格式化
pnpm format
```

### AI 开发示例

#### Claude Code 优化示例 (复杂任务)
```bash
# 生成企业级表单组件
"创建一个用户注册表单，使用 React Hook Form + Zod 验证，包含邮箱、密码字段，
要求：完整的 TypeScript 类型、可访问性支持、错误处理、测试用例、详细文档"

# 生成数据管理系统
"创建一个用户管理表格，使用 TanStack Table，支持排序、筛选、分页、批量操作，
要求：响应式设计、暗色模式、性能优化、完整测试覆盖"
```

#### Codex 快速开发示例 (简单任务)
```bash
# 快速组件生成
"Create a simple UserCard component with avatar, name, email using shadcn/ui"

# 快速修复
"Fix TypeScript errors in this component and add missing imports"

# 快速原型
"Generate basic dashboard layout with header, sidebar, main content"
```

#### 混合开发工作流
```bash
# 1. Codex 快速原型
pnpm ai:codex --task component --name ProductCard

# 2. Claude 深度开发  
pnpm ai:claude --task enhance --component ProductCard

# 3. 获取优化建议
pnpm ai:optimize --task component --complexity medium
```

## 📝 可用脚本

### 开发脚本
```bash
pnpm dev              # 启动开发服务器
pnpm dev:turbo        # 启动 Turbo 模式开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
```

### 代码质量
```bash
pnpm lint             # 运行 ESLint 检查
pnpm lint:fix         # 自动修复 ESLint 问题
pnpm type-check       # TypeScript 类型检查
pnpm format           # 格式化所有代码
pnpm format:check     # 检查代码格式
```

### 测试
```bash
pnpm test             # 运行测试
pnpm test:watch       # 监听模式运行测试
pnpm test:coverage    # 生成测试覆盖率报告
pnpm test:ui          # 启动测试 UI 界面
```

### AI Agent 工具
```bash
pnpm ai:init          # 初始化 AI 项目结构
pnpm ai:component     # 生成组件
pnpm ai:page          # 生成页面
pnpm ai:validate      # 验证代码质量
```

### 依赖管理
```bash
pnpm check:deps       # 检查依赖安全性
pnpm check:outdated   # 检查过时的包
pnpm update:deps      # 交互式更新依赖
pnpm clean:deps       # 清理并重新安装依赖
```

## 🎨 组件系统

模板包含基于 shadcn/ui 的完整组件系统：

### 基础 UI 组件
- **Button**: 多种变体和尺寸，支持 loading 状态
- **Input**: 文本输入，支持前缀、后缀、验证状态
- **Card**: 内容容器，支持标题、描述、操作区域
- **Dialog**: 模态对话框，支持可访问性
- **Select**: 下拉选择，支持搜索和多选

### 表单组件
- **Form**: 基于 React Hook Form + Zod 验证
- **FormField**: 统一的字段包装器
- **Label**: 语义化标签，支持必填标识
- **Validation**: 实时验证和错误提示

### 布局组件
- **Container**: 响应式容器
- **Grid**: Flexbox 和 CSS Grid 布局
- **Stack**: 垂直和水平堆叠
- **Separator**: 分隔线组件

### 数据展示
- **Table**: 基于 TanStack Table 的数据表格
- **Badge**: 状态标识和计数器
- **Avatar**: 用户头像组件
- **Progress**: 进度条和环形进度

所有组件都支持：
- 🎨 Tailwind CSS 样式定制
- 🌙 暗色模式
- ♿ 可访问性标准
- 📱 响应式设计
- 🔧 TypeScript 类型安全

## 🔧 配置说明

### 端口配置
- 开发环境: `3000` (Next.js 默认)
- 生产环境: 通过环境变量配置

### shadcn/ui 配置
shadcn/ui 通过 `components.json` 配置：
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  }
}
```

### Tailwind CSS 配置
- 设计系统变量在 `src/app/globals.css`
- 主题配置在 `tailwind.config.ts`
- 支持暗色模式和自定义颜色

### TypeScript 配置
- 严格模式启用 (`strict: true`)
- 路径别名配置 (`@/*` 指向 `src/*`)
- 增强的类型检查规则

### pnpm 配置
- 强制使用 pnpm (`engine-strict=true`)
- 工作区支持 (`pnpm-workspace.yaml`)
- 优化的缓存和存储设置

## 🚨 故障排除

### pnpm 相关问题

**错误: "This project requires pnpm"**
```bash
# 1. 安装 pnpm
npm install -g pnpm

# 2. 删除其他锁文件
rm package-lock.json yarn.lock

# 3. 重新安装
pnpm install
```

**依赖冲突问题**
```bash
# 清理并重新安装
pnpm clean:deps

# 或手动清理
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 构建问题

**TypeScript 错误**
```bash
# 检查类型错误
pnpm type-check

# 清理构建缓存
pnpm clean
pnpm build
```

**样式问题**
```bash
# 重新生成 Tailwind CSS
rm -rf .next
pnpm dev
```

## 🤝 贡献指南

本模板专为 AI 辅助开发设计。贡献时请：

1. 遵循 `.kiro/steering/` 中的 AI 编码规范
2. 保持 TypeScript 类型安全
3. 使用 shadcn/ui 组件保持一致性
4. 维护项目结构的组织性
5. 必须使用 pnpm 进行包管理
6. 确保可访问性标准符合 WCAG 2.1 AA

### 开发流程
1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 使用 pnpm 安装依赖: `pnpm install`
4. 开发并测试: `pnpm dev` 和 `pnpm test`
5. 代码质量检查: `pnpm ai:validate`
6. 提交更改: `git commit -m 'Add amazing feature'`
7. 推送分支: `git push origin feature/amazing-feature`
8. 创建 Pull Request

## 📄 许可证

MIT License - 可自由用于您的项目。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [shadcn/ui](https://ui.shadcn.com/) - 现代 UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [pnpm](https://pnpm.io/) - 快速、节省空间的包管理器
- [Radix UI](https://www.radix-ui.com/) - 无样式、可访问的 UI 原语
- [React Hook Form](https://react-hook-form.com/) - 高性能表单库
- [Zod](https://zod.dev/) - TypeScript 优先的模式验证
- [Vitest](https://vitest.dev/) - 快速的单元测试框架
- [V0](https://v0.dev/) - AI 驱动的 UI 生成工具