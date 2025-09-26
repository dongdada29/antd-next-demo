// 自定义 Hooks 导出
export * from './useLocalStorage';
export * from './useApiQuery';
export * from './useApiMutation';
// 从useRouteParams中选择性导出，避免重复
export { 
  useRouteParams,
  useQueryParams,
  usePaginationParams,
  useFilterParams,
  type RouteParams,
  type QueryParams,
  type FilterParams,
  type ParamValidationRule,
  type ParamValidationRules,
  type ParamValidationResult
} from './useRouteParams';
export * from './useRouteData';

// 从useApi中选择性导出，避免重复
export { 
  useApiGet, 
  useApiPost, 
  useApiPut, 
  useApiPatch, 
  useApiDelete,
  useApiPagination,
  useApiInfiniteQuery,
  useApiBatch,
  useApiRealtime,
  useApiError,
  useApiLoading
} from './useApi';

// 从useApiCache中选择性导出，避免重复
export { 
  useDataPreloader,
  useCacheStrategy,
  useCacheOptimization
} from './useApiCache';

// 错误处理相关Hooks
export * from './useErrorHandler';