# AI Agent 编码模板快速开始指南

## 🎯 欢迎使用 AI Agent 编码模板

AI Agent 编码模板是一个专为 AI 代码生成优化的现代化 Web 开发模板，基于 Next.js + shadcn/ui + Tailwind CSS 构建，内置完整的 AI 提示词系统和最佳实践。

## ⚡ 5分钟快速开始

### 1. 创建新项目

```bash
# 使用 npx (推荐)
npx create-ai-template@latest my-project

# 或使用 pnpm
pnpm create ai-template my-project

# 或使用 yarn
yarn create ai-template my-project
```

### 2. 进入项目目录

```bash
cd my-project
```

### 3. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 4. 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看您的应用！

## 🏗️ 项目结构

```
my-project/
├── .kiro/                          # Kiro AI 配置
│   ├── steering/                   # AI 指导规则
│   │   ├── coding-standards.md     # 编码规范
│   │   ├── component-patterns.md   # 组件模式
│   │   └── ai-prompts.md          # AI 提示词
│   └── settings/                   # 配置文件
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css            # 全局样式
│   │   ├── layout.tsx             # 根布局
│   │   └── page.tsx               # 首页
│   ├── components/                 # 组件库
│   │   ├── ui/                    # shadcn/ui 基础组件
│   │   ├── common/                # 通用组件
│   │   ├── forms/                 # 表单组件
│   │   └── layouts/               # 布局组件
│   ├── lib/                       # 工具库
│   │   ├── utils.ts              # 通用工具
│   │   ├── ai-helpers.ts         # AI 辅助函数
│   │   └── prompts/              # 提示词库
│   ├── hooks/                     # React Hooks
│   ├── types/                     # TypeScript 类型
│   └── styles/                    # 样式文件
├── docs/                          # 文档
├── public/                        # 静态资源
├── components.json                # shadcn/ui 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── next.config.js                # Next.js 配置
└── package.json                  # 项目配置
```

## 🎨 创建第一个组件

### 1. 使用 shadcn/ui CLI 添加组件

```bash
# 添加 Button 组件
pnpm dlx shadcn-ui@latest add button

# 添加 Card 组件
pnpm dlx shadcn-ui@latest add card

# 添加 Form 组件
pnpm dlx shadcn-ui@latest add form
```

### 2. 创建自定义组件

创建 `src/components/common/UserCard.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  onEdit?: () => void;
}

export function UserCard({ name, email, avatar, onEdit }: UserCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={onEdit} className="w-full">
          编辑资料
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 3. 在页面中使用组件

更新 `src/app/page.tsx`:

```tsx
import { UserCard } from '@/components/common/UserCard';

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        欢迎使用 AI Agent 编码模板
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UserCard
          name="张三"
          email="zhangsan@example.com"
          onEdit={() => console.log('编辑用户')}
        />
        <UserCard
          name="李四"
          email="lisi@example.com"
          onEdit={() => console.log('编辑用户')}
        />
        <UserCard
          name="王五"
          email="wangwu@example.com"
          onEdit={() => console.log('编辑用户')}
        />
      </div>
    </main>
  );
}
```

## 🤖 AI Agent 集成

### 1. 初始化 AI 配置

```bash
pnpm run ai:init
```

这将创建 AI Agent 配置文件和提示词模板。

### 2. 使用 AI 生成组件

```bash
# 生成一个表单组件
pnpm run ai:component -- --name ContactForm --type form

# 生成一个数据表格组件
pnpm run ai:component -- --name UserTable --type table

# 生成一个仪表板页面
pnpm run ai:page -- --name Dashboard --layout dashboard
```

### 3. AI 提示词示例

在 `.kiro/steering/ai-prompts.md` 中，您可以找到预配置的提示词：

```markdown
# AI 代码生成提示词

## 组件生成提示词

创建一个 React 组件，使用以下规范：
- 使用 TypeScript 进行类型定义
- 使用 shadcn/ui 组件作为基础
- 使用 Tailwind CSS 进行样式设计
- 确保组件具有良好的可访问性
- 包含适当的 JSDoc 注释

## 样式提示词

使用 Tailwind CSS 实用类进行样式设计：
- 优先使用 Tailwind 实用类
- 使用语义化的颜色变量
- 确保响应式设计
- 支持暗色模式
```

## 🎨 主题定制

### 1. 修改颜色主题

编辑 `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* 添加您的自定义颜色 */
    --brand: 210 100% 50%;
    --brand-foreground: 0 0% 100%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    /* 暗色模式颜色 */
    --brand: 210 100% 60%;
    --brand-foreground: 222.2 84% 4.9%;
  }
}
```

### 2. 更新 Tailwind 配置

编辑 `tailwind.config.ts`:

```typescript
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
    extend: {
      colors: {
        // 添加自定义颜色
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
        },
      },
      // 添加自定义字体
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

### 3. 使用主题切换

创建 `src/components/theme/ThemeToggle.tsx`:

```tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">切换主题</span>
    </Button>
  )
}
```

## 📝 表单处理

### 1. 创建表单组件

```bash
# 添加必要的组件
pnpm dlx shadcn-ui@latest add form input label button
```

创建 `src/components/forms/ContactForm.tsx`:

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  message: z.string().min(10, "消息至少需要10个字符"),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // 处理表单提交
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="请输入您的姓名" {...field} />
              </FormControl>
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
                <Input placeholder="请输入您的邮箱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>消息</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="请输入您的消息"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          发送消息
        </Button>
      </form>
    </Form>
  )
}
```

## 📊 数据获取

### 1. 使用 Server Components

创建 `src/app/users/page.tsx`:

```tsx
import { UserCard } from '@/components/common/UserCard';

// 模拟 API 调用
async function getUsers() {
  // 在实际应用中，这里会是真实的 API 调用
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
  ];
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">用户列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            name={user.name}
            email={user.email}
            onEdit={() => console.log(`编辑用户 ${user.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
```

### 2. 使用 Client Components 和 SWR

```bash
pnpm add swr
```

创建 `src/hooks/useUsers.ts`:

```tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUsers() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher);

  return {
    users: data,
    isLoading,
    isError: error,
  };
}
```

## 🧪 测试

### 1. 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并监听文件变化
pnpm test:watch

# 运行测试覆盖率
pnpm test:coverage

# 运行 UI 测试
pnpm test:ui
```

### 2. 编写组件测试

创建 `src/components/common/__tests__/UserCard.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  const defaultProps = {
    name: '张三',
    email: 'zhangsan@example.com',
  };

  it('renders user information correctly', () => {
    render(<UserCard {...defaultProps} />);
    
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard {...defaultProps} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('编辑资料'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('displays avatar fallback when no avatar is provided', () => {
    render(<UserCard {...defaultProps} />);
    
    expect(screen.getByText('张')).toBeInTheDocument();
  });
});
```

## 🚀 部署

### 1. 构建生产版本

```bash
pnpm build
```

### 2. 部署到 Vercel

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 部署
vercel
```

### 3. 部署到其他平台

```bash
# 构建静态文件
pnpm build

# 启动生产服务器
pnpm start
```

## 📚 下一步

现在您已经掌握了基础知识，可以继续学习：

1. **[AI Agent 集成指南](./AI_AGENT_INTEGRATION_GUIDE.md)** - 深入了解 AI 代码生成
2. **[组件开发指南](./COMPONENT_DEVELOPMENT.md)** - 学习组件开发最佳实践
3. **[性能优化指南](./PERFORMANCE_OPTIMIZATION.md)** - 优化应用性能
4. **[部署指南](./DEPLOYMENT.md)** - 学习部署到各种平台

## 🤝 获取帮助

如果您遇到问题，可以通过以下方式获取帮助：

- **GitHub Issues**: [报告问题](https://github.com/ai-template/issues)
- **Discord 社区**: [加入讨论](https://discord.gg/ai-template)
- **文档**: [查看详细文档](https://docs.ai-template.dev)
- **示例**: [浏览示例项目](https://examples.ai-template.dev)

---

**祝您使用愉快！** 🎉