'use client';

// 性能指标接口
export interface PerformanceMetrics {
  // 页面加载指标
  pageLoad: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  };
  
  // API请求指标
  apiRequests: {
    url: string;
    method: string;
    duration: number;
    status: number;
    size: number;
    timestamp: number;
  }[];
  
  // 用户交互指标
  userInteractions: {
    type: string;
    target: string;
    timestamp: number;
    duration?: number;
  }[];
  
  // 资源加载指标
  resources: {
    name: string;
    type: string;
    size: number;
    duration: number;
    cached: boolean;
  }[];
}

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeMetrics();
    this.setupObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 初始化性能指标
   */
  private initializeMetrics() {
    this.metrics = {
      pageLoad: {
        domContentLoaded: 0,
        loadComplete: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
      },
      apiRequests: [],
      userInteractions: [],
      resources: [],
    };
  }

  /**
   * 设置性能观察器
   */
  private setupObservers() {
    if (typeof window === 'undefined') return;

    // 观察导航时间
    this.observeNavigationTiming();
    
    // 观察绘制时间
    this.observePaintTiming();
    
    // 观察最大内容绘制
    this.observeLargestContentfulPaint();
    
    // 观察首次输入延迟
    this.observeFirstInputDelay();
    
    // 观察累积布局偏移
    this.observeCumulativeLayoutShift();
    
    // 观察资源加载
    this.observeResourceTiming();
  }

  /**
   * 观察导航时间
   */
  private observeNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0];
        this.metrics.pageLoad!.domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
        this.metrics.pageLoad!.loadComplete = entry.loadEventEnd - entry.loadEventStart;
      }
    }
  }

  /**
   * 观察绘制时间
   */
  private observePaintTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.pageLoad!.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.pageLoad!.firstContentfulPaint = entry.startTime;
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
        this.observers.push(observer);
      } catch (error) {
        console.warn('Paint timing observer not supported:', error);
      }
    }
  }

  /**
   * 观察最大内容绘制
   */
  private observeLargestContentfulPaint() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.pageLoad!.largestContentfulPaint = lastEntry.startTime;
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(observer);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }
    }
  }

  /**
   * 观察首次输入延迟
   */
  private observeFirstInputDelay() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.pageLoad!.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }
    }
  }

  /**
   * 观察累积布局偏移
   */
  private observeCumulativeLayoutShift() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.pageLoad!.cumulativeLayoutShift = clsValue;
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }
    }
  }

  /**
   * 观察资源加载时间
   */
  private observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          this.metrics.resources!.push({
            name: resourceEntry.name,
            type: this.getResourceType(resourceEntry.name),
            size: resourceEntry.transferSize || 0,
            duration: resourceEntry.responseEnd - resourceEntry.requestStart,
            cached: resourceEntry.transferSize === 0 && resourceEntry.decodedBodySize > 0,
          });
        }
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
        this.observers.push(observer);
      } catch (error) {
        console.warn('Resource timing observer not supported:', error);
      }
    }
  }

  /**
   * 获取资源类型
   */
  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  /**
   * 记录API请求
   */
  recordApiRequest(
    url: string,
    method: string,
    duration: number,
    status: number,
    size: number = 0
  ) {
    this.metrics.apiRequests!.push({
      url,
      method,
      duration,
      status,
      size,
      timestamp: Date.now(),
    });
  }

  /**
   * 记录用户交互
   */
  recordUserInteraction(
    type: string,
    target: string,
    duration?: number
  ) {
    this.metrics.userInteractions!.push({
      type,
      target,
      timestamp: Date.now(),
      duration,
    });
  }

  /**
   * 获取性能指标
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * 获取性能摘要
   */
  getPerformanceSummary() {
    const metrics = this.getMetrics();
    
    return {
      // 页面性能评分
      pageScore: this.calculatePageScore(metrics.pageLoad),
      
      // API性能统计
      apiStats: this.calculateApiStats(metrics.apiRequests || []),
      
      // 资源加载统计
      resourceStats: this.calculateResourceStats(metrics.resources || []),
      
      // 用户体验指标
      userExperience: {
        totalInteractions: metrics.userInteractions?.length || 0,
        avgInteractionTime: this.calculateAvgInteractionTime(metrics.userInteractions || []),
      },
    };
  }

  /**
   * 计算页面性能评分
   */
  private calculatePageScore(pageLoad?: PerformanceMetrics['pageLoad']): number {
    if (!pageLoad) return 0;
    
    let score = 100;
    
    // FCP评分 (0-2.5s: 100, 2.5-4s: 50, >4s: 0)
    if (pageLoad.firstContentfulPaint > 4000) score -= 30;
    else if (pageLoad.firstContentfulPaint > 2500) score -= 15;
    
    // LCP评分 (0-2.5s: 100, 2.5-4s: 50, >4s: 0)
    if (pageLoad.largestContentfulPaint > 4000) score -= 30;
    else if (pageLoad.largestContentfulPaint > 2500) score -= 15;
    
    // FID评分 (0-100ms: 100, 100-300ms: 50, >300ms: 0)
    if (pageLoad.firstInputDelay > 300) score -= 20;
    else if (pageLoad.firstInputDelay > 100) score -= 10;
    
    // CLS评分 (0-0.1: 100, 0.1-0.25: 50, >0.25: 0)
    if (pageLoad.cumulativeLayoutShift > 0.25) score -= 20;
    else if (pageLoad.cumulativeLayoutShift > 0.1) score -= 10;
    
    return Math.max(0, score);
  }

  /**
   * 计算API统计信息
   */
  private calculateApiStats(apiRequests: PerformanceMetrics['apiRequests']) {
    if (apiRequests.length === 0) {
      return {
        totalRequests: 0,
        avgDuration: 0,
        successRate: 0,
        errorRate: 0,
      };
    }
    
    const totalDuration = apiRequests.reduce((sum, req) => sum + req.duration, 0);
    const successCount = apiRequests.filter(req => req.status >= 200 && req.status < 400).length;
    
    return {
      totalRequests: apiRequests.length,
      avgDuration: totalDuration / apiRequests.length,
      successRate: (successCount / apiRequests.length) * 100,
      errorRate: ((apiRequests.length - successCount) / apiRequests.length) * 100,
    };
  }

  /**
   * 计算资源统计信息
   */
  private calculateResourceStats(resources: PerformanceMetrics['resources']) {
    if (resources.length === 0) {
      return {
        totalResources: 0,
        totalSize: 0,
        avgLoadTime: 0,
        cacheHitRate: 0,
      };
    }
    
    const totalSize = resources.reduce((sum, res) => sum + res.size, 0);
    const totalDuration = resources.reduce((sum, res) => sum + res.duration, 0);
    const cachedCount = resources.filter(res => res.cached).length;
    
    return {
      totalResources: resources.length,
      totalSize,
      avgLoadTime: totalDuration / resources.length,
      cacheHitRate: (cachedCount / resources.length) * 100,
    };
  }

  /**
   * 计算平均交互时间
   */
  private calculateAvgInteractionTime(interactions: PerformanceMetrics['userInteractions']): number {
    const interactionsWithDuration = interactions.filter(i => i.duration !== undefined);
    
    if (interactionsWithDuration.length === 0) return 0;
    
    const totalDuration = interactionsWithDuration.reduce((sum, i) => sum + (i.duration || 0), 0);
    return totalDuration / interactionsWithDuration.length;
  }

  /**
   * 清理观察器
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * 性能监控Hook
 */
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    recordApiRequest: monitor.recordApiRequest.bind(monitor),
    recordUserInteraction: monitor.recordUserInteraction.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    getPerformanceSummary: monitor.getPerformanceSummary.bind(monitor),
  };
};

/**
 * 性能优化工具
 */
export class PerformanceOptimizer {
  /**
   * 图片懒加载
   */
  static setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // 观察所有带有data-src属性的图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * 预加载关键资源
   */
  static preloadCriticalResources(resources: string[]) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    });
  }

  /**
   * 防抖函数
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  }

  /**
   * 节流函数
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * 检测网络连接质量
   */
  static getNetworkQuality(): 'slow' | 'fast' | 'unknown' {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      if (connection.effectiveType === '4g') return 'fast';
      if (connection.effectiveType === '3g') return 'slow';
      if (connection.effectiveType === '2g') return 'slow';
    }
    
    return 'unknown';
  }

  /**
   * 自适应加载策略
   */
  static getAdaptiveLoadingStrategy() {
    const networkQuality = this.getNetworkQuality();
    const deviceMemory = (navigator as any).deviceMemory || 4;
    
    return {
      // 根据网络质量调整
      imageQuality: networkQuality === 'slow' ? 'low' : 'high',
      prefetchCount: networkQuality === 'slow' ? 2 : 5,
      
      // 根据设备内存调整
      cacheSize: deviceMemory < 4 ? 'small' : 'large',
      lazyLoadThreshold: deviceMemory < 4 ? '50px' : '200px',
    };
  }
}