/**
 * 性能测试工具
 * 为 AI 生成的代码提供自动化性能测试
 */

import { performanceBenchmark, BenchmarkResult } from './performance-benchmark';
import { performanceAnalyzer, PerformanceAnalysis } from './performance-analyzer';

// 性能测试配置
export interface PerformanceTestConfig {
  name: string;
  description: string;
  thresholds: PerformanceThreshold[];
  iterations: number;
  timeout: number;
  warmup: boolean;
}

// 性能阈值
export interface PerformanceThreshold {
  metric: 'renderTime' | 'memoryUsage' | 'bundleSize' | 'loadTime' | 'fcp' | 'lcp' | 'cls';
  operator: '<' | '<=' | '>' | '>=' | '==' | '!=';
  value: number;
  unit: 'ms' | 'kb' | 'mb' | 's' | 'score';
  severity: 'error' | 'warning' | 'info';
}

// 测试结果
export interface PerformanceTestResult {
  name: string;
  passed: boolean;
  score: number;
  duration: number;
  thresholdResults: ThresholdResult[];
  benchmarkResults: BenchmarkResult[];
  analysis: PerformanceAnalysis;
  recommendations: string[];
  timestamp: number;
}

// 阈值测试结果
export interface ThresholdResult {
  threshold: PerformanceThreshold;
  actualValue: number;
  passed: boolean;
  message: string;
}

/**
 * 性能测试运行器
 */
export class PerformanceTestRunner {
  private config: PerformanceTestConfig;

  constructor(config: PerformanceTestConfig) {
    this.config = config;
  }

  /**
   * 运行性能测试
   */
  async runTest(testFn: () => Promise<any> | any): Promise<PerformanceTestResult> {
    const startTime = performance.now();
    
    try {
      // 1. 预热（如果启用）
      if (this.config.warmup) {
        await this.warmupTest(testFn);
      }

      // 2. 运行基准测试
      const benchmarkResults = await this.runBenchmarks(testFn);

      // 3. 运行性能分析
      const analysis = await performanceAnalyzer.analyze();

      // 4. 检查阈值
      const thresholdResults = this.checkThresholds(analysis, benchmarkResults);

      // 5. 生成建议
      const recommendations = this.generateRecommendations(thresholdResults, analysis);

      // 6. 计算总体评分
      const score = this.calculateOverallScore(thresholdResults, analysis);

      const duration = performance.now() - startTime;
      const passed = thresholdResults.every(result => 
        result.threshold.severity !== 'error' || result.passed
      );

      return {
        name: this.config.name,
        passed,
        score,
        duration,
        thresholdResults,
        benchmarkResults,
        analysis,
        recommendations,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Performance test failed: ${error}`);
    }
  }

  /**
   * 预热测试
   */
  private async warmupTest(testFn: () => Promise<any> | any): Promise<void> {
    const warmupIterations = Math.min(10, this.config.iterations);
    
    for (let i = 0; i < warmupIterations; i++) {
      await testFn();
    }
  }

  /**
   * 运行基准测试
   */
  private async runBenchmarks(testFn: () => Promise<any> | any): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];

    // 渲染性能测试
    const renderResult = await performanceBenchmark.runBenchmark(
      `${this.config.name}-render`,
      testFn,
      {
        iterations: this.config.iterations,
        timeout: this.config.timeout
      }
    );
    results.push(renderResult);

    // 内存使用测试
    const memoryResult = await this.runMemoryTest(testFn);
    results.push(memoryResult);

    return results;
  }

  /**
   * 运行内存测试
   */
  private async runMemoryTest(testFn: () => Promise<any> | any): Promise<BenchmarkResult> {
    const initialMemory = this.getMemoryUsage();
    let peakMemory = initialMemory;

    const times: number[] = [];
    
    for (let i = 0; i < this.config.iterations; i++) {
      const startTime = performance.now();
      await testFn();
      const endTime = performance.now();
      
      times.push(endTime - startTime);
      
      const currentMemory = this.getMemoryUsage();
      if (currentMemory > peakMemory) {
        peakMemory = currentMemory;
      }
    }

    const finalMemory = this.getMemoryUsage();
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / times.length;

    return {
      name: `${this.config.name}-memory`,
      iterations: this.config.iterations,
      totalTime,
      averageTime,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      standardDeviation: this.calculateStandardDeviation(times, averageTime),
      operationsPerSecond: 1000 / averageTime,
      memoryUsage: {
        before: initialMemory,
        after: finalMemory,
        peak: peakMemory
      },
      success: true
    };
  }

  /**
   * 检查性能阈值
   */
  private checkThresholds(
    analysis: PerformanceAnalysis,
    benchmarkResults: BenchmarkResult[]
  ): ThresholdResult[] {
    const results: ThresholdResult[] = [];

    this.config.thresholds.forEach(threshold => {
      const actualValue = this.getMetricValue(threshold.metric, analysis, benchmarkResults);
      const passed = this.evaluateThreshold(threshold, actualValue);
      
      results.push({
        threshold,
        actualValue,
        passed,
        message: this.generateThresholdMessage(threshold, actualValue, passed)
      });
    });

    return results;
  }

  /**
   * 获取指标值
   */
  private getMetricValue(
    metric: string,
    analysis: PerformanceAnalysis,
    benchmarkResults: BenchmarkResult[]
  ): number {
    switch (metric) {
      case 'renderTime':
        return benchmarkResults.find(r => r.name.includes('render'))?.averageTime || 0;
      case 'memoryUsage':
        return benchmarkResults.find(r => r.name.includes('memory'))?.memoryUsage.peak || 0;
      case 'fcp':
        return analysis.metrics.webVitals.fcp || 0;
      case 'lcp':
        return analysis.metrics.webVitals.lcp || 0;
      case 'cls':
        return analysis.metrics.webVitals.cls || 0;
      case 'bundleSize':
        return analysis.metrics.resources.totalSize || 0;
      case 'loadTime':
        return analysis.metrics.webVitals.tti || 0;
      default:
        return 0;
    }
  }

  /**
   * 评估阈值
   */
  private evaluateThreshold(threshold: PerformanceThreshold, actualValue: number): boolean {
    switch (threshold.operator) {
      case '<':
        return actualValue < threshold.value;
      case '<=':
        return actualValue <= threshold.value;
      case '>':
        return actualValue > threshold.value;
      case '>=':
        return actualValue >= threshold.value;
      case '==':
        return actualValue === threshold.value;
      case '!=':
        return actualValue !== threshold.value;
      default:
        return false;
    }
  }

  /**
   * 生成阈值消息
   */
  private generateThresholdMessage(
    threshold: PerformanceThreshold,
    actualValue: number,
    passed: boolean
  ): string {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const formattedValue = this.formatValue(actualValue, threshold.unit);
    const formattedThreshold = this.formatValue(threshold.value, threshold.unit);
    
    return `${status}: ${threshold.metric} ${threshold.operator} ${formattedThreshold} (actual: ${formattedValue})`;
  }

  /**
   * 格式化值
   */
  private formatValue(value: number, unit: string): string {
    switch (unit) {
      case 'ms':
        return `${value.toFixed(2)}ms`;
      case 'kb':
        return `${(value / 1024).toFixed(2)}KB`;
      case 'mb':
        return `${(value / 1024 / 1024).toFixed(2)}MB`;
      case 's':
        return `${(value / 1000).toFixed(2)}s`;
      case 'score':
        return value.toFixed(0);
      default:
        return value.toString();
    }
  }

  /**
   * 生成优化建议
   */
  private generateRecommendations(
    thresholdResults: ThresholdResult[],
    analysis: PerformanceAnalysis
  ): string[] {
    const recommendations: string[] = [];

    // 基于失败的阈值生成建议
    thresholdResults
      .filter(result => !result.passed && result.threshold.severity === 'error')
      .forEach(result => {
        switch (result.threshold.metric) {
          case 'renderTime':
            recommendations.push('优化组件渲染性能：使用 React.memo、useMemo、useCallback');
            break;
          case 'memoryUsage':
            recommendations.push('优化内存使用：检查内存泄漏，优化数据结构');
            break;
          case 'fcp':
            recommendations.push('优化首次内容绘制：减少阻塞资源，优化关键渲染路径');
            break;
          case 'lcp':
            recommendations.push('优化最大内容绘制：优化图片加载，使用 CDN');
            break;
          case 'cls':
            recommendations.push('减少累积布局偏移：为元素设置固定尺寸');
            break;
          case 'bundleSize':
            recommendations.push('减少包大小：实现代码分割，移除未使用的代码');
            break;
        }
      });

    // 添加分析建议
    recommendations.push(...analysis.recommendations.map(r => r.title));

    return [...new Set(recommendations)]; // 去重
  }

  /**
   * 计算总体评分
   */
  private calculateOverallScore(
    thresholdResults: ThresholdResult[],
    analysis: PerformanceAnalysis
  ): number {
    let score = analysis.score;

    // 根据阈值测试结果调整评分
    thresholdResults.forEach(result => {
      if (!result.passed) {
        switch (result.threshold.severity) {
          case 'error':
            score -= 20;
            break;
          case 'warning':
            score -= 10;
            break;
          case 'info':
            score -= 5;
            break;
        }
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 获取内存使用量
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * 计算标准差
   */
  private calculateStandardDeviation(values: number[], mean: number): number {
    const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }
}

/**
 * 性能测试套件
 */
export class PerformanceTestSuite {
  private tests: Map<string, PerformanceTestRunner> = new Map();

  /**
   * 添加测试
   */
  addTest(config: PerformanceTestConfig): PerformanceTestRunner {
    const runner = new PerformanceTestRunner(config);
    this.tests.set(config.name, runner);
    return runner;
  }

  /**
   * 运行所有测试
   */
  async runAll(testFunctions: Map<string, () => Promise<any> | any>): Promise<PerformanceTestResult[]> {
    const results: PerformanceTestResult[] = [];

    for (const [name, runner] of this.tests) {
      const testFn = testFunctions.get(name);
      if (testFn) {
        try {
          const result = await runner.runTest(testFn);
          results.push(result);
        } catch (error) {
          console.error(`Test ${name} failed:`, error);
        }
      }
    }

    return results;
  }

  /**
   * 生成测试报告
   */
  generateReport(results: PerformanceTestResult[]): string {
    let report = '# 性能测试报告\n\n';
    
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalTests;

    report += `## 总览\n`;
    report += `- 测试通过率: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)\n`;
    report += `- 平均性能评分: ${averageScore.toFixed(1)}/100\n`;
    report += `- 测试时间: ${new Date().toLocaleString()}\n\n`;

    results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      report += `## ${result.name} ${status}\n\n`;
      report += `- 评分: ${result.score}/100\n`;
      report += `- 执行时间: ${result.duration.toFixed(2)}ms\n\n`;

      if (result.thresholdResults.length > 0) {
        report += `### 阈值检查\n`;
        result.thresholdResults.forEach(threshold => {
          report += `- ${threshold.message}\n`;
        });
        report += '\n';
      }

      if (result.recommendations.length > 0) {
        report += `### 优化建议\n`;
        result.recommendations.forEach((rec, index) => {
          report += `${index + 1}. ${rec}\n`;
        });
        report += '\n';
      }
    });

    return report;
  }
}

/**
 * 预定义的性能测试配置
 */
export const PERFORMANCE_TEST_CONFIGS = {
  // React 组件性能测试
  reactComponent: {
    name: 'React Component Performance',
    description: '测试 React 组件的渲染性能',
    thresholds: [
      {
        metric: 'renderTime' as const,
        operator: '<' as const,
        value: 16,
        unit: 'ms' as const,
        severity: 'error' as const
      },
      {
        metric: 'memoryUsage' as const,
        operator: '<' as const,
        value: 10 * 1024 * 1024, // 10MB
        unit: 'mb' as const,
        severity: 'warning' as const
      }
    ],
    iterations: 100,
    timeout: 5000,
    warmup: true
  },

  // 页面加载性能测试
  pageLoad: {
    name: 'Page Load Performance',
    description: '测试页面加载性能',
    thresholds: [
      {
        metric: 'fcp' as const,
        operator: '<' as const,
        value: 1800,
        unit: 'ms' as const,
        severity: 'error' as const
      },
      {
        metric: 'lcp' as const,
        operator: '<' as const,
        value: 2500,
        unit: 'ms' as const,
        severity: 'error' as const
      },
      {
        metric: 'cls' as const,
        operator: '<' as const,
        value: 0.1,
        unit: 'score' as const,
        severity: 'warning' as const
      }
    ],
    iterations: 10,
    timeout: 10000,
    warmup: false
  },

  // Bundle 大小测试
  bundleSize: {
    name: 'Bundle Size Test',
    description: '测试代码包大小',
    thresholds: [
      {
        metric: 'bundleSize' as const,
        operator: '<' as const,
        value: 250 * 1024, // 250KB
        unit: 'kb' as const,
        severity: 'error' as const
      }
    ],
    iterations: 1,
    timeout: 30000,
    warmup: false
  }
};

// 便捷函数
export const createPerformanceTest = (config: PerformanceTestConfig) => {
  return new PerformanceTestRunner(config);
};

export const createPerformanceTestSuite = () => {
  return new PerformanceTestSuite();
};