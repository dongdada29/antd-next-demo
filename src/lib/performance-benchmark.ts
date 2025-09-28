/**
 * 性能基准测试工具
 * 提供自动化性能测试和回归检测
 */

// 基准测试配置
export interface BenchmarkConfig {
  name: string;
  description: string;
  iterations: number;
  warmupIterations: number;
  timeout: number;
  setup?: () => Promise<void> | void;
  teardown?: () => Promise<void> | void;
  beforeEach?: () => Promise<void> | void;
  afterEach?: () => Promise<void> | void;
}

// 基准测试结果
export interface BenchmarkResult {
  name: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  standardDeviation: number;
  operationsPerSecond: number;
  memoryUsage: {
    before: number;
    after: number;
    peak: number;
  };
  success: boolean;
  error?: string;
}

// 基准测试套件结果
export interface BenchmarkSuiteResult {
  name: string;
  results: BenchmarkResult[];
  totalTime: number;
  passedTests: number;
  failedTests: number;
  timestamp: number;
}

// 性能回归检测结果
export interface RegressionResult {
  metric: string;
  current: number;
  baseline: number;
  change: number;
  changePercent: number;
  isRegression: boolean;
  severity: 'low' | 'medium' | 'high';
}

/**
 * 性能基准测试器
 */
export class PerformanceBenchmark {
  private baselines = new Map<string, BenchmarkResult>();
  private history = new Map<string, BenchmarkResult[]>();

  /**
   * 运行单个基准测试
   */
  async runBenchmark(
    name: string,
    testFn: () => Promise<any> | any,
    config: Partial<BenchmarkConfig> = {}
  ): Promise<BenchmarkResult> {
    const fullConfig: BenchmarkConfig = {
      name,
      description: '',
      iterations: 100,
      warmupIterations: 10,
      timeout: 30000,
      ...config
    };

    const times: number[] = [];
    const memoryBefore = this.getMemoryUsage();
    let memoryPeak = memoryBefore;
    let error: string | undefined;
    let success = true;

    try {
      // 设置阶段
      if (fullConfig.setup) {
        await fullConfig.setup();
      }

      // 预热阶段
      for (let i = 0; i < fullConfig.warmupIterations; i++) {
        if (fullConfig.beforeEach) await fullConfig.beforeEach();
        await testFn();
        if (fullConfig.afterEach) await fullConfig.afterEach();
      }

      // 正式测试阶段
      for (let i = 0; i < fullConfig.iterations; i++) {
        if (fullConfig.beforeEach) await fullConfig.beforeEach();

        const startTime = performance.now();
        await testFn();
        const endTime = performance.now();

        times.push(endTime - startTime);

        // 监控内存使用
        const currentMemory = this.getMemoryUsage();
        if (currentMemory > memoryPeak) {
          memoryPeak = currentMemory;
        }

        if (fullConfig.afterEach) await fullConfig.afterEach();

        // 检查超时
        if (endTime - startTime > fullConfig.timeout) {
          throw new Error(`Test timed out after ${fullConfig.timeout}ms`);
        }
      }

      // 清理阶段
      if (fullConfig.teardown) {
        await fullConfig.teardown();
      }
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : String(err);
    }

    const memoryAfter = this.getMemoryUsage();
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const standardDeviation = this.calculateStandardDeviation(times, averageTime);

    const result: BenchmarkResult = {
      name,
      iterations: times.length,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      standardDeviation,
      operationsPerSecond: 1000 / averageTime,
      memoryUsage: {
        before: memoryBefore,
        after: memoryAfter,
        peak: memoryPeak
      },
      success,
      error
    };

    // 保存到历史记录
    this.saveToHistory(name, result);

    return result;
  }

  /**
   * 运行基准测试套件
   */
  async runSuite(
    name: string,
    tests: Array<{
      name: string;
      fn: () => Promise<any> | any;
      config?: Partial<BenchmarkConfig>;
    }>
  ): Promise<BenchmarkSuiteResult> {
    const results: BenchmarkResult[] = [];
    const startTime = performance.now();

    for (const test of tests) {
      try {
        const result = await this.runBenchmark(test.name, test.fn, test.config);
        results.push(result);
      } catch (error) {
        results.push({
          name: test.name,
          iterations: 0,
          totalTime: 0,
          averageTime: 0,
          minTime: 0,
          maxTime: 0,
          standardDeviation: 0,
          operationsPerSecond: 0,
          memoryUsage: { before: 0, after: 0, peak: 0 },
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    const totalTime = performance.now() - startTime;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    return {
      name,
      results,
      totalTime,
      passedTests,
      failedTests,
      timestamp: Date.now()
    };
  }

  /**
   * 设置基线
   */
  setBaseline(name: string, result: BenchmarkResult) {
    this.baselines.set(name, result);
  }

  /**
   * 检测性能回归
   */
  detectRegression(
    current: BenchmarkResult,
    threshold: number = 0.1 // 10% 阈值
  ): RegressionResult[] {
    const baseline = this.baselines.get(current.name);
    if (!baseline) {
      return [];
    }

    const regressions: RegressionResult[] = [];

    // 检查平均时间回归
    const avgTimeChange = current.averageTime - baseline.averageTime;
    const avgTimeChangePercent = avgTimeChange / baseline.averageTime;

    if (Math.abs(avgTimeChangePercent) > threshold) {
      regressions.push({
        metric: 'averageTime',
        current: current.averageTime,
        baseline: baseline.averageTime,
        change: avgTimeChange,
        changePercent: avgTimeChangePercent * 100,
        isRegression: avgTimeChangePercent > 0,
        severity: this.calculateSeverity(Math.abs(avgTimeChangePercent))
      });
    }

    // 检查内存使用回归
    const memoryChange = current.memoryUsage.peak - baseline.memoryUsage.peak;
    const memoryChangePercent = memoryChange / baseline.memoryUsage.peak;

    if (Math.abs(memoryChangePercent) > threshold) {
      regressions.push({
        metric: 'memoryUsage',
        current: current.memoryUsage.peak,
        baseline: baseline.memoryUsage.peak,
        change: memoryChange,
        changePercent: memoryChangePercent * 100,
        isRegression: memoryChangePercent > 0,
        severity: this.calculateSeverity(Math.abs(memoryChangePercent))
      });
    }

    // 检查操作每秒回归
    const opsChange = current.operationsPerSecond - baseline.operationsPerSecond;
    const opsChangePercent = opsChange / baseline.operationsPerSecond;

    if (Math.abs(opsChangePercent) > threshold) {
      regressions.push({
        metric: 'operationsPerSecond',
        current: current.operationsPerSecond,
        baseline: baseline.operationsPerSecond,
        change: opsChange,
        changePercent: opsChangePercent * 100,
        isRegression: opsChangePercent < 0, // 操作数减少是回归
        severity: this.calculateSeverity(Math.abs(opsChangePercent))
      });
    }

    return regressions;
  }

  /**
   * 生成性能报告
   */
  generateReport(suiteResult: BenchmarkSuiteResult): string {
    let report = `# 性能基准测试报告\n\n`;
    report += `**测试套件**: ${suiteResult.name}\n`;
    report += `**执行时间**: ${new Date(suiteResult.timestamp).toLocaleString()}\n`;
    report += `**总耗时**: ${suiteResult.totalTime.toFixed(2)}ms\n`;
    report += `**通过测试**: ${suiteResult.passedTests}\n`;
    report += `**失败测试**: ${suiteResult.failedTests}\n\n`;

    report += `## 测试结果\n\n`;

    suiteResult.results.forEach(result => {
      report += `### ${result.name}\n\n`;
      
      if (result.success) {
        report += `- **迭代次数**: ${result.iterations}\n`;
        report += `- **平均时间**: ${result.averageTime.toFixed(2)}ms\n`;
        report += `- **最小时间**: ${result.minTime.toFixed(2)}ms\n`;
        report += `- **最大时间**: ${result.maxTime.toFixed(2)}ms\n`;
        report += `- **标准差**: ${result.standardDeviation.toFixed(2)}ms\n`;
        report += `- **操作/秒**: ${result.operationsPerSecond.toFixed(2)}\n`;
        report += `- **内存使用**: ${this.formatBytes(result.memoryUsage.peak)}\n`;

        // 检查回归
        const regressions = this.detectRegression(result);
        if (regressions.length > 0) {
          report += `- **性能回归**:\n`;
          regressions.forEach(reg => {
            const icon = reg.isRegression ? '⚠️' : '✅';
            report += `  - ${icon} ${reg.metric}: ${reg.changePercent.toFixed(2)}% (${reg.severity})\n`;
          });
        }
      } else {
        report += `- **状态**: ❌ 失败\n`;
        report += `- **错误**: ${result.error}\n`;
      }

      report += `\n`;
    });

    return report;
  }

  /**
   * 导出基准测试数据
   */
  exportData(): {
    baselines: Record<string, BenchmarkResult>;
    history: Record<string, BenchmarkResult[]>;
  } {
    return {
      baselines: Object.fromEntries(this.baselines),
      history: Object.fromEntries(this.history)
    };
  }

  /**
   * 导入基准测试数据
   */
  importData(data: {
    baselines?: Record<string, BenchmarkResult>;
    history?: Record<string, BenchmarkResult[]>;
  }) {
    if (data.baselines) {
      this.baselines = new Map(Object.entries(data.baselines));
    }
    if (data.history) {
      this.history = new Map(Object.entries(data.history));
    }
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

  /**
   * 计算严重程度
   */
  private calculateSeverity(changePercent: number): 'low' | 'medium' | 'high' {
    if (changePercent > 0.5) return 'high'; // 50%+
    if (changePercent > 0.2) return 'medium'; // 20%+
    return 'low';
  }

  /**
   * 格式化字节数
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 保存到历史记录
   */
  private saveToHistory(name: string, result: BenchmarkResult) {
    if (!this.history.has(name)) {
      this.history.set(name, []);
    }
    
    const history = this.history.get(name)!;
    history.push(result);
    
    // 保留最近50次记录
    if (history.length > 50) {
      history.shift();
    }
  }
}

/**
 * 预定义的基准测试
 */
export class PredefinedBenchmarks {
  private benchmark = new PerformanceBenchmark();

  /**
   * DOM 操作基准测试
   */
  async domOperations(): Promise<BenchmarkSuiteResult> {
    return this.benchmark.runSuite('DOM Operations', [
      {
        name: 'createElement',
        fn: () => {
          const element = document.createElement('div');
          element.className = 'test-element';
          element.textContent = 'Test content';
          return element;
        }
      },
      {
        name: 'appendChild',
        fn: () => {
          const parent = document.createElement('div');
          const child = document.createElement('span');
          parent.appendChild(child);
          return parent;
        }
      },
      {
        name: 'querySelector',
        fn: () => {
          return document.querySelector('body');
        }
      },
      {
        name: 'querySelectorAll',
        fn: () => {
          return document.querySelectorAll('div');
        }
      }
    ]);
  }

  /**
   * 数组操作基准测试
   */
  async arrayOperations(): Promise<BenchmarkSuiteResult> {
    const testArray = Array.from({ length: 1000 }, (_, i) => i);

    return this.benchmark.runSuite('Array Operations', [
      {
        name: 'map',
        fn: () => testArray.map(x => x * 2)
      },
      {
        name: 'filter',
        fn: () => testArray.filter(x => x % 2 === 0)
      },
      {
        name: 'reduce',
        fn: () => testArray.reduce((sum, x) => sum + x, 0)
      },
      {
        name: 'forEach',
        fn: () => {
          let sum = 0;
          testArray.forEach(x => sum += x);
          return sum;
        }
      },
      {
        name: 'for loop',
        fn: () => {
          let sum = 0;
          for (let i = 0; i < testArray.length; i++) {
            sum += testArray[i];
          }
          return sum;
        }
      }
    ]);
  }

  /**
   * 字符串操作基准测试
   */
  async stringOperations(): Promise<BenchmarkSuiteResult> {
    const testString = 'Hello World '.repeat(100);

    return this.benchmark.runSuite('String Operations', [
      {
        name: 'concat',
        fn: () => testString.concat('!'.repeat(10))
      },
      {
        name: 'template literal',
        fn: () => `${testString}${'!'.repeat(10)}`
      },
      {
        name: 'split',
        fn: () => testString.split(' ')
      },
      {
        name: 'replace',
        fn: () => testString.replace(/World/g, 'Universe')
      },
      {
        name: 'indexOf',
        fn: () => testString.indexOf('World')
      }
    ]);
  }

  /**
   * 运行所有预定义基准测试
   */
  async runAll(): Promise<BenchmarkSuiteResult[]> {
    return Promise.all([
      this.domOperations(),
      this.arrayOperations(),
      this.stringOperations()
    ]);
  }
}

// 全局基准测试实例
export const performanceBenchmark = new PerformanceBenchmark();
export const predefinedBenchmarks = new PredefinedBenchmarks();