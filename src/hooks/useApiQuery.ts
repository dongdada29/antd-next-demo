'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { APIClient, APIResponse, APIError } from '@/lib/api-client';
import { defaultAPIClient } from '@/lib/api-client-factory';

// 扩展的查询选项
export interface UseApiQueryOptions<T> extends Omit<UseQueryOptions<APIResponse<T>, APIError>, 'queryKey' | 'queryFn'> {
  client?: APIClient;
  params?: Record<string, any>;
}

// 查询结果扩展接口
export interface ApiQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: APIError | null;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => void;
  isFetching: boolean;
  isStale: boolean;
}

/**
 * 通用API查询Hook
 * 提供统一的数据获取和状态管理
 */
export const useApiQuery = <T = any>(
  url: string,
  options?: UseApiQueryOptions<T>
): ApiQueryResult<T> => {
  const { client = defaultAPIClient, params, ...queryOptions } = options || {};

  const queryResult = useQuery({
    queryKey: [url, params],
    queryFn: async () => {
      const response = await client.get<T>(url, params);
      return response;
    },
    ...queryOptions,
  });

  return {
    data: queryResult.data?.data,
    loading: queryResult.isLoading,
    error: queryResult.error,
    isSuccess: queryResult.isSuccess,
    isError: queryResult.isError,
    refetch: queryResult.refetch,
    isFetching: queryResult.isFetching,
    isStale: queryResult.isStale,
  };
};

/**
 * 条件查询Hook
 * 只有在条件满足时才执行查询
 */
export const useApiQueryWhen = <T = any>(
  url: string,
  condition: boolean,
  options?: UseApiQueryOptions<T>
): ApiQueryResult<T> => {
  return useApiQuery<T>(url, {
    ...options,
    enabled: condition && (options?.enabled !== false),
  });
};

/**
 * 依赖查询Hook
 * 基于其他查询的结果执行查询
 */
export const useApiQueryDependent = <T = any, TDep = any>(
  url: string | ((dep: TDep) => string),
  dependency: TDep | undefined,
  options?: UseApiQueryOptions<T>
): ApiQueryResult<T> => {
  const finalUrl = typeof url === 'function' ? (dependency ? url(dependency) : '') : url;
  
  return useApiQuery<T>(finalUrl, {
    ...options,
    enabled: !!dependency && !!finalUrl && (options?.enabled !== false),
  });
};

/**
 * 分页查询Hook
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationResult<T> extends ApiQueryResult<PaginatedData<T>> {
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  goToPage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  sort: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
}

export const useApiPagination = <T = any>(
  url: string,
  initialParams?: PaginationParams & Record<string, any>,
  options?: UseApiQueryOptions<PaginatedData<T>>
): PaginationResult<T> => {
  const queryResult = useApiQuery<PaginatedData<T>>(url, {
    ...options,
    params: initialParams,
  });

  const pagination = queryResult.data ? {
    current: queryResult.data.page,
    pageSize: queryResult.data.pageSize,
    total: queryResult.data.total,
    totalPages: queryResult.data.totalPages,
  } : {
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  };

  return {
    ...queryResult,
    pagination,
    goToPage: (page: number) => {
      // 这里需要更新查询参数并重新获取
      queryResult.refetch();
    },
    changePageSize: (pageSize: number) => {
      // 这里需要更新查询参数并重新获取
      queryResult.refetch();
    },
    sort: (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
      // 这里需要更新查询参数并重新获取
      queryResult.refetch();
    },
  };
};

/**
 * 实时数据查询Hook
 * 支持轮询和自动刷新
 */
export const useApiRealtime = <T = any>(
  url: string,
  options?: UseApiQueryOptions<T> & {
    interval?: number; // 轮询间隔（毫秒）
    enabled?: boolean; // 是否启用轮询
  }
): ApiQueryResult<T> => {
  const { interval = 5000, enabled = true, ...queryOptions } = options || {};

  return useApiQuery<T>(url, {
    ...queryOptions,
    refetchInterval: enabled ? interval : false,
    refetchIntervalInBackground: true,
  });
};

/**
 * 列表查询Hook
 * 专门用于列表数据的查询
 */
export const useApiList = <T = any>(
  url: string,
  options?: UseApiQueryOptions<T[]>
): ApiQueryResult<T[]> & {
  isEmpty: boolean;
  count: number;
} => {
  const queryResult = useApiQuery<T[]>(url, options);

  return {
    ...queryResult,
    isEmpty: !queryResult.data || queryResult.data.length === 0,
    count: queryResult.data?.length || 0,
  };
};

/**
 * 详情查询Hook
 * 专门用于单个实体的查询
 */
export const useApiDetail = <T = any>(
  url: string,
  id: string | number | undefined,
  options?: UseApiQueryOptions<T>
): ApiQueryResult<T> => {
  return useApiQueryWhen<T>(
    `${url}/${id}`,
    !!id,
    options
  );
};