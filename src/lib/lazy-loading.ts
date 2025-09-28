/**
 * 懒加载工具库
 * 提供组件级和页面级的代码分割和懒加载功能
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import dynamic from 'next/dynamic';

// 懒加载配置接口
export interface LazyLoadConfig {
  loading?: ComponentType;
  error?: ComponentType<{ error: Error; retry: () => void }>;
  delay?: number;
  timeout?: number;
  ssr?: boolean;
}

// 默认加载组件
const DefaultLoading = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

// 默认错误组件
const DefaultError = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-4 text-center">
    <div className="text-destructive mb-2">加载失败</div>
    <div className="text-sm text-muted-foreground mb-4">{error.message}</div>
    <button
      onClick={retry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      重试
    </button>
  </div>
);

/**
 * 创建懒加载组件（客户端）
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: LazyLoadConfig = {}
): LazyExoticComponent<T> {
  const LazyComponent = lazy(importFn);
  
  // 返回包装后的组件，包含错误边界
  return lazy(async () => {
    try {
      const module = await importFn();
      return { default: module.default };
    } catch (error) {
      console.error('Lazy loading failed:', error);
      throw error;
    }
  });
}

/**
 * 创建动态组件（支持SSR）
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: LazyLoadConfig = {}
) {
  return dynamic(importFn, {
    loading: config.loading || DefaultLoading,
    ssr: config.ssr !== false,
  });
}

/**
 * 预加载组件
 */
export function preloadComponent(importFn: () => Promise<any>): Promise<any> {
  return importFn();
}

/**
 * 批量预加载组件
 */
export async function preloadComponents(
  importFns: Array<() => Promise<any>>
): Promise<any[]> {
  return Promise.all(importFns.map(fn => preloadComponent(fn)));
}

/**
 * 条件懒加载 - 根据条件决定是否懒加载
 */
export function createConditionalLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  condition: () => boolean,
  fallback?: ComponentType,
  config: LazyLoadConfig = {}
) {
  if (condition()) {
    return createDynamicComponent(importFn, config);
  }
  
  return fallback || (() => null);
}

/**
 * 路由级懒加载
 */
export function createLazyPage<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: LazyLoadConfig = {}
) {
  return createDynamicComponent(importFn, {
    ...config,
    ssr: true, // 页面默认启用SSR
  });
}

/**
 * 模块级懒加载
 */
export function createLazyModule<T>(
  importFn: () => Promise<T>
): () => Promise<T> {
  let modulePromise: Promise<T> | null = null;
  
  return () => {
    if (!modulePromise) {
      modulePromise = importFn();
    }
    return modulePromise;
  };
}

/**
 * 懒加载Hook
 */
export function createLazyHook<T extends (...args: any[]) => any>(
  importFn: () => Promise<{ default: T }>
): () => Promise<T> {
  return createLazyModule(async () => {
    const module = await importFn();
    return module.default;
  });
}

/**
 * 智能懒加载 - 基于视口和用户交互
 */
export function createSmartLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    threshold?: number; // 视口阈值
    rootMargin?: string; // 根边距
    triggerOnHover?: boolean; // 悬停时预加载
    triggerOnFocus?: boolean; // 聚焦时预加载
  } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnHover = true,
    triggerOnFocus = true,
  } = options;

  return createDynamicComponent(importFn, {
    loading: () => (
      <div 
        className="lazy-placeholder"
        style={{ minHeight: '100px' }}
        onMouseEnter={triggerOnHover ? () => preloadComponent(importFn) : undefined}
        onFocus={triggerOnFocus ? () => preloadComponent(importFn) : undefined}
      >
        <DefaultLoading />
      </div>
    ),
  });
}

/**
 * 懒加载管理器
 */
export class LazyLoadManager {
  private preloadedModules = new Set<string>();
  private loadingModules = new Map<string, Promise<any>>();

  /**
   * 注册预加载模块
   */
  registerPreload(key: string, importFn: () => Promise<any>) {
    if (!this.preloadedModules.has(key) && !this.loadingModules.has(key)) {
      const promise = importFn();
      this.loadingModules.set(key, promise);
      
      promise.then(() => {
        this.preloadedModules.add(key);
        this.loadingModules.delete(key);
      }).catch(() => {
        this.loadingModules.delete(key);
      });
    }
  }

  /**
   * 批量预加载
   */
  async batchPreload(modules: Array<{ key: string; importFn: () => Promise<any> }>) {
    const promises = modules.map(({ key, importFn }) => {
      this.registerPreload(key, importFn);
      return this.loadingModules.get(key) || Promise.resolve();
    });

    await Promise.allSettled(promises);
  }

  /**
   * 检查模块是否已预加载
   */
  isPreloaded(key: string): boolean {
    return this.preloadedModules.has(key);
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.preloadedModules.clear();
    this.loadingModules.clear();
  }
}

// 全局懒加载管理器实例
export const lazyLoadManager = new LazyLoadManager();

/**
 * 懒加载装饰器（用于类组件）
 */
export function LazyLoad(
  importFn: () => Promise<any>,
  config: LazyLoadConfig = {}
) {
  return function <T extends ComponentType<any>>(target: T): T {
    return createDynamicComponent(() => Promise.resolve({ default: target }), config) as T;
  };
}

/**
 * 路由预加载策略
 */
export const RoutePreloadStrategy = {
  // 预加载所有路由
  preloadAll: async (routes: Array<() => Promise<any>>) => {
    await preloadComponents(routes);
  },

  // 预加载关键路由
  preloadCritical: async (criticalRoutes: Array<() => Promise<any>>) => {
    await preloadComponents(criticalRoutes);
  },

  // 智能预加载（基于用户行为）
  preloadSmart: (routes: Record<string, () => Promise<any>>) => {
    // 监听链接悬停事件
    if (typeof window !== 'undefined') {
      document.addEventListener('mouseover', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a[href]') as HTMLAnchorElement;
        
        if (link && routes[link.pathname]) {
          preloadComponent(routes[link.pathname]);
        }
      });
    }
  },
};