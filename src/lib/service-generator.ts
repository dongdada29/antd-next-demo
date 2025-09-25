/**
 * API服务函数生成器
 * 基于接口文档自动生成类型安全的API服务函数
 */

import type { 
  APIDocumentation, 
  APIEndpoint, 
  Parameter, 
  RequestBodySchema,
  ResponseSchema,
  PropertySchema 
} from '@/types/api-documentation';
import { TypeGenerator } from './type-generator';

// 生成的服务函数配置
export interface ServiceGeneratorConfig {
  outputPath?: string;
  namespace?: string;
  includeTypes?: boolean;
  includeValidation?: boolean;
  includeHooks?: boolean;
  clientName?: string;
  exportFormat?: 'named' | 'default' | 'both';
}

// 生成的服务函数信息
export interface GeneratedService {
  name: string;
  functionName: string;
  code: string;
  types: string[];
  imports: string[];
  endpoint: APIEndpoint;
}

// 生成结果
export interface ServiceGenerationResult {
  services: GeneratedService[];
  types: string;
  hooks: string;
  index: string;
  totalFunctions: number;
}

// API服务生成器类
export class ServiceGenerator {
  private typeGenerator: TypeGenerator;
  private config: ServiceGeneratorConfig;

  constructor(config: ServiceGeneratorConfig = {}) {
    this.typeGenerator = new TypeGenerator();
    this.config = {
      namespace: 'API',
      includeTypes: true,
      includeValidation: true,
      includeHooks: true,
      clientName: 'apiClient',
      exportFormat: 'named',
      ...config,
    };
  }

  // 生成所有服务函数
  generateServices(documentation: APIDocumentation): ServiceGenerationResult {
    const services: GeneratedService[] = [];
    const allTypes: string[] = [];
    const allImports = new Set<string>();

    // 为每个端点生成服务函数
    documentation.endpoints.forEach(endpoint => {
      const service = this.generateServiceFunction(endpoint);
      services.push(service);
      allTypes.push(...service.types);
      service.imports.forEach(imp => allImports.add(imp));
    });

    // 生成类型定义
    const typesCode = this.config.includeTypes 
      ? this.generateTypesFile(documentation, allTypes)
      : '';

    // 生成React Hooks
    const hooksCode = this.config.includeHooks 
      ? this.generateHooksFile(services)
      : '';

    // 生成索引文件
    const indexCode = this.generateIndexFile(services, Array.from(allImports));

    return {
      services,
      types: typesCode,
      hooks: hooksCode,
      index: indexCode,
      totalFunctions: services.length,
    };
  }

  // 生成单个服务函数
  private generateServiceFunction(endpoint: APIEndpoint): GeneratedService {
    const functionName = this.generateFunctionName(endpoint);
    const types = this.generateEndpointTypes(endpoint);
    const imports = this.generateImports(endpoint);
    const code = this.generateFunctionCode(endpoint, functionName);

    return {
      name: endpoint.name,
      functionName,
      code,
      types,
      imports,
      endpoint,
    };
  }

  // 生成函数名称
  private generateFunctionName(endpoint: APIEndpoint): string {
    // 将端点名称转换为驼峰命名
    const baseName = endpoint.name
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map((word, index) => 
        index === 0 
          ? word.toLowerCase() 
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');

    // 根据HTTP方法添加前缀
    const methodPrefix = this.getMethodPrefix(endpoint.method);
    
    return `${methodPrefix}${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
  }

  // 获取方法前缀
  private getMethodPrefix(method: string): string {
    const prefixes: Record<string, string> = {
      'GET': 'get',
      'POST': 'create',
      'PUT': 'update',
      'PATCH': 'patch',
      'DELETE': 'delete',
    };
    return prefixes[method] || method.toLowerCase();
  }

  // 生成端点相关类型
  private generateEndpointTypes(endpoint: APIEndpoint): string[] {
    const types: string[] = [];

    // 生成请求参数类型
    if (endpoint.parameters && endpoint.parameters.length > 0) {
      const paramsType = this.generateParametersType(endpoint);
      if (paramsType) {
        types.push(paramsType);
      }
    }

    // 生成请求体类型
    if (endpoint.requestBody) {
      const bodyType = this.generateRequestBodyType(endpoint);
      if (bodyType) {
        types.push(bodyType);
      }
    }

    // 生成响应类型
    const responseTypes = this.generateResponseTypes(endpoint);
    types.push(...responseTypes);

    return types;
  }

  // 生成参数类型
  private generateParametersType(endpoint: APIEndpoint): string | null {
    if (!endpoint.parameters || endpoint.parameters.length === 0) {
      return null;
    }

    const typeName = `${this.toPascalCase(endpoint.name)}Params`;
    const properties: Record<string, PropertySchema> = {};

    endpoint.parameters.forEach(param => {
      properties[param.name] = {
        type: param.type as any,
        description: param.description,
        example: param.example,
      };
    });

    const requiredFields = endpoint.parameters.filter(p => p.required).map(p => p.name);
    const propertiesStr = Object.entries(properties).map(([key, prop]) => {
      const optional = requiredFields.includes(key) ? '' : '?';
      const type = this.mapPropertyType(prop);
      const comment = prop.description ? `  /** ${prop.description} */\n` : '';
      return `${comment}  ${key}${optional}: ${type};`;
    }).join('\n');

    return `export interface ${typeName} {
${propertiesStr}
}`;
  }

  // 生成请求体类型
  private generateRequestBodyType(endpoint: APIEndpoint): string | null {
    if (!endpoint.requestBody) {
      return null;
    }

    const typeName = `${this.toPascalCase(endpoint.name)}Request`;
    const requiredFields = endpoint.requestBody.schema.required || [];
    const propertiesStr = Object.entries(endpoint.requestBody.schema.properties).map(([key, prop]) => {
      const optional = requiredFields.includes(key) ? '' : '?';
      const type = this.mapPropertyType(prop as PropertySchema);
      const comment = (prop as PropertySchema).description ? `  /** ${(prop as PropertySchema).description} */\n` : '';
      return `${comment}  ${key}${optional}: ${type};`;
    }).join('\n');

    return `export interface ${typeName} {
${propertiesStr}
}`;
  }

  // 生成响应类型
  private generateResponseTypes(endpoint: APIEndpoint): string[] {
    const types: string[] = [];

    endpoint.responses.forEach(response => {
      if (response.schema) {
        const typeName = `${this.toPascalCase(endpoint.name)}Response`;
        
        if (response.schema.type === 'object' && response.schema.properties) {
          const propertiesStr = Object.entries(response.schema.properties).map(([key, prop]) => {
            const type = this.mapPropertyType(prop as PropertySchema);
            const comment = (prop as PropertySchema).description ? `  /** ${(prop as PropertySchema).description} */\n` : '';
            return `${comment}  ${key}: ${type};`;
          }).join('\n');

          const responseType = `export interface ${typeName} {
${propertiesStr}
}`;
          types.push(responseType);
        } else if (response.schema.type === 'array' && response.schema.items) {
          // 处理数组响应
          const itemTypeName = `${this.toPascalCase(endpoint.name)}Item`;
          if (response.schema.items.properties) {
            const itemPropertiesStr = Object.entries(response.schema.items.properties).map(([key, prop]) => {
              const type = this.mapPropertyType(prop as PropertySchema);
              const comment = (prop as PropertySchema).description ? `  /** ${(prop as PropertySchema).description} */\n` : '';
              return `${comment}  ${key}: ${type};`;
            }).join('\n');

            const itemType = `export interface ${itemTypeName} {
${itemPropertiesStr}
}`;
            types.push(itemType);
            types.push(`export type ${typeName} = ${itemTypeName}[];`);
          }
        }
      }
    });

    return types;
  }

  // 生成导入语句
  private generateImports(endpoint: APIEndpoint): string[] {
    const imports: string[] = [];

    // 基础导入
    imports.push("import type { APIResponse } from '@/lib/api-client';");
    
    // 根据配置添加客户端导入
    if (this.config.clientName) {
      imports.push(`import { ${this.config.clientName} } from '@/lib/api-client-factory';`);
    }

    return imports;
  }

  // 生成函数代码
  private generateFunctionCode(endpoint: APIEndpoint, functionName: string): string {
    const paramsType = this.generateParamsTypeName(endpoint);
    const requestType = this.generateRequestTypeName(endpoint);
    const responseType = this.generateResponseTypeName(endpoint);
    
    // 构建函数参数
    const functionParams = this.buildFunctionParameters(endpoint, paramsType, requestType);
    
    // 构建函数体
    const functionBody = this.buildFunctionBody(endpoint);

    // 生成JSDoc注释
    const jsdoc = this.generateJSDoc(endpoint);

    return `${jsdoc}
export const ${functionName} = async (${functionParams}): Promise<${responseType}> => {
${functionBody}
};`;
  }

  // 生成参数类型名称
  private generateParamsTypeName(endpoint: APIEndpoint): string {
    return endpoint.parameters && endpoint.parameters.length > 0
      ? `${this.toPascalCase(endpoint.name)}Params`
      : '';
  }

  // 生成请求类型名称
  private generateRequestTypeName(endpoint: APIEndpoint): string {
    return endpoint.requestBody
      ? `${this.toPascalCase(endpoint.name)}Request`
      : '';
  }

  // 生成响应类型名称
  private generateResponseTypeName(endpoint: APIEndpoint): string {
    const baseName = `${this.toPascalCase(endpoint.name)}Response`;
    return `APIResponse<${baseName}>`;
  }

  // 构建函数参数
  private buildFunctionParameters(endpoint: APIEndpoint, paramsType: string, requestType: string): string {
    const params: string[] = [];

    // 路径参数
    const pathParams = endpoint.parameters?.filter(p => p.in === 'path') || [];
    pathParams.forEach(param => {
      params.push(`${param.name}: ${this.mapParameterType(param.type)}`);
    });

    // 查询参数
    if (endpoint.parameters?.some(p => p.in === 'query')) {
      params.push(`params?: ${paramsType}`);
    }

    // 请求体
    if (endpoint.requestBody) {
      params.push(`data: ${requestType}`);
    }

    // 配置参数
    params.push('config?: RequestConfig');

    return params.join(', ');
  }

  // 构建函数体
  private buildFunctionBody(endpoint: APIEndpoint): string {
    const method = endpoint.method.toLowerCase();
    const pathParams = endpoint.parameters?.filter(p => p.in === 'path') || [];
    
    // 构建URL路径
    let urlPath = endpoint.path;
    pathParams.forEach(param => {
      urlPath = urlPath.replace(`{${param.name}}`, `\${${param.name}}`);
    });

    // 构建API调用
    const apiCall = this.buildAPICall(method, urlPath, endpoint);

    return `  try {
    ${apiCall}
    return response;
  } catch (error) {
    throw error;
  }`;
  }

  // 构建API调用代码
  private buildAPICall(method: string, urlPath: string, endpoint: APIEndpoint): string {
    const hasQueryParams = endpoint.parameters?.some(p => p.in === 'query');
    const hasRequestBody = !!endpoint.requestBody;

    switch (method) {
      case 'get':
        return hasQueryParams
          ? `const response = await ${this.config.clientName}.get<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, params, config);`
          : `const response = await ${this.config.clientName}.get<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, undefined, config);`;
      
      case 'post':
        return hasRequestBody
          ? `const response = await ${this.config.clientName}.post<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, data, config);`
          : `const response = await ${this.config.clientName}.post<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, undefined, config);`;
      
      case 'put':
        return hasRequestBody
          ? `const response = await ${this.config.clientName}.put<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, data, config);`
          : `const response = await ${this.config.clientName}.put<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, undefined, config);`;
      
      case 'patch':
        return hasRequestBody
          ? `const response = await ${this.config.clientName}.patch<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, data, config);`
          : `const response = await ${this.config.clientName}.patch<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, undefined, config);`;
      
      case 'delete':
        return `const response = await ${this.config.clientName}.delete<${this.generateResponseTypeName(endpoint)}>(\`${urlPath}\`, config);`;
      
      default:
        return `const response = await ${this.config.clientName}.request<${this.generateResponseTypeName(endpoint)}>({ method: '${method.toUpperCase()}', url: \`${urlPath}\`, ...config });`;
    }
  }

  // 生成JSDoc注释
  private generateJSDoc(endpoint: APIEndpoint): string {
    const lines = [
      '/**',
      ` * ${endpoint.summary || endpoint.description}`,
    ];

    if (endpoint.description && endpoint.description !== endpoint.summary) {
      lines.push(` * ${endpoint.description}`);
    }

    // 添加参数文档
    if (endpoint.parameters) {
      endpoint.parameters.forEach(param => {
        if (param.in === 'path') {
          lines.push(` * @param ${param.name} ${param.description}`);
        }
      });

      if (endpoint.parameters.some(p => p.in === 'query')) {
        lines.push(` * @param params 查询参数`);
      }
    }

    if (endpoint.requestBody) {
      lines.push(` * @param data 请求数据`);
    }

    lines.push(` * @param config 请求配置`);
    lines.push(` * @returns Promise<${this.generateResponseTypeName(endpoint)}>`);

    if (endpoint.deprecated) {
      lines.push(` * @deprecated 此接口已废弃`);
    }

    lines.push(' */');

    return lines.join('\n');
  }

  // 生成类型文件
  private generateTypesFile(documentation: APIDocumentation, types: string[]): string {
    const header = `/**
 * API类型定义
 * 基于 ${documentation.title} v${documentation.version} 自动生成
 * 生成时间: ${new Date().toISOString()}
 */

import type { APIResponse } from '@/lib/api-client';
`;

    return header + '\n' + types.join('\n\n');
  }

  // 生成React Hooks文件
  private generateHooksFile(services: GeneratedService[]): string {
    const hooks: string[] = [];

    services.forEach(service => {
      // 生成数据获取Hook
      if (service.endpoint.method === 'GET') {
        hooks.push(this.generateDataHook(service));
      }

      // 生成变更Hook
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(service.endpoint.method)) {
        hooks.push(this.generateMutationHook(service));
      }
    });

    const header = `/**
 * API React Hooks
 * 基于React Query的数据获取和变更Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
`;

    const imports = services.map(s => 
      `import { ${s.functionName} } from './services';`
    ).join('\n');

    return header + '\n' + imports + '\n\n' + hooks.join('\n\n');
  }

  // 生成数据获取Hook
  private generateDataHook(service: GeneratedService): string {
    const hookName = `use${this.toPascalCase(service.name)}`;
    const queryKey = service.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    return `/**
 * ${service.endpoint.summary || service.endpoint.description}
 */
export const ${hookName} = (
  params?: Parameters<typeof ${service.functionName}>[0],
  options?: UseQueryOptions<Awaited<ReturnType<typeof ${service.functionName}>>>
) => {
  return useQuery({
    queryKey: ['${queryKey}', params],
    queryFn: () => ${service.functionName}(params),
    ...options,
  });
};`;
  }

  // 生成变更Hook
  private generateMutationHook(service: GeneratedService): string {
    const hookName = `use${this.toPascalCase(service.name)}Mutation`;

    return `/**
 * ${service.endpoint.summary || service.endpoint.description}
 */
export const ${hookName} = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof ${service.functionName}>>,
    Error,
    Parameters<typeof ${service.functionName}>
  >
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (args: Parameters<typeof ${service.functionName}>) => 
      ${service.functionName}(...args),
    onSuccess: () => {
      // 可以在这里添加成功后的缓存更新逻辑
      queryClient.invalidateQueries();
    },
    ...options,
  });
};`;
  }

  // 生成索引文件
  private generateIndexFile(services: GeneratedService[], imports: string[]): string {
    const serviceExports = services.map(s => s.functionName).join(',\n  ');
    const hookExports = services.map(s => {
      const hooks = [`use${this.toPascalCase(s.name)}`];
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(s.endpoint.method)) {
        hooks.push(`use${this.toPascalCase(s.name)}Mutation`);
      }
      return hooks.join(',\n  ');
    }).join(',\n  ');

    return `/**
 * API服务和Hooks导出
 */

// 服务函数
export {
  ${serviceExports}
} from './services';

// React Hooks
export {
  ${hookExports}
} from './hooks';

// 类型定义
export * from './types';`;
  }

  // 工具方法：转换为PascalCase
  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  // 工具方法：映射参数类型
  private mapParameterType(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'array': 'any[]',
      'object': 'Record<string, any>',
    };
    return typeMap[type] || 'any';
  }

  // 工具方法：映射属性类型
  private mapPropertyType(prop: PropertySchema): string {
    switch (prop.type) {
      case 'string':
        if (prop.enum) {
          return prop.enum.map(v => `'${v}'`).join(' | ');
        }
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        if (prop.items) {
          const itemType = this.mapPropertyType(prop.items);
          return `${itemType}[]`;
        }
        return 'any[]';
      case 'object':
        if (prop.properties) {
          const props = Object.entries(prop.properties).map(([key, value]) => {
            const optional = prop.required?.includes(key) ? '' : '?';
            const type = this.mapPropertyType(value);
            return `${key}${optional}: ${type}`;
          });
          return `{ ${props.join('; ')} }`;
        }
        return 'Record<string, any>';
      default:
        return 'any';
    }
  }
}

// 便捷函数
export const createServiceGenerator = (config?: ServiceGeneratorConfig): ServiceGenerator => {
  return new ServiceGenerator(config);
};

// 生成服务的便捷函数
export const generateAPIServices = (
  documentation: APIDocumentation,
  config?: ServiceGeneratorConfig
): ServiceGenerationResult => {
  const generator = new ServiceGenerator(config);
  return generator.generateServices(documentation);
};