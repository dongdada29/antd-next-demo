/**
 * API测试工具函数
 * 提供API服务测试的辅助函数和模拟工具
 */

import { vi } from 'vitest';
import { APIClient, APIError, APIResponse } from '@/lib/api-client';

// 模拟响应类型
export interface MockResponse<T = any> {
  data: T;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  delay?: number;
}

// 模拟错误类型
export interface MockError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  delay?: number;
}

// 网络状态模拟
export interface NetworkCondition {
  online: boolean;
  latency?: number;
  bandwidth?: 'slow' | 'fast' | 'offline';
}

/**
 * API模拟工具类
 */
export class APIMocker {
  private static instance: APIMocker;
  private mockResponses: Map<string, MockResponse | MockError> = new Map();
  private requestHistory: Array<{
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
    timestamp: number;
  }> = [];

  static getInstance(): APIMocker {
    if (!APIMocker.instance) {
      APIMocker.instance = new APIMocker();
    }
    return APIMocker.instance;
  }

  // 重置所有模拟
  reset(): void {
    this.mockResponses.clear();
    this.requestHistory = [];
    vi.mocked(fetch).mockClear();
  }

  // 模拟成功响应
  mockSuccess<T>(url: string, response: MockResponse<T>): void {
    this.mockResponses.set(url, response);
    this.setupFetchMock();
  }

  // 模拟错误响应
  mockError(url: string, error: MockError): void {
    this.mockResponses.set(url, error);
    this.setupFetchMock();
  }

  // 模拟网络条件
  mockNetworkCondition(condition: NetworkCondition): void {
    // 模拟离线状态
    if (!condition.online) {
      vi.mocked(fetch).mockRejectedValue(new Error('Network Error'));
      return;
    }

    // 模拟延迟和带宽
    const delay = condition.latency || (condition.bandwidth === 'slow' ? 2000 : 100);
    this.setupFetchMock(delay);
  }

  // 获取请求历史
  getRequestHistory(): typeof this.requestHistory {
    return [...this.requestHistory];
  }

  // 获取最后一次请求
  getLastRequest(): typeof this.requestHistory[0] | undefined {
    return this.requestHistory[this.requestHistory.length - 1];
  }

  // 检查是否发送了特定请求
  hasRequest(url: string, method?: string): boolean {
    return this.requestHistory.some(req => 
      req.url.includes(url) && (!method || req.method === method)
    );
  }

  // 获取特定URL的请求次数
  getRequestCount(url: string): number {
    return this.requestHistory.filter(req => req.url.includes(url)).length;
  }

  // 设置fetch模拟
  private setupFetchMock(globalDelay = 0): void {
    vi.mocked(fetch).mockImplementation(async (url: string, options?: RequestInit) => {
      // 记录请求历史
      this.requestHistory.push({
        url: url.toString(),
        method: options?.method || 'GET',
        headers: options?.headers as Record<string, string>,
        body: options?.body,
        timestamp: Date.now(),
      });

      // 查找匹配的模拟响应
      const mockResponse = this.findMockResponse(url.toString());
      
      if (!mockResponse) {
        throw new Error(`No mock response found for ${url}`);
      }

      // 应用延迟
      const delay = (mockResponse as any).delay || globalDelay;
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // 返回错误响应
      if ('message' in mockResponse) {
        const error = new Error(mockResponse.message);
        (error as any).status = mockResponse.status || 500;
        (error as any).code = mockResponse.code;
        (error as any).details = mockResponse.details;
        throw error;
      }

      // 返回成功响应
      const response = mockResponse as MockResponse;
      return {
        ok: (response.status || 200) < 400,
        status: response.status || 200,
        statusText: response.statusText || 'OK',
        headers: new Headers(response.headers || {}),
        json: () => Promise.resolve(response.data),
        text: () => Promise.resolve(JSON.stringify(response.data)),
        blob: () => Promise.resolve(new Blob([JSON.stringify(response.data)])),
      } as Response;
    });
  }

  // 查找匹配的模拟响应
  private findMockResponse(url: string): MockResponse | MockError | undefined {
    // 精确匹配
    if (this.mockResponses.has(url)) {
      return this.mockResponses.get(url);
    }

    // 模式匹配
    for (const [pattern, response] of this.mockResponses.entries()) {
      if (url.includes(pattern) || new RegExp(pattern).test(url)) {
        return response;
      }
    }

    return undefined;
  }
}

// 全局API模拟器实例
export const apiMocker = APIMocker.getInstance();

// 便捷函数
export const mockApiSuccess = <T>(url: string, data: T, options: Partial<MockResponse<T>> = {}) => {
  apiMocker.mockSuccess(url, { data, ...options });
};

export const mockApiError = (url: string, message: string, options: Partial<MockError> = {}) => {
  apiMocker.mockError(url, { message, ...options });
};

export const mockNetworkOffline = () => {
  apiMocker.mockNetworkCondition({ online: false });
};

export const mockSlowNetwork = (latency = 2000) => {
  apiMocker.mockNetworkCondition({ online: true, latency });
};

export const resetApiMocks = () => {
  apiMocker.reset();
};

/**
 * API客户端测试工具
 */
export class APIClientTester {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // 测试GET请求
  async testGet<T>(url: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    return this.client.get<T>(url, params);
  }

  // 测试POST请求
  async testPost<T>(url: string, data?: any): Promise<APIResponse<T>> {
    return this.client.post<T>(url, data);
  }

  // 测试PUT请求
  async testPut<T>(url: string, data?: any): Promise<APIResponse<T>> {
    return this.client.put<T>(url, data);
  }

  // 测试DELETE请求
  async testDelete<T>(url: string): Promise<APIResponse<T>> {
    return this.client.delete<T>(url);
  }

  // 测试错误处理
  async testErrorHandling(url: string, expectedError: Partial<APIError>): Promise<void> {
    try {
      await this.client.get(url);
      throw new Error('Expected API call to throw an error');
    } catch (error) {
      if (error instanceof APIError) {
        if (expectedError.status !== undefined) {
          expect(error.status).toBe(expectedError.status);
        }
        if (expectedError.message !== undefined) {
          expect(error.message).toContain(expectedError.message);
        }
        if (expectedError.code !== undefined) {
          expect(error.code).toBe(expectedError.code);
        }
      } else {
        throw error;
      }
    }
  }

  // 测试重试机制
  async testRetry(url: string, maxRetries: number): Promise<void> {
    // 模拟前几次失败，最后一次成功
    let callCount = 0;
    vi.mocked(fetch).mockImplementation(async () => {
      callCount++;
      if (callCount <= maxRetries) {
        throw new Error('Network Error');
      }
      return {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      } as Response;
    });

    await this.client.get(url);
    expect(callCount).toBe(maxRetries + 1);
  }

  // 测试超时
  async testTimeout(url: string, timeout: number): Promise<void> {
    // 模拟长时间响应
    vi.mocked(fetch).mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, timeout + 100));
      return {
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response;
    });

    await expect(this.client.get(url)).rejects.toThrow();
  }
}

/**
 * 批量API测试工具
 */
export class BatchAPITester {
  private tests: Array<{
    name: string;
    test: () => Promise<void>;
  }> = [];

  // 添加测试用例
  addTest(name: string, test: () => Promise<void>): void {
    this.tests.push({ name, test });
  }

  // 运行所有测试
  async runAll(): Promise<void> {
    for (const { name, test } of this.tests) {
      try {
        await test();
        console.log(`✓ ${name}`);
      } catch (error) {
        console.error(`✗ ${name}:`, error);
        throw error;
      }
    }
  }

  // 并行运行测试
  async runParallel(): Promise<void> {
    const results = await Promise.allSettled(
      this.tests.map(async ({ name, test }) => {
        try {
          await test();
          return { name, success: true };
        } catch (error) {
          return { name, success: false, error };
        }
      })
    );

    const failures = results
      .filter((result): result is PromiseFulfilledResult<{ name: string; success: false; error: any }> => 
        result.status === 'fulfilled' && !result.value.success
      )
      .map(result => result.value);

    if (failures.length > 0) {
      console.error('Failed tests:', failures);
      throw new Error(`${failures.length} tests failed`);
    }
  }
}

/**
 * API性能测试工具
 */
export class APIPerformanceTester {
  // 测试响应时间
  async testResponseTime(apiCall: () => Promise<any>, maxTime: number): Promise<number> {
    const startTime = performance.now();
    await apiCall();
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    expect(responseTime).toBeLessThan(maxTime);
    return responseTime;
  }

  // 测试并发请求
  async testConcurrency(apiCall: () => Promise<any>, concurrency: number): Promise<number[]> {
    const promises = Array.from({ length: concurrency }, () => {
      const startTime = performance.now();
      return apiCall().then(() => performance.now() - startTime);
    });

    return Promise.all(promises);
  }

  // 测试内存使用
  async testMemoryUsage(apiCall: () => Promise<any>): Promise<{
    before: number;
    after: number;
    diff: number;
  }> {
    // 强制垃圾回收（如果可用）
    if (global.gc) {
      global.gc();
    }

    const before = process.memoryUsage().heapUsed;
    await apiCall();
    const after = process.memoryUsage().heapUsed;

    return {
      before,
      after,
      diff: after - before,
    };
  }
}

/**
 * API契约测试工具
 */
export class APIContractTester {
  // 验证响应结构
  validateResponseSchema<T>(response: T, schema: any): void {
    // 简单的结构验证
    const validateObject = (obj: any, schemaObj: any, path = ''): void => {
      for (const [key, expectedType] of Object.entries(schemaObj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (!(key in obj)) {
          throw new Error(`Missing property: ${currentPath}`);
        }

        const actualType = typeof obj[key];
        if (actualType !== expectedType) {
          throw new Error(`Type mismatch at ${currentPath}: expected ${expectedType}, got ${actualType}`);
        }
      }
    };

    validateObject(response, schema);
  }

  // 验证API端点存在
  async validateEndpoint(url: string, method: string): Promise<void> {
    try {
      const response = await fetch(url, { method });
      expect(response.status).not.toBe(404);
    } catch (error) {
      throw new Error(`Endpoint ${method} ${url} is not accessible`);
    }
  }

  // 验证错误响应格式
  async validateErrorResponse(url: string, expectedStatus: number): Promise<void> {
    try {
      const response = await fetch(url);
      expect(response.status).toBe(expectedStatus);
      
      const errorData = await response.json();
      expect(errorData).toHaveProperty('message');
    } catch (error) {
      if (error instanceof Error && error.message.includes('expect')) {
        throw error;
      }
      // 网络错误等其他错误
      throw new Error(`Failed to validate error response: ${error}`);
    }
  }
}

// 导出测试工具实例
export const createAPIClientTester = (client: APIClient) => new APIClientTester(client);
export const createBatchTester = () => new BatchAPITester();
export const createPerformanceTester = () => new APIPerformanceTester();
export const createContractTester = () => new APIContractTester();