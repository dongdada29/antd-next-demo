/**
 * Bundle 优化工具
 * 提供代码分割、Tree Shaking 和包大小优化功能
 */

import { ComponentType } from 'react';

// Bundle 分析接口
export interface BundleAnalysis {
  size: number;
  gzipSize: number;
  modules: string[];
  dependencies: string[];
  duplicates: string[];
}

// 代码分割策略
export enum SplitStrategy {
  BY_ROUTE = 'route',
  BY_FEATURE = 'feature',
  BY_VENDOR = 'vendor',
  BY_SIZE = 'size',
  CUSTOM = 'custom',
}

// 分割配置
export interface SplitConfig {
  strategy: SplitStrategy;
  threshold?: number; // 大小阈值（KB）
  maxChunks?: number; // 最大块数
  minChunks?: number; // 最小块数
  priority?: number; // 优先级
  enforce?: boolean; // 强制分割
}

/**
 * 动态导入工具
 */
export class DynamicImportHelper {
  private static importCache = new Map<string, Promise<any>>();

  /**
   * 缓存动态导入
   */
  static async cachedImport<T>(
    key: string,
    importFn: () => Promise<T>
  ): Promise<T> {
    if (!this.importCache.has(key)) {
      this.importCache.set(key, importFn());
    }
    return this.importCache.get(key)!;
  }

  /**
   * 条件导入
   */
  static async conditionalImport<T>(
    condition: boolean | (() => boolean),
    importFn: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    const shouldImport = typeof condition === 'function' ? condition() : condition;
    
    if (shouldImport) {
      return await importFn();
    }
    
    return fallback;
  }

  /**
   * 延迟导入
   */
  static delayedImport<T>(
    importFn: () => Promise<T>,
    delay: number = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await importFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  /**
   * 批量导入
   */
  static async batchImport<T>(
    imports: Array<() => Promise<T>>,
    concurrency: number = 3
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < imports.length; i += concurrency) {
      const batch = imports.slice(i, i + concurrency);
      const batchResults = await Promise.all(batch.map(fn => fn()));
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * 清理导入缓存
   */
  static clearCache() {
    this.importCache.clear();
  }
}

/**
 * Tree Shaking 优化器
 */
export class TreeShakingOptimizer {
  /**
   * 标记为纯函数（帮助 Tree Shaking）
   */
  static pure<T extends (...args: any[]) => any>(fn: T): T {
    // @ts-ignore
    fn.__PURE__ = true;
    return fn;
  }

  /**
   * 条件导出（避免未使用的代码）
   */
  static conditionalExport<T>(
    condition: boolean,
    exportFn: () => T
  ): T | undefined {
    return condition ? exportFn() : undefined;
  }

  /**
   * 懒导出
   */
  static lazyExport<T>(exportFn: () => T): () => T {
    let cached: T;
    let initialized = false;

    return () => {
      if (!initialized) {
        cached = exportFn();
        initialized = true;
      }
      return cached;
    };
  }
}

/**
 * 代码分割助手
 */
export class CodeSplittingHelper {
  /**
   * 按路由分割
   */
  static splitByRoute(routes: Record<string, () => Promise<any>>) {
    const splitRoutes: Record<string, ComponentType> = {};

    Object.entries(routes).forEach(([path, importFn]) => {
      splitRoutes[path] = TreeShakingOptimizer.pure(() => {
        const LazyComponent = React.lazy(importFn);
        return LazyComponent;
      })();
    });

    return splitRoutes;
  }

  /**
   * 按功能分割
   */
  static splitByFeature(features: Record<string, () => Promise<any>>) {
    return Object.entries(features).reduce((acc, [name, importFn]) => {
      acc[name] = TreeShakingOptimizer.lazyExport(() => importFn());
      return acc;
    }, {} as Record<string, () => Promise<any>>);
  }

  /**
   * 按大小分割
   */
  static splitBySize(
    modules: Array<{ name: string; importFn: () => Promise<any>; size: number }>,
    threshold: number = 100 // KB
  ) {
    const large: typeof modules = [];
    const small: typeof modules = [];

    modules.forEach(module => {
      if (module.size > threshold) {
        large.push(module);
      } else {
        small.push(module);
      }
    });

    return { large, small };
  }

  /**
   * 智能分割
   */
  static smartSplit(
    modules: Array<{
      name: string;
      importFn: () => Promise<any>;
      priority: number;
      frequency: number;
    }>
  ) {
    // 按优先级和使用频率排序
    const sorted = modules.sort((a, b) => {
      const scoreA = a.priority * 0.7 + a.frequency * 0.3;
      const scoreB = b.priority * 0.7 + b.frequency * 0.3;
      return scoreB - scoreA;
    });

    const critical = sorted.slice(0, Math.ceil(sorted.length * 0.2));
    const important = sorted.slice(
      Math.ceil(sorted.length * 0.2),
      Math.ceil(sorted.length * 0.6)
    );
    const deferred = sorted.slice(Math.ceil(sorted.length * 0.6));

    return { critical, important, deferred };
  }
}

/**
 * Bundle 分析器
 */
export class BundleAnalyzer {
  /**
   * 分析组件大小
   */
  static async analyzeComponent(
    component: ComponentType,
    name: string
  ): Promise<Partial<BundleAnalysis>> {
    // 在开发环境中提供基本分析
    if (process.env.NODE_ENV === 'development') {
      return {
        modules: [name],
        dependencies: [],
        duplicates: [],
      };
    }

    // 生产环境中的实际分析需要构建时工具
    return {
      modules: [name],
      dependencies: [],
      duplicates: [],
    };
  }

  /**
   * 检测重复依赖
   */
  static detectDuplicates(modules: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    modules.forEach(module => {
      if (seen.has(module)) {
        duplicates.add(module);
      } else {
        seen.add(module);
      }
    });

    return Array.from(duplicates);
  }

  /**
   * 计算优化建议
   */
  static getOptimizationSuggestions(analysis: BundleAnalysis): string[] {
    const suggestions: string[] = [];

    if (analysis.size > 500 * 1024) { // 500KB
      suggestions.push('考虑进一步拆分大型模块');
    }

    if (analysis.duplicates.length > 0) {
      suggestions.push(`发现重复依赖: ${analysis.duplicates.join(', ')}`);
    }

    if (analysis.modules.length > 50) {
      suggestions.push('模块数量较多，考虑合并相关模块');
    }

    return suggestions;
  }
}

/**
 * 预加载策略管理器
 */
export class PreloadStrategyManager {
  private strategies = new Map<string, () => Promise<any>>();

  /**
   * 注册预加载策略
   */
  register(name: string, strategy: () => Promise<any>) {
    this.strategies.set(name, strategy);
  }

  /**
   * 执行预加载策略
   */
  async execute(name: string): Promise<any> {
    const strategy = this.strategies.get(name);
    if (!strategy) {
      throw new Error(`预加载策略 "${name}" 未找到`);
    }
    return await strategy();
  }

  /**
   * 批量执行策略
   */
  async executeAll(names: string[]): Promise<any[]> {
    const promises = names.map(name => this.execute(name));
    return await Promise.allSettled(promises);
  }

  /**
   * 智能预加载
   */
  async smartPreload(
    context: {
      userAgent?: string;
      connection?: 'slow' | 'fast';
      battery?: 'low' | 'high';
      memory?: 'low' | 'high';
    } = {}
  ) {
    const { connection = 'fast', battery = 'high', memory = 'high' } = context;

    // 根据设备条件调整预加载策略
    if (connection === 'slow' || battery === 'low' || memory === 'low') {
      // 只预加载关键资源
      await this.execute('critical');
    } else {
      // 预加载更多资源
      await this.executeAll(['critical', 'important']);
    }
  }
}

/**
 * 性能监控工具
 */
export class PerformanceMonitor {
  private static metrics = new Map<string, number>();

  /**
   * 记录加载时间
   */
  static recordLoadTime(key: string, startTime: number) {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    this.metrics.set(key, loadTime);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${key}: ${loadTime.toFixed(2)}ms`);
    }
  }

  /**
   * 获取性能指标
   */
  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * 清理指标
   */
  static clearMetrics() {
    this.metrics.clear();
  }

  /**
   * 监控组件加载
   */
  static monitorComponentLoad<T>(
    name: string,
    importFn: () => Promise<T>
  ): () => Promise<T> {
    return async () => {
      const startTime = performance.now();
      try {
        const result = await importFn();
        this.recordLoadTime(`component:${name}`, startTime);
        return result;
      } catch (error) {
        this.recordLoadTime(`component:${name}:error`, startTime);
        throw error;
      }
    };
  }
}

// 全局实例
export const preloadStrategyManager = new PreloadStrategyManager();

// 常用的预加载策略
preloadStrategyManager.register('critical', async () => {
  // 预加载关键组件
  const criticalComponents = [
    () => import('../components/ui/button'),
    () => import('../components/ui/input'),
    () => import('../components/ui/card'),
  ];
  
  await DynamicImportHelper.batchImport(criticalComponents, 2);
});

preloadStrategyManager.register('important', async () => {
  // 预加载重要组件
  const importantComponents = [
    () => import('../components/forms/BasicForm'),
    () => import('../components/lists/BasicTable'),
    () => import('../components/common/ErrorBoundary'),
  ];
  
  await DynamicImportHelper.batchImport(importantComponents, 3);
});

// React 导入（用于 lazy）
import React from 'react';