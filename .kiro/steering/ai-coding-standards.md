# AI Agent 编码规范

## 概述

本文档为 AI Agent 提供标准化的编码规范和最佳实践，确保生成的代码质量和一致性。

## 核心原则

### 1. 技术栈规范
- **框架**: Next.js 14+ (App Router)
- **UI 库**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **语言**: TypeScript (严格模式)
- **状态管理**: React Hooks + Context
- **表单**: React Hook Form + Zod
- **数据获取**: TanStack Query

### 2. 代码质量标准
- 使用 TypeScript 严格模式，所有代码必须有类型定义
- 遵循 ESLint 和 Prettier 配置
- 使用语义化的变量和函数命名
- 提供完整的 JSDoc 注释
- 实现适当的错误处理和边界情况

### 3. 组件设计原则
- 优先使用 shadcn/ui 组件作为基础
- 使用 `forwardRef` 和 `displayName`
- 实现 `className` 属性支持自定义样式
- 使用 `cva` (class-variance-authority) 处理变体
- 确保组件的可访问性 (ARIA 标签、键盘导航)

## 文件命名规范

### 组件文件
```
// 正确
button.tsx
user-profile.tsx
data-table.tsx

// 错误
Button.tsx
userProfile.tsx
DataTable.tsx
```

### 页面文件
```
// App Router 页面
app/dashboard/page.tsx
app/users/[id]/page.tsx
app/(auth)/login/page.tsx
```

### 工具文件
```
// 工具函数
lib/utils.ts
lib/api-client.ts
lib/validation.ts

// Hooks
hooks/use-local-storage.ts
hooks/use-api-query.ts
```

## 组件结构模板

### 基础组件模板
```typescript
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const componentVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean;
}

/**
 * 组件描述
 * 
 * @example
 * ```tsx
 * <Component variant="default" size="md">
 *   Content
 * </Component>
 * ```
 */
const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Component.displayName = 'Component';

export { Component, componentVariants };
export type { ComponentProps };
```

## 样式规范

### Tailwind CSS 使用原则
1. **优先使用 Tailwind 预设类**
2. **使用语义化的 CSS 变量**
3. **实现响应式设计**
4. **支持暗色模式**

### 常用样式模式
```css
/* 布局 */
.container { @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8; }
.flex-center { @apply flex items-center justify-center; }
.grid-responsive { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6; }

/* 间距 */
.space-section { @apply space-y-8; }
.space-content { @apply space-y-4; }
.space-tight { @apply space-y-2; }

/* 文本 */
.text-heading { @apply text-2xl font-bold tracking-tight; }
.text-body { @apply text-base text-muted-foreground; }
.text-caption { @apply text-sm text-muted-foreground; }
```

## 可访问性规范

### ARIA 属性
```typescript
// 按钮
<button
  aria-label="关闭对话框"
  aria-describedby="dialog-description"
  aria-expanded={isOpen}
>

// 表单字段
<input
  aria-label="用户名"
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-message" : "help-text"}
/>

// 导航
<nav aria-label="主导航">
  <ul role="list">
    <li><a href="/" aria-current="page">首页</a></li>
  </ul>
</nav>
```

### 键盘导航
```typescript
const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onClick?.();
      break;
    case 'Escape':
      onClose?.();
      break;
    case 'ArrowDown':
      focusNext();
      break;
    case 'ArrowUp':
      focusPrevious();
      break;
  }
};
```

## 性能优化规范

### 组件优化
```typescript
// 使用 memo 优化重渲染
const OptimizedComponent = React.memo(({ data, onAction }) => {
  const processedData = React.useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);

  const handleAction = React.useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  return <div>{/* 组件内容 */}</div>;
});

// 懒加载组件
const LazyComponent = React.lazy(() => import('./heavy-component'));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}
```

### 图片优化
```typescript
import Image from 'next/image';

// 使用 Next.js Image 组件
<Image
  src="/placeholder.svg"
  alt="描述"
  width={400}
  height={300}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

## 错误处理规范

### 错误边界
```typescript
'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div className="text-center">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              Please try refreshing the page
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 测试规范

### 组件测试
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './component';

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

  it('supports accessibility', () => {
    render(<Component aria-label="Test component">Content</Component>);
    expect(screen.getByLabelText('Test component')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Component className="custom-class">Content</Component>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });
});
```

## 文档规范

### JSDoc 注释
```typescript
/**
 * 用户资料卡片组件
 * 
 * @param user - 用户信息对象
 * @param onEdit - 编辑按钮点击回调
 * @param className - 自定义样式类名
 * 
 * @example
 * ```tsx
 * <UserProfileCard
 *   user={{ name: 'John', email: 'john@example.com' }}
 *   onEdit={() => console.log('Edit clicked')}
 *   className="mb-4"
 * />
 * ```
 */
```

### README 文档
每个组件目录应包含 README.md 文件，说明：
- 组件用途和功能
- API 接口和属性
- 使用示例
- 注意事项和限制

## AI Agent 特殊要求

### 代码生成提示
1. **始终包含 TypeScript 类型**
2. **提供完整的导入语句**
3. **包含错误处理逻辑**
4. **添加适当的注释和文档**
5. **考虑可访问性要求**
6. **实现响应式设计**
7. **支持暗色模式**

### 质量检查清单
- [ ] TypeScript 类型完整
- [ ] ESLint 规则通过
- [ ] 可访问性标准符合
- [ ] 响应式设计实现
- [ ] 错误处理完善
- [ ] 性能优化考虑
- [ ] 测试覆盖充分
- [ ] 文档说明清晰