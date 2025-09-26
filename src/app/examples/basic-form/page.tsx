'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicForm, formConfigs } from '@/components/forms/basic-form';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function BasicFormPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('表单数据:', data);
    setLoading(false);
    setSubmitted(true);
    
    // 3秒后重置状态
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/examples">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回示例
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          基础表单示例
        </h1>
        <p className="text-muted-foreground">
          展示如何使用 shadcn/ui 组件构建表单，包含验证和提交功能
        </p>
      </div>

      {submitted && (
        <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">表单提交成功！</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 登录表单 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">登录表单</h2>
          <BasicForm
            title="用户登录"
            description="请输入您的登录凭据"
            fields={formConfigs.login}
            onSubmit={handleSubmit}
            submitText="登录"
            loading={loading}
          />
        </div>

        {/* 注册表单 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">注册表单</h2>
          <BasicForm
            title="创建账户"
            description="填写信息创建新账户"
            fields={formConfigs.register}
            onSubmit={handleSubmit}
            submitText="注册"
            loading={loading}
          />
        </div>

        {/* 联系表单 */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">联系表单</h2>
          <div className="max-w-md mx-auto">
            <BasicForm
              title="联系我们"
              description="有问题？请随时联系我们"
              fields={formConfigs.contact}
              onSubmit={handleSubmit}
              submitText="发送消息"
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* 代码示例 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用方法</CardTitle>
          <CardDescription>
            如何在您的项目中使用 BasicForm 组件
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`import { BasicForm, formConfigs } from '@/components/forms/basic-form';

// 使用预定义配置
<BasicForm
  title="用户登录"
  fields={formConfigs.login}
  onSubmit={handleSubmit}
  loading={loading}
/>

// 自定义字段配置
const customFields = [
  {
    name: 'username',
    label: '用户名',
    type: 'text',
    required: true,
    validation: { minLength: 3 }
  }
];

<BasicForm
  title="自定义表单"
  fields={customFields}
  onSubmit={handleSubmit}
/>`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}