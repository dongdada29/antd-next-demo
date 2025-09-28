/**
 * AI 代码反馈系统
 * 提供智能的代码质量反馈和迭代改进机制
 */

import { AICodeQualityValidator, AICodeValidationResult } from './ai-code-quality-validator';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface CodeFeedback {
  id: string;
  timestamp: string;
  code: string;
  filePath: string;
  validation: AICodeValidationResult;
  
  // 反馈分类
  feedback: {
    positive: string[];
    negative: string[];
    suggestions: string[];
    improvements: string[];
  };
  
  // 学习数据
  learning: {
    patterns: string[];
    antiPatterns: string[];
    bestPractices: string[];
    commonMistakes: string[];
  };
  
  // 迭代历史
  iterations: Array<{
    version: number;
    code: string;
    score: number;
    improvements: string[];
    timestamp: string;
  }>;
}

export interface FeedbackMetrics {
  totalFeedbacks: number;
  averageScore: number;
  improvementRate: number;
  commonIssues: Array<{
    issue: string;
    frequency: number;
    severity: string;
  }>;
  learningProgress: {
    patternsLearned: number;
    mistakesReduced: number;
    bestPracticesAdopted: number;
  };
}

export interface IterativeImprovementPlan {
  currentScore: number;
  targetScore: number;
  iterations: Array<{
    step: number;
    focus: string;
    expectedImprovement: number;
    actions: string[];
    validation: string[];
  }>;
  estimatedTime: string;
  successCriteria: string[];
}

export class AICodeFeedbackSystem {
  private validator: AICodeQualityValidator;
  private feedbackHistory: Map<string, CodeFeedback> = new Map();
  private learningDatabase: Map<string, any> = new Map();
  private projectRoot: string;
  
  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.validator = new AICodeQualityValidator(projectRoot);
    this.loadFeedbackHistory();
    this.loadLearningDatabase();
  }

  /**
   * 为 AI 生成的代码提供反馈
   */
  async provideFeedback(
    code: string, 
    filePath: string, 
    context?: {
      prompt?: string;
      expectedBehavior?: string;
      previousAttempts?: string[];
    }
  ): Promise<CodeFeedback> {
    console.log(`🤖 为 AI 代码提供反馈: ${filePath}`);
    
    // 验证代码质量
    const validation = await this.validator.validateAICode(code, filePath, {
      strictMode: true,
      includePerformanceCheck: true,
      includeSecurityCheck: true,
      includeAccessibilityCheck: true,
      promptContext: context?.prompt,
    });
    
    // 生成反馈
    const feedback = this.generateFeedback(validation, code, context);
    
    // 提取学习数据
    const learning = this.extractLearningData(code, validation);
    
    // 创建反馈对象
    const codeFeedback: CodeFeedback = {
      id: this.generateFeedbackId(filePath),
      timestamp: new Date().toISOString(),
      code,
      filePath,
      validation,
      feedback,
      learning,
      iterations: [],
    };
    
    // 检查是否有历史版本
    const existingFeedback = this.feedbackHistory.get(filePath);
    if (existingFeedback) {
      codeFeedback.iterations = [...existingFeedback.iterations];
      codeFeedback.iterations.push({
        version: existingFeedback.iterations.length + 1,
        code,
        score: validation.score,
        improvements: this.compareWithPrevious(validation, existingFeedback.validation),
        timestamp: new Date().toISOString(),
      });
    }
    
    // 保存反馈
    this.feedbackHistory.set(filePath, codeFeedback);
    this.saveFeedbackHistory();
    
    // 更新学习数据库
    this.updateLearningDatabase(learning);
    
    return codeFeedback;
  }

  /**
   * 创建迭代改进计划
   */
  createIterativeImprovementPlan(feedback: CodeFeedback): IterativeImprovementPlan {
    const currentScore = feedback.validation.score;
    const targetScore = Math.min(100, currentScore + 20);
    
    const iterations = this.planIterations(feedback);
    
    return {
      currentScore,
      targetScore,
      iterations,
      estimatedTime: this.estimateImprovementTime(iterations),
      successCriteria: this.defineSuccessCriteria(feedback),
    };
  }

  /**
   * 执行代码改进迭代
   */
  async iterateCodeImprovement(
    originalCode: string,
    filePath: string,
    improvementPlan: IterativeImprovementPlan
  ): Promise<{
    improvedCode: string;
    feedback: CodeFeedback;
    iterationResults: Array<{
      step: number;
      code: string;
      score: number;
      improvements: string[];
    }>;
  }> {
    let currentCode = originalCode;
    const iterationResults = [];
    
    for (const iteration of improvementPlan.iterations) {
      console.log(`🔄 执行改进迭代 ${iteration.step}: ${iteration.focus}`);
      
      // 应用改进建议
      const improvedCode = await this.applyImprovements(currentCode, iteration.actions);
      
      // 验证改进后的代码
      const feedback = await this.provideFeedback(improvedCode, filePath);
      
      iterationResults.push({
        step: iteration.step,
        code: improvedCode,
        score: feedback.validation.score,
        improvements: feedback.feedback.improvements,
      });
      
      // 如果达到目标分数，提前结束
      if (feedback.validation.score >= improvementPlan.targetScore) {
        console.log(`✅ 提前达到目标分数: ${feedback.validation.score}`);
        break;
      }
      
      currentCode = improvedCode;
    }
    
    const finalFeedback = await this.provideFeedback(currentCode, filePath);
    
    return {
      improvedCode: currentCode,
      feedback: finalFeedback,
      iterationResults,
    };
  }

  /**
   * 获取反馈指标
   */
  getFeedbackMetrics(): FeedbackMetrics {
    const feedbacks = Array.from(this.feedbackHistory.values());
    
    if (feedbacks.length === 0) {
      return {
        totalFeedbacks: 0,
        averageScore: 0,
        improvementRate: 0,
        commonIssues: [],
        learningProgress: {
          patternsLearned: 0,
          mistakesReduced: 0,
          bestPracticesAdopted: 0,
        },
      };
    }
    
    const totalScore = feedbacks.reduce((sum, f) => sum + f.validation.score, 0);
    const averageScore = totalScore / feedbacks.length;
    
    // 计算改进率
    const feedbacksWithIterations = feedbacks.filter(f => f.iterations.length > 0);
    let totalImprovement = 0;
    
    feedbacksWithIterations.forEach(feedback => {
      if (feedback.iterations.length > 0) {
        const firstScore = feedback.iterations[0].score;
        const lastScore = feedback.iterations[feedback.iterations.length - 1].score;
        totalImprovement += lastScore - firstScore;
      }
    });
    
    const improvementRate = feedbacksWithIterations.length > 0 
      ? totalImprovement / feedbacksWithIterations.length 
      : 0;
    
    // 统计常见问题
    const issueFrequency = new Map<string, { count: number; severity: string }>();
    
    feedbacks.forEach(feedback => {
      feedback.validation.issues.forEach(issue => {
        const key = issue.message;
        const existing = issueFrequency.get(key);
        if (existing) {
          existing.count++;
        } else {
          issueFrequency.set(key, { count: 1, severity: issue.severity });
        }
      });
    });
    
    const commonIssues = Array.from(issueFrequency.entries())
      .map(([issue, data]) => ({
        issue,
        frequency: data.count,
        severity: data.severity,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
    
    return {
      totalFeedbacks: feedbacks.length,
      averageScore,
      improvementRate,
      commonIssues,
      learningProgress: {
        patternsLearned: this.learningDatabase.get('patterns')?.size || 0,
        mistakesReduced: this.learningDatabase.get('antiPatterns')?.size || 0,
        bestPracticesAdopted: this.learningDatabase.get('bestPractices')?.size || 0,
      },
    };
  }

  /**
   * 获取个性化建议
   */
  getPersonalizedSuggestions(filePath: string): string[] {
    const feedback = this.feedbackHistory.get(filePath);
    if (!feedback) return [];
    
    const suggestions: string[] = [];
    
    // 基于历史问题生成建议
    const commonIssues = this.getCommonIssuesForFile(filePath);
    commonIssues.forEach(issue => {
      suggestions.push(`注意避免 ${issue.type} 问题: ${issue.message}`);
    });
    
    // 基于学习数据生成建议
    const patterns = this.learningDatabase.get('patterns') || new Set();
    const bestPractices = this.learningDatabase.get('bestPractices') || new Set();
    
    if (patterns.size > 0) {
      suggestions.push('建议使用已学习的成功模式');
    }
    
    if (bestPractices.size > 0) {
      suggestions.push('应用已验证的最佳实践');
    }
    
    return suggestions;
  }

  /**
   * 导出学习报告
   */
  exportLearningReport(): {
    summary: {
      totalCodeReviewed: number;
      averageQualityScore: number;
      improvementTrend: number;
    };
    patterns: {
      successful: string[];
      problematic: string[];
    };
    recommendations: string[];
  } {
    const metrics = this.getFeedbackMetrics();
    
    return {
      summary: {
        totalCodeReviewed: metrics.totalFeedbacks,
        averageQualityScore: metrics.averageScore,
        improvementTrend: metrics.improvementRate,
      },
      patterns: {
        successful: Array.from(this.learningDatabase.get('patterns') || []),
        problematic: Array.from(this.learningDatabase.get('antiPatterns') || []),
      },
      recommendations: this.generateGlobalRecommendations(),
    };
  }

  // 私有方法实现

  private generateFeedback(
    validation: AICodeValidationResult, 
    code: string, 
    context?: any
  ): CodeFeedback['feedback'] {
    const positive: string[] = [];
    const negative: string[] = [];
    const suggestions: string[] = [];
    const improvements: string[] = [];
    
    // 正面反馈
    if (validation.score >= 80) {
      positive.push('代码质量良好');
    }
    
    if (validation.compliance.typescript.strictMode) {
      positive.push('正确使用了 TypeScript 严格模式');
    }
    
    if (validation.compliance.accessibility.wcagCompliance) {
      positive.push('遵循了可访问性标准');
    }
    
    // 负面反馈
    const criticalIssues = validation.issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      negative.push(`发现 ${criticalIssues.length} 个严重问题需要立即修复`);
    }
    
    const majorIssues = validation.issues.filter(i => i.severity === 'major');
    if (majorIssues.length > 0) {
      negative.push(`发现 ${majorIssues.length} 个重要问题建议修复`);
    }
    
    // 建议
    validation.suggestions.forEach(suggestion => {
      suggestions.push(suggestion.title);
    });
    
    // 改进点
    if (validation.metrics.complexity.cyclomatic > 8) {
      improvements.push('降低函数复杂度');
    }
    
    if (validation.metrics.testability.score < 70) {
      improvements.push('提高代码可测试性');
    }
    
    return { positive, negative, suggestions, improvements };
  }

  private extractLearningData(
    code: string, 
    validation: AICodeValidationResult
  ): CodeFeedback['learning'] {
    const patterns: string[] = [];
    const antiPatterns: string[] = [];
    const bestPractices: string[] = [];
    const commonMistakes: string[] = [];
    
    // 提取成功模式
    if (validation.score >= 80) {
      if (code.includes('export default')) {
        patterns.push('使用默认导出');
      }
      
      if (code.includes('interface') || code.includes('type')) {
        patterns.push('定义 TypeScript 类型');
      }
      
      if (code.includes('aria-')) {
        patterns.push('使用 ARIA 属性');
      }
    }
    
    // 提取反模式
    validation.issues.forEach(issue => {
      if (issue.severity === 'critical' || issue.severity === 'major') {
        antiPatterns.push(issue.message);
      }
      
      if (issue.severity === 'minor') {
        commonMistakes.push(issue.message);
      }
    });
    
    // 提取最佳实践
    if (validation.compliance.react.hooksCompliance) {
      bestPractices.push('正确使用 React Hooks');
    }
    
    if (validation.compliance.security.xssProtection) {
      bestPractices.push('防范 XSS 攻击');
    }
    
    return { patterns, antiPatterns, bestPractices, commonMistakes };
  }

  private compareWithPrevious(
    current: AICodeValidationResult, 
    previous: AICodeValidationResult
  ): string[] {
    const improvements: string[] = [];
    
    if (current.score > previous.score) {
      improvements.push(`质量分数提升 ${current.score - previous.score} 分`);
    }
    
    if (current.issues.length < previous.issues.length) {
      improvements.push(`问题数量减少 ${previous.issues.length - current.issues.length} 个`);
    }
    
    if (current.metrics.complexity.cyclomatic < previous.metrics.complexity.cyclomatic) {
      improvements.push('降低了代码复杂度');
    }
    
    return improvements;
  }

  private planIterations(feedback: CodeFeedback): IterativeImprovementPlan['iterations'] {
    const iterations = [];
    const issues = feedback.validation.issues;
    
    // 第一轮：修复严重问题
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      iterations.push({
        step: 1,
        focus: '修复严重问题',
        expectedImprovement: 15,
        actions: criticalIssues.map(i => `修复: ${i.message}`),
        validation: ['确保没有语法错误', '通过类型检查'],
      });
    }
    
    // 第二轮：修复重要问题
    const majorIssues = issues.filter(i => i.severity === 'major');
    if (majorIssues.length > 0) {
      iterations.push({
        step: iterations.length + 1,
        focus: '修复重要问题',
        expectedImprovement: 10,
        actions: majorIssues.map(i => `修复: ${i.message}`),
        validation: ['通过 ESLint 检查', '符合编码规范'],
      });
    }
    
    // 第三轮：优化和改进
    if (feedback.validation.metrics.complexity.cyclomatic > 8) {
      iterations.push({
        step: iterations.length + 1,
        focus: '降低复杂度',
        expectedImprovement: 8,
        actions: ['重构复杂函数', '提取公共逻辑', '简化条件判断'],
        validation: ['复杂度指标改善', '可读性提升'],
      });
    }
    
    // 第四轮：性能和最佳实践
    iterations.push({
      step: iterations.length + 1,
      focus: '应用最佳实践',
      expectedImprovement: 5,
      actions: ['添加类型注解', '优化性能', '改善可访问性'],
      validation: ['通过所有质量检查', '符合最佳实践'],
    });
    
    return iterations;
  }

  private estimateImprovementTime(iterations: IterativeImprovementPlan['iterations']): string {
    const totalSteps = iterations.length;
    
    if (totalSteps <= 2) return '30-60 分钟';
    if (totalSteps <= 4) return '1-2 小时';
    return '2-4 小时';
  }

  private defineSuccessCriteria(feedback: CodeFeedback): string[] {
    const criteria: string[] = [];
    
    criteria.push('质量分数达到 80 分以上');
    criteria.push('没有严重和重要问题');
    criteria.push('通过所有自动化检查');
    
    if (feedback.validation.metrics.complexity.cyclomatic > 8) {
      criteria.push('复杂度降低到 8 以下');
    }
    
    if (!feedback.validation.compliance.accessibility.wcagCompliance) {
      criteria.push('符合可访问性标准');
    }
    
    return criteria;
  }

  private async applyImprovements(code: string, actions: string[]): Promise<string> {
    // 这里需要实际的代码改进逻辑
    // 可以集成 AI 模型来自动应用改进
    
    let improvedCode = code;
    
    // 简化的改进应用示例
    actions.forEach(action => {
      if (action.includes('修复: @typescript-eslint/no-explicit-any')) {
        improvedCode = improvedCode.replace(/:\s*any/g, ': unknown');
      }
      
      if (action.includes('添加类型注解')) {
        // 添加基本的类型注解
        improvedCode = improvedCode.replace(
          /function\s+(\w+)\s*\(/g, 
          'function $1('
        );
      }
    });
    
    return improvedCode;
  }

  private getCommonIssuesForFile(filePath: string): Array<{ type: string; message: string }> {
    const feedback = this.feedbackHistory.get(filePath);
    if (!feedback) return [];
    
    const issueFrequency = new Map<string, number>();
    
    // 统计历史问题
    feedback.iterations.forEach(iteration => {
      // 这里需要从迭代历史中提取问题信息
    });
    
    return Array.from(issueFrequency.entries())
      .map(([message, count]) => ({ type: 'recurring', message }))
      .slice(0, 5);
  }

  private generateGlobalRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getFeedbackMetrics();
    
    if (metrics.averageScore < 70) {
      recommendations.push('整体代码质量需要提升，建议加强基础规范培训');
    }
    
    if (metrics.commonIssues.length > 0) {
      const topIssue = metrics.commonIssues[0];
      recommendations.push(`重点关注 ${topIssue.issue}，这是最常见的问题`);
    }
    
    if (metrics.improvementRate > 0) {
      recommendations.push('代码质量呈上升趋势，继续保持');
    } else {
      recommendations.push('代码质量改进缓慢，建议调整开发流程');
    }
    
    return recommendations;
  }

  private loadFeedbackHistory(): void {
    const historyPath = join(this.projectRoot, '.ai-feedback-history.json');
    
    if (existsSync(historyPath)) {
      try {
        const data = readFileSync(historyPath, 'utf-8');
        const history = JSON.parse(data);
        
        Object.entries(history).forEach(([key, value]) => {
          this.feedbackHistory.set(key, value as CodeFeedback);
        });
      } catch (error) {
        console.warn('加载反馈历史失败:', error);
      }
    }
  }

  private saveFeedbackHistory(): void {
    const historyPath = join(this.projectRoot, '.ai-feedback-history.json');
    
    try {
      const history = Object.fromEntries(this.feedbackHistory);
      writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存反馈历史失败:', error);
    }
  }

  private loadLearningDatabase(): void {
    const dbPath = join(this.projectRoot, '.ai-learning-db.json');
    
    if (existsSync(dbPath)) {
      try {
        const data = readFileSync(dbPath, 'utf-8');
        const db = JSON.parse(data);
        
        Object.entries(db).forEach(([key, value]) => {
          this.learningDatabase.set(key, new Set(value as string[]));
        });
      } catch (error) {
        console.warn('加载学习数据库失败:', error);
      }
    }
  }

  private updateLearningDatabase(learning: CodeFeedback['learning']): void {
    // 更新模式数据库
    const patterns = this.learningDatabase.get('patterns') || new Set();
    learning.patterns.forEach(pattern => patterns.add(pattern));
    this.learningDatabase.set('patterns', patterns);
    
    // 更新反模式数据库
    const antiPatterns = this.learningDatabase.get('antiPatterns') || new Set();
    learning.antiPatterns.forEach(antiPattern => antiPatterns.add(antiPattern));
    this.learningDatabase.set('antiPatterns', antiPatterns);
    
    // 更新最佳实践数据库
    const bestPractices = this.learningDatabase.get('bestPractices') || new Set();
    learning.bestPractices.forEach(practice => bestPractices.add(practice));
    this.learningDatabase.set('bestPractices', bestPractices);
    
    // 保存到文件
    this.saveLearningDatabase();
  }

  private saveLearningDatabase(): void {
    const dbPath = join(this.projectRoot, '.ai-learning-db.json');
    
    try {
      const db = Object.fromEntries(
        Array.from(this.learningDatabase.entries()).map(([key, value]) => [
          key, 
          Array.from(value as Set<string>)
        ])
      );
      
      writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存学习数据库失败:', error);
    }
  }

  private generateFeedbackId(filePath: string): string {
    return `${filePath}-${Date.now()}`;
  }
}

export default AICodeFeedbackSystem;