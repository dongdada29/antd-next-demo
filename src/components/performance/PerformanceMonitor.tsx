/**
 * 性能监控组件
 * 监控应用性能指标并提供可视化展示
 */

'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
  tti: number; // Time to Interactive
  tbt: number; // Total Blocking Time
}

interface ResourceMetrics {
  totalResources: number;
  totalSize: number;
  loadTime: number;
  cacheHitRate: number;
}

interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface NetworkMetrics {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [resourceMetrics, setResourceMetrics] = useState<Partial<ResourceMetrics>>({});
  const [memoryMetrics, setMemoryMetrics] = useState<Partial<MemoryMetrics>>({});
  const [networkMetrics, setNetworkMetrics] = useState<Partial<NetworkMetrics>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState<Array<{ timestamp: number; metrics: Partial<PerformanceMetrics> }>>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  // 收集 Web Vitals 指标
  const collectWebVitals = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + (entry as any).value }));
            }
            break;
          case 'longtask':
            setMetrics(prev => ({ ...prev, tbt: (prev.tbt || 0) + entry.duration }));
            break;
        }
      }
    });

    try {
      observer.observe({ 
        entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'longtask'] 
      });
    } catch (e) {
      // 某些浏览器可能不支持所有类型
      console.warn('Some performance entry types not supported:', e);
    }

    return observer;
  }, []);

  // 收集资源指标
  const collectResourceMetrics = useCallback(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;
    let totalLoadTime = 0;
    let cacheHits = 0;

    resources.forEach(resource => {
      totalSize += resource.transferSize || 0;
      totalLoadTime += resource.responseEnd - resource.startTime;
      if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
        cacheHits++;
      }
    });

    setResourceMetrics({
      totalResources: resources.length,
      totalSize,
      loadTime: totalLoadTime / resources.length || 0,
      cacheHitRate: resources.length > 0 ? (cacheHits / resources.length) * 100 : 0,
    });
  }, []);

  // 收集内存指标
  const collectMemoryMetrics = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMemoryMetrics({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      });
    }
  }, []);

  // 收集网络指标
  const collectNetworkMetrics = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setNetworkMetrics({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });
    }
  }, []);

  // 收集 TTFB
  const collectTTFB = useCallback(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({ 
        ...prev, 
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart 
      }));
    }
  }, []);

  // 计算 TTI (简化版本)
  const calculateTTI = useCallback(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      // 简化的 TTI 计算：DOMContentLoaded + 一些启发式规则
      const tti = navigationEntry.domContentLoadedEventEnd;
      setMetrics(prev => ({ ...prev, tti }));
    }
  }, []);

  // 开始监控
  const startMonitoring = useCallback(() => {
    setIsRecording(true);
    
    // 立即收集一次指标
    collectResourceMetrics();
    collectMemoryMetrics();
    collectNetworkMetrics();
    collectTTFB();
    calculateTTI();

    // 定期收集指标
    intervalRef.current = setInterval(() => {
      collectResourceMetrics();
      collectMemoryMetrics();
      collectNetworkMetrics();
      
      // 记录历史数据
      setHistory(prev => {
        const newEntry = { timestamp: Date.now(), metrics };
        return [...prev.slice(-19), newEntry]; // 保留最近20条记录
      });
    }, 1000);
  }, [collectResourceMetrics, collectMemoryMetrics, collectNetworkMetrics, collectTTFB, calculateTTI, metrics]);

  // 停止监控
  const stopMonitoring = useCallback(() => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // 导出性能报告
  const exportReport = useCallback(() => {
    const report = {
      timestamp: new Date().toISOString(),
      webVitals: metrics,
      resources: resourceMetrics,
      memory: memoryMetrics,
      network: networkMetrics,
      history,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [metrics, resourceMetrics, memoryMetrics, networkMetrics, history]);

  // 清除数据
  const clearData = useCallback(() => {
    setMetrics({});
    setResourceMetrics({});
    setMemoryMetrics({});
    setHistory([]);
  }, []);

  useEffect(() => {
    const observer = collectWebVitals();
    
    // 初始数据收集
    setTimeout(() => {
      collectResourceMetrics();
      collectMemoryMetrics();
      collectNetworkMetrics();
      collectTTFB();
      calculateTTI();
    }, 1000);

    return () => {
      observer.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [collectWebVitals, collectResourceMetrics, collectMemoryMetrics, collectNetworkMetrics, collectTTFB, calculateTTI]);

  const formatMetric = (value: number | undefined, unit: string = 'ms') => {
    if (value === undefined) return 'N/A';
    if (unit === 'bytes') {
      return value > 1024 * 1024 
        ? `${(value / 1024 / 1024).toFixed(2)}MB`
        : `${(value / 1024).toFixed(2)}KB`;
    }
    return `${value.toFixed(2)}${unit}`;
  };

  const getMetricColor = (metric: keyof PerformanceMetrics, value: number | undefined) => {
    if (!value) return 'text-muted-foreground';
    
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
      fmp: { good: 2000, poor: 4000 },
      tti: { good: 3800, poor: 7300 },
      tbt: { good: 200, poor: 600 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'text-muted-foreground';
    
    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm z-50 shadow-lg hover:bg-primary/90"
      >
        性能监控
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-[80vh] overflow-auto">
      <Card className="w-96">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            性能监控
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
              <button
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Web Vitals */}
          <div>
            <h4 className="text-xs font-medium mb-2">Web Vitals</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">FCP:</span>
                <span className={`ml-1 ${getMetricColor('fcp', metrics.fcp)}`}>
                  {formatMetric(metrics.fcp)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">LCP:</span>
                <span className={`ml-1 ${getMetricColor('lcp', metrics.lcp)}`}>
                  {formatMetric(metrics.lcp)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">FID:</span>
                <span className={`ml-1 ${getMetricColor('fid', metrics.fid)}`}>
                  {formatMetric(metrics.fid)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">CLS:</span>
                <span className={`ml-1 ${getMetricColor('cls', metrics.cls)}`}>
                  {formatMetric(metrics.cls, '')}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">TTFB:</span>
                <span className={`ml-1 ${getMetricColor('ttfb', metrics.ttfb)}`}>
                  {formatMetric(metrics.ttfb)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">TTI:</span>
                <span className={`ml-1 ${getMetricColor('tti', metrics.tti)}`}>
                  {formatMetric(metrics.tti)}
                </span>
              </div>
            </div>
          </div>

          {/* 资源指标 */}
          <div>
            <h4 className="text-xs font-medium mb-2">资源</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">资源数:</span>
                <span className="ml-1">{resourceMetrics.totalResources || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总大小:</span>
                <span className="ml-1">{formatMetric(resourceMetrics.totalSize, 'bytes')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">平均加载:</span>
                <span className="ml-1">{formatMetric(resourceMetrics.loadTime)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">缓存命中:</span>
                <span className="ml-1">{formatMetric(resourceMetrics.cacheHitRate, '%')}</span>
              </div>
            </div>
          </div>

          {/* 内存指标 */}
          {memoryMetrics.usedJSHeapSize && (
            <div>
              <h4 className="text-xs font-medium mb-2">内存</h4>
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div>
                  <span className="text-muted-foreground">已用:</span>
                  <span className="ml-1">{formatMetric(memoryMetrics.usedJSHeapSize, 'bytes')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">总计:</span>
                  <span className="ml-1">{formatMetric(memoryMetrics.totalJSHeapSize, 'bytes')}</span>
                </div>
              </div>
            </div>
          )}

          {/* 网络指标 */}
          {networkMetrics.effectiveType && (
            <div>
              <h4 className="text-xs font-medium mb-2">网络</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">类型:</span>
                  <span className="ml-1">{networkMetrics.effectiveType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">下行:</span>
                  <span className="ml-1">{networkMetrics.downlink}Mbps</span>
                </div>
                <div>
                  <span className="text-muted-foreground">RTT:</span>
                  <span className="ml-1">{networkMetrics.rtt}ms</span>
                </div>
                <div>
                  <span className="text-muted-foreground">省流:</span>
                  <span className="ml-1">{networkMetrics.saveData ? '是' : '否'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 控制按钮 */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopMonitoring : startMonitoring}
              className="flex-1 text-xs"
            >
              {isRecording ? '停止' : '开始'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportReport}
              className="flex-1 text-xs"
            >
              导出
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearData}
              className="flex-1 text-xs"
            >
              清除
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 轻量级性能指示器
export const PerformanceIndicator: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const calculateScore = () => {
      // 简化的性能评分计算
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!navigation) return;

      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;
      const lcp = performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0;
      
      let score = 100;
      
      // FCP 评分 (权重: 25%)
      if (fcp > 3000) score -= 25;
      else if (fcp > 1800) score -= 15;
      
      // LCP 评分 (权重: 25%)
      if (lcp > 4000) score -= 25;
      else if (lcp > 2500) score -= 15;
      
      // TTFB 评分 (权重: 25%)
      const ttfb = navigation.responseStart - navigation.requestStart;
      if (ttfb > 1800) score -= 25;
      else if (ttfb > 800) score -= 15;
      
      // 加载完成时间评分 (权重: 25%)
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      if (loadTime > 5000) score -= 25;
      else if (loadTime > 3000) score -= 15;

      setScore(Math.max(0, score));
    };

    const timer = setTimeout(calculateScore, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!score) return null;

  const getColor = () => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-3">
      <div className="text-xs text-muted-foreground">性能评分</div>
      <div className={`text-lg font-bold ${getColor().replace('bg-', 'text-')}`}>
        {score}
      </div>
      <div className={`w-full h-1 rounded-full mt-1 ${getColor()}`} 
           style={{ width: `${score}%` }} />
    </div>
  );
};