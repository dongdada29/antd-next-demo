/**
 * TypeScript类型生成器
 * 基于API接口文档自动生成TypeScript类型定义
 */

import type { APIDocumentation, APIEndpoint, ResponseSchema, Parameter } from '@/types/api-documentation';

export interface GeneratedTypes {
  interfaces: string[];
  enums: string[];
  unions: string[];
  imports: string[];
}

export class TypeGenerator {
  private generatedTypes = new Set<string>();
  private imports = new Set<string>();

  /**
   * 基于API文档生成所有类型定义
   */
  generateTypes(documentation: APIDocumentation): GeneratedTypes {
    this.generatedTypes.clear();
    this.imports.clear();

    const interfaces: string[] = [];
    const enums: string[] = [];
    const unions: string[] = [];

    // 为每个端点生成类型
    documentation.endpoints.forEach(endpoint => {
      // 生成请求参数类型
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        const paramsInterface = this.generateParametersInterface(endpoint);
        if (paramsInterface) {
          interfaces.push(paramsInterface);
        }
      }

      // 生成请求体类型
      if (endpoint.requestBody) {
        const requestInterface = this.generateRequestBodyInterface(endpoint);
        if (requestInterface) {
          interfaces.push(requestInterface);
        }
      }

      // 生成响应类型
      endpoint.responses.forEach(response => {
        const responseInterface = this.generateResponseInterface(endpoint, response);
        if (responseInterface) {
          interfaces.push(responseInterface);
        }
      });
    });

    return {
      interfaces,
      enums,
      unions,
      imports: Array.from(this.imports)
    };
  }

  /**
   * 生成参数接口
   */
  private generateParametersInterface(endpoint: APIEndpoint): string | null {
    const interfaceName = this.toPascalCase(`${endpoint.name}Params`);
    
    if (this.generatedTypes.has(interfaceName)) {
      return null;
    }

    const properties: string[] = [];
    
    endpoint.parameters?.forEach(param => {
      const optional = param.required ? '' : '?';
      const type = this.mapTypeScriptType(param.type);
      const comment = param.description ? `  /** ${param.description} */\n` : '';
      
      properties.push(`${comment}  ${param.name}${optional}: ${type};`);
    });

    if (properties.length === 0) {
      return null;
    }

    this.generatedTypes.add(interfaceName);

    return `export interface ${interfaceName} {
${properties.join('\n')}
}`;
  }

  /**
   * 生成请求体接口
   */
  private generateRequestBodyInterface(endpoint: APIEndpoint): string | null {
    const interfaceName = this.toPascalCase(`${endpoint.name}Request`);
    
    if (this.generatedTypes.has(interfaceName) || !endpoint.requestBody) {
      return null;
    }

    const properties = this.generatePropertiesFromSchema(endpoint.requestBody.schema);
    
    if (properties.length === 0) {
      return null;
    }

    this.generatedTypes.add(interfaceName);

    return `export interface ${interfaceName} {
${properties.join('\n')}
}`;
  }

  /**
   * 生成响应接口
   */
  private generateResponseInterface(endpoint: APIEndpoint, response: ResponseSchema): string | null {
    const interfaceName = this.toPascalCase(`${endpoint.name}Response`);
    
    if (this.generatedTypes.has(interfaceName)) {
      return null;
    }

    const properties = this.generatePropertiesFromSchema(response.schema);
    
    if (properties.length === 0) {
      return null;
    }

    this.generatedTypes.add(interfaceName);

    return `export interface ${interfaceName} {
${properties.join('\n')}
}`;
  }

  /**
   * 从schema生成属性定义
   */
  private generatePropertiesFromSchema(schema: any): string[] {
    const properties: string[] = [];

    if (!schema || !schema.properties) {
      return properties;
    }

    Object.entries(schema.properties).forEach(([key, value]: [string, any]) => {
      const optional = schema.required?.includes(key) ? '' : '?';
      const type = this.mapSchemaToTypeScript(value);
      const comment = value.description ? `  /** ${value.description} */\n` : '';
      
      properties.push(`${comment}  ${key}${optional}: ${type};`);
    });

    return properties;
  }

  /**
   * 将schema类型映射为TypeScript类型
   */
  private mapSchemaToTypeScript(schema: any): string {
    if (!schema) return 'any';

    switch (schema.type) {
      case 'string':
        if (schema.enum) {
          return schema.enum.map((v: string) => `'${v}'`).join(' | ');
        }
        if (schema.format === 'date-time') {
          return 'string'; // 或者使用 Date 类型
        }
        return 'string';
      
      case 'number':
      case 'integer':
        return 'number';
      
      case 'boolean':
        return 'boolean';
      
      case 'array':
        if (schema.items) {
          const itemType = this.mapSchemaToTypeScript(schema.items);
          return `${itemType}[]`;
        }
        return 'any[]';
      
      case 'object':
        if (schema.properties) {
          // 生成内联对象类型
          const props = Object.entries(schema.properties).map(([key, value]: [string, any]) => {
            const optional = schema.required?.includes(key) ? '' : '?';
            const type = this.mapSchemaToTypeScript(value);
            return `${key}${optional}: ${type}`;
          });
          return `{ ${props.join('; ')} }`;
        }
        return 'Record<string, any>';
      
      default:
        return 'any';
    }
  }

  /**
   * 映射基础类型到TypeScript类型
   */
  private mapTypeScriptType(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
      case 'float':
      case 'double':
        return 'number';
      case 'boolean':
      case 'bool':
        return 'boolean';
      case 'array':
        return 'any[]';
      case 'object':
        return 'Record<string, any>';
      default:
        return 'any';
    }
  }

  /**
   * 生成枚举类型
   */
  generateEnum(name: string, values: string[]): string {
    const enumName = this.toPascalCase(name);
    
    if (this.generatedTypes.has(enumName)) {
      return '';
    }

    this.generatedTypes.add(enumName);

    const enumValues = values.map(value => {
      const key = this.toConstantCase(value);
      return `  ${key} = '${value}'`;
    }).join(',\n');

    return `export enum ${enumName} {
${enumValues}
}`;
  }

  /**
   * 生成联合类型
   */
  generateUnion(name: string, types: string[]): string {
    const unionName = this.toPascalCase(name);
    
    if (this.generatedTypes.has(unionName)) {
      return '';
    }

    this.generatedTypes.add(unionName);

    return `export type ${unionName} = ${types.join(' | ')};`;
  }

  /**
   * 生成通用分页响应类型
   */
  generatePaginatedResponse(): string {
    const typeName = 'PaginatedResponse';
    
    if (this.generatedTypes.has(typeName)) {
      return '';
    }

    this.generatedTypes.add(typeName);

    return `export interface PaginatedResponse<T> {
  /** 数据列表 */
  data: T[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页大小 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}`;
  }

  /**
   * 生成API响应包装类型
   */
  generateAPIResponse(): string {
    const typeName = 'APIResponse';
    
    if (this.generatedTypes.has(typeName)) {
      return '';
    }

    this.generatedTypes.add(typeName);

    return `export interface APIResponse<T = any> {
  /** 响应数据 */
  data: T;
  /** 状态码 */
  status: number;
  /** 响应消息 */
  message?: string;
  /** 响应头 */
  headers?: Headers;
}`;
  }

  /**
   * 转换为PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
      .replace(/^(.)/, char => char.toUpperCase());
  }

  /**
   * 转换为常量命名格式
   */
  private toConstantCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[-\s]+/g, '_')
      .toUpperCase();
  }

  /**
   * 生成完整的类型文件内容
   */
  generateTypeFile(documentation: APIDocumentation): string {
    const types = this.generateTypes(documentation);
    
    const content: string[] = [];
    
    // 添加文件头注释
    content.push('/**');
    content.push(' * 自动生成的API类型定义');
    content.push(' * 请勿手动修改此文件');
    content.push(' */');
    content.push('');

    // 添加导入语句
    if (types.imports.length > 0) {
      types.imports.forEach(importStatement => {
        content.push(importStatement);
      });
      content.push('');
    }

    // 添加通用类型
    content.push(this.generateAPIResponse());
    content.push('');
    content.push(this.generatePaginatedResponse());
    content.push('');

    // 添加枚举
    if (types.enums.length > 0) {
      content.push('// 枚举类型');
      types.enums.forEach(enumDef => {
        content.push(enumDef);
        content.push('');
      });
    }

    // 添加联合类型
    if (types.unions.length > 0) {
      content.push('// 联合类型');
      types.unions.forEach(unionDef => {
        content.push(unionDef);
        content.push('');
      });
    }

    // 添加接口
    if (types.interfaces.length > 0) {
      content.push('// 接口定义');
      types.interfaces.forEach(interfaceDef => {
        content.push(interfaceDef);
        content.push('');
      });
    }

    return content.join('\n');
  }
}

// 导出单例实例
export const typeGenerator = new TypeGenerator();