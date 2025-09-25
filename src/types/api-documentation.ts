/**
 * API文档标准格式定义
 * 用于定义接口文档的标准结构和类型
 */

// 认证配置
export interface AuthConfig {
  type: 'bearer' | 'apiKey' | 'basic' | 'oauth2';
  headerName?: string;
  tokenPrefix?: string;
  description?: string;
}

// 参数定义
export interface Parameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body';
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  example?: any;
  enum?: string[];
  format?: string; // 如 'email', 'date', 'uuid' 等
  pattern?: string; // 正则表达式
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
}

// 请求体结构
export interface RequestBodySchema {
  contentType: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';
  schema: {
    type: 'object';
    properties: Record<string, PropertySchema>;
    required?: string[];
  };
  example?: any;
}

// 属性结构定义
export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
  example?: any;
  enum?: string[];
  format?: string;
  items?: PropertySchema; // 用于数组类型
  properties?: Record<string, PropertySchema>; // 用于对象类型
  required?: string[]; // 用于对象类型
}

// 响应结构
export interface ResponseSchema {
  statusCode: number;
  description: string;
  contentType: 'application/json' | 'text/plain' | 'text/html';
  schema?: {
    type: 'object' | 'array' | 'string' | 'number' | 'boolean';
    properties?: Record<string, PropertySchema>;
    items?: PropertySchema; // 用于数组响应
  };
  example?: any;
  headers?: Record<string, {
    type: string;
    description: string;
  }>;
}

// 错误响应格式
export interface ErrorResponseSchema {
  statusCode: number;
  errorCode?: string;
  message: string;
  details?: any;
  example?: any;
}

// API端点定义
export interface APIEndpoint {
  id: string; // 唯一标识符
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  path: string;
  summary: string; // 简短描述
  description: string; // 详细描述
  tags?: string[]; // 分类标签
  parameters?: Parameter[];
  requestBody?: RequestBodySchema;
  responses: ResponseSchema[];
  errorResponses?: ErrorResponseSchema[];
  deprecated?: boolean;
  examples: {
    request?: any;
    response?: any;
    curl?: string; // curl命令示例
  };
  // 性能和限制信息
  rateLimit?: {
    requests: number;
    period: string; // '1m', '1h', '1d' 等
  };
  timeout?: number; // 超时时间（毫秒）
}

// 完整的API文档结构
export interface APIDocumentation {
  // 基础信息
  title: string;
  version: string;
  description: string;
  baseURL: string;
  
  // 认证配置
  authentication?: AuthConfig;
  
  // 全局配置
  globalHeaders?: Record<string, string>;
  timeout?: number; // 全局超时设置
  
  // 端点列表
  endpoints: APIEndpoint[];
  
  // 数据模型定义
  models?: Record<string, ModelSchema>;
  
  // 环境配置
  environments?: {
    name: string;
    baseURL: string;
    description?: string;
  }[];
  
  // 文档元信息
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    contact?: {
      name: string;
      email: string;
      url?: string;
    };
  };
}

// 数据模型定义
export interface ModelSchema {
  name: string;
  description?: string;
  type: 'object';
  properties: Record<string, PropertySchema>;
  required?: string[];
  example?: any;
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

// 验证错误
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

// 验证警告
export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// 文档模板类型
export interface DocumentationTemplate {
  name: string;
  description: string;
  category: 'REST' | 'GraphQL' | 'WebSocket' | 'gRPC';
  template: Partial<APIDocumentation>;
  examples: {
    name: string;
    description: string;
    data: APIDocumentation;
  }[];
}

// 导入/导出格式
export type ImportFormat = 'openapi' | 'postman' | 'insomnia' | 'custom';
export type ExportFormat = 'typescript' | 'openapi' | 'postman' | 'markdown';

// 导入配置
export interface ImportConfig {
  format: ImportFormat;
  source: string | File;
  options?: {
    baseURL?: string;
    authConfig?: AuthConfig;
    includeExamples?: boolean;
  };
}

// 导出配置
export interface ExportConfig {
  format: ExportFormat;
  options?: {
    includeTypes?: boolean;
    includeExamples?: boolean;
    outputPath?: string;
    namespace?: string;
  };
}