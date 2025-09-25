/**
 * API文档模板和用户指导系统
 * 提供标准化的接口文档模板和示例
 */

import {
  APIDocumentation,
  APIEndpoint,
  DocumentationTemplate,
  AuthConfig,
  Parameter,
  RequestBodySchema,
  ResponseSchema
} from '@/types/api-documentation';

/**
 * 基础REST API模板
 */
export const REST_API_TEMPLATE: DocumentationTemplate = {
  name: 'REST API 标准模板',
  description: '适用于标准REST API的文档模板',
  category: 'REST',
  template: {
    title: '我的API',
    version: '1.0.0',
    description: 'API描述信息',
    baseURL: 'https://api.example.com',
    authentication: {
      type: 'bearer',
      tokenPrefix: 'Bearer',
      description: 'JWT Token认证'
    },
    endpoints: [],
    environments: [
      {
        name: '开发环境',
        baseURL: 'https://dev-api.example.com',
        description: '开发测试环境'
      },
      {
        name: '生产环境',
        baseURL: 'https://api.example.com',
        description: '正式生产环境'
      }
    ]
  },
  examples: [
    {
      name: '用户管理API',
      description: '完整的用户CRUD操作示例',
      data: {
        title: '用户管理API',
        version: '1.0.0',
        description: '提供用户注册、登录、信息管理等功能',
        baseURL: 'https://api.example.com',
        authentication: {
          type: 'bearer',
          tokenPrefix: 'Bearer',
          description: 'JWT Token认证，在请求头中添加 Authorization: Bearer <token>'
        },
        endpoints: [
          {
            id: 'get-users',
            name: '获取用户列表',
            method: 'GET',
            path: '/users',
            summary: '分页获取用户列表',
            description: '获取系统中的用户列表，支持分页和搜索',
            tags: ['用户管理'],
            parameters: [
              {
                name: 'page',
                in: 'query',
                required: false,
                type: 'number',
                description: '页码，从1开始',
                example: 1,
                minimum: 1
              },
              {
                name: 'pageSize',
                in: 'query',
                required: false,
                type: 'number',
                description: '每页数量',
                example: 10,
                minimum: 1,
                maximum: 100
              },
              {
                name: 'search',
                in: 'query',
                required: false,
                type: 'string',
                description: '搜索关键词',
                example: 'john'
              }
            ],
            responses: [
              {
                statusCode: 200,
                description: '成功获取用户列表',
                contentType: 'application/json',
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', description: '用户ID' },
                          name: { type: 'string', description: '用户名' },
                          email: { type: 'string', description: '邮箱' },
                          avatar: { type: 'string', description: '头像URL' },
                          createdAt: { type: 'string', description: '创建时间' }
                        }
                      }
                    },
                    total: { type: 'number', description: '总数量' },
                    page: { type: 'number', description: '当前页码' },
                    pageSize: { type: 'number', description: '每页数量' }
                  }
                },
                example: {
                  data: [
                    {
                      id: 1,
                      name: 'John Doe',
                      email: 'john@example.com',
                      avatar: 'https://example.com/avatar1.jpg',
                      createdAt: '2024-01-01T00:00:00Z'
                    }
                  ],
                  total: 1,
                  page: 1,
                  pageSize: 10
                }
              }
            ],
            examples: {
              request: null,
              response: {
                data: [
                  {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    avatar: 'https://example.com/avatar1.jpg',
                    createdAt: '2024-01-01T00:00:00Z'
                  }
                ],
                total: 1,
                page: 1,
                pageSize: 10
              },
              curl: 'curl -X GET "https://api.example.com/users?page=1&pageSize=10" -H "Authorization: Bearer <token>"'
            }
          },
          {
            id: 'create-user',
            name: '创建用户',
            method: 'POST',
            path: '/users',
            summary: '创建新用户',
            description: '创建一个新的用户账户',
            tags: ['用户管理'],
            requestBody: {
              contentType: 'application/json',
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: '用户名' },
                  email: { type: 'string', description: '邮箱地址' },
                  password: { type: 'string', description: '密码' }
                },
                required: ['name', 'email', 'password']
              },
              example: {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'securePassword123'
              }
            },
            responses: [
              {
                statusCode: 201,
                description: '用户创建成功',
                contentType: 'application/json',
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: '用户ID' },
                    name: { type: 'string', description: '用户名' },
                    email: { type: 'string', description: '邮箱' },
                    createdAt: { type: 'string', description: '创建时间' }
                  }
                },
                example: {
                  id: 2,
                  name: 'Jane Doe',
                  email: 'jane@example.com',
                  createdAt: '2024-01-02T00:00:00Z'
                }
              }
            ],
            errorResponses: [
              {
                statusCode: 400,
                errorCode: 'VALIDATION_ERROR',
                message: '请求参数验证失败',
                example: {
                  error: 'VALIDATION_ERROR',
                  message: '邮箱格式不正确',
                  details: {
                    field: 'email',
                    value: 'invalid-email'
                  }
                }
              },
              {
                statusCode: 409,
                errorCode: 'EMAIL_EXISTS',
                message: '邮箱已存在',
                example: {
                  error: 'EMAIL_EXISTS',
                  message: '该邮箱已被注册'
                }
              }
            ],
            examples: {
              request: {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'securePassword123'
              },
              response: {
                id: 2,
                name: 'Jane Doe',
                email: 'jane@example.com',
                createdAt: '2024-01-02T00:00:00Z'
              },
              curl: 'curl -X POST "https://api.example.com/users" -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d \'{"name":"Jane Doe","email":"jane@example.com","password":"securePassword123"}\''
            }
          }
        ],
        models: {
          User: {
            name: 'User',
            description: '用户数据模型',
            type: 'object',
            properties: {
              id: { type: 'number', description: '用户唯一标识' },
              name: { type: 'string', description: '用户姓名' },
              email: { type: 'string', description: '邮箱地址', format: 'email' },
              avatar: { type: 'string', description: '头像URL', format: 'url' },
              createdAt: { type: 'string', description: '创建时间', format: 'date-time' },
              updatedAt: { type: 'string', description: '更新时间', format: 'date-time' }
            },
            required: ['id', 'name', 'email', 'createdAt'],
            example: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://example.com/avatar.jpg',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          }
        }
      }
    }
  ]
};

/**
 * 常用认证配置模板
 */
export const AUTH_TEMPLATES: Record<string, AuthConfig> = {
  bearer: {
    type: 'bearer',
    tokenPrefix: 'Bearer',
    description: 'JWT Token认证，在请求头中添加 Authorization: Bearer <token>'
  },
  apiKey: {
    type: 'apiKey',
    headerName: 'X-API-Key',
    description: 'API Key认证，在请求头中添加 X-API-Key: <your-api-key>'
  },
  basic: {
    type: 'basic',
    description: 'Basic认证，使用用户名和密码进行Base64编码'
  }
};

/**
 * 常用端点模板
 */
export const ENDPOINT_TEMPLATES: Record<string, Partial<APIEndpoint>> = {
  // GET列表
  getList: {
    method: 'GET',
    summary: '获取资源列表',
    description: '分页获取资源列表，支持搜索和过滤',
    parameters: [
      {
        name: 'page',
        in: 'query',
        required: false,
        type: 'number',
        description: '页码，从1开始',
        example: 1,
        minimum: 1
      },
      {
        name: 'pageSize',
        in: 'query',
        required: false,
        type: 'number',
        description: '每页数量',
        example: 10,
        minimum: 1,
        maximum: 100
      }
    ],
    responses: [
      {
        statusCode: 200,
        description: '成功获取列表',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { type: 'object' } },
            total: { type: 'number' },
            page: { type: 'number' },
            pageSize: { type: 'number' }
          }
        }
      }
    ]
  },

  // GET详情
  getDetail: {
    method: 'GET',
    summary: '获取资源详情',
    description: '根据ID获取单个资源的详细信息',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'number',
        description: '资源ID',
        example: 1
      }
    ],
    responses: [
      {
        statusCode: 200,
        description: '成功获取详情',
        contentType: 'application/json',
        schema: { type: 'object' }
      },
      {
        statusCode: 404,
        description: '资源不存在',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    ]
  },

  // POST创建
  create: {
    method: 'POST',
    summary: '创建资源',
    description: '创建一个新的资源',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    responses: [
      {
        statusCode: 201,
        description: '创建成功',
        contentType: 'application/json',
        schema: { type: 'object' }
      },
      {
        statusCode: 400,
        description: '请求参数错误',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
    ]
  },

  // PUT更新
  update: {
    method: 'PUT',
    summary: '更新资源',
    description: '根据ID更新资源信息',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'number',
        description: '资源ID',
        example: 1
      }
    ],
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    responses: [
      {
        statusCode: 200,
        description: '更新成功',
        contentType: 'application/json',
        schema: { type: 'object' }
      },
      {
        statusCode: 404,
        description: '资源不存在',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    ]
  },

  // DELETE删除
  delete: {
    method: 'DELETE',
    summary: '删除资源',
    description: '根据ID删除资源',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'number',
        description: '资源ID',
        example: 1
      }
    ],
    responses: [
      {
        statusCode: 204,
        description: '删除成功',
        contentType: 'application/json'
      },
      {
        statusCode: 404,
        description: '资源不存在',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    ]
  }
};

/**
 * 用户指导类
 */
export class APIDocumentationGuide {
  /**
   * 获取文档编写指南
   */
  static getWritingGuide(): string {
    return `
# API文档编写指南

## 1. 基础信息
- **标题**: 简洁明了的API名称
- **版本**: 使用语义化版本号（如 1.0.0）
- **描述**: 详细说明API的用途和功能
- **基础URL**: API的根地址

## 2. 认证配置
选择合适的认证方式：
- **Bearer Token**: 适用于JWT等token认证
- **API Key**: 适用于简单的API密钥认证
- **Basic Auth**: 适用于用户名密码认证

## 3. 端点定义
每个端点应包含：
- **唯一ID**: 用于标识端点
- **名称**: 端点的简短名称
- **HTTP方法**: GET、POST、PUT、DELETE等
- **路径**: API端点路径
- **描述**: 详细说明端点功能
- **参数**: 查询参数、路径参数、请求头等
- **请求体**: POST/PUT请求的数据结构
- **响应**: 各种状态码的响应格式
- **示例**: 请求和响应的具体示例

## 4. 数据模型
定义复用的数据结构：
- **模型名称**: 清晰的模型名称
- **属性定义**: 每个属性的类型和描述
- **必需字段**: 标明哪些字段是必需的
- **示例数据**: 提供完整的示例

## 5. 最佳实践
- 使用一致的命名规范
- 提供详细的错误响应
- 包含完整的示例数据
- 定义清晰的数据类型
- 添加适当的验证规则
    `;
  }

  /**
   * 获取常见问题解答
   */
  static getFAQ(): Array<{ question: string; answer: string }> {
    return [
      {
        question: '如何定义路径参数？',
        answer: '在路径中使用花括号包围参数名，如 /users/{id}，然后在parameters中定义该参数，设置 in: "path"'
      },
      {
        question: '如何处理分页？',
        answer: '通常使用 page 和 pageSize 查询参数，响应中包含 total、page、pageSize 等分页信息'
      },
      {
        question: '如何定义数组类型的响应？',
        answer: '设置 schema.type 为 "array"，并在 items 中定义数组元素的结构'
      },
      {
        question: '如何处理文件上传？',
        answer: '使用 multipart/form-data 内容类型，在 requestBody 中定义文件字段'
      },
      {
        question: '如何定义可选参数？',
        answer: '在参数定义中设置 required: false'
      },
      {
        question: '如何添加参数验证？',
        answer: '使用 minimum、maximum、minLength、maxLength、pattern 等字段定义验证规则'
      }
    ];
  }

  /**
   * 获取检查清单
   */
  static getChecklist(): Array<{ category: string; items: string[] }> {
    return [
      {
        category: '基础信息',
        items: [
          '✓ 填写了API标题和描述',
          '✓ 设置了正确的版本号',
          '✓ 配置了基础URL',
          '✓ 选择了合适的认证方式'
        ]
      },
      {
        category: '端点定义',
        items: [
          '✓ 每个端点都有唯一ID',
          '✓ 设置了正确的HTTP方法',
          '✓ 路径格式正确（以/开头）',
          '✓ 定义了所有路径参数',
          '✓ 包含了成功和错误响应',
          '✓ 提供了请求和响应示例'
        ]
      },
      {
        category: '数据结构',
        items: [
          '✓ 定义了清晰的数据类型',
          '✓ 标明了必需字段',
          '✓ 添加了字段描述',
          '✓ 提供了示例数据',
          '✓ 设置了合适的验证规则'
        ]
      },
      {
        category: '文档质量',
        items: [
          '✓ 描述信息详细准确',
          '✓ 示例数据完整有效',
          '✓ 错误处理覆盖全面',
          '✓ 命名规范一致',
          '✓ 通过了验证检查'
        ]
      }
    ];
  }

  /**
   * 生成端点模板
   */
  static generateEndpointTemplate(
    type: 'getList' | 'getDetail' | 'create' | 'update' | 'delete',
    resourceName: string
  ): Partial<APIEndpoint> {
    const template = { ...ENDPOINT_TEMPLATES[type] };
    const resourcePath = resourceName.toLowerCase();
    
    switch (type) {
      case 'getList':
        template.id = `get-${resourcePath}-list`;
        template.name = `获取${resourceName}列表`;
        template.path = `/${resourcePath}`;
        break;
      case 'getDetail':
        template.id = `get-${resourcePath}-detail`;
        template.name = `获取${resourceName}详情`;
        template.path = `/${resourcePath}/{id}`;
        break;
      case 'create':
        template.id = `create-${resourcePath}`;
        template.name = `创建${resourceName}`;
        template.path = `/${resourcePath}`;
        break;
      case 'update':
        template.id = `update-${resourcePath}`;
        template.name = `更新${resourceName}`;
        template.path = `/${resourcePath}/{id}`;
        break;
      case 'delete':
        template.id = `delete-${resourcePath}`;
        template.name = `删除${resourceName}`;
        template.path = `/${resourcePath}/{id}`;
        break;
    }

    return template;
  }

  /**
   * 获取示例文档
   */
  static getExampleDocumentation(): APIDocumentation {
    return REST_API_TEMPLATE.examples[0].data;
  }
}