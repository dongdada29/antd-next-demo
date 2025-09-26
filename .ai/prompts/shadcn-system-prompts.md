# AI Agent 提示词系统和代码生成指引

## 概述

本文档基于 [V0 系统提示词](https://github.com/2-fly-4-ai/V0-system-prompt/) 规范，为 AI Agent 提供标准化的代码生成指引，确保生成的代码符合 shadcn/ui + Tailwind CSS 项目规范。

## 核心原则

### 1. 技术栈优先级
- **UI 组件**: 优先使用 shadcn/ui 组件
- **样式**: 优先使用 Tailwind CSS 实用类
- **状态管理**: 使用 React Hooks 和 Context
- **类型安全**: 完整的 TypeScript 类型定义
- **性能**: 考虑懒加载和代码分割

### 2. 代码质量标准
- 遵循 ESLint 和 Prettier 配置
- 使用语义化的变量和函数命名
- 提供完整的 JSDoc 注释
- 实现适当的错误处理
- 考虑可访问性要求

## AI Agent 提示词模板

### 基础组件生成提示词

```
你是一个专业的 React + TypeScript 开发专家，专门使用 shadcn/ui + Tailwind CSS 技术栈。

请根据以下要求生成组件代码：

**技术要求：**
- 使用 shadcn/ui 组件作为基础构建块
- 使用 Tailwind CSS 实用类进行样式设计
- 提供完整的 TypeScript 类型定义
- 遵循 React 最佳实践和 Hooks 模式
- 确保组件的可访问性（ARIA 标签、键盘导航）

**代码规范：**
- 使用函数式组件和 React.forwardRef
- 使用 class-variance-authority (cva) 处理组件变体
- 使用 clsx 或 cn 工具函数合并类名
- 提供 JSDoc 注释和使用示例
- 实现适当的默认值和错误处理

**样式指引：**
- 优先使用 Tailwind CSS 预设类
- 使用 CSS 变量进行主题定制
- 实现响应式设计（sm:, md:, lg:, xl:）
- 支持暗色模式（dark: 前缀）
- 遵循设计系统的间距和颜色规范

请生成：[具体组件需求]
```

### 页面组件生成提示词

```
你是一个专业的 Next.js + React 开发专家，使用 shadcn/ui + Tailwind CSS 技术栈。

请创建一个完整的页面组件，要求：

**架构要求：**
- 使用 Next.js App Router 模式
- 实现适当的 SEO 优化（metadata）
- 使用 React Server Components 和 Client Components
- 实现错误边界和加载状态
- 考虑性能优化（懒加载、代码分割）

**UI 要求：**
- 使用 shadcn/ui 组件构建界面
- 实现响应式布局设计
- 提供良好的用户体验（加载状态、错误提示）
- 遵循可访问性标准
- 支持暗色模式切换

**数据处理：**
- 使用 React Query 或 SWR 进行数据获取
- 实现适当的缓存策略
- 处理加载、错误和空状态
- 提供数据验证和类型安全

请生成：[具体页面需求]
```

### 表单组件生成提示词

```
你是一个专业的表单开发专家，使用 React Hook Form + shadcn/ui + Tailwind CSS。

请创建一个表单组件，要求：

**表单架构：**
- 使用 React Hook Form 进行表单管理
- 使用 Zod 进行数据验证
- 集成 shadcn/ui 表单组件
- 实现实时验证和错误提示
- 提供良好的用户体验

**组件要求：**
- 使用 shadcn/ui Form, Input, Button 等组件
- 实现字段验证和错误显示
- 支持不同的输入类型（文本、选择、日期等）
- 提供加载状态和提交反馈
- 确保可访问性（标签、错误关联）

**样式设计：**
- 使用 Tailwind CSS 进行布局
- 实现响应式表单设计
- 提供视觉反馈（焦点、错误、成功状态）
- 遵循设计系统规范

请生成：[具体表单需求]
```

### 数据表格生成提示词

```
你是一个专业的数据表格开发专家，使用 shadcn/ui + TanStack Table + Tailwind CSS。

请创建一个数据表格组件，要求：

**表格功能：**
- 使用 shadcn/ui Table 组件
- 集成 TanStack Table 进行数据管理
- 实现排序、筛选、分页功能
- 支持行选择和批量操作
- 提供搜索和导出功能

**性能优化：**
- 实现虚拟滚动（大数据集）
- 使用 React.memo 优化渲染
- 实现懒加载和分页
- 提供加载状态和骨架屏

**用户体验：**
- 响应式表格设计
- 提供空状态和错误状态
- 实现可访问的表格导航
- 支持键盘操作

请生成：[具体表格需求]
```

## 代码生成规范

### 1. 组件结构模板

```typescript
'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 组件变体定义
const componentVariants = cva(
  // 基础样式
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        sm: "small-styles",
        md: "medium-styles",
        lg: "large-styles",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// 组件 Props 接口
interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // 自定义 props
}

/**
 * 组件描述和使用说明
 * 
 * @example
 * ```tsx
 * <Component variant="default" size="md">
 *   Content
 * </Component>
 * ```
 */
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";

export { Component, componentVariants };
export type { ComponentProps };
```

### 2. 页面组件模板

```typescript
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// SEO 元数据
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// 页面组件
export default function PageName() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          {/* 页面内容 */}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
```

### 3. Hooks 模板

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseCustomHookOptions {
  // 选项接口
}

interface UseCustomHookReturn {
  // 返回值接口
}

/**
 * 自定义 Hook 描述
 * 
 * @param options - Hook 选项
 * @returns Hook 返回值
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useCustomHook({ option: 'value' });
 * ```
 */
export function useCustomHook(options: UseCustomHookOptions): UseCustomHookReturn {
  // Hook 实现
  
  return {
    // 返回值
  };
}
```

## 样式指引

### 1. Tailwind CSS 类名优先级

```css
/* 布局 */
.container, .flex, .grid, .block, .inline

/* 间距 */
.p-*, .m-*, .space-*, .gap-*

/* 尺寸 */
.w-*, .h-*, .min-*, .max-*

/* 颜色 */
.bg-*, .text-*, .border-*

/* 响应式 */
.sm:*, .md:*, .lg:*, .xl:*, .2xl:*

/* 状态 */
.hover:*, .focus:*, .active:*, .disabled:*

/* 暗色模式 */
.dark:*
```

### 2. 设计 Token 使用

```typescript
// 颜色系统
const colors = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
};

// 间距系统
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

// 圆角系统
const borderRadius = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
};
```

## 可访问性指引

### 1. ARIA 属性

```typescript
// 按钮组件
<button
  aria-label="操作描述"
  aria-describedby="help-text"
  aria-pressed={isPressed}
  disabled={isDisabled}
>
  按钮文本
</button>

// 表单字段
<input
  aria-label="字段标签"
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-message" : "help-text"}
/>
```

### 2. 键盘导航

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
  }
};
```

## 性能优化指引

### 1. 组件懒加载

```typescript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./heavy-component'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 2. 记忆化优化

```typescript
import { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);

  const handleAction = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  return (
    // 组件 JSX
  );
});
```

## 测试指引

### 1. 组件测试模板

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component>Test content</Component>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('handles interactions', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick}>Click me</Component>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('supports accessibility', () => {
    render(<Component aria-label="Test component">Content</Component>);
    expect(screen.getByLabelText('Test component')).toBeInTheDocument();
  });
});
```

## 错误处理指引

### 1. 错误边界

```typescript
'use client';

import React from 'react';

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
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-destructive">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Please try refreshing the page
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 总结

本提示词系统基于 V0 规范，为 AI Agent 提供了完整的代码生成指引。通过遵循这些模板和规范，AI Agent 能够生成高质量、一致性的 shadcn/ui + Tailwind CSS 代码，确保项目的可维护性和开发效率。