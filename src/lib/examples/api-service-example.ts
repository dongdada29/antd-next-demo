/**
 * API服务层生成器使用示例
 * 展示如何使用API客户端、服务生成器和注册表
 */

import type { APIDocumentation } from '@/types/api-documentation';
import { ServiceGenerator } from '../service-generator';
import { serviceRegistry } from '../service-registry';
import { createAPIClient } from '../api-client-factory';
import { validateAPIServices } from '../service-validator';

// 示例API文档
const exampleAPIDocumentation: APIDocumentation = {
  title: 'User Management API',
  version: '1.0.0',
  description: '用户管理系统API',
  baseURL: 'https://api.example.com/v1',
  
  authentication: {
    type: 'bearer',
    tokenPrefix: 'Bearer',
    description: 'JWT Token认证',
  },
  
  globalHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  timeout: 15000,
  
  endpoints: [
    {
      id: 'get-users',
      name: 'getUserList',
      method: 'GET',
      path: '/users',
      summary: '获取用户列表',
      description: '获取系统中所有用户的列表，支持分页和筛选',
      tags: ['users', 'list'],
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          type: 'number',
          description: '页码，从1开始',
          example: 1,
          minimum: 1,
        },
        {
          name: 'pageSize',
          in: 'query',
          required: false,
          type: 'number',
          description: '每页数量',
          example: 10,
          minimum: 1,
          maximum: 100,
        },
        {
          name: 'search',
          in: 'query',
          required: false,
          type: 'string',
          description: '搜索关键词',
          example: 'john',
        },
      ],
      responses: [
        {
          statusCode: 200,
          description: '成功返回用户列表',
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
                    createdAt: { type: 'string', description: '创建时间' },
                    updatedAt: { type: 'string', description: '更新时间' },
                  },
                },
              },
              total: { type: 'number', description: '总数量' },
              page: { type: 'number', description: '当前页码' },
              pageSize: { type: 'number', description: '每页数量' },
            },
          },
          example: {
            data: [
              {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://example.com/avatar1.jpg',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
            ],
            total: 1,
            page: 1,
            pageSize: 10,
          },
        },
      ],
      examples: {
        request: {
          page: 1,
          pageSize: 10,
          search: 'john',
        },
        response: {
          data: [
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://example.com/avatar1.jpg',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        },
        curl: 'curl -X GET "https://api.example.com/v1/users?page=1&pageSize=10&search=john" -H "Authorization: Bearer YOUR_TOKEN"',
      },
    },
    
    {
      id: 'get-user',
      name: 'getUserById',
      method: 'GET',
      path: '/users/{id}',
      summary: '获取用户详情',
      description: '根据用户ID获取用户的详细信息',
      tags: ['users', 'detail'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          type: 'number',
          description: '用户ID',
          example: 1,
        },
      ],
      responses: [
        {
          statusCode: 200,
          description: '成功返回用户详情',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              id: { type: 'number', description: '用户ID' },
              name: { type: 'string', description: '用户名' },
              email: { type: 'string', description: '邮箱' },
              avatar: { type: 'string', description: '头像URL' },
              bio: { type: 'string', description: '个人简介' },
              createdAt: { type: 'string', description: '创建时间' },
              updatedAt: { type: 'string', description: '更新时间' },
            },
          },
          example: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://example.com/avatar1.jpg',
            bio: 'Software Developer',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
        {
          statusCode: 404,
          description: '用户不存在',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', description: '错误信息' },
              code: { type: 'string', description: '错误代码' },
            },
          },
          example: {
            error: 'User not found',
            code: 'USER_NOT_FOUND',
          },
        },
      ],
      examples: {
        response: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://example.com/avatar1.jpg',
          bio: 'Software Developer',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        curl: 'curl -X GET "https://api.example.com/v1/users/1" -H "Authorization: Bearer YOUR_TOKEN"',
      },
    },
    
    {
      id: 'create-user',
      name: 'createUser',
      method: 'POST',
      path: '/users',
      summary: '创建用户',
      description: '创建一个新的用户账户',
      tags: ['users', 'create'],
      requestBody: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '用户名' },
            email: { type: 'string', description: '邮箱' },
            password: { type: 'string', description: '密码' },
            avatar: { type: 'string', description: '头像URL' },
            bio: { type: 'string', description: '个人简介' },
          },
          required: ['name', 'email', 'password'],
        },
        example: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'securepassword123',
          avatar: 'https://example.com/avatar2.jpg',
          bio: 'Product Manager',
        },
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
              avatar: { type: 'string', description: '头像URL' },
              bio: { type: 'string', description: '个人简介' },
              createdAt: { type: 'string', description: '创建时间' },
              updatedAt: { type: 'string', description: '更新时间' },
            },
          },
          example: {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://example.com/avatar2.jpg',
            bio: 'Product Manager',
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
          },
        },
      ],
      examples: {
        request: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'securepassword123',
          avatar: 'https://example.com/avatar2.jpg',
          bio: 'Product Manager',
        },
        response: {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://example.com/avatar2.jpg',
          bio: 'Product Manager',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
        curl: 'curl -X POST "https://api.example.com/v1/users" -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d \'{"name":"Jane Smith","email":"jane@example.com","password":"securepassword123"}\'',
      },
    },
    
    {
      id: 'update-user',
      name: 'updateUser',
      method: 'PUT',
      path: '/users/{id}',
      summary: '更新用户',
      description: '更新指定用户的信息',
      tags: ['users', 'update'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          type: 'number',
          description: '用户ID',
          example: 1,
        },
      ],
      requestBody: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '用户名' },
            email: { type: 'string', description: '邮箱' },
            avatar: { type: 'string', description: '头像URL' },
            bio: { type: 'string', description: '个人简介' },
          },
        },
        example: {
          name: 'John Updated',
          bio: 'Senior Software Developer',
        },
      },
      responses: [
        {
          statusCode: 200,
          description: '用户更新成功',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              id: { type: 'number', description: '用户ID' },
              name: { type: 'string', description: '用户名' },
              email: { type: 'string', description: '邮箱' },
              avatar: { type: 'string', description: '头像URL' },
              bio: { type: 'string', description: '个人简介' },
              createdAt: { type: 'string', description: '创建时间' },
              updatedAt: { type: 'string', description: '更新时间' },
            },
          },
          example: {
            id: 1,
            name: 'John Updated',
            email: 'john@example.com',
            avatar: 'https://example.com/avatar1.jpg',
            bio: 'Senior Software Developer',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-02T12:00:00Z',
          },
        },
      ],
      examples: {
        request: {
          name: 'John Updated',
          bio: 'Senior Software Developer',
        },
        response: {
          id: 1,
          name: 'John Updated',
          email: 'john@example.com',
          avatar: 'https://example.com/avatar1.jpg',
          bio: 'Senior Software Developer',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T12:00:00Z',
        },
        curl: 'curl -X PUT "https://api.example.com/v1/users/1" -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d \'{"name":"John Updated","bio":"Senior Software Developer"}\'',
      },
    },
    
    {
      id: 'delete-user',
      name: 'deleteUser',
      method: 'DELETE',
      path: '/users/{id}',
      summary: '删除用户',
      description: '删除指定的用户账户',
      tags: ['users', 'delete'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          type: 'number',
          description: '用户ID',
          example: 1,
        },
      ],
      responses: [
        {
          statusCode: 204,
          description: '用户删除成功',
          contentType: 'application/json',
        },
        {
          statusCode: 404,
          description: '用户不存在',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', description: '错误信息' },
              code: { type: 'string', description: '错误代码' },
            },
          },
          example: {
            error: 'User not found',
            code: 'USER_NOT_FOUND',
          },
        },
      ],
      examples: {
        curl: 'curl -X DELETE "https://api.example.com/v1/users/1" -H "Authorization: Bearer YOUR_TOKEN"',
      },
    },
  ],
  
  models: {
    User: {
      name: 'User',
      description: '用户模型',
      type: 'object',
      properties: {
        id: { type: 'number', description: '用户ID' },
        name: { type: 'string', description: '用户名' },
        email: { type: 'string', description: '邮箱' },
        avatar: { type: 'string', description: '头像URL' },
        bio: { type: 'string', description: '个人简介' },
        createdAt: { type: 'string', description: '创建时间' },
        updatedAt: { type: 'string', description: '更新时间' },
      },
      required: ['id', 'name', 'email'],
      example: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar1.jpg',
        bio: 'Software Developer',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    },
  },
  
  environments: [
    {
      name: 'development',
      baseURL: 'http://localhost:3000/api/v1',
      description: '开发环境',
    },
    {
      name: 'staging',
      baseURL: 'https://staging-api.example.com/v1',
      description: '测试环境',
    },
    {
      name: 'production',
      baseURL: 'https://api.example.com/v1',
      description: '生产环境',
    },
  ],
  
  metadata: {
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    author: 'API Team',
    contact: {
      name: 'API Support',
      email: 'api-support@example.com',
      url: 'https://example.com/support',
    },
  },
};

// 使用示例函数
export async function demonstrateAPIServiceGeneration() {
  console.log('🚀 开始API服务生成演示...\n');

  try {
    // 1. 创建服务生成器
    console.log('1. 创建服务生成器');
    const generator = new ServiceGenerator({
      namespace: 'UserAPI',
      includeTypes: true,
      includeValidation: true,
      includeHooks: true,
      clientName: 'userApiClient',
    });

    // 2. 生成服务函数
    console.log('2. 生成API服务函数...');
    const generationResult = generator.generateServices(exampleAPIDocumentation);
    
    console.log(`✅ 生成了 ${generationResult.totalFunctions} 个服务函数:`);
    generationResult.services.forEach(service => {
      console.log(`   - ${service.functionName} (${service.endpoint.method} ${service.endpoint.path})`);
    });

    // 3. 验证生成的服务
    console.log('\n3. 验证生成的服务...');
    const validationResult = validateAPIServices(generationResult.services, exampleAPIDocumentation);
    
    console.log(`✅ 验证完成，质量分数: ${validationResult.score}/100`);
    if (validationResult.errors.length > 0) {
      console.log(`⚠️  发现 ${validationResult.errors.length} 个错误:`);
      validationResult.errors.forEach(error => {
        console.log(`   - ${error.severity}: ${error.message}`);
      });
    }
    
    if (validationResult.warnings.length > 0) {
      console.log(`💡 发现 ${validationResult.warnings.length} 个警告:`);
      validationResult.warnings.forEach(warning => {
        console.log(`   - ${warning.message}`);
      });
    }

    // 4. 注册到服务注册表
    console.log('\n4. 注册到服务注册表...');
    const registryEntry = await serviceRegistry.registerDocumentation(
      'user-api',
      'User Management API',
      exampleAPIDocumentation
    );
    
    console.log(`✅ 服务已注册，ID: ${registryEntry.id}`);

    // 5. 创建API客户端
    console.log('\n5. 创建API客户端...');
    const apiClient = createAPIClient('auth', {
      baseURL: exampleAPIDocumentation.baseURL,
      auth: exampleAPIDocumentation.authentication,
    });
    
    console.log('✅ API客户端创建成功');

    // 6. 展示生成的代码示例
    console.log('\n6. 生成的代码示例:');
    console.log('='.repeat(50));
    
    // 显示第一个服务函数的代码
    if (generationResult.services.length > 0) {
      const firstService = generationResult.services[0];
      console.log(`// ${firstService.functionName} 函数代码:`);
      console.log(firstService.code);
    }

    // 7. 获取服务统计信息
    console.log('\n7. 服务统计信息:');
    const stats = serviceRegistry.getStats();
    console.log(`   总服务数: ${stats.totalServices}`);
    console.log(`   总端点数: ${stats.totalEndpoints}`);
    console.log(`   按方法分布:`, stats.servicesByMethod);
    console.log(`   按标签分布:`, stats.servicesByTag);

    // 8. 搜索服务
    console.log('\n8. 搜索服务演示:');
    const searchResults = serviceRegistry.searchServices('user');
    console.log(`搜索 "user" 找到 ${searchResults.length} 个服务`);

    console.log('\n🎉 API服务生成演示完成!');
    
    return {
      generationResult,
      validationResult,
      registryEntry,
      apiClient,
      stats,
    };

  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error);
    throw error;
  }
}

// 生成的服务函数使用示例
export function demonstrateGeneratedServiceUsage() {
  console.log('📝 生成的服务函数使用示例:\n');

  // 这些是基于上面文档生成的服务函数示例
  const exampleUsage = `
// 1. 获取用户列表
const users = await getUserList({ page: 1, pageSize: 10, search: 'john' });
console.log('用户列表:', users.data);

// 2. 获取用户详情
const user = await getUserById(1);
console.log('用户详情:', user.data);

// 3. 创建用户
const newUser = await createUser({
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'securepassword123',
  bio: 'Product Manager'
});
console.log('新用户:', newUser.data);

// 4. 更新用户
const updatedUser = await updateUser(1, {
  name: 'John Updated',
  bio: 'Senior Software Developer'
});
console.log('更新后的用户:', updatedUser.data);

// 5. 删除用户
await deleteUser(1);
console.log('用户已删除');

// 6. 使用React Hooks (在React组件中)
function UserListComponent() {
  const { data: users, loading, error } = useGetUserList({ page: 1, pageSize: 10 });
  const createUserMutation = useCreateUserMutation();

  const handleCreateUser = (userData) => {
    createUserMutation.mutate(userData, {
      onSuccess: () => {
        console.log('用户创建成功');
      },
      onError: (error) => {
        console.error('创建失败:', error);
      }
    });
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      {users?.data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
  `;

  console.log(exampleUsage);
}

// 导出示例文档供其他地方使用
export { exampleAPIDocumentation };