/**
 * 项目特定提示词库
 * 统一导出所有提示词模块和管理功能
 */

import { getAllStylePrompts } from './style-prompts';

import { getAllPagePrompts } from './page-prompts';

import { getAllComponentPrompts } from './component-prompts';

import { getAllSystemPrompts } from './system-prompts';

import { getAllExtractedPatterns } from './v0-pattern-extraction';

import { getAllStylePrompts } from './style-prompts';

import { getAllPagePrompts } from './page-prompts';

import { getAllComponentPrompts } from './component-prompts';

import { getAllSystemPrompts } from './system-prompts';

import { validateV0Compliance } from './v0-specifications';

import { searchPatternsByApplicability } from './v0-pattern-extraction';

import { searchStylePrompts } from './style-prompts';

import { searchPagePrompts } from './page-prompts';

import { searchComponentPrompts } from './component-prompts';

import { ExtractedPattern } from './v0-pattern-extraction';

import { StylePrompt } from './style-prompts';

import { PagePrompt } from './page-prompts';

import { ComponentPrompt } from './component-prompts';

import { getStylePromptsByCategory } from './style-prompts';

import { getPagePromptById } from './page-prompts';

import { getComponentPromptById } from './component-prompts';

import { getCoreSystemPrompts } from './system-prompts';

import { getFullSystemPrompts } from './system-prompts';

// 导出所有提示词类型和接口
export type {
  SystemPrompt,
  ComponentPrompt,
  PagePrompt,
  StylePrompt,
} from './system-prompts';

export type {
  V0CorePrinciples,
  V0ComponentPattern,
  V0StylePattern,
} from './v0-specifications';

export type {
  ExtractedPattern,
  CodeExample,
  PatternMetrics,
} from './v0-pattern-extraction';

// 导出系统提示词
export {
  CORE_SYSTEM_PROMPT,
  NEXTJS_SYSTEM_PROMPT,
  SHADCN_SYSTEM_PROMPT,
  TAILWIND_SYSTEM_PROMPT,
  ACCESSIBILITY_SYSTEM_PROMPT,
  PERFORMANCE_SYSTEM_PROMPT,
  getAllSystemPrompts,
  getSystemPromptsByTags,
  getCoreSystemPrompts,
  getFullSystemPrompts,
} from './system-prompts';

// 导出组件提示词
export {
  UI_COMPONENT_PROMPTS,
  FORM_COMPONENT_PROMPTS,
  DATA_COMPONENT_PROMPTS,
  NAVIGATION_COMPONENT_PROMPTS,
  FEEDBACK_COMPONENT_PROMPTS,
  getAllComponentPrompts,
  getComponentPromptsByCategory,
  getComponentPromptById,
  searchComponentPrompts,
} from './component-prompts';

// 导出页面提示词
export {
  DASHBOARD_PAGE_PROMPTS,
  FORM_PAGE_PROMPTS,
  LIST_PAGE_PROMPTS,
  DETAIL_PAGE_PROMPTS,
  AUTH_PAGE_PROMPTS,
  getAllPagePrompts,
  getPagePromptsByCategory,
  getPagePromptById,
  searchPagePrompts,
} from './page-prompts';

// 导出样式和优化提示词
export {
  STYLING_PROMPTS,
  INTERACTION_PROMPTS,
  PERFORMANCE_PROMPTS,
  ACCESSIBILITY_PROMPTS,
  getAllStylePrompts,
  getStylePromptsByCategory,
  getStylePromptById,
  searchStylePrompts,
} from './style-prompts';

// 导出 V0 规范和分析
export {
  V0_CORE_PRINCIPLES,
  V0_COMPONENT_PATTERNS,
  V0_STYLE_PATTERNS,
  V0_ACCESSIBILITY_PATTERNS,
  V0_PERFORMANCE_PATTERNS,
  getProjectV0Specifications,
  validateV0Compliance,
} from './v0-specifications';

// 导出模式提取和分析
export {
  EXTRACTED_COMPONENT_PATTERNS,
  EXTRACTED_STYLING_PATTERNS,
  EXTRACTED_LAYOUT_PATTERNS,
  EXTRACTED_INTERACTION_PATTERNS,
  getAllExtractedPatterns,
  getPatternsByCategory,
  searchPatternsByApplicability,
  evaluatePatternFit,
} from './v0-pattern-extraction';

/**
 * 提示词库管理器
 */
export class PromptLibrary {
  /**
   * 获取完整的系统提示词
   */
  static getSystemPrompt(includeAll: boolean = false): string {
    return includeAll ? getFullSystemPrompts() : getCoreSystemPrompts();
  }

  /**
   * 根据组件类型获取组件提示词
   */
  static getComponentPrompt(componentType: string): string | null {
    const prompt = getComponentPromptById(componentType);
    return prompt ? prompt.prompt : null;
  }

  /**
   * 根据页面类型获取页面提示词
   */
  static getPagePrompt(pageType: string): string | null {
    const prompt = getPagePromptById(pageType);
    return prompt ? prompt.prompt : null;
  }

  /**
   * 根据样式类别获取样式提示词
   */
  static getStylePrompt(category: 'styling' | 'interaction' | 'performance' | 'accessibility'): string[] {
    const prompts = getStylePromptsByCategory(category);
    return prompts.map(prompt => prompt.prompt);
  }

  /**
   * 构建完整的提示词上下文
   */
  static buildPromptContext(options: {
    includeSystem?: boolean;
    componentType?: string;
    pageType?: string;
    styleCategories?: ('styling' | 'interaction' | 'performance' | 'accessibility')[];
    customPrompts?: string[];
  }): string {
    const parts: string[] = [];

    // 添加系统提示词
    if (options.includeSystem !== false) {
      parts.push(this.getSystemPrompt(false));
    }

    // 添加组件提示词
    if (options.componentType) {
      const componentPrompt = this.getComponentPrompt(options.componentType);
      if (componentPrompt) {
        parts.push(componentPrompt);
      }
    }

    // 添加页面提示词
    if (options.pageType) {
      const pagePrompt = this.getPagePrompt(options.pageType);
      if (pagePrompt) {
        parts.push(pagePrompt);
      }
    }

    // 添加样式提示词
    if (options.styleCategories) {
      options.styleCategories.forEach(category => {
        const stylePrompts = this.getStylePrompt(category);
        parts.push(...stylePrompts);
      });
    }

    // 添加自定义提示词
    if (options.customPrompts) {
      parts.push(...options.customPrompts);
    }

    return parts.join('\n\n---\n\n');
  }

  /**
   * 搜索相关提示词
   */
  static searchPrompts(query: string): {
    components: ComponentPrompt[];
    pages: PagePrompt[];
    styles: StylePrompt[];
    patterns: ExtractedPattern[];
  } {
    return {
      components: searchComponentPrompts(query),
      pages: searchPagePrompts(query),
      styles: searchStylePrompts(query),
      patterns: searchPatternsByApplicability(query),
    };
  }

  /**
   * 验证代码是否符合 V0 规范
   */
  static validateCode(code: string): {
    compliant: boolean;
    issues: string[];
    suggestions: string[];
  } {
    return validateV0Compliance(code);
  }

  /**
   * 获取推荐的提示词组合
   */
  static getRecommendedPrompts(context: {
    task: 'component' | 'page' | 'styling' | 'optimization';
    complexity: 'simple' | 'medium' | 'complex';
    features?: string[];
  }): string {
    const options: Parameters<typeof this.buildPromptContext>[0] = {
      includeSystem: true,
    };

    switch (context.task) {
      case 'component':
        options.styleCategories = ['styling', 'accessibility'];
        if (context.complexity === 'complex') {
          options.styleCategories.push('interaction', 'performance');
        }
        break;

      case 'page':
        options.styleCategories = ['styling', 'interaction'];
        if (context.complexity !== 'simple') {
          options.styleCategories.push('performance', 'accessibility');
        }
        break;

      case 'styling':
        options.styleCategories = ['styling'];
        if (context.features?.includes('responsive')) {
          // 添加响应式设计提示词
        }
        if (context.features?.includes('dark-mode')) {
          // 添加暗色模式提示词
        }
        break;

      case 'optimization':
        options.styleCategories = ['performance'];
        if (context.complexity === 'complex') {
          options.styleCategories.push('accessibility');
        }
        break;
    }

    return this.buildPromptContext(options);
  }
}

/**
 * 提示词统计信息
 */
export const PROMPT_LIBRARY_STATS = {
  systemPrompts: getAllSystemPrompts().length,
  componentPrompts: getAllComponentPrompts().length,
  pagePrompts: getAllPagePrompts().length,
  stylePrompts: getAllStylePrompts().length,
  extractedPatterns: getAllExtractedPatterns().length,
  totalPrompts: getAllSystemPrompts().length + 
                getAllComponentPrompts().length + 
                getAllPagePrompts().length + 
                getAllStylePrompts().length,
};

/**
 * 提示词版本信息
 */
export const PROMPT_LIBRARY_VERSION = {
  version: '1.0.0',
  lastUpdated: '2024-01-01',
  basedOn: 'V0 System Prompts',
  compatibility: 'shadcn/ui + Tailwind CSS + Next.js 14+',
};

// 导出管理系统
export {
  PromptManager,
  PromptContext,
  PromptConfig,
  PromptTemplate,
  PromptVariable,
  PromptExample,
  PromptMetrics,
  promptManager,
} from './prompt-manager';

export {
  ContextBuilder,
  ContextBuilderOptions,
  BuiltContext,
  contextBuilder,
} from './context-builder';

export {
  VersionManager,
  PromptVersion,
  VersionHistory,
  UpdatePolicy,
  MigrationRule,
  versionManager,
} from './version-manager';

/**
 * 默认导出提示词库管理器
 */
export default PromptLibrary;