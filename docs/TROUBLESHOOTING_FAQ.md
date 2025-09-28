# 常见问题和故障排除文档

## 概述

本文档收集了使用 AI Agent 编码模板过程中的常见问题、解决方案和故障排除指南，帮助开发者快速解决遇到的问题。

## 快速诊断

### 问题分类

| 问题类型 | 症状 | 可能原因 | 快速检查 |
|----------|------|----------|----------|
| 配置问题 | AI Agent 无法启动 | 配置文件错误 | 检查 `.ai-config.json` |
| 生成问题 | 代码生成失败或质量差 | 提示词问题 | 检查提示词配置 |
| 样式问题 | 样式不生效或错误 | Tailwind 配置问题 | 检查 `tailwind.config.ts` |
| 类型问题 | TypeScript 错误 | 类型定义缺失 | 检查类型文件 |
| 性能问题 | 生成速度慢或卡顿 | 资源配置不当 | 检查系统资源 |

### 快速诊断命令

```bash
# 检查项目配置
npm run ai:doctor

# 验证环境配置
npm run ai:validate

# 测试 AI Agent 连接
npm run ai:test-connection

# 检查依赖完整性
npm run ai:check-deps
```

## 配置相关问题

### Q1: AI Agent 无法启动

**症状**：运行 AI Agent 命令时出现错误或无响应

**可能原因**：
- API 密钥配置错误
- 网络连接问题
- 配置文件格式错误
- 依赖包缺失

**解决步骤**：

1. **检查 API 密钥配置**
```bash
# 检查环境变量
echo $OPENAI_API_KEY

# 或检查 .env 文件
cat .env.local | grep OPENAI_API_KEY
```

2. **验证配置文件格式**
```json
// .ai-config.json
{
  "model": "gpt-4",
  "temperature": 0.1,
  "maxTokens": 4000,
  "apiKey": "${OPENAI_API_KEY}",
  "prompts": {
    "system": "src/lib/prompts/system-prompts.ts"
  }
}
```

3. **测试网络连接**
```bash
# 测试 OpenAI API 连接
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

4. **重新安装依赖**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q2: 提示词加载失败

**症状**：AI Agent 报告找不到提示词文件或提示词格式错误

**可能原因**：
- 提示词文件路径错误
- 提示词文件格式不正确
- 文件权限问题

**解决步骤**：

1. **检查文件路径**
```bash
# 验证提示词文件存在
ls -la src/lib/prompts/

# 检查文件内容
cat src/lib/prompts/system-prompts.ts
```

2. **验证文件格式**
```typescript
// 正确的提示词文件格式
export const SYSTEM_PROMPTS = {
  base: `你是一个专业的开发专家...`,
  techStack: `技术栈配置...`
};

// 确保导出格式正确
export default SYSTEM_PROMPTS;
```

3. **检查文件权限**
```bash
# 修复文件权限
chmod 644 src/lib/prompts/*.ts
```

### Q3: 模型配置问题

**症状**：AI Agent 使用了错误的模型或模型参数不生效

**可能原因**：
- 模型名称错误
- 参数配置不当
- API 版本不兼容

**解决步骤**：

1. **验证模型名称**
```json
{
  "model": "gpt-4-turbo-preview", // 确保模型名称正确
  "temperature": 0.1,
  "maxTokens": 4000,
  "topP": 1.0
}
```

2. **测试模型可用性**
```bash
# 列出可用模型
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models | jq '.data[].id'
```

3. **调整模型参数**
```typescript
// 推荐的模型参数配置
const modelConfig = {
  model: 'gpt-4',
  temperature: 0.1,    // 降低随机性
  maxTokens: 4000,     // 适当的输出长度
  topP: 0.9,          // 控制输出多样性
  frequencyPenalty: 0.1, // 减少重复
  presencePenalty: 0.1   // 鼓励新话题
};
```

## 代码生成问题

### Q4: 生成的代码质量差

**症状**：AI 生成的代码不符合项目规范、缺少类型定义或存在语法错误

**可能原因**：
- 提示词不够明确
- 项目上下文信息不足
- 模型参数设置不当

**解决步骤**：

1. **优化提示词**
```typescript
// 改进前的提示词
const weakPrompt = "创建一个按钮组件";

// 改进后的提示词
const strongPrompt = `
创建一个 Button 组件，要求：
1. 基于 shadcn/ui Button 组件
2. 使用 TypeScript 和完整类型定义
3. 支持 variant 和 size 属性
4. 实现 forwardRef 和 asChild 模式
5. 添加适当的 ARIA 属性
6. 使用 Tailwind CSS 进行样式设计

示例结构：
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}
`;
```

2. **增加项目上下文**
```typescript
// 提供项目上下文信息
const contextPrompt = `
项目信息：
- 使用 Next.js 14 + App Router
- UI 库：shadcn/ui
- 样式：Tailwind CSS
- 状态管理：Zustand
- 表单：React Hook Form + Zod

现有组件：
- Button: 基础按钮组件
- Input: 输入框组件
- Card: 卡片容器组件

设计系统：
- 主色：blue-600
- 圆角：rounded-md
- 间距：p-4, m-2
`;
```

3. **使用代码验证**
```typescript
// 生成后验证代码质量
const validateGeneratedCode = async (code: string) => {
  const checks = await Promise.all([
    lintCode(code),           // ESLint 检查
    typeCheck(code),          // TypeScript 检查
    formatCheck(code),        // Prettier 检查
    accessibilityCheck(code), // 可访问性检查
    performanceCheck(code)    // 性能检查
  ]);

  return {
    isValid: checks.every(check => check.passed),
    issues: checks.flatMap(check => check.issues),
    suggestions: checks.flatMap(check => check.suggestions)
  };
};
```

### Q5: 组件样式不正确

**症状**：生成的组件样式不符合设计系统或 Tailwind CSS 类不生效

**可能原因**：
- Tailwind CSS 配置问题
- 样式提示词不准确
- CSS 变量未正确配置

**解决步骤**：

1. **检查 Tailwind 配置**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

2. **验证 CSS 变量**
```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* 确保所有必要的 CSS 变量都已定义 */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* 暗色模式变量 */
}
```

3. **改进样式提示词**
```typescript
const stylePrompt = `
样式要求：
1. 使用 Tailwind CSS 实用类，避免自定义 CSS
2. 遵循项目设计系统的颜色和间距规范
3. 使用 CSS 变量：bg-primary, text-primary-foreground
4. 支持暗色模式：dark:bg-primary-dark
5. 实现响应式设计：sm:, md:, lg: 前缀
6. 使用语义化的类名组合

示例：
className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
`;
```

### Q6: TypeScript 类型错误

**症状**：生成的代码存在 TypeScript 类型错误或类型定义不完整

**可能原因**：
- 类型定义缺失
- 泛型使用不当
- 接口定义不完整

**解决步骤**：

1. **检查类型定义文件**
```typescript
// src/types/index.ts
export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

// 确保导出所有必要的类型
export type { ComponentProps, ButtonProps };
```

2. **改进类型提示词**
```typescript
const typePrompt = `
TypeScript 要求：
1. 为所有组件定义完整的 Props 接口
2. 继承适当的 HTML 元素属性
3. 使用泛型支持灵活的类型参数
4. 添加 JSDoc 注释说明类型用途
5. 导出所有类型定义供外部使用

示例：
/**
 * Button 组件属性
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体 */
  variant?: 'default' | 'destructive' | 'outline';
  /** 按钮大小 */
  size?: 'default' | 'sm' | 'lg';
  /** 是否作为子元素渲染 */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    // 组件实现
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
`;
```

3. **使用类型检查工具**
```bash
# 运行 TypeScript 检查
npx tsc --noEmit

# 使用 ESLint 检查类型相关规则
npx eslint src/ --ext .ts,.tsx

# 生成类型声明文件
npx tsc --declaration --emitDeclarationOnly
```

## 性能相关问题

### Q7: AI 代码生成速度慢

**症状**：AI Agent 生成代码需要很长时间或经常超时

**可能原因**：
- 提示词过长
- 网络连接不稳定
- API 限制或配额问题
- 模型参数设置不当

**解决步骤**：

1. **优化提示词长度**
```typescript
// 使用提示词优化器
const optimizer = new PromptOptimizer();

const originalPrompt = `很长的提示词内容...`;
const optimizedPrompt = optimizer.optimizeLength(originalPrompt, 2000);

// 分层加载提示词
const corePrompt = SYSTEM_PROMPTS.base;
const contextPrompt = getProjectContext();
const finalPrompt = `${corePrompt}\n\n${contextPrompt}`;
```

2. **实现缓存机制**
```typescript
// 启用生成缓存
const aiAPI = new AIIntegrationAPI({
  cache: {
    enabled: true,
    ttl: 3600, // 1小时缓存
    storage: 'redis'
  }
});

// 使用缓存键
const cacheKey = generateCacheKey(prompt, config);
const cachedResult = await cache.get(cacheKey);

if (cachedResult) {
  return cachedResult;
}
```

3. **批量处理请求**
```typescript
// 批量生成多个组件
const batchGenerate = async (requests: GenerationRequest[]) => {
  const batches = chunk(requests, 3); // 每批3个请求
  const results = [];

  for (const batch of batches) {
    const batchResults = await Promise.all(
      batch.map(request => aiAPI.generate(request))
    );
    results.push(...batchResults);
    
    // 添加延迟避免 API 限制
    await delay(1000);
  }

  return results;
};
```

### Q8: 内存使用过高

**症状**：运行 AI Agent 时系统内存使用率很高或出现内存溢出

**可能原因**：
- 大量代码缓存
- 内存泄漏
- 并发请求过多

**解决步骤**：

1. **优化内存使用**
```typescript
// 限制并发请求数量
const semaphore = new Semaphore(3); // 最多3个并发请求

const generateWithLimit = async (prompt: string) => {
  await semaphore.acquire();
  try {
    return await aiAPI.generate(prompt);
  } finally {
    semaphore.release();
  }
};
```

2. **清理缓存**
```typescript
// 定期清理缓存
setInterval(() => {
  cache.cleanup();
  gc(); // 手动触发垃圾回收（如果可用）
}, 300000); // 每5分钟清理一次
```

3. **监控内存使用**
```typescript
// 内存使用监控
const monitorMemory = () => {
  const usage = process.memoryUsage();
  console.log('Memory Usage:', {
    rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(usage.external / 1024 / 1024)} MB`
  });
};

setInterval(monitorMemory, 30000); // 每30秒监控一次
```

## 集成相关问题

### Q9: IDE 插件无法工作

**症状**：VS Code 或其他 IDE 中的 AI Agent 插件无法正常工作

**可能原因**：
- 插件配置错误
- IDE 版本不兼容
- 权限问题

**解决步骤**：

1. **检查插件配置**
```json
// .vscode/settings.json
{
  "aiAgent.apiKey": "${env:OPENAI_API_KEY}",
  "aiAgent.model": "gpt-4",
  "aiAgent.promptsPath": "./src/lib/prompts",
  "aiAgent.templatesPath": "./templates",
  "aiAgent.autoSave": true,
  "aiAgent.formatOnGenerate": true
}
```

2. **验证插件版本**
```bash
# 检查 VS Code 版本
code --version

# 更新插件
code --install-extension ai-agent-extension@latest
```

3. **重置插件配置**
```bash
# 重置 VS Code 插件
rm -rf ~/.vscode/extensions/ai-agent-*
code --install-extension ai-agent-extension
```

### Q10: CLI 工具命令失败

**症状**：运行 AI Agent CLI 命令时出现错误或无响应

**可能原因**：
- 命令参数错误
- 权限不足
- 依赖缺失

**解决步骤**：

1. **检查命令语法**
```bash
# 正确的命令格式
npm run ai:component -- --name Button --type ui --props "variant,size"

# 查看帮助信息
npm run ai:help

# 查看可用命令
npm run ai:list
```

2. **验证权限**
```bash
# 检查文件权限
ls -la node_modules/.bin/ai-*

# 修复权限
chmod +x node_modules/.bin/ai-*
```

3. **重新安装 CLI 工具**
```bash
# 全局安装
npm install -g @ai-agent/cli

# 或本地安装
npm install --save-dev @ai-agent/cli
```

## 部署相关问题

### Q11: 生产环境配置问题

**症状**：在生产环境中 AI Agent 功能无法正常工作

**可能原因**：
- 环境变量配置错误
- API 密钥泄露
- 网络访问限制

**解决步骤**：

1. **安全配置环境变量**
```bash
# 使用安全的环境变量管理
export OPENAI_API_KEY="sk-..."
export AI_MODEL="gpt-4"
export NODE_ENV="production"

# 或使用密钥管理服务
export OPENAI_API_KEY=$(aws secretsmanager get-secret-value --secret-id openai-key --query SecretString --output text)
```

2. **配置网络访问**
```typescript
// 配置代理（如需要）
const aiAPI = new AIIntegrationAPI({
  apiKey: process.env.OPENAI_API_KEY,
  proxy: process.env.HTTP_PROXY,
  timeout: 30000
});
```

3. **实现错误处理**
```typescript
// 生产环境错误处理
const handleProductionError = (error: Error) => {
  // 记录错误日志
  logger.error('AI Agent Error:', error);
  
  // 发送告警
  alerting.send({
    level: 'error',
    message: error.message,
    context: { service: 'ai-agent' }
  });
  
  // 返回降级响应
  return {
    success: false,
    error: 'AI service temporarily unavailable',
    fallback: true
  };
};
```

## 调试和诊断工具

### 调试模式

```typescript
// 启用详细日志
const aiAPI = new AIIntegrationAPI({
  debug: true,
  logLevel: 'verbose',
  logFile: './logs/ai-debug.log'
});

// 使用调试中间件
aiAPI.use(debugMiddleware);
aiAPI.use(performanceMiddleware);
aiAPI.use(errorTrackingMiddleware);
```

### 诊断命令

```bash
# 系统诊断
npm run ai:doctor

# 性能分析
npm run ai:profile

# 连接测试
npm run ai:ping

# 配置验证
npm run ai:validate-config

# 清理缓存
npm run ai:clean-cache
```

### 日志分析

```typescript
// 日志分析工具
const analyzeLog = (logFile: string) => {
  const logs = fs.readFileSync(logFile, 'utf8').split('\n');
  
  const analysis = {
    totalRequests: 0,
    successRate: 0,
    averageResponseTime: 0,
    errorTypes: {},
    performanceIssues: []
  };

  logs.forEach(log => {
    if (log.includes('REQUEST')) analysis.totalRequests++;
    if (log.includes('ERROR')) {
      const errorType = extractErrorType(log);
      analysis.errorTypes[errorType] = (analysis.errorTypes[errorType] || 0) + 1;
    }
  });

  return analysis;
};
```

## 预防措施

### 1. 定期维护

```bash
# 每周执行的维护任务
#!/bin/bash

# 更新依赖
npm update

# 清理缓存
npm run ai:clean-cache

# 验证配置
npm run ai:validate

# 运行测试
npm test

# 生成报告
npm run ai:report
```

### 2. 监控告警

```typescript
// 设置监控告警
const setupMonitoring = () => {
  // API 响应时间监控
  setInterval(async () => {
    const startTime = Date.now();
    try {
      await aiAPI.ping();
      const responseTime = Date.now() - startTime;
      
      if (responseTime > 5000) {
        alerting.send({
          level: 'warning',
          message: `AI API response time: ${responseTime}ms`
        });
      }
    } catch (error) {
      alerting.send({
        level: 'error',
        message: 'AI API health check failed',
        error: error.message
      });
    }
  }, 60000); // 每分钟检查一次

  // 错误率监控
  const errorRate = calculateErrorRate();
  if (errorRate > 0.1) { // 错误率超过10%
    alerting.send({
      level: 'critical',
      message: `High error rate: ${errorRate * 100}%`
    });
  }
};
```

### 3. 备份和恢复

```typescript
// 配置备份
const backupConfig = () => {
  const config = {
    prompts: loadPrompts(),
    templates: loadTemplates(),
    settings: loadSettings()
  };

  fs.writeFileSync(
    `./backups/config-${Date.now()}.json`,
    JSON.stringify(config, null, 2)
  );
};

// 配置恢复
const restoreConfig = (backupFile: string) => {
  const config = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  
  savePrompts(config.prompts);
  saveTemplates(config.templates);
  saveSettings(config.settings);
};
```

## 获取帮助

### 社区资源

- **GitHub Issues**: 报告 bug 和功能请求
- **Discord 社区**: 实时讨论和帮助
- **文档网站**: 最新的文档和教程
- **示例仓库**: 代码示例和最佳实践

### 技术支持

- **邮件支持**: support@ai-agent.dev
- **在线文档**: https://docs.ai-agent.dev
- **视频教程**: https://tutorials.ai-agent.dev
- **API 文档**: https://api.ai-agent.dev

### 贡献指南

如果您发现了新的问题或有改进建议，欢迎：

1. 在 GitHub 上提交 Issue
2. 提交 Pull Request 改进文档
3. 分享您的解决方案和经验
4. 参与社区讨论和帮助他人

## 总结

本故障排除文档涵盖了使用 AI Agent 编码模板时可能遇到的主要问题和解决方案：

1. **配置问题**：API 密钥、提示词、模型配置
2. **生成问题**：代码质量、样式、类型错误
3. **性能问题**：生成速度、内存使用
4. **集成问题**：IDE 插件、CLI 工具
5. **部署问题**：生产环境配置
6. **调试工具**：日志分析、监控告警
7. **预防措施**：定期维护、备份恢复

通过遵循本文档的指导，您应该能够快速诊断和解决大部分常见问题。如果遇到文档中未涵盖的问题，请联系技术支持或社区寻求帮助。