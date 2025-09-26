# Codex/Copilot 优化提示词

## 系统级提示词 (Codex 专用)

```
React + Next.js + TypeScript expert using shadcn/ui + Tailwind CSS.

Codex strengths:
- Fast code generation
- Pattern recognition
- Efficient autocompletion
- Concise implementations

Focus on:
- Clean, minimal code
- Standard patterns
- Quick solutions
- Essential functionality

Tech stack:
- Next.js 14+ App Router
- shadcn/ui + Radix UI
- Tailwind CSS
- TypeScript strict mode
- React Hook Form + Zod
- TanStack Query
- pnpm package manager

Code style:
- Use forwardRef + displayName
- Support className prop
- Use cva for variants
- Minimal but clear comments
- Essential error handling
```

## 快速组件生成 (Codex 优化版)

### 基础组件模板
```typescript
// Generate a {ComponentName} component with shadcn/ui + Tailwind
// Requirements: forwardRef, displayName, className support, cva variants

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const {componentName}Variants = cva(
  // base styles
  '',
  {
    variants: {
      variant: {
        default: '',
        // add variants
      },
      size: {
        default: '',
        // add sizes
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface {ComponentName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof {componentName}Variants> {}

const {ComponentName} = React.forwardRef<HTMLDivElement, {ComponentName}Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn({componentName}Variants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
{ComponentName}.displayName = '{ComponentName}';

export { {ComponentName} };
```

### 表单组件模板
```typescript
// Generate form component with React Hook Form + Zod
// Keep it simple and functional

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  // define schema
});

type FormData = z.infer<typeof formSchema>;

interface {FormName}Props {
  onSubmit: (data: FormData) => void;
}

export function {FormName}({ onSubmit }: {FormName}Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* form fields */}
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## 快速修复模式 (Codex 专用)

### 常见修复模式
```typescript
// Fix TypeScript errors
// Add missing imports
// Fix prop types
// Add error handling
// Optimize performance

// Example fixes:
import { type ComponentProps } from 'react';
const Component = React.memo(({ ...props }) => { /* */ });
```

### 性能优化模式
```typescript
// Quick performance fixes
import { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ data, onClick }) => {
  const processedData = useMemo(() => 
    data.map(item => ({ ...item, processed: true })), 
    [data]
  );
  
  const handleClick = useCallback((id: string) => 
    onClick(id), 
    [onClick]
  );
  
  return <div>{/* component */}</div>;
});
```

## 原型开发模式 (Codex 专用)

### 快速页面生成
```typescript
// Generate page component quickly
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '{PageTitle}',
};

export default function {PageName}Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{PageTitle}</h1>
      {/* page content */}
    </div>
  );
}
```

### 快速 Hook 生成
```typescript
// Generate custom hook
'use client';

import { useState, useEffect } from 'react';

export function use{HookName}() {
  const [state, setState] = useState();
  
  useEffect(() => {
    // effect logic
  }, []);
  
  return { state, setState };
}
```

## API 集成模式 (Codex 专用)

### 快速 API 调用
```typescript
// Generate API service
export async function fetch{Resource}() {
  const response = await fetch('/api/{resource}');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

// With TanStack Query
import { useQuery } from '@tanstack/react-query';

export function use{Resource}() {
  return useQuery({
    queryKey: ['{resource}'],
    queryFn: fetch{Resource},
  });
}
```

### 快速表单提交
```typescript
// Generate form submission
import { useMutation } from '@tanstack/react-query';

export function useCreate{Resource}() {
  return useMutation({
    mutationFn: async (data: {ResourceType}) => {
      const response = await fetch('/api/{resource}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create');
      return response.json();
    },
  });
}
```

## 样式快速生成 (Codex 专用)

### Tailwind 常用模式
```css
/* Layout patterns */
.container { @apply mx-auto max-w-7xl px-4; }
.flex-center { @apply flex items-center justify-center; }
.grid-auto { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4; }

/* Component patterns */
.btn-primary { @apply bg-primary text-primary-foreground hover:bg-primary/90; }
.card { @apply rounded-lg border bg-card text-card-foreground shadow-sm; }
.input { @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2; }
```

### 响应式模式
```typescript
// Responsive component patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div className="flex flex-col md:flex-row gap-4">
<div className="w-full md:w-1/2 lg:w-1/3">
<div className="text-sm md:text-base lg:text-lg">
<div className="p-4 md:p-6 lg:p-8">
```

## 测试快速生成 (Codex 专用)

### 基础测试模板
```typescript
// Generate basic component test
import { render, screen } from '@testing-library/react';
import { {ComponentName} } from './{component-name}';

describe('{ComponentName}', () => {
  it('renders correctly', () => {
    render(<{ComponentName}>Test</{ComponentName}>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applies className', () => {
    render(<{ComponentName} className="test">Content</{ComponentName}>);
    expect(screen.getByText('Content')).toHaveClass('test');
  });
});
```

### 交互测试模板
```typescript
// Generate interaction test
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

it('handles click', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  
  render(<Button onClick={handleClick}>Click me</Button>);
  await user.click(screen.getByText('Click me'));
  
  expect(handleClick).toHaveBeenCalled();
});
```

## Codex 使用技巧

### 1. 简洁的提示词
```
// 使用简短、明确的注释
// Create button component
// Add form validation
// Fix TypeScript error
// Optimize performance
```

### 2. 模式识别
```typescript
// 利用 Codex 的模式识别能力
const [state, setState] = useState(); // Codex 会自动补全相关逻辑
useEffect(() => {}, []); // 自动识别依赖数组
```

### 3. 快速迭代
```typescript
// 先生成基础版本，再逐步完善
// v1: Basic component
// v2: Add props
// v3: Add variants
// v4: Add tests
```

### 4. 利用上下文
```typescript
// 在相似文件中工作，让 Codex 学习项目模式
// 保持一致的命名和结构
// 使用项目中已有的工具函数
```