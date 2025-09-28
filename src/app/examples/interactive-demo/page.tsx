'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Code, 
  Eye, 
  Download, 
  Copy, 
  Wand2, 
  Sparkles,
  FileCode,
  Palette,
  Layout,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

// 模拟的 AI 代码生成 API
const mockAIGenerate = async (prompt: string, type: string): Promise<string> => {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const templates = {
    component: `import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ${prompt.replace(/\s+/g, '')}Props {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export const ${prompt.replace(/\s+/g, '')} = React.forwardRef<
  HTMLButtonElement,
  ${prompt.replace(/\s+/g, '')}Props
>(({ children, className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

${prompt.replace(/\s+/g, '')}.displayName = '${prompt.replace(/\s+/g, '')}';`,

    page: `import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ${prompt.replace(/\s+/g, '')}Page() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          ${prompt}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to your new page. This is a starting point for your application.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Feature 1</CardTitle>
            <CardDescription>
              Description of the first feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature 2</CardTitle>
            <CardDescription>
              Description of the second feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Learn More</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature 3</CardTitle>
            <CardDescription>
              Description of the third feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Explore</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,

    hook: `import { useState, useEffect, useCallback } from 'react';

interface Use${prompt.replace(/\s+/g, '')}Options {
  initialValue?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface Use${prompt.replace(/\s+/g, '')}Return {
  data: any;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function use${prompt.replace(/\s+/g, '')}(
  options: Use${prompt.replace(/\s+/g, '')}Options = {}
): Use${prompt.replace(/\s+/g, '')}Return {
  const [data, setData] = useState(options.initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = { message: 'Success', timestamp: Date.now() };
      
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}`
  };

  return templates[type as keyof typeof templates] || templates.component;
};

const InteractiveDemoPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generationType, setGenerationType] = useState('component');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('请输入生成提示');
      return;
    }

    setIsGenerating(true);
    try {
      const code = await mockAIGenerate(prompt, generationType);
      setGeneratedCode(code);
      toast.success('代码生成成功！');
    } catch (error) {
      toast.error('代码生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, generationType]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('代码已复制到剪贴板');
  }, [generatedCode]);

  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-${generationType}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('代码文件已下载');
  }, [generatedCode, generationType]);

  const examplePrompts = {
    component: [
      'CustomButton',
      'UserCard',
      'SearchInput',
      'DataTable',
      'NavigationMenu'
    ],
    page: [
      'Dashboard',
      'User Profile',
      'Settings',
      'Analytics',
      'Contact Us'
    ],
    hook: [
      'ApiData',
      'LocalStorage',
      'WindowSize',
      'Authentication',
      'FormValidation'
    ]
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wand2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            AI 代码生成演示
          </h1>
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          体验 AI Agent 的强大代码生成能力。输入您的需求，AI 将为您生成高质量的 React 组件、页面或 Hook 代码。
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              代码生成配置
            </CardTitle>
            <CardDescription>
              配置您的代码生成需求，AI 将根据您的输入生成相应的代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 生成类型选择 */}
            <div className="space-y-2">
              <Label>生成类型</Label>
              <Tabs value={generationType} onValueChange={setGenerationType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="component" className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    组件
                  </TabsTrigger>
                  <TabsTrigger value="page" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    页面
                  </TabsTrigger>
                  <TabsTrigger value="hook" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Hook
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 提示输入 */}
            <div className="space-y-2">
              <Label htmlFor="prompt">生成提示</Label>
              <Textarea
                id="prompt"
                placeholder={`输入您想要生成的${generationType === 'component' ? '组件' : generationType === 'page' ? '页面' : 'Hook'}名称或描述...`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            {/* 示例提示 */}
            <div className="space-y-2">
              <Label>示例提示</Label>
              <div className="flex flex-wrap gap-2">
                {examplePrompts[generationType as keyof typeof examplePrompts].map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setPrompt(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 生成按钮 */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  生成中...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  生成代码
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                生成结果
              </div>
              {generatedCode && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCode}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    下载
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              AI 生成的代码将在这里显示，您可以复制或下载使用
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <div className="space-y-4">
                <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as 'code' | 'preview')}>
                  <TabsList>
                    <TabsTrigger value="code">代码视图</TabsTrigger>
                    <TabsTrigger value="preview">预览视图</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="code" className="mt-4">
                    <ScrollArea className="h-96 w-full rounded-md border">
                      <pre className="p-4 text-sm">
                        <code className="language-typescript">
                          {generatedCode}
                        </code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-4">
                    <div className="h-96 w-full rounded-md border bg-muted/50 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Eye className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">
                          预览功能正在开发中
                        </p>
                        <p className="text-sm text-muted-foreground">
                          将支持实时预览生成的组件效果
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-96 w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Code className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    生成的代码将在这里显示
                  </p>
                  <p className="text-sm text-muted-foreground">
                    请在左侧输入提示并点击生成按钮
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 功能特性展示 */}
      <div className="space-y-6">
        <Separator />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">AI 代码生成特性</h2>
          <p className="text-muted-foreground">
            了解我们的 AI Agent 如何帮助您提高开发效率
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">智能生成</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                基于 V0 提示词规范，生成符合最佳实践的高质量代码
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">样式优化</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                自动应用 Tailwind CSS 和 shadcn/ui 组件，确保样式一致性
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">类型安全</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                生成完整的 TypeScript 类型定义，确保代码类型安全
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">可访问性</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                自动添加 ARIA 属性和语义化标签，符合 WCAG 标准
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemoPage;