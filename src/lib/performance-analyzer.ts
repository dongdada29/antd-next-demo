/**
 * 性能分析器
 * 提供深度性能分析、基准测试和优化建议
 */

// 性能分析结果接口
export interface PerformanceAnalysis {
  score: number;
  metrics: PerformanceMetrics;
  recommendations: Recommendation[];
  benchmarks: BenchmarkResult[];
  trends: TrendData[];
}

export interface PerformanceMetrics {
  webVitals: WebVitalsMetrics;
  runtime: RuntimeMetrics;
  network: NetworkMetrics;
  resources: ResourceMetrics;
  memory: MemoryMetrics;
}

export interface WebVitalsMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
  tbt: number; // Total Blocking Time
  si: number; // Speed Index
}

export interface RuntimeMetrics {
  jsExecutionTime: number;
  domNodes: number;
  eventListeners: number;
  styleRecalculations: number;
  layoutThrashing: number;
  paintTime: number;
}

export interface NetworkMetrics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  requestCount: number;
  transferSize: number;
  cacheHitRate: number;
}

export interface ResourceMetrics {
  totalSize: number;
  compressedSize: number;
  imageOptimization: number;
  cssOptimization: number;
  jsOptimization: number;
  fontOptimization: number;
  criticalResourceCount: number;
}

export interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  memoryLeaks: MemoryLeak[];
  gcPressure: number;
}

export interface MemoryLeak {
  type: string;
  size: number;
  location: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  category: 'performance' | 'accessibility' | 'seo' | 'best-practices';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: number; // 预期性能提升 (0-100)
  effort: 'low' | 'medium' | 'high';
  implementation: string;
  resources: string[];
}

export interface BenchmarkResult {
  name: string;
  value: number;
  baseline: number;
  percentile: number;
  trend: 'improving' | 'stable' | 'degrading';
}

export interface TrendData {
  timestamp: number;
  metrics: Partial<WebVitalsMetrics>;
}

/**
 * 性能分析器类
 */
export class PerformanceAnalyzer {
  private observer: PerformanceObserver | null = null;
  private metrics: Partial<PerformanceMetrics> = {};
  private trends: TrendData[] = [];
  private benchmarks: Map<string, number[]> = new Map();

  constructor() {
    this.initializeObserver();
  }

  /**
   * 初始化性能观察器
   */
  private initializeObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    this.observer = new PerformanceObserver((list) => {
      this.processPerformanceEntries(list.getEntries());
    });

    try {
      this.observer.observe({
        entryTypes: [
          'navigation',
          'paint',
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
          'longtask',
          'resource',
          'measure',
          'mark'
        ]
      });
    } catch (error) {
      console.warn('Performance observer initialization failed:', error);
    }
  }

  /**
   * 处理性能条目
   */
  private processPerformanceEntries(entries: PerformanceEntry[]) {
    entries.forEach(entry => {
      switch (entry.entryType) {
        case 'paint':
          this.processPaintEntry(entry as PerformancePaintTiming);
          break;
        case 'largest-contentful-paint':
          this.processLCPEntry(entry as PerformanceEntry);
          break;
        case 'first-input':
          this.processFIDEntry(entry as PerformanceEventTiming);
          break;
        case 'layout-shift':
          this.processCLSEntry(entry as PerformanceEntry);
          break;
        case 'longtask':
          this.processLongTaskEntry(entry as PerformanceEntry);
          break;
        case 'resource':
          this.processResourceEntry(entry as PerformanceResourceTiming);
          break;
        case 'navigation':
          this.processNavigationEntry(entry as PerformanceNavigationTiming);
          break;
      }
    });
  }

  /**
   * 处理绘制条目
   */
  private processPaintEntry(entry: PerformancePaintTiming) {
    if (!this.metrics.webVitals) this.metrics.webVitals = {} as WebVitalsMetrics;
    
    if (entry.name === 'first-contentful-paint') {
      this.metrics.webVitals.fcp = entry.startTime;
    }
  }

  /**
   * 处理 LCP 条目
   */
  private processLCPEntry(entry: PerformanceEntry) {
    if (!this.metrics.webVitals) this.metrics.webVitals = {} as WebVitalsMetrics;
    this.metrics.webVitals.lcp = entry.startTime;
  }

  /**
   * 处理 FID 条目
   */
  private processFIDEntry(entry: PerformanceEventTiming) {
    if (!this.metrics.webVitals) this.metrics.webVitals = {} as WebVitalsMetrics;
    this.metrics.webVitals.fid = entry.processingStart - entry.startTime;
  }

  /**
   * 处理 CLS 条目
   */
  private processCLSEntry(entry: PerformanceEntry) {
    if (!this.metrics.webVitals) this.metrics.webVitals = {} as WebVitalsMetrics;
    
    const clsEntry = entry as any;
    if (!clsEntry.hadRecentInput) {
      this.metrics.webVitals.cls = (this.metrics.webVitals.cls || 0) + clsEntry.value;
    }
  }

  /**
   * 处理长任务条目
   */
  private processLongTaskEntry(entry: PerformanceEntry) {
    if (!this.metrics.webVitals) this.metrics.webVitals = {} as WebVitalsMetrics;
    this.metrics.webVitals.tbt = (this.metrics.webVitals.tbt || 0) + Math.max(0, entry.duration - 50);
  }

  /**
   * 处理资源条目
   */
  private processResourceEntry(entry: PerformanceResourceTiming) {
    if (!this.metrics.resources) this.metrics.resources = {} as ResourceMetrics;
    if (!this.metrics.network) this.metrics.network = {} as NetworkMetrics;

    // 更新资源指标
    this.metrics.resources.totalSize = (this.metrics.resources.totalSize || 0) + (entry.transferSize || 0);
    this.metrics.network.requestCount = (this.metrics.network.requestCount || 0) + 1;

    // 检查缓存命中
    if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
      this.metrics.network.cacheHitRate = (this.metrics.network.cacheHitRate || 0) + 1;
    }
  }

  /**
   * 处理导航条目
   */
  private processNavigationEntry(entry: PerformanceNavigationTiming) {
    if (!this.metrics.webVitals) this.metrics.webVitals = {} as WebVitalsMetrics;
    if (!this.metrics.runtime) this.metrics.runtime = {} as RuntimeMetrics;

    // TTFB
    this.metrics.webVitals.ttfb = entry.responseStart - entry.requestStart;
    
    // TTI (简化计算)
    this.metrics.webVitals.tti = entry.domContentLoadedEventEnd;
    
    // JS 执行时间
    this.metrics.runtime.jsExecutionTime = entry.loadEventEnd - entry.domContentLoadedEventEnd;
  }

  /**
   * 收集内存指标
   */
  private collectMemoryMetrics(): MemoryMetrics {
    const memoryMetrics: Partial<MemoryMetrics> = {};

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryMetrics.usedJSHeapSize = memory.usedJSHeapSize;
      memoryMetrics.totalJSHeapSize = memory.totalJSHeapSize;
      memoryMetrics.jsHeapSizeLimit = memory.jsHeapSizeLimit;
      
      // 计算 GC 压力
      memoryMetrics.gcPressure = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }

    // 检测潜在的内存泄漏
    memoryMetrics.memoryLeaks = this.detectMemoryLeaks();

    return memoryMetrics as MemoryMetrics;
  }

  /**
   * 检测内存泄漏
   */
  private detectMemoryLeaks(): MemoryLeak[] {
    const leaks: MemoryLeak[] = [];

    // 检查 DOM 节点数量
    const domNodes = document.querySelectorAll('*').length;
    if (domNodes > 10000) {
      leaks.push({
        type: 'DOM节点过多',
        size: domNodes,
        location: 'document',
        severity: domNodes > 50000 ? 'high' : 'medium'
      });
    }

    // 检查事件监听器
    const eventListeners = this.countEventListeners();
    if (eventListeners > 1000) {
      leaks.push({
        type: '事件监听器过多',
        size: eventListeners,
        location: 'global',
        severity: eventListeners > 5000 ? 'high' : 'medium'
      });
    }

    return leaks;
  }

  /**
   * 计算事件监听器数量
   */
  private countEventListeners(): number {
    // 这是一个简化的实现，实际中需要更复杂的检测
    return Object.keys((window as any)._eventListeners || {}).length;
  }

  /**
   * 收集网络指标
   */
  private collectNetworkMetrics(): NetworkMetrics {
    const networkMetrics: Partial<NetworkMetrics> = {};

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      networkMetrics.connectionType = connection.type;
      networkMetrics.effectiveType = connection.effectiveType;
      networkMetrics.downlink = connection.downlink;
      networkMetrics.rtt = connection.rtt;
      networkMetrics.saveData = connection.saveData;
    }

    // 计算缓存命中率
    if (this.metrics.network) {
      const totalRequests = this.metrics.network.requestCount || 0;
      const cacheHits = this.metrics.network.cacheHitRate || 0;
      networkMetrics.cacheHitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
    }

    return networkMetrics as NetworkMetrics;
  }

  /**
   * 生成性能建议
   */
  private generateRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const metrics = this.metrics;

    // FCP 优化建议
    if (metrics.webVitals?.fcp && metrics.webVitals.fcp > 3000) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        title: '优化首次内容绘制 (FCP)',
        description: 'FCP 时间过长，影响用户体验',
        impact: 25,
        effort: 'medium',
        implementation: '优化关键渲染路径，减少阻塞资源，使用资源预加载',
        resources: [
          'https://web.dev/fcp/',
          'https://developers.google.com/web/fundamentals/performance/critical-rendering-path'
        ]
      });
    }

    // LCP 优化建议
    if (metrics.webVitals?.lcp && metrics.webVitals.lcp > 4000) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        title: '优化最大内容绘制 (LCP)',
        description: 'LCP 时间过长，需要优化主要内容加载',
        impact: 30,
        effort: 'medium',
        implementation: '优化图片加载，使用 CDN，实现懒加载',
        resources: [
          'https://web.dev/lcp/',
          'https://web.dev/optimize-lcp/'
        ]
      });
    }

    // CLS 优化建议
    if (metrics.webVitals?.cls && metrics.webVitals.cls > 0.25) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        title: '减少累积布局偏移 (CLS)',
        description: 'CLS 值过高，页面布局不稳定',
        impact: 20,
        effort: 'low',
        implementation: '为图片和广告设置尺寸，避免动态插入内容',
        resources: [
          'https://web.dev/cls/',
          'https://web.dev/optimize-cls/'
        ]
      });
    }

    // 内存优化建议
    if (metrics.memory?.gcPressure && metrics.memory.gcPressure > 0.8) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        title: '优化内存使用',
        description: '内存使用率过高，可能影响性能',
        impact: 35,
        effort: 'high',
        implementation: '检查内存泄漏，优化数据结构，实现对象池',
        resources: [
          'https://developers.google.com/web/tools/chrome-devtools/memory-problems',
          'https://web.dev/memory/'
        ]
      });
    }

    // 网络优化建议
    if (metrics.network?.cacheHitRate && metrics.network.cacheHitRate < 50) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        title: '提高缓存命中率',
        description: '缓存命中率较低，增加网络请求',
        impact: 15,
        effort: 'low',
        implementation: '配置适当的缓存策略，使用 Service Worker',
        resources: [
          'https://web.dev/http-cache/',
          'https://web.dev/service-worker-caching-and-http-caching/'
        ]
      });
    }

    return recommendations;
  }

  /**
   * 计算性能评分
   */
  private calculateScore(): number {
    const metrics = this.metrics.webVitals;
    if (!metrics) return 0;

    let score = 100;

    // FCP 评分 (权重: 20%)
    if (metrics.fcp) {
      if (metrics.fcp > 3000) score -= 20;
      else if (metrics.fcp > 1800) score -= 10;
    }

    // LCP 评分 (权重: 25%)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 25;
      else if (metrics.lcp > 2500) score -= 15;
    }

    // FID 评分 (权重: 15%)
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 15;
      else if (metrics.fid > 100) score -= 8;
    }

    // CLS 评分 (权重: 15%)
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 15;
      else if (metrics.cls > 0.1) score -= 8;
    }

    // TTFB 评分 (权重: 15%)
    if (metrics.ttfb) {
      if (metrics.ttfb > 1800) score -= 15;
      else if (metrics.ttfb > 800) score -= 8;
    }

    // TBT 评分 (权重: 10%)
    if (metrics.tbt) {
      if (metrics.tbt > 600) score -= 10;
      else if (metrics.tbt > 200) score -= 5;
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * 生成基准测试结果
   */
  private generateBenchmarks(): BenchmarkResult[] {
    const benchmarks: BenchmarkResult[] = [];
    const metrics = this.metrics.webVitals;

    if (!metrics) return benchmarks;

    // 行业基准数据 (示例)
    const industryBenchmarks = {
      fcp: { p50: 1800, p75: 3000, p90: 5000 },
      lcp: { p50: 2500, p75: 4000, p90: 6500 },
      fid: { p50: 100, p75: 300, p90: 500 },
      cls: { p50: 0.1, p75: 0.25, p90: 0.5 },
      ttfb: { p50: 800, p75: 1800, p90: 3000 }
    };

    Object.entries(metrics).forEach(([key, value]) => {
      const benchmark = industryBenchmarks[key as keyof typeof industryBenchmarks];
      if (benchmark && value !== undefined) {
        let percentile = 0;
        if (value <= benchmark.p50) percentile = 50;
        else if (value <= benchmark.p75) percentile = 75;
        else if (value <= benchmark.p90) percentile = 90;
        else percentile = 100;

        benchmarks.push({
          name: key.toUpperCase(),
          value,
          baseline: benchmark.p75,
          percentile,
          trend: this.calculateTrend(key, value)
        });
      }
    });

    return benchmarks;
  }

  /**
   * 计算趋势
   */
  private calculateTrend(metric: string, currentValue: number): 'improving' | 'stable' | 'degrading' {
    const history = this.benchmarks.get(metric) || [];
    history.push(currentValue);
    
    // 保留最近10次记录
    if (history.length > 10) {
      history.shift();
    }
    
    this.benchmarks.set(metric, history);

    if (history.length < 3) return 'stable';

    const recent = history.slice(-3);
    const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previousAverage = history.slice(-6, -3).reduce((sum, val) => sum + val, 0) / 3;

    const change = (average - previousAverage) / previousAverage;

    if (change < -0.05) return 'improving'; // 5% 改善
    if (change > 0.05) return 'degrading'; // 5% 恶化
    return 'stable';
  }

  /**
   * 执行完整的性能分析
   */
  async analyze(): Promise<PerformanceAnalysis> {
    // 等待一段时间确保所有指标都被收集
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 收集所有指标
    this.metrics.memory = this.collectMemoryMetrics();
    this.metrics.network = this.collectNetworkMetrics();

    // 记录趋势数据
    this.trends.push({
      timestamp: Date.now(),
      metrics: { ...this.metrics.webVitals }
    });

    // 保留最近50条记录
    if (this.trends.length > 50) {
      this.trends = this.trends.slice(-50);
    }

    return {
      score: this.calculateScore(),
      metrics: this.metrics as PerformanceMetrics,
      recommendations: this.generateRecommendations(),
      benchmarks: this.generateBenchmarks(),
      trends: this.trends
    };
  }

  /**
   * 获取实时指标
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * 清理资源
   */
  dispose() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// 全局性能分析器实例
export const performanceAnalyzer = new PerformanceAnalyzer();