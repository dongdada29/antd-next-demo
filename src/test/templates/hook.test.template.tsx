/**
 * Hook测试模板
 * 提供自定义Hook的标准测试用例
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { testDataGenerators, mockApiResponse, mockApiError } from '../utils';

// 导入要测试的Hook
// import { useYourHook } from '@/hooks/useYourHook';

/**
 * Hook测试模板
 * 
 * 使用方法：
 * 1. 复制此模板文件
 * 2. 重命名为实际Hook名称
 * 3. 导入实际Hook
 * 4. 根据Hook的具体功能调整测试用例
 */

// 创建测试包装器
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useYourHook', () => {
  beforeEach(() => {
    // 重置fetch模拟
    vi.mocked(fetch).mockClear();
  });

  describe('初始状态测试', () => {
    it('应该返回正确的初始状态', () => {
      const { result } = renderHook(() => {
        // 返回模拟的hook结果
        return {
          data: null,
          loading: false,
          error: null,
          refetch: vi.fn(),
        };
      });

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.refetch).toBe('function');
    });

    it('应该正确处理初始参数', () => {
      const initialParams = { id: '123', enabled: true };
      
      const { result } = renderHook(() => {
        // 模拟带参数的hook
        return {
          params: initialParams,
          data: null,
        };
      });

      expect(result.current.params).toEqual(initialParams);
    });
  });

  describe('数据获取测试', () => {
    it('应该成功获取数据', async () => {
      const mockData = testDataGenerators.user();
      
      // 模拟成功的API响应
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const { result } = renderHook(() => {
        // 模拟数据获取hook
        return {
          data: null,
          loading: true,
          error: null,
        };
      }, {
        wrapper: createWrapper(),
      });

      // 初始状态
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();

      // 等待数据加载完成
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('应该处理数据获取错误', async () => {
      const errorMessage = 'API Error';
      
      // 模拟API错误
      vi.mocked(fetch).mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => {
        // 模拟错误状态
        return {
          data: null,
          loading: false,
          error: new Error(errorMessage),
        };
      }, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe(errorMessage);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('应该支持条件获取', async () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => {
          // 模拟条件获取hook
          return {
            data: enabled ? testDataGenerators.user() : null,
            loading: enabled,
            enabled,
          };
        },
        {
          initialProps: { enabled: false },
          wrapper: createWrapper(),
        }
      );

      // 初始状态 - 禁用
      expect(result.current.enabled).toBe(false);
      expect(result.current.data).toBeNull();

      // 启用数据获取
      rerender({ enabled: true });

      expect(result.current.enabled).toBe(true);
      expect(result.current.loading).toBe(true);
    });
  });

  describe('数据变更测试', () => {
    it('应该成功执行变更操作', async () => {
      const mockData = testDataGenerators.user();
      
      // 模拟成功的变更响应
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const { result } = renderHook(() => {
        // 模拟变更hook
        const mutate = vi.fn().mockResolvedValue(mockData);
        return {
          mutate,
          loading: false,
          error: null,
          data: null,
        };
      });

      // 执行变更
      await act(async () => {
        await result.current.mutate({ name: 'Updated Name' });
      });

      expect(result.current.mutate).toHaveBeenCalledWith({ name: 'Updated Name' });
    });

    it('应该处理变更错误', async () => {
      const errorMessage = 'Mutation Error';
      
      const { result } = renderHook(() => {
        const mutate = vi.fn().mockRejectedValue(new Error(errorMessage));
        return {
          mutate,
          loading: false,
          error: null,
        };
      });

      // 执行变更并期望错误
      await act(async () => {
        try {
          await result.current.mutate({ name: 'Updated Name' });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe(errorMessage);
        }
      });
    });

    it('应该正确处理乐观更新', async () => {
      const originalData = testDataGenerators.user();
      const updatedData = { ...originalData, name: 'Updated Name' };

      const { result } = renderHook(() => {
        // 模拟乐观更新hook
        return {
          data: originalData,
          mutate: vi.fn(),
          optimisticUpdate: (newData: any) => newData,
        };
      });

      // 执行乐观更新
      act(() => {
        const optimisticData = result.current.optimisticUpdate(updatedData);
        expect(optimisticData).toEqual(updatedData);
      });
    });
  });

  describe('缓存管理测试', () => {
    it('应该正确缓存数据', async () => {
      const mockData = testDataGenerators.user();
      
      const { result } = renderHook(() => {
        // 模拟缓存hook
        return {
          data: mockData,
          isCached: true,
          cacheTime: Date.now(),
        };
      }, {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.isCached).toBe(true);
      expect(typeof result.current.cacheTime).toBe('number');
    });

    it('应该支持缓存失效', async () => {
      const { result } = renderHook(() => {
        // 模拟缓存失效hook
        return {
          invalidateCache: vi.fn(),
          clearCache: vi.fn(),
        };
      }, {
        wrapper: createWrapper(),
      });

      // 测试缓存失效
      act(() => {
        result.current.invalidateCache();
      });

      expect(result.current.invalidateCache).toHaveBeenCalled();

      // 测试清除缓存
      act(() => {
        result.current.clearCache();
      });

      expect(result.current.clearCache).toHaveBeenCalled();
    });
  });

  describe('参数变化测试', () => {
    it('应该响应参数变化', async () => {
      const { result, rerender } = renderHook(
        ({ userId }) => {
          // 模拟依赖参数的hook
          return {
            userId,
            data: userId ? testDataGenerators.user({ id: userId }) : null,
          };
        },
        {
          initialProps: { userId: 1 },
        }
      );

      // 初始状态
      expect(result.current.userId).toBe(1);
      expect(result.current.data?.id).toBe(1);

      // 更改参数
      rerender({ userId: 2 });

      expect(result.current.userId).toBe(2);
      expect(result.current.data?.id).toBe(2);
    });

    it('应该正确处理参数验证', () => {
      const { result } = renderHook(
        ({ params }) => {
          // 模拟参数验证hook
          const isValid = params && typeof params.id === 'number';
          return {
            params,
            isValid,
            error: isValid ? null : new Error('Invalid parameters'),
          };
        },
        {
          initialProps: { params: { id: 'invalid' } },
        }
      );

      expect(result.current.isValid).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('副作用测试', () => {
    it('应该正确处理副作用', () => {
      const mockCallback = vi.fn();

      renderHook(() => {
        // 模拟副作用hook
        const executeEffect = () => {
          mockCallback();
        };
        
        return { executeEffect };
      });

      expect(mockCallback).toHaveBeenCalled();
    });

    it('应该正确清理副作用', () => {
      const mockCleanup = vi.fn();

      const { unmount } = renderHook(() => {
        // 模拟需要清理的hook
        return {
          cleanup: mockCleanup,
        };
      });

      // 卸载组件
      unmount();

      expect(mockCleanup).toHaveBeenCalled();
    });
  });

  describe('错误处理测试', () => {
    it('应该捕获和处理错误', async () => {
      const { result } = renderHook(() => {
        // 模拟错误处理hook
        return {
          error: null,
          handleError: (error: Error) => error,
          clearError: vi.fn(),
        };
      });

      const testError = new Error('Test Error');

      // 处理错误
      act(() => {
        const handledError = result.current.handleError(testError);
        expect(handledError).toBe(testError);
      });

      // 清除错误
      act(() => {
        result.current.clearError();
      });

      expect(result.current.clearError).toHaveBeenCalled();
    });

    it('应该提供错误恢复机制', async () => {
      const { result } = renderHook(() => {
        // 模拟错误恢复hook
        return {
          error: new Error('Test Error'),
          retry: vi.fn(),
          canRetry: true,
        };
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.canRetry).toBe(true);

      // 执行重试
      act(() => {
        result.current.retry();
      });

      expect(result.current.retry).toHaveBeenCalled();
    });
  });

  describe('性能测试', () => {
    it('应该避免不必要的重新渲染', () => {
      const mockCallback = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => {
          // 模拟性能优化hook
          mockCallback();
          return { value };
        },
        {
          initialProps: { value: 1 },
        }
      );

      // 初始渲染
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // 相同值重新渲染
      rerender({ value: 1 });
      expect(mockCallback).toHaveBeenCalledTimes(1); // 应该没有增加

      // 不同值重新渲染
      rerender({ value: 2 });
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('应该正确处理防抖', async () => {
      const mockCallback = vi.fn();

      const { result } = renderHook(() => {
        // 模拟防抖hook
        return {
          debouncedCallback: mockCallback,
          trigger: () => mockCallback(),
        };
      });

      // 快速多次调用
      act(() => {
        result.current.trigger();
        result.current.trigger();
        result.current.trigger();
      });

      // 应该只调用一次（防抖效果）
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('状态管理测试', () => {
    it('应该正确管理内部状态', () => {
      const { result } = renderHook(() => {
        // 模拟状态管理hook
        return {
          state: { count: 0 },
          increment: vi.fn(),
          decrement: vi.fn(),
          reset: vi.fn(),
        };
      });

      expect(result.current.state.count).toBe(0);

      // 测试状态更新方法
      act(() => {
        result.current.increment();
      });

      expect(result.current.increment).toHaveBeenCalled();
    });

    it('应该支持状态持久化', () => {
      const { result } = renderHook(() => {
        // 模拟持久化hook
        return {
          persistedState: { theme: 'dark' },
          updatePersistedState: vi.fn(),
        };
      });

      expect(result.current.persistedState.theme).toBe('dark');

      // 测试状态更新
      act(() => {
        result.current.updatePersistedState({ theme: 'light' });
      });

      expect(result.current.updatePersistedState).toHaveBeenCalledWith({ theme: 'light' });
    });
  });
});