/**
 * 错误处理Hook
 * 为React组件提供统一的错误处理能力
 */

import { useCallback, useState } from 'react';
import { APIError } from '@/lib/api-client';
import { globalErrorHandler, ErrorLevel } from '@/lib/error-handler';

// 错误状态接口
export interface ErrorState {
  error: Error | null;
  hasError: boolean;
  errorMessage: string;
  errorLevel: ErrorLevel;
  retryCount: number;
}

// Hook返回值接口
export interface UseErrorHandlerReturn {
  errorState: ErrorState;
  handleError: (error: any, context?: string) => void;
  handleApiError: (error: APIError, context?: string) => void;
  handleValidationError: (errors: Record<string, string>, context?: string) => void;
  clearError: () => void;
  retry: (retryFn?: () => void | Promise<void>) => Promise<void>;
  canRetry: boolean;
}

// Hook配置选项
export interface UseErrorHandlerOptions {
  maxRetries?: number;
  autoRetry?: boolean;
  retryDelay?: number;
  showNotification?: boolean;
  onError?: (error: any) => void;
  onRetry?: () => void | Promise<void>;
}

/**
 * 错误处理Hook
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const {
    maxRetries = 3,
    autoRetry = false,
    retryDelay = 1000,
    showNotification = true,
    onError,
    onRetry,
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
    errorMessage: '',
    errorLevel: ErrorLevel.MEDIUM,
    retryCount: 0,
  });

  // 处理错误
  const handleError = useCallback((error: any, context?: string) => {
    const errorLevel = getErrorLevel(error);
    const errorMessage = getErrorMessage(error);

    setErrorState({
      error,
      hasError: true,
      errorMessage,
      errorLevel,
      retryCount: 0,
    });

    // 使用全局错误处理器
    if (showNotification) {
      globalErrorHandler.handle(error, context);
    }

    // 调用错误回调
    onError?.(error);

    // 自动重试
    if (autoRetry && isRetryableError(error) && errorState.retryCount < maxRetries) {
      setTimeout(() => {
        retry();
      }, retryDelay);
    }
  }, [showNotification, onError, autoRetry, maxRetries, retryDelay, errorState.retryCount]);

  // 处理API错误
  const handleApiError = useCallback((error: APIError, context?: string) => {
    handleError(error, context);
  }, [handleError]);

  // 处理表单验证错误
  const handleValidationError = useCallback((errors: Record<string, string>, context?: string) => {
    const validationError = new Error('Validation failed');
    validationError.name = 'ValidationError';
    (validationError as any).validationErrors = errors;
    
    handleError(validationError, context);
  }, [handleError]);

  // 清除错误
  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
      errorMessage: '',
      errorLevel: ErrorLevel.MEDIUM,
      retryCount: 0,
    });
  }, []);

  // 重试操作
  const retry = useCallback(async (retryFn?: () => void | Promise<void>) => {
    if (errorState.retryCount >= maxRetries) {
      return;
    }

    setErrorState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
    }));

    try {
      // 执行重试函数
      if (retryFn) {
        await retryFn();
      } else if (onRetry) {
        await onRetry();
      }
      
      // 重试成功，清除错误
      clearError();
    } catch (retryError) {
      // 重试失败，更新错误状态
      handleError(retryError, 'Retry failed');
    }
  }, [errorState.retryCount, maxRetries, onRetry, clearError, handleError]);

  // 判断是否可以重试
  const canRetry = errorState.hasError && 
    errorState.retryCount < maxRetries && 
    isRetryableError(errorState.error);

  return {
    errorState,
    handleError,
    handleApiError,
    handleValidationError,
    clearError,
    retry,
    canRetry,
  };
}

// 获取错误级别
function getErrorLevel(error: any): ErrorLevel {
  if (error instanceof APIError) {
    if (error.isAuthError) return ErrorLevel.HIGH;
    if (error.isServerError) return ErrorLevel.HIGH;
    if (error.isNetworkError) return ErrorLevel.MEDIUM;
    if (error.status === 404) return ErrorLevel.LOW;
  }
  
  if (error.name === 'ValidationError') return ErrorLevel.LOW;
  
  return ErrorLevel.MEDIUM;
}

// 获取错误消息
function getErrorMessage(error: any): string {
  if (error instanceof APIError) {
    return error.message || '请求失败';
  }
  
  if (error.name === 'ValidationError') {
    const validationErrors = (error as any).validationErrors;
    if (validationErrors) {
      return Object.values(validationErrors).join(', ');
    }
  }
  
  return error.message || '发生了未知错误';
}

// 判断错误是否可重试
function isRetryableError(error: any): boolean {
  if (error instanceof APIError) {
    return error.isRetryable;
  }
  
  // 网络错误通常可以重试
  if (error.name === 'NetworkError' || error.name === 'TypeError') {
    return true;
  }
  
  return false;
}

/**
 * 异步操作错误处理Hook
 * 专门用于处理异步操作中的错误
 */
export function useAsyncErrorHandler(options: UseErrorHandlerOptions = {}) {
  const errorHandler = useErrorHandler(options);
  
  // 包装异步函数，自动处理错误
  const wrapAsync = useCallback(<T extends any[], R>(
    asyncFn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        errorHandler.clearError();
        return await asyncFn(...args);
      } catch (error) {
        errorHandler.handleError(error);
        return undefined;
      }
    };
  }, [errorHandler]);

  // 包装API调用
  const wrapApiCall = useCallback(<T extends any[], R>(
    apiCall: (...args: T) => Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        errorHandler.clearError();
        return await apiCall(...args);
      } catch (error) {
        if (error instanceof APIError) {
          errorHandler.handleApiError(error, context);
        } else {
          errorHandler.handleError(error, context);
        }
        return undefined;
      }
    };
  }, [errorHandler]);

  return {
    ...errorHandler,
    wrapAsync,
    wrapApiCall,
  };
}

/**
 * 表单错误处理Hook
 * 专门用于处理表单验证和提交错误
 */
export function useFormErrorHandler(options: UseErrorHandlerOptions = {}) {
  const errorHandler = useErrorHandler(options);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 设置字段错误
  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  // 清除字段错误
  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // 清除所有字段错误
  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  // 处理表单提交错误
  const handleSubmitError = useCallback((error: any) => {
    if (error instanceof APIError && error.status === 422) {
      // 处理验证错误
      const validationErrors = error.details?.errors || {};
      setFieldErrors(validationErrors);
      errorHandler.handleValidationError(validationErrors, 'Form submission');
    } else {
      errorHandler.handleError(error, 'Form submission');
    }
  }, [errorHandler]);

  // 包装表单提交函数
  const wrapSubmit = useCallback(<T extends any[], R>(
    submitFn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        clearAllFieldErrors();
        errorHandler.clearError();
        return await submitFn(...args);
      } catch (error) {
        handleSubmitError(error);
        return undefined;
      }
    };
  }, [errorHandler, clearAllFieldErrors, handleSubmitError]);

  return {
    ...errorHandler,
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    handleSubmitError,
    wrapSubmit,
  };
}