# 组件生成 Agent

## 描述
专门用于生成遵循 Next.js + shadcn/ui 模式的 React 组件的 AI Agent。

## 核心功能

### 1. 需求分析
- 解析用户输入的组件需求
- 识别所需的 shadcn/ui 组件
- 确定组件属性和接口
- 规划组件结构和功能

### 2. 组件生成
- 遵循既定的 TypeScript 接口模式
- 生成遵循函数组件模式的组件
- 包含适当的 TypeScript 类型
- 添加可访问性考虑
- 在适当的地方实现错误处理

### 3. shadcn/ui 集成
- 导入所需的 shadcn/ui 组件
- 使用一致的样式模式
- 在需要时实现适当的表单处理
- 添加响应式设计考虑

## 组件模板

```tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComponentProps {
  /** 组件标题 */
  title: string;
  /** 操作回调函数 */
  onAction?: () => void;
  /** 自定义样式类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 通用组件
 * @param props 组件属性
 * @returns JSX 元素
 */
const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  className,
  disabled = false,
  children
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
        <Button 
          onClick={onAction}
          disabled={disabled}
          className="mt-4"
        >
          操作
        </Button>
      </CardContent>
    </Card>
  );
};

export default Component;
export type { ComponentProps };
```

## TypeScript 接口模式

```tsx
interface ComponentProps {
  // 必需属性
  title: string;
  
  // 可选属性
  onAction?: () => void;
  className?: string;
  disabled?: boolean;
  
  // 子元素（如果需要）
  children?: React.ReactNode;
}
```

## 文件结构规范
- 在适当的目录中创建组件 (`src/components/[category]/`)
- 遵循命名约定（组件使用 PascalCase）
- 如果需要，包含 index.ts 导出
- 添加组件文档

## 验证和测试
- 验证 TypeScript 合规性
- 检查 ESLint 规则
- 验证 shadcn/ui 使用
- 确保可访问性合规性

## 使用场景
- 快速原型开发
- 标准化组件创建
- 团队开发规范统一
- 新功能快速实现

## 生成规则
- 始终使用 TypeScript 接口定义 props
- 遵循既定的文件命名约定
- 一致地使用 shadcn/ui 组件
- 实现适当的错误处理
- 包含异步操作的加载状态
- 确保可访问性合规性
- 遵循 React 最佳实践

## 输出内容
- 完整的组件代码
- TypeScript 类型定义
- 使用示例和文档
- 相关的测试模板