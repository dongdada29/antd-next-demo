/**
 * 性能优化 Hook
 * 提供组件级性能优化功能
 */

'use client';

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { lazyRegistry, preloadForRoute, smartPreload } from '../lib/lazy-registry';
import { PerformanceMonitor } from '../lib/bundle-optimization';

// 性能优化配置
export interface PerformanceConfig {
  enablePreload?: boolean;
  enableSmartPreload?: boolean;
  preloadOnHover?: boolean;
  preloadOnVisible?: boolean;
  monitorPerformance?: boolean;
  batchSize?: number;
  delay?: number;
}

// 性能指标
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
}

/**
 * 性能优化主 Hook
 */
export function usePerformanceOptimization(config: PerformanceConfig = {}) {
  const {
    enablePreload = true,
    enableSmartPreload = true,
    preloadOnHover = true,
    preloadOnVisible = true,
    monitorPerformance = true,
    batchSize = 3,
    delay = 100,
  } = config;

  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isOptimizing, setIsOptimizing] = useState(false);

  // 初始化性能优化
  useEffect(() => {
    if (enableSmartPreload) {
      const initOptimization = async () => {
        setIsOptimizing(true);
        try {
          await smartPreload({
            connection: getConnectionType(),
            memory: getMemoryInfo(),
          });
        } catch (error) {
          console.error('Smart preload failed:', error);
        } finally {
          setIsOptimizing(false);
        }
      };

      initOptimization();
    }
  }, [enableSmartPreload]);

  // 监控性能指标
  useEffect(() => {
    if (monitorPerformance) {
      const updateMetrics = () => {
        const performanceMetrics = PerformanceMonitor.getMetrics();
        setMetrics(performanceMetrics);
      };

      const interval = setInterval(updateMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [monitorPerformance]);

  // 预加载组件
  const preloadComponent = useCallback(async (name: string) => {
    if (enablePreload) {
      try {
        await lazyRegistry.preload(name);
      } catch (error) {
        console.error(`Failed to preload component: ${name}`, error);
      }
    }
  }, [enablePreload]);

  // 批量预加载
  const preloadComponents = useCallback(async (names: string[]) => {
    if (enablePreload) {
      const batches = [];
      for (let i = 0; i < names.length; i += batchSize) {
        batches.push(names.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        await Promise.allSettled(
          batch.map(name => lazyRegistry.preload(name))
        );
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }, [enablePreload, batchSize, delay]);

  // 路由预加载
  const preloadRoute = useCallback(async (route: string) => {
    if (enablePreload) {
      try {
        await preloadForRoute(route);
      } catch (error) {
        console.error(`Failed to preload route: ${route}`, error);
      }
    }
  }, [enablePreload]);

  return {
    metrics,
    isOptimizing,
    preloadComponent,
    preloadComponents,
    preloadRoute,
    stats: lazyRegistry.getStats(),
  };
}

/**
 * 组件预加载 Hook
 */
export function useComponentPreload(componentName: string, options: {
  preloadOnMount?: boolean;
  preloadOnHover?: boolean;
  preloadOnVisible?: boolean;
} = {}) {
  const {
    preloadOnMount = false,
    preloadOnHover = true,
    preloadOnVisible = false,
  } = options;

  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  // 预加载函数
  const preload = useCallback(async () => {
    if (isPreloaded || isLoading) return;

    setIsLoading(true);
    try {
      await lazyRegistry.preload(componentName);
      setIsPreloaded(true);
    } catch (error) {
      console.error(`Failed to preload ${componentName}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [componentName, isPreloaded, isLoading]);

  // 挂载时预加载
  useEffect(() => {
    if (preloadOnMount) {
      preload();
    }
  }, [preloadOnMount, preload]);

  // 可见时预加载
  useEffect(() => {
    if (!preloadOnVisible || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preload();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [preloadOnVisible, preload]);

  // 悬停事件处理
  const handleMouseEnter = useCallback(() => {
    if (preloadOnHover) {
      preload();
    }
  }, [preloadOnHover, preload]);

  return {
    isPreloaded,
    isLoading,
    preload,
    elementRef,
    handleMouseEnter,
  };
}

/**
 * 路由预加载 Hook
 */
export function useRoutePreload() {
  const preloadedRoutes = useRef(new Set<string>());

  const preloadRoute = useCallback(async (route: string) => {
    if (preloadedRoutes.current.has(route)) return;

    try {
      await preloadForRoute(route);
      preloadedRoutes.current.add(route);
    } catch (error) {
      console.error(`Failed to preload route: ${route}`, error);
    }
  }, []);

  // 监听链接悬停
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href.startsWith(window.location.origin)) {
        const route = new URL(link.href).pathname;
        preloadRoute(route);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [preloadRoute]);

  return { preloadRoute };
}

/**
 * 性能监控 Hook
 */
export function usePerformanceMonitor(componentName: string) {
  const startTimeRef = useRef<number>();
  const [metrics, setMetrics] = useState<{
    renderTime?: number;
    updateCount: number;
    lastUpdate: number;
  }>({
    updateCount: 0,
    lastUpdate: Date.now(),
  });

  // 开始监控
  const startMonitoring = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  // 结束监控
  const endMonitoring = useCallback(() => {
    if (startTimeRef.current) {
      const renderTime = performance.now() - startTimeRef.current;
      PerformanceMonitor.recordLoadTime(`render:${componentName}`, startTimeRef.current);
      
      setMetrics(prev => ({
        renderTime,
        updateCount: prev.updateCount + 1,
        lastUpdate: Date.now(),
      }));
    }
  }, [componentName]);

  // 自动监控渲染
  useEffect(() => {
    startMonitoring();
    return endMonitoring;
  });

  return {
    metrics,
    startMonitoring,
    endMonitoring,
  };
}

/**
 * 内存优化 Hook
 */
export function useMemoryOptimization() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  }>({});

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 10000);

    return () => clearInterval(interval);
  }, []);

  // 清理缓存
  const clearCache = useCallback(() => {
    lazyRegistry.clearCache();
    PerformanceMonitor.clearMetrics();
  }, []);

  // 垃圾回收建议
  const suggestGC = useCallback(() => {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }, []);

  return {
    memoryInfo,
    clearCache,
    suggestGC,
  };
}

// 工具函数
function getConnectionType(): 'slow' | 'fast' {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType;
    
    return ['slow-2g', '2g', '3g'].includes(effectiveType) ? 'slow' : 'fast';
  }
  
  return 'fast';
}

function getMemoryInfo(): 'low' | 'high' {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const totalMemory = memory?.jsHeapSizeLimit || 0;
    
    // 小于 1GB 认为是低内存设备
    return totalMemory < 1024 * 1024 * 1024 ? 'low' : 'high';
  }
  
  return 'high';
}

/**
 * 批量优化 Hook
 */
export function useBatchOptimization<T>(
  items: T[],
  batchSize: number = 10,
  delay: number = 16
) {
  const [processedItems, setProcessedItems] = useState<T[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);

  const processBatch = useCallback(async () => {
    if (isProcessing || currentBatch * batchSize >= items.length) return;

    setIsProcessing(true);
    
    const startIndex = currentBatch * batchSize;
    const endIndex = Math.min(startIndex + batchSize, items.length);
    const batch = items.slice(startIndex, endIndex);

    // 使用 requestIdleCallback 或 setTimeout 进行批处理
    const processBatchItems = () => {
      setProcessedItems(prev => [...prev, ...batch]);
      setCurrentBatch(prev => prev + 1);
      setIsProcessing(false);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(processBatchItems);
    } else {
      setTimeout(processBatchItems, delay);
    }
  }, [items, batchSize, delay, currentBatch, isProcessing]);

  useEffect(() => {
    processBatch();
  }, [processBatch]);

  const reset = useCallback(() => {
    setProcessedItems([]);
    setCurrentBatch(0);
    setIsProcessing(false);
  }, []);

  return {
    processedItems,
    isProcessing,
    progress: Math.min((currentBatch * batchSize) / items.length, 1),
    reset,
  };
}