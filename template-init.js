#!/usr/bin/env node

/**
 * XAGI AI Template React Next App - 初始化脚本
 *
 * 此脚本在模板安装后自动运行，用于：
 * 1. 初始化项目配置
 * 2. 设置AI Agent环境
 * 3. 验证依赖安装
 * 4. 提供使用指导
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// 检查环境要求
function checkRequirements() {
  logStep(1, '检查环境要求');

  try {
    // 检查Node.js版本
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

    if (majorVersion < 18) {
      logError(`Node.js版本过低: ${nodeVersion}，需要 >= 18.0.0`);
      process.exit(1);
    }
    logSuccess(`Node.js版本: ${nodeVersion}`);

    // 检查pnpm
    try {
      const pnpmVersion = execSync('pnpm --version', {
        encoding: 'utf8',
      }).trim();
      logSuccess(`pnpm版本: ${pnpmVersion}`);
    } catch (error) {
      logError('未找到pnpm，请先安装: npm install -g pnpm');
      process.exit(1);
    }
  } catch (error) {
    logError(`环境检查失败: ${error.message}`);
    process.exit(1);
  }
}

// 初始化项目配置
function initializeProject() {
  logStep(2, '初始化项目配置');

  try {
    // 创建.env.local文件（如果不存在）
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      const envContent = `# XAGI AI Template 环境变量
# 开发环境配置
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=XAGI AI Template
NEXT_PUBLIC_APP_VERSION=1.2.0

# AI Agent 配置
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_AI_PROVIDER=xagi

# 性能监控
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
`;
      fs.writeFileSync(envPath, envContent);
      logSuccess('创建 .env.local 配置文件');
    }

    // 创建.npmrc文件（如果不存在）
    const npmrcPath = path.join(process.cwd(), '.npmrc');
    if (!fs.existsSync(npmrcPath)) {
      const npmrcContent = `# XAGI AI Template pnpm 配置
engine-strict=true
auto-install-peers=true
strict-peer-dependencies=false
`;
      fs.writeFileSync(npmrcPath, npmrcContent);
      logSuccess('创建 .npmrc 配置文件');
    }

    // 创建.gitignore文件（如果不存在）
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      const gitignoreContent = `# XAGI AI Template .gitignore

# Dependencies
node_modules/
.pnpm-store/

# Next.js
.next/
out/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# AI Agent 相关
.ai/
.kiro/

# 性能分析报告
bundle-analyzer-report.html
lighthouse-report.html

# 测试覆盖率
coverage/
.nyc_output/

# 构建产物
dist/
build/
out/
`;
      fs.writeFileSync(gitignorePath, gitignoreContent);
      logSuccess('创建 .gitignore 文件');
    }
  } catch (error) {
    logError(`项目配置初始化失败: ${error.message}`);
  }
}

// 验证依赖安装
function validateDependencies() {
  logStep(3, '验证依赖安装');

  try {
    // 检查package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      logError('未找到 package.json 文件');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // 检查关键依赖
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      'typescript',
      'tailwindcss',
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'lucide-react',
    ];

    const missingDeps = requiredDeps.filter(
      dep =>
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );

    if (missingDeps.length > 0) {
      logWarning(`缺少依赖: ${missingDeps.join(', ')}`);
      log('请运行: pnpm install', 'yellow');
    } else {
      logSuccess('所有关键依赖已安装');
    }
  } catch (error) {
    logError(`依赖验证失败: ${error.message}`);
  }
}

// 设置AI Agent环境
function setupAIEnvironment() {
  logStep(4, '设置AI Agent环境');

  try {
    // 创建AI配置目录
    const aiDir = path.join(process.cwd(), '.ai');
    if (!fs.existsSync(aiDir)) {
      fs.mkdirSync(aiDir, { recursive: true });

      // 创建agents子目录
      const agentsDir = path.join(aiDir, 'agents');
      fs.mkdirSync(agentsDir, { recursive: true });

      // 创建通用AI配置文件
      const generalConfig = `# XAGI AI Template - 通用AI Agent配置

## 项目概述
这是一个基于Next.js 14 + shadcn/ui + Tailwind CSS的现代前端应用模板，专为AI驱动的开发工作流程优化。

## 技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript (严格模式)
- **UI库**: shadcn/ui + Radix UI + Tailwind CSS
- **状态管理**: TanStack Query
- **表单**: React Hook Form + Zod验证
- **测试**: Vitest + React Testing Library
- **包管理**: pnpm (强制要求)

## AI开发规范

### 组件开发
- 使用函数式组件 + TypeScript
- 遵循shadcn/ui设计模式
- 包含完整的类型定义和JSDoc注释
- 支持暗色模式和响应式设计
- 确保可访问性标准 (WCAG 2.1 AA)

### 代码风格
- 使用清晰的变量命名
- 添加详细的JSDoc注释
- 优先使用组合而非继承
- 遵循React Hooks规则
- 使用TypeScript接口确保类型安全

### 性能优化
- 使用React.memo和useMemo优化渲染
- 实现代码分割和懒加载
- 优化图片和字体加载
- 使用TanStack Query进行数据缓存

## Slash Commands

### 快速开发
- \`/component\` - 生成新组件
- \`/page\` - 生成新页面
- \`/hook\` - 生成自定义Hook
- \`/test\` - 生成测试用例

### 代码优化
- \`/fix\` - 修复代码问题
- \`/refactor\` - 重构优化代码
- \`/optimize\` - 性能优化建议
- \`/accessibility\` - 可访问性改进

### 文档生成
- \`/docs\` - 生成组件文档
- \`/readme\` - 更新README
- \`/changelog\` - 生成变更日志

## 项目结构
\`\`\`
src/
├── app/           # Next.js App Router
├── components/    # React组件
│   ├── ui/       # shadcn/ui基础组件
│   ├── common/   # 通用组件
│   ├── forms/    # 表单组件
│   └── layouts/  # 布局组件
├── hooks/        # 自定义Hooks
├── lib/          # 工具函数
├── types/        # TypeScript类型
└── services/     # API服务
\`\`\`

## 开发命令
\`\`\`bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm test         # 运行测试
pnpm lint         # 代码检查
pnpm ai:init      # 初始化AI环境
pnpm ai:component # 生成组件
\`\`\`
`;

      fs.writeFileSync(path.join(agentsDir, 'general.md'), generalConfig);

      // 创建Claude专用配置
      const claudeConfig = `# XAGI AI Template - Claude Code 配置

## Claude Code 专用设置

### 系统提示词
你是一个专业的React/Next.js开发助手，专门帮助开发基于XAGI AI Template的现代Web应用。

### 开发原则
1. **类型安全优先**: 始终使用TypeScript，确保类型安全
2. **组件化思维**: 创建可复用、可组合的组件
3. **性能优化**: 考虑渲染性能和用户体验
4. **可访问性**: 确保所有组件符合WCAG 2.1 AA标准
5. **现代实践**: 使用最新的React和Next.js特性

### 代码生成模板

#### React组件模板
\`\`\`tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn('default-styles', className)}>
      {children}
    </div>
  );
};

export default Component;
\`\`\`

#### 自定义Hook模板
\`\`\`tsx
import { useState, useEffect } from 'react';

interface UseHookOptions {
  // 配置选项
}

interface UseHookReturn {
  // 返回值类型
}

export const useHook = (options: UseHookOptions): UseHookReturn => {
  // Hook逻辑
  
  return {
    // 返回值
  };
};
\`\`\`

### 最佳实践
- 使用shadcn/ui组件作为基础
- 遵循Tailwind CSS实用优先原则
- 使用React Hook Form处理表单
- 使用Zod进行数据验证
- 使用TanStack Query管理服务器状态
- 编写全面的测试用例

### 性能优化建议
- 使用React.memo包装纯组件
- 使用useMemo和useCallback优化计算
- 实现虚拟滚动处理大量数据
- 使用Next.js Image组件优化图片
- 启用代码分割和懒加载
`;

      fs.writeFileSync(path.join(agentsDir, 'claude.md'), claudeConfig);

      logSuccess('创建AI Agent配置文件');
    }
  } catch (error) {
    logError(`AI环境设置失败: ${error.message}`);
  }
}

// 显示使用指导
function showUsageGuide() {
  logStep(5, '使用指导');

  log('\n🎉 XAGI AI Template React Next App 初始化完成！', 'green');

  log('\n📋 下一步操作:', 'cyan');
  log('1. 安装依赖: pnpm install', 'yellow');
  log('2. 启动开发服务器: pnpm dev', 'yellow');
  log('3. 打开浏览器访问: http://localhost:3000', 'yellow');

  log('\n🤖 AI Agent 命令:', 'cyan');
  log('• pnpm ai:init      - 初始化AI环境', 'yellow');
  log('• pnpm ai:component - 生成新组件', 'yellow');
  log('• pnpm ai:page      - 生成新页面', 'yellow');
  log('• pnpm ai:validate  - 验证代码质量', 'yellow');

  log('\n📚 文档资源:', 'cyan');
  log('• README.md         - 项目说明', 'yellow');
  log('• docs/             - 详细文档', 'yellow');
  log('• .ai/agents/       - AI配置文件', 'yellow');

  log('\n🔧 开发工具:', 'cyan');
  log('• pnpm dev          - 开发服务器', 'yellow');
  log('• pnpm build        - 生产构建', 'yellow');
  log('• pnpm test         - 运行测试', 'yellow');
  log('• pnpm lint         - 代码检查', 'yellow');

  log('\n💡 提示:', 'magenta');
  log('• 本项目强制使用pnpm作为包管理工具', 'yellow');
  log('• 所有组件都支持暗色模式和响应式设计', 'yellow');
  log('• 内置AI Agent支持，可自动生成代码', 'yellow');
  log('• 遵循现代Web开发最佳实践', 'yellow');

  log('\n🚀 开始开发:', 'green');
  log('运行 "pnpm dev" 开始您的AI驱动开发之旅！', 'bright');
}

// 主函数
function main() {
  log('🚀 XAGI AI Template React Next App - 初始化脚本', 'bright');
  log('================================================', 'cyan');

  try {
    checkRequirements();
    initializeProject();
    validateDependencies();
    setupAIEnvironment();
    showUsageGuide();

    log('\n✨ 初始化完成！祝您开发愉快！', 'green');
  } catch (error) {
    logError(`初始化失败: ${error.message}`);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  checkRequirements,
  initializeProject,
  validateDependencies,
  setupAIEnvironment,
  showUsageGuide,
};
