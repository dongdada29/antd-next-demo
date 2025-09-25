/**
 * 类型生成器工具函数
 * 提供便捷的类型生成和文件操作功能
 */

import { typeGenerator } from './type-generator';
import type { APIDocumentation } from '@/types/api-documentation';

/**
 * 生成类型文件并保存到指定路径
 */
export async function generateTypesFile(
  documentation: APIDocumentation,
  outputPath: string = 'src/types/generated-api-types.ts'
): Promise<string> {
  const typeContent = typeGenerator.generateTypeFile(documentation);
  
  // 在实际应用中，这里会写入文件系统
  // 现在返回内容供调用者处理
  return typeContent;
}

/**
 * 验证生成的类型是否有效
 */
export function validateGeneratedTypes(typeContent: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 基本语法检查
  if (!typeContent.includes('export interface') && !typeContent.includes('export type')) {
    errors.push('生成的内容中没有找到导出的类型定义');
  }
  
  // 检查是否有重复的接口名
  const interfaceMatches = typeContent.match(/export interface (\w+)/g);
  if (interfaceMatches) {
    const interfaceNames = interfaceMatches.map(match => match.replace('export interface ', ''));
    const duplicates = interfaceNames.filter((name, index) => interfaceNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`发现重复的接口名: ${duplicates.join(', ')}`);
    }
  }
  
  // 检查基本的TypeScript语法
  const syntaxErrors = [];
  if (typeContent.includes('interface {')) {
    syntaxErrors.push('接口定义缺少名称');
  }
  if (typeContent.includes(': ;')) {
    syntaxErrors.push('属性定义缺少类型');
  }
  
  errors.push(...syntaxErrors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 从API文档生成服务函数的类型定义
 */
export function generateServiceTypes(documentation: APIDocumentation): string {
  const serviceTypes: string[] = [];
  
  // 生成服务函数的参数和返回类型
  documentation.endpoints.forEach(endpoint => {
    const functionName = toCamelCase(endpoint.name);
    const paramsType = endpoint.parameters?.length ? `${toPascalCase(endpoint.name)}Params` : 'void';
    const requestType = endpoint.requestBody ? `${toPascalCase(endpoint.name)}Request` : 'void';
    const responseType = `${toPascalCase(endpoint.name)}Response`;
    
    // 生成服务函数类型
    let functionSignature = '';
    if (endpoint.parameters?.length && endpoint.requestBody) {
      functionSignature = `export declare function ${functionName}(params: ${paramsType}, data: ${requestType}): Promise<APIResponse<${responseType}>>;`;
    } else if (endpoint.parameters?.length) {
      functionSignature = `export declare function ${functionName}(params: ${paramsType}): Promise<APIResponse<${responseType}>>;`;
    } else if (endpoint.requestBody) {
      functionSignature = `export declare function ${functionName}(data: ${requestType}): Promise<APIResponse<${responseType}>>;`;
    } else {
      functionSignature = `export declare function ${functionName}(): Promise<APIResponse<${responseType}>>;`;
    }
    
    serviceTypes.push(`/** ${endpoint.description} */`);
    serviceTypes.push(functionSignature);
    serviceTypes.push('');
  });
  
  return serviceTypes.join('\n');
}

/**
 * 生成React Hook的类型定义
 */
export function generateHookTypes(documentation: APIDocumentation): string {
  const hookTypes: string[] = [];
  
  // 添加通用Hook类型
  hookTypes.push(`export interface UseQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}`);
  hookTypes.push('');
  
  hookTypes.push(`export interface UseMutationResult<T, V = any> {
  mutate: (variables: V) => Promise<T>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}`);
  hookTypes.push('');
  
  // 为每个端点生成Hook类型
  documentation.endpoints.forEach(endpoint => {
    const hookName = `use${toPascalCase(endpoint.name)}`;
    const responseType = `${toPascalCase(endpoint.name)}Response`;
    
    if (endpoint.method === 'GET') {
      // 查询Hook
      const paramsType = endpoint.parameters?.length ? `${toPascalCase(endpoint.name)}Params` : 'void';
      const hookSignature = endpoint.parameters?.length 
        ? `export declare function ${hookName}(params: ${paramsType}): UseQueryResult<${responseType}>;`
        : `export declare function ${hookName}(): UseQueryResult<${responseType}>;`;
      
      hookTypes.push(`/** ${endpoint.description} */`);
      hookTypes.push(hookSignature);
    } else {
      // 变更Hook
      const requestType = endpoint.requestBody ? `${toPascalCase(endpoint.name)}Request` : 'void';
      const hookSignature = `export declare function ${hookName}(): UseMutationResult<${responseType}, ${requestType}>;`;
      
      hookTypes.push(`/** ${endpoint.description} */`);
      hookTypes.push(hookSignature);
    }
    
    hookTypes.push('');
  });
  
  return hookTypes.join('\n');
}

/**
 * 生成完整的类型定义包（包含接口、服务、Hook类型）
 */
export function generateCompleteTypePackage(documentation: APIDocumentation): {
  interfaces: string;
  services: string;
  hooks: string;
  combined: string;
} {
  const interfaces = typeGenerator.generateTypeFile(documentation);
  const services = generateServiceTypes(documentation);
  const hooks = generateHookTypes(documentation);
  
  const combined = [
    '/**',
    ' * 完整的API类型定义包',
    ' * 包含接口定义、服务函数类型和React Hook类型',
    ' * 自动生成，请勿手动修改',
    ' */',
    '',
    '// ==================== 接口定义 ====================',
    interfaces,
    '',
    '// ==================== 服务函数类型 ====================',
    services,
    '',
    '// ==================== React Hook类型 ====================',
    hooks
  ].join('\n');
  
  return {
    interfaces,
    services,
    hooks,
    combined
  };
}

/**
 * 工具函数：转换为PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^(.)/, char => char.toUpperCase());
}

/**
 * 工具函数：转换为camelCase
 */
function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^(.)/, char => char.toLowerCase());
}