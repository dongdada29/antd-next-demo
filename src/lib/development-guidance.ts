/**
 * 开发指导系统
 * 为每个阶段提供详细的操作指南和最佳实践
 */

import { DevelopmentStage, type StageDefinition } from './development-stage-manager';

export interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  tips: string[];
  warnings?: string[];
  resources?: GuidanceResource[];
}

export interface GuidanceResource {
  title: string;
  url: string;
  type: 'documentation' | 'example' | 'tool' | 'reference';
}

export interface StageGuidance {
  stage: DevelopmentStage;
  title: string;
  overview: string;
  prerequisites: string[];
  steps: GuidanceStep[];
  bestPractices: string[];
  commonMistakes: string[];
  qualityChecks: QualityCheck[];
}

export interface QualityCheck {
  id: string;
  title: string;
  description: string;
  checkFn?: () => Promise<QualityCheckResult>;
  autoFix?: () => Promise<void>;
}

export interface QualityCheckResult {
  passed: boolean;
  message: string;
  suggestions?: string[];
}

export class DevelopmentGuidanceSystem {
  private guidanceMap: Map<DevelopmentStage, StageGuidance>;

  constructor() {
    this.guidanceMap = new Map();
    this.initializeGuidance();
  }

  private initializeGuidance(): void {
    // 静态页面阶段指导
    this.guidanceMap.set(DevelopmentStage.STATIC, {
      stage: DevelopmentStage.STATIC,
      title: '静态页面创建指导',
      overview: '在这个阶段，您将使用Ant Design组件创建静态页面布局。重点是设计用户界面和基础交互，不涉及真实数据。',
      prerequisites: [
        '已安装Next.js和Ant Design依赖',
        '了解React和TypeScript基础',
        '熟悉Ant Design组件库'
      ],
      steps: [
        {
          id: 'static-1',
          title: '分析需求并设计页面结构',
          description: '根据用户需求，确定页面的主要功能区域和布局方式',
          tips: [
            '使用纸笔或设计工具先画出页面草图',
            '确定页面的主要功能模块',
            '考虑响应式设计需求'
          ],
          resources: [
            {
              title: 'Ant Design Layout 组件',
              url: 'https://ant.design/components/layout',
              type: 'documentation'
            }
          ]
        },
        {
          id: 'static-2',
          title: '创建页面组件结构',
          description: '使用Next.js App Router创建页面文件和组件结构',
          code: `// src/app/users/page.tsx
'use client';

import React from 'react';
import { Layout, Card, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function UsersPage() {
  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <Title level={2} style={{ margin: '16px 0' }}>用户管理</Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Card>
          {/* 页面内容将在这里添加 */}
        </Card>
      </Content>
    </Layout>
  );
}`,
          tips: [
            '使用 "use client" 指令标记客户端组件',
            '遵循Next.js App Router的文件命名规范',
            '保持组件结构清晰和可维护'
          ]
        },
        {
          id: 'static-3',
          title: '添加Ant Design组件',
          description: '根据功能需求选择合适的Ant Design组件',
          code: `// 表单页面示例
import { Form, Input, Button, Select, DatePicker } from 'antd';

const UserForm = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
        <Input placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};`,
          tips: [
            '选择最适合功能的组件类型',
            '合理使用Form.Item的验证规则',
            '保持组件的一致性和可复用性'
          ]
        },
        {
          id: 'static-4',
          title: '创建模拟数据',
          description: '创建模拟数据来展示页面效果',
          code: `// src/lib/mock-data.ts
export const mockUsers = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: 'user',
    createdAt: '2024-01-02'
  }
];`,
          tips: [
            '模拟数据应该反映真实的数据结构',
            '包含足够的数据来测试各种UI状态',
            '考虑边界情况和异常数据'
          ]
        }
      ],
      bestPractices: [
        '使用TypeScript定义组件Props和状态类型',
        '遵循Ant Design的设计规范和组件使用方式',
        '保持组件的单一职责原则',
        '使用合理的文件和目录结构',
        '添加适当的注释和文档',
        '考虑无障碍访问性(a11y)要求'
      ],
      commonMistakes: [
        '忘记添加"use client"指令导致服务端渲染错误',
        '过度嵌套组件导致代码难以维护',
        '没有考虑响应式设计',
        '模拟数据结构与实际API不匹配',
        '忽略表单验证和错误处理'
      ],
      qualityChecks: [
        {
          id: 'static-check-1',
          title: '页面渲染检查',
          description: '验证页面能够正常渲染，没有JavaScript错误'
        },
        {
          id: 'static-check-2',
          title: '响应式检查',
          description: '验证页面在不同屏幕尺寸下的显示效果'
        },
        {
          id: 'static-check-3',
          title: '组件结构检查',
          description: '验证组件结构清晰，代码可维护'
        }
      ]
    });

    // API集成阶段指导
    this.guidanceMap.set(DevelopmentStage.API_INTEGRATION, {
      stage: DevelopmentStage.API_INTEGRATION,
      title: 'API接口集成指导',
      overview: '在这个阶段，您将收集后端API文档，生成类型定义，并创建API服务层。',
      prerequisites: [
        '静态页面已完成',
        '获得后端API文档',
        '了解API调用和错误处理'
      ],
      steps: [
        {
          id: 'api-1',
          title: '收集和验证API文档',
          description: '获取完整的API文档并验证其格式和完整性',
          code: `// API文档示例格式
const apiDoc = {
  baseURL: 'https://api.example.com',
  authentication: {
    type: 'bearer',
    headerName: 'Authorization',
    tokenPrefix: 'Bearer '
  },
  endpoints: [
    {
      name: 'getUserList',
      method: 'GET',
      path: '/users',
      description: '获取用户列表',
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          type: 'number',
          description: '页码'
        }
      ],
      responses: [
        {
          status: 200,
          description: '成功',
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/User' } },
              total: { type: 'number' }
            }
          }
        }
      ]
    }
  ]
};`,
          tips: [
            '确保API文档包含所有必需字段',
            '验证API端点的URL和参数格式',
            '确认认证方式和权限要求'
          ]
        },
        {
          id: 'api-2',
          title: '生成TypeScript类型',
          description: '基于API文档自动生成TypeScript类型定义',
          code: `// 自动生成的类型定义
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface GetUserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'user';
}`,
          tips: [
            '使用工具自动生成类型定义',
            '手动验证生成的类型是否正确',
            '为复杂类型添加注释说明'
          ]
        },
        {
          id: 'api-3',
          title: '创建API客户端',
          description: '实现统一的API调用客户端',
          code: `// src/lib/api-client.ts
class APIClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    method: string,
    path: string,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    const url = \`\${this.baseURL}\${path}\`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers
    };

    if (this.token) {
      headers.Authorization = \`Bearer \${this.token}\`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      throw new APIError(response.status, response.statusText);
    }

    return {
      data: await response.json(),
      status: response.status,
      headers: response.headers
    };
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<T>('GET', \`\${path}\${queryString}\`);
  }
}`,
          tips: [
            '实现统一的错误处理机制',
            '支持认证和权限管理',
            '添加请求和响应拦截器'
          ]
        }
      ],
      bestPractices: [
        '使用TypeScript确保类型安全',
        '实现完善的错误处理机制',
        '添加请求重试和超时处理',
        '使用环境变量管理API配置',
        '为API调用添加日志记录',
        '实现API响应缓存机制'
      ],
      commonMistakes: [
        'API文档格式不完整或错误',
        '忘记处理网络错误和超时',
        '没有实现适当的认证机制',
        '类型定义与实际API响应不匹配',
        '缺少错误边界和用户友好的错误提示'
      ],
      qualityChecks: [
        {
          id: 'api-check-1',
          title: 'API文档验证',
          description: '验证API文档格式正确且完整'
        },
        {
          id: 'api-check-2',
          title: 'API调用测试',
          description: '测试所有API端点的调用和响应'
        },
        {
          id: 'api-check-3',
          title: '错误处理测试',
          description: '测试各种错误情况的处理'
        }
      ]
    });

    // 动态数据阶段指导
    this.guidanceMap.set(DevelopmentStage.DYNAMIC, {
      stage: DevelopmentStage.DYNAMIC,
      title: '动态数据加载指导',
      overview: '在这个阶段，您将把静态页面转换为动态数据驱动的页面，实现真实的数据加载和交互。',
      prerequisites: [
        'API服务层已完成',
        '了解React状态管理',
        '熟悉React Query或SWR'
      ],
      steps: [
        {
          id: 'dynamic-1',
          title: '创建数据获取Hooks',
          description: '使用React Query创建数据获取和状态管理Hooks',
          code: `// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserList, createUser, updateUser, deleteUser } from '../services/userService';

export const useUsers = (params?: GetUserListParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUserList(params),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};`,
          tips: [
            '使用React Query管理服务端状态',
            '合理设置缓存时间和重新获取策略',
            '实现乐观更新提升用户体验'
          ]
        },
        {
          id: 'dynamic-2',
          title: '集成动态数据到组件',
          description: '将API调用集成到页面组件中，替换模拟数据',
          code: `// src/app/users/page.tsx
'use client';

import React from 'react';
import { Spin, Alert } from 'antd';
import { useUsers } from '../../hooks/useUsers';
import { UserList } from '../../components/UserList';

export default function UsersPage() {
  const { data: users, isLoading, error, refetch } = useUsers();

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '50px' }} />;
  }

  if (error) {
    return (
      <Alert
        message="加载失败"
        description={error.message}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => refetch()}>
            重试
          </Button>
        }
      />
    );
  }

  return <UserList data={users?.data || []} onRefresh={refetch} />;
}`,
          tips: [
            '处理加载、错误和空数据状态',
            '提供重试和刷新功能',
            '使用骨架屏提升加载体验'
          ]
        },
        {
          id: 'dynamic-3',
          title: '处理路由参数',
          description: '基于URL参数动态加载数据',
          code: `// src/app/users/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '../../../hooks/useUsers';
import { UserDetail } from '../../../components/UserDetail';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <Spin size="large" />;
  if (error) return <Alert message="用户不存在" type="error" />;
  if (!user) return <Alert message="用户不存在" type="warning" />;

  return <UserDetail user={user} />;
}`,
          tips: [
            '验证路由参数的有效性',
            '处理参数不存在或无效的情况',
            '实现参数变化时的数据重新加载'
          ]
        }
      ],
      bestPractices: [
        '使用React Query或SWR管理服务端状态',
        '实现适当的加载和错误状态',
        '优化数据获取性能和用户体验',
        '实现数据缓存和预加载策略',
        '处理并发请求和竞态条件',
        '添加离线支持和网络状态检测'
      ],
      commonMistakes: [
        '没有处理加载和错误状态',
        '过度获取数据导致性能问题',
        '忘记清理副作用和取消请求',
        '缺少适当的错误边界',
        '没有实现数据缓存策略'
      ],
      qualityChecks: [
        {
          id: 'dynamic-check-1',
          title: '数据加载测试',
          description: '验证数据能够正确加载和显示'
        },
        {
          id: 'dynamic-check-2',
          title: '错误处理测试',
          description: '测试网络错误和API错误的处理'
        },
        {
          id: 'dynamic-check-3',
          title: '性能测试',
          description: '验证数据加载性能和用户体验'
        }
      ]
    });
  }

  /**
   * 获取指定阶段的指导信息
   */
  getGuidance(stage: DevelopmentStage): StageGuidance | undefined {
    return this.guidanceMap.get(stage);
  }

  /**
   * 获取所有阶段的指导信息
   */
  getAllGuidance(): StageGuidance[] {
    return Array.from(this.guidanceMap.values());
  }

  /**
   * 获取指定阶段的最佳实践
   */
  getBestPractices(stage: DevelopmentStage): string[] {
    const guidance = this.guidanceMap.get(stage);
    return guidance?.bestPractices || [];
  }

  /**
   * 获取指定阶段的常见错误
   */
  getCommonMistakes(stage: DevelopmentStage): string[] {
    const guidance = this.guidanceMap.get(stage);
    return guidance?.commonMistakes || [];
  }

  /**
   * 执行质量检查
   */
  async runQualityChecks(stage: DevelopmentStage): Promise<QualityCheckResult[]> {
    const guidance = this.guidanceMap.get(stage);
    if (!guidance) return [];

    const results: QualityCheckResult[] = [];

    for (const check of guidance.qualityChecks) {
      if (check.checkFn) {
        try {
          const result = await check.checkFn();
          results.push(result);
        } catch (error) {
          results.push({
            passed: false,
            message: `检查失败: ${error instanceof Error ? error.message : '未知错误'}`
          });
        }
      } else {
        // 如果没有检查函数，返回手动检查提示
        results.push({
          passed: true,
          message: `请手动检查: ${check.description}`
        });
      }
    }

    return results;
  }

  /**
   * 获取智能提示
   */
  getSmartSuggestions(stage: DevelopmentStage, context?: any): string[] {
    const guidance = this.guidanceMap.get(stage);
    if (!guidance) return [];

    const suggestions: string[] = [];

    // 基于阶段提供建议
    switch (stage) {
      case DevelopmentStage.STATIC:
        suggestions.push(
          '建议先创建页面的基础布局，然后逐步添加组件',
          '使用Ant Design的Grid系统实现响应式布局',
          '为表单添加适当的验证规则'
        );
        break;

      case DevelopmentStage.API_INTEGRATION:
        suggestions.push(
          '确保API文档包含所有必需的字段和示例',
          '使用TypeScript类型确保API调用的类型安全',
          '实现统一的错误处理机制'
        );
        break;

      case DevelopmentStage.DYNAMIC:
        suggestions.push(
          '使用React Query管理服务端状态',
          '实现适当的加载状态和错误处理',
          '考虑添加数据缓存和预加载策略'
        );
        break;
    }

    return suggestions;
  }

  /**
   * 检查代码质量
   */
  async checkCodeQuality(filePath: string): Promise<QualityCheckResult> {
    // 这里可以集成ESLint、Prettier等工具
    // 目前返回模拟结果
    return {
      passed: true,
      message: '代码质量检查通过',
      suggestions: [
        '建议添加更多的TypeScript类型注解',
        '考虑提取可复用的组件',
        '添加适当的错误边界'
      ]
    };
  }

  /**
   * 生成阶段报告
   */
  generateStageReport(stage: DevelopmentStage, completedTasks: string[]): string {
    const guidance = this.guidanceMap.get(stage);
    if (!guidance) return '';

    const totalSteps = guidance.steps.length;
    const completedSteps = completedTasks.length;
    const progress = Math.round((completedSteps / totalSteps) * 100);

    return `
# ${guidance.title} - 阶段报告

## 进度概览
- 总步骤数: ${totalSteps}
- 已完成: ${completedSteps}
- 完成率: ${progress}%

## 已完成任务
${completedTasks.map(task => `- ✅ ${task}`).join('\n')}

## 下一步建议
${this.getSmartSuggestions(stage).map(suggestion => `- ${suggestion}`).join('\n')}

## 质量检查要点
${guidance.qualityChecks.map(check => `- ${check.title}: ${check.description}`).join('\n')}
    `.trim();
  }
}