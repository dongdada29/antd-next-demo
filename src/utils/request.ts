// HTTP 请求工具类
import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS } from '@/lib/constants';

// 请求配置接口
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// 响应接口
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

// API 错误类
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 请求工具类
class RequestUtil {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultTimeout = API_TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // 构建完整URL
  private buildUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  // 构建请求头
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    
    // 添加认证头
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // 合并自定义头
    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }
    
    return headers;
  }

  // 处理请求体
  private processBody(body: any, headers: Record<string, string>): string | FormData | undefined {
    if (!body) return undefined;
    
    if (body instanceof FormData) {
      // FormData 不需要设置 Content-Type
      delete headers['Content-Type'];
      return body;
    }
    
    if (headers['Content-Type']?.includes('application/json')) {
      return JSON.stringify(body);
    }
    
    return body;
  }

  // 处理响应
  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: T;
    
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = (await response.text()) as unknown as T;
    }
    
    if (!response.ok) {
      throw new ApiError(
        response.status,
        `HTTP ${response.status}: ${response.statusText}`,
        data
      );
    }
    
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  // 通用请求方法
  async request<T = any>(path: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers: customHeaders,
      body,
      timeout = this.defaultTimeout,
    } = config;

    const url = this.buildUrl(path);
    const headers = this.buildHeaders(customHeaders);
    const processedBody = this.processBody(body, headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: processedBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.processResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, '请求超时');
        }
        throw new ApiError(0, error.message);
      }
      
      throw new ApiError(0, '网络错误');
    }
  }

  // GET 请求
  async get<T = any>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = path;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }
    
    return this.request<T>(url, { method: 'GET' });
  }

  // POST 请求
  async post<T = any>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'POST', body });
  }

  // PUT 请求
  async put<T = any>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'PUT', body });
  }

  // DELETE 请求
  async delete<T = any>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  // PATCH 请求
  async patch<T = any>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  // 设置基础URL
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  // 设置默认头
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  // 移除默认头
  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}

// 导出单例实例
export const request = new RequestUtil();

// 导出类型和工具
export { RequestUtil };
// 类型已在上面定义，无需重复导出