# 提示词使用和定制指南

## 概述

本指南详细介绍如何使用和定制 AI Agent 提示词系统，基于 V0 提示词规范，为不同场景提供最优的代码生成效果。

## 提示词架构

### 提示词层次结构

```
提示词系统
├── 系统级提示词 (System Prompts)
│   ├── 基础系统提示词
│   ├── 代码风格提示词
│   └── 技术栈提示词
├── 组件级提示词 (Component Prompts)
│   ├── UI 组件提示词
│   ├── 表单组件提示词
│   ├── 布局组件提示词
│   └── 数据组件提示词
├── 页面级提示词 (Page Prompts)
│   ├── 仪表板页面提示词
│   ├── 表单页面提示词
│   └── 列表页面提示词
├── 样式提示词 (Style Prompts)
│   ├── Tailwind CSS 提示词
│   ├── 响应式设计提示词
│   └── 暗色模式提示词
└── 自定义提示词 (Custom Prompts)
    ├── 业务逻辑提示词
    ├── 性能优化提示词
    └── 可访问性提示词
```

## 基础提示词使用

### 1. 系统级提示词

系统级提示词定义 AI Agent 的基本行为和全局规范：

```typescript
// src/lib/prompts/system-prompts.ts
export const SYSTEM_PROMPTS = {
  // 基础系统提示词
  base: `
你是一个专业的 React + Next.js + TypeScript 开发专家。
使用 shadcn/ui + Tailwind CSS 技术栈。

核心原则：
1. 优先使用 shadcn/ui 组件作为基础构建块
2. 使用 Tailwind CSS 进行样式设计，避免自定义 CSS
3. 确保 TypeScript 类型安全和完整的类型定义
4. 实现 WCAG 2.1 AA 级可访问性标准
5. 考虑性能优化和最佳实践
6. 使用现代 React 模式（Hooks、Context、Suspense）

代码风格：
- 使用函数式组件和 React Hooks
- 优先使用 TypeScript 接口定义类型
- 组件名使用 PascalCase，文件名使用 kebab-case
- 使用 named export 而非 default export
- 添加完整的 JSDoc 注释和类型定义
  `,

  // 技术栈特定提示词
  techStack: `
技术栈配置：
- React 18+ with Concurrent Features
- Next.js 14+ with App Router
- TypeScript 5+ with strict mode
- shadcn/ui components
- Tailwind CSS 3+ with CSS variables
- Radix UI primitives
- class-variance-authority for variants
- React Hook Form + Zod for forms
- TanStack Query for data fetching
  `,

  // 代码质量提示词
  quality: `
代码质量要求：
1. 所有组件必须有 TypeScript 类型定义
2. 使用 forwardRef 支持 ref 传递
3. 实现 asChild 模式支持组合
4. 添加适当的 ARIA 属性和语义化标签
5. 支持键盘导航和屏幕阅读器
6. 处理边界情况和错误状态
7. 优化渲染性能和内存使用
8. 遵循 React 最佳实践和 Hooks 规则
  `
};
```

### 2. 组件级提示词

针对不同类型组件的专用提示词：

```typescript
// src/lib/prompts/component-prompts.ts
export const COMPONENT_PROMPTS = {
  // UI 组件提示词
  ui: `
创建 UI 组件时，请遵循以下规范：

结构要求：
1. 基于 shadcn/ui 组件构建，如 Button、Input、Card 等
2. 使用 class-variance-authority (cva) 定义组件变体
3. 支持 forwardRef 和 asChild 模式
4. 实现完整的 TypeScript 接口定义

样式要求：
1. 使用 Tailwind CSS 类进行样式设计
2. 支持 CSS 变量和主题切换
3. 实现响应式设计和暗色模式
4. 遵循设计系统的颜色、间距、字体规范

可访问性要求：
1. 添加适当的 ARIA 属性
2. 支持键盘导航
3. 提供屏幕阅读器支持
4. 实现焦点管理

示例结构：
\`\`\`typescript
interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ variant = 'default', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(componentVariants({ variant, size }), props.className)}
        {...props}
      />
    );
  }
);
\`\`\`
  `,

  // 表单组件提示词
  form: `
创建表单组件时，请遵循以下规范：

表单管理：
1. 使用 React Hook Form 进行表单状态管理
2. 使用 Zod 进行表单验证和类型推断
3. 集成 shadcn/ui 表单组件 (Form, FormField, FormItem)
4. 实现字段验证和错误显示

组件结构：
1. 创建表单 Schema 定义
2. 实现表单字段组件
3. 处理提交和错误状态
4. 支持异步验证和提交

可访问性：
1. 正确关联标签和输入字段
2. 提供错误消息和帮助文本
3. 实现表单导航和焦点管理
4. 支持屏幕阅读器公告

示例结构：
\`\`\`typescript
const formSchema = z.object({
  name: z.string().min(2, "名称至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址")
});

type FormData = z.infer<typeof formSchema>;

const MyForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" }
  });

  const onSubmit = async (data: FormData) => {
    // 处理表单提交
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
\`\`\`
  `,

  // 布局组件提示词
  layout: `
创建布局组件时，请遵循以下规范：

布局技术：
1. 使用 CSS Grid 或 Flexbox 进行布局
2. 实现响应式设计和断点适配
3. 支持内容溢出和滚动处理
4. 考虑布局嵌套和组合

响应式设计：
1. 使用 Tailwind 响应式前缀 (sm:, md:, lg:, xl:, 2xl:)
2. 实现移动优先的设计策略
3. 处理不同屏幕尺寸的布局变化
4. 优化触摸设备的交互体验

性能优化：
1. 使用 CSS Grid 和 Flexbox 的高效布局
2. 避免不必要的重新渲染
3. 实现虚拟滚动（如需要）
4. 优化大型列表的渲染性能

示例结构：
\`\`\`typescript
interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Layout = ({ children, sidebar, header, footer }: LayoutProps) => {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] lg:grid-cols-[250px_1fr]">
      {header && (
        <header className="lg:col-span-2 border-b bg-background/95 backdrop-blur">
          {header}
        </header>
      )}
      
      {sidebar && (
        <aside className="hidden lg:block border-r bg-muted/50">
          {sidebar}
        </aside>
      )}
      
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
      
      {footer && (
        <footer className="lg:col-span-2 border-t bg-muted/50">
          {footer}
        </footer>
      )}
    </div>
  );
};
\`\`\`
  `,

  // 数据组件提示词
  data: `
创建数据组件时，请遵循以下规范：

数据管理：
1. 使用 TanStack Query 进行数据获取和缓存
2. 实现加载、错误、空状态的处理
3. 支持分页、排序、筛选功能
4. 处理数据更新和同步

组件状态：
1. 使用 Suspense 和 ErrorBoundary 处理异步状态
2. 实现乐观更新和回滚机制
3. 处理并发请求和竞态条件
4. 提供用户友好的加载和错误提示

性能优化：
1. 实现虚拟滚动处理大数据集
2. 使用 React.memo 优化渲染性能
3. 实现数据预加载和缓存策略
4. 避免不必要的网络请求

示例结构：
\`\`\`typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: Error | null;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPaginate?: (page: number, pageSize: number) => void;
}

const DataTable = <T,>({
  data,
  columns,
  loading,
  error,
  onSort,
  onFilter,
  onPaginate
}: DataTableProps<T>) => {
  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!data.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar onFilter={onFilter} />
      <Table>
        <TableHeader>
          {/* 表头渲染 */}
        </TableHeader>
        <TableBody>
          {/* 数据行渲染 */}
        </TableBody>
      </Table>
      <DataTablePagination onPaginate={onPaginate} />
    </div>
  );
};
\`\`\`
  `
};
```

### 3. 页面级提示词

针对不同类型页面的专用提示词：

```typescript
// src/lib/prompts/page-prompts.ts
export const PAGE_PROMPTS = {
  // 仪表板页面提示词
  dashboard: `
创建仪表板页面时，请遵循以下规范：

页面结构：
1. 使用网格布局组织内容区域
2. 实现响应式的卡片和图表布局
3. 提供数据概览和关键指标展示
4. 支持个性化和自定义配置

组件组合：
1. 使用统计卡片展示关键数据
2. 集成图表组件显示趋势和分析
3. 实现数据表格展示详细信息
4. 添加快速操作和导航功能

数据处理：
1. 实现实时数据更新和刷新
2. 处理数据加载和错误状态
3. 支持数据筛选和时间范围选择
4. 优化大量数据的渲染性能

示例结构：
\`\`\`typescript
const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">仪表板</h1>
        <div className="flex items-center space-x-2">
          <DateRangePicker />
          <RefreshButton />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="总用户" value={stats?.totalUsers} />
        <StatsCard title="活跃用户" value={stats?.activeUsers} />
        <StatsCard title="收入" value={stats?.revenue} />
        <StatsCard title="转化率" value={stats?.conversionRate} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>用户增长趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <UserGrowthChart data={stats?.userGrowth} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>收入分析</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={stats?.revenueData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivityTable data={stats?.recentActivity} />
        </CardContent>
      </Card>
    </div>
  );
};
\`\`\`
  `,

  // 表单页面提示词
  formPage: `
创建表单页面时，请遵循以下规范：

表单设计：
1. 使用清晰的表单布局和分组
2. 实现步骤式表单（如需要）
3. 提供表单验证和错误处理
4. 支持草稿保存和自动保存

用户体验：
1. 实现表单进度指示
2. 提供字段帮助和提示信息
3. 支持键盘导航和快捷键
4. 实现表单提交状态反馈

数据处理：
1. 实现表单数据的提交和更新
2. 处理文件上传和预览
3. 支持表单数据的导入导出
4. 实现表单历史和版本管理

示例结构：
\`\`\`typescript
const CreateUserPage = () => {
  const router = useRouter();
  const { mutate: createUser, isPending } = useMutation({
    mutationFn: createUserAPI,
    onSuccess: () => {
      toast.success('用户创建成功');
      router.push('/users');
    },
    onError: (error) => {
      toast.error('创建失败：' + error.message);
    }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">创建用户</h1>
        <p className="text-muted-foreground">
          填写下面的信息来创建新用户
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>
            用户的基本信息和联系方式
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            onSubmit={createUser}
            loading={isPending}
            mode="create"
          />
        </CardContent>
      </Card>
    </div>
  );
};
\`\`\`
  `,

  // 列表页面提示词
  listPage: `
创建列表页面时，请遵循以下规范：

列表功能：
1. 实现数据表格和卡片列表视图
2. 支持搜索、筛选、排序功能
3. 实现分页和虚拟滚动
4. 提供批量操作和选择功能

交互设计：
1. 实现行内编辑和快速操作
2. 支持拖拽排序和重新排列
3. 提供详情查看和编辑入口
4. 实现数据导出和打印功能

状态管理：
1. 处理加载、错误、空状态
2. 实现乐观更新和数据同步
3. 支持离线模式和数据缓存
4. 处理并发操作和冲突解决

示例结构：
\`\`\`typescript
const UsersListPage = () => {
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', filters, sorting, pagination],
    queryFn: () => fetchUsers({ filters, sorting, pagination })
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: deleteUserAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('用户删除成功');
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">用户管理</h1>
        <Button asChild>
          <Link href="/users/create">
            <Plus className="mr-2 h-4 w-4" />
            创建用户
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            管理系统中的所有用户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data?.users || []}
            columns={userColumns}
            loading={isLoading}
            error={error}
            filters={filters}
            onFiltersChange={setFilters}
            sorting={sorting}
            onSortingChange={setSorting}
            pagination={pagination}
            onPaginationChange={setPagination}
            onDelete={deleteUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};
\`\`\`
  `
};
```

## 提示词定制

### 1. 创建自定义提示词

```typescript
// src/lib/prompts/custom-prompts.ts
export const CUSTOM_PROMPTS = {
  // 业务特定提示词
  ecommerce: `
创建电商相关组件时，请考虑：

业务逻辑：
1. 实现购物车和订单管理功能
2. 支持商品展示和搜索筛选
3. 集成支付和物流跟踪
4. 处理库存和价格变动

用户体验：
1. 优化商品浏览和对比体验
2. 实现快速购买和结算流程
3. 提供订单状态和物流追踪
4. 支持用户评价和推荐系统

数据安全：
1. 保护用户隐私和支付信息
2. 实现数据加密和安全传输
3. 处理敏感信息的脱敏显示
4. 遵循相关法规和合规要求
  `,

  // 管理后台提示词
  admin: `
创建管理后台组件时，请考虑：

权限控制：
1. 实现基于角色的访问控制
2. 支持细粒度的权限管理
3. 处理权限验证和授权流程
4. 提供权限审计和日志记录

数据管理：
1. 实现 CRUD 操作和批量处理
2. 支持数据导入导出功能
3. 提供数据统计和分析报表
4. 处理大量数据的性能优化

系统监控：
1. 实现系统状态和性能监控
2. 提供错误日志和异常追踪
3. 支持系统配置和参数管理
4. 实现自动化运维和告警机制
  `,

  // 移动端适配提示词
  mobile: `
创建移动端适配组件时，请考虑：

响应式设计：
1. 优先考虑移动端的用户体验
2. 使用触摸友好的交互设计
3. 适配不同屏幕尺寸和分辨率
4. 优化加载速度和性能表现

交互优化：
1. 实现手势操作和滑动交互
2. 优化触摸目标的大小和间距
3. 提供触觉反馈和动画效果
4. 支持横竖屏切换和适配

性能优化：
1. 减少网络请求和数据传输
2. 实现图片懒加载和压缩
3. 优化 JavaScript 包大小
4. 使用 Service Worker 缓存资源
  `
};
```

### 2. 提示词组合和继承

```typescript
// src/lib/prompts/prompt-composer.ts
export class PromptComposer {
  private basePrompts: Record<string, string> = {};
  private customPrompts: Record<string, string> = {};

  constructor(basePrompts: Record<string, string>) {
    this.basePrompts = basePrompts;
  }

  // 添加自定义提示词
  addCustomPrompt(key: string, prompt: string) {
    this.customPrompts[key] = prompt;
  }

  // 组合多个提示词
  compose(keys: string[], context?: Record<string, any>): string {
    const prompts = keys.map(key => 
      this.basePrompts[key] || this.customPrompts[key] || ''
    ).filter(Boolean);

    let composedPrompt = prompts.join('\n\n');

    // 应用上下文变量
    if (context) {
      composedPrompt = this.applyContext(composedPrompt, context);
    }

    return composedPrompt;
  }

  // 继承和扩展提示词
  extend(baseKey: string, extension: string): string {
    const basePrompt = this.basePrompts[baseKey] || '';
    return `${basePrompt}\n\n${extension}`;
  }

  // 应用上下文变量
  private applyContext(prompt: string, context: Record<string, any>): string {
    return prompt.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }
}

// 使用示例
const composer = new PromptComposer(SYSTEM_PROMPTS);

// 组合提示词
const uiComponentPrompt = composer.compose([
  'base',
  'techStack',
  'quality'
], {
  componentName: 'Button',
  componentType: 'ui'
});

// 扩展提示词
const customUIPrompt = composer.extend('ui', `
额外要求：
1. 支持图标和加载状态
2. 实现点击动画效果
3. 支持键盘快捷键
`);
```

### 3. 动态提示词生成

```typescript
// src/lib/prompts/dynamic-prompts.ts
export class DynamicPromptGenerator {
  // 基于组件类型生成提示词
  generateComponentPrompt(config: ComponentConfig): string {
    const basePrompt = COMPONENT_PROMPTS[config.type] || COMPONENT_PROMPTS.ui;
    
    let dynamicPrompt = basePrompt;

    // 添加属性相关提示词
    if (config.props?.length) {
      dynamicPrompt += `\n\n组件属性要求：\n`;
      config.props.forEach(prop => {
        dynamicPrompt += `- ${prop.name}: ${prop.type}${prop.required ? ' (必需)' : ' (可选)'} - ${prop.description}\n`;
      });
    }

    // 添加功能相关提示词
    if (config.features?.length) {
      dynamicPrompt += `\n\n功能要求：\n`;
      config.features.forEach(feature => {
        dynamicPrompt += `- ${feature}\n`;
      });
    }

    // 添加样式相关提示词
    if (config.variants?.length) {
      dynamicPrompt += `\n\n变体要求：\n`;
      config.variants.forEach(variant => {
        dynamicPrompt += `- ${variant.name}: ${variant.values.join(' | ')}\n`;
      });
    }

    return dynamicPrompt;
  }

  // 基于页面类型生成提示词
  generatePagePrompt(config: PageConfig): string {
    const basePrompt = PAGE_PROMPTS[config.type] || PAGE_PROMPTS.dashboard;
    
    let dynamicPrompt = basePrompt;

    // 添加布局相关提示词
    if (config.layout) {
      dynamicPrompt += `\n\n布局要求：\n使用 ${config.layout} 布局模式\n`;
    }

    // 添加组件相关提示词
    if (config.components?.length) {
      dynamicPrompt += `\n\n页面组件：\n`;
      config.components.forEach(component => {
        dynamicPrompt += `- ${component}\n`;
      });
    }

    // 添加路由相关提示词
    if (config.routing) {
      dynamicPrompt += `\n\n路由配置：\n`;
      dynamicPrompt += `- 路径: ${config.routing.path}\n`;
      dynamicPrompt += `- 参数: ${config.routing.params?.join(', ') || '无'}\n`;
    }

    return dynamicPrompt;
  }

  // 基于上下文生成提示词
  generateContextualPrompt(context: ProjectContext): string {
    let contextPrompt = '';

    // 添加项目信息
    contextPrompt += `项目上下文：\n`;
    contextPrompt += `- 项目类型: ${context.projectType}\n`;
    contextPrompt += `- UI 库: ${context.uiLibrary}\n`;
    contextPrompt += `- 样式框架: ${context.styleFramework}\n`;

    // 添加现有组件信息
    if (context.existingComponents?.length) {
      contextPrompt += `\n现有组件：\n`;
      context.existingComponents.forEach(component => {
        contextPrompt += `- ${component.name}: ${component.description}\n`;
      });
    }

    // 添加设计系统信息
    if (context.designSystem) {
      contextPrompt += `\n设计系统：\n`;
      contextPrompt += `- 主色调: ${context.designSystem.primaryColor}\n`;
      contextPrompt += `- 字体: ${context.designSystem.fontFamily}\n`;
      contextPrompt += `- 间距系统: ${context.designSystem.spacing}\n`;
    }

    return contextPrompt;
  }
}
```

## 提示词优化技巧

### 1. 提示词测试和验证

```typescript
// src/lib/prompts/prompt-tester.ts
export class PromptTester {
  async testPrompt(prompt: string, testCases: TestCase[]): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const testCase of testCases) {
      const generatedCode = await this.generateCode(prompt, testCase.input);
      const validation = await this.validateCode(generatedCode, testCase.expected);
      
      results.push({
        testCase: testCase.name,
        input: testCase.input,
        generated: generatedCode,
        validation,
        passed: validation.score >= testCase.threshold
      });
    }

    return results;
  }

  private async validateCode(code: string, expected: ExpectedResult): Promise<ValidationResult> {
    const checks = await Promise.all([
      this.checkSyntax(code),
      this.checkTypes(code),
      this.checkStyle(code),
      this.checkAccessibility(code),
      this.checkPerformance(code)
    ]);

    return {
      score: checks.reduce((sum, check) => sum + check.score, 0) / checks.length,
      details: checks
    };
  }
}

// 使用示例
const tester = new PromptTester();

const testCases = [
  {
    name: 'Button Component',
    input: { name: 'Button', type: 'ui', props: ['variant', 'size'] },
    expected: { hasTypes: true, hasVariants: true, hasAccessibility: true },
    threshold: 0.8
  }
];

const results = await tester.testPrompt(COMPONENT_PROMPTS.ui, testCases);
```

### 2. 提示词性能优化

```typescript
// src/lib/prompts/prompt-optimizer.ts
export class PromptOptimizer {
  // 优化提示词长度
  optimizeLength(prompt: string, maxTokens: number): string {
    const tokens = this.tokenize(prompt);
    
    if (tokens.length <= maxTokens) {
      return prompt;
    }

    // 保留核心信息，移除冗余内容
    const coreTokens = this.extractCoreTokens(tokens, maxTokens);
    return this.detokenize(coreTokens);
  }

  // 优化提示词结构
  optimizeStructure(prompt: string): string {
    const sections = this.parsePromptSections(prompt);
    
    // 重新排序，将最重要的信息放在前面
    const optimizedSections = this.reorderSections(sections);
    
    return optimizedSections.join('\n\n');
  }

  // 移除冗余信息
  removeRedundancy(prompt: string): string {
    const sentences = prompt.split(/[.!?]+/);
    const uniqueSentences = this.deduplicateSentences(sentences);
    
    return uniqueSentences.join('. ');
  }

  private tokenize(text: string): string[] {
    // 简单的分词实现
    return text.split(/\s+/);
  }

  private extractCoreTokens(tokens: string[], maxTokens: number): string[] {
    // 提取核心关键词和重要信息
    const coreTokens = tokens.filter(token => this.isCoreToken(token));
    
    if (coreTokens.length <= maxTokens) {
      return coreTokens;
    }

    // 按重要性排序并截取
    return coreTokens
      .sort((a, b) => this.getTokenImportance(b) - this.getTokenImportance(a))
      .slice(0, maxTokens);
  }

  private isCoreToken(token: string): boolean {
    const coreKeywords = [
      'React', 'TypeScript', 'shadcn', 'Tailwind',
      'component', 'props', 'accessibility', 'responsive'
    ];
    
    return coreKeywords.some(keyword => 
      token.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}
```

### 3. 提示词版本管理

```typescript
// src/lib/prompts/prompt-versioning.ts
export class PromptVersionManager {
  private versions: Map<string, PromptVersion[]> = new Map();

  // 添加新版本
  addVersion(key: string, prompt: string, metadata: VersionMetadata) {
    const versions = this.versions.get(key) || [];
    
    const newVersion: PromptVersion = {
      version: this.getNextVersion(versions),
      prompt,
      metadata,
      createdAt: new Date(),
      performance: null
    };

    versions.push(newVersion);
    this.versions.set(key, versions);
  }

  // 获取最佳版本
  getBestVersion(key: string): PromptVersion | null {
    const versions = this.versions.get(key) || [];
    
    if (!versions.length) return null;

    // 基于性能指标选择最佳版本
    return versions
      .filter(v => v.performance !== null)
      .sort((a, b) => (b.performance?.score || 0) - (a.performance?.score || 0))[0] || versions[versions.length - 1];
  }

  // 比较版本性能
  async compareVersions(key: string, testCases: TestCase[]): Promise<VersionComparison[]> {
    const versions = this.versions.get(key) || [];
    const comparisons: VersionComparison[] = [];

    for (const version of versions) {
      const tester = new PromptTester();
      const results = await tester.testPrompt(version.prompt, testCases);
      
      const performance = {
        score: results.reduce((sum, r) => sum + (r.passed ? 1 : 0), 0) / results.length,
        details: results
      };

      version.performance = performance;
      
      comparisons.push({
        version: version.version,
        performance,
        metadata: version.metadata
      });
    }

    return comparisons.sort((a, b) => b.performance.score - a.performance.score);
  }

  private getNextVersion(versions: PromptVersion[]): string {
    if (!versions.length) return '1.0.0';
    
    const lastVersion = versions[versions.length - 1].version;
    const [major, minor, patch] = lastVersion.split('.').map(Number);
    
    return `${major}.${minor}.${patch + 1}`;
  }
}

interface PromptVersion {
  version: string;
  prompt: string;
  metadata: VersionMetadata;
  createdAt: Date;
  performance: PerformanceMetrics | null;
}

interface VersionMetadata {
  author: string;
  description: string;
  changes: string[];
  tags: string[];
}
```

## 最佳实践

### 1. 提示词编写原则

1. **明确性**：使用清晰、具体的指令
2. **结构化**：按逻辑顺序组织提示词内容
3. **示例驱动**：提供具体的代码示例
4. **上下文相关**：基于项目上下文调整提示词
5. **可测试性**：确保提示词效果可以验证

### 2. 提示词维护策略

1. **版本控制**：对提示词进行版本管理
2. **性能监控**：定期评估提示词效果
3. **持续优化**：基于使用反馈改进提示词
4. **文档更新**：保持提示词文档的及时更新
5. **团队协作**：建立提示词审查和协作机制

### 3. 常见问题解决

#### 问题1：生成的代码不符合预期

**解决方案**：
- 检查提示词的明确性和完整性
- 添加更多具体的示例和约束
- 调整提示词的结构和顺序

#### 问题2：提示词过长导致性能问题

**解决方案**：
- 使用提示词优化器减少冗余
- 分层组织提示词，按需加载
- 使用模板和变量减少重复

#### 问题3：不同场景下效果差异大

**解决方案**：
- 创建场景特定的提示词
- 使用动态提示词生成
- 建立提示词测试和验证机制

## 总结

本指南提供了完整的提示词使用和定制方案，包括：

1. **提示词架构**：分层的提示词组织结构
2. **基础使用**：系统级、组件级、页面级提示词
3. **高级定制**：自定义提示词、动态生成、组合继承
4. **优化技巧**：测试验证、性能优化、版本管理
5. **最佳实践**：编写原则、维护策略、问题解决

通过遵循本指南，开发者可以有效地使用和定制 AI Agent 提示词系统，提高代码生成的质量和效率。