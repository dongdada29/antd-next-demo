# shadcn/ui 使用指南

## 概述

shadcn/ui 是一个基于 Radix UI 和 Tailwind CSS 构建的现代化组件库，提供了可复制粘贴的组件代码，而不是传统的 npm 包。

## 核心特性

- **可定制性**: 完全控制组件代码
- **可访问性**: 基于 Radix UI 的无障碍组件
- **类型安全**: 完整的 TypeScript 支持
- **主题系统**: 基于 CSS 变量的主题定制
- **响应式**: 内置 Tailwind CSS 响应式设计

## 安装和设置

### 1. 初始化 shadcn/ui

```bash
npx shadcn-ui@latest init
```

### 2. 添加组件

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
```

## 组件使用模式

### 基础组件

#### Button 组件
```tsx
import { Button } from '@/components/ui/button';

// 基础用法
<Button>点击我</Button>

// 变体
<Button variant="default">默认</Button>
<Button variant="destructive">危险</Button>
<Button variant="outline">轮廓</Button>
<Button variant="secondary">次要</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="link">链接</Button>

// 尺寸
<Button size="default">默认</Button>
<Button size="sm">小</Button>
<Button size="lg">大</Button>
<Button size="icon">图标</Button>

// 状态
<Button disabled>禁用</Button>
<Button loading>加载中</Button>
```

#### Input 组件
```tsx
import { Input } from '@/components/ui/input';

// 基础用法
<Input placeholder="请输入内容" />

// 类型
<Input type="email" placeholder="邮箱" />
<Input type="password" placeholder="密码" />
<Input type="number" placeholder="数字" />

// 状态
<Input disabled placeholder="禁用状态" />
<Input className="border-red-500" placeholder="错误状态" />
```

### 表单组件

#### 使用 React Hook Form + Zod
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  username: z.string().min(2, {
    message: "用户名至少需要2个字符。",
  }),
  email: z.string().email({
    message: "请输入有效的邮箱地址。",
  }),
});

function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="请输入用户名" {...field} />
              </FormControl>
              <FormDescription>
                这是您的公开显示名称。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input type="email" placeholder="请输入邮箱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  );
}
```

### 布局组件

#### Card 组件
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>
```

#### Dialog 组件
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">打开对话框</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>编辑资料</DialogTitle>
      <DialogDescription>
        在这里修改您的资料信息。完成后点击保存。
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          姓名
        </Label>
        <Input id="name" value="张三" className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">保存更改</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 数据展示组件

#### Table 组件
```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "已支付",
    totalAmount: "$250.00",
    paymentMethod: "信用卡",
  },
  // 更多数据...
];

<Table>
  <TableCaption>最近发票列表。</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">发票</TableHead>
      <TableHead>状态</TableHead>
      <TableHead>方式</TableHead>
      <TableHead className="text-right">金额</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((invoice) => (
      <TableRow key={invoice.invoice}>
        <TableCell className="font-medium">{invoice.invoice}</TableCell>
        <TableCell>{invoice.paymentStatus}</TableCell>
        <TableCell>{invoice.paymentMethod}</TableCell>
        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## 主题定制

### CSS 变量系统
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* 更多暗色主题变量... */
}
```

### 自定义主题
```tsx
// 在 globals.css 中定义自定义主题
.theme-blue {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}

.theme-green {
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
}

// 在组件中使用
<div className="theme-blue">
  <Button>蓝色主题按钮</Button>
</div>
```

## 响应式设计

### 断点系统
```tsx
// Tailwind CSS 断点
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>移动端单列，平板双列，桌面三列</Card>
</div>

// 响应式文本
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  响应式标题
</h1>

// 响应式间距
<div className="p-4 md:p-6 lg:p-8">
  响应式内边距
</div>
```

## 可访问性最佳实践

### 键盘导航
```tsx
// 自动支持键盘导航
<Button>可通过 Tab 键聚焦</Button>

// 自定义键盘事件
const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick?.();
  }
};
```

### ARIA 属性
```tsx
// 按钮状态
<Button aria-pressed={isPressed} aria-label="切换设置">
  设置
</Button>

// 表单字段
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>邮箱地址</FormLabel>
      <FormControl>
        <Input
          type="email"
          aria-describedby="email-description"
          {...field}
        />
      </FormControl>
      <FormDescription id="email-description">
        我们将使用此邮箱发送通知
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 性能优化

### 懒加载组件
```tsx
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const HeavyComponent = lazy(() => import('./heavy-component'));

function App() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-64" />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 组件优化
```tsx
import { memo } from 'react';

const OptimizedCard = memo(({ title, content }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {content}
    </CardContent>
  </Card>
));
```

## 常用组件组合

### 搜索框
```tsx
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

<div className="relative">
  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input placeholder="搜索..." className="pl-8" />
</div>
```

### 加载状态
```tsx
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  请稍候
</Button>
```

### 错误状态
```tsx
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>错误</AlertTitle>
  <AlertDescription>
    您的会话已过期。请重新登录。
  </AlertDescription>
</Alert>
```

## 最佳实践

### 1. 组件组合
- 使用组合模式而不是复杂的 props
- 保持组件的单一职责
- 使用 children 模式提高灵活性

### 2. 样式管理
- 使用 Tailwind CSS 实用类
- 利用 CSS 变量进行主题定制
- 保持样式的一致性

### 3. 类型安全
- 使用 TypeScript 进行类型检查
- 为自定义组件定义清晰的接口
- 利用 Zod 进行运行时验证

### 4. 可访问性
- 确保键盘导航支持
- 提供适当的 ARIA 标签
- 考虑屏幕阅读器用户

### 5. 性能
- 使用 React.memo 优化重渲染
- 实现适当的懒加载
- 避免不必要的重新计算

通过遵循这些指南，可以充分利用 shadcn/ui 的优势，构建现代化、可访问、高性能的用户界面。