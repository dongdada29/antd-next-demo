'use client';

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  // 页面加载性能
  pageLoad?: {
    domContentLoaded: number;
    loadComplete: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  };
  
  // 运行时性能
  runtime?: {
    memoryUsage: number;
    jsHeapSize: number;
    renderTime: number;
    componentCount: number;
  };
  
  // 网络性能
  network?: {
    connectionType: string;
    downlink: number;
    rtt: number;
  };
  
  // 用户交互性能
  interaction?: {
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  };
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isSupported, setIsSupported] = useState(false);
  const observerRef = useRef<PerformanceObserver>();

  useEffect(() => {
    // 检查浏览器支持
    const supported = 'performance' in window && 'PerformanceObserver' in window;
    setIsSupported(supported);

    if (!supported) return;

    // 收集页面加载性能
    const collectPageLoadMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      if (navigation) {
        const pageLoadMetrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          largestContentfulPaint: 0, // 将通过 LCP observer 更新
        };

        setMetrics(prev => ({ ...prev, pageLoad: pageLoadMetrics }));
      }
    };

    // 收集运行时性能
    const collectRuntimeMetrics = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const runtimeMetrics = {
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
          jsHeapSize: memory.totalJSHeapSize / 1024 / 1024, // MB
          renderTime: performance.now(),
          componentCount: document.querySelectorAll('[data-reactroot] *').length,
        };

        setMetrics(prev => ({ ...prev, runtime: runtimeMetrics }));
      }
    };

    // 收集网络性能
    const collectNetworkMetrics = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const networkMetrics = {
          connectionType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
        };

        setMetrics(prev => ({ ...prev, network: networkMetrics }));
      }
    };

    // 设置 Performance Observer
    const setupObserver = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            switch (entry.entryType) {
              case 'largest-contentful-paint':
                setMetrics(prev => ({
                  ...prev,
                  pageLoad: {
                    ...prev.pageLoad!,
                    largestContentfulPaint: entry.startTime,
                  },
                }));
                break;
                
              case 'first-input':
                setMetrics(prev => ({
                  ...prev,
                  interaction: {
                    ...prev.interaction,
                    firstInputDelay: (entry as any).processingStart - entry.startTime,
                  },
                }));
                break;
                
              case 'layout-shift':
                if (!(entry as any).hadRecentInput) {
                  setMetrics(prev => ({
                    ...prev,
                    interaction: {
                      ...prev.interaction,
                      cumulativeLayoutShift: (prev.interaction?.cumulativeLayoutShift || 0) + (entry as any).value,
                    },
                  }));
                }
                break;
            }
          });
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        observerRef.current = observer;
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    };

    // 初始化收集
    collectPageLoadMetrics();
    collectRuntimeMetrics();
    collectNetworkMetrics();
    setupObserver();

    // 定期更新运行时指标
    const interval = setInterval(collectRuntimeMetrics, 5000);

    return () => {
      clearInterval(interval);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 手动触发性能测量
  const measurePerformance = (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    console.log(`Performance: ${name} took ${end - start} milliseconds`);
    return end - start;
  };

  // 标记性能时间点
  const mark = (name: string) => {
    if (isSupported) {
      performance.mark(name);
    }
  };

  // 测量两个标记之间的时间
  const measure = (name: string, startMark: string, endMark: string) => {
    if (isSupported) {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      return measure?.duration || 0;
    }
    return 0;
  };

  // 获取性能评分
  const getPerformanceScore = () => {
    if (!metrics.pageLoad) return null;

    const { firstContentfulPaint, largestContentfulPaint } = metrics.pageLoad;
    const { firstInputDelay = 0, cumulativeLayoutShift = 0 } = metrics.interaction || {};

    // 简化的性能评分算法
    let score = 100;
    
    // FCP 评分 (0-2.5s 为好)
    if (firstContentfulPaint > 2500) score -= 20;
    else if (firstContentfulPaint > 1500) score -= 10;
    
    // LCP 评分 (0-2.5s 为好)
    if (largestContentfulPaint > 2500) score -= 25;
    else if (largestContentfulPaint > 1500) score -= 15;
    
    // FID 评分 (0-100ms 为好)
    if (firstInputDelay > 100) score -= 20;
    else if (firstInputDelay > 50) score -= 10;
    
    // CLS 评分 (0-0.1 为好)
    if (cumulativeLayoutShift > 0.1) score -= 15;
    else if (cumulativeLayoutShift > 0.05) score -= 8;

    return Math.max(0, score);
  };

  return {
    metrics,
    isSupported,
    measurePerformance,
    mark,
    measure,
    getPerformanceScore,
  };
}

// 组件性能监控Hook
export function useComponentPerformance(componentName: string) {
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef<number>();
  const { mark, measure } = usePerformanceMonitor();

  useEffect(() => {
    // 组件挂载时间
    mountTimeRef.current = performance.now();
    mark(`${componentName}-mount-start`);

    return () => {
      // 组件卸载
      mark(`${componentName}-mount-end`);
      const mountDuration = measure(
        `${componentName}-mount-duration`,
        `${componentName}-mount-start`,
        `${componentName}-mount-end`
      );
      
      console.log(`Component ${componentName} mount duration: ${mountDuration}ms`);
      console.log(`Component ${componentName} render count: ${renderCountRef.current}`);
    };
  }, [componentName, mark, measure]);

  useEffect(() => {
    renderCountRef.current += 1;
  });

  return {
    renderCount: renderCountRef.current,
    mountTime: mountTimeRef.current,
  };
}