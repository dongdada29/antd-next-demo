/**
 * V0 模式提取和分析
 * 从 V0 系统中提取的核心模式和最佳实践
 */

export interface ExtractedPattern {
  id: string;
  name: string;
  category: 'component' | 'styling' | 'layout' | 'interaction' | 'performance';
  description: string;
  pattern: string;
  applicability: string[];
  examples: CodeExample[];
  metrics: PatternMetrics;
}

export interface CodeExample {
  title: string;
  code: string;
  description: string;
  tags: string[];
}

export interface PatternMetrics {
  complexity: 'low' | 'medium' | 'high';
  reusability: 'low' | 'medium' | 'high';
  performance: 'low' | 'medium' | 'high';
  accessibility: 'low' | 'medium' | 'high';
}

/**
 * 从 V0 提取的核心组件模式
 */
export const EXTRACTED_COMPONENT_PATTERNS: ExtractedPattern[] = [
  {
    id: 'shadcn-base-component',
    name: 'shadcn/ui 基础组件模式',
    category: 'component',
    description: '基于 shadcn/ui 的标准组件结构，包含变体系统和类型安全',
    pattern: `
// 1. 导入依赖
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 2. 定义变体
const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        sm: "small-classes",
        md: "medium-classes",
        lg: "large-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// 3. 定义接口
interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  children?: React.ReactNode
}

// 4. 实现组件
const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Component.displayName = "Component"

export { Component, componentVariants }
    `,
    applicability: [
      '基础 UI 组件',
      '可复用组件',
      '设计系统组件',
      '表单控件'
    ],
    examples: [
      {
        title: 'Button 组件实现',
        code: `
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
        `,
        description: 'shadcn/ui Button 组件的完整实现',
        tags: ['button', 'variants', 'accessibility']
      }
    ],
    metrics: {
      complexity: 'medium',
      reusability: 'high',
      performance: 'high',
      accessibility: 'high'
    }
  },
  {
    id: 'compound-component-pattern',
    name: '复合组件模式',
    category: 'component',
    description: '组合多个相关组件形成功能完整的复合组件',
    pattern: `
// 1. 主组件
const MainComponent = ({ children, ...props }) => {
  return (
    <div className="main-container" {...props}>
      {children}
    </div>
  )
}

// 2. 子组件
const SubComponent = ({ children, ...props }) => {
  return (
    <div className="sub-container" {...props}>
      {children}
    </div>
  )
}

// 3. 组合导出
MainComponent.Sub = SubComponent
MainComponent.displayName = "MainComponent"
SubComponent.displayName = "MainComponent.Sub"

export { MainComponent }
    `,
    applicability: [
      'Card 组件系列',
      'Form 组件系列',
      'Dialog 组件系列',
      '导航组件'
    ],
    examples: [
      {
        title: 'Card 复合组件',
        code: `
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
)

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
)

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)

export { Card, CardHeader, CardTitle, CardContent }
        `,
        description: 'Card 组件的复合组件实现',
        tags: ['card', 'compound', 'layout']
      }
    ],
    metrics: {
      complexity: 'medium',
      reusability: 'high',
      performance: 'medium',
      accessibility: 'high'
    }
  }
];

/**
 * 从 V0 提取的样式模式
 */
export const EXTRACTED_STYLING_PATTERNS: ExtractedPattern[] = [
  {
    id: 'responsive-design-pattern',
    name: '响应式设计模式',
    category: 'styling',
    description: '移动优先的响应式设计方法',
    pattern: `
// 移动优先的响应式类名
className={cn(
  // 基础样式（移动端）
  "text-sm p-4 grid grid-cols-1 gap-4",
  // 平板样式
  "md:text-base md:p-6 md:grid-cols-2 md:gap-6",
  // 桌面样式
  "lg:text-lg lg:p-8 lg:grid-cols-3 lg:gap-8",
  // 大屏样式
  "xl:grid-cols-4 xl:gap-10"
)}
    `,
    applicability: [
      '布局组件',
      '网格系统',
      '导航组件',
      '内容展示'
    ],
    examples: [
      {
        title: '响应式网格布局',
        code: `
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
  {items.map(item => (
    <Card key={item.id} className="p-4 md:p-6">
      <CardContent className="text-sm md:text-base">
        {item.content}
      </CardContent>
    </Card>
  ))}
</div>
        `,
        description: '响应式卡片网格布局',
        tags: ['responsive', 'grid', 'mobile-first']
      }
    ],
    metrics: {
      complexity: 'medium',
      reusability: 'high',
      performance: 'high',
      accessibility: 'high'
    }
  },
  {
    id: 'dark-mode-pattern',
    name: '暗色模式模式',
    category: 'styling',
    description: '支持暗色模式的样式设计',
    pattern: `
className={cn(
  // 浅色模式样式
  "bg-white text-gray-900 border-gray-200",
  // 暗色模式样式
  "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800",
  // 语义化颜色（自动适配）
  "bg-background text-foreground border-border"
)}
    `,
    applicability: [
      '主题切换',
      '颜色系统',
      '背景和文本',
      '边框和阴影'
    ],
    examples: [
      {
        title: '暗色模式卡片',
        code: `
<Card className="bg-card text-card-foreground border-border shadow-sm dark:shadow-md">
  <CardHeader className="border-b border-border">
    <CardTitle className="text-foreground">标题</CardTitle>
  </CardHeader>
  <CardContent className="text-muted-foreground">
    内容文本
  </CardContent>
</Card>
        `,
        description: '支持暗色模式的卡片组件',
        tags: ['dark-mode', 'theme', 'colors']
      }
    ],
    metrics: {
      complexity: 'low',
      reusability: 'high',
      performance: 'high',
      accessibility: 'high'
    }
  }
];

/**
 * 从 V0 提取的布局模式
 */
export const EXTRACTED_LAYOUT_PATTERNS: ExtractedPattern[] = [
  {
    id: 'flexbox-layout-pattern',
    name: 'Flexbox 布局模式',
    category: 'layout',
    description: '使用 Flexbox 进行灵活的布局设计',
    pattern: `
// 水平布局
className="flex items-center justify-between gap-4"

// 垂直布局
className="flex flex-col space-y-4"

// 居中布局
className="flex items-center justify-center min-h-screen"

// 响应式 Flex 方向
className="flex flex-col md:flex-row gap-4 md:gap-6"
    `,
    applicability: [
      '导航栏',
      '按钮组',
      '表单布局',
      '内容对齐'
    ],
    examples: [
      {
        title: 'Header 布局',
        code: `
<header className="flex items-center justify-between p-4 border-b border-border">
  <div className="flex items-center space-x-4">
    <Logo />
    <nav className="hidden md:flex space-x-6">
      <NavLink href="/">首页</NavLink>
      <NavLink href="/about">关于</NavLink>
    </nav>
  </div>
  <div className="flex items-center space-x-2">
    <ThemeToggle />
    <UserMenu />
  </div>
</header>
        `,
        description: '响应式头部导航布局',
        tags: ['header', 'navigation', 'responsive']
      }
    ],
    metrics: {
      complexity: 'low',
      reusability: 'high',
      performance: 'high',
      accessibility: 'medium'
    }
  },
  {
    id: 'grid-layout-pattern',
    name: 'Grid 布局模式',
    category: 'layout',
    description: '使用 CSS Grid 进行复杂的网格布局',
    pattern: `
// 基础网格
className="grid grid-cols-12 gap-6"

// 响应式网格
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"

// 不等宽网格
className="grid grid-cols-1 lg:grid-cols-3 gap-6"
// 子元素跨列
className="lg:col-span-2" // 占用2列
className="lg:col-span-1" // 占用1列

// 自适应网格
className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6"
    `,
    applicability: [
      '仪表板布局',
      '卡片网格',
      '图片画廊',
      '复杂页面布局'
    ],
    examples: [
      {
        title: '仪表板网格布局',
        code: `
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
  {/* 统计卡片 */}
  <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatsCard title="总用户" value="1,234" />
    <StatsCard title="活跃用户" value="856" />
    <StatsCard title="收入" value="¥12,345" />
    <StatsCard title="转化率" value="3.2%" />
  </div>
  
  {/* 主要内容 */}
  <div className="lg:col-span-3 space-y-6">
    <ChartCard title="用户增长趋势" />
    <DataTable title="最新订单" />
  </div>
  
  {/* 侧边栏 */}
  <div className="lg:col-span-1 space-y-6">
    <ActivityFeed />
    <QuickActions />
  </div>
</div>
        `,
        description: '复杂的仪表板网格布局',
        tags: ['dashboard', 'grid', 'complex-layout']
      }
    ],
    metrics: {
      complexity: 'high',
      reusability: 'medium',
      performance: 'high',
      accessibility: 'medium'
    }
  }
];

/**
 * 从 V0 提取的交互模式
 */
export const EXTRACTED_INTERACTION_PATTERNS: ExtractedPattern[] = [
  {
    id: 'form-interaction-pattern',
    name: '表单交互模式',
    category: 'interaction',
    description: '标准的表单交互和验证模式',
    pattern: `
// 使用 react-hook-form + zod
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    field: "",
  },
})

// 表单字段渲染
<FormField
  control={form.control}
  name="field"
  render={({ field }) => (
    <FormItem>
      <FormLabel>字段标签</FormLabel>
      <FormControl>
        <Input placeholder="请输入..." {...field} />
      </FormControl>
      <FormDescription>字段说明</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

// 提交处理
const onSubmit = (data: FormData) => {
  // 处理表单数据
}
    `,
    applicability: [
      '用户注册',
      '数据编辑',
      '搜索表单',
      '设置页面'
    ],
    examples: [
      {
        title: '用户信息表单',
        code: `
const userFormSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  age: z.number().min(18, "年龄必须大于18岁"),
})

const UserForm = ({ onSubmit, defaultValues }) => {
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  })

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
                <Input placeholder="请输入姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "提交中..." : "提交"}
        </Button>
      </form>
    </Form>
  )
}
        `,
        description: '完整的用户信息表单实现',
        tags: ['form', 'validation', 'user-input']
      }
    ],
    metrics: {
      complexity: 'medium',
      reusability: 'high',
      performance: 'medium',
      accessibility: 'high'
    }
  }
];

/**
 * 获取所有提取的模式
 */
export function getAllExtractedPatterns(): ExtractedPattern[] {
  return [
    ...EXTRACTED_COMPONENT_PATTERNS,
    ...EXTRACTED_STYLING_PATTERNS,
    ...EXTRACTED_LAYOUT_PATTERNS,
    ...EXTRACTED_INTERACTION_PATTERNS,
  ];
}

/**
 * 根据类别获取模式
 */
export function getPatternsByCategory(category: ExtractedPattern['category']): ExtractedPattern[] {
  return getAllExtractedPatterns().filter(pattern => pattern.category === category);
}

/**
 * 根据适用性搜索模式
 */
export function searchPatternsByApplicability(query: string): ExtractedPattern[] {
  const lowerQuery = query.toLowerCase();
  return getAllExtractedPatterns().filter(pattern =>
    pattern.applicability.some(app => app.toLowerCase().includes(lowerQuery)) ||
    pattern.name.toLowerCase().includes(lowerQuery) ||
    pattern.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * 评估模式的适用性
 */
export function evaluatePatternFit(
  pattern: ExtractedPattern,
  requirements: string[]
): {
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  // 检查适用性匹配
  const matchingApplicability = pattern.applicability.filter(app =>
    requirements.some(req => req.toLowerCase().includes(app.toLowerCase()))
  );
  
  if (matchingApplicability.length > 0) {
    score += matchingApplicability.length * 20;
    reasons.push(`匹配适用场景: ${matchingApplicability.join(', ')}`);
  }

  // 评估复杂度
  if (pattern.metrics.complexity === 'low') {
    score += 10;
    reasons.push('低复杂度，易于实现');
  } else if (pattern.metrics.complexity === 'high') {
    score -= 5;
    reasons.push('高复杂度，需要仔细考虑');
  }

  // 评估可复用性
  if (pattern.metrics.reusability === 'high') {
    score += 15;
    reasons.push('高可复用性');
  }

  // 评估性能
  if (pattern.metrics.performance === 'high') {
    score += 10;
    reasons.push('高性能表现');
  }

  // 评估可访问性
  if (pattern.metrics.accessibility === 'high') {
    score += 10;
    reasons.push('良好的可访问性支持');
  }

  return { score, reasons };
}