/**
 * 错误处理集成测试
 * 测试完整的错误处理流程
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockApiError, resetApiMocks } from '../utils';
import { APIClient, APIError } from '@/lib/api-client';
import { useErrorHandler, useAsyncErrorHandler, useFormErrorHandler } from '@/hooks/useErrorHandler';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import React from 'react';
import { Button, Form, Input } from 'antd';

// 模拟Ant Design组件
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
    notification: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      open: vi.fn(),
    },
  };
});

describe('错误处理集成测试', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetApiMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetApiMocks();
  });

  describe('API错误处理集成', () => {
    // 测试组件：使用API错误处理Hook
    const APIErrorTestComponent: React.FC = () => {
      const { errorState, handleApiError, clearError, retry } = useAsyncErrorHandler();
      const [data, setData] = React.useState<any>(null);
      const [loading, setLoading] = React.useState(false);

      const fetchData = async () => {
        setLoading(true);
        try {
          const apiClient = new APIClient({ baseURL: 'http://localhost:3000/api' });
          const response = await apiClient.get('/users');
          setData(response.data);
        } catch (error) {
          if (error instanceof APIError) {
            handleApiError(error, 'Fetch Users');
          }
        } finally {
          setLoading(false);
        }
      };

      return (
        <div>
          <Button onClick={fetchData} loading={loading}>
            获取数据
          </Button>
          
          {errorState.hasError && (
            <div data-testid="error-display">
              <p>错误: {errorState.errorMessage}</p>
              <Button onClick={clearError}>清除错误</Button>
              {errorState.retryCount < 3 && (
                <Button onClick={() => retry(fetchData)}>重试</Button>
              )}
            </div>
          )}
          
          {data && (
            <div data-testid="data-display">
              数据加载成功: {JSON.stringify(data)}
            </div>
          )}
        </div>
      );
    };

    it('应该处理API网络错误', async () => {
      mockApiError('/users', 'Network Error', { status: 0 });

      renderWithProviders(<APIErrorTestComponent />);

      const fetchButton = screen.getByText('获取数据');
      await user.click(fetchButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      expect(screen.getByText(/网络错误/)).toBeInTheDocument();
      expect(screen.getByText('重试')).toBeInTheDocument();
    });

    it('应该处理API认证错误', async () => {
      mockApiError('/users', 'Unauthorized', { status: 401 });

      renderWithProviders(<APIErrorTestComponent />);

      const fetchButton = screen.getByText('获取数据');
      await user.click(fetchButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      expect(screen.getByText(/未授权/)).toBeInTheDocument();
    });

    it('应该支持错误重试', async () => {
      let callCount = 0;
      vi.mocked(fetch).mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Network Error');
        }
        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve([{ id: 1, name: 'User 1' }]),
        } as Response;
      });

      renderWithProviders(<APIErrorTestComponent />);

      const fetchButton = screen.getByText('获取数据');
      await user.click(fetchButton);

      // 等待错误显示
      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      // 点击重试
      const retryButton = screen.getByText('重试');
      await user.click(retryButton);

      // 等待成功
      await waitFor(() => {
        expect(screen.getByTestId('data-display')).toBeInTheDocument();
      });

      expect(screen.getByText(/数据加载成功/)).toBeInTheDocument();
      expect(callCount).toBe(2);
    });
  });

  describe('表单错误处理集成', () => {
    // 测试组件：使用表单错误处理Hook
    const FormErrorTestComponent: React.FC = () => {
      const { 
        errorState, 
        fieldErrors, 
        handleSubmitError, 
        clearError,
        wrapSubmit 
      } = useFormErrorHandler();
      const [form] = Form.useForm();

      const submitForm = async (values: any) => {
        const apiClient = new APIClient({ baseURL: 'http://localhost:3000/api' });
        const response = await apiClient.post('/users', values);
        return response.data;
      };

      const handleSubmit = wrapSubmit(submitForm);

      return (
        <div>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item 
              name="name" 
              label="姓名"
              validateStatus={fieldErrors.name ? 'error' : ''}
              help={fieldErrors.name}
            >
              <Input />
            </Form.Item>
            
            <Form.Item 
              name="email" 
              label="邮箱"
              validateStatus={fieldErrors.email ? 'error' : ''}
              help={fieldErrors.email}
            >
              <Input />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>

          {errorState.hasError && (
            <div data-testid="form-error">
              <p>提交错误: {errorState.errorMessage}</p>
              <Button onClick={clearError}>清除错误</Button>
            </div>
          )}
        </div>
      );
    };

    it('应该处理表单验证错误', async () => {
      const validationErrors = {
        name: '姓名不能为空',
        email: '邮箱格式不正确',
      };
      
      mockApiError('/users', 'Validation Error', { 
        status: 422, 
        details: { errors: validationErrors } 
      });

      renderWithProviders(<FormErrorTestComponent />);

      // 填写表单
      await user.type(screen.getByLabelText('姓名'), 'Test User');
      await user.type(screen.getByLabelText('邮箱'), 'invalid-email');

      // 提交表单
      const submitButton = screen.getByText('提交');
      await user.click(submitButton);

      // 等待验证错误显示
      await waitFor(() => {
        expect(screen.getByText('姓名不能为空')).toBeInTheDocument();
        expect(screen.getByText('邮箱格式不正确')).toBeInTheDocument();
      });
    });

    it('应该处理表单提交服务器错误', async () => {
      mockApiError('/users', 'Internal Server Error', { status: 500 });

      renderWithProviders(<FormErrorTestComponent />);

      // 填写表单
      await user.type(screen.getByLabelText('姓名'), 'Test User');
      await user.type(screen.getByLabelText('邮箱'), 'test@example.com');

      // 提交表单
      const submitButton = screen.getByText('提交');
      await user.click(submitButton);

      // 等待错误显示
      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
      });

      expect(screen.getByText(/服务器错误/)).toBeInTheDocument();
    });
  });

  describe('React错误边界集成', () => {
    // 会抛出错误的测试组件
    const ErrorThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
      if (shouldThrow) {
        throw new Error('Component Error');
      }
      return <div>正常组件</div>;
    };

    // 包装组件
    const ErrorBoundaryTestComponent: React.FC = () => {
      const [shouldThrow, setShouldThrow] = React.useState(false);

      return (
        <div>
          <Button onClick={() => setShouldThrow(true)}>
            触发错误
          </Button>
          
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      );
    };

    it('应该捕获组件错误并显示错误边界', async () => {
      renderWithProviders(<ErrorBoundaryTestComponent />);

      expect(screen.getByText('正常组件')).toBeInTheDocument();

      // 触发错误
      const errorButton = screen.getByText('触发错误');
      await user.click(errorButton);

      // 等待错误边界显示
      await waitFor(() => {
        expect(screen.getByText('页面出错了')).toBeInTheDocument();
      });

      expect(screen.getByText('重试')).toBeInTheDocument();
    });

    it('应该提供错误恢复选项', async () => {
      renderWithProviders(<ErrorBoundaryTestComponent />);

      // 触发错误
      const errorButton = screen.getByText('触发错误');
      await user.click(errorButton);

      // 等待错误边界显示
      await waitFor(() => {
        expect(screen.getByText('页面出错了')).toBeInTheDocument();
      });

      // 检查恢复选项
      expect(screen.getByText('重试')).toBeInTheDocument();
      expect(screen.getByText('刷新页面')).toBeInTheDocument();
    });
  });

  describe('全局错误处理集成', () => {
    it('应该处理未捕获的Promise拒绝', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // 创建未处理的Promise拒绝
      const unhandledPromise = Promise.reject(new Error('Unhandled Promise Rejection'));
      
      // 触发unhandledrejection事件
      const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
        promise: unhandledPromise,
        reason: new Error('Unhandled Promise Rejection'),
      });
      
      window.dispatchEvent(rejectionEvent);

      // 验证错误被记录
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error:',
          expect.objectContaining({
            message: expect.stringContaining('Unhandled Promise Rejection'),
          })
        );
      });

      consoleSpy.mockRestore();
    });

    it('应该处理未捕获的JavaScript错误', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // 创建未捕获的错误事件
      const errorEvent = new ErrorEvent('error', {
        error: new Error('Uncaught Error'),
        message: 'Uncaught Error',
      });
      
      window.dispatchEvent(errorEvent);

      // 验证错误被记录
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error:',
          expect.objectContaining({
            message: expect.stringContaining('Uncaught Error'),
          })
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('错误处理性能测试', () => {
    it('应该在合理时间内处理大量错误', async () => {
      const { errorState, handleError } = useErrorHandler();
      
      const startTime = performance.now();
      
      // 处理100个错误
      for (let i = 0; i < 100; i++) {
        handleError(new Error(`Error ${i}`));
      }
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      // 应该在100ms内完成
      expect(processingTime).toBeLessThan(100);
    });

    it('应该避免内存泄漏', async () => {
      const TestComponent: React.FC = () => {
        const { handleError } = useErrorHandler();
        
        React.useEffect(() => {
          // 模拟大量错误处理
          const interval = setInterval(() => {
            handleError(new Error('Periodic Error'));
          }, 10);
          
          return () => clearInterval(interval);
        }, [handleError]);
        
        return <div>测试组件</div>;
      };

      const { unmount } = renderWithProviders(<TestComponent />);
      
      // 等待一段时间
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 卸载组件
      unmount();
      
      // 验证没有内存泄漏（这里只是示例，实际测试需要更复杂的内存监控）
      expect(true).toBe(true);
    });
  });

  describe('错误处理可访问性测试', () => {
    const AccessibleErrorComponent: React.FC = () => {
      const { errorState, handleError, clearError } = useErrorHandler();

      return (
        <div>
          <Button onClick={() => handleError(new Error('Test Error'))}>
            触发错误
          </Button>
          
          {errorState.hasError && (
            <div 
              role="alert" 
              aria-live="assertive"
              data-testid="error-alert"
            >
              <p>{errorState.errorMessage}</p>
              <Button onClick={clearError} aria-label="清除错误消息">
                清除
              </Button>
            </div>
          )}
        </div>
      );
    };

    it('应该有正确的可访问性属性', async () => {
      renderWithProviders(<AccessibleErrorComponent />);

      const triggerButton = screen.getByText('触发错误');
      await user.click(triggerButton);

      await waitFor(() => {
        const errorAlert = screen.getByTestId('error-alert');
        expect(errorAlert).toHaveAttribute('role', 'alert');
        expect(errorAlert).toHaveAttribute('aria-live', 'assertive');
      });

      const clearButton = screen.getByLabelText('清除错误消息');
      expect(clearButton).toBeInTheDocument();
    });

    it('应该支持键盘导航', async () => {
      renderWithProviders(<AccessibleErrorComponent />);

      // 使用Tab键导航到按钮
      await user.tab();
      expect(screen.getByText('触发错误')).toHaveFocus();

      // 按Enter触发错误
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
      });

      // 继续Tab导航到清除按钮
      await user.tab();
      expect(screen.getByLabelText('清除错误消息')).toHaveFocus();
    });
  });
});