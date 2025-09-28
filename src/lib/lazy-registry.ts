/**
 * 懒加载注册表
 * 统一管理所有懒加载组件和页面
 */

import { ComponentType, LazyExoticComponent } from 'react';
import { createDynamicComponent, createLazyComponent, preloadComponent } from './lazy-loading';
import { PerformanceMonitor } from './bundle-optimization';

// 懒加载组件配置
export interface LazyComponentConfig {
  name: string;
  importFn: () => Promise<{ default: ComponentType<any> }>;
  preload?: boolean;
  priority?: number;
  category?: 'ui' | 'page' | 'feature' | 'utility';
  dependencies?: string[];
  ssr?: boolean;
}

// 懒加载注册表
export class LazyRegistry {
  private components = new Map<string, LazyComponentConfig>();
  private loadedComponents = new Map<string, ComponentType<any>>();
  private preloadPromises = new Map<string, Promise<any>>();

  /**
   * 注册懒加载组件
   */
  register(config: LazyComponentConfig) {
    this.components.set(config.name, config);
    
    // 如果设置了预加载，立即开始预加载
    if (config.preload) {
      this.preload(config.name);
    }
  }

  /**
   * 批量注册组件
   */
  registerBatch(configs: LazyComponentConfig[]) {
    configs.forEach(config => this.register(config));
  }

  /**
   * 获取懒加载组件
   */
  get(name: string): ComponentType<any> | null {
    const config = this.components.get(name);
    if (!config) {
      console.warn(`懒加载组件 "${name}" 未找到`);
      return null;
    }

    // 如果已经加载，直接返回
    if (this.loadedComponents.has(name)) {
      return this.loadedComponents.get(name)!;
    }

    // 创建懒加载组件
    const LazyComponent = createDynamicComponent(
      PerformanceMonitor.monitorComponentLoad(name, config.importFn),
      {
        ssr: config.ssr,
      }
    );

    this.loadedComponents.set(name, LazyComponent);
    return LazyComponent;
  }

  /**
   * 预加载组件
   */
  async preload(name: string): Promise<any> {
    const config = this.components.get(name);
    if (!config) {
      throw new Error(`懒加载组件 "${name}" 未找到`);
    }

    // 如果已经在预加载，返回现有的 Promise
    if (this.preloadPromises.has(name)) {
      return this.preloadPromises.get(name);
    }

    // 开始预加载
    const preloadPromise = preloadComponent(config.importFn);
    this.preloadPromises.set(name, preloadPromise);

    try {
      await preloadPromise;
      console.log(`[LazyRegistry] 预加载完成: ${name}`);
    } catch (error) {
      console.error(`[LazyRegistry] 预加载失败: ${name}`, error);
      this.preloadPromises.delete(name);
      throw error;
    }

    return preloadPromise;
  }

  /**
   * 批量预加载
   */
  async preloadBatch(names: string[]): Promise<void> {
    const promises = names.map(name => this.preload(name));
    await Promise.allSettled(promises);
  }

  /**
   * 按优先级预加载
   */
  async preloadByPriority(minPriority: number = 0): Promise<void> {
    const highPriorityComponents = Array.from(this.components.entries())
      .filter(([_, config]) => (config.priority || 0) >= minPriority)
      .sort(([_, a], [__, b]) => (b.priority || 0) - (a.priority || 0))
      .map(([name]) => name);

    await this.preloadBatch(highPriorityComponents);
  }

  /**
   * 按类别预加载
   */
  async preloadByCategory(category: LazyComponentConfig['category']): Promise<void> {
    const categoryComponents = Array.from(this.components.entries())
      .filter(([_, config]) => config.category === category)
      .map(([name]) => name);

    await this.preloadBatch(categoryComponents);
  }

  /**
   * 智能预加载
   */
  async smartPreload(context: {
    route?: string;
    userAgent?: string;
    connection?: 'slow' | 'fast';
    memory?: 'low' | 'high';
  } = {}): Promise<void> {
    const { route, connection = 'fast', memory = 'high' } = context;

    // 根据路由预加载相关组件
    if (route) {
      await this.preloadForRoute(route);
    }

    // 根据设备性能调整预加载策略
    if (connection === 'fast' && memory === 'high') {
      // 高性能设备，预加载更多组件
      await this.preloadByPriority(1);
    } else {
      // 低性能设备，只预加载关键组件
      await this.preloadByPriority(5);
    }
  }

  /**
   * 为特定路由预加载组件
   */
  async preloadForRoute(route: string): Promise<void> {
    const routeComponents = this.getComponentsForRoute(route);
    await this.preloadBatch(routeComponents);
  }

  /**
   * 获取路由相关的组件
   */
  private getComponentsForRoute(route: string): string[] {
    // 根据路由匹配相关组件
    const routeMap: Record<string, string[]> = {
      '/': ['Button', 'Card', 'Input'],
      '/dashboard': ['DataTable', 'Chart', 'StatCard'],
      '/forms': ['Form', 'Input', 'Select', 'DatePicker'],
      '/tables': ['DataTable', 'Pagination', 'Filter'],
    };

    return routeMap[route] || [];
  }

  /**
   * 获取所有已注册的组件
   */
  getAll(): Record<string, LazyComponentConfig> {
    return Object.fromEntries(this.components);
  }

  /**
   * 获取组件统计信息
   */
  getStats(): {
    total: number;
    loaded: number;
    preloaded: number;
    byCategory: Record<string, number>;
  } {
    const total = this.components.size;
    const loaded = this.loadedComponents.size;
    const preloaded = this.preloadPromises.size;

    const byCategory: Record<string, number> = {};
    this.components.forEach(config => {
      const category = config.category || 'unknown';
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    return { total, loaded, preloaded, byCategory };
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.loadedComponents.clear();
    this.preloadPromises.clear();
  }

  /**
   * 移除组件
   */
  unregister(name: string) {
    this.components.delete(name);
    this.loadedComponents.delete(name);
    this.preloadPromises.delete(name);
  }
}

// 全局懒加载注册表实例
export const lazyRegistry = new LazyRegistry();

// 注册常用组件
lazyRegistry.registerBatch([
  // UI 基础组件
  {
    name: 'Button',
    importFn: () => import('../components/ui/button'),
    preload: true,
    priority: 10,
    category: 'ui',
    ssr: true,
  },
  {
    name: 'Input',
    importFn: () => import('../components/ui/input'),
    preload: true,
    priority: 10,
    category: 'ui',
    ssr: true,
  },
  {
    name: 'Card',
    importFn: () => import('../components/ui/card'),
    preload: true,
    priority: 9,
    category: 'ui',
    ssr: true,
  },
  {
    name: 'Table',
    importFn: () => import('../components/ui/table'),
    preload: false,
    priority: 7,
    category: 'ui',
    ssr: true,
  },

  // 复合组件
  {
    name: 'BasicForm',
    importFn: () => import('../components/forms/BasicForm'),
    preload: false,
    priority: 6,
    category: 'feature',
    dependencies: ['Button', 'Input'],
    ssr: true,
  },
  {
    name: 'BasicTable',
    importFn: () => import('../components/lists/BasicTable'),
    preload: false,
    priority: 6,
    category: 'feature',
    dependencies: ['Table', 'Button'],
    ssr: true,
  },
  {
    name: 'EnhancedDataTable',
    importFn: () => import('../components/composite/enhanced-data-table'),
    preload: false,
    priority: 5,
    category: 'feature',
    dependencies: ['Table', 'Button', 'Input'],
    ssr: false,
  },

  // 性能组件
  {
    name: 'VirtualList',
    importFn: () => import('../components/performance/VirtualList'),
    preload: false,
    priority: 3,
    category: 'utility',
    ssr: false,
  },
  {
    name: 'ImageOptimizer',
    importFn: () => import('../components/performance/ImageOptimizer'),
    preload: false,
    priority: 4,
    category: 'utility',
    ssr: false,
  },

  // 开发工具组件
  {
    name: 'PerformanceMonitor',
    importFn: () => import('../components/performance/PerformanceMonitor'),
    preload: false,
    priority: 1,
    category: 'utility',
    ssr: false,
  },
]);

// 导出便捷函数
export const getLazyComponent = (name: string) => lazyRegistry.get(name);
export const preloadComponent = (name: string) => lazyRegistry.preload(name);
export const preloadComponents = (names: string[]) => lazyRegistry.preloadBatch(names);

// 路由预加载助手
export const preloadForRoute = (route: string) => lazyRegistry.preloadForRoute(route);

// 智能预加载助手
export const smartPreload = (context?: Parameters<typeof lazyRegistry.smartPreload>[0]) => 
  lazyRegistry.smartPreload(context);