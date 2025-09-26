/**
 * 字体优化工具
 * Font optimization utilities
 */

// 字体加载策略
export const fontLoadingStrategies = {
  // 预加载关键字体
  preloadCriticalFonts: () => {
    const criticalFonts = [
      '/fonts/inter-var.woff2',
      '/fonts/source-han-sans-cn.woff2',
    ];

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      document.head.appendChild(link);
    });
  },

  // 字体显示策略
  optimizeFontDisplay: () => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url('/fonts/inter-var.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Source Han Sans CN';
        font-style: normal;
        font-weight: 400 700;
        font-display: swap;
        src: url('/fonts/source-han-sans-cn.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  },

  // 字体子集化
  loadFontSubset: (text: string, fontFamily: string) => {
    // 根据文本内容动态加载字体子集
    const uniqueChars = [...new Set(text)].join('');
    const subsetUrl = `/api/font-subset?text=${encodeURIComponent(uniqueChars)}&font=${fontFamily}`;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = subsetUrl;
    document.head.appendChild(link);
  },
};

// 字体性能监控
export class FontPerformanceMonitor {
  private loadTimes: Map<string, number> = new Map();
  private observer?: PerformanceObserver;

  constructor() {
    this.setupObserver();
  }

  private setupObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('font')) {
            this.loadTimes.set(entry.name, entry.duration);
            console.log(`Font loaded: ${entry.name} in ${entry.duration}ms`);
          }
        });
      });

      this.observer.observe({ entryTypes: ['resource'] });
    }
  }

  getFontLoadTimes() {
    return Object.fromEntries(this.loadTimes);
  }

  disconnect() {
    this.observer?.disconnect();
  }
}

// 字体回退策略
export const fontFallbacks = {
  // 系统字体栈
  systemFonts: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'Noto Sans',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji',
    ].join(', '),
    
    chinese: [
      'Source Han Sans CN',
      'PingFang SC',
      'Hiragino Sans GB',
      'Microsoft YaHei',
      'SimSun',
      'sans-serif',
    ].join(', '),
    
    mono: [
      'JetBrains Mono',
      'Fira Code',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ].join(', '),
  },

  // 字体匹配度检测
  detectFontSupport: (fontFamily: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const testSize = '72px';
      const baseFonts = ['monospace', 'sans-serif', 'serif'];
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      // 测量基础字体宽度
      const baseWidths = baseFonts.map(baseFont => {
        context.font = `${testSize} ${baseFont}`;
        return context.measureText(testString).width;
      });
      
      // 测量目标字体宽度
      context.font = `${testSize} ${fontFamily}, monospace`;
      const targetWidth = context.measureText(testString).width;
      
      // 如果宽度不同，说明字体已加载
      const isSupported = !baseWidths.includes(targetWidth);
      resolve(isSupported);
    });
  },
};