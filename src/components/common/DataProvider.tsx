'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { ErrorBoundary, ApiErrorDisplay, DataError } from './ErrorBoundary';
import { SmartLoading, PageLoading } from './LoadingStates';
import { useApiCache, useDataPreloader, useCacheStrategy } from '@/hooks/useApiCache';
import { usePerformanceMonitor } from '@/utils/performance';

// 数据提供者上下文
interface DataProviderContextType {
  cache: ReturnType<typeof useApiCache>;
  preloader: ReturnType<typeof useDataPreloader>;
  performance: ReturnType<typeof usePerformanceMonitor>;
}

const DataProviderContext = createContext<DataProviderContextType | null>(null);

// 数据提供者Props
interface DataProviderProps {
  children: ReactNode;
  cacheStrategy?: 'realtime' | 'static' | 'user' | 'list' | 'detail' | 'search';
  enablePerformanceMonitoring?: boolean;
  enablePreloading?: boolean;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

/**
 * 数据提供者组件
 * 提供统一的数据管理、缓存、性能监控和错误处理
 */
export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  cacheStrategy = 'user',
  enablePerformanceMonitoring = true,
  enablePreloading = true,
  errorFallback,
}) => {
  const cache = useApiCache();
  const preloader = useDataPreloader();
  const performance = usePerformanceMonitor();
  const { strategies, applyCacheStrategy } = useCacheStrategy();

  // 应用缓存策略
  useEffect(() => {
    if (cacheStrategy) {
      applyCacheStrategy(['*'], cacheStrategy);
    }
  }, [cacheStrategy, applyCacheStrategy]);

  // 性能监控初始化
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      // 监控用户交互
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        performance.recordUserInteraction('click', target.tagName);
      };

      const handleKeyPress = (event: KeyboardEvent) => {
        performance.recordUserInteraction('keypress', event.key);
      };

      document.addEventListener('click', handleClick);
      document.addEventListener('keypress', handleKeyPress);

      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keypress', handleKeyPress);
      };
    }
  }, [enablePerformanceMonitoring, performance]);

  const contextValue: DataProviderContextType = {
    cache,
    preloader,
    performance,
  };

  return (
    <DataProviderContext.Provider value={contextValue}>
      <ErrorBoundary fallback={errorFallback}>
        {children}
      </ErrorBoundary>
    </DataProviderContext.Provider>
  );
};

/**
 * 使用数据提供者Hook
 */
export const useDataProvider = (): DataProviderContextType => {
  const context = useContext(DataProviderContext);
  if (!context) {
    throw new Error('useDataProvider must be used within a DataProvider');
  }
  return context;
};

/**
 * 数据容器组件
 * 为特定数据加载提供容器和状态管理
 */
interface DataContainerProps<T> {
  children: (data: {
    data: T | undefined;
    loading: boolean;
    error: any;
    refetch: () => void;
  }) => ReactNode;
  
  // 数据加载配置
  url: string;
  params?: Record<string, any>;
  enabled?: boolean;
  
  // UI配置
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  
  // 性能配置
  cacheTime?: number;
  staleTime?: number;
  enablePreload?: boolean;
  preloadUrls?: string[];
  
  // 错误处理
  onError?: (error: any) => void;
  retryCount?: number;
}

export function DataContainer<T = any>({
  children,
  url,
  params,
  enabled = true,
  loadingComponent,
  errorComponent,
  emptyComponent,
  cacheTime,
  staleTime,
  enablePreload = false,
  preloadUrls = [],
  onError,
  retryCount = 3,
}: DataContainerProps<T>) {
  const { cache, preloader, performance } = useDataProvider();
  
  // 这里应该使用实际的数据获取Hook
  // 为了示例，我们模拟数据加载状态
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [loading, setLoading] = React.useState(enabled);
  const [error, setError] = React.useState<any>(null);

  const refetch = React.useCallback(() => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    // 模拟API调用
    const startTime = Date.now();
    
    setTimeout(() => {
      try {
        // 模拟成功响应
        setData({} as T);
        setLoading(false);
        
        // 记录性能
        performance.recordApiRequest(
          url,
          'GET',
          Date.now() - startTime,
          200
        );
      } catch (err) {
        setError(err);
        setLoading(false);
        onError?.(err);
        
        // 记录错误
        performance.recordApiRequest(
          url,
          'GET',
          Date.now() - startTime,
          500
        );
      }
    }, 1000);
  }, [url, enabled, performance, onError]);

  // 预加载相关数据
  React.useEffect(() => {
    if (enablePreload && preloadUrls.length > 0) {
      // 预加载相关数据 - 这里需要实际的预加载实现
      console.log('Preloading URLs:', preloadUrls);
    }
  }, [enablePreload, preloadUrls, preloader]);

  // 初始加载
  React.useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [enabled, refetch]);

  // 错误状态
  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    return <DataError error={error} onRetry={refetch} />;
  }

  // 加载状态
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return <PageLoading />;
  }

  // 空数据状态
  if (!data && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  // 渲染数据
  return <>{children({ data, loading, error, refetch })}</>;
}

/**
 * 列表数据容器
 */
interface ListDataContainerProps<T> extends Omit<DataContainerProps<T[]>, 'children'> {
  children: (data: {
    items: T[];
    loading: boolean;
    error: any;
    refetch: () => void;
    isEmpty: boolean;
    count: number;
  }) => ReactNode;
}

export function ListDataContainer<T = any>({
  children,
  ...props
}: ListDataContainerProps<T>) {
  return (
    <DataContainer<T[]> {...props}>
      {({ data, loading, error, refetch }) => {
        const items = data || [];
        return children({
          items,
          loading,
          error,
          refetch,
          isEmpty: items.length === 0,
          count: items.length,
        });
      }}
    </DataContainer>
  );
}

/**
 * 分页数据容器
 */
interface PaginatedDataContainerProps<T> extends Omit<DataContainerProps<any>, 'children'> {
  children: (data: {
    items: T[];
    loading: boolean;
    error: any;
    refetch: () => void;
    pagination: {
      current: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
    goToPage: (page: number) => void;
    changePageSize: (pageSize: number) => void;
  }) => ReactNode;
}

export function PaginatedDataContainer<T = any>({
  children,
  ...props
}: PaginatedDataContainerProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  return (
    <DataContainer<{
      data: T[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }> {...props}>
      {({ data, loading, error, refetch }) => {
        const items = data?.data || [];
        const pagination = {
          current: data?.page || currentPage,
          pageSize: data?.pageSize || pageSize,
          total: data?.total || 0,
          totalPages: data?.totalPages || 0,
        };

        const goToPage = (page: number) => {
          setCurrentPage(page);
          refetch();
        };

        const changePageSize = (newPageSize: number) => {
          setPageSize(newPageSize);
          setCurrentPage(1);
          refetch();
        };

        return children({
          items,
          loading,
          error,
          refetch,
          pagination,
          goToPage,
          changePageSize,
        });
      }}
    </DataContainer>
  );
}

/**
 * 智能数据容器
 * 根据数据类型和网络状况自动优化加载策略
 */
interface SmartDataContainerProps<T> extends DataContainerProps<T> {
  dataType?: 'static' | 'dynamic' | 'realtime';
  adaptiveLoading?: boolean;
}

export function SmartDataContainer<T = any>({
  dataType = 'dynamic',
  adaptiveLoading = true,
  ...props
}: SmartDataContainerProps<T>) {
  // 根据数据类型调整缓存策略
  const getCacheConfig = () => {
    switch (dataType) {
      case 'static':
        return { staleTime: 60 * 60 * 1000, cacheTime: 24 * 60 * 60 * 1000 };
      case 'realtime':
        return { staleTime: 0, cacheTime: 1 * 60 * 1000 };
      default:
        return { staleTime: 5 * 60 * 1000, cacheTime: 30 * 60 * 1000 };
    }
  };

  const cacheConfig = getCacheConfig();

  return (
    <DataContainer<T>
      {...props}
      staleTime={props.staleTime || cacheConfig.staleTime}
      cacheTime={props.cacheTime || cacheConfig.cacheTime}
      loadingComponent={
        <SmartLoading
          loading={true}
          skeleton={props.loadingComponent}
        >
          <div />
        </SmartLoading>
      }
    />
  );
}