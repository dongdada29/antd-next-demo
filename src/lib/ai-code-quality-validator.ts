/**
 * AI 生成代码质量验证器
 * 专门针对 AI 生成的代码进行质量检查和验证
 */

import { ESLint } from 'eslint';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { CodeQualityChecker, CodeQualityMetrics } from './code-quality-checker';

export interface AICodeValidationResult {
  isValid: boolean;
  score: number;
  issues: AICodeIssue[];
  suggestions: AICodeSuggestion[];
  metrics: AICodeMetrics;
  compliance: ComplianceCheck;
}

export interface AICodeIssue {
  type: 'syntax' | 'logic' | 'style' | 'performance' | 'security' | 'accessibility' | 'best-practice';
  severity: 'critical' | 'major' | 'minor' | 'info';
  message: string;
  line: number;
  column: number;
  rule: string;
  fixable: boolean;
  aiGenerated: boolean;
  context: string;
}

export interface AICodeSuggestion {
  type: 'improvement' | 'optimization' | 'refactor' | 'alternative';
  title: string;
  description: string;
  before: string;
  after: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-1
}

export interface AICodeMetrics {
  complexity: {
    cyclomatic: number;
    cognitive: number;
    nesting: number;
  };
  maintainability: {
    index: number;
    readability: number;
    modularity: number;
  };
  testability: {
    score: number;
    coverage: number;
    mockability: number;
  };
  performance: {
    score: number;
    memoryEfficiency: number;
    algorithmicComplexity: string;
  };
  aiSpecific: {
    promptCompliance: number;
    patternConsistency: number;
    bestPracticeAdherence: number;
  };
}

export interface ComplianceCheck {
  typescript: {
    strictMode: boolean;
    typesSafety: number;
    noAnyUsage: boolean;
  };
  react: {
    hooksCompliance: boolean;
    componentStructure: boolean;
    propsValidation: boolean;
  };
  accessibility: {
    wcagCompliance: boolean;
    ariaUsage: boolean;
    semanticHtml: boolean;
  };
  performance: {
    bundleImpact: number;
    renderOptimization: boolean;
    memoryLeaks: boolean;
  };
  security: {
    xssProtection: boolean;
    dataValidation: boolean;
    secretsExposure: boolean;
  };
}

export interface AICodeValidationOptions {
  strictMode?: boolean;
  includePerformanceCheck?: boolean;
  includeSecurityCheck?: boolean;
  includeAccessibilityCheck?: boolean;
  generateTests?: boolean;
  promptContext?: string;
  expectedPatterns?: string[];
}

export class AICodeQualityValidator {
  private eslint: ESLint;
  private qualityChecker: CodeQualityChecker;
  private projectRoot: string;
  
  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.qualityChecker = new CodeQualityChecker(projectRoot);
    
    // 配置专门针对 AI 生成代码的 ESLint
    this.eslint = new ESLint({
      baseConfig: {
        extends: ['./eslint.config.mjs'],
        rules: {
          // AI 代码特定规则
          '@typescript-eslint/no-explicit-any': 'error',
          '@typescript-eslint/explicit-function-return-type': 'warn',
          '@typescript-eslint/no-unused-vars': 'error',
          'complexity': ['error', { max: 8 }], // 更严格的复杂度限制
          'max-lines-per-function': ['error', { max: 30 }], // 更短的函数
          'max-depth': ['error', { max: 3 }], // 更浅的嵌套
          'react/jsx-key': 'error',
          'react/no-array-index-key': 'error',
          'jsx-a11y/alt-text': 'error',
          'jsx-a11y/aria-props': 'error',
        },
      },
      useEslintrc: false,
      fix: false,
    });
  }

  /**
   * 验证 AI 生成的代码
   */
  async validateAICode(
    code: string, 
    filePath: string, 
    options: AICodeValidationOptions = {}
  ): Promise<AICodeValidationResult> {
    console.log(`🤖 验证 AI 生成代码: ${basename(filePath)}`);
    
    // 创建临时文件进行分析
    const tempFilePath = await this.createTempFile(code, filePath);
    
    try {
      // 并行执行各项检查
      const [
        syntaxCheck,
        lintingCheck,
        typeCheck,
        complexityCheck,
        performanceCheck,
        securityCheck,
        accessibilityCheck,
        complianceCheck,
      ] = await Promise.all([
        this.checkSyntax(tempFilePath),
        this.checkLinting(tempFilePath),
        this.checkTypes(tempFilePath),
        this.checkComplexity(code),
        options.includePerformanceCheck ? this.checkPerformance(code) : Promise.resolve(null),
        options.includeSecurityCheck ? this.checkSecurity(code) : Promise.resolve(null),
        options.includeAccessibilityCheck ? this.checkAccessibility(code) : Promise.resolve(null),
        this.checkCompliance(code, filePath),
      ]);
      
      // 收集所有问题
      const issues = this.collectIssues([
        syntaxCheck,
        lintingCheck,
        typeCheck,
        complexityCheck,
        performanceCheck,
        securityCheck,
        accessibilityCheck,
      ]);
      
      // 生成改进建议
      const suggestions = await this.generateSuggestions(code, issues, options);
      
      // 计算指标
      const metrics = this.calculateMetrics(code, issues);
      
      // 计算总分
      const score = this.calculateScore(issues, metrics, complianceCheck);
      
      const result: AICodeValidationResult = {
        isValid: score >= 70 && issues.filter(i => i.severity === 'critical').length === 0,
        score,
        issues,
        suggestions,
        metrics,
        compliance: complianceCheck,
      };
      
      // 清理临时文件
      await this.cleanupTempFile(tempFilePath);
      
      return result;
      
    } catch (error) {
      await this.cleanupTempFile(tempFilePath);
      throw error;
    }
  }

  /**
   * 批量验证 AI 生成的代码文件
   */
  async validateAICodeBatch(
    files: Array<{ code: string; filePath: string }>,
    options: AICodeValidationOptions = {}
  ): Promise<Map<string, AICodeValidationResult>> {
    const results = new Map<string, AICodeValidationResult>();
    
    console.log(`🤖 批量验证 ${files.length} 个 AI 生成文件`);
    
    // 并行验证（限制并发数）
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async ({ code, filePath }) => {
          try {
            const result = await this.validateAICode(code, filePath, options);
            return { filePath, result };
          } catch (error) {
            console.error(`验证文件 ${filePath} 失败:`, error);
            return { filePath, result: null };
          }
        })
      );
      
      batchResults.forEach(({ filePath, result }) => {
        if (result) {
          results.set(filePath, result);
        }
      });
    }
    
    return results;
  }

  /**
   * 检查语法错误
   */
  private async checkSyntax(filePath: string): Promise<AICodeIssue[]> {
    try {
      const results = await this.eslint.lintFiles([filePath]);
      const issues: AICodeIssue[] = [];
      
      results.forEach(result => {
        result.messages.forEach(message => {
          if (message.fatal || message.severity === 2) {
            issues.push({
              type: 'syntax',
              severity: 'critical',
              message: message.message,
              line: message.line,
              column: message.column,
              rule: message.ruleId || 'syntax-error',
              fixable: false,
              aiGenerated: true,
              context: 'AI 生成代码语法检查',
            });
          }
        });
      });
      
      return issues;
    } catch (error) {
      return [{
        type: 'syntax',
        severity: 'critical',
        message: `语法检查失败: ${error}`,
        line: 1,
        column: 1,
        rule: 'syntax-check-error',
        fixable: false,
        aiGenerated: true,
        context: 'AI 生成代码语法检查',
      }];
    }
  }

  /**
   * 检查 Linting 问题
   */
  private async checkLinting(filePath: string): Promise<AICodeIssue[]> {
    try {
      const results = await this.eslint.lintFiles([filePath]);
      const issues: AICodeIssue[] = [];
      
      results.forEach(result => {
        result.messages.forEach(message => {
          if (!message.fatal) {
            issues.push({
              type: this.categorizeRule(message.ruleId),
              severity: message.severity === 2 ? 'major' : 'minor',
              message: message.message,
              line: message.line,
              column: message.column,
              rule: message.ruleId || 'unknown',
              fixable: message.fix !== undefined,
              aiGenerated: true,
              context: 'AI 生成代码 Linting 检查',
            });
          }
        });
      });
      
      return issues;
    } catch (error) {
      return [];
    }
  }

  /**
   * 检查 TypeScript 类型
   */
  private async checkTypes(filePath: string): Promise<AICodeIssue[]> {
    try {
      const result = execSync(`npx tsc --noEmit --skipLibCheck ${filePath}`, {
        cwd: this.projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      
      return []; // 没有类型错误
    } catch (error: any) {
      const output = error.stdout || error.message;
      const issues: AICodeIssue[] = [];
      
      // 解析 TypeScript 错误
      const errorRegex = /(.+)\((\d+),(\d+)\): error TS\d+: (.+)/g;
      let match;
      
      while ((match = errorRegex.exec(output)) !== null) {
        issues.push({
          type: 'logic',
          severity: 'major',
          message: match[4],
          line: parseInt(match[2]),
          column: parseInt(match[3]),
          rule: 'typescript-error',
          fixable: false,
          aiGenerated: true,
          context: 'AI 生成代码类型检查',
        });
      }
      
      return issues;
    }
  }

  /**
   * 检查代码复杂度
   */
  private async checkComplexity(code: string): Promise<AICodeIssue[]> {
    const issues: AICodeIssue[] = [];
    
    // 简化的复杂度分析
    const lines = code.split('\n');
    let cyclomaticComplexity = 1;
    let nestingLevel = 0;
    let maxNesting = 0;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // 计算圈复杂度
      if (/\b(if|while|for|switch|catch|&&|\|\|)\b/.test(trimmedLine)) {
        cyclomaticComplexity++;
      }
      
      // 计算嵌套深度
      const openBraces = (trimmedLine.match(/{/g) || []).length;
      const closeBraces = (trimmedLine.match(/}/g) || []).length;
      nestingLevel += openBraces - closeBraces;
      maxNesting = Math.max(maxNesting, nestingLevel);
    });
    
    // 检查复杂度阈值
    if (cyclomaticComplexity > 8) {
      issues.push({
        type: 'logic',
        severity: 'major',
        message: `圈复杂度过高: ${cyclomaticComplexity} (建议 ≤ 8)`,
        line: 1,
        column: 1,
        rule: 'complexity',
        fixable: false,
        aiGenerated: true,
        context: 'AI 生成代码复杂度检查',
      });
    }
    
    if (maxNesting > 3) {
      issues.push({
        type: 'logic',
        severity: 'minor',
        message: `嵌套层级过深: ${maxNesting} (建议 ≤ 3)`,
        line: 1,
        column: 1,
        rule: 'max-depth',
        fixable: false,
        aiGenerated: true,
        context: 'AI 生成代码复杂度检查',
      });
    }
    
    return issues;
  }

  /**
   * 检查性能问题
   */
  private async checkPerformance(code: string): Promise<AICodeIssue[]> {
    const issues: AICodeIssue[] = [];
    
    // 检查常见性能问题
    const performancePatterns = [
      {
        pattern: /\.map\(.*\)\.filter\(/g,
        message: '避免链式调用 map 和 filter，考虑使用 reduce',
        severity: 'minor' as const,
      },
      {
        pattern: /new Date\(\).*new Date\(\)/g,
        message: '避免重复创建 Date 对象',
        severity: 'minor' as const,
      },
      {
        pattern: /JSON\.parse\(JSON\.stringify\(/g,
        message: '避免使用 JSON 进行深拷贝，考虑使用专门的库',
        severity: 'minor' as const,
      },
      {
        pattern: /document\.getElementById.*document\.getElementById/g,
        message: '缓存 DOM 查询结果',
        severity: 'minor' as const,
      },
    ];
    
    performancePatterns.forEach(({ pattern, message, severity }) => {
      const matches = code.match(pattern);
      if (matches) {
        issues.push({
          type: 'performance',
          severity,
          message,
          line: 1,
          column: 1,
          rule: 'performance-optimization',
          fixable: false,
          aiGenerated: true,
          context: 'AI 生成代码性能检查',
        });
      }
    });
    
    return issues;
  }

  /**
   * 检查安全问题
   */
  private async checkSecurity(code: string): Promise<AICodeIssue[]> {
    const issues: AICodeIssue[] = [];
    
    // 检查常见安全问题
    const securityPatterns = [
      {
        pattern: /dangerouslySetInnerHTML/g,
        message: '使用 dangerouslySetInnerHTML 存在 XSS 风险',
        severity: 'major' as const,
      },
      {
        pattern: /eval\(/g,
        message: '避免使用 eval()，存在代码注入风险',
        severity: 'critical' as const,
      },
      {
        pattern: /innerHTML\s*=/g,
        message: '直接设置 innerHTML 存在 XSS 风险',
        severity: 'major' as const,
      },
      {
        pattern: /(password|secret|key|token)\s*[:=]\s*['"][^'"]*['"]/gi,
        message: '避免在代码中硬编码敏感信息',
        severity: 'critical' as const,
      },
    ];
    
    securityPatterns.forEach(({ pattern, message, severity }) => {
      const matches = code.match(pattern);
      if (matches) {
        issues.push({
          type: 'security',
          severity,
          message,
          line: 1,
          column: 1,
          rule: 'security-check',
          fixable: false,
          aiGenerated: true,
          context: 'AI 生成代码安全检查',
        });
      }
    });
    
    return issues;
  }

  /**
   * 检查可访问性问题
   */
  private async checkAccessibility(code: string): Promise<AICodeIssue[]> {
    const issues: AICodeIssue[] = [];
    
    // 检查常见可访问性问题
    const a11yPatterns = [
      {
        pattern: /<img(?![^>]*alt=)/g,
        message: 'img 标签缺少 alt 属性',
        severity: 'major' as const,
      },
      {
        pattern: /<button[^>]*onClick[^>]*>(?!.*aria-label)/g,
        message: '交互按钮建议添加 aria-label',
        severity: 'minor' as const,
      },
      {
        pattern: /<div[^>]*onClick/g,
        message: '避免在 div 上使用 onClick，考虑使用 button',
        severity: 'minor' as const,
      },
      {
        pattern: /tabIndex\s*=\s*["']?[1-9]/g,
        message: '避免使用正数 tabIndex',
        severity: 'minor' as const,
      },
    ];
    
    a11yPatterns.forEach(({ pattern, message, severity }) => {
      const matches = code.match(pattern);
      if (matches) {
        issues.push({
          type: 'accessibility',
          severity,
          message,
          line: 1,
          column: 1,
          rule: 'accessibility-check',
          fixable: false,
          aiGenerated: true,
          context: 'AI 生成代码可访问性检查',
        });
      }
    });
    
    return issues;
  }

  /**
   * 检查合规性
   */
  private async checkCompliance(code: string, filePath: string): Promise<ComplianceCheck> {
    const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
    const isReact = filePath.endsWith('.tsx') || filePath.endsWith('.jsx');
    
    return {
      typescript: {
        strictMode: isTypeScript && !code.includes('// @ts-ignore'),
        typesSafety: this.calculateTypeSafety(code),
        noAnyUsage: !code.includes(': any'),
      },
      react: {
        hooksCompliance: isReact ? this.checkHooksCompliance(code) : true,
        componentStructure: isReact ? this.checkComponentStructure(code) : true,
        propsValidation: isReact ? this.checkPropsValidation(code) : true,
      },
      accessibility: {
        wcagCompliance: this.checkWCAGCompliance(code),
        ariaUsage: this.checkAriaUsage(code),
        semanticHtml: this.checkSemanticHtml(code),
      },
      performance: {
        bundleImpact: this.estimateBundleImpact(code),
        renderOptimization: this.checkRenderOptimization(code),
        memoryLeaks: !this.hasMemoryLeaks(code),
      },
      security: {
        xssProtection: !this.hasXSSVulnerabilities(code),
        dataValidation: this.hasDataValidation(code),
        secretsExposure: !this.hasSecretsExposure(code),
      },
    };
  }

  /**
   * 生成改进建议
   */
  private async generateSuggestions(
    code: string, 
    issues: AICodeIssue[], 
    options: AICodeValidationOptions
  ): Promise<AICodeSuggestion[]> {
    const suggestions: AICodeSuggestion[] = [];
    
    // 基于问题生成建议
    issues.forEach(issue => {
      const suggestion = this.generateSuggestionForIssue(issue, code);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    });
    
    // 基于最佳实践生成建议
    const bestPracticeSuggestions = this.generateBestPracticeSuggestions(code);
    suggestions.push(...bestPracticeSuggestions);
    
    // 基于性能优化生成建议
    const performanceSuggestions = this.generatePerformanceSuggestions(code);
    suggestions.push(...performanceSuggestions);
    
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * 计算代码指标
   */
  private calculateMetrics(code: string, issues: AICodeIssue[]): AICodeMetrics {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    
    return {
      complexity: {
        cyclomatic: this.calculateCyclomaticComplexity(code),
        cognitive: this.calculateCognitiveComplexity(code),
        nesting: this.calculateMaxNesting(code),
      },
      maintainability: {
        index: this.calculateMaintainabilityIndex(code),
        readability: this.calculateReadability(code),
        modularity: this.calculateModularity(code),
      },
      testability: {
        score: this.calculateTestabilityScore(code),
        coverage: 0, // 需要实际测试覆盖率数据
        mockability: this.calculateMockability(code),
      },
      performance: {
        score: this.calculatePerformanceScore(code, issues),
        memoryEfficiency: this.calculateMemoryEfficiency(code),
        algorithmicComplexity: this.estimateAlgorithmicComplexity(code),
      },
      aiSpecific: {
        promptCompliance: this.calculatePromptCompliance(code),
        patternConsistency: this.calculatePatternConsistency(code),
        bestPracticeAdherence: this.calculateBestPracticeAdherence(code, issues),
      },
    };
  }

  /**
   * 计算总分
   */
  private calculateScore(
    issues: AICodeIssue[], 
    metrics: AICodeMetrics, 
    compliance: ComplianceCheck
  ): number {
    let score = 100;
    
    // 根据问题严重程度扣分
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'major':
          score -= 10;
          break;
        case 'minor':
          score -= 3;
          break;
        case 'info':
          score -= 1;
          break;
      }
    });
    
    // 根据复杂度扣分
    if (metrics.complexity.cyclomatic > 10) {
      score -= 10;
    }
    
    // 根据合规性加分
    const complianceScore = this.calculateComplianceScore(compliance);
    score = score * 0.8 + complianceScore * 0.2;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // 辅助方法实现
  private categorizeRule(ruleId: string | null): AICodeIssue['type'] {
    if (!ruleId) return 'style';
    
    if (ruleId.includes('security') || ruleId.includes('xss')) return 'security';
    if (ruleId.includes('a11y') || ruleId.includes('accessibility')) return 'accessibility';
    if (ruleId.includes('performance')) return 'performance';
    if (ruleId.includes('complexity') || ruleId.includes('max-')) return 'logic';
    
    return 'style';
  }

  private async createTempFile(code: string, originalPath: string): Promise<string> {
    const tempDir = join(this.projectRoot, '.temp');
    if (!existsSync(tempDir)) {
      require('fs').mkdirSync(tempDir, { recursive: true });
    }
    
    const tempFilePath = join(tempDir, basename(originalPath));
    writeFileSync(tempFilePath, code, 'utf-8');
    
    return tempFilePath;
  }

  private async cleanupTempFile(filePath: string): Promise<void> {
    try {
      if (existsSync(filePath)) {
        require('fs').unlinkSync(filePath);
      }
    } catch (error) {
      console.warn('清理临时文件失败:', error);
    }
  }

  private collectIssues(checkResults: (AICodeIssue[] | null)[]): AICodeIssue[] {
    const allIssues: AICodeIssue[] = [];
    
    checkResults.forEach(result => {
      if (result) {
        allIssues.push(...result);
      }
    });
    
    return allIssues;
  }

  // 简化的指标计算方法（实际实现会更复杂）
  private calculateCyclomaticComplexity(code: string): number {
    const complexityKeywords = /\b(if|while|for|switch|catch|&&|\|\|)\b/g;
    const matches = code.match(complexityKeywords);
    return (matches?.length || 0) + 1;
  }

  private calculateCognitiveComplexity(code: string): number {
    // 简化实现
    return Math.floor(this.calculateCyclomaticComplexity(code) * 0.8);
  }

  private calculateMaxNesting(code: string): number {
    const lines = code.split('\n');
    let maxNesting = 0;
    let currentNesting = 0;
    
    lines.forEach(line => {
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      currentNesting += openBraces - closeBraces;
      maxNesting = Math.max(maxNesting, currentNesting);
    });
    
    return maxNesting;
  }

  private calculateMaintainabilityIndex(code: string): number {
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const complexity = this.calculateCyclomaticComplexity(code);
    
    // 简化的可维护性指数计算
    return Math.max(0, 100 - complexity * 2 - lines.length * 0.1);
  }

  private calculateReadability(code: string): number {
    // 基于注释比例、命名质量等计算可读性
    const lines = code.split('\n');
    const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('*'));
    const commentRatio = commentLines.length / lines.length;
    
    return Math.min(100, commentRatio * 200 + 50);
  }

  private calculateModularity(code: string): number {
    // 基于函数数量、导入导出等计算模块化程度
    const functions = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length;
    const exports = (code.match(/export\s+/g) || []).length;
    
    return Math.min(100, (functions + exports) * 10);
  }

  private calculateTestabilityScore(code: string): number {
    // 基于纯函数、依赖注入等计算可测试性
    const pureFunctions = (code.match(/const\s+\w+\s*=\s*\([^)]*\)\s*=>/g) || []).length;
    const sideEffects = (code.match(/console\.|document\.|window\./g) || []).length;
    
    return Math.max(0, 100 - sideEffects * 10 + pureFunctions * 5);
  }

  private calculateMockability(code: string): number {
    // 基于依赖注入、接口使用等计算可模拟性
    const interfaces = (code.match(/interface\s+\w+/g) || []).length;
    const dependencies = (code.match(/import\s+.*from/g) || []).length;
    
    return Math.min(100, interfaces * 20 + dependencies * 5);
  }

  private calculatePerformanceScore(code: string, issues: AICodeIssue[]): number {
    const performanceIssues = issues.filter(issue => issue.type === 'performance');
    return Math.max(0, 100 - performanceIssues.length * 15);
  }

  private calculateMemoryEfficiency(code: string): number {
    // 检查内存泄漏模式
    const memoryLeakPatterns = [
      /setInterval\(/g,
      /addEventListener\(/g,
      /new\s+Array\(\d+\)/g,
    ];
    
    let score = 100;
    memoryLeakPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        score -= matches.length * 10;
      }
    });
    
    return Math.max(0, score);
  }

  private estimateAlgorithmicComplexity(code: string): string {
    if (code.includes('for') && code.includes('for')) return 'O(n²)';
    if (code.includes('for') || code.includes('while')) return 'O(n)';
    return 'O(1)';
  }

  private calculatePromptCompliance(code: string): number {
    // 这里需要根据实际的 prompt 上下文来计算
    return 85; // 占位值
  }

  private calculatePatternConsistency(code: string): number {
    // 检查代码模式的一致性
    return 80; // 占位值
  }

  private calculateBestPracticeAdherence(code: string, issues: AICodeIssue[]): number {
    const bestPracticeIssues = issues.filter(issue => issue.type === 'best-practice');
    return Math.max(0, 100 - bestPracticeIssues.length * 5);
  }

  private calculateComplianceScore(compliance: ComplianceCheck): number {
    let score = 0;
    let total = 0;
    
    // TypeScript 合规性
    if (compliance.typescript.strictMode) score += 10;
    score += compliance.typescript.typesSafety * 0.1;
    if (compliance.typescript.noAnyUsage) score += 5;
    total += 25;
    
    // React 合规性
    if (compliance.react.hooksCompliance) score += 10;
    if (compliance.react.componentStructure) score += 10;
    if (compliance.react.propsValidation) score += 5;
    total += 25;
    
    // 可访问性合规性
    if (compliance.accessibility.wcagCompliance) score += 10;
    if (compliance.accessibility.ariaUsage) score += 5;
    if (compliance.accessibility.semanticHtml) score += 5;
    total += 20;
    
    // 性能合规性
    score += compliance.performance.bundleImpact * 0.1;
    if (compliance.performance.renderOptimization) score += 5;
    if (compliance.performance.memoryLeaks) score += 5;
    total += 20;
    
    // 安全合规性
    if (compliance.security.xssProtection) score += 5;
    if (compliance.security.dataValidation) score += 3;
    if (compliance.security.secretsExposure) score += 2;
    total += 10;
    
    return (score / total) * 100;
  }

  // 更多辅助方法的简化实现
  private calculateTypeSafety(code: string): number {
    const anyUsage = (code.match(/:\s*any/g) || []).length;
    const totalTypes = (code.match(/:\s*\w+/g) || []).length;
    
    if (totalTypes === 0) return 50;
    return Math.max(0, 100 - (anyUsage / totalTypes) * 100);
  }

  private checkHooksCompliance(code: string): boolean {
    // 检查 Hooks 规则
    const hooksInConditions = /if\s*\([^)]*\)\s*{[^}]*use\w+/.test(code);
    const hooksInLoops = /for\s*\([^)]*\)\s*{[^}]*use\w+/.test(code);
    
    return !hooksInConditions && !hooksInLoops;
  }

  private checkComponentStructure(code: string): boolean {
    // 检查组件结构
    return /^(function|const)\s+\w+.*=.*\{/.test(code.trim());
  }

  private checkPropsValidation(code: string): boolean {
    // 检查 Props 验证
    return code.includes('interface') || code.includes('type') || code.includes('PropTypes');
  }

  private checkWCAGCompliance(code: string): boolean {
    // 简化的 WCAG 合规性检查
    return !/<img(?![^>]*alt=)/.test(code);
  }

  private checkAriaUsage(code: string): boolean {
    // 检查 ARIA 属性使用
    return /aria-\w+/.test(code);
  }

  private checkSemanticHtml(code: string): boolean {
    // 检查语义化 HTML
    return /\b(header|nav|main|section|article|aside|footer)\b/.test(code);
  }

  private estimateBundleImpact(code: string): number {
    // 估算对 bundle 大小的影响
    const imports = (code.match(/import\s+.*from/g) || []).length;
    const codeSize = code.length;
    
    return Math.max(0, 100 - imports * 5 - codeSize * 0.01);
  }

  private checkRenderOptimization(code: string): boolean {
    // 检查渲染优化
    return code.includes('useMemo') || code.includes('useCallback') || code.includes('React.memo');
  }

  private hasMemoryLeaks(code: string): boolean {
    // 检查内存泄漏
    const hasSetInterval = code.includes('setInterval') && !code.includes('clearInterval');
    const hasEventListener = code.includes('addEventListener') && !code.includes('removeEventListener');
    
    return hasSetInterval || hasEventListener;
  }

  private hasXSSVulnerabilities(code: string): boolean {
    return /dangerouslySetInnerHTML|innerHTML\s*=/.test(code);
  }

  private hasDataValidation(code: string): boolean {
    return /validate|schema|zod|yup/.test(code);
  }

  private hasSecretsExposure(code: string): boolean {
    return /(password|secret|key|token)\s*[:=]\s*['"][^'"]*['"]/.test(code);
  }

  private generateSuggestionForIssue(issue: AICodeIssue, code: string): AICodeSuggestion | null {
    // 基于问题类型生成具体建议
    switch (issue.rule) {
      case 'complexity':
        return {
          type: 'refactor',
          title: '降低函数复杂度',
          description: '将复杂函数拆分为更小的函数',
          before: '// 复杂的函数',
          after: '// 拆分后的简单函数',
          impact: 'high',
          confidence: 0.8,
        };
      
      case '@typescript-eslint/no-explicit-any':
        return {
          type: 'improvement',
          title: '使用具体类型替代 any',
          description: '定义具体的 TypeScript 类型',
          before: 'const data: any = ...',
          after: 'const data: UserData = ...',
          impact: 'medium',
          confidence: 0.9,
        };
      
      default:
        return null;
    }
  }

  private generateBestPracticeSuggestions(code: string): AICodeSuggestion[] {
    const suggestions: AICodeSuggestion[] = [];
    
    // 检查是否使用了最佳实践
    if (!code.includes('export default') && !code.includes('export {')) {
      suggestions.push({
        type: 'improvement',
        title: '添加导出语句',
        description: '组件应该被导出以便在其他地方使用',
        before: 'function Component() { ... }',
        after: 'export default function Component() { ... }',
        impact: 'medium',
        confidence: 0.7,
      });
    }
    
    return suggestions;
  }

  private generatePerformanceSuggestions(code: string): AICodeSuggestion[] {
    const suggestions: AICodeSuggestion[] = [];
    
    // 检查性能优化机会
    if (code.includes('useState') && !code.includes('useMemo')) {
      suggestions.push({
        type: 'optimization',
        title: '考虑使用 useMemo 优化计算',
        description: '对于复杂计算，使用 useMemo 避免重复计算',
        before: 'const result = expensiveCalculation(data);',
        after: 'const result = useMemo(() => expensiveCalculation(data), [data]);',
        impact: 'medium',
        confidence: 0.6,
      });
    }
    
    return suggestions;
  }
}

export default AICodeQualityValidator;