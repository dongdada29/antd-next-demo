'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicTable, tableConfigs } from '@/components/lists/basic-table';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

// 模拟数据
const mockUsers = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    status: 'inactive',
    createdAt: '2024-01-14T09:15:00Z',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    status: 'active',
    createdAt: '2024-01-13T14:45:00Z',
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    status: 'active',
    createdAt: '2024-01-12T16:20:00Z',
  },
  {
    id: 5,
    name: '钱七',
    email: 'qianqi@example.com',
    status: 'inactive',
    createdAt: '2024-01-11T11:10:00Z',
  },
];

export default function DataTablePage() {
  const [data, setData] = React.useState(mockUsers);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 3,
    total: mockUsers.length,
  });

  const handleEdit = (record: any) => {
    console.log('编辑用户:', record);
    // 这里可以打开编辑对话框或跳转到编辑页面
  };

  const handleDelete = (record: any) => {
    console.log('删除用户:', record);
    // 这里可以显示确认对话框并删除用户
    setData(prev => prev.filter(item => item.id !== record.id));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
  };

  const handleSearch = (value: string) => {
    console.log('搜索:', value);
    setLoading(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      if (value) {
        const filtered = mockUsers.filter(user => 
          user.name.includes(value) || user.email.includes(value)
        );
        setData(filtered);
        setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
      } else {
        setData(mockUsers);
        setPagination(prev => ({ ...prev, total: mockUsers.length, current: 1 }));
      }
      setLoading(false);
    }, 500);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  const actions = [
    {
      label: '编辑',
      onClick: handleEdit,
      variant: 'outline' as const,
    },
    {
      label: '删除',
      onClick: handleDelete,
      variant: 'destructive' as const,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/examples">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回示例
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              数据表格示例
            </h1>
            <p className="text-muted-foreground">
              展示如何使用 shadcn/ui 组件构建功能完整的数据表格
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            添加用户
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* 基础表格 */}
        <BasicTable
          title="用户管理"
          description="管理系统中的所有用户信息"
          data={data}
          columns={tableConfigs.users}
          loading={loading}
          searchable
          onSearch={handleSearch}
          pagination={{
            ...pagination,
            onChange: handlePageChange,
          }}
          actions={actions}
        />

        {/* 简单表格 */}
        <BasicTable
          title="简单表格"
          description="不带分页和操作的简单数据展示"
          data={mockUsers.slice(0, 3)}
          columns={tableConfigs.users.slice(0, 3)} // 只显示前3列
          loading={false}
        />

        {/* 代码示例 */}
        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
            <CardDescription>
              如何在您的项目中使用 BasicTable 组件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`import { BasicTable, tableConfigs } from '@/components/lists/basic-table';

// 使用预定义配置
<BasicTable
  title="用户管理"
  data={users}
  columns={tableConfigs.users}
  searchable
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
    onChange: handlePageChange
  }}
  actions={[
    {
      label: '编辑',
      onClick: handleEdit,
      variant: 'outline'
    }
  ]}
/>

// 自定义列配置
const customColumns = [
  {
    key: 'name',
    title: '姓名',
    sortable: true,
    render: (value, record) => (
      <span className="font-medium">{value}</span>
    )
  }
];`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}