# AI Agent 集成和使用指南

## 概述

本指南详细介绍如何在 shadcn/ui + Tailwind CSS 项目中集成和使用 AI Agent 进行代码生成。该系统基于 V0 提示词规范，为 AI Agent 提供标准化的代码生成能力。

## 快速开始

### 1. 项目初始化

```bash
# 克隆模板项目
git clone <template-repo> my-ai-project
cd my-ai-project

# 安装依赖
npm install

# 初始化 AI Agent 配置
npm run ai:init
```

### 2. 基本配置

在项目根目录创建 `.ai-config.json` 配置文件：

```json
{
  "model": "gpt-4",
  "temperature": 0.1,
  "maxTokens": 4000,
  "prompts": {
    "system": "src/lib/prompts/system-prompts.ts",
    "component": "src/lib/prompts/component-prompts.ts",
    "page": "src/lib/prompts/page-prompts.ts"
  },
  "templates": {
    "component": "src/lib/component-templates.ts",
    "page": "templates/page-template.tsx"
  }
}
```

## AI Agent 集成方式

### 方式一：CLI 工具集成

使用内置的 CLI 工具进行 AI 代码生成：

```bash
# 生成组件
npm run ai:component -- --name Button --type ui --props "variant,size,disabled"

# 生成页面
npm run ai:page -- --name Dashboard --layout default --components "Card,Table,Chart"

# 生成 Hook
npm run ai:hook -- --name useApi --type data --features "cache,error,loading"
```

### 方式二：API 集成

通过 API 接口集成 AI Agent：

```typescript
import { AIIntegrationAPI } from '@/lib/ai-integration-api';

const aiAPI = new AIIntegrationAPI({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.1
});

// 生成组件
const componentCode = await aiAPI.generateComponent({
  name: 'UserCard',
  type: 'ui',
  props: ['user', 'onEdit', 'onDelete'],
  features: ['responsive', 'accessible']
});

// 生成页面
const pageCode = await aiAPI.generatePage({
  name: 'UserManagement',
  layout: 'dashboard',
  components: ['UserTable', 'UserForm', 'SearchBar']
});
```

### 方式三：IDE 插件集成

支持主流 IDE 的插件集成：

#### VS Code 集成

1. 安装 AI Agent 扩展
2. 配置 API 密钥
3. 使用快捷键或命令面板调用

```json
// .vscode/settings.json
{
  "aiAgent.apiKey": "${env:OPENAI_API_KEY}",
  "aiAgent.model": "gpt-4",
  "aiAgent.promptsPath": "./src/lib/prompts",
  "aiAgent.templatesPath": "./templates"
}
```

## 提示词系统使用

### 系统级提示词

系统级提示词定义了 AI Agent 的基本行为和代码生成规范：

```typescript
// src/lib/prompts/system-prompts.ts
export const SYSTEM_PROMPTS = {
  base: `
你是一个专业的 React + Next.js + TypeScript 开发专家。
使用 shadcn/ui + Tailwind CSS 技术栈。

核心原则：
1. 优先使用 shadcn/ui 组件作为基础构建块
2. 使用 Tailwind CSS 进行样式设计，避免自定义 CSS
3. 确保 TypeScript 类型安全和完整的类型定义
4. 实现 WCAG 2.1 AA 级可访问性标准
5. 考虑性能优化和最佳实践
6. 使用现代 React 模式（Hooks、Context、Suspense）
  `,
  
  codeStyle: `
代码风格要求：
- 使用函数式组件和 React Hooks
- 优先使用 TypeScript 接口定义类型
- 使用 ESLint 和 Prettier 规范
- 组件名使用 PascalCase
- 文件名使用 kebab-case
- 导出使用 named export
  `
};
```

### 组件生成提示词

针对不同类型组件的专用提示词：

```typescript
// src/lib/prompts/component-prompts.ts
export const COMPONENT_PROMPTS = {
  ui: `
创建一个 UI 组件，要求：
1. 基于 shadcn/ui 组件构建
2. 使用 class-variance-authority 定义变体
3. 支持 forwardRef 和 asChild 模式
4. 包含完整的 TypeScript 类型定义
5. 添加适当的 ARIA 属性
6. 提供使用示例和文档注释
  `,
  
  form: `
创建一个表单组件，要求：
1. 使用 React Hook Form + Zod 验证
2. 集成 shadcn/ui 表单组件
3. 支持字段验证和错误显示
4. 实现可访问的表单标签和描述
5. 支持异步提交和加载状态
6. 包含表单重置和默认值处理
  `,
  
  layout: `
创建一个布局组件，要求：
1. 使用 CSS Grid 或 Flexbox 布局
2. 支持响应式设计和断点
3. 实现暗色模式支持
4. 考虑内容溢出和滚动处理
5. 支持嵌套布局和组合
6. 优化性能和渲染效率
  `
};
```

### 自定义提示词

创建项目特定的提示词：

```typescript
// src/lib/prompts/custom-prompts.ts
export const CUSTOM_PROMPTS = {
  // 业务组件提示词
  business: `
创建业务组件时，需要考虑：
1. 业务逻辑与 UI 组件分离
2. 使用 Context 管理状态
3. 实现错误边界和降级处理
4. 支持国际化和本地化
5. 集成分析和监控
  `,
  
  // 数据组件提示词
  data: `
创建数据组件时，需要考虑：
1. 使用 TanStack Query 管理数据状态
2. 实现加载、错误、空状态处理
3. 支持分页、排序、筛选功能
4. 优化大数据集渲染性能
5. 实现数据缓存和同步
  `
};
```

## 代码生成最佳实践

### 1. 组件生成

```typescript
// 使用 AI Agent 生成组件的最佳实践
const generateComponent = async (config: ComponentConfig) => {
  const prompt = buildComponentPrompt({
    name: config.name,
    type: config.type,
    props: config.props,
    features: config.features,
    context: getProjectContext()
  });
  
  const code = await aiAPI.generate(prompt);
  
  // 后处理：格式化、类型检查、测试生成
  const formattedCode = await formatCode(code);
  const typeCheckedCode = await validateTypes(formattedCode);
  const testCode = await generateTests(typeCheckedCode);
  
  return {
    component: typeCheckedCode,
    tests: testCode,
    documentation: generateDocs(typeCheckedCode)
  };
};
```

### 2. 页面生成

```typescript
// 页面生成最佳实践
const generatePage = async (config: PageConfig) => {
  const prompt = buildPagePrompt({
    name: config.name,
    layout: config.layout,
    components: config.components,
    features: config.features,
    routing: config.routing
  });
  
  const code = await aiAPI.generate(prompt);
  
  // 生成相关文件
  const pageComponent = extractPageComponent(code);
  const metadata = extractMetadata(code);
  const styles = extractStyles(code);
  
  return {
    page: pageComponent,
    metadata,
    styles,
    routing: generateRouting(config)
  };
};
```

### 3. 质量保证

```typescript
// 代码质量检查
const validateGeneratedCode = async (code: string) => {
  const checks = await Promise.all([
    lintCode(code),
    typeCheck(code),
    accessibilityCheck(code),
    performanceCheck(code),
    securityCheck(code)
  ]);
  
  return {
    isValid: checks.every(check => check.passed),
    issues: checks.flatMap(check => check.issues),
    suggestions: checks.flatMap(check => check.suggestions)
  };
};
```

## 高级功能

### 1. 上下文感知生成

AI Agent 可以基于项目上下文生成更准确的代码：

```typescript
// 上下文管理器
const contextManager = new AIContextManager({
  projectType: 'nextjs',
  uiLibrary: 'shadcn',
  styleFramework: 'tailwind',
  stateManagement: 'zustand',
  dataFetching: 'tanstack-query'
});

// 获取上下文信息
const context = await contextManager.getContext({
  includeComponents: true,
  includeStyles: true,
  includeTypes: true,
  includeTests: true
});

// 基于上下文生成代码
const code = await aiAPI.generateWithContext(prompt, context);
```

### 2. 增量代码生成

支持基于现有代码的增量生成：

```typescript
// 增量生成
const incrementalGenerate = async (
  existingCode: string,
  modification: string
) => {
  const prompt = buildIncrementalPrompt({
    existing: existingCode,
    modification,
    preserveLogic: true,
    maintainCompatibility: true
  });
  
  const updatedCode = await aiAPI.generate(prompt);
  
  // 合并代码变更
  return mergeCodeChanges(existingCode, updatedCode);
};
```

### 3. 多文件生成

支持一次生成多个相关文件：

```typescript
// 多文件生成
const generateFeature = async (featureConfig: FeatureConfig) => {
  const files = await aiAPI.generateMultipleFiles({
    component: buildComponentPrompt(featureConfig.component),
    hook: buildHookPrompt(featureConfig.hook),
    types: buildTypesPrompt(featureConfig.types),
    tests: buildTestsPrompt(featureConfig.tests),
    stories: buildStoriesPrompt(featureConfig.stories)
  });
  
  return files;
};
```

## 故障排除

### 常见问题

#### 1. 生成的代码不符合项目规范

**问题**：AI 生成的代码风格或结构不符合项目要求。

**解决方案**：
- 检查系统提示词配置
- 更新项目上下文信息
- 调整温度参数（降低随机性）
- 添加项目特定的提示词

```typescript
// 调整配置
const config = {
  temperature: 0.1, // 降低随机性
  systemPrompt: ENHANCED_SYSTEM_PROMPT,
  projectContext: await getProjectContext()
};
```

#### 2. 生成的组件缺少类型定义

**问题**：TypeScript 类型定义不完整或不准确。

**解决方案**：
- 在提示词中强调类型安全
- 提供类型定义示例
- 使用类型检查工具验证

```typescript
const typePrompt = `
确保生成的组件包含：
1. 完整的 Props 接口定义
2. 泛型类型支持
3. 事件处理器类型
4. Ref 类型定义
5. 导出类型定义
`;
```

#### 3. 样式不符合设计系统

**问题**：生成的 Tailwind CSS 类不符合设计系统规范。

**解决方案**：
- 更新设计系统配置
- 提供样式指南
- 使用样式验证工具

```typescript
const styleGuide = `
使用以下设计 token：
- 主色：bg-primary-500, text-primary-600
- 间距：p-4, m-2, gap-3
- 圆角：rounded-md, rounded-lg
- 阴影：shadow-sm, shadow-md
`;
```

### 调试技巧

#### 1. 启用详细日志

```typescript
const aiAPI = new AIIntegrationAPI({
  debug: true,
  logLevel: 'verbose',
  logFile: './logs/ai-generation.log'
});
```

#### 2. 分步生成

```typescript
// 分步生成便于调试
const steps = [
  'structure', // 组件结构
  'props',     // 属性定义
  'logic',     // 业务逻辑
  'styles',    // 样式应用
  'types'      // 类型定义
];

for (const step of steps) {
  const result = await aiAPI.generateStep(step, context);
  console.log(`Step ${step}:`, result);
}
```

#### 3. 代码验证

```typescript
// 实时验证生成的代码
const validator = new CodeValidator({
  typescript: true,
  eslint: true,
  prettier: true,
  accessibility: true
});

const validation = await validator.validate(generatedCode);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

## 性能优化

### 1. 缓存策略

```typescript
// 启用生成缓存
const aiAPI = new AIIntegrationAPI({
  cache: {
    enabled: true,
    ttl: 3600, // 1小时
    storage: 'redis' // 或 'memory'
  }
});
```

### 2. 批量生成

```typescript
// 批量生成提高效率
const batchGenerate = async (requests: GenerationRequest[]) => {
  const batches = chunk(requests, 5); // 每批5个请求
  const results = [];
  
  for (const batch of batches) {
    const batchResults = await Promise.all(
      batch.map(request => aiAPI.generate(request))
    );
    results.push(...batchResults);
  }
  
  return results;
};
```

### 3. 流式生成

```typescript
// 流式生成大型代码文件
const streamGenerate = async (prompt: string) => {
  const stream = await aiAPI.generateStream(prompt);
  
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
};
```

## 安全考虑

### 1. API 密钥管理

```bash
# 使用环境变量
export OPENAI_API_KEY="your-api-key"
export AI_MODEL="gpt-4"

# 或使用 .env 文件
echo "OPENAI_API_KEY=your-api-key" >> .env.local
```

### 2. 代码审查

```typescript
// 自动代码审查
const reviewCode = async (code: string) => {
  const issues = await Promise.all([
    scanForSecurityIssues(code),
    checkForSensitiveData(code),
    validateDependencies(code),
    checkLicenseCompliance(code)
  ]);
  
  return issues.flat();
};
```

### 3. 输入验证

```typescript
// 验证用户输入
const validateInput = (input: string) => {
  // 检查恶意代码注入
  if (containsMaliciousCode(input)) {
    throw new Error('Malicious code detected');
  }
  
  // 限制输入长度
  if (input.length > MAX_INPUT_LENGTH) {
    throw new Error('Input too long');
  }
  
  return sanitizeInput(input);
};
```

## 总结

本指南提供了 AI Agent 集成和使用的完整指导，包括：

1. **快速开始**：项目初始化和基本配置
2. **集成方式**：CLI、API、IDE 插件三种集成方式
3. **提示词系统**：系统级、组件级、自定义提示词
4. **最佳实践**：代码生成、质量保证、性能优化
5. **高级功能**：上下文感知、增量生成、多文件生成
6. **故障排除**：常见问题解决和调试技巧
7. **安全考虑**：API 安全、代码审查、输入验证

通过遵循本指南，开发者可以高效地使用 AI Agent 进行代码生成，提高开发效率和代码质量。