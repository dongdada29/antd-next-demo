/**
 * Hook 测试模板
 * 用于生成标准化的 React Hook 测试文件
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestWrapper } from '../utils';
import { {{HOOK_NAME}} } from '{{HOOK_PATH}}';

describe('{{HOOK_NAME}}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 基础功能测试
  describe('Basic Functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_PARAMS}}), {
        wrapper: TestWrapper,
      });
      
      expect(result.current).toEqual({{EXPECTED_INITIAL_STATE}});
    });

    it('should accept custom initial values', () => {
      const customParams = {{CUSTOM_PARAMS}};
      
      const { result } = renderHook(() => {{HOOK_NAME}}(customParams), {
        wrapper: TestWrapper,
      });
      
      expect(result.current).toEqual({{EXPECTED_CUSTOM_STATE}});
    });
  });

  // 状态更新测试
  describe('State Updates', () => {
    {{STATE_UPDATE_TESTS}}
  });

  // 副作用测试
  describe('Side Effects', () => {
    {{SIDE_EFFECT_TESTS}}
  });

  // 异步操作测试
  describe('Async Operations', () => {
    it('should handle async operations correctly', async () => {
      const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_PARAMS}}), {
        wrapper: TestWrapper,
      });
      
      act(() => {
        {{ASYNC_ACTION}}
      });
      
      // 验证加载状态
      expect(result.current.loading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        {{ASYNC_RESULT_ASSERTIONS}}
      });
    });

    it('should handle async errors correctly', async () => {
      // 模拟异步错误
      {{ASYNC_ERROR_MOCK}}
      
      const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_PARAMS}}), {
        wrapper: TestWrapper,
      });
      
      act(() => {
        {{ASYNC_ERROR_ACTION}}
      });
      
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle concurrent async operations', async () => {
      const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_PARAMS}}), {
        wrapper: TestWrapper,
      });
      
      // 启动多个异步操作
      act(() => {
        {{CONCURRENT_ASYNC_ACTIONS}}
      });
      
      await waitFor(() => {
        {{CONCURRENT_RESULT_ASSERTIONS}}
      });
    });
  });

  // 清理测试
  describe('Cleanup', () => {
    it('should cleanup resources on unmount', () => {
      const cleanupSpy = vi.fn();
      
      const { unmount } = renderHook(() => {
        const result = {{HOOK_NAME}}({{DEFAULT_PARAMS}});
        
        // 模拟需要清理的资源
        React.useEffect(() => {
          return cleanupSpy;
        }, []);
        
        return result;
      }, {
        wrapper: TestWrapper,
      });
      
      unmount();
      
      expect(cleanupSpy).toHaveBeenCalled();
    });

    it('should cancel pending operations on unmount', async () => {
      const { result, unmount } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_PARAMS}}), {
        wrapper: TestWrapper,
      });
      
      act(() => {
        {{START_ASYNC_OPERATION}}
      });
      
      // 在操作完成前卸载
      unmount();
      
      // 验证操作被取消
      {{CANCELLATION_ASSERTIONS}}
    });
  });

  // 依赖项测试
  describe('Dependencies', () => {
    it('should update when dependencies change', () => {
      let params = {{INITIAL_DEPS}};
      
      const { result, rerender } = renderHook(() => {{HOOK_NAME}}(params), {
        wrapper: TestWrapper,
      });
      
      const initialResult = result.current;
      
      // 更新依赖项
      params = {{UPDATED_DEPS}};
      rerender();
      
      expect(result.current).not.toEqual(initialResult);
      {{DEPENDENCY_UPDATE_ASSERTIONS}}
    });

    it('should not update when dependencies remain the same', () => {
      const params = {{STABLE_DEPS}};
      
      const { result, rerender } = renderHook(() => {{HOOK_NAME}}(params), {
        wrapper: TestWrapper,
      });
      
      const initialResult = result.current;
      
      // 重新渲染但依赖项不变
      rerender();
      
      expect(result.current).toBe(initialResult);
    });
  });

  // 错误处理测试
  describe('Error Handling', () => {
    it('should handle invalid parameters gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const { result } = renderHook(() => {{HOOK_NAME}}({{INVALID_PARAMS}}), {
        wrapper: TestWrapper,
      });
      
      expect(result.current.error).toBeTruthy();
      
      consoleSpy.mockRestore();
    });

    it('should recover from errors', async () => {
      const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_PARAMS}}), {
        wrapper: TestWrapper,
      });
      
      // 触发错误
      act(() => {
        {{TRIGGER_ERROR}}
      });
      
      expect(result.current.error).toBeTruthy();
      
      // 恢复操作
      act(() => {
        {{RECOVERY_ACTION}}
      });
      
      await waitFor(() => {
        expect(result.current.error).toBeFalsy();
      });
    });
  });

  // 性能测试
  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const renderSpy = vi.fn();
      
      const { rerender } = renderHook(() => {
        renderSpy();
        return {{HOOK_NAME}}({{DEFAULT_PARAMS}});
      }, {
        wrapper: TestWrapper,
      });
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // 重新渲染相同的参数
      rerender();
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should memoize expensive computations', () => {
      const expensiveComputationSpy = vi.fn().mockReturnValue({{COMPUTATION_RESULT}});
      
      const { result, rerender } = renderHook(() => {{HOOK_NAME}}({
        ...{{DEFAULT_PARAMS}},
        expensiveComputation: expensiveComputationSpy,
      }), {
        wrapper: TestWrapper,
      });
      
      expect(expensiveComputationSpy).toHaveBeenCalledTimes(1);
      
      // 重新渲染但参数不变
      rerender();
      
      expect(expensiveComputationSpy).toHaveBeenCalledTimes(1);
    });
  });

  // 边界情况测试
  describe('Edge Cases', () => {
    {{EDGE_CASE_TESTS}}
  });

  // 集成测试
  describe('Integration', () => {
    it('should work correctly with other hooks', () => {
      const { result } = renderHook(() => {
        const hookResult = {{HOOK_NAME}}({{DEFAULT_PARAMS}});
        const otherHookResult = {{OTHER_HOOK}}({{OTHER_HOOK_PARAMS}});
        
        return { hookResult, otherHookResult };
      }, {
        wrapper: TestWrapper,
      });
      
      {{INTEGRATION_ASSERTIONS}}
    });

    it('should work correctly with context providers', () => {
      const contextValue = {{CONTEXT_VALUE}};
      
      const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
        <TestWrapper>
          <{{CONTEXT_PROVIDER}} value={contextValue}>
            {children}
          </{{CONTEXT_PROVIDER}}>
        </TestWrapper>
      );
      
      const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_PARAMS}}), {
        wrapper: CustomWrapper,
      });
      
      {{CONTEXT_INTEGRATION_ASSERTIONS}}
    });
  });
});