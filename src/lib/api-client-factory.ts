/**
 * API客户端工厂
 * 用于创建和管理不同配置的API客户端实例
 */

import { APIClient, APIClientConfig, defaultErrorHandler, requestIdInterceptor, responseTimeInterceptor } from './api-client';
import type { APIDocumentation, AuthConfig } from '@/types/api-documentation';

// 客户端实例缓存
const clientCache = new Map<string, APIClient>();

// 预定义的客户端配置
export interface PredefinedClientConfig {
  name: string;
  description: string;
  config: APIClientConfig;
}

// 默认客户端配置
export const DEFAULT_CONFIGS: Record<string, PredefinedClientConfig> = {
  default: {
    name: 'Default Client',
    description: '默认API客户端配置',
    config: {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      interceptors: {
        request: [requestIdInterceptor],
        response: [responseTimeInterceptor],
        error: [defaultErrorHandler],
      },
    },
  },
  
  auth: {
    name: 'Authenticated Client',
    description: '带认证的API客户端',
    config: {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 15000,
      retries: 2,
      retryDelay: 1500,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      auth: {
        type: 'bearer',
        tokenPrefix: 'Bearer',
      },
      interceptors: {
        request: [requestIdInterceptor],
        response: [responseTimeInterceptor],
        error: [defaultErrorHandler],
      },
    },
  },
  
  upload: {
    name: 'File Upload Client',
    description: '文件上传专用客户端',
    config: {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 60000, // 1分钟超时
      retries: 1,
      retryDelay: 2000,
      headers: {
        'Accept': 'application/json',
        // 不设置Content-Type，让浏览器自动设置multipart/form-data
      },
      interceptors: {
        request: [requestIdInterceptor],
        response: [responseTimeInterceptor],
        error: [defaultErrorHandler],
      },
    },
  },
  
  external: {
    name: 'External API Client',
    description: '外部API客户端',
    config: {
      baseURL: '', // 需要动态设置
      timeout: 20000,
      retries: 2,
      retryDelay: 2000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AI-Generated-App/1.0',
      },
      interceptors: {
        request: [requestIdInterceptor],
        response: [responseTimeInterceptor],
        error: [defaultErrorHandler],
      },
    },
  },
};

// API客户端工厂类
export class APIClientFactory {
  private static instance: APIClientFactory;
  private configs: Map<string, PredefinedClientConfig> = new Map();

  private constructor() {
    // 初始化默认配置
    Object.entries(DEFAULT_CONFIGS).forEach(([key, config]) => {
      this.configs.set(key, config);
    });
  }

  // 获取工厂单例
  static getInstance(): APIClientFactory {
    if (!APIClientFactory.instance) {
      APIClientFactory.instance = new APIClientFactory();
    }
    return APIClientFactory.instance;
  }

  // 注册新的客户端配置
  registerConfig(name: string, config: PredefinedClientConfig): void {
    this.configs.set(name, config);
  }

  // 获取客户端配置
  getConfig(name: string): PredefinedClientConfig | undefined {
    return this.configs.get(name);
  }

  // 列出所有可用配置
  listConfigs(): PredefinedClientConfig[] {
    return Array.from(this.configs.values());
  }

  // 创建API客户端
  createClient(configName: string = 'default', overrides?: Partial<APIClientConfig>): APIClient {
    const cacheKey = `${configName}_${JSON.stringify(overrides || {})}`;
    
    // 检查缓存
    if (clientCache.has(cacheKey)) {
      return clientCache.get(cacheKey)!;
    }

    const predefinedConfig = this.configs.get(configName);
    if (!predefinedConfig) {
      throw new Error(`Unknown client configuration: ${configName}`);
    }

    // 合并配置
    const finalConfig: APIClientConfig = {
      ...predefinedConfig.config,
      ...overrides,
      headers: {
        ...predefinedConfig.config.headers,
        ...overrides?.headers,
      },
      interceptors: {
        request: [
          ...(predefinedConfig.config.interceptors?.request || []),
          ...(overrides?.interceptors?.request || []),
        ],
        response: [
          ...(predefinedConfig.config.interceptors?.response || []),
          ...(overrides?.interceptors?.response || []),
        ],
        error: [
          ...(predefinedConfig.config.interceptors?.error || []),
          ...(overrides?.interceptors?.error || []),
        ],
      },
    };

    const client = new APIClient(finalConfig);
    
    // 缓存客户端实例
    clientCache.set(cacheKey, client);
    
    return client;
  }

  // 基于API文档创建客户端
  createClientFromDocumentation(
    documentation: APIDocumentation,
    configName: string = 'default'
  ): APIClient {
    const overrides: Partial<APIClientConfig> = {
      baseURL: documentation.baseURL,
      timeout: documentation.timeout,
      headers: {
        ...documentation.globalHeaders,
      },
      auth: documentation.authentication,
    };

    return this.createClient(configName, overrides);
  }

  // 创建带认证的客户端
  createAuthenticatedClient(
    baseURL: string,
    authConfig: AuthConfig,
    configName: string = 'auth'
  ): APIClient {
    const overrides: Partial<APIClientConfig> = {
      baseURL,
      auth: authConfig,
    };

    return this.createClient(configName, overrides);
  }

  // 创建文件上传客户端
  createUploadClient(baseURL: string): APIClient {
    const overrides: Partial<APIClientConfig> = {
      baseURL,
    };

    return this.createClient('upload', overrides);
  }

  // 创建外部API客户端
  createExternalClient(
    baseURL: string,
    headers?: Record<string, string>,
    auth?: AuthConfig
  ): APIClient {
    const overrides: Partial<APIClientConfig> = {
      baseURL,
      headers,
      auth,
    };

    return this.createClient('external', overrides);
  }

  // 清除客户端缓存
  clearCache(): void {
    clientCache.clear();
  }

  // 清除特定客户端缓存
  clearClientCache(configName: string): void {
    const keysToDelete = Array.from(clientCache.keys()).filter(key => 
      key.startsWith(`${configName}_`)
    );
    
    keysToDelete.forEach(key => clientCache.delete(key));
  }

  // 更新客户端配置
  updateClientConfig(configName: string, updates: Partial<APIClientConfig>): void {
    const existingConfig = this.configs.get(configName);
    if (!existingConfig) {
      throw new Error(`Configuration ${configName} not found`);
    }

    const updatedConfig: PredefinedClientConfig = {
      ...existingConfig,
      config: {
        ...existingConfig.config,
        ...updates,
        headers: {
          ...existingConfig.config.headers,
          ...updates.headers,
        },
      },
    };

    this.configs.set(configName, updatedConfig);
    
    // 清除相关缓存
    this.clearClientCache(configName);
  }
}

// 便捷函数
export const apiClientFactory = APIClientFactory.getInstance();

// 快速创建客户端的便捷函数
export const createAPIClient = (
  configName: string = 'default',
  overrides?: Partial<APIClientConfig>
): APIClient => {
  return apiClientFactory.createClient(configName, overrides);
};

// 创建认证客户端的便捷函数
export const createAuthClient = (
  baseURL: string,
  authConfig: AuthConfig
): APIClient => {
  return apiClientFactory.createAuthenticatedClient(baseURL, authConfig);
};

// 创建上传客户端的便捷函数
export const createUploadClient = (baseURL: string): APIClient => {
  return apiClientFactory.createUploadClient(baseURL);
};

// 基于文档创建客户端的便捷函数
export const createClientFromDocs = (documentation: APIDocumentation): APIClient => {
  return apiClientFactory.createClientFromDocumentation(documentation);
};

// 默认客户端实例
export const defaultAPIClient = createAPIClient('default');
export const authAPIClient = createAPIClient('auth');