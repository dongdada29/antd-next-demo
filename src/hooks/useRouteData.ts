'use client';

import { useApiQuery, useApiDetail, useApiList, useApiPagination, ApiQueryResult, PaginationResult } from './useApiQuery';
import { useRouteParams, useQueryParams, usePaginationParams, useFilterParams, ParamValidationRules } from './useRouteParams';
import { useMemo } from 'react';

/**
 * 路由数据Hook
 * 基于路由参数自动加载对应的数据
 */
export const useRouteData = <T = any>(
  baseUrl: string,
  paramValidationRules?: ParamValidationRules
): {
  data: T | undefined;
  loading: boolean;
  error: any;
  params: Record<string, any>;
  isValidParams: boolean;
  paramErrors: Record<string, string>;
  refetch: () => void;
} => {
  const { params, isValid, errors, validatedParams } = useRouteParams(paramValidationRules);

  // 构建API URL
  const apiUrl = useMemo(() => {
    if (!isValid) return '';
    
    let url = baseUrl;
    Object.entries(validatedParams).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
    });
    
    return url;
  }, [baseUrl, validatedParams, isValid]);

  const queryResult = useApiQuery<T>(apiUrl, {
    enabled: isValid && !!apiUrl,
  });

  return {
    data: queryResult.data,
    loading: queryResult.loading,
    error: queryResult.error,
    params: validatedParams,
    isValidParams: isValid,
    paramErrors: errors,
    refetch: queryResult.refetch,
  };
};

/**
 * 详情页数据Hook
 * 专门用于详情页面的数据加载
 */
export const useDetailPageData = <T = any>(
  baseUrl: string,
  idParamName: string = 'id'
): {
  data: T | undefined;
  loading: boolean;
  error: any;
  id: string | undefined;
  isValidId: boolean;
  refetch: () => void;
} => {
  const validationRules: ParamValidationRules = {
    [idParamName]: {
      required: true,
      type: 'string',
      pattern: /^[a-zA-Z0-9_-]+$/,
    },
  };

  const { params, isValid, validatedParams } = useRouteParams(validationRules);
  const id = validatedParams[idParamName] as string;

  const queryResult = useApiDetail<T>(baseUrl, id, {
    enabled: isValid && !!id,
  });

  return {
    data: queryResult.data,
    loading: queryResult.loading,
    error: queryResult.error,
    id,
    isValidId: isValid,
    refetch: queryResult.refetch,
  };
};

/**
 * 列表页数据Hook
 * 专门用于列表页面的数据加载，支持分页和过滤
 */
export const useListPageData = <T = any>(
  baseUrl: string,
  options?: {
    defaultPageSize?: number;
    filterValidationRules?: ParamValidationRules;
  }
): {
  data: T[] | undefined;
  loading: boolean;
  error: any;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: Record<string, any>;
  hasActiveFilters: boolean;
  goToPage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  sort: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
  updateFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
  refetch: () => void;
} => {
  const { defaultPageSize = 10, filterValidationRules } = options || {};

  // 分页参数
  const paginationParams = usePaginationParams({
    pageSize: defaultPageSize,
  });

  // 过滤参数
  const filterParams = useFilterParams(filterValidationRules);

  // 合并所有参数
  const allParams = useMemo(() => ({
    ...paginationParams.params,
    ...filterParams.params,
  }), [paginationParams.params, filterParams.params]);

  // 加载数据
  const queryResult = useApiQuery<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(baseUrl, {
    params: allParams,
    enabled: paginationParams.isValid && filterParams.isValid,
  });

  const pagination = queryResult.data ? {
    current: queryResult.data.page,
    pageSize: queryResult.data.pageSize,
    total: queryResult.data.total,
    totalPages: queryResult.data.totalPages,
  } : {
    current: paginationParams.params.page || 1,
    pageSize: paginationParams.params.pageSize || defaultPageSize,
    total: 0,
    totalPages: 0,
  };

  return {
    data: queryResult.data?.data,
    loading: queryResult.loading,
    error: queryResult.error,
    pagination,
    filters: filterParams.params,
    hasActiveFilters: filterParams.hasActiveFilters,
    goToPage: paginationParams.goToPage,
    changePageSize: paginationParams.changePageSize,
    sort: paginationParams.sort,
    updateFilters: filterParams.updateFilters,
    clearFilters: filterParams.clearFilters,
    refetch: queryResult.refetch,
  };
};

/**
 * 搜索页数据Hook
 * 专门用于搜索页面的数据加载
 */
export const useSearchPageData = <T = any>(
  baseUrl: string,
  options?: {
    searchParamName?: string;
    minSearchLength?: number;
    debounceMs?: number;
  }
): {
  data: T[] | undefined;
  loading: boolean;
  error: any;
  searchQuery: string;
  hasSearch: boolean;
  updateSearch: (query: string) => void;
  clearSearch: () => void;
  refetch: () => void;
} => {
  const { 
    searchParamName = 'q', 
    minSearchLength = 2,
  } = options || {};

  const validationRules: ParamValidationRules = {
    [searchParamName]: {
      type: 'string',
      min: minSearchLength,
    },
  };

  const { params, isValid, updateParams, clearParams } = useQueryParams(validationRules);
  const searchQuery = params[searchParamName] as string || '';
  const hasSearch = searchQuery.length >= minSearchLength;

  const queryResult = useApiQuery<T[]>(baseUrl, {
    params: { [searchParamName]: searchQuery },
    enabled: isValid && hasSearch,
  });

  const updateSearch = (query: string) => {
    updateParams({ [searchParamName]: query } as any);
  };

  const clearSearch = () => {
    clearParams();
  };

  return {
    data: queryResult.data,
    loading: queryResult.loading,
    error: queryResult.error,
    searchQuery,
    hasSearch,
    updateSearch,
    clearSearch,
    refetch: queryResult.refetch,
  };
};

/**
 * 动态路由数据Hook
 * 支持多级动态路由的数据加载
 */
export const useDynamicRouteData = <T = any>(
  urlTemplate: string,
  paramValidationRules?: ParamValidationRules
): {
  data: T | undefined;
  loading: boolean;
  error: any;
  params: Record<string, any>;
  isValidParams: boolean;
  paramErrors: Record<string, string>;
  resolvedUrl: string;
  refetch: () => void;
} => {
  const { params, isValid, errors, validatedParams } = useRouteParams(paramValidationRules);

  // 解析URL模板
  const resolvedUrl = useMemo(() => {
    if (!isValid) return '';
    
    let url = urlTemplate;
    Object.entries(validatedParams).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
    
    return url;
  }, [urlTemplate, validatedParams, isValid]);

  const queryResult = useApiQuery<T>(resolvedUrl, {
    enabled: isValid && !!resolvedUrl,
  });

  return {
    data: queryResult.data,
    loading: queryResult.loading,
    error: queryResult.error,
    params: validatedParams,
    isValidParams: isValid,
    paramErrors: errors,
    resolvedUrl,
    refetch: queryResult.refetch,
  };
};

/**
 * 嵌套路由数据Hook
 * 支持父子关系的数据加载
 */
export const useNestedRouteData = <TParent = any, TChild = any>(
  parentUrl: string,
  childUrl: string,
  parentIdParam: string = 'parentId',
  childIdParam?: string
): {
  parentData: TParent | undefined;
  childData: TChild | undefined;
  parentLoading: boolean;
  childLoading: boolean;
  parentError: any;
  childError: any;
  parentId: string | undefined;
  childId: string | undefined;
  isValidParams: boolean;
  refetchParent: () => void;
  refetchChild: () => void;
} => {
  const validationRules: ParamValidationRules = {
    [parentIdParam]: {
      required: true,
      type: 'string',
    },
  };

  if (childIdParam) {
    validationRules[childIdParam] = {
      required: true,
      type: 'string',
    };
  }

  const { params, isValid, validatedParams } = useRouteParams(validationRules);
  const parentId = validatedParams[parentIdParam] as string;
  const childId = childIdParam ? validatedParams[childIdParam] as string : undefined;

  // 加载父数据
  const parentQuery = useApiDetail<TParent>(parentUrl, parentId, {
    enabled: isValid && !!parentId,
  });

  // 加载子数据（如果有子ID）
  const childQuery = useApiDetail<TChild>(childUrl, childId, {
    enabled: isValid && !!childId && !!parentQuery.data,
  });

  return {
    parentData: parentQuery.data,
    childData: childQuery.data,
    parentLoading: parentQuery.loading,
    childLoading: childQuery.loading,
    parentError: parentQuery.error,
    childError: childQuery.error,
    parentId,
    childId,
    isValidParams: isValid,
    refetchParent: parentQuery.refetch,
    refetchChild: childQuery.refetch,
  };
};