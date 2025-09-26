# AI Agent 提示词和代码生成指引

## 概述

本文档基于 v0 提示词方案，为 AI Agent 提供标准化的代码生成指引，确保生成的代码符合 shadcn/ui + Tailwind CSS 最佳实践。

## 核心原则

### 1. 组件优先原则
- 优先使用 shadcn/ui 组件作为基础构建块
- 避免从零开始创建基础 UI 组件
- 通过组合和扩展现有组件来实现复杂功能

### 2. Tailwind CSS 优先原则
- 优先使用 Tailwind CSS 实用类
- 避免编写自定义 CSS，除非绝对必要
- 使用 Tailwind 的设计系统（间距、颜色、字体等）

### 3. TypeScript 严格模式
- 所有组件必须有完整的类型定义
- 使用泛型提高组件复用性
- 提供清晰的接口文档

## AI Agent 提示词模板

### 基础组件创建提示词

```
你是一个专业的 React + TypeScript 开发者，专门使用 shadcn/ui 和 Tailwind CSS 创建现代化的 UI 组件。

请遵循以下规范：

1. **组件结构**：
   - 使用 shadcn/ui 组件作为基础
   - 采用组合模式而非继承
   - 保持组件的单一职责

2. **样式规范**：
   - 只使用 Tailwind CSS 类名
   - 使用语义化的颜色变量（如 primary、secondary）
   - 遵循响应式设计原则

3. **TypeScript 规范**：
   - 定义清晰的 Props 接口
   - 使用泛型提高复用性
   - 添加 JSDoc 注释

4. **可访问性**：
   - 添加适当的 ARIA 属性
   - 支持键盘导航
   - 确保颜色对比度符合标准

请创建一个 [组件名称] 组件，要求：[具体需求]
```

### 页面组件创建提示词

```
你是一个专业的 Next.js + React 开发者，使用 shadcn/ui 和 Tailwind CSS 创建现代化的页面组件。

请遵循以下规范：

1. **页面结构**：
   - 使用语义化的 HTML 标签
   - 采用现代布局技术（Flexbox、Grid）
   - 确保响应式设计

2. **组件组合**：
   - 使用 shadcn/ui 组件构建页面
   - 保持组件的可复用性
   - 合理拆分子组件

3. **状态管理**：
   - 使用 React Hooks 管理状态
   - 合理使用 Context 共享状态
   - 实现适当的错误边界

4. **性能优化**：
   - 使用 React.memo 优化渲染
   - 实现懒加载和代码分割
   - 优化图片和资源加载

请创建一个 [页面名称] 页面，包含：[页面功能描述]
```

### 表单组件创建提示词

```
你是一个专业的表单开发专家，使用 shadcn/ui、Tailwind CSS 和 react-hook-form 创建高质量的表单组件。

请遵循以下规范：

1. **表单结构**：
   - 使用 react-hook-form 管理表单状态
   - 使用 zod 进行表单验证
   - 采用 shadcn/ui Form 组件

2. **用户体验**：
   - 提供实时验证反馈
   - 显示清晰的错误信息
   - 支持键盘导航和提交

3. **可访问性**：
   - 正确关联 label 和 input
   - 提供 aria-describedby 错误描述
   - 支持屏幕阅读器

4. **样式设计**：
   - 使用一致的间距和布局
   - 提供视觉反馈（focus、error 状态）
   - 响应式设计适配移动端

请创建一个 [表单名称] 表单，包含字段：[字段列表和验证规则]
```

## 代码生成模板

### 基础组件模板

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

// 组件变体定义
const componentVariants = cva(
  // 基础样式
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-variant-classes",
        secondary: "secondary-variant-classes",
      },
      size: {
        sm: "small-size-classes",
        md: "medium-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Props 接口定义
interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  /**
   * 组件的主要内容
   */
  children?: React.ReactNode;
  
  /**
   * 是否禁用组件
   */
  disabled?: boolean;
}

/**
 * [组件名称] - [组件描述]
 * 
 * @example
 * ```tsx
 * <Component variant="default" size="md">
 *   Content here
 * </Component>
 * ```
 */
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, children, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Component.displayName = "Component";

export { Component, type ComponentProps };
```

### 页面组件模板

```typescript
'use client';

import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// 页面元数据
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
};

// 页面 Props 接口
interface PageProps {
  params: {
    // 动态路由参数
  };
  searchParams: {
    // 查询参数
  };
}

/**
 * [页面名称] - [页面描述]
 */
export default function Page({ params, searchParams }: PageProps) {
  // 状态管理
  const [loading, setLoading] = React.useState(false);
  
  // 事件处理
  const handleAction = async () => {
    setLoading(true);
    try {
      // 处理逻辑
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
          <p className="text-muted-foreground">Page description</p>
        </div>
        <Button onClick={handleAction} disabled={loading}>
          {loading ? 'Loading...' : 'Action'}
        </Button>
      </div>

      <Separator />

      {/* 页面内容 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Section Title</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 内容区域 */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 表单组件模板

```typescript
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 表单验证 Schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// 表单 Props 接口
interface FormComponentProps {
  onSubmit: (values: FormValues) => Promise<void>;
  defaultValues?: Partial<FormValues>;
  disabled?: boolean;
}

/**
 * [表单名称] - [表单描述]
 */
export function FormComponent({ 
  onSubmit, 
  defaultValues, 
  disabled = false 
}: FormComponentProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      ...defaultValues,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      disabled={disabled}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This is your display name.
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Enter your email" 
                      disabled={disabled}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={disabled || form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

## 样式指引

### Tailwind CSS 最佳实践

1. **布局类**：
   ```css
   /* 容器 */
   .container mx-auto px-4
   
   /* Flexbox */
   .flex items-center justify-between
   .flex-col space-y-4
   
   /* Grid */
   .grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
   ```

2. **间距系统**：
   ```css
   /* 内边距 */
   .p-4 .px-6 .py-2
   
   /* 外边距 */
   .m-4 .mx-auto .my-6
   
   /* 间距 */
   .space-y-4 .space-x-2
   ```

3. **颜色系统**：
   ```css
   /* 主色调 */
   .bg-primary .text-primary-foreground
   
   /* 语义化颜色 */
   .bg-destructive .text-destructive-foreground
   .bg-success .text-success-foreground
   
   /* 中性色 */
   .bg-muted .text-muted-foreground
   ```

4. **响应式设计**：
   ```css
   /* 断点前缀 */
   .sm:text-sm .md:grid-cols-2 .lg:px-8 .xl:max-w-6xl
   
   /* 移动优先 */
   .text-sm md:text-base lg:text-lg
   ```

### 组件组合模式

1. **卡片布局**：
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>Title</CardTitle>
       <CardDescription>Description</CardDescription>
     </CardHeader>
     <CardContent>
       Content here
     </CardContent>
     <CardFooter>
       <Button>Action</Button>
     </CardFooter>
   </Card>
   ```

2. **表单布局**：
   ```tsx
   <Form {...form}>
     <form className="space-y-6">
       <FormField>
         <FormItem>
           <FormLabel />
           <FormControl>
             <Input />
           </FormControl>
           <FormMessage />
         </FormItem>
       </FormField>
     </form>
   </Form>
   ```

3. **对话框模式**：
   ```tsx
   <Dialog>
     <DialogTrigger asChild>
       <Button>Open</Button>
     </DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Title</DialogTitle>
         <DialogDescription>Description</DialogDescription>
       </DialogHeader>
       Content
       <DialogFooter>
         <Button>Action</Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
   ```

## 性能优化指引

### 1. 组件优化
```typescript
// 使用 React.memo 优化渲染
const OptimizedComponent = React.memo(Component);

// 使用 useMemo 缓存计算结果
const memoizedValue = React.useMemo(() => {
  return expensiveCalculation(props);
}, [props]);

// 使用 useCallback 缓存函数
const memoizedCallback = React.useCallback(() => {
  handleAction();
}, [dependency]);
```

### 2. 懒加载
```typescript
// 动态导入组件
const LazyComponent = React.lazy(() => import('./Component'));

// 使用 Suspense 包装
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

### 3. 代码分割
```typescript
// 路由级别的代码分割
const HomePage = React.lazy(() => import('./pages/Home'));
const AboutPage = React.lazy(() => import('./pages/About'));
```

## 可访问性指引

### 1. ARIA 属性
```tsx
// 按钮状态
<Button aria-pressed={isPressed} aria-expanded={isExpanded}>
  Toggle
</Button>

// 表单标签
<Label htmlFor="email">Email</Label>
<Input id="email" aria-describedby="email-error" />
<div id="email-error" role="alert">Error message</div>

// 导航
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/" aria-current="page">Home</a></li>
  </ul>
</nav>
```

### 2. 键盘导航
```typescript
// 键盘事件处理
const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};

// 焦点管理
const focusRef = React.useRef<HTMLButtonElement>(null);

React.useEffect(() => {
  if (isOpen) {
    focusRef.current?.focus();
  }
}, [isOpen]);
```

### 3. 语义化标签
```tsx
// 使用正确的语义化标签
<main>
  <article>
    <header>
      <h1>Article Title</h1>
      <time dateTime="2023-12-01">December 1, 2023</time>
    </header>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>
```

## 错误处理指引

### 1. 错误边界
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### 2. 异步错误处理
```typescript
const [error, setError] = React.useState<string | null>(null);
const [loading, setLoading] = React.useState(false);

const handleAsyncAction = async () => {
  setLoading(true);
  setError(null);
  
  try {
    await asyncOperation();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

## 测试指引

### 1. 组件测试
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component>Test content</Component>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick}>Click me</Component>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. 可访问性测试
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

这个 AI Agent 提示词和代码生成指引文档提供了完整的规范和模板，确保 AI Agent 能够生成高质量、一致性的 shadcn/ui + Tailwind CSS 代码。