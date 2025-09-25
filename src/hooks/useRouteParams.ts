'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

// 路由参数类型
export interface RouteParams {
  [key: string]: string | string[] | undefined;
}

// 查询参数类型
export interface QueryParams {
  [key: string]: string | string[] | undefined;
}

// 参数验证规则
export interface ParamValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array';
  pattern?: RegExp;
  min?: number;
  max?: number;
  enum?: string[];
  transform?: (value: string) => any;
}

export interface ParamValidationRules {
  [key: string]: ParamValidationRule;
}

// 参数验证结果
export interface ParamValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  values: Record<string, any>;
}

/**
 * 路由参数Hook
 * 获取和验证Next.js路由参数
 */
export const useRouteParams = <T extends RouteParams = RouteParams>(
  validationRules?: ParamValidationRules
): {
  params: T;
  isValid: boolean;
  errors: Record<string, string>;
  validatedParams: Record<string, any>;
} => {
  const params = useParams() as T;

  const validation = useMemo(() => {
    if (!validationRules) {
      return {
        isValid: true,
        errors: {},
        values: params,
      };
    }

    return validateParams(params, validationRules);
  }, [params, validationRules]);

  return {
    params,
    isValid: validation.isValid,
    errors: validation.errors,
    validatedParams: validation.values,
  };
};

/**
 * 查询参数Hook
 * 获取和验证URL查询参数
 */
export const useQueryParams = <T extends QueryParams = QueryParams>(
  validationRules?: ParamValidationRules
): {
  params: T;
  isValid: boolean;
  errors: Record<string, string>;
  validatedParams: Record<string, any>;
  updateParams: (newParams: Partial<T>) => void;
  clearParams: () => void;
} => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = useMemo(() => {
    const result: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result as T;
  }, [searchParams]);

  const validation = useMemo(() => {
    if (!validationRules) {
      return {
        isValid: true,
        errors: {},
        values: params,
      };
    }

    return validateParams(params, validationRules);
  }, [params, validationRules]);

  const updateParams = (newParams: Partial<T>) => {
    const current = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    router.push(`?${current.toString()}`);
  };

  const clearParams = () => {
    router.push(window.location.pathname);
  };

  return {
    params,
    isValid: validation.isValid,
    errors: validation.errors,
    validatedParams: validation.values,
    updateParams,
    clearParams,
  };
};

/**
 * 分页参数Hook
 * 专门处理分页相关的查询参数
 */
export interface PaginationParams extends Record<string, any> {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const usePaginationParams = (
  defaultParams?: Partial<PaginationParams>
): {
  params: PaginationParams;
  isValid: boolean;
  errors: Record<string, string>;
  updatePagination: (newParams: Partial<PaginationParams>) => void;
  goToPage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  sort: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
  reset: () => void;
} => {
  const validationRules: ParamValidationRules = {
    page: {
      type: 'number',
      min: 1,
      transform: (value) => parseInt(value, 10) || 1,
    },
    pageSize: {
      type: 'number',
      min: 1,
      max: 100,
      transform: (value) => parseInt(value, 10) || 10,
    },
    sortBy: {
      type: 'string',
    },
    sortOrder: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
  };

  const { params, isValid, errors, updateParams, clearParams } = useQueryParams<PaginationParams>(validationRules);

  const finalParams: PaginationParams = {
    page: 1,
    pageSize: 10,
    ...defaultParams,
    ...params,
  };

  const updatePagination = (newParams: Partial<PaginationParams>) => {
    updateParams(newParams);
  };

  const goToPage = (page: number) => {
    updatePagination({ page });
  };

  const changePageSize = (pageSize: number) => {
    updatePagination({ pageSize, page: 1 }); // 重置到第一页
  };

  const sort = (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    updatePagination({ sortBy, sortOrder, page: 1 }); // 重置到第一页
  };

  const reset = () => {
    clearParams();
  };

  return {
    params: finalParams,
    isValid,
    errors,
    updatePagination,
    goToPage,
    changePageSize,
    sort,
    reset,
  };
};

/**
 * 过滤参数Hook
 * 专门处理列表过滤相关的查询参数
 */
export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

export const useFilterParams = <T extends FilterParams = FilterParams>(
  validationRules?: ParamValidationRules
): {
  params: T;
  isValid: boolean;
  errors: Record<string, string>;
  updateFilters: (newFilters: Partial<T>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
} => {
  const { params, isValid, errors, updateParams, clearParams } = useQueryParams<T>(validationRules);

  const hasActiveFilters = Object.values(params).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  const updateFilters = (newFilters: Partial<T>) => {
    updateParams(newFilters);
  };

  const clearFilters = () => {
    clearParams();
  };

  return {
    params,
    isValid,
    errors,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
};

/**
 * 参数验证函数
 */
function validateParams(
  params: Record<string, any>,
  rules: ParamValidationRules
): ParamValidationResult {
  const errors: Record<string, string> = {};
  const values: Record<string, any> = {};

  Object.entries(rules).forEach(([key, rule]) => {
    const value = params[key];

    // 检查必填项
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors[key] = `${key} is required`;
      return;
    }

    // 如果值为空且不是必填项，跳过验证
    if (value === undefined || value === null || value === '') {
      return;
    }

    // 类型转换
    let transformedValue = value;
    if (rule.transform) {
      try {
        transformedValue = rule.transform(String(value));
      } catch (error) {
        errors[key] = `Invalid ${key} format`;
        return;
      }
    }

    // 类型验证
    if (rule.type) {
      switch (rule.type) {
        case 'number':
          const numValue = Number(transformedValue);
          if (isNaN(numValue)) {
            errors[key] = `${key} must be a number`;
            return;
          }
          transformedValue = numValue;
          break;
        case 'boolean':
          if (typeof transformedValue !== 'boolean') {
            transformedValue = transformedValue === 'true' || transformedValue === '1';
          }
          break;
        case 'array':
          if (!Array.isArray(transformedValue)) {
            if (typeof transformedValue === 'string') {
              transformedValue = transformedValue.split(',').map(s => s.trim());
            } else {
              errors[key] = `${key} must be an array`;
              return;
            }
          }
          break;
      }
    }

    // 模式验证
    if (rule.pattern && !rule.pattern.test(String(transformedValue))) {
      errors[key] = `${key} format is invalid`;
      return;
    }

    // 数值范围验证
    if (rule.type === 'number' && typeof transformedValue === 'number') {
      if (rule.min !== undefined && transformedValue < rule.min) {
        errors[key] = `${key} must be at least ${rule.min}`;
        return;
      }
      if (rule.max !== undefined && transformedValue > rule.max) {
        errors[key] = `${key} must be at most ${rule.max}`;
        return;
      }
    }

    // 枚举验证
    if (rule.enum && !rule.enum.includes(String(transformedValue))) {
      errors[key] = `${key} must be one of: ${rule.enum.join(', ')}`;
      return;
    }

    values[key] = transformedValue;
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values,
  };
}