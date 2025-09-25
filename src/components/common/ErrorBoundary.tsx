'use client';

import React from 'react';
import { Result, Button, Alert, Typography } from 'antd';
import { APIError } from '@/lib/api-client';

const { Paragraph, Text } = Typography;

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * React错误边界组件
 * 捕获组件树中的JavaScript错误
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
    
    // 调用错误回调
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // 如果提供了自定义fallback组件，使用它
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      // 默认错误UI
      return (
        <Result
          status="500"
          title="页面出错了"
          subTitle="抱歉，页面发生了错误"
          extra={
            <Button type="primary" onClick={this.handleRetry}>
              重试
            </Button>
          }
        >
          {process.env.NODE_ENV === 'development' && (
            <div style={{ textAlign: 'left', marginTop: 16 }}>
              <Alert
                message="开发环境错误信息"
                description={
                  <div>
                    <Paragraph>
                      <Text strong>错误信息:</Text> {this.state.error.message}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>错误堆栈:</Text>
                      <pre style={{ fontSize: 12, overflow: 'auto' }}>
                        {this.state.error.stack}
                      </pre>
                    </Paragraph>
                  </div>
                }
                type="error"
                showIcon
              />
            </div>
          )}
        </Result>
      );
    }

    return this.props.children;
  }
}

/**
 * API错误显示组件
 */
interface ApiErrorDisplayProps {
  error: APIError | Error | null;
  onRetry?: () => void;
  showDetails?: boolean;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({
  error,
  onRetry,
  showDetails = false,
}) => {
  if (!error) return null;

  const isApiError = error instanceof APIError;
  
  // 根据错误类型显示不同的UI
  const getErrorStatus = () => {
    if (isApiError) {
      if (error.isAuthError) return '403';
      if (error.status === 404) return '404';
      if (error.isServerError) return '500';
      if (error.isNetworkError) return 'error';
    }
    return 'error';
  };

  const getErrorTitle = () => {
    if (isApiError) {
      if (error.isAuthError) return '权限不足';
      if (error.status === 404) return '资源不存在';
      if (error.isServerError) return '服务器错误';
      if (error.isNetworkError) return '网络错误';
    }
    return '请求失败';
  };

  const getErrorSubTitle = () => {
    if (isApiError) {
      return error.message || '请求处理失败，请稍后重试';
    }
    return error.message || '发生了未知错误';
  };

  return (
    <Result
      status={getErrorStatus() as any}
      title={getErrorTitle()}
      subTitle={getErrorSubTitle()}
      extra={
        onRetry && (
          <Button type="primary" onClick={onRetry}>
            重试
          </Button>
        )
      }
    >
      {showDetails && isApiError && (
        <div style={{ textAlign: 'left', marginTop: 16 }}>
          <Alert
            message="错误详情"
            description={
              <div>
                <Paragraph>
                  <Text strong>状态码:</Text> {error.status}
                </Paragraph>
                <Paragraph>
                  <Text strong>错误类型:</Text> {error.isNetworkError ? 'Network' : error.isServerError ? 'Server' : 'Client'}
                </Paragraph>
                {error.details && (
                  <Paragraph>
                    <Text strong>详细信息:</Text>
                    <pre style={{ fontSize: 12, overflow: 'auto' }}>
                      {JSON.stringify(error.details, null, 2)}
                    </pre>
                  </Paragraph>
                )}
              </div>
            }
            type="warning"
            showIcon
          />
        </div>
      )}
    </Result>
  );
};

/**
 * 数据加载错误组件
 */
interface DataErrorProps {
  error: any;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showRetryButton?: boolean;
}

export const DataError: React.FC<DataErrorProps> = ({
  error,
  onRetry,
  title = '数据加载失败',
  description,
  showRetryButton = true,
}) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const finalDescription = description || errorMessage || '请检查网络连接后重试';

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <Alert
        message={title}
        description={finalDescription}
        type="error"
        showIcon
        action={
          showRetryButton && onRetry && (
            <Button size="small" danger onClick={onRetry}>
              重试
            </Button>
          )
        }
      />
    </div>
  );
};

/**
 * 参数验证错误组件
 */
interface ParamErrorProps {
  errors: Record<string, string>;
  title?: string;
}

export const ParamError: React.FC<ParamErrorProps> = ({
  errors,
  title = '参数错误',
}) => {
  const errorList = Object.entries(errors).map(([key, message]) => (
    <li key={key}>
      <Text strong>{key}:</Text> {message}
    </li>
  ));

  return (
    <div style={{ padding: 24 }}>
      <Alert
        message={title}
        description={
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errorList}
          </ul>
        }
        type="warning"
        showIcon
      />
    </div>
  );
};

/**
 * 高阶组件：为组件添加错误边界
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}