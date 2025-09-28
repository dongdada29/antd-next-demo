/**
 * 提示词管理系统
 * 提供提示词的配置、加载、版本管理和上下文构建功能
 */

import { 
  SystemPrompt, 
  ComponentPrompt, 
  PagePrompt, 
  StylePrompt,
  ExtractedPattern 
} from './index';

export interface PromptConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  priority: number;
  tags: string[];
  lastUpdated: string;
  dependencies?: string[];
}

export interface PromptContext {
  task: 'component' | 'page' | 'styling' | 'optimization' | 'analysis';
  target: string;
  requirements: string[];
  constraints: string[];
  preferences: {
    complexity: 'simple' | 'medium' | 'complex';
    performance: 'standard' | 'optimized' | 'high-performance';
    accessibility: 'basic' | 'enhanced' | 'full-compliance';
    responsive: boolean;
    darkMode: boolean;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: PromptVariable[];
  examples: PromptExample[];
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  description: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    options?: string[];
  };
}

export interface PromptExample {
  title: string;
  description: string;
  input: Record<string, any>;
  output: string;
}

export interface PromptMetrics {
  usage: number;
  success: number;
  errors: number;
  averageResponseTime: number;
  lastUsed: string;
  feedback: {
    positive: number;
    negative: number;
    comments: string[];
  };
}

/**
 * 提示词管理器类
 */
export class PromptManager {
  private configs: Map<string, PromptConfig> = new Map();
  private templates: Map<string, PromptTemplate> = new Map();
  private metrics: Map<string, PromptMetrics> = new Map();
  private cache: Map<string, string> = new Map();

  constructor() {
    this.initializeDefaultConfigs();
    this.loadTemplates();
  }

  /**
   * 初始化默认配置
   */
  private initializeDefaultConfigs(): void {
    const defaultConfigs: PromptConfig[] = [
      {
        id: 'core-system',
        name: '核心系统提示词',
        version: '1.0.0',
        enabled: true,
        priority: 100,
        tags: ['system', 'core'],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'shadcn-system',
        name: 'shadcn/ui 系统提示词',
        version: '1.0.0',
        enabled: true,
        priority: 90,
        tags: ['system', 'shadcn', 'ui'],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'tailwind-system',
        name: 'Tailwind CSS 系统提示词',
        version: '1.0.0',
        enabled: true,
        priority: 85,
        tags: ['system', 'tailwind', 'css'],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'accessibility-system',
        name: '可访问性系统提示词',
        version: '1.0.0',
        enabled: true,
        priority: 80,
        tags: ['system', 'accessibility', 'a11y'],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'performance-system',
        name: '性能优化系统提示词',
        version: '1.0.0',
        enabled: true,
        priority: 75,
        tags: ['system', 'performance'],
        lastUpdated: new Date().toISOString(),
      },
    ];

    defaultConfigs.forEach(config => {
      this.configs.set(config.id, config);
      this.initializeMetrics(config.id);
    });
  }

  /**
   * 加载提示词模板
   */
  private loadTemplates(): void {
    const templates: PromptTemplate[] = [
      {
        id: 'component-generator',
        name: '组件生成模板',
        description: '生成 React 组件的通用模板',
        template: `生成一个 {{componentType}} 组件，要求：

## 组件规范
- 组件名称：{{componentName}}
- 基础组件：{{baseComponent}}
- 变体支持：{{variants}}
- 尺寸选项：{{sizes}}

## 功能要求
{{#each features}}
- {{this}}
{{/each}}

## 样式要求
- 使用 Tailwind CSS 实用类
- 支持 className 属性覆盖
- 实现 {{theme}} 主题支持
- 响应式设计：{{responsive}}

## 可访问性要求
- ARIA 标签：{{ariaLabels}}
- 键盘导航：{{keyboardNavigation}}
- 屏幕阅读器：{{screenReader}}

## 性能要求
- React.memo：{{useMemo}}
- 懒加载：{{lazyLoading}}
- 代码分割：{{codeSplitting}}

请提供完整的组件代码，包括 TypeScript 类型定义和使用示例。`,
        variables: [
          {
            name: 'componentType',
            type: 'string',
            required: true,
            description: '组件类型（如 Button、Input、Card）',
            validation: {
              pattern: '^[A-Z][a-zA-Z]*$'
            }
          },
          {
            name: 'componentName',
            type: 'string',
            required: true,
            description: '组件名称',
          },
          {
            name: 'baseComponent',
            type: 'string',
            required: false,
            defaultValue: 'div',
            description: '基础 HTML 元素或 shadcn/ui 组件',
          },
          {
            name: 'variants',
            type: 'array',
            required: false,
            defaultValue: ['default'],
            description: '组件变体列表',
          },
          {
            name: 'sizes',
            type: 'array',
            required: false,
            defaultValue: ['sm', 'md', 'lg'],
            description: '组件尺寸选项',
          },
          {
            name: 'features',
            type: 'array',
            required: true,
            description: '组件功能要求列表',
          },
          {
            name: 'theme',
            type: 'string',
            required: false,
            defaultValue: 'light/dark',
            description: '主题支持类型',
          },
          {
            name: 'responsive',
            type: 'boolean',
            required: false,
            defaultValue: true,
            description: '是否需要响应式设计',
          },
          {
            name: 'ariaLabels',
            type: 'boolean',
            required: false,
            defaultValue: true,
            description: '是否需要 ARIA 标签',
          },
          {
            name: 'keyboardNavigation',
            type: 'boolean',
            required: false,
            defaultValue: true,
            description: '是否需要键盘导航支持',
          },
          {
            name: 'screenReader',
            type: 'boolean',
            required: false,
            defaultValue: true,
            description: '是否需要屏幕阅读器支持',
          },
          {
            name: 'useMemo',
            type: 'boolean',
            required: false,
            defaultValue: false,
            description: '是否使用 React.memo',
          },
          {
            name: 'lazyLoading',
            type: 'boolean',
            required: false,
            defaultValue: false,
            description: '是否支持懒加载',
          },
          {
            name: 'codeSplitting',
            type: 'boolean',
            required: false,
            defaultValue: false,
            description: '是否需要代码分割',
          },
        ],
        examples: [
          {
            title: 'Button 组件生成',
            description: '生成一个标准的 Button 组件',
            input: {
              componentType: 'Button',
              componentName: 'CustomButton',
              baseComponent: 'shadcn/ui Button',
              variants: ['default', 'destructive', 'outline'],
              sizes: ['sm', 'md', 'lg'],
              features: ['点击事件处理', '加载状态', '禁用状态'],
              responsive: true,
              ariaLabels: true,
            },
            output: '// 生成的 Button 组件代码...'
          }
        ]
      },
      {
        id: 'page-generator',
        name: '页面生成模板',
        description: '生成 Next.js 页面的通用模板',
        template: `生成一个 {{pageType}} 页面，要求：

## 页面规范
- 页面名称：{{pageName}}
- 布局类型：{{layoutType}}
- 路由路径：{{routePath}}

## 组件需求
{{#each components}}
- {{this}}
{{/each}}

## 数据需求
- 数据获取：{{dataFetching}}
- 状态管理：{{stateManagement}}
- 缓存策略：{{caching}}

## 功能特性
{{#each features}}
- {{this}}
{{/each}}

## SEO 和元数据
- 页面标题：{{pageTitle}}
- 描述：{{pageDescription}}
- 关键词：{{keywords}}
- Open Graph：{{openGraph}}

## 性能要求
- 首屏加载：{{initialLoad}}
- 代码分割：{{codeSplitting}}
- 图片优化：{{imageOptimization}}

请提供完整的页面代码，包括布局、组件组合和数据处理。`,
        variables: [
          {
            name: 'pageType',
            type: 'string',
            required: true,
            description: '页面类型（如 Dashboard、Form、List）',
          },
          {
            name: 'pageName',
            type: 'string',
            required: true,
            description: '页面名称',
          },
          {
            name: 'layoutType',
            type: 'string',
            required: false,
            defaultValue: 'default',
            description: '布局类型',
            validation: {
              options: ['default', 'centered', 'sidebar', 'full-width']
            }
          },
          {
            name: 'routePath',
            type: 'string',
            required: true,
            description: '页面路由路径',
          },
          {
            name: 'components',
            type: 'array',
            required: true,
            description: '页面所需组件列表',
          },
          {
            name: 'dataFetching',
            type: 'string',
            required: false,
            defaultValue: 'Server Components',
            description: '数据获取方式',
            validation: {
              options: ['Server Components', 'Client Side', 'Static', 'ISR']
            }
          },
          {
            name: 'stateManagement',
            type: 'string',
            required: false,
            defaultValue: 'useState',
            description: '状态管理方案',
            validation: {
              options: ['useState', 'useReducer', 'Context', 'Zustand', 'Redux']
            }
          },
          {
            name: 'caching',
            type: 'string',
            required: false,
            defaultValue: 'SWR',
            description: '缓存策略',
            validation: {
              options: ['SWR', 'React Query', 'None']
            }
          },
          {
            name: 'features',
            type: 'array',
            required: true,
            description: '页面功能特性列表',
          },
          {
            name: 'pageTitle',
            type: 'string',
            required: true,
            description: '页面标题',
          },
          {
            name: 'pageDescription',
            type: 'string',
            required: true,
            description: '页面描述',
          },
          {
            name: 'keywords',
            type: 'array',
            required: false,
            defaultValue: [],
            description: 'SEO 关键词',
          },
          {
            name: 'openGraph',
            type: 'boolean',
            required: false,
            defaultValue: true,
            description: '是否生成 Open Graph 标签',
          },
          {
            name: 'initialLoad',
            type: 'string',
            required: false,
            defaultValue: '< 2s',
            description: '首屏加载时间要求',
          },
          {
            name: 'codeSplitting',
            type: 'boolean',
            required: false,
            defaultValue: true,
            description: '是否启用代码分割',
          },
          {
            name: 'imageOptimization',
            type: 'boolean',
            required: false,
            defaultValue: true,
            description: '是否启用图片优化',
          },
        ],
        examples: [
          {
            title: '用户仪表板页面',
            description: '生成一个用户仪表板页面',
            input: {
              pageType: 'Dashboard',
              pageName: 'UserDashboard',
              layoutType: 'sidebar',
              routePath: '/dashboard',
              components: ['StatsCard', 'Chart', 'RecentActivity', 'QuickActions'],
              features: ['数据可视化', '实时更新', '个性化设置'],
              pageTitle: '用户仪表板',
              pageDescription: '查看您的账户概览和最新活动',
            },
            output: '// 生成的仪表板页面代码...'
          }
        ]
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * 初始化指标
   */
  private initializeMetrics(promptId: string): void {
    this.metrics.set(promptId, {
      usage: 0,
      success: 0,
      errors: 0,
      averageResponseTime: 0,
      lastUsed: '',
      feedback: {
        positive: 0,
        negative: 0,
        comments: [],
      },
    });
  }

  /**
   * 获取提示词配置
   */
  getConfig(promptId: string): PromptConfig | undefined {
    return this.configs.get(promptId);
  }

  /**
   * 更新提示词配置
   */
  updateConfig(promptId: string, updates: Partial<PromptConfig>): void {
    const config = this.configs.get(promptId);
    if (config) {
      this.configs.set(promptId, {
        ...config,
        ...updates,
        lastUpdated: new Date().toISOString(),
      });
      this.clearCache();
    }
  }

  /**
   * 启用/禁用提示词
   */
  togglePrompt(promptId: string, enabled: boolean): void {
    this.updateConfig(promptId, { enabled });
  }

  /**
   * 获取启用的提示词列表
   */
  getEnabledPrompts(): PromptConfig[] {
    return Array.from(this.configs.values())
      .filter(config => config.enabled)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * 根据标签获取提示词
   */
  getPromptsByTags(tags: string[]): PromptConfig[] {
    return Array.from(this.configs.values())
      .filter(config => 
        config.enabled && 
        tags.some(tag => config.tags.includes(tag))
      )
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * 构建提示词上下文
   */
  buildContext(context: PromptContext): string {
    const cacheKey = this.generateCacheKey(context);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const parts: string[] = [];

    // 添加系统提示词
    const systemPrompts = this.getPromptsByTags(['system']);
    systemPrompts.forEach(config => {
      const prompt = this.getPromptContent(config.id);
      if (prompt) {
        parts.push(prompt);
      }
    });

    // 根据任务类型添加特定提示词
    switch (context.task) {
      case 'component':
        const componentPrompts = this.getPromptsByTags(['component', 'ui']);
        componentPrompts.forEach(config => {
          const prompt = this.getPromptContent(config.id);
          if (prompt) {
            parts.push(prompt);
          }
        });
        break;

      case 'page':
        const pagePrompts = this.getPromptsByTags(['page', 'layout']);
        pagePrompts.forEach(config => {
          const prompt = this.getPromptContent(config.id);
          if (prompt) {
            parts.push(prompt);
          }
        });
        break;

      case 'styling':
        const stylePrompts = this.getPromptsByTags(['styling', 'css']);
        stylePrompts.forEach(config => {
          const prompt = this.getPromptContent(config.id);
          if (prompt) {
            parts.push(prompt);
          }
        });
        break;

      case 'optimization':
        const perfPrompts = this.getPromptsByTags(['performance', 'optimization']);
        perfPrompts.forEach(config => {
          const prompt = this.getPromptContent(config.id);
          if (prompt) {
            parts.push(prompt);
          }
        });
        break;
    }

    // 根据偏好添加额外提示词
    if (context.preferences.accessibility !== 'basic') {
      const a11yPrompts = this.getPromptsByTags(['accessibility']);
      a11yPrompts.forEach(config => {
        const prompt = this.getPromptContent(config.id);
        if (prompt) {
          parts.push(prompt);
        }
      });
    }

    if (context.preferences.performance !== 'standard') {
      const perfPrompts = this.getPromptsByTags(['performance']);
      perfPrompts.forEach(config => {
        const prompt = this.getPromptContent(config.id);
        if (prompt) {
          parts.push(prompt);
        }
      });
    }

    // 添加上下文特定信息
    parts.push(this.buildContextualPrompt(context));

    const result = parts.join('\n\n---\n\n');
    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * 生成模板化提示词
   */
  generateFromTemplate(templateId: string, variables: Record<string, any>): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // 验证必需变量
    const missingRequired = template.variables
      .filter(v => v.required && !(v.name in variables))
      .map(v => v.name);

    if (missingRequired.length > 0) {
      throw new Error(`Missing required variables: ${missingRequired.join(', ')}`);
    }

    // 应用默认值
    const processedVariables = { ...variables };
    template.variables.forEach(variable => {
      if (!(variable.name in processedVariables) && variable.defaultValue !== undefined) {
        processedVariables[variable.name] = variable.defaultValue;
      }
    });

    // 验证变量值
    this.validateVariables(template.variables, processedVariables);

    // 渲染模板
    return this.renderTemplate(template.template, processedVariables);
  }

  /**
   * 获取模板列表
   */
  getTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * 获取模板
   */
  getTemplate(templateId: string): PromptTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * 记录使用指标
   */
  recordUsage(promptId: string, success: boolean, responseTime: number): void {
    const metrics = this.metrics.get(promptId);
    if (metrics) {
      metrics.usage++;
      if (success) {
        metrics.success++;
      } else {
        metrics.errors++;
      }
      
      // 更新平均响应时间
      metrics.averageResponseTime = 
        (metrics.averageResponseTime * (metrics.usage - 1) + responseTime) / metrics.usage;
      
      metrics.lastUsed = new Date().toISOString();
      this.metrics.set(promptId, metrics);
    }
  }

  /**
   * 记录反馈
   */
  recordFeedback(promptId: string, positive: boolean, comment?: string): void {
    const metrics = this.metrics.get(promptId);
    if (metrics) {
      if (positive) {
        metrics.feedback.positive++;
      } else {
        metrics.feedback.negative++;
      }
      
      if (comment) {
        metrics.feedback.comments.push(comment);
      }
      
      this.metrics.set(promptId, metrics);
    }
  }

  /**
   * 获取使用指标
   */
  getMetrics(promptId: string): PromptMetrics | undefined {
    return this.metrics.get(promptId);
  }

  /**
   * 获取所有指标
   */
  getAllMetrics(): Map<string, PromptMetrics> {
    return new Map(this.metrics);
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 导出配置
   */
  exportConfig(): {
    configs: PromptConfig[];
    templates: PromptTemplate[];
    metrics: Record<string, PromptMetrics>;
  } {
    return {
      configs: Array.from(this.configs.values()),
      templates: Array.from(this.templates.values()),
      metrics: Object.fromEntries(this.metrics),
    };
  }

  /**
   * 导入配置
   */
  importConfig(data: {
    configs?: PromptConfig[];
    templates?: PromptTemplate[];
    metrics?: Record<string, PromptMetrics>;
  }): void {
    if (data.configs) {
      data.configs.forEach(config => {
        this.configs.set(config.id, config);
      });
    }

    if (data.templates) {
      data.templates.forEach(template => {
        this.templates.set(template.id, template);
      });
    }

    if (data.metrics) {
      Object.entries(data.metrics).forEach(([id, metrics]) => {
        this.metrics.set(id, metrics);
      });
    }

    this.clearCache();
  }

  // 私有辅助方法

  private getPromptContent(promptId: string): string | null {
    // 这里应该从实际的提示词库中获取内容
    // 为了演示，返回一个占位符
    return `[Prompt content for ${promptId}]`;
  }

  private generateCacheKey(context: PromptContext): string {
    return JSON.stringify(context);
  }

  private buildContextualPrompt(context: PromptContext): string {
    const parts: string[] = [];

    parts.push(`## 任务上下文`);
    parts.push(`任务类型：${context.task}`);
    parts.push(`目标：${context.target}`);

    if (context.requirements.length > 0) {
      parts.push(`\n## 需求`);
      context.requirements.forEach(req => {
        parts.push(`- ${req}`);
      });
    }

    if (context.constraints.length > 0) {
      parts.push(`\n## 约束条件`);
      context.constraints.forEach(constraint => {
        parts.push(`- ${constraint}`);
      });
    }

    parts.push(`\n## 偏好设置`);
    parts.push(`复杂度：${context.preferences.complexity}`);
    parts.push(`性能要求：${context.preferences.performance}`);
    parts.push(`可访问性：${context.preferences.accessibility}`);
    parts.push(`响应式设计：${context.preferences.responsive ? '是' : '否'}`);
    parts.push(`暗色模式：${context.preferences.darkMode ? '是' : '否'}`);

    return parts.join('\n');
  }

  private validateVariables(
    definitions: PromptVariable[], 
    values: Record<string, any>
  ): void {
    definitions.forEach(def => {
      const value = values[def.name];
      if (value === undefined) return;

      // 类型验证
      if (def.type === 'string' && typeof value !== 'string') {
        throw new Error(`Variable ${def.name} must be a string`);
      }
      if (def.type === 'number' && typeof value !== 'number') {
        throw new Error(`Variable ${def.name} must be a number`);
      }
      if (def.type === 'boolean' && typeof value !== 'boolean') {
        throw new Error(`Variable ${def.name} must be a boolean`);
      }
      if (def.type === 'array' && !Array.isArray(value)) {
        throw new Error(`Variable ${def.name} must be an array`);
      }

      // 验证规则
      if (def.validation) {
        if (def.validation.pattern && typeof value === 'string') {
          const regex = new RegExp(def.validation.pattern);
          if (!regex.test(value)) {
            throw new Error(`Variable ${def.name} does not match pattern ${def.validation.pattern}`);
          }
        }

        if (def.validation.min !== undefined && typeof value === 'number') {
          if (value < def.validation.min) {
            throw new Error(`Variable ${def.name} must be >= ${def.validation.min}`);
          }
        }

        if (def.validation.max !== undefined && typeof value === 'number') {
          if (value > def.validation.max) {
            throw new Error(`Variable ${def.name} must be <= ${def.validation.max}`);
          }
        }

        if (def.validation.options && !def.validation.options.includes(value)) {
          throw new Error(`Variable ${def.name} must be one of: ${def.validation.options.join(', ')}`);
        }
      }
    });
  }

  private renderTemplate(template: string, variables: Record<string, any>): string {
    let result = template;

    // 简单的模板渲染（实际项目中可能需要更复杂的模板引擎）
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const arrayPlaceholder = `{{#each ${key}}}`;
      
      if (result.includes(arrayPlaceholder) && Array.isArray(value)) {
        // 处理数组循环
        const startIndex = result.indexOf(arrayPlaceholder);
        const endIndex = result.indexOf(`{{/each}}`, startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          const loopContent = result.substring(
            startIndex + arrayPlaceholder.length,
            endIndex
          );
          const renderedItems = value.map(item => 
            loopContent.replace(/{{this}}/g, String(item))
          ).join('');
          
          result = result.substring(0, startIndex) + 
                   renderedItems + 
                   result.substring(endIndex + 9); // 9 = "{{/each}}".length
        }
      } else {
        // 处理简单替换
        result = result.replace(new RegExp(placeholder, 'g'), String(value));
      }
    });

    return result;
  }
}

/**
 * 默认提示词管理器实例
 */
export const promptManager = new PromptManager();