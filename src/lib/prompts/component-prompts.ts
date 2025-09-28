/**
 * 组件生成专用提示词
 * 基于 V0 规范的组件类型特定提示词
 */

export interface ComponentPrompt {
  id: string;
  name: string;
  category: 'ui' | 'layout' | 'form' | 'data' | 'navigation' | 'feedback';
  description: string;
  prompt: string;
  examples: string[];
  requirements: string[];
  version: string;
}

/**
 * UI 组件提示词
 */
export const UI_COMPONENT_PROMPTS: ComponentPrompt[] = [
  {
    id: 'button-component',
    name: 'Button 组件提示词',
    category: 'ui',
    description: '生成按钮组件的专用提示词',
    version: '1.0.0',
    prompt: `生成一个 Button 组件，基于 shadcn/ui Button 组件进行扩展。

## 组件要求

### 基础结构
- 使用 shadcn/ui Button 作为基础
- 实现 forwardRef 支持 ref 传递
- 提供完整的 TypeScript 接口定义
- 支持所有标准 HTML button 属性

### 变体系统
- 实现多种视觉变体：default、destructive、outline、secondary、ghost、link
- 提供多种尺寸选项：sm、default、lg、icon
- 支持加载状态和禁用状态
- 使用 class-variance-authority 管理变体

### 样式要求
- 使用 Tailwind CSS 实用类
- 实现流畅的过渡动画
- 支持焦点和悬停状态
- 保持与设计系统的一致性

### 可访问性
- 提供适当的 ARIA 标签
- 支持键盘导航和焦点管理
- 实现屏幕阅读器友好的文本
- 确保颜色对比度符合标准

### 使用示例
\`\`\`tsx
<Button variant="default" size="default">
  点击我
</Button>

<Button variant="destructive" size="sm" disabled>
  删除
</Button>

<Button variant="outline" size="lg" asChild>
  <Link href="/about">了解更多</Link>
</Button>
\`\`\``,
    examples: [
      'Primary action button',
      'Destructive action button',
      'Secondary action button',
      'Loading state button'
    ],
    requirements: [
      '使用 shadcn/ui Button 基础',
      '实现完整的变体系统',
      '支持加载和禁用状态',
      '提供可访问性支持'
    ]
  },
  {
    id: 'input-component',
    name: 'Input 组件提示词',
    category: 'ui',
    description: '生成输入框组件的专用提示词',
    version: '1.0.0',
    prompt: `生成一个 Input 组件，基于 shadcn/ui Input 组件进行扩展。

## 组件要求

### 基础结构
- 使用 shadcn/ui Input 作为基础
- 实现 forwardRef 支持 ref 传递
- 提供完整的 TypeScript 接口定义
- 支持所有标准 HTML input 属性

### 功能特性
- 支持多种输入类型：text、email、password、number 等
- 实现前缀和后缀图标支持
- 提供清除按钮功能
- 支持输入验证和错误状态

### 样式变体
- 实现多种尺寸：sm、default、lg
- 提供错误、成功、警告状态样式
- 支持禁用和只读状态
- 实现焦点和悬停效果

### 可访问性
- 关联 label 和 input 元素
- 提供适当的 ARIA 属性
- 支持键盘导航
- 实现错误信息的无障碍传达

### 使用示例
\`\`\`tsx
<Input
  type="email"
  placeholder="请输入邮箱地址"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<Input
  type="password"
  placeholder="请输入密码"
  error="密码长度至少8位"
/>
\`\`\``,
    examples: [
      'Basic text input',
      'Email input with validation',
      'Password input with toggle',
      'Search input with icon'
    ],
    requirements: [
      '使用 shadcn/ui Input 基础',
      '支持多种输入类型',
      '实现验证和错误状态',
      '提供图标和清除功能'
    ]
  },
  {
    id: 'card-component',
    name: 'Card 组件提示词',
    category: 'layout',
    description: '生成卡片组件的专用提示词',
    version: '1.0.0',
    prompt: `生成一个 Card 组件系列，基于 shadcn/ui Card 组件进行扩展。

## 组件要求

### 组件结构
- 使用 shadcn/ui Card、CardHeader、CardTitle、CardDescription、CardContent、CardFooter
- 实现复合组件模式
- 提供灵活的内容插槽
- 支持条件渲染各个部分

### 功能特性
- 支持可点击的卡片（作为链接或按钮）
- 实现悬停和焦点效果
- 提供加载状态和骨架屏
- 支持图片和媒体内容

### 样式变体
- 实现多种视觉样式：default、outlined、elevated
- 提供多种尺寸选项
- 支持自定义背景和边框
- 实现响应式布局

### 可访问性
- 使用语义化的 HTML 结构
- 提供适当的标题层次
- 支持键盘导航（如可交互）
- 实现屏幕阅读器友好的内容结构

### 使用示例
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述信息</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片主要内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作按钮</Button>
  </CardFooter>
</Card>
\`\`\``,
    examples: [
      'Basic information card',
      'Product card with image',
      'Statistics card',
      'Interactive card component'
    ],
    requirements: [
      '使用 shadcn/ui Card 系列组件',
      '实现复合组件模式',
      '支持多种内容类型',
      '提供交互和状态支持'
    ]
  }
];

/**
 * 表单组件提示词
 */
export const FORM_COMPONENT_PROMPTS: ComponentPrompt[] = [
  {
    id: 'form-component',
    name: 'Form 组件提示词',
    category: 'form',
    description: '生成表单组件的专用提示词',
    version: '1.0.0',
    prompt: `生成一个 Form 组件，基于 shadcn/ui Form 组件和 react-hook-form 进行实现。

## 组件要求

### 基础结构
- 使用 react-hook-form 进行表单状态管理
- 集成 zod 进行数据验证
- 使用 shadcn/ui Form、FormField、FormItem、FormLabel、FormControl、FormMessage 组件
- 提供完整的 TypeScript 类型定义

### 功能特性
- 实现实时验证和错误提示
- 支持异步验证和提交
- 提供表单重置和默认值
- 实现条件字段和动态表单

### 验证系统
- 使用 zod schema 定义验证规则
- 提供清晰的错误信息
- 支持自定义验证逻辑
- 实现字段级和表单级验证

### 用户体验
- 实现加载状态和提交反馈
- 提供表单保存和恢复功能
- 支持键盘导航和快捷键
- 优化移动端输入体验

### 可访问性
- 关联标签和表单控件
- 提供清晰的错误信息传达
- 支持屏幕阅读器导航
- 实现适当的焦点管理

### 使用示例
\`\`\`tsx
const formSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>姓名</FormLabel>
          <FormControl>
            <Input placeholder="请输入姓名" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">提交</Button>
  </form>
</Form>
\`\`\``,
    examples: [
      'User registration form',
      'Contact form with validation',
      'Multi-step form wizard',
      'Dynamic form with conditional fields'
    ],
    requirements: [
      '使用 react-hook-form + zod',
      '集成 shadcn/ui Form 组件',
      '实现完整的验证系统',
      '提供良好的用户体验'
    ]
  }
];

/**
 * 数据展示组件提示词
 */
export const DATA_COMPONENT_PROMPTS: ComponentPrompt[] = [
  {
    id: 'table-component',
    name: 'Table 组件提示词',
    category: 'data',
    description: '生成数据表格组件的专用提示词',
    version: '1.0.0',
    prompt: `生成一个 Table 组件，基于 shadcn/ui Table 组件和 @tanstack/react-table 进行实现。

## 组件要求

### 基础结构
- 使用 @tanstack/react-table 进行表格状态管理
- 集成 shadcn/ui Table、TableHeader、TableBody、TableRow、TableCell 组件
- 提供完整的 TypeScript 类型定义
- 支持泛型数据类型

### 功能特性
- 实现排序、筛选、分页功能
- 支持行选择和批量操作
- 提供列的显示/隐藏控制
- 实现表格数据的导出功能

### 交互体验
- 支持列宽调整和拖拽排序
- 实现虚拟滚动处理大数据集
- 提供加载状态和空数据状态
- 支持行展开和嵌套数据

### 响应式设计
- 实现移动端友好的表格布局
- 支持水平滚动和固定列
- 提供紧凑和宽松的显示模式
- 优化小屏幕设备的用户体验

### 可访问性
- 使用语义化的表格结构
- 提供适当的表头和数据关联
- 支持键盘导航和焦点管理
- 实现屏幕阅读器友好的表格描述

### 使用示例
\`\`\`tsx
const columns = [
  {
    accessorKey: "name",
    header: "姓名",
  },
  {
    accessorKey: "email",
    header: "邮箱",
  },
]

<DataTable
  columns={columns}
  data={users}
  pagination
  sorting
  filtering
/>
\`\`\``,
    examples: [
      'User management table',
      'Product listing table',
      'Order history table',
      'Analytics data table'
    ],
    requirements: [
      '使用 @tanstack/react-table',
      '集成 shadcn/ui Table 组件',
      '实现完整的表格功能',
      '提供响应式和可访问性支持'
    ]
  }
];

/**
 * 导航组件提示词
 */
export const NAVIGATION_COMPONENT_PROMPTS: ComponentPrompt[] = [
  {
    id: 'navigation-component',
    name: 'Navigation 组件提示词',
    category: 'navigation',
    description: '生成导航组件的专用提示词',
    version: '1.0.0',
    prompt: `生成一个 Navigation 组件，基于 shadcn/ui NavigationMenu 组件进行实现。

## 组件要求

### 基础结构
- 使用 shadcn/ui NavigationMenu 系列组件
- 支持多级嵌套菜单结构
- 实现响应式导航布局
- 提供移动端菜单切换

### 功能特性
- 支持下拉菜单和子菜单
- 实现当前页面的高亮显示
- 提供搜索和快速导航功能
- 支持用户权限控制的菜单显示

### 交互体验
- 实现流畅的展开/收起动画
- 支持键盘导航和快捷键
- 提供面包屑导航支持
- 优化触摸设备的交互体验

### 样式定制
- 支持多种导航样式：水平、垂直、侧边栏
- 实现主题色彩和品牌定制
- 提供紧凑和宽松的显示模式
- 支持图标和文字的组合显示

### 可访问性
- 使用语义化的导航结构
- 提供适当的 ARIA 标签和状态
- 支持屏幕阅读器导航
- 实现键盘焦点的逻辑顺序

### 使用示例
\`\`\`tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>产品</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/products">
          所有产品
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
\`\`\``,
    examples: [
      'Main site navigation',
      'Dashboard sidebar navigation',
      'Mobile hamburger menu',
      'Breadcrumb navigation'
    ],
    requirements: [
      '使用 shadcn/ui NavigationMenu',
      '支持多级嵌套结构',
      '实现响应式布局',
      '提供完整的可访问性支持'
    ]
  }
];

/**
 * 反馈组件提示词
 */
export const FEEDBACK_COMPONENT_PROMPTS: ComponentPrompt[] = [
  {
    id: 'toast-component',
    name: 'Toast 组件提示词',
    category: 'feedback',
    description: '生成消息提示组件的专用提示词',
    version: '1.0.0',
    prompt: `生成一个 Toast 组件，基于 shadcn/ui Toast 组件进行实现。

## 组件要求

### 基础结构
- 使用 shadcn/ui Toast、ToastProvider、ToastViewport 组件
- 实现全局的消息提示管理
- 提供多种消息类型支持
- 支持消息的队列和堆叠

### 功能特性
- 实现成功、错误、警告、信息等消息类型
- 支持自动消失和手动关闭
- 提供操作按钮和链接支持
- 实现消息的持久化和恢复

### 交互体验
- 实现流畅的进入和退出动画
- 支持滑动手势关闭（移动端）
- 提供进度条显示剩余时间
- 优化多个消息的显示策略

### 样式定制
- 支持多种位置：顶部、底部、角落
- 实现主题色彩和图标定制
- 提供紧凑和详细的显示模式
- 支持暗色模式适配

### 可访问性
- 使用适当的 ARIA live regions
- 提供屏幕阅读器友好的消息内容
- 支持键盘操作和焦点管理
- 实现消息的语义化标记

### 使用示例
\`\`\`tsx
// 在组件中使用
const { toast } = useToast()

toast({
  title: "操作成功",
  description: "数据已保存",
  variant: "success",
})

toast({
  title: "操作失败",
  description: "请检查网络连接",
  variant: "destructive",
  action: <Button>重试</Button>,
})
\`\`\``,
    examples: [
      'Success notification toast',
      'Error message with retry action',
      'Loading progress toast',
      'Undo action toast'
    ],
    requirements: [
      '使用 shadcn/ui Toast 组件',
      '实现全局消息管理',
      '支持多种消息类型',
      '提供良好的用户体验'
    ]
  }
];

/**
 * 获取所有组件提示词
 */
export function getAllComponentPrompts(): ComponentPrompt[] {
  return [
    ...UI_COMPONENT_PROMPTS,
    ...FORM_COMPONENT_PROMPTS,
    ...DATA_COMPONENT_PROMPTS,
    ...NAVIGATION_COMPONENT_PROMPTS,
    ...FEEDBACK_COMPONENT_PROMPTS,
  ];
}

/**
 * 根据类别获取组件提示词
 */
export function getComponentPromptsByCategory(category: ComponentPrompt['category']): ComponentPrompt[] {
  return getAllComponentPrompts().filter(prompt => prompt.category === category);
}

/**
 * 根据组件名称获取提示词
 */
export function getComponentPromptById(id: string): ComponentPrompt | undefined {
  return getAllComponentPrompts().find(prompt => prompt.id === id);
}

/**
 * 搜索组件提示词
 */
export function searchComponentPrompts(query: string): ComponentPrompt[] {
  const lowerQuery = query.toLowerCase();
  return getAllComponentPrompts().filter(prompt =>
    prompt.name.toLowerCase().includes(lowerQuery) ||
    prompt.description.toLowerCase().includes(lowerQuery) ||
    prompt.examples.some(example => example.toLowerCase().includes(lowerQuery))
  );
}