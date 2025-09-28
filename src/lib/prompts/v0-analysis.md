# V0 提示词规范分析

## 概述

本文档分析了 V0 系统提示词的核心原则和模式，为本项目的 AI Agent 代码生成提供指导。

## V0 核心原则

### 1. 组件优先原则
- 优先使用现有的 UI 组件库（如 shadcn/ui）
- 避免从零开始创建基础组件
- 组件应该是可复用和可组合的

### 2. 样式系统原则
- 优先使用 Tailwind CSS 实用类
- 避免内联样式和自定义 CSS
- 使用语义化的类名和设计系统

### 3. TypeScript 优先
- 所有组件必须有完整的类型定义
- 使用严格的 TypeScript 配置
- 提供清晰的接口和类型注释

### 4. 可访问性原则
- 所有交互元素必须支持键盘导航
- 提供适当的 ARIA 标签和语义化标签
- 支持屏幕阅读器和辅助技术

### 5. 性能优化原则
- 使用 React 最佳实践（memo, useMemo, useCallback）
- 实现代码分割和懒加载
- 优化包大小和运行时性能

## V0 组件生成模式

### 基础组件模式
```typescript
// V0 推荐的基础组件结构
interface ComponentProps {
  // 明确的属性定义
  variant?: 'default' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Component = ({ variant = 'default', size = 'md', ...props }: ComponentProps) => {
  return (
    <div 
      className={cn(
        // 基础样式
        "base-styles",
        // 变体样式
        variants[variant],
        // 尺寸样式
        sizes[size],
        // 自定义样式
        props.className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
};
```

### 复合组件模式
```typescript
// V0 推荐的复合组件结构
const FormComponent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>表单标题</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field1">字段1</Label>
              <Input id="field1" placeholder="请输入..." />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
```

## V0 样式应用最佳实践

### 1. 布局样式
- 使用 Flexbox 和 Grid 进行布局
- 优先使用 Tailwind 的间距系统
- 实现响应式设计

### 2. 颜色系统
- 使用语义化的颜色变量
- 支持暗色模式
- 保持颜色对比度符合可访问性标准

### 3. 动画和交互
- 使用 Tailwind 的过渡类
- 实现微交互和状态反馈
- 保持动画性能优化

## 适用于本项目的提示词模板

### 系统级提示词模板
```
你是一个专业的 React + Next.js + TypeScript 开发专家，专门使用 shadcn/ui + Tailwind CSS 技术栈。

核心原则：
1. 优先使用 shadcn/ui 组件作为基础构建块
2. 使用 Tailwind CSS 进行样式设计，避免自定义 CSS
3. 确保完整的 TypeScript 类型定义和类型安全
4. 实现 WCAG 2.1 AA 级可访问性标准
5. 应用 React 性能优化最佳实践
6. 使用现代 CSS 布局技术（Flexbox、Grid）
7. 实现响应式设计和暗色模式支持

代码风格：
- 使用函数式组件和 React Hooks
- 应用组件组合模式
- 使用 class-variance-authority 管理组件变体
- 提供清晰的组件文档和使用示例
```

### 组件生成提示词模板
```
基于以下规范生成 React 组件：

组件结构：
1. 导入必要的依赖（React, shadcn/ui 组件, 工具函数）
2. 定义 TypeScript 接口和类型
3. 使用 cva 定义组件变体（如适用）
4. 实现组件逻辑
5. 导出组件和相关类型

样式要求：
- 使用 Tailwind CSS 类进行样式设计
- 应用设计系统的颜色、间距、字体规范
- 实现响应式设计
- 支持暗色模式

可访问性要求：
- 添加适当的 ARIA 标签
- 支持键盘导航
- 提供语义化的 HTML 结构
- 确保颜色对比度符合标准

性能要求：
- 使用 React.memo（如需要）
- 应用 useMemo 和 useCallback 优化
- 避免不必要的重渲染
```

### 页面生成提示词模板
```
基于以下规范生成 Next.js 页面：

页面结构：
1. 使用 Next.js App Router 约定
2. 实现适当的布局和组件组合
3. 添加页面元数据和 SEO 优化
4. 实现错误边界和加载状态

布局要求：
- 使用响应式网格系统
- 实现一致的页面布局
- 添加导航和页脚组件
- 支持移动端适配

数据处理：
- 使用 React Server Components（如适用）
- 实现客户端状态管理
- 添加数据验证和错误处理
- 优化数据获取性能

用户体验：
- 实现加载状态和骨架屏
- 添加交互反馈和动画
- 支持键盘导航和可访问性
- 优化页面性能指标
```

## 提取的规范要点

### 1. 代码质量标准
- TypeScript 严格模式
- ESLint 和 Prettier 配置
- 单元测试覆盖率 > 80%
- 性能预算控制

### 2. 组件设计标准
- 单一职责原则
- 可复用性和可组合性
- 一致的 API 设计
- 完整的文档和示例

### 3. 样式设计标准
- 设计系统一致性
- 响应式设计支持
- 暗色模式兼容
- 可访问性合规

### 4. 性能优化标准
- 包大小控制
- 运行时性能优化
- 首屏加载时间 < 2s
- 交互响应时间 < 100ms

## 实施建议

1. **渐进式采用**：从核心组件开始，逐步扩展到整个项目
2. **工具集成**：与开发工具和 CI/CD 流程集成
3. **团队培训**：提供培训材料和最佳实践指南
4. **持续改进**：收集反馈，持续优化提示词和规范

## 结论

V0 提示词规范为 AI Agent 代码生成提供了清晰的指导原则。通过遵循这些规范，可以确保生成的代码具有高质量、一致性和可维护性。