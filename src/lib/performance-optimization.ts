/**
 * 性能优化主入口
 * 集成所有性能优化功能的统一接口
 */

// 导出所有性能优化相关的模块
export * from './lazy-loading';
export * from './bundle-optimization';
export * from './lazy-registry';
export * from './performance-analyzer';
export * from './performance-benchmark';
export * from './performance-code-generator';
export * from './performance-testing';
export * from './prompts/performance-prompts';

// 导出性能优化 Hooks
export * from '../hooks/usePerformanceOptimization';

// 导出性能监控组件
export * from '../components/performance/PerformanceMonitor';
export * from '../components/performance/LazyLoader';

import { lazyRegistry } from './lazy-registry';
import { performanceAnalyzer } from './performance-analyzer';
import { performanceBenchmark } from './performance-benchmark';
import { PerformanceOptimizerFactory } from './performance-code-generator';
import { createPerformanceTestSuite, PERFORMANCE_TEST_CONFIGS } from './performance-testing';

/**
 * 性能优化管理器
 * 提供统一的性能优化接口
 */
export class PerformanceOptimizationManager {
  private static instance: PerformanceOptimizationManager;
  private isInitialized = false;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): PerformanceOptimizationManager {
    if (!PerformanceOptimizationManager.instance) {
      PerformanceOptimizationManager.instance = new PerformanceOptimizationManager();
    }
    return PerformanceOptimizationManager.instance;
  }

  /**
   * 初始化性能优化系统
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 1. 初始化懒加载注册表
      await this.initializeLazyLoading();

      // 2. 启动性能分析器
      await this.initializePerformanceAnalyzer();

      // 3. 设置性能基准
      await this.initializePerformanceBenchmarks();

      // 4. 配置性能测试
      await this.initializePerformanceTesting();

      this.isInitialized = true;
      console.log('[PerformanceOptimization] System initialized successfully');
    } catch (error) {
      console.error('[PerformanceOptimization] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * 初始化懒加载
   */
  private async initializeLazyLoading(): Promise<void> {
    // 预加载关键组件
    await lazyRegistry.preloadByPriority(5);
    
    // 智能预加载
    await lazyRegistry.smartPreload({
      connection: this.getConnectionType(),
      memory: this.getMemoryInfo()
    });
  }

  /**
   * 初始化性能分析器
   */
  private async initializePerformanceAnalyzer(): Promise<void> {
    // 性能分析器会自动开始收集指标
    // 这里可以添加自定义配置
  }

  /**
   * 初始化性能基准
   */
  private async initializePerformanceBenchmarks(): Promise<void> {
    // 设置基准数据（如果有历史数据）
    const savedData = this.loadBenchmarkData();
    if (savedData) {
      performanceBenchmark.importData(savedData);
    }
  }

  /**
   * 初始化性能测试
   */
  private async initializePerformanceTesting(): Promise<void> {
    // 创建默认的性能测试套件
    const testSuite = createPerformanceTestSuite();
    
    // 添加预定义的测试
    Object.values(PERFORMANCE_TEST_CONFIGS).forEach(config => {
      testSuite.addTest(config);
    });
  }

  /**
   * 生成优化的组件代码
   */
  async generateOptimizedComponent(
    prompt: string,
    level: 'basic' | 'advanced' | 'expert' = 'basic'
  ) {
    const optimizer = PerformanceOptimizerFactory.createComponentOptimizer(level);
    return await optimizer.generateOptimizedCode(prompt);
  }

  /**
   * 生成优化的 Hook 代码
   */
  async generateOptimizedHook(
    prompt: string,
    level: 'basic' | 'advanced' | 'expert' = 'basic'
  ) {
    const optimizer = PerformanceOptimizerFactory.createHookOptimizer(level);
    return await optimizer.generateOptimizedCode(prompt);
  }

  /**
   * 生成优化的页面代码
   */
  async generateOptimizedPage(
    prompt: string,
    level: 'basic' | 'advanced' | 'expert' = 'basic'
  ) {
    const optimizer = PerformanceOptimizerFactory.createPageOptimizer(level);
    return await optimizer.generateOptimizedCode(prompt);
  }

  /**
   * 运行性能分析
   */
  async runPerformanceAnalysis() {
    return await performanceAnalyzer.analyze();
  }

  /**
   * 运行性能基准测试
   */
  async runPerformanceBenchmarks() {
    const results = await Promise.all([
      performanceBenchmark.runBenchmark('dom-operations', () => {
        const div = document.createElement('div');
        div.textContent = 'Test';
        document.body.appendChild(div);
        document.body.removeChild(div);
      }),
      performanceBenchmark.runBenchmark('array-operations', () => {
        const arr = Array.from({ length: 1000 }, (_, i) => i);
        return arr.map(x => x * 2).filter(x => x % 2 === 0);
      })
    ]);

    return results;
  }

  /**
   * 获取性能报告
   */
  async getPerformanceReport(): Promise<{
    analysis: any;
    benchmarks: any[];
    recommendations: string[];
  }> {
    const [analysis, benchmarks] = await Promise.all([
      this.runPerformanceAnalysis(),
      this.runPerformanceBenchmarks()
    ]);

    const recommendations = [
      ...analysis.recommendations.map((r: any) => r.title),
      '定期运行性能测试',
      '监控关键性能指标',
      '优化关键渲染路径',
      '实现代码分割和懒加载'
    ];

    return {
      analysis,
      benchmarks,
      recommendations
    };
  }

  /**
   * 保存性能数据
   */
  savePerformanceData(): void {
    const data = {
      benchmarks: performanceBenchmark.exportData(),
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('performance-optimization-data', JSON.stringify(data));
    } catch (error) {
      console.warn('[PerformanceOptimization] Failed to save data:', error);
    }
  }

  /**
   * 加载基准数据
   */
  private loadBenchmarkData(): any {
    try {
      const data = localStorage.getItem('performance-optimization-data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('[PerformanceOptimization] Failed to load data:', error);
      return null;
    }
  }

  /**
   * 获取连接类型
   */
  private getConnectionType(): 'slow' | 'fast' {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;
      return ['slow-2g', '2g', '3g'].includes(effectiveType) ? 'slow' : 'fast';
    }
    return 'fast';
  }

  /**
   * 获取内存信息
   */
  private getMemoryInfo(): 'low' | 'high' {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const totalMemory = memory?.jsHeapSizeLimit || 0;
      return totalMemory < 1024 * 1024 * 1024 ? 'low' : 'high';
    }
    return 'high';
  }

  /**
   * 清理资源
   */
  dispose(): void {
    performanceAnalyzer.dispose();
    this.isInitialized = false;
  }
}

/**
 * 性能优化配置
 */
export interface PerformanceOptimizationConfig {
  enableLazyLoading: boolean;
  enablePerformanceMonitoring: boolean;
  enableBenchmarking: boolean;
  enableCodeOptimization: boolean;
  optimizationLevel: 'basic' | 'advanced' | 'expert';
  autoPreload: boolean;
  performanceThresholds: {
    renderTime: number;
    memoryUsage: number;
    bundleSize: number;
    loadTime: number;
  };
}

/**
 * 默认配置
 */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceOptimizationConfig = {
  enableLazyLoading: true,
  enablePerformanceMonitoring: true,
  enableBenchmarking: true,
  enableCodeOptimization: true,
  optimizationLevel: 'basic',
  autoPreload: true,
  performanceThresholds: {
    renderTime: 16, // 60fps
    memoryUsage: 50 * 1024 * 1024, // 50MB
    bundleSize: 250 * 1024, // 250KB
    loadTime: 3000 // 3s
  }
};

/**
 * 初始化性能优化系统
 */
export async function initializePerformanceOptimization(
  config: Partial<PerformanceOptimizationConfig> = {}
): Promise<PerformanceOptimizationManager> {
  const finalConfig = { ...DEFAULT_PERFORMANCE_CONFIG, ...config };
  const manager = PerformanceOptimizationManager.getInstance();
  
  await manager.initialize();
  
  return manager;
}

/**
 * 获取性能优化管理器实例
 */
export function getPerformanceOptimizationManager(): PerformanceOptimizationManager {
  return PerformanceOptimizationManager.getInstance();
}

// 便捷函数
export const optimizeComponent = async (prompt: string, level?: 'basic' | 'advanced' | 'expert') => {
  const manager = getPerformanceOptimizationManager();
  return await manager.generateOptimizedComponent(prompt, level);
};

export const optimizeHook = async (prompt: string, level?: 'basic' | 'advanced' | 'expert') => {
  const manager = getPerformanceOptimizationManager();
  return await manager.generateOptimizedHook(prompt, level);
};

export const optimizePage = async (prompt: string, level?: 'basic' | 'advanced' | 'expert') => {
  const manager = getPerformanceOptimizationManager();
  return await manager.generateOptimizedPage(prompt, level);
};

export const getPerformanceReport = async () => {
  const manager = getPerformanceOptimizationManager();
  return await manager.getPerformanceReport();
};