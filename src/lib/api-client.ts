/**
 * API客户端基础架构
 * 提供统一的请求/响应处理机制，支持认证、重试、错误处理等功能
 */

import type { AuthConfig, APIEndpoint } from '@/types/api-documentation';

// API响应接口
export interface APIResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: RequestConfig;
}

// 请求配置接口
export interface RequestConfig {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// API错误类
export class APIError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly response?: Response;
  public readonly config: RequestConfig;
  public readonly code?: string;
  public readonly details?: any;

  constructor(
    message: string,
    status: number,
    statusText: string,
    config: RequestConfig,
    response?: Response,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.config = config;
    this.code = code;
    this.details = details;
  }

  // 判断是否为网络错误
  get isNetworkError(): boolean {
    return this.status === 0 || this.status >= 500;
  }

  // 判断是否为客户端错误
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  // 判断是否为服务器错误
  get isServerError(): boolean {
    return this.status >= 500;
  }

  // 判断是否为认证错误
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  // 判断是否可重试
  get isRetryable(): boolean {
    return this.isNetworkError || this.status === 429 || this.status >= 500;
  }
}

// 请求拦截器类型
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

// 响应拦截器类型
export type ResponseInterceptor = <T>(response: APIResponse<T>) => APIResponse<T> | Promise<APIResponse<T>>;

// 错误拦截器类型
export type ErrorInterceptor = (error: APIError) => APIError | Promise<APIError>;

// API客户端配置
export interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  auth?: AuthConfig;
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
    error?: ErrorInterceptor[];
  };
}

// API客户端基类
export class APIClient {
  private config: APIClientConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: APIClientConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    };

    // 注册拦截器
    if (config.interceptors?.request) {
      this.requestInterceptors.push(...config.interceptors.request);
    }
    if (config.interceptors?.response) {
      this.responseInterceptors.push(...config.interceptors.response);
    }
    if (config.interceptors?.error) {
      this.errorInterceptors.push(...config.interceptors.error);
    }
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // 添加错误拦截器
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  // 构建完整URL
  private buildURL(path: string, params?: Record<string, any>): string {
    const url = new URL(path, this.config.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  // 构建请求头
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...customHeaders,
    };

    // 添加认证头
    if (this.config.auth) {
      const authHeader = this.buildAuthHeader(this.config.auth);
      if (authHeader) {
        Object.assign(headers, authHeader);
      }
    }

    return headers;
  }

  // 构建认证头
  private buildAuthHeader(auth: AuthConfig): Record<string, string> | null {
    switch (auth.type) {
      case 'bearer':
        return {
          Authorization: `${auth.tokenPrefix || 'Bearer'} ${this.getAuthToken()}`,
        };
      case 'apiKey':
        return {
          [auth.headerName || 'X-API-Key']: this.getAuthToken(),
        };
      case 'basic':
        const credentials = this.getBasicCredentials();
        if (credentials) {
          return {
            Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
          };
        }
        break;
      default:
        return null;
    }
    return null;
  }

  // 获取认证令牌（需要子类实现或通过配置提供）
  protected getAuthToken(): string {
    // 默认从localStorage获取，可以被子类重写
    return localStorage.getItem('auth_token') || '';
  }

  // 获取基础认证凭据（需要子类实现）
  protected getBasicCredentials(): { username: string; password: string } | null {
    return null;
  }

  // 应用请求拦截器
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  // 应用响应拦截器
  private async applyResponseInterceptors<T>(response: APIResponse<T>): Promise<APIResponse<T>> {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    
    return processedResponse;
  }

  // 应用错误拦截器
  private async applyErrorInterceptors(error: APIError): Promise<APIError> {
    let processedError = error;
    
    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError);
    }
    
    return processedError;
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 核心请求方法
  private async executeRequest<T>(config: RequestConfig): Promise<APIResponse<T>> {
    // 应用请求拦截器
    const processedConfig = await this.applyRequestInterceptors(config);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), processedConfig.timeout || this.config.timeout);

    try {
      const response = await fetch(processedConfig.url, {
        method: processedConfig.method,
        headers: processedConfig.headers,
        body: processedConfig.data ? JSON.stringify(processedConfig.data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 检查响应状态
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new APIError(
          errorData.message || response.statusText,
          response.status,
          response.statusText,
          processedConfig,
          response,
          errorData.code,
          errorData.details
        );
      }

      // 解析响应数据
      const data = await this.parseResponse<T>(response);
      
      const apiResponse: APIResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: processedConfig,
      };

      // 应用响应拦截器
      return await this.applyResponseInterceptors(apiResponse);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof APIError) {
        throw await this.applyErrorInterceptors(error);
      }
      
      // 处理网络错误或其他错误
      const apiError = new APIError(
        error instanceof Error ? error.message : 'Network Error',
        0,
        'Network Error',
        processedConfig
      );
      
      throw await this.applyErrorInterceptors(apiError);
    }
  }

  // 解析响应数据
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else if (contentType?.includes('text/')) {
      return await response.text() as unknown as T;
    } else {
      return await response.blob() as unknown as T;
    }
  }

  // 解析错误响应
  private async parseErrorResponse(response: Response): Promise<{
    message: string;
    code?: string;
    details?: any;
  }> {
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        return {
          message: errorData.message || errorData.error || response.statusText,
          code: errorData.code || errorData.error_code,
          details: errorData.details || errorData,
        };
      } else {
        const text = await response.text();
        return {
          message: text || response.statusText,
        };
      }
    } catch {
      return {
        message: response.statusText,
      };
    }
  }

  // 带重试的请求方法
  private async requestWithRetry<T>(config: RequestConfig): Promise<APIResponse<T>> {
    const maxRetries = config.retries ?? this.config.retries ?? 3;
    const retryDelay = config.retryDelay ?? this.config.retryDelay ?? 1000;
    
    let lastError: APIError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeRequest<T>(config);
      } catch (error) {
        lastError = error as APIError;
        
        // 如果不是最后一次尝试且错误可重试
        if (attempt < maxRetries && lastError.isRetryable) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // 指数退避
          continue;
        }
        
        throw lastError;
      }
    }
    
    throw lastError!;
  }

  // 通用请求方法
  async request<T = any>(config: RequestConfig): Promise<APIResponse<T>> {
    const requestConfig: RequestConfig = {
      ...config,
      url: this.buildURL(config.url, config.params),
      headers: this.buildHeaders(config.headers),
    };

    return this.requestWithRetry<T>(requestConfig);
  }

  // GET请求
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config,
    });
  }

  // POST请求
  async post<T = any>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  // PUT请求
  async put<T = any>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  // PATCH请求
  async patch<T = any>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  // DELETE请求
  async delete<T = any>(
    url: string,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }

  // 更新配置
  updateConfig(config: Partial<APIClientConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // 获取当前配置
  getConfig(): APIClientConfig {
    return { ...this.config };
  }
}

// 默认错误处理器
export const defaultErrorHandler = (error: APIError): APIError => {
  // 可以在这里添加全局错误处理逻辑
  console.error('API Error:', {
    message: error.message,
    status: error.status,
    url: error.config.url,
    method: error.config.method,
  });
  
  return error;
};

// 默认请求拦截器 - 添加请求ID用于追踪
export const requestIdInterceptor: RequestInterceptor = (config) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-Request-ID': requestId,
    },
  };
};

// 默认响应拦截器 - 记录响应时间
export const responseTimeInterceptor: ResponseInterceptor = (response) => {
  const requestId = response.config.headers?.['X-Request-ID'];
  if (requestId) {
    console.log(`Request ${requestId} completed in ${Date.now() - parseInt(requestId.split('_')[1])}ms`);
  }
  
  return response;
};