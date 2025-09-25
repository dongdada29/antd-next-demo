/**
 * 通用API数据获取Hooks
 * 基于React Query提供统一的数据获取和状态管理
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { APIClient, APIResponse, APIError } from '@/lib/api-client';
import { defaultAPIClient } from '@/lib/api-client-factory';

// 重新导出新的Hook
export * from './useApiQuery';
export * from './useApiMutation';

// 通用数据Hook接口
export interface UseApiOptions<T> extends Omit<UseQueryOptions<APIResponse<T>>, 'queryKey' | 'queryFn'> {
  client?: APIClient;
}

// 通用变更Hook接口
export interface UseMutationApiOptions<TData, TVariables> 
  extends Omit<UseMutationOptions<APIResponse<TData>, APIError, TVariables>, 'mutationFn'> {
  client?: APIClient;
}

// 分页参数接口
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应接口
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 通用GET请求Hook
export const useApiGet = <T = any>(
  url: string,
  params?: Record<string, any>,
  options?: UseApiOptions<T>
) => {
  const { client = defaultAPIClient, ...queryOptions } = options || {};

  return useQuery({
    queryKey: [url, params],
    queryFn: () => client.get<T>(url, params),
    ...queryOptions,
  });
};

// 通用POST变更Hook
export const useApiPost = <TData = any, TVariables = any>(
  url: string,
  options?: UseMutationApiOptions<TData, TVariables>
) => {
  const { client = defaultAPIClient, ...mutationOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TVariables) => client.post<TData>(url, data),
    onSuccess: (data, variables, onMutateResult, context) => {
      // 默认行为：刷新相关查询
      queryClient.invalidateQueries({ queryKey: [url] });
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...mutationOptions,
  });
};

// 通用PUT变更Hook
export const useApiPut = <TData = any, TVariables = any>(
  url: string,
  options?: UseMutationApiOptions<TData, TVariables>
) => {
  const { client = defaultAPIClient, ...mutationOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TVariables) => client.put<TData>(url, data),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: [url] });
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...mutationOptions,
  });
};

// 通用PATCH变更Hook
export const useApiPatch = <TData = any, TVariables = any>(
  url: string,
  options?: UseMutationApiOptions<TData, TVariables>
) => {
  const { client = defaultAPIClient, ...mutationOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TVariables) => client.patch<TData>(url, data),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: [url] });
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...mutationOptions,
  });
};

// 通用DELETE变更Hook
export const useApiDelete = <TData = any>(
  url: string,
  options?: UseMutationApiOptions<TData, void>
) => {
  const { client = defaultAPIClient, ...mutationOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => client.delete<TData>(url),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: [url] });
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...mutationOptions,
  });
};

// 分页数据Hook
export const useApiPagination = <T = any>(
  url: string,
  params?: PaginationParams & Record<string, any>,
  options?: UseApiOptions<PaginatedResponse<T>>
) => {
  const { client = defaultAPIClient, ...queryOptions } = options || {};

  const queryResult = useQuery({
    queryKey: [url, 'pagination', params],
    queryFn: () => client.get<PaginatedResponse<T>>(url, params),
    ...queryOptions,
  });

  // 扩展返回值，包含分页操作方法
  return {
    ...queryResult,
    // 跳转到指定页
    goToPage: (_page: number) => {
      queryResult.refetch();
    },
    // 改变页面大小
    changePageSize: (_pageSize: number) => {
      queryResult.refetch();
    },
    // 排序
    sort: (_sortBy: string, _sortOrder: 'asc' | 'desc' = 'asc') => {
      queryResult.refetch();
    },
  };
};

// 无限滚动Hook
export const useApiInfiniteQuery = <T = any>(
  url: string,
  params?: Record<string, any>,
  options?: UseApiOptions<PaginatedResponse<T>>
) => {
  const { client = defaultAPIClient, ...queryOptions } = options || {};

  return useQuery({
    queryKey: [url, 'infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      client.get<PaginatedResponse<T>>(url, { ...params, page: pageParam }),
    ...queryOptions,
  });
};

// 批量操作Hook
export const useApiBatch = <TData = any, TVariables = any>(
  operations: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    data?: any;
  }>,
  options?: UseMutationApiOptions<TData[], TVariables>
) => {
  const { client = defaultAPIClient, ...mutationOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<APIResponse<TData[]>> => {
      const promises = operations.map(op => {
        switch (op.method) {
          case 'GET':
            return client.get(op.url);
          case 'POST':
            return client.post(op.url, op.data);
          case 'PUT':
            return client.put(op.url, op.data);
          case 'PATCH':
            return client.patch(op.url, op.data);
          case 'DELETE':
            return client.delete(op.url);
          default:
            throw new Error(`Unsupported method: ${op.method}`);
        }
      });

      const results = await Promise.all(promises);
      return {
        data: results.map(r => r.data) as TData[],
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        config: { method: 'BATCH', url: 'batch' },
      };
    },
    onSuccess: (data, variables, context) => {
      // 刷新所有相关查询
      operations.forEach(op => {
        queryClient.invalidateQueries({ queryKey: [op.url] });
      });
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, undefined, context as any);
      }
    },
    ...mutationOptions,
  });
};

// 实时数据Hook（使用轮询）
export const useApiRealtime = <T = any>(
  url: string,
  params?: Record<string, any>,
  options?: UseApiOptions<T> & {
    interval?: number; // 轮询间隔（毫秒）
    enabled?: boolean; // 是否启用轮询
  }
) => {
  const { 
    client = defaultAPIClient, 
    interval = 5000, 
    enabled = true,
    ...queryOptions 
  } = options || {};

  return useQuery({
    queryKey: [url, 'realtime', params],
    queryFn: () => client.get<T>(url, params),
    refetchInterval: enabled ? interval : false,
    refetchIntervalInBackground: true,
    ...queryOptions,
  });
};

// 缓存管理Hook
export const useApiCache = () => {
  const queryClient = useQueryClient();

  return {
    // 清除所有缓存
    clearAll: () => {
      queryClient.clear();
    },
    
    // 清除特定URL的缓存
    clearUrl: (url: string) => {
      queryClient.removeQueries({ queryKey: [url] });
    },
    
    // 预取数据
    prefetch: async <T>(url: string, params?: Record<string, any>) => {
      await queryClient.prefetchQuery({
        queryKey: [url, params],
        queryFn: () => defaultAPIClient.get<T>(url, params),
      });
    },
    
    // 设置查询数据
    setQueryData: <T>(url: string, data: T, params?: Record<string, any>) => {
      queryClient.setQueryData([url, params], data);
    },
    
    // 获取查询数据
    getQueryData: <T>(url: string, params?: Record<string, any>): T | undefined => {
      return queryClient.getQueryData([url, params]);
    },
    
    // 刷新特定查询
    invalidate: (url: string, params?: Record<string, any>) => {
      queryClient.invalidateQueries({ queryKey: [url, params] });
    },
    
    // 获取查询状态
    getQueryState: (url: string, params?: Record<string, any>) => {
      return queryClient.getQueryState([url, params]);
    },
  };
};

// 错误处理Hook
export const useApiError = () => {
  return {
    // 判断是否为API错误
    isApiError: (error: unknown): error is APIError => {
      return error instanceof APIError;
    },
    
    // 获取错误信息
    getErrorMessage: (error: unknown): string => {
      if (error instanceof APIError) {
        return error.message;
      }
      if (error instanceof Error) {
        return error.message;
      }
      return '未知错误';
    },
    
    // 判断错误类型
    getErrorType: (error: unknown): 'network' | 'client' | 'server' | 'auth' | 'unknown' => {
      if (error instanceof APIError) {
        if (error.isNetworkError) return 'network';
        if (error.isAuthError) return 'auth';
        if (error.isClientError) return 'client';
        if (error.isServerError) return 'server';
      }
      return 'unknown';
    },
    
    // 判断是否可重试
    isRetryable: (error: unknown): boolean => {
      return error instanceof APIError && error.isRetryable;
    },
  };
};

// 加载状态管理Hook
export const useApiLoading = () => {
  const queryClient = useQueryClient();

  return {
    // 获取全局加载状态
    isLoading: queryClient.isFetching() > 0,
    
    // 获取特定查询的加载状态
    isQueryLoading: (url: string, params?: Record<string, any>) => {
      const query = queryClient.getQueryState([url, params]);
      return query?.status === 'pending';
    },
    
    // 获取变更操作的加载状态
    isMutating: queryClient.isMutating() > 0,
  };
};