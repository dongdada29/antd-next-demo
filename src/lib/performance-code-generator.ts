/**
 * 性能优化代码生成器
 * 为 AI 代码生成提供性能优化和检查功能
 */

import { performanceAnalyzer } from './performance-analyzer';
import { PerformancePromptGenerator, getPerformancePrompt } from './prompts/performance-prompts';

// 代码生成配置
export interface CodeGenerationConfig {
  type: 'component' | 'hook' | 'utility' | 'page';
  optimizationLevel: 'basic' | 'advanced' | 'expert';
  performanceTargets: PerformanceTarget[];
  constraints: CodeConstraint[];
  enableAnalysis: boolean;
}

// 性能目标
export interface PerformanceTarget {
  metric: 'renderTime' | 'bundleSize' | 'memoryUsage' | 'loadTime';
  target: number;
  unit: 'ms' | 'kb' | 'mb' | 's';
}

// 代码约束
export interface CodeConstraint {
  type: 'maxLines' | 'maxComplexity' | 'maxDependencies' | 'noInlineStyles';
  value?: number;
}

// 代码分析结果
export interface CodeAnalysisResult {
  score: number;
  issues: PerformanceIssue[];
  suggestions: string[];
  metrics: CodeMetrics;
  optimizedCode?: string;
}

// 性能问题
export interface PerformanceIssue {
  type: 'warning' | 'error' | 'info';
  category: 'performance' | 'memory' | 'bundle' | 'accessibility';
  message: string;
  line?: number;
  column?: number;
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
}

// 代码指标
export interface CodeMetrics {
  linesOfCode: number;
  cyclomaticComplexity: number;
  dependencies: string[];
  estimatedBundleSize: number;
  estimatedRenderTime: number;
  memoryFootprint: number;
}

/**
 * 性能优化代码生成器
 */
export class PerformanceCodeGenerator {
  private config: CodeGenerationConfig;

  constructor(config: CodeGenerationConfig) {
    this.config = config;
  }

  /**
   * 生成性能优化的代码
   */
  async generateOptimizedCode(
    prompt: string,
    context?: any
  ): Promise<{
    code: string;
    analysis: CodeAnalysisResult;
    performancePrompt: string;
  }> {
    // 1. 生成性能优化提示词
    const performancePrompt = this.generatePerformancePrompt(prompt, context);

    // 2. 这里应该调用 AI 模型生成代码
    // 为了演示，我们使用模拟的代码生成
    const generatedCode = await this.simulateCodeGeneration(performancePrompt);

    // 3. 分析生成的代码
    const analysis = await this.analyzeCode(generatedCode);

    // 4. 如果需要，优化代码
    let finalCode = generatedCode;
    if (analysis.score < 80 && this.config.enableAnalysis) {
      finalCode = await this.optimizeCode(generatedCode, analysis);
    }

    return {
      code: finalCode,
      analysis: await this.analyzeCode(finalCode),
      performancePrompt
    };
  }

  /**
   * 生成性能优化提示词
   */
  private generatePerformancePrompt(prompt: string, context?: any): string {
    const basePrompt = getPerformancePrompt({
      category: this.config.type,
      optimizationLevel: this.config.optimizationLevel,
      targetMetrics: this.config.performanceTargets.map(t => t.metric),
      constraints: this.config.constraints.map(c => c.type)
    });

    let enhancedPrompt = `${basePrompt}\n\n## 用户需求\n${prompt}`;

    // 添加性能目标
    if (this.config.performanceTargets.length > 0) {
      enhancedPrompt += '\n\n## 性能目标\n';
      this.config.performanceTargets.forEach(target => {
        enhancedPrompt += `- ${target.metric}: < ${target.target}${target.unit}\n`;
      });
    }

    // 添加约束条件
    if (this.config.constraints.length > 0) {
      enhancedPrompt += '\n\n## 约束条件\n';
      this.config.constraints.forEach(constraint => {
        enhancedPrompt += `- ${constraint.type}${constraint.value ? `: ${constraint.value}` : ''}\n`;
      });
    }

    // 添加上下文信息
    if (context) {
      enhancedPrompt += '\n\n## 上下文信息\n';
      enhancedPrompt += JSON.stringify(context, null, 2);
    }

    return enhancedPrompt;
  }

  /**
   * 模拟代码生成（实际应用中应该调用 AI 模型）
   */
  private async simulateCodeGeneration(prompt: string): Promise<string> {
    // 这里应该调用实际的 AI 模型
    // 为了演示，返回一个基础的组件模板
    if (this.config.type === 'component') {
      return PerformancePromptGenerator.generateOptimizedTemplate('list');
    }
    
    return `
// Generated code based on prompt
const generatedFunction = () => {
  // Implementation
};

export default generatedFunction;
`;
  }

  /**
   * 分析代码性能
   */
  async analyzeCode(code: string): Promise<CodeAnalysisResult> {
    const issues: PerformanceIssue[] = [];
    const suggestions: string[] = [];
    
    // 1. 静态代码分析
    const metrics = this.calculateCodeMetrics(code);
    
    // 2. 性能问题检测
    issues.push(...this.detectPerformanceIssues(code));
    
    // 3. 生成优化建议
    suggestions.push(...PerformancePromptGenerator.generateOptimizationSuggestions(code));
    
    // 4. 计算性能评分
    const score = this.calculatePerformanceScore(metrics, issues);

    return {
      score,
      issues,
      suggestions,
      metrics
    };
  }

  /**
   * 计算代码指标
   */
  private calculateCodeMetrics(code: string): CodeMetrics {
    const lines = code.split('\n');
    const linesOfCode = lines.filter(line => 
      line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('/*')
    ).length;

    // 简化的圈复杂度计算
    const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', '&&', '||', '?'];
    let cyclomaticComplexity = 1; // 基础复杂度
    
    complexityKeywords.forEach(keyword => {
      const matches = code.match(new RegExp(`\\b${keyword}\\b`, 'g'));
      if (matches) {
        cyclomaticComplexity += matches.length;
      }
    });

    // 提取依赖
    const importMatches = code.match(/import.*from\s+['"]([^'"]+)['"]/g) || [];
    const dependencies = importMatches.map(match => {
      const dep = match.match(/from\s+['"]([^'"]+)['"]/);
      return dep ? dep[1] : '';
    }).filter(Boolean);

    // 估算 Bundle 大小（简化计算）
    const estimatedBundleSize = linesOfCode * 50; // 每行约50字节

    // 估算渲染时间（基于复杂度）
    const estimatedRenderTime = cyclomaticComplexity * 0.5; // 每个复杂度单位0.5ms

    // 估算内存占用
    const memoryFootprint = linesOfCode * 100; // 每行约100字节内存

    return {
      linesOfCode,
      cyclomaticComplexity,
      dependencies,
      estimatedBundleSize,
      estimatedRenderTime,
      memoryFootprint
    };
  }

  /**
   * 检测性能问题
   */
  private detectPerformanceIssues(code: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // 检查是否缺少 React.memo
    if (code.includes('const ') && code.includes('= (') && !code.includes('React.memo')) {
      issues.push({
        type: 'warning',
        category: 'performance',
        message: '组件未使用 React.memo 优化',
        suggestion: '使用 React.memo 包装组件以避免不必要的重新渲染',
        impact: 'medium'
      });
    }

    // 检查内联样式
    if (code.includes('style={{')) {
      issues.push({
        type: 'warning',
        category: 'performance',
        message: '使用了内联样式',
        suggestion: '将样式对象提取到组件外部或使用 CSS 类',
        impact: 'low'
      });
    }

    // 检查是否缺少 useCallback
    if (code.includes('onClick=') && !code.includes('useCallback')) {
      issues.push({
        type: 'warning',
        category: 'performance',
        message: '事件处理函数未使用 useCallback 优化',
        suggestion: '使用 useCallback 缓存事件处理函数',
        impact: 'medium'
      });
    }

    // 检查是否缺少 useMemo
    if ((code.includes('.map(') || code.includes('.filter(')) && !code.includes('useMemo')) {
      issues.push({
        type: 'warning',
        category: 'performance',
        message: '数组操作未使用 useMemo 优化',
        suggestion: '使用 useMemo 缓存计算结果',
        impact: 'medium'
      });
    }

    // 检查循环复杂度
    const complexity = this.calculateCodeMetrics(code).cyclomaticComplexity;
    if (complexity > 10) {
      issues.push({
        type: 'error',
        category: 'performance',
        message: `圈复杂度过高: ${complexity}`,
        suggestion: '考虑拆分函数或简化逻辑',
        impact: 'high'
      });
    }

    // 检查是否缺少 key 属性
    if (code.includes('.map(') && !code.includes('key=')) {
      issues.push({
        type: 'error',
        category: 'performance',
        message: '列表渲染缺少 key 属性',
        suggestion: '为列表项添加唯一的 key 属性',
        impact: 'high'
      });
    }

    return issues;
  }

  /**
   * 计算性能评分
   */
  private calculatePerformanceScore(metrics: CodeMetrics, issues: PerformanceIssue[]): number {
    let score = 100;

    // 根据问题扣分
    issues.forEach(issue => {
      switch (issue.impact) {
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    // 根据复杂度扣分
    if (metrics.cyclomaticComplexity > 15) {
      score -= 15;
    } else if (metrics.cyclomaticComplexity > 10) {
      score -= 10;
    }

    // 根据代码行数扣分
    if (metrics.linesOfCode > 200) {
      score -= 10;
    } else if (metrics.linesOfCode > 100) {
      score -= 5;
    }

    return Math.max(0, score);
  }

  /**
   * 优化代码
   */
  private async optimizeCode(code: string, analysis: CodeAnalysisResult): Promise<string> {
    let optimizedCode = code;

    // 应用自动优化
    analysis.issues.forEach(issue => {
      switch (issue.message) {
        case '组件未使用 React.memo 优化':
          optimizedCode = this.addReactMemo(optimizedCode);
          break;
        case '事件处理函数未使用 useCallback 优化':
          optimizedCode = this.addUseCallback(optimizedCode);
          break;
        case '数组操作未使用 useMemo 优化':
          optimizedCode = this.addUseMemo(optimizedCode);
          break;
        case '列表渲染缺少 key 属性':
          optimizedCode = this.addKeyProps(optimizedCode);
          break;
      }
    });

    return optimizedCode;
  }

  /**
   * 添加 React.memo
   */
  private addReactMemo(code: string): string {
    // 简化的实现，实际应该使用 AST 解析
    if (!code.includes('React.memo')) {
      code = code.replace(/import React/g, 'import React, { memo }');
      code = code.replace(/const (\w+) = \(/g, 'const $1 = memo((');
      code = code.replace(/}\);$/g, '});\n\n$1.displayName = \'$1\';');
    }
    return code;
  }

  /**
   * 添加 useCallback
   */
  private addUseCallback(code: string): string {
    // 简化的实现
    if (!code.includes('useCallback')) {
      code = code.replace(/import React/g, 'import React, { useCallback }');
      // 这里需要更复杂的 AST 操作来正确添加 useCallback
    }
    return code;
  }

  /**
   * 添加 useMemo
   */
  private addUseMemo(code: string): string {
    // 简化的实现
    if (!code.includes('useMemo')) {
      code = code.replace(/import React/g, 'import React, { useMemo }');
      // 这里需要更复杂的 AST 操作来正确添加 useMemo
    }
    return code;
  }

  /**
   * 添加 key 属性
   */
  private addKeyProps(code: string): string {
    // 简化的实现
    code = code.replace(/\.map\((\w+) => \(/g, '.map($1 => (');
    code = code.replace(/<(\w+)([^>]*?)>/g, '<$1 key={item.id}$2>');
    return code;
  }

  /**
   * 生成性能报告
   */
  generatePerformanceReport(analysis: CodeAnalysisResult): string {
    let report = '# 代码性能分析报告\n\n';
    
    report += `## 总体评分: ${analysis.score}/100\n\n`;
    
    report += '## 代码指标\n';
    report += `- 代码行数: ${analysis.metrics.linesOfCode}\n`;
    report += `- 圈复杂度: ${analysis.metrics.cyclomaticComplexity}\n`;
    report += `- 依赖数量: ${analysis.metrics.dependencies.length}\n`;
    report += `- 预估 Bundle 大小: ${(analysis.metrics.estimatedBundleSize / 1024).toFixed(2)}KB\n`;
    report += `- 预估渲染时间: ${analysis.metrics.estimatedRenderTime.toFixed(2)}ms\n`;
    report += `- 预估内存占用: ${(analysis.metrics.memoryFootprint / 1024).toFixed(2)}KB\n\n`;

    if (analysis.issues.length > 0) {
      report += '## 性能问题\n';
      analysis.issues.forEach((issue, index) => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
        report += `${index + 1}. ${icon} **${issue.message}**\n`;
        report += `   - 影响: ${issue.impact}\n`;
        report += `   - 建议: ${issue.suggestion}\n\n`;
      });
    }

    if (analysis.suggestions.length > 0) {
      report += '## 优化建议\n';
      analysis.suggestions.forEach((suggestion, index) => {
        report += `${index + 1}. ${suggestion}\n`;
      });
    }

    return report;
  }
}

/**
 * 性能优化工厂
 */
export class PerformanceOptimizerFactory {
  /**
   * 创建组件优化器
   */
  static createComponentOptimizer(level: 'basic' | 'advanced' | 'expert' = 'basic') {
    return new PerformanceCodeGenerator({
      type: 'component',
      optimizationLevel: level,
      performanceTargets: [
        { metric: 'renderTime', target: 16, unit: 'ms' },
        { metric: 'bundleSize', target: 50, unit: 'kb' }
      ],
      constraints: [
        { type: 'maxComplexity', value: 10 },
        { type: 'noInlineStyles' }
      ],
      enableAnalysis: true
    });
  }

  /**
   * 创建 Hook 优化器
   */
  static createHookOptimizer(level: 'basic' | 'advanced' | 'expert' = 'basic') {
    return new PerformanceCodeGenerator({
      type: 'hook',
      optimizationLevel: level,
      performanceTargets: [
        { metric: 'memoryUsage', target: 10, unit: 'mb' }
      ],
      constraints: [
        { type: 'maxLines', value: 100 }
      ],
      enableAnalysis: true
    });
  }

  /**
   * 创建页面优化器
   */
  static createPageOptimizer(level: 'basic' | 'advanced' | 'expert' = 'basic') {
    return new PerformanceCodeGenerator({
      type: 'page',
      optimizationLevel: level,
      performanceTargets: [
        { metric: 'loadTime', target: 3, unit: 's' },
        { metric: 'bundleSize', target: 250, unit: 'kb' }
      ],
      constraints: [
        { type: 'maxComplexity', value: 15 }
      ],
      enableAnalysis: true
    });
  }
}

// 导出便捷函数
export const createOptimizedComponent = (prompt: string, level: 'basic' | 'advanced' | 'expert' = 'basic') => {
  const optimizer = PerformanceOptimizerFactory.createComponentOptimizer(level);
  return optimizer.generateOptimizedCode(prompt);
};

export const createOptimizedHook = (prompt: string, level: 'basic' | 'advanced' | 'expert' = 'basic') => {
  const optimizer = PerformanceOptimizerFactory.createHookOptimizer(level);
  return optimizer.generateOptimizedCode(prompt);
};

export const createOptimizedPage = (prompt: string, level: 'basic' | 'advanced' | 'expert' = 'basic') => {
  const optimizer = PerformanceOptimizerFactory.createPageOptimizer(level);
  return optimizer.generateOptimizedCode(prompt);
};