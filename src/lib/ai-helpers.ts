/**
 * AI Agent 辅助工具库
 * 为 AI 代码生成提供工具函数和配置
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 组件配置接口
 */
export interface ComponentConfig {
  name: string;
  type: 'ui' | 'layout' | 'form' | 'data' | 'utility';
  description: string;
  props: ComponentProp[];
  variants?: ComponentVariant[];
  examples: CodeExample[];
  dependencies: string[];
  accessibility: AccessibilityFeature[];
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: any;
  examples: any[];
}

export interface ComponentVariant {
  name: string;
  values: string[];
  defaultValue: string;
  description: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  preview?: string;
}

export interface AccessibilityFeature {
  type: 'aria' | 'keyboard' | 'semantic' | 'visual';
  description: string;
  implementation: string;
}

/**
 * AI 提示词配置
 */
export interface AIPromptConfig {
  system: string;
  component: {
    [key: string]: string;
  };
  style: {
    [key: string]: string;
  };
  quality: {
    [key: string]: string;
  };
}

/**
 * 代码模板接口
 */
export interface CodeTemplate {
  id: string;
  name: string;
  category: 'component' | 'page' | 'hook' | 'utility';
  template: string;
  variables: TemplateVariable[];
  metadata: TemplateMetadata;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'boolean' | 'array' | 'object';
  description: string;
  defaultValue?: any;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface TemplateMetadata {
  description: string;
  tags: string[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedLines: number;
  dependencies: string[];
}

/**
 * AI 上下文管理器
 */
export class AIContextManager {
  private prompts: AIPromptConfig;
  private templates: Map<string, CodeTemplate>;
  private components: Map<string, ComponentConfig>;

  constructor() {
    this.prompts = this.loadPrompts();
    this.templates = new Map();
    this.components = new Map();
  }

  /**
   * 加载内置提示词
   */
  private loadPrompts(): AIPromptConfig {
    return {
      system: `你是一个专业的 React + Next.js + TypeScript 开发专家，使用 shadcn/ui + Tailwind CSS 技术栈。

核心原则：
1. 优先使用 shadcn/ui 组件
2. 使用 Tailwind CSS 进行样式设计
3. 确保 TypeScript 类型安全
4. 实现可访问性标准
5. 考虑性能优化`,

      component: {
        ui: '创建基础 UI 组件，使用 forwardRef、displayName 和 cva 变体系统',
        form: '创建表单组件，使用 React Hook Form + Zod 验证',
        table: '创建数据表格，使用 TanStack Table + shadcn/ui Table',
        layout: '创建布局组件，实现响应式设计和可访问性',
      },

      style: {
        tailwind: '使用 Tailwind CSS 实用类，避免自定义 CSS',
        responsive: '实现移动优先的响应式设计',
        darkMode: '支持暗色模式切换',
        accessibility: '确保可访问性标准符合 WCAG 2.1 AA',
      },

      quality: {
        typescript: '提供完整的 TypeScript 类型定义',
        testing: '编写全面的组件测试',
        performance: '实现性能优化和懒加载',
        documentation: '提供清晰的文档和使用示例',
      },
    };
  }

  /**
   * 获取系统提示词
   */
  getSystemPrompt(): string {
    return this.prompts.system;
  }

  /**
   * 获取组件生成提示词
   */
  getComponentPrompt(type: keyof AIPromptConfig['component']): string {
    return this.prompts.component[type] || this.prompts.component.ui;
  }

  /**
   * 获取样式提示词
   */
  getStylePrompt(type: keyof AIPromptConfig['style']): string {
    return this.prompts.style[type] || this.prompts.style.tailwind;
  }

  /**
   * 构建完整提示词
   */
  buildFullPrompt(
    userRequest: string,
    componentType?: string,
    styleRequirements?: string[]
  ): string {
    const systemPrompt = this.getSystemPrompt();
    const componentPrompt = componentType 
      ? this.getComponentPrompt(componentType as any)
      : '';
    const stylePrompts = styleRequirements?.map(req => 
      this.getStylePrompt(req as any)
    ).join('\n') || '';

    return `${systemPrompt}

${componentPrompt}

${stylePrompts}

用户需求：${userRequest}

请生成符合上述要求的完整代码。`;
  }

  /**
   * 注册组件配置
   */
  registerComponent(config: ComponentConfig): void {
    this.components.set(config.name, config);
  }

  /**
   * 获取组件配置
   */
  getComponent(name: string): ComponentConfig | undefined {
    return this.components.get(name);
  }

  /**
   * 注册代码模板
   */
  registerTemplate(template: CodeTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * 获取代码模板
   */
  getTemplate(id: string): CodeTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * 获取模板列表
   */
  getTemplatesByCategory(category: CodeTemplate['category']): CodeTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.category === category);
  }
}

/**
 * 代码生成器
 */
export class CodeGenerator {
  private contextManager: AIContextManager;

  constructor(contextManager: AIContextManager) {
    this.contextManager = contextManager;
  }

  /**
   * 生成组件代码
   */
  generateComponent(config: {
    name: string;
    type: string;
    props?: ComponentProp[];
    variants?: ComponentVariant[];
    template?: string;
  }): string {
    const { name, type, props = [], variants = [], template } = config;

    if (template) {
      return this.processTemplate(template, { name, type, props, variants });
    }

    return this.generateDefaultComponent(name, type, props, variants);
  }

  /**
   * 处理模板变量替换
   */
  private processTemplate(
    template: string,
    variables: Record<string, any>
  ): string {
    let result = template;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(placeholder, String(value));
    });

    return result;
  }

  /**
   * 生成默认组件
   */
  private generateDefaultComponent(
    name: string,
    type: string,
    props: ComponentProp[],
    variants: ComponentVariant[]
  ): string {
    const componentName = this.toPascalCase(name);
    const propsInterface = this.generatePropsInterface(componentName, props);
    const variantsConfig = this.generateVariantsConfig(variants);

    return `'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

${variantsConfig}

${propsInterface}

const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      />
    );
  }
);
${componentName}.displayName = '${componentName}';

export { ${componentName} };
export type { ${componentName}Props };`;
  }

  /**
   * 生成属性接口
   */
  private generatePropsInterface(
    componentName: string,
    props: ComponentProp[]
  ): string {
    const propsLines = props.map(prop => {
      const optional = prop.required ? '' : '?';
      return `  ${prop.name}${optional}: ${prop.type};`;
    }).join('\n');

    return `interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {
${propsLines}
}`;
  }

  /**
   * 生成变体配置
   */
  private generateVariantsConfig(variants: ComponentVariant[]): string {
    if (variants.length === 0) return '';

    const variantConfig = variants.map(variant => {
      const values = variant.values.map(value => `${value}: ''`).join(',\n        ');
      return `      ${variant.name}: {
        ${values}
      }`;
    }).join(',\n');

    const defaultVariants = variants.map(variant => 
      `${variant.name}: '${variant.defaultValue}'`
    ).join(',\n    ');

    return `const componentVariants = cva(
  '',
  {
    variants: {
${variantConfig}
    },
    defaultVariants: {
      ${defaultVariants}
    },
  }
);`;
  }

  /**
   * 转换为 PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

/**
 * 质量检查器
 */
export class CodeQualityChecker {
  /**
   * 检查代码质量
   */
  checkQuality(code: string): QualityReport {
    const issues: QualityIssue[] = [];

    // 检查 TypeScript 类型
    if (!this.hasTypeDefinitions(code)) {
      issues.push({
        type: 'typescript',
        severity: 'error',
        message: '缺少 TypeScript 类型定义',
        line: 0,
      });
    }

    // 检查可访问性
    if (!this.hasAccessibilityFeatures(code)) {
      issues.push({
        type: 'accessibility',
        severity: 'warning',
        message: '缺少可访问性属性',
        line: 0,
      });
    }

    // 检查性能优化
    if (!this.hasPerformanceOptimizations(code)) {
      issues.push({
        type: 'performance',
        severity: 'info',
        message: '可以添加性能优化',
        line: 0,
      });
    }

    return {
      score: this.calculateScore(issues),
      issues,
      suggestions: this.generateSuggestions(issues),
    };
  }

  private hasTypeDefinitions(code: string): boolean {
    return /interface\s+\w+Props/.test(code) || /type\s+\w+Props/.test(code);
  }

  private hasAccessibilityFeatures(code: string): boolean {
    return /aria-\w+/.test(code) || /role=/.test(code);
  }

  private hasPerformanceOptimizations(code: string): boolean {
    return /React\.memo/.test(code) || /useMemo/.test(code) || /useCallback/.test(code);
  }

  private calculateScore(issues: QualityIssue[]): number {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    const baseScore = 100;
    const errorPenalty = errorCount * 20;
    const warningPenalty = warningCount * 10;
    const infoPenalty = infoCount * 5;

    return Math.max(0, baseScore - errorPenalty - warningPenalty - infoPenalty);
  }

  private generateSuggestions(issues: QualityIssue[]): string[] {
    return issues.map(issue => {
      switch (issue.type) {
        case 'typescript':
          return '添加完整的 TypeScript 类型定义';
        case 'accessibility':
          return '添加 ARIA 属性和键盘导航支持';
        case 'performance':
          return '考虑使用 React.memo 或 useMemo 优化性能';
        default:
          return issue.message;
      }
    });
  }
}

export interface QualityReport {
  score: number;
  issues: QualityIssue[];
  suggestions: string[];
}

export interface QualityIssue {
  type: 'typescript' | 'accessibility' | 'performance' | 'style' | 'other';
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
}

/**
 * 全局 AI 上下文管理器实例
 */
export const aiContextManager = new AIContextManager();

/**
 * 全局代码生成器实例
 */
export const codeGenerator = new CodeGenerator(aiContextManager);

/**
 * 全局质量检查器实例
 */
export const qualityChecker = new CodeQualityChecker();