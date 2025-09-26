/**
 * API服务测试模板
 * 提供API服务的标准测试用例
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  apiMocker, 
  mockApiSuccess, 
  mockApiError, 
  mockNetworkOffline,
  mockSlowNetwork,
  resetApiMocks,
  createAPIClientTester,
  createPerformanceTester,
  createContractTester
} from '../api-test-utils';
import { APIClient, APIError } from '@/lib/api-client';
import { testDataGenerators } from '../utils';

// 导入要测试的API服务
// import { userService } from '@/services/userService';
// import { UserAPI } from '@/lib/api/userAPI';

/**
 * API服务测试模板
 * 
 * 使用方法：
 * 1. 复制此模板文件
 * 2. 重命名为实际API服务名称
 * 3. 导入实际API服务和相关类型
 * 4. 根据API的具体端点和功能调整测试用例
 */

describe('API Service', () => {
  let apiClient: APIClient;
  let apiTester: ReturnType<typeof createAPIClientTester>;
  let performanceTester: ReturnType<typeof createPerformanceTester>;
  let contractTester: ReturnType<typeof createContractTester>;

  // 测试数据
  const mockUser = testDataGenerators.user();
  const mockUsers = testDataGenerators.userList(5);
  const mockFormData = testDataGenerators.formData();

  beforeEach(() => {
    // 初始化API客户端
    apiClient = new APIClient({
      baseURL: 'http://localhost:3000/api',
      timeout: 5000,
    });

    // 初始化测试工具
    apiTester = createAPIClientTester(apiClient);
    performanceTester = createPerformanceTester();
    contractTester = createContractTester();

    // 重置API模拟
    resetApiMocks();
  });

  afterEach(() => {
    resetApiMocks();
  });

  describe('基础API调用测试', () => {
    it('应该成功发送GET请求', async () => {
      mockApiSuccess('/users', mockUsers);

      const response = await apiTester.testGet('/users');

      expect(response.data).toEqual(mockUsers);
      expect(response.status).toBe(200);
      expect(apiMocker.hasRequest('/users', 'GET')).toBe(true);
    });

    it('应该成功发送POST请求', async () => {
      mockApiSuccess('/users', mockUser);

      const response = await apiTester.testPost('/users', mockFormData);

      expect(response.data).toEqual(mockUser);
      expect(response.status).toBe(200);
      
      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.method).toBe('POST');
      expect(lastRequest?.body).toEqual(JSON.stringify(mockFormData));
    });

    it('应该成功发送PUT请求', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      mockApiSuccess(`/users/${mockUser.id}`, updatedUser);

      const response = await apiTester.testPut(`/users/${mockUser.id}`, { name: 'Updated Name' });

      expect(response.data).toEqual(updatedUser);
      expect(apiMocker.hasRequest(`/users/${mockUser.id}`, 'PUT')).toBe(true);
    });

    it('应该成功发送DELETE请求', async () => {
      mockApiSuccess(`/users/${mockUser.id}`, { success: true });

      const response = await apiTester.testDelete(`/users/${mockUser.id}`);

      expect(response.data).toEqual({ success: true });
      expect(apiMocker.hasRequest(`/users/${mockUser.id}`, 'DELETE')).toBe(true);
    });
  });

  describe('查询参数测试', () => {
    it('应该正确处理查询参数', async () => {
      mockApiSuccess('/users', mockUsers);

      const params = { page: 1, limit: 10, search: 'test' };
      await apiTester.testGet('/users', params);

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.url).toContain('page=1');
      expect(lastRequest?.url).toContain('limit=10');
      expect(lastRequest?.url).toContain('search=test');
    });

    it('应该过滤空值参数', async () => {
      mockApiSuccess('/users', mockUsers);

      const params = { page: 1, search: '', filter: null, active: undefined };
      await apiTester.testGet('/users', params);

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.url).toContain('page=1');
      expect(lastRequest?.url).not.toContain('search=');
      expect(lastRequest?.url).not.toContain('filter=');
      expect(lastRequest?.url).not.toContain('active=');
    });
  });

  describe('请求头测试', () => {
    it('应该设置正确的Content-Type', async () => {
      mockApiSuccess('/users', mockUser);

      await apiTester.testPost('/users', mockFormData);

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['Content-Type']).toBe('application/json');
    });

    it('应该包含认证头', async () => {
      // 模拟认证令牌
      localStorage.setItem('auth_token', 'test-token');

      const authenticatedClient = new APIClient({
        baseURL: 'http://localhost:3000/api',
        auth: {
          type: 'bearer',
          tokenPrefix: 'Bearer',
        },
      });

      const authenticatedTester = createAPIClientTester(authenticatedClient);
      mockApiSuccess('/users', mockUsers);

      await authenticatedTester.testGet('/users');

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['Authorization']).toBe('Bearer test-token');
    });

    it('应该包含自定义请求头', async () => {
      mockApiSuccess('/users', mockUsers);

      const customHeaders = { 'X-Custom-Header': 'custom-value' };
      await apiClient.get('/users', {}, { headers: customHeaders });

      const lastRequest = apiMocker.getLastRequest();
      expect(lastRequest?.headers?.['X-Custom-Header']).toBe('custom-value');
    });
  });

  describe('错误处理测试', () => {
    it('应该处理400错误', async () => {
      mockApiError('/users', 'Bad Request', { status: 400 });

      await apiTester.testErrorHandling('/users', {
        status: 400,
        message: 'Bad Request',
      });
    });

    it('应该处理401认证错误', async () => {
      mockApiError('/users', 'Unauthorized', { status: 401 });

      await apiTester.testErrorHandling('/users', {
        status: 401,
        message: 'Unauthorized',
      });
    });

    it('应该处理403权限错误', async () => {
      mockApiError('/users', 'Forbidden', { status: 403 });

      await apiTester.testErrorHandling('/users', {
        status: 403,
        message: 'Forbidden',
      });
    });

    it('应该处理404资源不存在错误', async () => {
      mockApiError('/users/999', 'Not Found', { status: 404 });

      await apiTester.testErrorHandling('/users/999', {
        status: 404,
        message: 'Not Found',
      });
    });

    it('应该处理500服务器错误', async () => {
      mockApiError('/users', 'Internal Server Error', { status: 500 });

      await apiTester.testErrorHandling('/users', {
        status: 500,
        message: 'Internal Server Error',
      });
    });

    it('应该处理网络错误', async () => {
      mockNetworkOffline();

      try {
        await apiTester.testGet('/users');
        expect.fail('Should have thrown a network error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Network Error');
      }
    });

    it('应该包含错误详情', async () => {
      const errorDetails = { field: 'email', code: 'INVALID_FORMAT' };
      mockApiError('/users', 'Validation Error', { 
        status: 422, 
        details: errorDetails 
      });

      try {
        await apiTester.testGet('/users');
        expect.fail('Should have thrown an error');
      } catch (error) {
        if (error instanceof APIError) {
          expect(error.details).toEqual(errorDetails);
        }
      }
    });
  });

  describe('重试机制测试', () => {
    it('应该在网络错误时重试', async () => {
      await apiTester.testRetry('/users', 3);
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
          json: () => Promise.resolve(mockUsers),
        } as Response;
      });

      const response = await apiClient.get('/users');
      expect(response.data).toEqual(mockUsers);
      expect(callCount).toBe(3);
    });

    it('应该在429错误时重试', async () => {
      let callCount = 0;
      vi.mocked(fetch).mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return {
            ok: false,
            status: 429,
            statusText: 'Too Many Requests',
            json: () => Promise.resolve({ message: 'Rate Limited' }),
          } as Response;
        }
        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockUsers),
        } as Response;
      });

      const response = await apiClient.get('/users');
      expect(response.data).toEqual(mockUsers);
      expect(callCount).toBe(2);
    });

    it('不应该在4xx客户端错误时重试', async () => {
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
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(callCount).toBe(1); // 不应该重试
      }
    });
  });

  describe('超时处理测试', () => {
    it('应该在超时时抛出错误', async () => {
      const shortTimeoutClient = new APIClient({
        baseURL: 'http://localhost:3000/api',
        timeout: 100, // 100ms超时
      });

      const shortTimeoutTester = createAPIClientTester(shortTimeoutClient);
      
      await expect(
        shortTimeoutTester.testTimeout('/users', 100)
      ).rejects.toThrow();
    });

    it('应该支持自定义超时', async () => {
      mockSlowNetwork(200); // 200ms延迟

      const response = await apiClient.get('/users', {}, { timeout: 500 });
      expect(response).toBeDefined();
    });
  });

  describe('拦截器测试', () => {
    it('应该执行请求拦截器', async () => {
      const requestInterceptor = vi.fn((config) => {
        config.headers = { ...config.headers, 'X-Intercepted': 'true' };
        return config;
      });

      apiClient.addRequestInterceptor(requestInterceptor);
      mockApiSuccess('/users', mockUsers);

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
      mockApiSuccess('/users', mockUsers);

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
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(errorInterceptor).toHaveBeenCalled();
        expect((error as Error).message).toContain('Intercepted: Original Error');
      }
    });
  });

  describe('性能测试', () => {
    it('应该在合理时间内完成请求', async () => {
      mockApiSuccess('/users', mockUsers, { delay: 50 });

      const responseTime = await performanceTester.testResponseTime(
        () => apiClient.get('/users'),
        200 // 最大200ms
      );

      expect(responseTime).toBeLessThan(200);
    });

    it('应该支持并发请求', async () => {
      mockApiSuccess('/users', mockUsers);

      const responseTimes = await performanceTester.testConcurrency(
        () => apiClient.get('/users'),
        5 // 5个并发请求
      );

      expect(responseTimes).toHaveLength(5);
      responseTimes.forEach(time => {
        expect(time).toBeLessThan(1000);
      });
    });

    it('应该有合理的内存使用', async () => {
      mockApiSuccess('/users', mockUsers);

      const memoryUsage = await performanceTester.testMemoryUsage(
        () => apiClient.get('/users')
      );

      // 内存增长应该在合理范围内
      expect(memoryUsage.diff).toBeLessThan(1024 * 1024); // 1MB
    });
  });

  describe('契约测试', () => {
    it('应该返回正确的响应结构', async () => {
      mockApiSuccess('/users', mockUsers);

      const response = await apiClient.get('/users');

      // 验证响应结构
      contractTester.validateResponseSchema(response.data, {
        0: 'object', // 数组第一个元素应该是对象
      });

      // 验证用户对象结构
      if (Array.isArray(response.data) && response.data.length > 0) {
        contractTester.validateResponseSchema(response.data[0], {
          id: 'number',
          name: 'string',
          email: 'string',
        });
      }
    });

    it('应该验证错误响应结构', async () => {
      await contractTester.validateErrorResponse('/users/invalid', 404);
    });

    it('应该验证端点可访问性', async () => {
      mockApiSuccess('/users', mockUsers);
      await contractTester.validateEndpoint('/users', 'GET');
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空响应', async () => {
      mockApiSuccess('/users', null);

      const response = await apiClient.get('/users');
      expect(response.data).toBeNull();
    });

    it('应该处理大量数据', async () => {
      const largeData = testDataGenerators.userList(1000);
      mockApiSuccess('/users', largeData);

      const response = await apiClient.get('/users');
      expect(response.data).toHaveLength(1000);
    });

    it('应该处理特殊字符', async () => {
      const specialData = {
        name: 'Test & <script>alert("xss")</script>',
        emoji: '🚀💻🎉',
        unicode: '测试数据',
      };
      mockApiSuccess('/users', specialData);

      const response = await apiClient.post('/users', specialData);
      expect(response.data).toEqual(specialData);
    });

    it('应该处理非JSON响应', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('Plain text response'),
        json: () => Promise.reject(new Error('Not JSON')),
      } as Response);

      const response = await apiClient.get('/users');
      expect(response.data).toBe('Plain text response');
    });
  });

  describe('缓存测试', () => {
    it('应该支持响应缓存', async () => {
      mockApiSuccess('/users', mockUsers);

      // 第一次请求
      await apiClient.get('/users');
      expect(apiMocker.getRequestCount('/users')).toBe(1);

      // 第二次请求（应该使用缓存）
      await apiClient.get('/users');
      // 注意：这里的行为取决于具体的缓存实现
      // 如果有缓存，请求次数应该还是1
      // 如果没有缓存，请求次数会是2
    });

    it('应该支持缓存失效', async () => {
      mockApiSuccess('/users', mockUsers);

      // 首次请求
      await apiClient.get('/users');
      
      // 模拟缓存失效后的新请求
      const newData = testDataGenerators.userList(3);
      mockApiSuccess('/users', newData);
      
      const response = await apiClient.get('/users');
      expect(response.data).toEqual(newData);
    });
  });
});