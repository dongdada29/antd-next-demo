/**
 * API服务注册表
 * 管理和组织生成的API服务函数
 */

import type { APIDocumentation, APIEndpoint } from '@/types/api-documentation';
import { ServiceGenerator, ServiceGenerationResult, GeneratedService } from './service-generator';
import { APIClient } from './api-client';
import { createClientFromDocs } from './api-client-factory';

// 服务注册表条目
export interface ServiceRegistryEntry {
  id: string;
  name: string;
  documentation: APIDocumentation;
  services: GeneratedService[];
  client: APIClient;
  generatedAt: Date;
  version: string;
}

// 服务分组
export interface ServiceGroup {
  name: string;
  description?: string;
  services: string[]; // 服务ID列表
  tags: string[];
}

// 服务统计信息
export interface ServiceStats {
  totalServices: number;
  totalEndpoints: number;
  servicesByMethod: Record<string, number>;
  servicesByTag: Record<string, number>;
  lastGenerated: Date;
}

// API服务注册表类
export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, ServiceRegistryEntry> = new Map();
  private groups: Map<string, ServiceGroup> = new Map();
  private generator: ServiceGenerator;

  private constructor() {
    this.generator = new ServiceGenerator();
  }

  // 获取单例实例
  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  // 注册API文档并生成服务
  async registerDocumentation(
    id: string,
    name: string,
    documentation: APIDocumentation
  ): Promise<ServiceRegistryEntry> {
    // 生成服务函数
    const generationResult = this.generator.generateServices(documentation);
    
    // 创建API客户端
    const client = createClientFromDocs(documentation);

    // 创建注册表条目
    const entry: ServiceRegistryEntry = {
      id,
      name,
      documentation,
      services: generationResult.services,
      client,
      generatedAt: new Date(),
      version: documentation.version,
    };

    // 存储到注册表
    this.services.set(id, entry);

    // 自动创建基于标签的分组
    this.createTagGroups(entry);

    return entry;
  }

  // 获取服务条目
  getService(id: string): ServiceRegistryEntry | undefined {
    return this.services.get(id);
  }

  // 获取所有服务
  getAllServices(): ServiceRegistryEntry[] {
    return Array.from(this.services.values());
  }

  // 根据标签查找服务
  getServicesByTag(tag: string): ServiceRegistryEntry[] {
    return Array.from(this.services.values()).filter(entry =>
      entry.documentation.endpoints.some(endpoint =>
        endpoint.tags?.includes(tag)
      )
    );
  }

  // 根据方法查找服务
  getServicesByMethod(method: string): ServiceRegistryEntry[] {
    return Array.from(this.services.values()).filter(entry =>
      entry.documentation.endpoints.some(endpoint =>
        endpoint.method === method.toUpperCase()
      )
    );
  }

  // 搜索服务
  searchServices(query: string): ServiceRegistryEntry[] {
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.services.values()).filter(entry => {
      // 搜索服务名称
      if (entry.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 搜索文档标题和描述
      if (entry.documentation.title.toLowerCase().includes(lowerQuery) ||
          entry.documentation.description.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 搜索端点
      return entry.documentation.endpoints.some(endpoint =>
        endpoint.name.toLowerCase().includes(lowerQuery) ||
        endpoint.summary.toLowerCase().includes(lowerQuery) ||
        endpoint.description.toLowerCase().includes(lowerQuery) ||
        endpoint.path.toLowerCase().includes(lowerQuery)
      );
    });
  }

  // 获取特定端点的服务函数
  getServiceFunction(serviceId: string, endpointId: string): GeneratedService | undefined {
    const entry = this.services.get(serviceId);
    if (!entry) return undefined;

    return entry.services.find(service => service.endpoint.id === endpointId);
  }

  // 获取服务的API客户端
  getServiceClient(serviceId: string): APIClient | undefined {
    const entry = this.services.get(serviceId);
    return entry?.client;
  }

  // 更新服务文档
  async updateDocumentation(
    id: string,
    documentation: APIDocumentation
  ): Promise<ServiceRegistryEntry | undefined> {
    const existingEntry = this.services.get(id);
    if (!existingEntry) return undefined;

    // 重新生成服务
    const generationResult = this.generator.generateServices(documentation);
    
    // 更新客户端配置
    existingEntry.client.updateConfig({
      baseURL: documentation.baseURL,
      timeout: documentation.timeout,
      headers: documentation.globalHeaders,
      auth: documentation.authentication,
    });

    // 更新条目
    const updatedEntry: ServiceRegistryEntry = {
      ...existingEntry,
      documentation,
      services: generationResult.services,
      generatedAt: new Date(),
      version: documentation.version,
    };

    this.services.set(id, updatedEntry);

    // 更新分组
    this.createTagGroups(updatedEntry);

    return updatedEntry;
  }

  // 删除服务
  removeService(id: string): boolean {
    const removed = this.services.delete(id);
    
    if (removed) {
      // 清理相关分组
      this.cleanupGroups();
    }
    
    return removed;
  }

  // 创建服务分组
  createGroup(name: string, description?: string, tags: string[] = []): ServiceGroup {
    const serviceIds = this.getServiceIdsByTags(tags);
    
    const group: ServiceGroup = {
      name,
      description,
      services: serviceIds,
      tags,
    };

    this.groups.set(name, group);
    return group;
  }

  // 获取分组
  getGroup(name: string): ServiceGroup | undefined {
    return this.groups.get(name);
  }

  // 获取所有分组
  getAllGroups(): ServiceGroup[] {
    return Array.from(this.groups.values());
  }

  // 删除分组
  removeGroup(name: string): boolean {
    return this.groups.delete(name);
  }

  // 获取服务统计信息
  getStats(): ServiceStats {
    const allServices = Array.from(this.services.values());
    const totalServices = allServices.length;
    const totalEndpoints = allServices.reduce(
      (sum, entry) => sum + entry.documentation.endpoints.length,
      0
    );

    // 按方法统计
    const servicesByMethod: Record<string, number> = {};
    allServices.forEach(entry => {
      entry.documentation.endpoints.forEach(endpoint => {
        servicesByMethod[endpoint.method] = (servicesByMethod[endpoint.method] || 0) + 1;
      });
    });

    // 按标签统计
    const servicesByTag: Record<string, number> = {};
    allServices.forEach(entry => {
      entry.documentation.endpoints.forEach(endpoint => {
        endpoint.tags?.forEach(tag => {
          servicesByTag[tag] = (servicesByTag[tag] || 0) + 1;
        });
      });
    });

    // 最后生成时间
    const lastGenerated = allServices.reduce(
      (latest, entry) => entry.generatedAt > latest ? entry.generatedAt : latest,
      new Date(0)
    );

    return {
      totalServices,
      totalEndpoints,
      servicesByMethod,
      servicesByTag,
      lastGenerated,
    };
  }

  // 导出服务代码
  exportServiceCode(serviceId: string): {
    services: string;
    types: string;
    hooks: string;
    index: string;
  } | undefined {
    const entry = this.services.get(serviceId);
    if (!entry) return undefined;

    const generationResult = this.generator.generateServices(entry.documentation);
    
    return {
      services: entry.services.map(s => s.code).join('\n\n'),
      types: generationResult.types,
      hooks: generationResult.hooks,
      index: generationResult.index,
    };
  }

  // 导出所有服务代码
  exportAllServiceCode(): Record<string, {
    services: string;
    types: string;
    hooks: string;
    index: string;
  }> {
    const result: Record<string, any> = {};
    
    this.services.forEach((entry, id) => {
      const code = this.exportServiceCode(id);
      if (code) {
        result[id] = code;
      }
    });

    return result;
  }

  // 验证服务完整性
  validateService(serviceId: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const entry = this.services.get(serviceId);
    if (!entry) {
      return {
        isValid: false,
        errors: ['Service not found'],
        warnings: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证文档
    if (!entry.documentation.baseURL) {
      errors.push('Missing base URL in documentation');
    }

    if (!entry.documentation.endpoints || entry.documentation.endpoints.length === 0) {
      errors.push('No endpoints defined in documentation');
    }

    // 验证端点
    entry.documentation.endpoints.forEach((endpoint, index) => {
      if (!endpoint.path) {
        errors.push(`Endpoint ${index}: Missing path`);
      }
      
      if (!endpoint.method) {
        errors.push(`Endpoint ${index}: Missing method`);
      }

      if (!endpoint.responses || endpoint.responses.length === 0) {
        warnings.push(`Endpoint ${index}: No response definitions`);
      }
    });

    // 验证生成的服务
    if (entry.services.length !== entry.documentation.endpoints.length) {
      warnings.push('Number of generated services does not match endpoints');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // 清理注册表
  clear(): void {
    this.services.clear();
    this.groups.clear();
  }

  // 私有方法：基于标签创建分组
  private createTagGroups(entry: ServiceRegistryEntry): void {
    const tags = new Set<string>();
    
    entry.documentation.endpoints.forEach(endpoint => {
      endpoint.tags?.forEach(tag => tags.add(tag));
    });

    tags.forEach(tag => {
      const groupName = `tag:${tag}`;
      if (!this.groups.has(groupName)) {
        this.createGroup(groupName, `Services tagged with ${tag}`, [tag]);
      }
    });
  }

  // 私有方法：根据标签获取服务ID
  private getServiceIdsByTags(tags: string[]): string[] {
    if (tags.length === 0) {
      return Array.from(this.services.keys());
    }

    return Array.from(this.services.entries())
      .filter(([_, entry]) =>
        entry.documentation.endpoints.some(endpoint =>
          endpoint.tags?.some(tag => tags.includes(tag))
        )
      )
      .map(([id]) => id);
  }

  // 私有方法：清理空分组
  private cleanupGroups(): void {
    const groupsToDelete: string[] = [];
    
    this.groups.forEach((group, name) => {
      const validServices = group.services.filter(serviceId => 
        this.services.has(serviceId)
      );
      
      if (validServices.length === 0) {
        groupsToDelete.push(name);
      } else if (validServices.length !== group.services.length) {
        // 更新分组的服务列表
        group.services = validServices;
      }
    });

    groupsToDelete.forEach(name => this.groups.delete(name));
  }
}

// 便捷函数
export const serviceRegistry = ServiceRegistry.getInstance();

// 注册文档的便捷函数
export const registerAPIDocumentation = (
  id: string,
  name: string,
  documentation: APIDocumentation
): Promise<ServiceRegistryEntry> => {
  return serviceRegistry.registerDocumentation(id, name, documentation);
};

// 获取服务的便捷函数
export const getAPIService = (id: string): ServiceRegistryEntry | undefined => {
  return serviceRegistry.getService(id);
};

// 搜索服务的便捷函数
export const searchAPIServices = (query: string): ServiceRegistryEntry[] => {
  return serviceRegistry.searchServices(query);
};