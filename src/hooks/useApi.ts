import { useState, useEffect, useCallback } from 'react';

// API 请求状态类型
export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// API Hook 配置
export interface UseApiOptions {
  immediate?: boolean; // 是否立即执行
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * 通用 API 请求 Hook
 */
export const useApi = <T = any>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
) => {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction();
      setState({
        data: result,
        loading: false,
        error: null,
      });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '请求失败';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      onError?.(errorMessage);
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);
  
  return {
    ...state,
    execute,
    reset,
  };
};