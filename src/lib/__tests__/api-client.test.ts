/**
 * API客户端测试
 * 测试APIClient类的核心功能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { APIClient, APIError } from '../api-client';
import { 
  apiMocker, 
  mockApiSuccess, 
  mockApiError, 
  mockNetworkOffline,
  resetApiMocks,
  createAPIClientTester
} from '../../test/api-test-utils';

describe('APIClient', () => {
  let apiClient: APIClient;
  let apiTester: ReturnType<typeof createAPIClientTester>;

  beforeEach(() => {
    apiClient = new APIClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
      retryDelay: 100,
    });

    apiTester = createAPIClientTester(apiClient);
    resetApiMocks();
  });

  afterEach(() => {
    resetApiMocks();
  });

  describe('基础配置测试', () => {
    it('应该正确初始化配置', () => {
      const config = apiClient.getConfig();
      
      expect(config.baseURL).toBe('https://api.example.com');
      expect(config.timeout).toBe(5000);
      expect(config.retries).toBe(3);
      expect(config.retryDelay).toBe(100);
    });

    it('应该支持更新配置', () => {
      apiClient.updateConfig({
        timeout: 10000,
        retries: 5,
      });

      const config = apiClient.getConfig();
      expect(config.timeout).toBe(10000);
      expect(config.retries).toBe(5);
      expect(config.baseURL).toBe('https://api.example.com'); // 保持不变
    });
  });

  describe('HTTP方法测试', () => {
    const mockData = { id: 1, name: 'Test User' };

    it('应该发送GET请求', async () => {
      mockApiSuccess('/users', mockData);

      const response = await apiClient.get('/users');

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
      expect(apiMocker.hasRequest('/users', 'GET')).toBe(true);
    });

    it('应该发送POST请求', async () => {
      const postData = { name: 'New User', email: 'test@example.com' };
      mockApiSuccess('/users', mockData);

      const response = await apiClient.post('/users', postData);

      expect(response.data).toEqual(mockData);
      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.method).toBe('POST');
      expect(lastRequest?.body).toEqual(JSON.stringify(postData));
    });

    it('应该发送PUT请求', async () => {
      const putData = { name: 'Updated User' };
      mockApiSuccess('/users/1', { ...mockData, ...putData });

      const response = await apiClient.put('/users/1', putData);

      expect(response.data.name).toBe('Updated User');
      expect(apiMocker.hasRequest('/users/1', 'PUT')).toBe(true);
    });

    it('应该发送PATCH请求', async () => {
      const patchData = { name: 'Patched User' };
      mockApiSuccess('/users/1', { ...mockData, ...patchData });

      const response = await apiClient.patch('/users/1', patchData);

      expect(response.data.name).toBe('Patched User');
      expect(apiMocker.hasRequest('/users/1', 'PATCH')).toBe(true);
    });

    it('应该发送DELETE请求', async () => {
      mockApiSuccess('/users/1', { success: true });

      const response = await apiClient.delete('/users/1');

      expect(response.data).toEqual({ success: true });
      expect(apiMocker.hasRequest('/users/1', 'DELETE')).toBe(true);
    });
  });

  describe('URL构建测试', () => {
    it('应该正确构建基础URL', async () => {
      mockApiSuccess('/users', {});

      await apiClient.get('/users');

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.url).toBe('https://api.example.com/users');
    });

    it('应该正确处理查询参数', async () => {
      mockApiSuccess('/users', {});

      await apiClient.get('/users', { page: 1, limit: 10 });

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.url).toContain('page=1');
      expect(lastRequest?.url).toContain('limit=10');
    });

    it('应该过滤空值参数', async () => {
      mockApiSuccess('/users', {});

      await apiClient.get('/users', { 
        page: 1, 
        search: '', 
        filter: null, 
        active: undefined 
      });

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.url).toContain('page=1');
      expect(lastRequest?.url).not.toContain('search=');
      expect(lastRequest?.url).not.toContain('filter=');
      expect(lastRequest?.url).not.toContain('active=');
    });
  });

  describe('请求头测试', () => {
    it('应该设置默认请求头', async () => {
      mockApiSuccess('/users', {});

      await apiClient.get('/users');

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['Content-Type']).toBe('application/json');
    });

    it('应该支持自定义请求头', async () => {
      mockApiSuccess('/users', {});

      await apiClient.get('/users', {}, { 
        headers: { 'X-Custom-Header': 'custom-value' } 
      });

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['X-Custom-Header']).toBe('custom-value');
    });

    it('应该合并请求头', async () => {
      const clientWithHeaders = new APIClient({
        baseURL: 'https://api.example.com',
        headers: { 'X-Global-Header': 'global-value' },
      });

      mockApiSuccess('/users', {});

      await clientWithHeaders.get('/users', {}, { 
        headers: { 'X-Request-Header': 'request-value' } 
      });

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['X-Global-Header']).toBe('global-value');
      expect(lastRequest?.headers?.['X-Request-Header']).toBe('request-value');
    });
  });

  describe('认证测试', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'test-token-123');
    });

    afterEach(() => {
      localStorage.removeItem('auth_token');
    });

    it('应该支持Bearer认证', async () => {
      const authClient = new APIClient({
        baseURL: 'https://api.example.com',
        auth: {
          type: 'bearer',
          tokenPrefix: 'Bearer',
        },
      });

      mockApiSuccess('/users', {});

      await authClient.get('/users');

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['Authorization']).toBe('Bearer test-token-123');
    });

    it('应该支持API Key认证', async () => {
      const authClient = new APIClient({
        baseURL: 'https://api.example.com',
        auth: {
          type: 'apiKey',
          headerName: 'X-API-Key',
        },
      });

      mockApiSuccess('/users', {});

      await authClient.get('/users');

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['X-API-Key']).toBe('test-token-123');
    });

    it('应该支持自定义token前缀', async () => {
      const authClient = new APIClient({
        baseURL: 'https://api.example.com',
        auth: {
          type: 'bearer',
          tokenPrefix: 'Token',
        },
      });

      mockApiSuccess('/users', {});

      await authClient.get('/users');

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['Authorization']).toBe('Token test-token-123');
    });
  });

  describe('错误处理测试', () => {
    it('应该抛出APIError', async () => {
      mockApiError('/users', 'Not Found', { status: 404 });

      try {
        await apiClient.get('/users');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect((error as APIError).status).toBe(404);
        expect((error as APIError).message).toBe('Not Found');
      }
    });

    it('应该正确识别错误类型', async () => {
      // 客户端错误
      mockApiError('/users', 'Bad Request', { status: 400 });
      
      try {
        await apiClient.get('/users');
      } catch (error) {
        const apiError = error as APIError;
        expect(apiError.isClientError).toBe(true);
        expect(apiError.isServerError).toBe(false);
        expect(apiError.isNetworkError).toBe(false);
      }

      // 服务器错误
      mockApiError('/users', 'Internal Server Error', { status: 500 });
      
      try {
        await apiClient.get('/users');
      } catch (error) {
        const apiError = error as APIError;
        expect(apiError.isClientError).toBe(false);
        expect(apiError.isServerError).toBe(true);
        expect(apiError.isNetworkError).toBe(false);
      }
    });

    it('应该处理网络错误', async () => {
      mockNetworkOffline();

      try {
        await apiClient.get('/users');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect((error as APIError).isNetworkError).toBe(true);
      }
    });

    it('应该包含错误详情', async () => {
      const errorDetails = { 
        field: 'email', 
        code: 'INVALID_FORMAT',
        message: 'Email format is invalid' 
      };
      
      mockApiError('/users', 'Validation Error', { 
        status: 422, 
        details: errorDetails 
      });

      try {
        await apiClient.get('/users');
      } catch (error) {
        const apiError = error as APIError;
        expect(apiError.details).toEqual(errorDetails);
      }
    });
  });

  describe('重试机制测试', () => {
    it('应该在网络错误时重试', async () => {
      let callCount = 0;
      vi.mocked(fetch).mockImplementation(async () => {
        callCount++;
        if (callCount <= 2) {
          throw new Error('Network Error');
        }
        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        } as Response;
      });

      const response = await apiClient.get('/users');
      expect(response.data).toEqual({ success: true });
      expect(callCount).toBe(3);
    });

    it('应该在5xx错误时重试', async () => {
      let callCount = 0;
      vi.mocked(fetch).mockImplementation(async () => {
        callCount++;
        if (callCount <= 2) {
          return {
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: () => Promise.resolve({ message: 'Server Error' }),
          } as Response;
        }
        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        } as Response;
      });

      const response = await apiClient.get('/users');
      expect(response.data).toEqual({ success: true });
      expect(callCount).toBe(3);
    });

    it('不应该在4xx错误时重试', async () => {
      let callCount = 0;
      vi.mocked(fetch).mockImplementation(async () => {
        callCount++;
        return {
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          json: () => Promise.resolve({ message: 'Bad Request' }),
        } as Response;
      });

      try {
        await apiClient.get('/users');
      } catch (error) {
        expect(callCount).toBe(1); // 不应该重试
      }
    });

    it('应该使用指数退避策略', async () => {
      const delays: number[] = [];
      let callCount = 0;

      vi.mocked(fetch).mockImplementation(async () => {
        callCount++;
        const startTime = Date.now();
        
        if (callCount <= 2) {
          // 记录延迟时间
          setTimeout(() => {
            delays.push(Date.now() - startTime);
          }, 0);
          throw new Error('Network Error');
        }
        
        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        } as Response;
      });

      await apiClient.get('/users');
      
      // 验证指数退避：第二次重试的延迟应该比第一次长
      expect(delays.length).toBe(2);
      expect(delays[1]).toBeGreaterThan(delays[0]);
    });
  });

  describe('拦截器测试', () => {
    it('应该执行请求拦截器', async () => {
      const requestInterceptor = vi.fn((config) => {
        config.headers = { ...config.headers, 'X-Intercepted': 'true' };
        return config;
      });

      apiClient.addRequestInterceptor(requestInterceptor);
      mockApiSuccess('/users', {});

      await apiClient.get('/users');

      expect(requestInterceptor).toHaveBeenCalled();
      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['X-Intercepted']).toBe('true');
    });

    it('应该执行响应拦截器', async () => {
      const responseInterceptor = vi.fn((response) => {
        response.data = { ...response.data, intercepted: true };
        return response;
      });

      apiClient.addResponseInterceptor(responseInterceptor);
      mockApiSuccess('/users', { id: 1 });

      const response = await apiClient.get('/users');

      expect(responseInterceptor).toHaveBeenCalled();
      expect(response.data.intercepted).toBe(true);
    });

    it('应该执行错误拦截器', async () => {
      const errorInterceptor = vi.fn((error) => {
        error.message = `Intercepted: ${error.message}`;
        return error;
      });

      apiClient.addErrorInterceptor(errorInterceptor);
      mockApiError('/users', 'Original Error');

      try {
        await apiClient.get('/users');
      } catch (error) {
        expect(errorInterceptor).toHaveBeenCalled();
        expect((error as Error).message).toContain('Intercepted: Original Error');
      }
    });

    it('应该按顺序执行多个拦截器', async () => {
      const order: string[] = [];

      apiClient.addRequestInterceptor((config) => {
        order.push('request1');
        return config;
      });

      apiClient.addRequestInterceptor((config) => {
        order.push('request2');
        return config;
      });

      apiClient.addResponseInterceptor((response) => {
        order.push('response1');
        return response;
      });

      apiClient.addResponseInterceptor((response) => {
        order.push('response2');
        return response;
      });

      mockApiSuccess('/users', {});
      await apiClient.get('/users');

      expect(order).toEqual(['request1', 'request2', 'response1', 'response2']);
    });
  });

  describe('响应解析测试', () => {
    it('应该解析JSON响应', async () => {
      const jsonData = { id: 1, name: 'Test' };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(jsonData),
      } as Response);

      const response = await apiClient.get('/users');
      expect(response.data).toEqual(jsonData);
    });

    it('应该解析文本响应', async () => {
      const textData = 'Plain text response';
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve(textData),
        json: () => Promise.reject(new Error('Not JSON')),
      } as Response);

      const response = await apiClient.get('/users');
      expect(response.data).toBe(textData);
    });

    it('应该解析Blob响应', async () => {
      const blobData = new Blob(['binary data']);
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/octet-stream' }),
        blob: () => Promise.resolve(blobData),
        json: () => Promise.reject(new Error('Not JSON')),
        text: () => Promise.reject(new Error('Not text')),
      } as Response);

      const response = await apiClient.get('/users');
      expect(response.data).toBe(blobData);
    });
  });

  describe('超时处理测试', () => {
    it('应该在超时时抛出错误', async () => {
      const shortTimeoutClient = new APIClient({
        baseURL: 'https://api.example.com',
        timeout: 100,
      });

      // 模拟长时间响应
      vi.mocked(fetch).mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response;
      });

      await expect(shortTimeoutClient.get('/users')).rejects.toThrow();
    });

    it('应该支持请求级别的超时设置', async () => {
      mockApiSuccess('/users', {});

      // 这个请求应该成功，因为使用了更长的超时时间
      const response = await apiClient.get('/users', {}, { timeout: 10000 });
      expect(response).toBeDefined();
    });
  });
});