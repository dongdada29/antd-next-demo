'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { APIClient, APIResponse } from '@/lib/api-client';
import { defaultAPIClient } from '@/lib/api-client-factory';

/**
 * API缓存管理Hook
 * 提供数据缓存、预取和失效管理功能
 */
export const useApiCache = () => {
  const queryClient = useQueryClient();

  // 缓存管理方法
  const cache = useMemo(() => ({
    // 清除所有缓存
    clearAll: () => {
      queryClient.clear();
    },

    // 清除特定URL的缓存
    clearUrl: (url: string, params?: Record<string, any>) => {
      queryClient.removeQueries({ queryKey: [url, params] });
    },

    // 清除匹配模式的缓存
    clearPattern: (pattern: string) => {
      queryClient.removeQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return typeof queryKey === 'string' && queryKey.includes(pattern);
        },
      });
    },

    // 预取数据
    prefetch: async <T>(
      url: string, 
      params?: Record<string, any>,
      client: APIClient = defaultAPIClient
    ) => {
      await queryClient.prefetchQuery({
        queryKey: [url, params],
        queryFn: () => client.get<T>(url, params),
        staleTime: 5 * 60 * 1000, // 5分钟
      });
    },

    // 预取多个数据
    prefetchMultiple: async (
      requests: Array<{
        url: string;
        params?: Record<string, any>;
        client?: APIClient;
      }>
    ) => {
      const promises = requests.map(({ url, params, client = defaultAPIClient }) =>
        queryClient.prefetchQuery({
          queryKey: [url, params],
          queryFn: () => client.get(url, params),
          staleTime: 5 * 60 * 1000,
        })
      );
      
      await Promise.all(promises);
    },

    // 设置查询数据
    setQueryData: <T>(
      url: string, 
      data: APIResponse<T>, 
      params?: Record<string, any>
    ) => {
      queryClient.setQueryData([url, params], data);
    },

    // 获取查询数据
    getQueryData: <T>(
      url: string, 
      params?: Record<string, any>
    ): APIResponse<T> | undefined => {
      return queryClient.getQueryData([url, params]);
    },

    // 刷新特定查询
    invalidate: (url: string, params?: Record<string, any>) => {
      queryClient.invalidateQueries({ queryKey: [url, params] });
    },

    // 刷新匹配模式的查询
    invalidatePattern: (pattern: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return typeof queryKey === 'string' && queryKey.includes(pattern);
        },
      });
    },

    // 获取查询状态
    getQueryState: (url: string, params?: Record<string, any>) => {
      return queryClient.getQueryState([url, params]);
    },

    // 获取所有查询状态
    getAllQueries: () => {
      return queryClient.getQueryCache().getAll();
    },

    // 获取缓存统计信息
    getCacheStats: () => {
      const queries = queryClient.getQueryCache().getAll();
      return {
        total: queries.length,
        fresh: queries.filter(q => q.state.dataUpdatedAt > Date.now() - 5 * 60 * 1000).length,
        stale: queries.filter(q => q.isStale()).length,
        loading: queries.filter(q => q.state.fetchStatus === 'fetching').length,
        error: queries.filter(q => q.state.status === 'error').length,
      };
    },
  }), [queryClient]);

  return cache;
};

/**
 * 数据预加载Hook
 * 智能预加载相关数据
 */
export const useDataPreloader = () => {
  const { prefetch, prefetchMultiple } = useApiCache();

  const preloader = useMemo(() => ({
    // 预加载列表页相关数据
    preloadListPage: async (
      baseUrl: string,
      options?: {
        preloadDetails?: boolean;
        detailIds?: string[];
        preloadStats?: boolean;
        statsUrl?: string;
      }
    ) => {
      const requests = [
        { url: baseUrl }, // 列表数据
      ];

      // 预加载统计数据
      if (options?.preloadStats && options.statsUrl) {
        requests.push({ url: options.statsUrl });
      }

      // 预加载详情数据
      if (options?.preloadDetails && options.detailIds) {
        options.detailIds.forEach(id => {
          requests.push({ url: `${baseUrl}/${id}` });
        });
      }

      await prefetchMultiple(requests);
    },

    // 预加载详情页相关数据
    preloadDetailPage: async (
      baseUrl: string,
      id: string,
      options?: {
        preloadRelated?: boolean;
        relatedUrls?: string[];
        preloadEdit?: boolean;
      }
    ) => {
      const requests = [
        { url: `${baseUrl}/${id}` }, // 详情数据
      ];

      // 预加载编辑表单数据
      if (options?.preloadEdit) {
        requests.push({ url: `${baseUrl}/${id}/edit` });
      }

      // 预加载相关数据
      if (options?.preloadRelated && options.relatedUrls) {
        options.relatedUrls.forEach(url => {
          requests.push({ url });
        });
      }

      await prefetchMultiple(requests);
    },

    // 预加载表单页相关数据
    preloadFormPage: async (
      baseUrl: string,
      options?: {
        preloadOptions?: boolean;
        optionUrls?: string[];
        preloadValidation?: boolean;
        validationUrl?: string;
      }
    ) => {
      const requests: Array<{ url: string; params?: Record<string, any> }> = [];

      // 预加载选项数据
      if (options?.preloadOptions && options.optionUrls) {
        options.optionUrls.forEach(url => {
          requests.push({ url });
        });
      }

      // 预加载验证规则
      if (options?.preloadValidation && options.validationUrl) {
        requests.push({ url: options.validationUrl });
      }

      if (requests.length > 0) {
        await prefetchMultiple(requests);
      }
    },

    // 智能预加载（基于用户行为）
    smartPreload: async (
      currentUrl: string,
      userBehavior?: {
        visitedUrls?: string[];
        commonPatterns?: string[];
        nextLikelyUrls?: string[];
      }
    ) => {
      const requests: Array<{ url: string; params?: Record<string, any> }> = [];

      // 基于访问历史预加载
      if (userBehavior?.visitedUrls) {
        userBehavior.visitedUrls.slice(-3).forEach(url => {
          if (url !== currentUrl) {
            requests.push({ url });
          }
        });
      }

      // 基于常见模式预加载
      if (userBehavior?.commonPatterns) {
        userBehavior.commonPatterns.forEach(pattern => {
          requests.push({ url: pattern });
        });
      }

      // 基于预测的下一步操作预加载
      if (userBehavior?.nextLikelyUrls) {
        userBehavior.nextLikelyUrls.forEach(url => {
          requests.push({ url });
        });
      }

      if (requests.length > 0) {
        await prefetchMultiple(requests);
      }
    },
  }), [prefetch, prefetchMultiple]);

  return preloader;
};

/**
 * 缓存策略Hook
 * 提供不同场景的缓存策略
 */
export const useCacheStrategy = () => {
  const queryClient = useQueryClient();

  const strategies = useMemo(() => ({
    // 实时数据策略（短缓存时间）
    realtime: {
      staleTime: 0,
      gcTime: 1 * 60 * 1000, // 1分钟
      refetchInterval: 30 * 1000, // 30秒
      refetchOnWindowFocus: true,
    },

    // 静态数据策略（长缓存时间）
    static: {
      staleTime: 60 * 60 * 1000, // 1小时
      gcTime: 24 * 60 * 60 * 1000, // 24小时
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },

    // 用户数据策略（中等缓存时间）
    user: {
      staleTime: 5 * 60 * 1000, // 5分钟
      gcTime: 30 * 60 * 1000, // 30分钟
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },

    // 列表数据策略
    list: {
      staleTime: 2 * 60 * 1000, // 2分钟
      gcTime: 10 * 60 * 1000, // 10分钟
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },

    // 详情数据策略
    detail: {
      staleTime: 5 * 60 * 1000, // 5分钟
      gcTime: 15 * 60 * 1000, // 15分钟
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },

    // 搜索结果策略
    search: {
      staleTime: 1 * 60 * 1000, // 1分钟
      gcTime: 5 * 60 * 1000, // 5分钟
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  }), []);

  const applyCacheStrategy = useCallback((
    queryKey: string[],
    strategy: keyof typeof strategies
  ) => {
    const config = strategies[strategy];
    queryClient.setQueryDefaults(queryKey, config);
  }, [queryClient, strategies]);

  return {
    strategies,
    applyCacheStrategy,
  };
};

/**
 * 缓存优化Hook
 * 提供缓存优化和清理功能
 */
export const useCacheOptimization = () => {
  const queryClient = useQueryClient();

  const optimization = useMemo(() => ({
    // 清理过期缓存
    cleanupStaleCache: () => {
      const queries = queryClient.getQueryCache().getAll();
      const staleQueries = queries.filter(query => query.isStale());
      
      staleQueries.forEach(query => {
        queryClient.removeQueries({ queryKey: query.queryKey });
      });

      return staleQueries.length;
    },

    // 清理错误缓存
    cleanupErrorCache: () => {
      const queries = queryClient.getQueryCache().getAll();
      const errorQueries = queries.filter(query => query.state.status === 'error');
      
      errorQueries.forEach(query => {
        queryClient.removeQueries({ queryKey: query.queryKey });
      });

      return errorQueries.length;
    },

    // 优化缓存大小
    optimizeCacheSize: (maxQueries: number = 100) => {
      const queries = queryClient.getQueryCache().getAll();
      
      if (queries.length > maxQueries) {
        // 按最后更新时间排序，移除最旧的查询
        const sortedQueries = queries.sort((a, b) => 
          a.state.dataUpdatedAt - b.state.dataUpdatedAt
        );
        
        const queriesToRemove = sortedQueries.slice(0, queries.length - maxQueries);
        
        queriesToRemove.forEach(query => {
          queryClient.removeQueries({ queryKey: query.queryKey });
        });

        return queriesToRemove.length;
      }

      return 0;
    },

    // 预热缓存
    warmupCache: async (urls: string[]) => {
      const promises = urls.map(url => 
        queryClient.prefetchQuery({
          queryKey: [url],
          queryFn: () => defaultAPIClient.get(url),
          staleTime: 5 * 60 * 1000,
        })
      );

      await Promise.all(promises);
    },

    // 获取缓存健康状态
    getCacheHealth: () => {
      const queries = queryClient.getQueryCache().getAll();
      const now = Date.now();
      
      const health = {
        total: queries.length,
        fresh: 0,
        stale: 0,
        error: 0,
        loading: 0,
        avgAge: 0,
        memoryUsage: 0, // 简化计算
      };

      let totalAge = 0;
      
      queries.forEach(query => {
        const age = now - query.state.dataUpdatedAt;
        totalAge += age;
        
        if (query.state.status === 'error') {
          health.error++;
        } else if (query.state.fetchStatus === 'fetching') {
          health.loading++;
        } else if (query.isStale()) {
          health.stale++;
        } else {
          health.fresh++;
        }
        
        // 简化的内存使用计算
        health.memoryUsage += JSON.stringify(query.state.data || {}).length;
      });

      health.avgAge = queries.length > 0 ? totalAge / queries.length : 0;
      
      return health;
    },
  }), [queryClient]);

  return optimization;
};