/**
 * Performance Validation Test Suite
 * Tests bundle size, render performance, and memory usage
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { performance } from 'perf_hooks';
import { PerformanceAnalyzer } from '../lib/performance-analyzer';
import { BundleOptimizer } from '../lib/bundle-optimization';

describe('Performance Validation', () => {
  let performanceAnalyzer: PerformanceAnalyzer;
  let bundleOptimizer: BundleOptimizer;

  beforeAll(async () => {
    performanceAnalyzer = new PerformanceAnalyzer();
    bundleOptimizer = new BundleOptimizer();
  });

  describe('Bundle Size Optimization', () => {
    it('should meet CSS bundle size targets', async () => {
      const bundleAnalysis = await bundleOptimizer.analyzeCSSBundle();
      
      // CSS should be purged and optimized
      expect(bundleAnalysis.originalSize).toBeGreaterThan(bundleAnalysis.optimizedSize);
      
      // Should achieve at least 30% reduction
      const reduction = (bundleAnalysis.originalSize - bundleAnalysis.optimizedSize) / bundleAnalysis.originalSize;
      expect(reduction).toBeGreaterThanOrEqual(0.3);
      
      // Optimized CSS should be under 100KB
      expect(bundleAnalysis.optimizedSize).toBeLessThan(100 * 1024);
      
      // Gzipped size should be under 30KB
      expect(bundleAnalysis.gzippedSize).toBeLessThan(30 * 1024);
    });

    it('should validate JavaScript tree-shaking', async () => {
      const jsAnalysis = await bundleOptimizer.analyzeJSBundle();
      
      // Should have no unused exports
      expect(jsAnalysis.unusedExports).toBe(0);
      
      // Should have minimal dead code
      expect(jsAnalysis.deadCodePercentage).toBeLessThan(0.05); // Less than 5%
      
      // Should use dynamic imports for code splitting
      expect(jsAnalysis.dynamicImports).toBeGreaterThan(0);
      
      // Main bundle should be under 500KB
      expect(jsAnalysis.mainBundleSize).toBeLessThan(500 * 1024);
    });

    it('should validate asset optimization', async () => {
      const assetAnalysis = await bundleOptimizer.analyzeAssets();
      
      // Images should be optimized
      assetAnalysis.images.forEach(image => {
        expect(image.optimized).toBe(true);
        expect(image.format).toMatch(/webp|avif|jpg|png/);
      });
      
      // Fonts should be subset and optimized
      assetAnalysis.fonts.forEach(font => {
        expect(font.subset).toBe(true);
        expect(font.format).toMatch(/woff2|woff/);
      });
      
      // Total asset size should be reasonable
      expect(assetAnalysis.totalSize).toBeLessThan(2 * 1024 * 1024); // 2MB
    });
  });

  describe('Runtime Performance', () => {
    it('should meet First Contentful Paint targets', async () => {
      const performanceMetrics = await performanceAnalyzer.measurePageLoad();
      
      // FCP should be under 1.8 seconds
      expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1800);
      
      // LCP should be under 2.5 seconds
      expect(performanceMetrics.largestContentfulPaint).toBeLessThan(2500);
      
      // CLS should be under 0.1
      expect(performanceMetrics.cumulativeLayoutShift).toBeLessThan(0.1);
      
      // FID should be under 100ms
      expect(performanceMetrics.firstInputDelay).toBeLessThan(100);
    });

    it('should validate component render performance', async () => {
      const renderMetrics = await performanceAnalyzer.measureComponentRender();
      
      // Average component render time should be under 10ms
      expect(renderMetrics.averageRenderTime).toBeLessThan(10);
      
      // No component should take longer than 16ms (60fps)
      expect(renderMetrics.maxRenderTime).toBeLessThan(16);
      
      // Should have minimal re-renders
      expect(renderMetrics.unnecessaryRerenders).toBeLessThan(0.1); // Less than 10%
      
      // Memory usage should be stable
      expect(renderMetrics.memoryLeaks).toBe(0);
    });

    it('should validate interaction responsiveness', async () => {
      const interactionMetrics = await performanceAnalyzer.measureInteractions();
      
      // Click responses should be under 50ms
      expect(interactionMetrics.averageClickResponse).toBeLessThan(50);
      
      // Form input responses should be under 16ms
      expect(interactionMetrics.averageInputResponse).toBeLessThan(16);
      
      // Scroll performance should be smooth (60fps)
      expect(interactionMetrics.scrollFrameRate).toBeGreaterThanOrEqual(58);
      
      // Animation frame rate should be consistent
      expect(interactionMetrics.animationFrameRate).toBeGreaterThanOrEqual(58);
    });
  });

  describe('Memory Usage', () => {
    it('should validate memory efficiency', async () => {
      const memoryMetrics = await performanceAnalyzer.measureMemoryUsage();
      
      // Initial memory usage should be reasonable
      expect(memoryMetrics.initialHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB
      
      // Memory growth should be controlled
      expect(memoryMetrics.memoryGrowthRate).toBeLessThan(0.1); // Less than 10% per minute
      
      // Should have no memory leaks
      expect(memoryMetrics.memoryLeaks).toBe(0);
      
      // Garbage collection should be efficient
      expect(memoryMetrics.gcEfficiency).toBeGreaterThan(0.8); // 80% efficiency
    });

    it('should validate component cleanup', async () => {
      const cleanupMetrics = await performanceAnalyzer.measureComponentCleanup();
      
      // Components should clean up event listeners
      expect(cleanupMetrics.orphanedEventListeners).toBe(0);
      
      // Components should clean up timers
      expect(cleanupMetrics.orphanedTimers).toBe(0);
      
      // Components should clean up subscriptions
      expect(cleanupMetrics.orphanedSubscriptions).toBe(0);
      
      // Memory should be released after unmount
      expect(cleanupMetrics.memoryReleaseEfficiency).toBeGreaterThan(0.9); // 90%
    });
  });

  describe('Network Performance', () => {
    it('should validate resource loading', async () => {
      const networkMetrics = await performanceAnalyzer.measureNetworkPerformance();
      
      // Critical resources should load quickly
      expect(networkMetrics.criticalResourceLoadTime).toBeLessThan(1000); // 1 second
      
      // Should use HTTP/2 or HTTP/3
      expect(networkMetrics.httpVersion).toMatch(/2|3/);
      
      // Should use compression
      expect(networkMetrics.compressionRatio).toBeGreaterThan(0.7); // 70% compression
      
      // Should minimize requests
      expect(networkMetrics.totalRequests).toBeLessThan(50);
    });

    it('should validate caching strategy', async () => {
      const cacheMetrics = await performanceAnalyzer.measureCachePerformance();
      
      // Static assets should be cached
      expect(cacheMetrics.staticAssetCacheHitRate).toBeGreaterThan(0.9); // 90%
      
      // API responses should be cached appropriately
      expect(cacheMetrics.apiCacheHitRate).toBeGreaterThan(0.7); // 70%
      
      // Cache should not be stale
      expect(cacheMetrics.staleCachePercentage).toBeLessThan(0.1); // Less than 10%
    });
  });

  describe('Accessibility Performance', () => {
    it('should validate screen reader performance', async () => {
      const a11yMetrics = await performanceAnalyzer.measureAccessibilityPerformance();
      
      // Screen reader navigation should be fast
      expect(a11yMetrics.screenReaderNavigationTime).toBeLessThan(100); // 100ms
      
      // Focus management should be responsive
      expect(a11yMetrics.focusManagementTime).toBeLessThan(50); // 50ms
      
      // ARIA updates should be timely
      expect(a11yMetrics.ariaUpdateTime).toBeLessThan(16); // 16ms (1 frame)
    });
  });

  afterAll(async () => {
    // Generate performance report
    const report = await performanceAnalyzer.generateComprehensiveReport();
    
    console.log('Performance Validation Report:', JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        bundleSize: report.bundleSize,
        runtime: report.runtime,
        memory: report.memory,
        network: report.network,
        accessibility: report.accessibility
      },
      recommendations: report.recommendations,
      score: report.overallScore
    }, null, 2));
    
    // Ensure we meet minimum performance score
    expect(report.overallScore).toBeGreaterThan(80); // 80+ performance score
  });
});