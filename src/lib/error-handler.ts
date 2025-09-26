/**
 * 统一错误处理工具
 * 提供全局错误处理机制和用户友好的错误信息
 */

import { message, notification } from 'antd';
import { APIError } from './api-client';

// 错误类型枚举
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

// 错误级别枚举
export enum ErrorLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// 错误处理配置
export interface ErrorHandlerConfig {
  showNotification?: boolean;
  showMessage?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

// 错误信息映射
const ERROR_MESSAGES: Record<number, { title: string; message: string; level: ErrorLevel }> = {
  400: {
    title: '请求错误',
    message: '请求参数有误，请检查后重试',
    level: ErrorLevel.MEDIUM,
  },
  401: {
    title: '未授权',
    message: '登录已过期，请重新登录',
    level: ErrorLevel.HIGH,
  },
  403: {
    title: '权限不足',
    message: '您没有权限执行此操作',
    level: ErrorLevel.HIGH,
  },
  404: {
    title: '资源不存在',
    message: '请求的资源不存在或已被删除',
    level: ErrorLevel.MEDIUM,
  },
  408: {
    title: '请求超时',
    message: '请求超时，请检查网络连接后重试',
    level: ErrorLevel.MEDIUM,
  },
  409: {
    title: '数据冲突',
    message: '数据已被其他用户修改，请刷新后重试',
    level: ErrorLevel.MEDIUM,
  },
  422: {
    title: '数据验证失败',
    message: '提交的数据格式不正确，请检查后重试',
    level: ErrorLevel.MEDIUM,
  },
  429: {
    title: '请求过于频繁',
    message: '请求过于频繁，请稍后重试',
    level: ErrorLevel.MEDIUM,
  },
  500: {
    title: '服务器错误',
    message: '服务器内部错误，请稍后重试',
    level: ErrorLevel.HIGH,
  },
  502: {
    title: '网关错误',
    message: '服务暂时不可用，请稍后重试',
    level: ErrorLevel.HIGH,
  },
  503: {
    title: '服务不可用',
    message: '服务正在维护中，请稍后重试',
    level: ErrorLevel.HIGH,
  },
  504: {
    title: '网关超时',
    message: '服务响应超时，请稍后重试',
    level: ErrorLevel.HIGH,
  },
};

// 网络错误信息
const NETWORK_ERROR_MESSAGE = {
  title: '网络错误',
  message: '网络连接失败，请检查网络设置后重试',
  level: ErrorLevel.HIGH,
};

// 未知错误信息
const UNKNOWN_ERROR_MESSAGE = {
  title: '未知错误',
  message: '发生了未知错误，请稍后重试',
  level: ErrorLevel.MEDIUM,
};

/**
 * 错误处理器类
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private config: ErrorHandlerConfig;
  private errorReportService?: (error: any) => void;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      showNotification: true,
      showMessage: false,
      logToConsole: true,
      reportToService: false,
      autoRetry: false,
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  // 获取单例实例
  static getInstance(config?: ErrorHandlerConfig): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler(config);
    }
    return ErrorHandler.instance;
  }

  // 设置错误报告服务
  setErrorReportService(service: (error: any) => void): void {
    this.errorReportService = service;
  }

  // 更新配置
  updateConfig(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // 获取错误类型
  private getErrorType(error: any): ErrorType {
    if (error instanceof APIError) {
      if (error.isNetworkError) return ErrorType.NETWORK;
      if (error.isAuthError) return ErrorType.AUTH;
      if (error.isClientError) return ErrorType.CLIENT;
      if (error.isServerError) return ErrorType.SERVER;
    }
    
    if (error.name === 'ValidationError') return ErrorType.VALIDATION;
    if (error.name === 'NetworkError') return ErrorType.NETWORK;
    
    return ErrorType.UNKNOWN;
  }

  // 获取错误信息
  private getErrorInfo(error: any): { title: string; message: string; level: ErrorLevel } {
    if (error instanceof APIError) {
      // 网络错误
      if (error.isNetworkError) {
        return NETWORK_ERROR_MESSAGE;
      }
      
      // 根据状态码获取错误信息
      const errorInfo = ERROR_MESSAGES[error.status];
      if (errorInfo) {
        return errorInfo;
      }
    }
    
    // 自定义错误信息
    if (error.userMessage) {
      return {
        title: error.title || '操作失败',
        message: error.userMessage,
        level: error.level || ErrorLevel.MEDIUM,
      };
    }
    
    // 默认错误信息
    return UNKNOWN_ERROR_MESSAGE;
  }

  // 显示错误通知
  private showErrorNotification(errorInfo: { title: string; message: string; level: ErrorLevel }): void {
    if (!this.config.showNotification) return;

    const notificationConfig = {
      message: errorInfo.title,
      description: errorInfo.message,
      duration: errorInfo.level === ErrorLevel.CRITICAL ? 0 : 4.5,
    };

    switch (errorInfo.level) {
      case ErrorLevel.LOW:
        notification.info(notificationConfig);
        break;
      case ErrorLevel.MEDIUM:
        notification.warning(notificationConfig);
        break;
      case ErrorLevel.HIGH:
      case ErrorLevel.CRITICAL:
        notification.error(notificationConfig);
        break;
    }
  }

  // 显示错误消息
  private showErrorMessage(errorInfo: { title: string; message: string; level: ErrorLevel }): void {
    if (!this.config.showMessage) return;

    switch (errorInfo.level) {
      case ErrorLevel.LOW:
        message.info(errorInfo.message);
        break;
      case ErrorLevel.MEDIUM:
        message.warning(errorInfo.message);
        break;
      case ErrorLevel.HIGH:
      case ErrorLevel.CRITICAL:
        message.error(errorInfo.message);
        break;
    }
  }

  // 记录错误日志
  private logError(error: any, errorInfo: { title: string; message: string; level: ErrorLevel }): void {
    if (!this.config.logToConsole) return;

    const logData = {
      timestamp: new Date().toISOString(),
      type: this.getErrorType(error),
      level: errorInfo.level,
      title: errorInfo.title,
      message: errorInfo.message,
      originalError: error,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    switch (errorInfo.level) {
      case ErrorLevel.LOW:
        console.info('Error:', logData);
        break;
      case ErrorLevel.MEDIUM:
        console.warn('Error:', logData);
        break;
      case ErrorLevel.HIGH:
      case ErrorLevel.CRITICAL:
        console.error('Error:', logData);
        break;
    }
  }

  // 报告错误到服务
  private reportError(error: any, errorInfo: { title: string; message: string; level: ErrorLevel }): void {
    if (!this.config.reportToService || !this.errorReportService) return;

    try {
      const reportData = {
        timestamp: new Date().toISOString(),
        type: this.getErrorType(error),
        level: errorInfo.level,
        title: errorInfo.title,
        message: errorInfo.message,
        originalError: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        },
      };

      this.errorReportService(reportData);
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  // 主要错误处理方法
  handle(error: any, context?: string): void {
    const errorInfo = this.getErrorInfo(error);
    
    // 添加上下文信息
    if (context) {
      errorInfo.message = `${context}: ${errorInfo.message}`;
    }

    // 显示用户界面
    this.showErrorNotification(errorInfo);
    this.showErrorMessage(errorInfo);
    
    // 记录日志
    this.logError(error, errorInfo);
    
    // 报告错误
    this.reportError(error, errorInfo);
  }

  // 处理API错误
  handleApiError(error: APIError, context?: string): void {
    this.handle(error, context);
    
    // 特殊处理认证错误
    if (error.isAuthError) {
      this.handleAuthError(error);
    }
  }

  // 处理认证错误
  private handleAuthError(error: APIError): void {
    // 清除本地存储的认证信息
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    
    // 延迟跳转到登录页，给用户时间看到错误信息
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  // 处理表单验证错误
  handleValidationError(errors: Record<string, string>, context?: string): void {
    const errorMessage = Object.entries(errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join('; ');
    
    const validationError = {
      name: 'ValidationError',
      userMessage: errorMessage,
      title: '表单验证失败',
      level: ErrorLevel.MEDIUM,
    };
    
    this.handle(validationError, context);
  }

  // 处理网络错误
  handleNetworkError(context?: string): void {
    const networkError = {
      name: 'NetworkError',
      isNetworkError: true,
    };
    
    this.handle(networkError, context);
  }

  // 创建错误恢复建议
  getRecoveryActions(error: any): Array<{ label: string; action: () => void }> {
    const actions: Array<{ label: string; action: () => void }> = [];
    
    if (error instanceof APIError) {
      // 网络错误 - 建议重试
      if (error.isNetworkError) {
        actions.push({
          label: '重试',
          action: () => window.location.reload(),
        });
      }
      
      // 认证错误 - 建议重新登录
      if (error.isAuthError) {
        actions.push({
          label: '重新登录',
          action: () => window.location.href = '/login',
        });
      }
      
      // 404错误 - 建议返回首页
      if (error.status === 404) {
        actions.push({
          label: '返回首页',
          action: () => window.location.href = '/',
        });
      }
    }
    
    // 通用刷新操作
    actions.push({
      label: '刷新页面',
      action: () => window.location.reload(),
    });
    
    return actions;
  }
}

// 全局错误处理器实例
export const globalErrorHandler = ErrorHandler.getInstance();

// 便捷方法
export const handleError = (error: any, context?: string) => {
  globalErrorHandler.handle(error, context);
};

export const handleApiError = (error: APIError, context?: string) => {
  globalErrorHandler.handleApiError(error, context);
};

export const handleValidationError = (errors: Record<string, string>, context?: string) => {
  globalErrorHandler.handleValidationError(errors, context);
};

export const handleNetworkError = (context?: string) => {
  globalErrorHandler.handleNetworkError(context);
};

// 全局未捕获错误处理
if (typeof window !== 'undefined') {
  // 处理未捕获的JavaScript错误
  window.addEventListener('error', (event) => {
    globalErrorHandler.handle(event.error, 'Uncaught Error');
  });
  
  // 处理未捕获的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    globalErrorHandler.handle(event.reason, 'Unhandled Promise Rejection');
    event.preventDefault(); // 阻止默认的控制台错误输出
  });
}