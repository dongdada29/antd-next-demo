# AI Agent 编码模板迁移指南

## 📋 概述

本指南将帮助您从现有项目迁移到 AI Agent 编码模板。我们支持从多种 UI 框架和架构的迁移，并提供自动化工具来简化迁移过程。

## 🎯 迁移目标

- **零停机迁移**：支持渐进式迁移，确保业务连续性
- **代码质量提升**：迁移过程中自动优化代码质量
- **性能改进**：利用现代化技术栈提升应用性能
- **AI 友好**：优化项目结构以支持 AI 代码生成

## 🚀 快速开始

### 1. 评估现有项目

首先运行我们的项目评估工具：

```bash
npx ai-template assess
```

这将分析您的项目并生成迁移报告：

```
📊 项目评估报告
├── 框架: React + Ant Design
├── 组件数量: 45
├── 页面数量: 12
├── 样式系统: CSS-in-JS (styled-components)
├── 状态管理: Redux
├── 测试覆盖率: 65%
└── 迁移复杂度: 中等

🎯 推荐迁移策略: 渐进式迁移
⏱️ 预估时间: 2-3 周
```

### 2. 创建迁移计划

```bash
npx ai-template plan-migration
```

生成详细的迁移计划：

```markdown
# 迁移计划

## 阶段 1: 基础设施迁移 (第1周)
- [ ] 设置 Next.js + shadcn/ui 项目
- [ ] 配置 Tailwind CSS
- [ ] 设置 AI Agent 提示词系统
- [ ] 迁移构建配置

## 阶段 2: 组件迁移 (第2周)
- [ ] 迁移基础组件 (Button, Input, Card)
- [ ] 迁移复合组件 (Form, Table, Modal)
- [ ] 迁移布局组件
- [ ] 更新组件测试

## 阶段 3: 页面和功能迁移 (第3周)
- [ ] 迁移页面组件
- [ ] 更新路由配置
- [ ] 迁移状态管理
- [ ] 性能优化和测试
```

## 📦 从 Ant Design 迁移

### 组件映射表

| Ant Design | shadcn/ui | 迁移复杂度 | 说明 |
|------------|-----------|------------|------|
| `Button` | `Button` | 🟢 简单 | 直接替换，API 相似 |
| `Input` | `Input` | 🟢 简单 | 直接替换 |
| `Card` | `Card` | 🟢 简单 | 结构略有不同 |
| `Form` | `Form` + `react-hook-form` | 🟡 中等 | 需要重构表单逻辑 |
| `Table` | `Table` + `@tanstack/react-table` | 🟡 中等 | 功能更强大但需要适配 |
| `DatePicker` | `Calendar` + `Popover` | 🟡 中等 | 需要组合多个组件 |
| `Upload` | 自定义组件 | 🔴 复杂 | 需要自行实现 |
| `Tree` | 自定义组件 | 🔴 复杂 | 需要自行实现 |

### 自动化迁移工具

```bash
# 安装迁移工具
npm install -g @ai-template/migration-tools

# 运行 Ant Design 迁移
ai-migrate from-antd ./src

# 选项说明
ai-migrate from-antd ./src \
  --preserve-styles    # 保留现有样式
  --gradual           # 渐进式迁移
  --backup            # 创建备份
  --dry-run           # 预览更改
```

### 手动迁移步骤

#### 1. 安装依赖

```bash
# 移除 Ant Design
npm uninstall antd @ant-design/icons

# 安装 shadcn/ui 依赖
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/typography
```

#### 2. 配置 Tailwind CSS

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... 更多颜色配置
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

#### 3. 组件迁移示例

**迁移前 (Ant Design):**

```tsx
import { Button, Card, Form, Input } from 'antd';

const UserForm = () => {
  const [form] = Form.useForm();

  return (
    <Card title="用户信息">
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
```

**迁移后 (shadcn/ui):**

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
});

const UserForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>用户信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              placeholder="请输入姓名"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <Button type="submit">提交</Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

## 🎨 从 Material-UI 迁移

### 组件映射

| Material-UI | shadcn/ui | 迁移说明 |
|-------------|-----------|----------|
| `Button` | `Button` | 变体名称不同 |
| `TextField` | `Input` | 需要重构验证逻辑 |
| `Paper` | `Card` | 结构相似 |
| `Dialog` | `Dialog` | API 略有不同 |
| `Drawer` | `Sheet` | 功能相似 |

### 迁移脚本

```bash
# 运行 Material-UI 迁移
ai-migrate from-mui ./src

# 转换主题配置
ai-migrate convert-theme ./src/theme.ts
```

## 💅 从 Styled Components 迁移

### 样式迁移策略

1. **CSS-in-JS 到 Tailwind CSS**
2. **保留复杂样式逻辑**
3. **渐进式替换**

### 迁移工具

```bash
# 安装样式迁移工具
npm install -D @ai-template/style-migrator

# 转换 styled-components
ai-migrate styles ./src --from styled-components --to tailwind
```

### 迁移示例

**迁移前:**

```tsx
import styled from 'styled-components';

const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  
  ${props => props.variant === 'primary' && `
    background-color: #3b82f6;
    color: white;
    
    &:hover {
      background-color: #2563eb;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: #f1f5f9;
    color: #334155;
    
    &:hover {
      background-color: #e2e8f0;
    }
  `}
`;
```

**迁移后:**

```tsx
import { Button } from '@/components/ui/button';

// 或者使用 cva 创建变体
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);
```

## 🔄 状态管理迁移

### 从 Redux 到 Zustand

```bash
# 安装 Zustand
npm install zustand

# 迁移 Redux store
ai-migrate state ./src/store --from redux --to zustand
```

### 迁移示例

**Redux (迁移前):**

```typescript
// store/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { name: '', email: '' },
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
});
```

**Zustand (迁移后):**

```typescript
// store/userStore.ts
import { create } from 'zustand';

interface UserState {
  name: string;
  email: string;
  setUser: (user: { name: string; email: string }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: '',
  email: '',
  setUser: (user) => set(user),
}));
```

## 🧪 测试迁移

### 从 Jest + Enzyme 到 Vitest + Testing Library

```bash
# 安装新的测试依赖
npm install -D vitest @testing-library/react @testing-library/jest-dom

# 迁移测试文件
ai-migrate tests ./src --from jest --to vitest
```

### 测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## 📊 迁移验证

### 自动化验证

```bash
# 运行完整验证
npm run validate:migration

# 验证组件兼容性
npm run validate:components

# 验证性能
npm run validate:performance

# 验证可访问性
npm run validate:a11y
```

### 验证清单

- [ ] **功能验证**: 所有功能正常工作
- [ ] **样式验证**: UI 外观符合预期
- [ ] **性能验证**: 性能指标达到目标
- [ ] **可访问性验证**: 通过 WCAG 2.1 AA 标准
- [ ] **测试验证**: 所有测试通过
- [ ] **构建验证**: 生产构建成功

## 🚨 常见问题和解决方案

### 1. 样式不一致

**问题**: 迁移后样式与原设计不符

**解决方案**:
```bash
# 使用样式对比工具
ai-template compare-styles ./before ./after

# 生成样式差异报告
ai-template style-diff --output diff-report.html
```

### 2. 组件功能缺失

**问题**: 某些 Ant Design 组件功能在 shadcn/ui 中不存在

**解决方案**:
```typescript
// 创建自定义组件包装器
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// 模拟 Ant Design 的 Popconfirm
export const Popconfirm = ({ title, onConfirm, children }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <p className="text-sm">{title}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm">取消</Button>
            <Button size="sm" onClick={onConfirm}>确定</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
```

### 3. 性能问题

**问题**: 迁移后应用性能下降

**解决方案**:
```bash
# 分析性能问题
npm run analyze:performance

# 优化建议
npm run optimize:suggestions

# 应用自动优化
npm run optimize:auto
```

### 4. TypeScript 类型错误

**问题**: 迁移后出现大量类型错误

**解决方案**:
```bash
# 自动修复类型错误
ai-template fix-types ./src

# 生成类型定义
ai-template generate-types
```

## 📈 迁移最佳实践

### 1. 渐进式迁移

```typescript
// 支持两套组件库共存
import { Button as AntButton } from 'antd';
import { Button as ShadcnButton } from '@/components/ui/button';

const MyComponent = ({ useLegacy = false }) => {
  const Button = useLegacy ? AntButton : ShadcnButton;
  
  return <Button>Click me</Button>;
};
```

### 2. 特性开关

```typescript
// 使用特性开关控制迁移进度
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

const MyComponent = () => {
  const isNewUIEnabled = useFeatureFlag('new-ui-components');
  
  return isNewUIEnabled ? <NewComponent /> : <LegacyComponent />;
};
```

### 3. A/B 测试

```typescript
// 对比新旧组件的用户体验
import { useABTest } from '@/hooks/useABTest';

const MyComponent = () => {
  const variant = useABTest('component-migration');
  
  return variant === 'new' ? <ShadcnComponent /> : <AntdComponent />;
};
```

## 🔧 迁移工具参考

### CLI 命令

```bash
# 项目评估
ai-template assess [options]

# 生成迁移计划
ai-template plan-migration [options]

# 执行迁移
ai-template migrate [source] [options]

# 验证迁移
ai-template validate [options]

# 回滚迁移
ai-template rollback [options]
```

### 配置文件

```json
// ai-template.config.json
{
  "migration": {
    "source": "antd",
    "target": "shadcn-ui",
    "strategy": "gradual",
    "preserveStyles": true,
    "createBackup": true,
    "validateAfterMigration": true
  },
  "components": {
    "mapping": "./component-mapping.json",
    "customComponents": "./custom-components"
  },
  "validation": {
    "performance": true,
    "accessibility": true,
    "functionality": true
  }
}
```

## 📞 获取帮助

如果在迁移过程中遇到问题，可以通过以下方式获取帮助：

- **GitHub Issues**: [报告迁移问题](https://github.com/ai-template/issues)
- **Discord 社区**: [加入迁移讨论](https://discord.gg/ai-template-migration)
- **迁移服务**: [联系专业迁移服务](mailto:migration@ai-template.dev)
- **文档**: [查看详细文档](https://docs.ai-template.dev/migration)

---

**最后更新**: 2024年1月15日  
**版本**: v1.0.0