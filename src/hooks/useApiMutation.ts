'use client';

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';
import { APIClient, APIResponse, APIError } from '@/lib/api-client';
import { defaultAPIClient } from '@/lib/api-client-factory';

// 扩展的变更选项
export interface UseApiMutationOptions<TData, TVariables> 
  extends Omit<UseMutationOptions<APIResponse<TData>, APIError, TVariables>, 'mutationFn'> {
  client?: APIClient;
  invalidateQueries?: string[]; // 需要刷新的查询键
  showSuccessMessage?: boolean | string; // 是否显示成功消息
  showErrorMessage?: boolean; // 是否显示错误消息
}

// 变更结果扩展接口
export interface ApiMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<APIResponse<TData>>;
  data: TData | undefined;
  loading: boolean;
  error: APIError | null;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

/**
 * 通用API变更Hook
 */
export const useApiMutation = <TData = any, TVariables = any>(
  mutationFn: (variables: TVariables, client: APIClient) => Promise<APIResponse<TData>>,
  options?: UseApiMutationOptions<TData, TVariables>
): ApiMutationResult<TData, TVariables> => {
  const { 
    client = defaultAPIClient, 
    invalidateQueries = [],
    showSuccessMessage = false,
    showErrorMessage = true,
    ...mutationOptions 
  } = options || {};
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (variables: TVariables) => mutationFn(variables, client),
    onSuccess: (data, variables, context) => {
      // 刷新相关查询
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      // 显示成功消息
      if (showSuccessMessage) {
        const successMsg = typeof showSuccessMessage === 'string' 
          ? showSuccessMessage 
          : '操作成功';
        message.success(successMsg);
      }

      // 调用用户定义的成功回调
      mutationOptions.onSuccess?.(data, variables, undefined, context as any);
    },
    onError: (error, variables, context) => {
      // 显示错误消息
      if (showErrorMessage) {
        const errorMsg = error.message || '操作失败';
        message.error(errorMsg);
      }

      // 调用用户定义的错误回调
      mutationOptions.onError?.(error, variables, undefined, context as any);
    },
    ...mutationOptions,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data?.data,
    loading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

/**
 * POST请求Hook
 */
export const useApiPost = <TData = any, TVariables = any>(
  url: string,
  options?: UseApiMutationOptions<TData, TVariables>
): ApiMutationResult<TData, TVariables> => {
  return useApiMutation<TData, TVariables>(
    (variables, client) => client.post<TData>(url, variables),
    {
      invalidateQueries: [url],
      showSuccessMessage: '创建成功',
      ...options,
    }
  );
};

/**
 * PUT请求Hook
 */
export const useApiPut = <TData = any, TVariables = any>(
  url: string,
  options?: UseApiMutationOptions<TData, TVariables>
): ApiMutationResult<TData, TVariables> => {
  return useApiMutation<TData, TVariables>(
    (variables, client) => client.put<TData>(url, variables),
    {
      invalidateQueries: [url],
      showSuccessMessage: '更新成功',
      ...options,
    }
  );
};

/**
 * PATCH请求Hook
 */
export const useApiPatch = <TData = any, TVariables = any>(
  url: string,
  options?: UseApiMutationOptions<TData, TVariables>
): ApiMutationResult<TData, TVariables> => {
  return useApiMutation<TData, TVariables>(
    (variables, client) => client.patch<TData>(url, variables),
    {
      invalidateQueries: [url],
      showSuccessMessage: '更新成功',
      ...options,
    }
  );
};

/**
 * DELETE请求Hook
 */
export const useApiDelete = <TData = any>(
  url: string,
  options?: UseApiMutationOptions<TData, void>
): ApiMutationResult<TData, void> => {
  return useApiMutation<TData, void>(
    (_, client) => client.delete<TData>(url),
    {
      invalidateQueries: [url],
      showSuccessMessage: '删除成功',
      ...options,
    }
  );
};

/**
 * 批量操作Hook
 */
export interface BatchOperation {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
}

export const useApiBatch = <TData = any>(
  operations: BatchOperation[],
  options?: UseApiMutationOptions<TData[], BatchOperation[]>
): ApiMutationResult<TData[], BatchOperation[]> => {
  return useApiMutation<TData[], BatchOperation[]>(
    async (ops, client): Promise<APIResponse<TData[]>> => {
      const promises = ops.map(op => {
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
    {
      invalidateQueries: operations.map(op => op.url),
      showSuccessMessage: '批量操作成功',
      ...options,
    }
  );
};

/**
 * 表单提交Hook
 * 专门用于表单数据的提交
 */
export const useApiFormSubmit = <TData = any, TFormData = any>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST',
  options?: UseApiMutationOptions<TData, TFormData>
): ApiMutationResult<TData, TFormData> & {
  submitForm: (formData: TFormData) => void;
} => {
  const mutationResult = useApiMutation<TData, TFormData>(
    (formData, client) => {
      switch (method) {
        case 'POST':
          return client.post<TData>(url, formData);
        case 'PUT':
          return client.put<TData>(url, formData);
        case 'PATCH':
          return client.patch<TData>(url, formData);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    {
      invalidateQueries: [url],
      showSuccessMessage: method === 'POST' ? '创建成功' : '更新成功',
      ...options,
    }
  );

  return {
    ...mutationResult,
    submitForm: mutationResult.mutate,
  };
};

/**
 * 文件上传Hook
 */
export const useApiUpload = <TData = any>(
  url: string,
  options?: UseApiMutationOptions<TData, FormData>
): ApiMutationResult<TData, FormData> & {
  uploadFile: (file: File, additionalData?: Record<string, any>) => void;
} => {
  const mutationResult = useApiMutation<TData, FormData>(
    (formData, client) => client.post<TData>(url, formData),
    {
      showSuccessMessage: '上传成功',
      ...options,
    }
  );

  const uploadFile = (file: File, additionalData?: Record<string, any>) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    mutationResult.mutate(formData);
  };

  return {
    ...mutationResult,
    uploadFile,
  };
};