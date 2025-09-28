'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Copy,
  Eye,
  Code,
  Palette,
  Layout,
  Zap,
  Star,
  Heart,
  MessageSquare,
  Settings,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

const ComponentShowcasePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('buttons');
  const [progressValue, setProgressValue] = useState(33);
  const [sliderValue, setSliderValue] = useState([50]);

  const componentCategories = {
    buttons: {
      title: '按钮组件',
      icon: <Zap className="h-4 w-4" />,
      description: '各种样式和状态的按钮组件'
    },
    inputs: {
      title: '输入组件',
      icon: <Layout className="h-4 w-4" />,
      description: '表单输入和交互组件'
    },
    display: {
      title: '展示组件',
      icon: <Eye className="h-4 w-4" />,
      description: '数据展示和信息呈现组件'
    },
    feedback: {
      title: '反馈组件',
      icon: <MessageSquare className="h-4 w-4" />,
      description: '用户反馈和状态提示组件'
    },
    layout: {
      title: '布局组件',
      icon: <Layout className="h-4 w-4" />,
      description: '页面布局和容器组件'
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('代码已复制到剪贴板');
  };

  const ButtonShowcase = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">基础按钮</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <Card className="p-4">
          <pre className="text-sm overflow-x-auto">
            <code>{`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`}</code>
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => copyCode(`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`)}
          >
            <Copy className="h-4 w-4 mr-1" />
            复制代码
          </Button>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">按钮尺寸</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">带图标的按钮</h3>
        <div className="flex flex-wrap gap-4">
          <Button>
            <Star className="h-4 w-4 mr-2" />
            收藏
          </Button>
          <Button variant="outline">
            <Heart className="h-4 w-4 mr-2" />
            喜欢
          </Button>
          <Button variant="secondary">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">按钮状态</h3>
        <div className="flex flex-wrap gap-4">
          <Button disabled>禁用状态</Button>
          <Button>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            加载中
          </Button>
        </div>
      </div>
    </div>
  );

  const InputShowcase = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">基础输入</h3>
        <div className="grid gap-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" placeholder="输入您的邮箱" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" placeholder="输入密码" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">禁用输入</Label>
            <Input id="disabled" disabled placeholder="禁用状态" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">文本区域</h3>
        <div className="max-w-md">
          <Textarea placeholder="输入您的消息..." rows={4} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">开关和滑块</h3>
        <div className="space-y-4 max-w-md">
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications">启用通知</Label>
          </div>
          <div className="space-y-2">
            <Label>音量: {sliderValue[0]}%</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const DisplayShowcase = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">徽章</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">头像</h3>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">进度条</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>进度</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="w-full" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>
              -10%
            </Button>
            <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>
              +10%
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">用户卡片示例</h3>
        <Card className="max-w-md">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="用户头像" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">张三</CardTitle>
              <CardDescription>前端开发工程师</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              zhangsan@example.com
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              +86 138 0013 8000
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              北京市朝阳区
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-1" />
                发消息
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <User className="h-4 w-4 mr-1" />
                查看资料
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const FeedbackShowcase = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">警告提示</h3>
        <div className="space-y-4 max-w-2xl">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>信息提示</AlertTitle>
            <AlertDescription>
              这是一个信息提示，用于向用户传达重要信息。
            </AlertDescription>
          </Alert>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>成功提示</AlertTitle>
            <AlertDescription>
              操作已成功完成，您可以继续下一步操作。
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误提示</AlertTitle>
            <AlertDescription>
              发生了一个错误，请检查您的输入并重试。
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>警告提示</AlertTitle>
            <AlertDescription>
              请注意，此操作可能会影响您的数据，请谨慎操作。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );

  const LayoutShowcase = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">卡片布局</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>基础卡片</CardTitle>
              <CardDescription>
                这是一个基础的卡片组件示例
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                卡片内容区域，可以放置任何内容。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                带图标卡片
              </CardTitle>
              <CardDescription>
                标题带有图标的卡片样式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">1,234</span>
                <Badge variant="secondary">+12%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>交互卡片</CardTitle>
              <CardDescription>
                包含交互元素的卡片
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="card-switch" />
                <Label htmlFor="card-switch">启用功能</Label>
              </div>
              <Button className="w-full">
                执行操作
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">分隔符</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">水平分隔符</p>
            <Separator />
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">垂直分隔符</p>
            <Separator orientation="vertical" className="h-4" />
            <p className="text-sm text-muted-foreground">内容</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">滚动区域</h3>
        <ScrollArea className="h-48 w-full rounded-md border p-4">
          <div className="space-y-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{i + 1}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">用户 {i + 1}</p>
                  <p className="text-xs text-muted-foreground">
                    这是第 {i + 1} 个用户的描述信息
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const renderComponentShowcase = () => {
    switch (selectedComponent) {
      case 'buttons':
        return <ButtonShowcase />;
      case 'inputs':
        return <InputShowcase />;
      case 'display':
        return <DisplayShowcase />;
      case 'feedback':
        return <FeedbackShowcase />;
      case 'layout':
        return <LayoutShowcase />;
      default:
        return <ButtonShowcase />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              组件库展示
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            探索我们基于 shadcn/ui 构建的完整组件库，所有组件都经过精心设计，支持暗色模式和完全的可访问性。
          </p>
          
          {/* 暗色模式切换 */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <Label htmlFor="dark-mode">暗色模式</Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* 侧边栏导航 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>组件分类</CardTitle>
              <CardDescription>
                选择要查看的组件类型
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(componentCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedComponent === key ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedComponent(key)}
                >
                  {category.icon}
                  <span className="ml-2">{category.title}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {componentCategories[selectedComponent as keyof typeof componentCategories].icon}
                  {componentCategories[selectedComponent as keyof typeof componentCategories].title}
                </CardTitle>
                <CardDescription>
                  {componentCategories[selectedComponent as keyof typeof componentCategories].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderComponentShowcase()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-center space-y-4 pt-8">
          <Separator />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold">设计系统</h3>
              <p className="text-sm text-muted-foreground">
                基于 shadcn/ui 和 Tailwind CSS 构建的一致性设计系统
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">可访问性</h3>
              <p className="text-sm text-muted-foreground">
                所有组件都符合 WCAG 2.1 AA 标准，支持键盘导航和屏幕阅读器
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">响应式设计</h3>
              <p className="text-sm text-muted-foreground">
                完全响应式设计，在所有设备上都能完美显示
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcasePage;