# AI Agent 编码规范

## 概述

本文档为 AI Agent 提供标准化的编码规范和最佳实践，确保生成的代码质量和一致性。

## 核心原则

### 1. 技术栈规范
- **框架**: Next.js 14+ (App Router)
- **UI 库**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **语言**: TypeScript (严格模式)
- **包管理**: pnpm (强制要求)
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