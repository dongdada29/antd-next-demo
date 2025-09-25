'use client';

import React, { Suspense } from 'react';
import { Card, Row, Col, Button, Space, Typography, Divider } from 'antd';
import { 
  DataProvider, 
  DataContainer, 
  ListDataContainer, 
  PaginatedDataContainer,
  SmartDataContainer 
} from '@/components/common/DataProvider';
import { 
  useApiQuery, 
  useApiMutation
} from '@/hooks';
import { BasicTable } from '@/components/lists/BasicTable';

const { Title, Paragraph } = Typography;

// 示例数据类型
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  createdAt: string;
}

/**
 * 动态数据集成示例页面
 */
export default function DynamicDataExamplePage() {
  return (
    <DataProvider 
      cacheStrategy="user"
      enablePerformanceMonitoring={true}
      enablePreloading={true}
    >
      <div style={{ padding: 24 }}>
        <Title level={1}>动态数据集成示例</Title>
        <Paragraph>
          本页面展示了如何使用动态数据集成器实现数据驱动的页面，
          包括路由参数处理、数据获取、缓存管理和性能优化。
        </Paragraph>

        <Divider />

        {/* 基础数据容器示例 */}
        <Section title="基础数据容器">
          <DataContainer<User>
            url="/api/users/1"
            enablePreload={true}
            preloadUrls={['/api/users', '/api/users/1/posts']}
          >
            {({ data, loading, error, refetch }) => (
              <Card 
                title="用户信息" 
                loading={loading}
                extra={<Button onClick={refetch}>刷新</Button>}
              >
                {data && (
                  <div>
                    <p><strong>姓名:</strong> {data.name}</p>
                    <p><strong>邮箱:</strong> {data.email}</p>
                    <p><strong>创建时间:</strong> {data.createdAt}</p>
                  </div>
                )}
              </Card>
            )}
          </DataContainer>
        </Section>

        {/* 列表数据容器示例 */}
        <Section title="列表数据容器">
          <ListDataContainer<User>
            url="/api/users"
            params={{ status: 'active' }}
          >
            {({ items, loading, error, refetch, isEmpty, count }) => (
              <Card 
                title={`用户列表 (${count})`}
                loading={loading}
                extra={<Button onClick={refetch}>刷新</Button>}
              >
                {isEmpty ? (
                  <p>暂无数据</p>
                ) : (
                  <BasicTable
                    dataSource={items}
                    columns={[
                      { title: 'ID', dataIndex: 'id', key: 'id' },
                      { title: '姓名', dataIndex: 'name', key: 'name' },
                      { title: '邮箱', dataIndex: 'email', key: 'email' },
                    ]}
                  />
                )}
              </Card>
            )}
          </ListDataContainer>
        </Section>

        {/* 分页数据容器示例 */}
        <Section title="分页数据容器">
          <PaginatedDataContainer<Post>
            url="/api/posts"
            params={{ category: 'tech' }}
          >
            {({ items, loading, pagination, goToPage, changePageSize }) => (
              <Card title="文章列表" loading={loading}>
                <BasicTable
                  dataSource={items}
                  columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: '标题', dataIndex: 'title', key: 'title' },
                    { title: '作者', dataIndex: 'author', key: 'author', render: (author: User) => author?.name },
                    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
                  ]}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: goToPage,
                    onShowSizeChange: (_, size) => changePageSize(size),
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </Card>
            )}
          </PaginatedDataContainer>
        </Section>

        {/* 智能数据容器示例 */}
        <Section title="智能数据容器">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <SmartDataContainer<any>
                url="/api/stats"
                dataType="static"
                adaptiveLoading={true}
              >
                {({ data, loading }) => (
                  <Card title="统计数据" loading={loading}>
                    <p>总用户数: {data?.totalUsers || 0}</p>
                    <p>总文章数: {data?.totalPosts || 0}</p>
                  </Card>
                )}
              </SmartDataContainer>
            </Col>
            
            <Col span={8}>
              <SmartDataContainer<any>
                url="/api/notifications"
                dataType="realtime"
                adaptiveLoading={true}
              >
                {({ data, loading }) => (
                  <Card title="实时通知" loading={loading}>
                    <p>未读消息: {data?.unreadCount || 0}</p>
                    <p>最新消息: {data?.latestMessage || '无'}</p>
                  </Card>
                )}
              </SmartDataContainer>
            </Col>
            
            <Col span={8}>
              <SmartDataContainer<any>
                url="/api/user/profile"
                dataType="dynamic"
                adaptiveLoading={true}
              >
                {({ data, loading }) => (
                  <Card title="用户资料" loading={loading}>
                    <p>登录状态: {data?.isLoggedIn ? '已登录' : '未登录'}</p>
                    <p>权限级别: {data?.role || '普通用户'}</p>
                  </Card>
                )}
              </SmartDataContainer>
            </Col>
          </Row>
        </Section>

        {/* Hook使用示例 */}
        <Section title="Hook使用示例">
          <Suspense fallback={<div>Loading...</div>}>
            <HookExamples />
          </Suspense>
        </Section>
      </div>
    </DataProvider>
  );
}

/**
 * 章节组件
 */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ 
  title, 
  children 
}) => (
  <div style={{ marginBottom: 32 }}>
    <Title level={2}>{title}</Title>
    {children}
  </div>
);

/**
 * Hook使用示例组件
 */
const HookExamples: React.FC = () => {
  // 使用查询Hook
  const { data: users, loading: usersLoading, refetch: refetchUsers } = useApiQuery<User[]>('/api/users');
  
  // 使用变更Hook
  const { mutate: createUser, loading: createLoading } = useApiMutation(
    (userData: Partial<User>, client) => client.post<User>('/api/users', userData),
    {
      showSuccessMessage: '用户创建成功',
      invalidateQueries: ['/api/users'],
    }
  );

  const handleCreateUser = () => {
    createUser({
      name: '新用户',
      email: 'newuser@example.com',
    });
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="查询Hook示例" loading={usersLoading}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <p>用户数量: {users?.length || 0}</p>
            <Button onClick={refetchUsers}>刷新用户列表</Button>
          </Space>
        </Card>
      </Col>
      
      <Col span={12}>
        <Card title="变更Hook示例">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              loading={createLoading}
              onClick={handleCreateUser}
            >
              创建新用户
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

// 客户端组件不能导出metadata，需要在layout.tsx或单独的metadata文件中定义