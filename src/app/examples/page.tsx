import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Palette, 
  Zap, 
  Database, 
  Layout, 
  Smartphone,
  ArrowRight,
  ExternalLink,
  Wand2,
  BookOpen,
  Eye,
  Play
} from 'lucide-react';

const ExamplesPage = () => {
  const examples = [
    {
      title: 'AI 交互式演示',
      description: '体验 AI Agent 的实时代码生成能力，支持组件、页面和 Hook 生成',
      href: '/examples/interactive-demo',
      icon: <Wand2 className="h-6 w-6" />,
      tags: ['AI', '交互', '实时生成'],
      status: 'featured'
    },
    {
      title: '组件库展示',
      description: '完整的 shadcn/ui 组件库展示，包含所有组件的使用示例和代码',
      href: '/examples/component-showcase',
      icon: <Palette className="h-6 w-6" />,
      tags: ['组件库', 'shadcn/ui', '展示'],
      status: 'stable'
    },
    {
      title: '最佳实践指南',
      description: '学习现代 React 开发的最佳实践，包括可访问性、性能优化等',
      href: '/examples/best-practices',
      icon: <BookOpen className="h-6 w-6" />,
      tags: ['最佳实践', '指南', '教程'],
      status: 'stable'
    },
    {
      title: 'AI 组件展示',
      description: '展示 AI 生成的各种 React 组件，包括按钮、表单、卡片等',
      href: '/examples/ai-components',
      icon: <Code className="h-6 w-6" />,
      tags: ['AI', '组件', 'React'],
      status: 'stable'
    },
    {
      title: '基础表单示例',
      description: '使用 React Hook Form 和 Zod 验证的表单组件示例',
      href: '/examples/basic-form',
      icon: <Layout className="h-6 w-6" />,
      tags: ['表单', '验证', 'Zod'],
      status: 'stable'
    },
    {
      title: '数据表格示例',
      description: '功能完整的数据表格，支持排序、筛选、分页等功能',
      href: '/examples/data-table',
      icon: <Database className="h-6 w-6" />,
      tags: ['表格', '数据', 'TanStack'],
      status: 'stable'
    },
    {
      title: '组件生成演示',
      description: '实时演示 AI 如何生成 React 组件代码',
      href: '/examples/component-generation',
      icon: <Zap className="h-6 w-6" />,
      tags: ['AI', '生成', '实时'],
      status: 'beta'
    },
    {
      title: '动态数据示例',
      description: '展示如何处理动态数据加载、缓存和状态管理',
      href: '/examples/dynamic-data',
      icon: <Database className="h-6 w-6" />,
      tags: ['数据', '缓存', 'React Query'],
      status: 'stable'
    },
    {
      title: '开发流程演示',
      description: '完整的开发流程演示，从需求到部署',
      href: '/examples/development-flow',
      icon: <Play className="h-6 w-6" />,
      tags: ['流程', '开发', '演示'],
      status: 'experimental'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'featured':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'stable':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'beta':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'experimental':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'featured':
        return '精选';
      case 'stable':
        return '稳定';
      case 'beta':
        return '测试';
      case 'experimental':
        return '实验';
      default:
        return status;
    }
  };

  const featuredExamples = examples.filter(example => example.status === 'featured');
  const regularExamples = examples.filter(example => example.status !== 'featured');

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          示例和演示
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          探索我们的示例集合，了解如何使用 AI Agent 和现代 React 技术栈构建高质量的应用程序。
        </p>
      </div>

      {/* Featured Examples */}
      {featuredExamples.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">精选演示</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredExamples.map((example) => (
              <Card key={example.href} className="group hover:shadow-xl transition-all duration-300 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-lg text-white">
                        {example.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{example.title}</CardTitle>
                      </div>
                    </div>
                    <Badge className={getStatusColor(example.status)}>
                      {getStatusText(example.status)}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2 text-base">
                    {example.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {example.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all">
                      <Link href={example.href}>
                        立即体验
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">所有示例</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regularExamples.map((example) => (
            <Card key={example.href} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {example.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                    </div>
                  </div>
                  <Badge className={getStatusColor(example.status)}>
                    {getStatusText(example.status)}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  {example.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {example.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                    <Link href={example.href}>
                      查看示例
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-16 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">相关资源</h2>
          <p className="text-muted-foreground mt-2">
            更多学习资源和文档
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                组件文档
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                查看完整的组件 API 文档和使用指南
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/examples/component-showcase">
                  <Eye className="mr-2 h-4 w-4" />
                  查看文档
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                设计系统
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                了解我们的设计系统和样式指南
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/examples/best-practices">
                  <BookOpen className="mr-2 h-4 w-4" />
                  设计指南
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI 代码生成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                体验 AI Agent 的强大代码生成能力
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/examples/interactive-demo">
                  <Wand2 className="mr-2 h-4 w-4" />
                  立即体验
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamplesPage;