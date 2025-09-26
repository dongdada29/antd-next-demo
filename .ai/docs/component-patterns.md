# AI Agent 组件模式指南

## 概述

本文档为 AI Agent 提供标准化的组件设计模式和最佳实践，基于 shadcn/ui + Tailwind CSS 技术栈。

## 组件分类和模式

### 1. 基础 UI 组件 (Primitive Components)

#### Button 组件模式
```typescript
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### 2. 复合组件 (Composite Components)

#### Form 组件模式
```typescript
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// 表单验证 Schema
const formSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
});

type FormData = z.infer<typeof formSchema>;

interface FormProps {
  onSubmit: (data: FormData) => void | Promise<void>;
  loading?: boolean;
  className?: string;
}

export function LoginForm({ onSubmit, loading = false, className }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          placeholder="请输入邮箱"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          type="password"
          placeholder="请输入密码"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </Button>
    </form>
  );
}
```

## AI Agent 使用指南

### 组件生成提示词模板
```
请基于以下要求生成一个 React 组件：

**组件类型**: [基础UI/复合/布局/状态管理]
**功能描述**: [具体功能需求]
**技术要求**:
- 使用 TypeScript 严格模式
- 基于 shadcn/ui 组件
- 使用 Tailwind CSS 样式
- 实现可访问性标准
- 支持 forwardRef 和 className
- 包含完整的类型定义

**样式要求**:
- 响应式设计
- 暗色模式支持
- 使用设计系统变量

请生成完整的组件代码，包括类型定义、样式变体和使用示例。
```

### 质量检查清单
- [ ] TypeScript 类型完整且正确
- [ ] 使用 forwardRef 和 displayName
- [ ] 支持 className 属性
- [ ] 实现可访问性标准
- [ ] 响应式设计
- [ ] 暗色模式支持
- [ ] 错误处理完善
- [ ] 性能优化考虑
- [ ] 代码注释清晰
- [ ] 使用示例完整