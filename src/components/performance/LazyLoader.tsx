/**
 * 懒加载组件包装器
 * 提供可视化的懒加载状态和性能监控
 */

'use client';

import React, { 
  Suspense, 
  ComponentType, 
  ReactNode, 
  useEffect, 
  useState,
  useCallback,
  useRef
} from 'react';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { PerformanceMonitor } from '../../lib/bundle-optimization';

// 懒加载器配置
export interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>;
  onLoad?: (loadTime: number) => void;
  onError?: (error: Error) => void;
  className?: string;
  minLoadTime?: number; // 最小加载时间，避免闪烁
  timeout?: number; // 超时时间
  retryCount?: number; // 重试次数
  name?: string; // 组件名称，用于性能监控
}

// 默认加载组件
const DefaultFallback = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className || ''}`}>
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <div className="text-sm text-muted-foreground">加载中...</div>
    </div>
  </div>
);

// 默认错误组件
const DefaultErrorFallback = ({ 
  error, 
  retry 
}: { 
  error: Error; 
  retry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-destructive text-lg mb-2">加载失败</div>
    <div className="text-sm text-muted-foreground mb-4 max-w-md">
      {error.message}
    </div>
    <button
      onClick={retry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      重试
    </button>
  </div>
);

/**
 * 懒加载器组件
 */
export const LazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  fallback,
  errorFallback: ErrorFallback = DefaultErrorFallback,
  onLoad,
  onError,
  className,
  minLoadTime = 200,
  timeout = 10000,
  retryCount = 3,
  name = 'unknown',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 处理加载完成
  const handleLoad = useCallback(() => {
    const loadTime = Date.now() - startTimeRef.current;
    
    // 确保最小加载时间，避免闪烁
    const remainingTime = Math.max(0, minLoadTime - loadTime);
    
    setTimeout(() => {
      setIsLoading(false);
      onLoad?.(loadTime);
      PerformanceMonitor.recordLoadTime(`lazy:${name}`, startTimeRef.current);
    }, remainingTime);
  }, [minLoadTime, onLoad, name]);

  // 处理错误
  const handleError = useCallback((err: Error) => {
    setError(err);
    setIsLoading(false);
    onError?.(err);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [onError]);

  // 重试逻辑
  const retry = useCallback(() => {
    if (retries < retryCount) {
      setError(null);
      setIsLoading(true);
      setRetries(prev => prev + 1);
      startTimeRef.current = Date.now();
      
      // 重新设置超时
      timeoutRef.current = setTimeout(() => {
        handleError(new Error('加载超时'));
      }, timeout);
    }
  }, [retries, retryCount, timeout, handleError]);

  // 设置超时
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        handleError(new Error('加载超时'));
      }
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout, isLoading, handleError]);

  // 监听子组件加载完成
  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      handleLoad();
    }, 0);

    return () => clearTimeout(timer);
  }, [children, isLoading, handleLoad]);

  if (error) {
    return (
      <div className={className}>
        <ErrorFallback error={error} retry={retry} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        {fallback || <DefaultFallback className={className} />}
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <div className={className}>
          <ErrorFallback error={error} retry={retry} />
        </div>
      )}
    >
      <div className={className}>
        {children}
      </div>
    </ErrorBoundary>
  );
};

/**
 * 智能懒加载器 - 基于视口检测
 */
export interface SmartLazyLoaderProps extends LazyLoaderProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  preloadOnHover?: boolean;
  preloadOnFocus?: boolean;
}

export const SmartLazyLoader: React.FC<SmartLazyLoaderProps> = ({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  preloadOnHover = true,
  preloadOnFocus = true,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // 交叉观察器
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  // 预加载处理
  const handlePreload = useCallback(() => {
    if (!isPreloaded) {
      setIsPreloaded(true);
      // 这里可以触发预加载逻辑
    }
  }, [isPreloaded]);

  return (
    <div
      ref={elementRef}
      onMouseEnter={preloadOnHover ? handlePreload : undefined}
      onFocus={preloadOnFocus ? handlePreload : undefined}
      className={props.className}
    >
      {isVisible ? (
        <LazyLoader {...props}>
          {children}
        </LazyLoader>
      ) : (
        props.fallback || <DefaultFallback className={props.className} />
      )}
    </div>
  );
};

/**
 * 批量懒加载器
 */
export interface BatchLazyLoaderProps {
  items: Array<{
    key: string;
    component: ReactNode;
    priority?: number;
  }>;
  batchSize?: number;
  delay?: number;
  className?: string;
  fallback?: ReactNode;
}

export const BatchLazyLoader: React.FC<BatchLazyLoaderProps> = ({
  items,
  batchSize = 3,
  delay = 100,
  className,
  fallback,
}) => {
  const [loadedItems, setLoadedItems] = useState<Set<string>>(new Set());
  const [currentBatch, setCurrentBatch] = useState(0);

  // 按优先级排序
  const sortedItems = [...items].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  // 批量加载逻辑
  useEffect(() => {
    const timer = setTimeout(() => {
      const startIndex = currentBatch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, sortedItems.length);
      
      if (startIndex < sortedItems.length) {
        const newLoaded = new Set(loadedItems);
        for (let i = startIndex; i < endIndex; i++) {
          newLoaded.add(sortedItems[i].key);
        }
        setLoadedItems(newLoaded);
        setCurrentBatch(prev => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentBatch, batchSize, delay, sortedItems, loadedItems]);

  return (
    <div className={className}>
      {sortedItems.map(({ key, component }) => (
        <div key={key}>
          {loadedItems.has(key) ? (
            <LazyLoader name={key}>
              {component}
            </LazyLoader>
          ) : (
            fallback || <DefaultFallback />
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * 懒加载 HOC
 */
export function withLazyLoader<P extends object>(
  Component: ComponentType<P>,
  config: Omit<LazyLoaderProps, 'children'> = {}
) {
  const LazyComponent = React.forwardRef<any, P>((props, ref) => (
    <LazyLoader {...config} name={Component.displayName || Component.name}>
      <Component {...props} ref={ref} />
    </LazyLoader>
  ));

  LazyComponent.displayName = `withLazyLoader(${Component.displayName || Component.name})`;

  return LazyComponent;
}

/**
 * 懒加载 Hook
 */
export function useLazyLoader(name: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const load = useCallback(async (importFn: () => Promise<any>) => {
    try {
      setIsLoading(true);
      setError(null);
      startTimeRef.current = Date.now();
      
      const result = await importFn();
      
      PerformanceMonitor.recordLoadTime(`hook:${name}`, startTimeRef.current);
      setIsLoading(false);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('加载失败');
      setError(error);
      setIsLoading(false);
      throw error;
    }
  }, [name]);

  return {
    isLoading,
    error,
    load,
  };
}