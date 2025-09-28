/**
 * 提示词上下文构建器
 * 动态构建和管理 AI 提示词上下文
 */

import { 
  PromptManager, 
  PromptContext, 
  promptManager 
} from './prompt-manager';
import { 
  getAllSystemPrompts,
  getAllComponentPrompts,
  getAllPagePrompts,
  getAllStylePrompts,
  getProjectV0Specifications,
  validateV0Compliance
} from './index';

export interface ContextBuilderOptions {
  includeSystemPrompts?: boolean;
  includeV0Specifications?: boolean;
  componentTypes?: string[];
  pageTypes?: string[];
  styleCategories?: ('styling' | 'interaction' | 'performance' | 'accessibility')[];
  customPrompts?: string[];
  maxTokens?: number;
  priority?: 'quality' | 'performance' | 'balanced';
}

export interface BuiltContext {
  prompt: string;
  metadata: {
    tokenCount: number;
    promptSources: string[];
    buildTime: number;
    cacheKey: string;
  };
  validation: {
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  };
}

/**
 * 提示词上下文构建器类
 */
export class ContextBuilder {
  private manager: PromptManager;
  private cache: Map<string, BuiltContext> = new Map();
  private maxCacheSize = 100;

  constructor(manager?: PromptManager) {
    this.manager = manager || promptManager;
  }

  /**
   * 构建完整的提示词上下文
   */
  async buildContext(
    context: PromptContext,
    options: ContextBuilderOptions = {}
  ): Promise<BuiltContext> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(context, options);

    // 检查缓存
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const parts: string[] = [];
    const sources: string[] = [];

    try {
      // 1. 添加系统提示词
      if (options.includeSystemPrompts !== false) {
        const systemPrompts = this.buildSystemPrompts(context, options);
        if (systemPrompts) {
          parts.push(systemPrompts);
          sources.push('system-prompts');
        }
      }

      // 2. 添加 V0 规范
      if (options.includeV0Specifications !== false) {
        const v0Specs = this.buildV0Specifications(context);
        if (v0Specs) {
          parts.push(v0Specs);
          sources.push('v0-specifications');
        }
      }

      // 3. 添加组件特定提示词
      if (options.componentTypes && options.componentTypes.length > 0) {
        const componentPrompts = this.buildComponentPrompts(options.componentTypes);
        if (componentPrompts) {
          parts.push(componentPrompts);
          sources.push('component-prompts');
        }
      }

      // 4. 添加页面特定提示词
      if (options.pageTypes && options.pageTypes.length > 0) {
        const pagePrompts = this.buildPagePrompts(options.pageTypes);
        if (pagePrompts) {
          parts.push(pagePrompts);
          sources.push('page-prompts');
        }
      }

      // 5. 添加样式提示词
      if (options.styleCategories && options.styleCategories.length > 0) {
        const stylePrompts = this.buildStylePrompts(options.styleCategories, context);
        if (stylePrompts) {
          parts.push(stylePrompts);
          sources.push('style-prompts');
        }
      }

      // 6. 添加上下文特定信息
      const contextualPrompt = this.buildContextualPrompt(context);
      if (contextualPrompt) {
        parts.push(contextualPrompt);
        sources.push('contextual');
      }

      // 7. 添加自定义提示词
      if (options.customPrompts && options.customPrompts.length > 0) {
        parts.push(...options.customPrompts);
        sources.push('custom');
      }

      // 8. 组合和优化
      let finalPrompt = parts.join('\n\n---\n\n');

      // 9. Token 限制处理
      if (options.maxTokens) {
        finalPrompt = this.truncateToTokenLimit(finalPrompt, options.maxTokens);
      }

      // 10. 验证和优化
      const validation = this.validatePrompt(finalPrompt, context);

      const result: BuiltContext = {
        prompt: finalPrompt,
        metadata: {
          tokenCount: this.estimateTokenCount(finalPrompt),
          promptSources: sources,
          buildTime: Date.now() - startTime,
          cacheKey,
        },
        validation,
      };

      // 缓存结果
      this.cacheResult(cacheKey, result);

      return result;
    } catch (error) {
      throw new Error(`Failed to build context: ${error.message}`);
    }
  }

  /**
   * 构建快速上下文（用于简单任务）
   */
  buildQuickContext(
    task: 'component' | 'page' | 'styling' | 'fix',
    target: string,
    requirements: string[] = []
  ): string {
    const context: PromptContext = {
      task: task as any,
      target,
      requirements,
      constraints: [],
      preferences: {
        complexity: 'simple',
        performance: 'standard',
        accessibility: 'basic',
        responsive: true,
        darkMode: false,
      },
    };

    const options: ContextBuilderOptions = {
      includeSystemPrompts: true,
      includeV0Specifications: false,
      maxTokens: 2000,
      priority: 'performance',
    };

    // 根据任务类型添加特定提示词
    switch (task) {
      case 'component':
        options.componentTypes = [target];
        options.styleCategories = ['styling'];
        break;
      case 'page':
        options.pageTypes = [target];
        options.styleCategories = ['styling', 'interaction'];
        break;
      case 'styling':
        options.styleCategories = ['styling'];
        break;
    }

    // 同步构建（简化版本）
    return this.buildSyncContext(context, options);
  }

  /**
   * 构建专家级上下文（用于复杂任务）
   */
  async buildExpertContext(
    context: PromptContext,
    expertise: ('architecture' | 'performance' | 'accessibility' | 'security')[] = []
  ): Promise<BuiltContext> {
    const options: ContextBuilderOptions = {
      includeSystemPrompts: true,
      includeV0Specifications: true,
      styleCategories: ['styling', 'interaction', 'performance', 'accessibility'],
      priority: 'quality',
    };

    // 根据专业领域添加特定提示词
    if (expertise.includes('performance')) {
      options.styleCategories = ['performance', ...(options.styleCategories || [])];
    }

    if (expertise.includes('accessibility')) {
      options.styleCategories = ['accessibility', ...(options.styleCategories || [])];
    }

    // 设置复杂度偏好
    context.preferences.complexity = 'complex';
    context.preferences.performance = 'high-performance';
    context.preferences.accessibility = 'full-compliance';

    return this.buildContext(context, options);
  }

  /**
   * 构建调试上下文（用于代码修复）
   */
  buildDebugContext(
    code: string,
    error: string,
    context?: Partial<PromptContext>
  ): string {
    const parts: string[] = [];

    // 添加核心系统提示词
    parts.push(this.getCoreSystemPrompt());

    // 添加调试特定指导
    parts.push(`## 代码调试任务

### 问题代码
\`\`\`typescript
${code}
\`\`\`

### 错误信息
${error}

### 调试要求
1. 分析错误原因和根本问题
2. 提供修复方案和改进建议
3. 确保修复后的代码符合最佳实践
4. 解释修改的原因和影响

### 代码质量标准
- 遵循 TypeScript 严格模式
- 使用 shadcn/ui + Tailwind CSS 规范
- 实现适当的错误处理
- 保持代码的可读性和可维护性`);

    // 添加上下文信息
    if (context) {
      const contextualPrompt = this.buildContextualPrompt({
        task: 'optimization',
        target: 'debug',
        requirements: [],
        constraints: [],
        preferences: {
          complexity: 'medium',
          performance: 'standard',
          accessibility: 'basic',
          responsive: true,
          darkMode: false,
        },
        ...context,
      });
      parts.push(contextualPrompt);
    }

    return parts.join('\n\n---\n\n');
  }

  /**
   * 验证和优化提示词
   */
  validateAndOptimize(prompt: string): {
    optimized: string;
    changes: string[];
    warnings: string[];
  } {
    const changes: string[] = [];
    const warnings: string[] = [];
    let optimized = prompt;

    // 1. 检查重复内容
    const duplicates = this.findDuplicateContent(prompt);
    if (duplicates.length > 0) {
      warnings.push(`发现重复内容: ${duplicates.join(', ')}`);
    }

    // 2. 优化结构
    if (!prompt.includes('##')) {
      warnings.push('缺少清晰的章节结构');
    }

    // 3. 检查长度
    const tokenCount = this.estimateTokenCount(prompt);
    if (tokenCount > 4000) {
      warnings.push(`提示词过长 (${tokenCount} tokens)，可能影响性能`);
    }

    // 4. 检查关键词
    const requiredKeywords = ['shadcn/ui', 'Tailwind CSS', 'TypeScript'];
    const missingKeywords = requiredKeywords.filter(keyword => 
      !prompt.toLowerCase().includes(keyword.toLowerCase())
    );
    if (missingKeywords.length > 0) {
      warnings.push(`缺少关键技术栈提及: ${missingKeywords.join(', ')}`);
    }

    return {
      optimized,
      changes,
      warnings,
    };
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
  } {
    // 简化的统计信息
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: 0.85, // 示例值
    };
  }

  // 私有方法

  private buildSystemPrompts(context: PromptContext, options: ContextBuilderOptions): string {
    const systemPrompts = getAllSystemPrompts();
    const relevantPrompts = systemPrompts.filter(prompt => {
      // 根据上下文和选项筛选相关的系统提示词
      if (context.task === 'component' && prompt.tags.includes('component')) return true;
      if (context.task === 'page' && prompt.tags.includes('page')) return true;
      if (context.task === 'styling' && prompt.tags.includes('styling')) return true;
      if (prompt.tags.includes('core')) return true;
      return false;
    });

    return relevantPrompts.map(prompt => prompt.prompt).join('\n\n');
  }

  private buildV0Specifications(context: PromptContext): string {
    const specs = getProjectV0Specifications();
    const parts: string[] = [];

    parts.push('## V0 开发规范');
    
    // 添加核心原则
    parts.push('### 核心原则');
    Object.entries(specs.principles).forEach(([key, value]) => {
      if (value) {
        parts.push(`- ${key}: 启用`);
      }
    });

    // 根据任务类型添加相关模式
    if (context.task === 'component') {
      parts.push('### 组件模式');
      specs.componentPatterns.slice(0, 2).forEach(pattern => {
        parts.push(`#### ${pattern.name}`);
        parts.push(pattern.description);
        parts.push('```typescript');
        parts.push(pattern.template);
        parts.push('```');
      });
    }

    return parts.join('\n\n');
  }

  private buildComponentPrompts(componentTypes: string[]): string {
    const componentPrompts = getAllComponentPrompts();
    const relevantPrompts = componentPrompts.filter(prompt =>
      componentTypes.some(type => 
        prompt.id.includes(type.toLowerCase()) || 
        prompt.name.toLowerCase().includes(type.toLowerCase())
      )
    );

    return relevantPrompts.map(prompt => prompt.prompt).join('\n\n');
  }

  private buildPagePrompts(pageTypes: string[]): string {
    const pagePrompts = getAllPagePrompts();
    const relevantPrompts = pagePrompts.filter(prompt =>
      pageTypes.some(type => 
        prompt.id.includes(type.toLowerCase()) || 
        prompt.name.toLowerCase().includes(type.toLowerCase())
      )
    );

    return relevantPrompts.map(prompt => prompt.prompt).join('\n\n');
  }

  private buildStylePrompts(
    categories: ('styling' | 'interaction' | 'performance' | 'accessibility')[],
    context: PromptContext
  ): string {
    const stylePrompts = getAllStylePrompts();
    const relevantPrompts = stylePrompts.filter(prompt =>
      categories.includes(prompt.category)
    );

    // 根据上下文偏好筛选
    const filteredPrompts = relevantPrompts.filter(prompt => {
      if (prompt.category === 'performance' && context.preferences.performance === 'standard') {
        return false;
      }
      if (prompt.category === 'accessibility' && context.preferences.accessibility === 'basic') {
        return false;
      }
      return true;
    });

    return filteredPrompts.map(prompt => prompt.prompt).join('\n\n');
  }

  private buildContextualPrompt(context: PromptContext): string {
    const parts: string[] = [];

    parts.push('## 任务上下文');
    parts.push(`**任务类型**: ${context.task}`);
    parts.push(`**目标**: ${context.target}`);

    if (context.requirements.length > 0) {
      parts.push('\n### 功能需求');
      context.requirements.forEach((req, index) => {
        parts.push(`${index + 1}. ${req}`);
      });
    }

    if (context.constraints.length > 0) {
      parts.push('\n### 约束条件');
      context.constraints.forEach((constraint, index) => {
        parts.push(`${index + 1}. ${constraint}`);
      });
    }

    parts.push('\n### 偏好设置');
    parts.push(`- **复杂度**: ${context.preferences.complexity}`);
    parts.push(`- **性能要求**: ${context.preferences.performance}`);
    parts.push(`- **可访问性**: ${context.preferences.accessibility}`);
    parts.push(`- **响应式设计**: ${context.preferences.responsive ? '是' : '否'}`);
    parts.push(`- **暗色模式**: ${context.preferences.darkMode ? '是' : '否'}`);

    return parts.join('\n');
  }

  private buildSyncContext(context: PromptContext, options: ContextBuilderOptions): string {
    // 简化的同步版本，用于快速构建
    const parts: string[] = [];

    if (options.includeSystemPrompts) {
      parts.push(this.getCoreSystemPrompt());
    }

    parts.push(this.buildContextualPrompt(context));

    return parts.join('\n\n---\n\n');
  }

  private getCoreSystemPrompt(): string {
    return `你是一个专业的 React + Next.js + TypeScript 开发专家，使用 shadcn/ui + Tailwind CSS 技术栈。

## 核心原则
1. 优先使用 shadcn/ui 组件作为基础构建块
2. 使用 Tailwind CSS 实用类进行样式设计
3. 确保完整的 TypeScript 类型定义和类型安全
4. 实现 WCAG 2.1 AA 级可访问性标准
5. 应用 React 性能优化最佳实践

## 代码要求
- 使用 class-variance-authority 管理组件变体
- 实现 forwardRef 支持 ref 传递
- 提供 className 覆盖支持
- 使用语义化的 HTML 结构
- 添加适当的 ARIA 标签和属性`;
  }

  private generateCacheKey(context: PromptContext, options: ContextBuilderOptions): string {
    return JSON.stringify({ context, options });
  }

  private cacheResult(key: string, result: BuiltContext): void {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, result);
  }

  private estimateTokenCount(text: string): number {
    // 简单的 token 估算（实际应该使用更精确的方法）
    return Math.ceil(text.length / 4);
  }

  private truncateToTokenLimit(text: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokenCount(text);
    if (estimatedTokens <= maxTokens) {
      return text;
    }

    // 简单的截断策略
    const ratio = maxTokens / estimatedTokens;
    const targetLength = Math.floor(text.length * ratio * 0.9); // 留一些余量
    return text.substring(0, targetLength) + '\n\n[内容已截断以符合 token 限制]';
  }

  private validatePrompt(prompt: string, context: PromptContext): {
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 基本验证
    if (prompt.length < 100) {
      warnings.push('提示词过短，可能缺少必要信息');
    }

    if (!prompt.includes('TypeScript')) {
      suggestions.push('建议明确提及 TypeScript 要求');
    }

    if (!prompt.includes('shadcn/ui')) {
      suggestions.push('建议明确提及 shadcn/ui 组件库');
    }

    if (context.preferences.accessibility !== 'basic' && !prompt.includes('可访问性')) {
      suggestions.push('建议添加可访问性相关指导');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      suggestions,
    };
  }

  private findDuplicateContent(text: string): string[] {
    // 简单的重复内容检测
    const lines = text.split('\n');
    const seen = new Set<string>();
    const duplicates: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 10 && seen.has(trimmed)) {
        duplicates.push(trimmed.substring(0, 50) + '...');
      }
      seen.add(trimmed);
    });

    return [...new Set(duplicates)];
  }
}

/**
 * 默认上下文构建器实例
 */
export const contextBuilder = new ContextBuilder();