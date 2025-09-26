import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Zap, Palette, Smartphone, Code, TestTube, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          欢迎使用 shadcn/ui + Next.js 模板
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          这是一个基于 Next.js、shadcn/ui 和 Tailwind CSS 构建的现代化 Web 应用模板。
          它包含了完整的开发工具链、无样式组件库和最佳实践。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Next.js 14
            </CardTitle>
            <CardDescription>
              使用最新的 App Router 和 Server Components
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              shadcn/ui
            </CardTitle>
            <CardDescription>
              无样式、可定制的 React 组件库
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              响应式设计
            </CardTitle>
            <CardDescription>
              移动优先的响应式设计方案
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              TypeScript
            </CardTitle>
            <CardDescription>
              完整的 TypeScript 类型支持
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              快速开发
            </CardTitle>
            <CardDescription>
              热重载和快速构建体验
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              测试配置
            </CardTitle>
            <CardDescription>
              完整的测试工具链配置
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>示例页面</CardTitle>
          <CardDescription>
            探索各种组件和功能的使用示例
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/examples/basic-form">
              <Button variant="outline" className="w-full justify-between">
                基础表单
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/examples/data-table">
              <Button variant="outline" className="w-full justify-between">
                数据表格
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/examples/dashboard">
              <Button variant="outline" className="w-full justify-between">
                仪表板
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/examples/user-profile">
              <Button variant="outline" className="w-full justify-between">
                用户资料
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>开始使用</CardTitle>
          <CardDescription>
            快速了解项目结构和开发流程
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              查看 <code className="bg-muted px-1 py-0.5 rounded text-sm">src/app</code> 目录了解项目结构，
              或者访问上面的示例页面查看组件使用方法。
            </p>
            <div className="flex gap-4">
              <Link href="/examples">
                <Button>
                  查看所有示例
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://ui.shadcn.com" target="_blank">
                <Button variant="outline">
                  shadcn/ui 文档
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}