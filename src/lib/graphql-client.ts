/**
 * GraphQL客户端
 * 基于APIClient扩展，提供GraphQL查询和变更支持
 */

import { APIClient, APIClientConfig, APIResponse } from './api-client';
import type { AuthConfig } from '@/types/api-documentation';

// GraphQL查询类型
export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

// GraphQL响应类型
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: Record<string, any>;
}

// GraphQL错误类型
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: Record<string, any>;
}

// GraphQL客户端配置
export interface GraphQLClientConfig extends Omit<APIClientConfig, 'baseURL'> {
  endpoint: string;
  subscriptionEndpoint?: string; // WebSocket端点用于订阅
  introspection?: boolean; // 是否启用内省查询
}

// GraphQL客户端类
export class GraphQLClient extends APIClient {
  private endpoint: string;
  private subscriptionEndpoint?: string;
  private introspection: boolean;

  constructor(config: GraphQLClientConfig) {
    // 将GraphQL端点作为baseURL传递给父类
    super({
      ...config,
      baseURL: config.endpoint,
    });

    this.endpoint = config.endpoint;
    this.subscriptionEndpoint = config.subscriptionEndpoint;
    this.introspection = config.introspection ?? false;
  }

  // 执行GraphQL查询
  async query<T = any>(
    query: string,
    variables?: Record<string, any>,
    operationName?: string
  ): Promise<GraphQLResponse<T>> {
    const graphqlQuery: GraphQLQuery = {
      query,
      variables,
      operationName,
    };

    try {
      const response = await this.post<GraphQLResponse<T>>('', graphqlQuery);
      
      // 检查GraphQL错误
      if (response.data.errors && response.data.errors.length > 0) {
        console.warn('GraphQL Errors:', response.data.errors);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 执行GraphQL变更
  async mutate<T = any>(
    mutation: string,
    variables?: Record<string, any>,
    operationName?: string
  ): Promise<GraphQLResponse<T>> {
    return this.query<T>(mutation, variables, operationName);
  }

  // 批量查询
  async batchQuery<T = any>(queries: GraphQLQuery[]): Promise<GraphQLResponse<T>[]> {
    try {
      const response = await this.post<GraphQLResponse<T>[]>('', queries);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 获取Schema（内省查询）
  async getSchema(): Promise<any> {
    if (!this.introspection) {
      throw new Error('Introspection is disabled for this client');
    }

    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          queryType { name }
          mutationType { name }
          subscriptionType { name }
          types {
            ...FullType
          }
          directives {
            name
            description
            locations
            args {
              ...InputValue
            }
          }
        }
      }

      fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }

      fragment InputValue on __InputValue {
        name
        description
        type { ...TypeRef }
        defaultValue
      }

      fragment TypeRef on __Type {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.query(introspectionQuery);
    return result.data?.__schema;
  }

  // 验证查询语法
  validateQuery(query: string): boolean {
    try {
      // 简单的语法检查
      const trimmed = query.trim();
      return (
        (trimmed.startsWith('query') || 
         trimmed.startsWith('mutation') || 
         trimmed.startsWith('subscription') ||
         trimmed.startsWith('{')) &&
        trimmed.includes('{') &&
        trimmed.includes('}')
      );
    } catch {
      return false;
    }
  }

  // 格式化GraphQL查询
  formatQuery(query: string): string {
    // 简单的格式化，移除多余空白
    return query
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, ' { ')
      .replace(/\s*}\s*/g, ' } ')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ') ')
      .trim();
  }

  // 构建查询字符串
  buildQuery(
    operation: 'query' | 'mutation' | 'subscription',
    name: string,
    fields: string[],
    variables?: Record<string, string>
  ): string {
    const variablesDef = variables 
      ? `(${Object.entries(variables).map(([key, type]) => `$${key}: ${type}`).join(', ')})`
      : '';
    
    const fieldsStr = fields.join('\n    ');
    
    return `
      ${operation} ${name}${variablesDef} {
        ${fieldsStr}
      }
    `.trim();
  }

  // 构建变更查询
  buildMutation(
    name: string,
    input: Record<string, string>,
    returnFields: string[]
  ): string {
    const inputDef = Object.entries(input)
      .map(([key, type]) => `$${key}: ${type}`)
      .join(', ');
    
    const inputArgs = Object.keys(input)
      .map(key => `${key}: $${key}`)
      .join(', ');
    
    const returnFieldsStr = returnFields.join('\n      ');
    
    return `
      mutation ${name}(${inputDef}) {
        ${name}(${inputArgs}) {
          ${returnFieldsStr}
        }
      }
    `.trim();
  }
}

// GraphQL客户端工厂
export class GraphQLClientFactory {
  private static instance: GraphQLClientFactory;
  private clients: Map<string, GraphQLClient> = new Map();

  private constructor() {}

  static getInstance(): GraphQLClientFactory {
    if (!GraphQLClientFactory.instance) {
      GraphQLClientFactory.instance = new GraphQLClientFactory();
    }
    return GraphQLClientFactory.instance;
  }

  // 创建GraphQL客户端
  createClient(
    name: string,
    endpoint: string,
    config?: Partial<GraphQLClientConfig>
  ): GraphQLClient {
    if (this.clients.has(name)) {
      return this.clients.get(name)!;
    }

    const clientConfig: GraphQLClientConfig = {
      endpoint,
      timeout: 15000,
      retries: 2,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config,
    };

    const client = new GraphQLClient(clientConfig);
    this.clients.set(name, client);
    
    return client;
  }

  // 获取客户端
  getClient(name: string): GraphQLClient | undefined {
    return this.clients.get(name);
  }

  // 删除客户端
  removeClient(name: string): boolean {
    return this.clients.delete(name);
  }

  // 列出所有客户端
  listClients(): string[] {
    return Array.from(this.clients.keys());
  }

  // 清除所有客户端
  clearClients(): void {
    this.clients.clear();
  }
}

// 便捷函数
export const graphqlClientFactory = GraphQLClientFactory.getInstance();

// 创建GraphQL客户端的便捷函数
export const createGraphQLClient = (
  name: string,
  endpoint: string,
  config?: Partial<GraphQLClientConfig>
): GraphQLClient => {
  return graphqlClientFactory.createClient(name, endpoint, config);
};

// 常用GraphQL查询构建器
export class GraphQLQueryBuilder {
  private operation: 'query' | 'mutation' | 'subscription' = 'query';
  private operationName?: string;
  private variables: Record<string, string> = {};
  private fields: string[] = [];

  // 设置操作类型
  setOperation(operation: 'query' | 'mutation' | 'subscription'): this {
    this.operation = operation;
    return this;
  }

  // 设置操作名称
  setName(name: string): this {
    this.operationName = name;
    return this;
  }

  // 添加变量
  addVariable(name: string, type: string): this {
    this.variables[name] = type;
    return this;
  }

  // 添加字段
  addField(field: string): this {
    this.fields.push(field);
    return this;
  }

  // 添加多个字段
  addFields(fields: string[]): this {
    this.fields.push(...fields);
    return this;
  }

  // 构建查询
  build(): string {
    const variablesDef = Object.keys(this.variables).length > 0
      ? `(${Object.entries(this.variables).map(([key, type]) => `$${key}: ${type}`).join(', ')})`
      : '';
    
    const name = this.operationName || '';
    const fieldsStr = this.fields.join('\n    ');
    
    return `
      ${this.operation} ${name}${variablesDef} {
        ${fieldsStr}
      }
    `.trim();
  }

  // 重置构建器
  reset(): this {
    this.operation = 'query';
    this.operationName = undefined;
    this.variables = {};
    this.fields = [];
    return this;
  }
}

// 创建查询构建器的便捷函数
export const createQueryBuilder = (): GraphQLQueryBuilder => {
  return new GraphQLQueryBuilder();
};