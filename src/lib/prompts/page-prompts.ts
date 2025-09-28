/**
 * 页面生成专用提示词
 * 基于 V0 规范的页面类型特定提示词
 */

export interface PagePrompt {
  id: string;
  name: string;
  category: 'dashboard' | 'form' | 'list' | 'detail' | 'auth' | 'landing';
  description: string;
  prompt: string;
  components: string[];
  layout: string;
  features: string[];
  version: string;
}

/**
 * 仪表板页面提示词
 */
export const DASHBOARD_PAGE_PROMPTS: PagePrompt[] = [
  {
    id: 'admin-dashboard',
    name: '管理仪表板页面',
    category: 'dashboard',
    description: '生成管理后台仪表板页面',
    version: '1.0.0',
    layout: 'grid',
    components: ['Card', 'Chart', 'Table', 'Stats', 'Navigation'],
    features: ['数据可视化', '实时更新', '响应式布局', '权限控制'],
    prompt: `生成一个管理仪表板页面，展示关键业务指标和数据。

## 页面要求

### 布局结构
- 使用 CSS Grid 实现响应式仪表板布局
- 实现侧边栏导航和顶部工具栏
- 提供可定制的小部件区域
- 支持拖拽调整布局（可选）

### 核心组件
- **统计卡片**：显示关键指标（用户数、收入、转化率等）
- **图表组件**：使用 Recharts 或类似库展示趋势数据
- **数据表格**：显示最新的业务数据
- **活动动态**：显示系统或用户活动日志

### 数据管理
- 使用 React Server Components 获取初始数据
- 实现客户端数据刷新和实时更新
- 提供数据筛选和时间范围选择
- 处理加载状态和错误边界

### 交互功能
- 实现图表的交互和钻取功能
- 提供数据导出和分享功能
- 支持个性化设置和布局保存
- 实现快速操作和批量处理

### 响应式设计
- 桌面端：多列网格布局，充分利用屏幕空间
- 平板端：2列布局，优化触摸交互
- 移动端：单列堆叠布局，重要信息优先

### 性能优化
- 实现图表和数据的懒加载
- 使用虚拟滚动处理大数据集
- 优化数据获取和缓存策略
- 实现骨架屏和加载状态

### 使用示例
\`\`\`tsx
export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="总用户" value="12,345" change="+12%" />
            <StatsCard title="活跃用户" value="8,901" change="+5%" />
            <StatsCard title="收入" value="¥123,456" change="+18%" />
            <StatsCard title="转化率" value="3.2%" change="-2%" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>用户增长趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={chartData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>最新活动</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={activities} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>最新订单</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={orderColumns} data={orders} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
\`\`\``,
  },
  {
    id: 'analytics-dashboard',
    name: '数据分析仪表板',
    category: 'dashboard',
    description: '生成数据分析和报表仪表板页面',
    version: '1.0.0',
    layout: 'flexible-grid',
    components: ['Chart', 'Filter', 'DatePicker', 'Export', 'KPI'],
    features: ['数据筛选', '时间范围', '图表交互', '报表导出'],
    prompt: `生成一个数据分析仪表板页面，专注于数据可视化和分析功能。

## 页面要求

### 分析功能
- 提供多维度数据筛选和分组
- 实现时间范围选择和对比分析
- 支持自定义指标和计算字段
- 提供数据钻取和详细分析

### 图表类型
- **趋势图**：线图、面积图显示时间序列数据
- **对比图**：柱状图、条形图进行数据对比
- **分布图**：饼图、环形图显示数据分布
- **关系图**：散点图、气泡图显示数据关系

### 交互体验
- 实现图表的缩放、平移、选择功能
- 提供图表联动和数据关联
- 支持图表类型的动态切换
- 实现数据标注和说明功能

### 数据处理
- 实现实时数据更新和刷新
- 提供数据缓存和离线支持
- 支持大数据集的分页和虚拟化
- 实现数据验证和异常处理`
  }
];

/**
 * 表单页面提示词
 */
export const FORM_PAGE_PROMPTS: PagePrompt[] = [
  {
    id: 'user-profile-form',
    name: '用户资料表单页面',
    category: 'form',
    description: '生成用户资料编辑表单页面',
    version: '1.0.0',
    layout: 'centered',
    components: ['Form', 'Input', 'Select', 'Upload', 'Button'],
    features: ['表单验证', '文件上传', '实时保存', '权限控制'],
    prompt: `生成一个用户资料表单页面，支持完整的用户信息编辑功能。

## 页面要求

### 表单结构
- 使用 react-hook-form + zod 进行表单管理和验证
- 实现分组的表单字段布局
- 提供必填和可选字段的清晰标识
- 支持条件字段和动态表单

### 字段类型
- **基础信息**：姓名、邮箱、电话、生日等
- **地址信息**：国家、省市、详细地址、邮编
- **偏好设置**：语言、时区、通知设置
- **安全设置**：密码修改、两步验证

### 文件上传
- 实现头像上传和裁剪功能
- 支持拖拽上传和进度显示
- 提供文件格式和大小验证
- 实现图片预览和编辑功能

### 用户体验
- 实现表单的自动保存功能
- 提供字段级的实时验证
- 支持表单数据的恢复和重置
- 实现友好的错误提示和成功反馈

### 响应式设计
- 桌面端：双列布局，充分利用屏幕宽度
- 平板端：单列布局，优化触摸交互
- 移动端：堆叠布局，重要字段优先

### 使用示例
\`\`\`tsx
const profileSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  phone: z.string().optional(),
  bio: z.string().max(500, "简介不能超过500字符").optional(),
})

export default function UserProfilePage() {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  })

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>个人资料</CardTitle>
          <CardDescription>
            更新您的个人信息和偏好设置
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <Button variant="outline">更换头像</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="请输入邮箱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>个人简介</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="介绍一下自己..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      简要介绍您的背景和兴趣（最多500字符）
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button">
                  取消
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "保存中..." : "保存更改"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
\`\`\``,
  }
];

/**
 * 列表页面提示词
 */
export const LIST_PAGE_PROMPTS: PagePrompt[] = [
  {
    id: 'data-list-page',
    name: '数据列表页面',
    category: 'list',
    description: '生成数据列表和管理页面',
    version: '1.0.0',
    layout: 'full-width',
    components: ['Table', 'Search', 'Filter', 'Pagination', 'Actions'],
    features: ['搜索筛选', '排序分页', '批量操作', '数据导出'],
    prompt: `生成一个数据列表页面，支持完整的数据管理功能。

## 页面要求

### 数据展示
- 使用 @tanstack/react-table 实现高性能表格
- 支持列的排序、筛选、隐藏/显示
- 实现行选择和批量操作
- 提供数据的多种视图模式（表格、卡片、列表）

### 搜索和筛选
- 实现全局搜索和字段级筛选
- 提供高级筛选和保存筛选条件
- 支持日期范围、数值范围筛选
- 实现搜索历史和快速筛选

### 分页和加载
- 实现服务端分页和客户端分页
- 支持虚拟滚动处理大数据集
- 提供页面大小选择和跳转功能
- 实现无限滚动和懒加载

### 操作功能
- 提供行级操作（查看、编辑、删除）
- 实现批量操作（删除、导出、状态更新）
- 支持拖拽排序和批量移动
- 提供数据导入和导出功能

### 使用示例
\`\`\`tsx
export default function UsersListPage() {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "姓名",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>{row.original.name[0]}</AvatarFallback>
          </Avatar>
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "邮箱",
    },
    {
      accessorKey: "role",
      header: "角色",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => (
        <Badge 
          variant={row.original.status === "active" ? "default" : "secondary"}
        >
          {row.original.status === "active" ? "活跃" : "禁用"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>查看详情</DropdownMenuItem>
            <DropdownMenuItem>编辑</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">用户管理</h1>
          <p className="text-muted-foreground">
            管理系统用户和权限设置
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加用户
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="搜索用户..."
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                className="max-w-sm"
              />
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                筛选
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            sorting={sorting}
            setSorting={setSorting}
            filtering={filtering}
            setFiltering={setFiltering}
            pagination={pagination}
            setPagination={setPagination}
          />
        </CardContent>
      </Card>
    </div>
  )
}
\`\`\``,
  }
];

/**
 * 详情页面提示词
 */
export const DETAIL_PAGE_PROMPTS: PagePrompt[] = [
  {
    id: 'entity-detail-page',
    name: '实体详情页面',
    category: 'detail',
    description: '生成实体详情展示页面',
    version: '1.0.0',
    layout: 'sidebar',
    components: ['Card', 'Tabs', 'Timeline', 'Actions', 'Related'],
    features: ['详情展示', '关联数据', '操作历史', '相关推荐'],
    prompt: `生成一个实体详情页面，展示完整的实体信息和相关数据。

## 页面要求

### 信息展示
- 实现清晰的信息层次和视觉组织
- 提供关键信息的突出显示
- 支持富文本内容和媒体展示
- 实现信息的分组和标签化

### 导航结构
- 使用 Tabs 组织不同类型的信息
- 提供页面内锚点导航
- 实现面包屑导航和返回功能
- 支持相关实体的快速跳转

### 交互功能
- 提供编辑、删除、分享等操作
- 实现收藏、点赞、评论功能
- 支持数据的打印和导出
- 提供相关推荐和关联数据

### 数据加载
- 使用 React Server Components 获取主要数据
- 实现相关数据的懒加载
- 提供加载状态和错误处理
- 支持数据的实时更新

### 使用示例
\`\`\`tsx
export default function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id)
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/users">用户管理</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{user.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">编辑</Button>
          <Button variant="destructive">删除</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <Badge className="mt-2">{user.role}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="activity">活动</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>电话</Label>
                      <p>{user.phone || "未设置"}</p>
                    </div>
                    <div>
                      <Label>注册时间</Label>
                      <p>{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                      <Label>最后登录</Label>
                      <p>{formatDate(user.lastLoginAt)}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>统计信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>登录次数</span>
                      <span className="font-semibold">{user.loginCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>创建项目</span>
                      <span className="font-semibold">{user.projectCount}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>活动历史</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline activities={user.activities} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                发送消息
              </Button>
              <Button className="w-full" variant="outline">
                重置密码
              </Button>
              <Button className="w-full" variant="outline">
                查看权限
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>相关用户</CardTitle>
            </CardHeader>
            <CardContent>
              <RelatedUsers userId={user.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
\`\`\``,
  }
];

/**
 * 认证页面提示词
 */
export const AUTH_PAGE_PROMPTS: PagePrompt[] = [
  {
    id: 'login-page',
    name: '登录页面',
    category: 'auth',
    description: '生成用户登录页面',
    version: '1.0.0',
    layout: 'centered',
    components: ['Form', 'Input', 'Button', 'Link', 'Social'],
    features: ['表单验证', '社交登录', '记住密码', '错误处理'],
    prompt: `生成一个用户登录页面，支持多种登录方式和安全功能。

## 页面要求

### 登录方式
- 邮箱/用户名 + 密码登录
- 社交账号登录（Google、GitHub 等）
- 手机号 + 验证码登录
- 二维码扫码登录

### 表单功能
- 使用 react-hook-form + zod 进行表单管理
- 实现实时验证和错误提示
- 提供密码显示/隐藏切换
- 支持记住登录状态

### 安全特性
- 实现验证码防护
- 提供登录失败次数限制
- 支持两步验证
- 实现设备记住功能

### 用户体验
- 提供清晰的错误信息和帮助
- 实现加载状态和成功反馈
- 支持键盘导航和快捷键
- 优化移动端输入体验

### 使用示例
\`\`\`tsx
const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6位"),
  remember: z.boolean().optional(),
})

export default function LoginPage() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">欢迎回来</CardTitle>
          <CardDescription>
            登录您的账户以继续使用
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="请输入邮箱地址" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="请输入密码" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">记住我</FormLabel>
                    </FormItem>
                  )}
                />
                
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  忘记密码？
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "登录中..." : "登录"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或者使用
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            还没有账户？{" "}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
\`\`\``,
  }
];

/**
 * 获取所有页面提示词
 */
export function getAllPagePrompts(): PagePrompt[] {
  return [
    ...DASHBOARD_PAGE_PROMPTS,
    ...FORM_PAGE_PROMPTS,
    ...LIST_PAGE_PROMPTS,
    ...DETAIL_PAGE_PROMPTS,
    ...AUTH_PAGE_PROMPTS,
  ];
}

/**
 * 根据类别获取页面提示词
 */
export function getPagePromptsByCategory(category: PagePrompt['category']): PagePrompt[] {
  return getAllPagePrompts().filter(prompt => prompt.category === category);
}

/**
 * 根据页面ID获取提示词
 */
export function getPagePromptById(id: string): PagePrompt | undefined {
  return getAllPagePrompts().find(prompt => prompt.id === id);
}

/**
 * 搜索页面提示词
 */
export function searchPagePrompts(query: string): PagePrompt[] {
  const lowerQuery = query.toLowerCase();
  return getAllPagePrompts().filter(prompt =>
    prompt.name.toLowerCase().includes(lowerQuery) ||
    prompt.description.toLowerCase().includes(lowerQuery) ||
    prompt.features.some(feature => feature.toLowerCase().includes(lowerQuery))
  );
}