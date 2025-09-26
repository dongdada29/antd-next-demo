/**
 * 错误处理器测试
 * 测试ErrorHandler类的核心功能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ErrorHandler, ErrorType, ErrorLevel, globalErrorHandler } from '../error-handler';
import { APIError } from '../api-client';

// 模拟Ant Design组件
vi.mock('antd', () => ({
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
}));

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorHandler = new ErrorHandler({
      showNotification: true,
      showMessage: false,
      logToConsole: true,
      reportToService: false,
    });

    // 模拟console方法
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});

    // 清除localStorage
    localStorage.clear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    vi.clearAllMocks();
  });

  describe('基础错误处理测试', () => {
    it('应该正确处理普通错误', () => {
      const error = new Error('Test error');
      
      errorHandler.handle(error);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          type: ErrorType.UNKNOWN,
          level: ErrorLevel.MEDIUM,
          message: 'Test error',
        })
      );
    });

    it('应该正确处理API错误', () => {
      const apiError = new APIError(
        'API Error',
        404,
        'Not Found',
        { method: 'GET', url: '/api/users' }
      );
      
      errorHandler.handleApiError(apiError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          type: ErrorType.CLIENT,
          level: ErrorLevel.MEDIUM,
          title: '资源不存在',
          message: '请求的资源不存在或已被删除',
        })
      );
    });

    it('应该正确处理网络错误', () => {
      const networkError = new APIError(
        'Network Error',
        0,
        'Network Error',
        { method: 'GET', url: '/api/users' }
      );
      
      errorHandler.handleApiError(networkError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          type: ErrorType.NETWORK,
          level: ErrorLevel.HIGH,
          title: '网络错误',
          message: '网络连接失败，请检查网络设置后重试',
        })
      );
    });

    it('应该正确处理认证错误', () => {
      const authError = new APIError(
        'Unauthorized',
        401,
        'Unauthorized',
        { method: 'GET', url: '/api/users' }
      );
      
      errorHandler.handleApiError(authError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          type: ErrorType.AUTH,
          level: ErrorLevel.HIGH,
          title: '未授权',
          message: '登录已过期，请重新登录',
        })
      );
    });
  });

  describe('错误级别测试', () => {
    it('应该根据错误类型设置正确的级别', () => {
      // 低级别错误
      const lowError = new APIError('Not Found', 404, 'Not Found', { method: 'GET', url: '/test' });
      errorHandler.handleApiError(lowError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({ level: ErrorLevel.MEDIUM })
      );

      // 高级别错误
      const highError = new APIError('Server Error', 500, 'Internal Server Error', { method: 'GET', url: '/test' });
      errorHandler.handleApiError(highError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({ level: ErrorLevel.HIGH })
      );
    });
  });

  describe('错误消息映射测试', () => {
    const testCases = [
      { status: 400, expectedTitle: '请求错误', expectedMessage: '请求参数有误，请检查后重试' },
      { status: 401, expectedTitle: '未授权', expectedMessage: '登录已过期，请重新登录' },
      { status: 403, expectedTitle: '权限不足', expectedMessage: '您没有权限执行此操作' },
      { status: 404, expectedTitle: '资源不存在', expectedMessage: '请求的资源不存在或已被删除' },
      { status: 500, expectedTitle: '服务器错误', expectedMessage: '服务器内部错误，请稍后重试' },
    ];

    testCases.forEach(({ status, expectedTitle, expectedMessage }) => {
      it(`应该正确映射${status}错误`, () => {
        const error = new APIError(
          'Error',
          status,
          'Error',
          { method: 'GET', url: '/test' }
        );
        
        errorHandler.handleApiError(error);
        
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error:',
          expect.objectContaining({
            title: expectedTitle,
            message: expectedMessage,
          })
        );
      });
    });
  });

  describe('认证错误处理测试', () => {
    it('应该清除认证信息', () => {
      // 设置认证信息
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('refresh_token', 'refresh-token');
      localStorage.setItem('user_info', JSON.stringify({ id: 1 }));
      
      const authError = new APIError(
        'Unauthorized',
        401,
        'Unauthorized',
        { method: 'GET', url: '/api/users' }
      );
      
      errorHandler.handleApiError(authError);
      
      // 验证认证信息被清除
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('user_info')).toBeNull();
    });

    it('应该延迟跳转到登录页', (done) => {
      // 模拟window.location
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      const authError = new APIError(
        'Unauthorized',
        401,
        'Unauthorized',
        { method: 'GET', url: '/api/users' }
      );
      
      errorHandler.handleApiError(authError);
      
      // 验证延迟跳转
      setTimeout(() => {
        expect(mockLocation.href).toBe('/login');
        done();
      }, 2100); // 稍微超过2秒
    });
  });

  describe('表单验证错误测试', () => {
    it('应该正确处理表单验证错误', () => {
      const validationErrors = {
        name: '姓名不能为空',
        email: '邮箱格式不正确',
      };
      
      errorHandler.handleValidationError(validationErrors);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          type: ErrorType.VALIDATION,
          level: ErrorLevel.MEDIUM,
          title: '表单验证失败',
          message: 'name: 姓名不能为空; email: 邮箱格式不正确',
        })
      );
    });
  });

  describe('错误恢复建议测试', () => {
    it('应该为网络错误提供重试建议', () => {
      const networkError = new APIError(
        'Network Error',
        0,
        'Network Error',
        { method: 'GET', url: '/api/users' }
      );
      
      const actions = errorHandler.getRecoveryActions(networkError);
      
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ label: '重试' }),
          expect.objectContaining({ label: '刷新页面' }),
        ])
      );
    });

    it('应该为认证错误提供登录建议', () => {
      const authError = new APIError(
        'Unauthorized',
        401,
        'Unauthorized',
        { method: 'GET', url: '/api/users' }
      );
      
      const actions = errorHandler.getRecoveryActions(authError);
      
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ label: '重新登录' }),
          expect.objectContaining({ label: '刷新页面' }),
        ])
      );
    });

    it('应该为404错误提供返回首页建议', () => {
      const notFoundError = new APIError(
        'Not Found',
        404,
        'Not Found',
        { method: 'GET', url: '/api/users' }
      );
      
      const actions = errorHandler.getRecoveryActions(notFoundError);
      
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ label: '返回首页' }),
          expect.objectContaining({ label: '刷新页面' }),
        ])
      );
    });
  });

  describe('配置测试', () => {
    it('应该支持禁用通知', () => {
      const { notification } = require('antd');
      
      const noNotificationHandler = new ErrorHandler({
        showNotification: false,
      });
      
      const error = new Error('Test error');
      noNotificationHandler.handle(error);
      
      expect(notification.error).not.toHaveBeenCalled();
    });

    it('应该支持启用消息', () => {
      const { message } = require('antd');
      
      const messageHandler = new ErrorHandler({
        showMessage: true,
        showNotification: false,
      });
      
      const error = new Error('Test error');
      messageHandler.handle(error);
      
      expect(message.error).toHaveBeenCalled();
    });

    it('应该支持禁用控制台日志', () => {
      const noLogHandler = new ErrorHandler({
        logToConsole: false,
      });
      
      const error = new Error('Test error');
      noLogHandler.handle(error);
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('错误报告测试', () => {
    it('应该调用错误报告服务', () => {
      const mockReportService = vi.fn();
      
      const reportHandler = new ErrorHandler({
        reportToService: true,
      });
      reportHandler.setErrorReportService(mockReportService);
      
      const error = new Error('Test error');
      reportHandler.handle(error);
      
      expect(mockReportService).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ErrorType.UNKNOWN,
          level: ErrorLevel.MEDIUM,
          originalError: expect.objectContaining({
            name: 'Error',
            message: 'Test error',
          }),
        })
      );
    });

    it('应该处理报告服务错误', () => {
      const mockReportService = vi.fn().mockImplementation(() => {
        throw new Error('Report service error');
      });
      
      const reportHandler = new ErrorHandler({
        reportToService: true,
      });
      reportHandler.setErrorReportService(mockReportService);
      
      const error = new Error('Test error');
      
      // 不应该抛出错误
      expect(() => reportHandler.handle(error)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to report error:',
        expect.any(Error)
      );
    });
  });

  describe('全局错误处理器测试', () => {
    it('应该提供全局实例', () => {
      expect(globalErrorHandler).toBeInstanceOf(ErrorHandler);
    });

    it('应该处理全局未捕获错误', () => {
      const error = new Error('Uncaught error');
      const errorEvent = new ErrorEvent('error', { error });
      
      // 触发全局错误事件
      window.dispatchEvent(errorEvent);
      
      // 验证错误被处理
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          message: expect.stringContaining('Uncaught error'),
        })
      );
    });

    it('应该处理未处理的Promise拒绝', () => {
      const error = new Error('Unhandled rejection');
      const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.reject(error),
        reason: error,
      });
      
      // 触发未处理的Promise拒绝事件
      window.dispatchEvent(rejectionEvent);
      
      // 验证错误被处理
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          message: expect.stringContaining('Unhandled rejection'),
        })
      );
    });
  });

  describe('上下文信息测试', () => {
    it('应该包含上下文信息', () => {
      const error = new Error('Test error');
      const context = 'User Profile Page';
      
      errorHandler.handle(error, context);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          message: `${context}: 发生了未知错误，请稍后重试`,
        })
      );
    });

    it('应该记录环境信息', () => {
      const error = new Error('Test error');
      
      errorHandler.handle(error);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          url: expect.any(String),
          userAgent: expect.any(String),
          timestamp: expect.any(String),
        })
      );
    });
  });
});