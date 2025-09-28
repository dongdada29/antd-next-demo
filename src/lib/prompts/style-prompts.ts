/**
 * 样式、交互和性能优化提示词模板
 * 基于 V0 规范的专项优化提示词
 */

export interface StylePrompt {
  id: string;
  name: string;
  category: 'styling' | 'interaction' | 'performance' | 'accessibility';
  description: string;
  prompt: string;
  examples: string[];
  bestPractices: string[];
  version: string;
}

/**
 * 样式设计提示词
 */
export const STYLING_PROMPTS: StylePrompt[] = [
  {
    id: 'tailwind-styling',
    name: 'Tailwind CSS 样式提示词',
    category: 'styling',
    description: 'Tailwind CSS 样式应用和设计系统规范',
    version: '1.0.0',
    prompt: `应用 Tailwind CSS 样式，遵循以下设计原则和最佳实践：

## 样式应用原则

### 1. 实用类优先
- 优先使用 Tailwind 实用类而非自定义 CSS
- 避免内联样式和 CSS-in-JS 解决方案
- 使用 \`cn()\` 函数合并和管理类名
- 保持样式的原子性和可复用性

### 2. 设计系统一致性
- 使用语义化的颜色变量：\`bg-primary\`、\`text-foreground\`
- 遵循标准间距系统：\`space-y-4\`、\`gap-6\`、\`p-4\`
- 应用一致的圆角：\`rounded-md\`、\`rounded-lg\`
- 使用标准阴影：\`shadow-sm\`、\`shadow-md\`

### 3. 响应式设计
- 采用移动优先的设计方法
- 使用标准断点：\`sm:\`、\`md:\`、\`lg:\`、\`xl:\`、\`2xl:\`
- 实现流畅的响应式布局和组件适配
- 优化不同设备的用户体验

### 4. 暗色模式支持
- 使用 \`dark:\` 前缀定义暗色模式样式
- 优先使用语义化颜色变量自动适配
- 确保暗色模式下的可读性和对比度
- 实现平滑的主题切换过渡

## 布局技术规范

### Flexbox 布局
\`\`\`css
/* 水平居中对齐 */
.flex.items-center.justify-center

/* 两端对齐 */
.flex.items-center.justify-between

/* 垂直堆叠 */
.flex.flex-col.space-y-4

/* 响应式方向 */
.flex.flex-col.md:flex-row.gap-4
\`\`\`

### Grid 布局
\`\`\`css
/* 响应式网格 */
.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-3.gap-6

/* 12列网格系统 */
.grid.grid-cols-12.gap-4
/* 子元素跨列 */
.col-span-6.md:col-span-4.lg:col-span-3

/* 自适应网格 */
.grid.grid-cols-[repeat(auto-fit,minmax(300px,1fr))].gap-6
\`\`\`

## 颜色系统规范

### 语义化颜色
\`\`\`css
/* 主要颜色 */
.bg-primary.text-primary-foreground
.bg-secondary.text-secondary-foreground

/* 状态颜色 */
.bg-destructive.text-destructive-foreground
.bg-success.text-success-foreground
.bg-warning.text-warning-foreground

/* 中性颜色 */
.bg-muted.text-muted-foreground
.bg-accent.text-accent-foreground
\`\`\`

### 边框和分割
\`\`\`css
/* 标准边框 */
.border.border-border
.border-t.border-border
.divide-y.divide-border

/* 焦点边框 */
.focus:ring-2.focus:ring-ring.focus:ring-offset-2
\`\`\`

## 字体和排版

### 字体大小系统
\`\`\`css
/* 标题层次 */
.text-4xl.font-bold.tracking-tight  /* h1 */
.text-3xl.font-semibold            /* h2 */
.text-2xl.font-semibold            /* h3 */
.text-xl.font-medium               /* h4 */
.text-lg.font-medium               /* h5 */
.text-base.font-medium             /* h6 */

/* 正文文本 */
.text-base.leading-7               /* 正文 */
.text-sm.text-muted-foreground     /* 辅助文本 */
.text-xs.text-muted-foreground     /* 说明文本 */
\`\`\`

### 文本处理
\`\`\`css
/* 文本截断 */
.truncate
.line-clamp-2
.line-clamp-3

/* 文本对齐 */
.text-left.md:text-center.lg:text-right
\`\`\`

## 间距和尺寸

### 间距系统
\`\`\`css
/* 内边距 */
.p-4.md:p-6.lg:p-8
.px-4.py-2
.pt-6.pb-4

/* 外边距 */
.m-4.md:m-6
.mx-auto
.mt-6.mb-4

/* 间隙 */
.space-y-4
.space-x-2
.gap-4.md:gap-6
\`\`\`

### 尺寸控制
\`\`\`css
/* 宽度 */
.w-full.max-w-md.mx-auto
.w-1/2.md:w-1/3.lg:w-1/4

/* 高度 */
.h-screen.min-h-screen
.h-10.md:h-12
\`\`\`

## 交互状态

### 悬停效果
\`\`\`css
.hover:bg-accent.hover:text-accent-foreground
.hover:scale-105.transition-transform
.hover:shadow-md.transition-shadow
\`\`\`

### 焦点状态
\`\`\`css
.focus:outline-none.focus:ring-2.focus:ring-ring
.focus-visible:ring-2.focus-visible:ring-ring
\`\`\`

### 禁用状态
\`\`\`css
.disabled:opacity-50.disabled:pointer-events-none
\`\`\`

## 动画和过渡

### 标准过渡
\`\`\`css
.transition-colors.duration-200
.transition-all.duration-300.ease-in-out
.animate-in.slide-in-from-bottom-2
\`\`\`

### 加载动画
\`\`\`css
.animate-spin
.animate-pulse
.animate-bounce
\`\`\`

请确保所有样式都遵循这些规范，保持设计的一致性和可维护性。`,
    examples: [
      'bg-primary text-primary-foreground hover:bg-primary/90',
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      'flex items-center justify-between p-4 border-b',
      'text-2xl font-semibold tracking-tight'
    ],
    bestPractices: [
      '使用语义化颜色变量',
      '实现移动优先的响应式设计',
      '保持一致的间距和字体系统',
      '优化暗色模式适配'
    ]
  },
  {
    id: 'responsive-design',
    name: '响应式设计提示词',
    category: 'styling',
    description: '响应式设计和移动端优化规范',
    version: '1.0.0',
    prompt: `实现响应式设计，确保在所有设备上的最佳用户体验：

## 响应式设计原则

### 1. 移动优先策略
- 从最小屏幕开始设计，逐步增强
- 优先考虑核心功能和内容
- 确保触摸友好的交互元素
- 优化移动端的加载性能

### 2. 断点系统
\`\`\`css
/* Tailwind 标准断点 */
/* 默认: < 640px (移动端) */
sm: 640px   /* 小平板 */
md: 768px   /* 平板 */
lg: 1024px  /* 小桌面 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大桌面 */
\`\`\`

### 3. 布局适配模式
\`\`\`css
/* 堆叠到并排 */
.flex.flex-col.md:flex-row

/* 单列到多列网格 */
.grid.grid-cols-1.sm:grid-cols-2.lg:grid-cols-3

/* 隐藏和显示 */
.hidden.md:block
.block.md:hidden

/* 尺寸调整 */
.text-sm.md:text-base.lg:text-lg
.p-4.md:p-6.lg:p-8
\`\`\`

## 组件响应式模式

### 导航组件
\`\`\`tsx
// 桌面端：水平导航
// 移动端：汉堡菜单
<nav className="flex items-center justify-between p-4">
  <Logo />
  <div className="hidden md:flex space-x-6">
    <NavLinks />
  </div>
  <Button className="md:hidden" variant="ghost">
    <Menu />
  </Button>
</nav>
\`\`\`

### 卡片网格
\`\`\`tsx
// 响应式卡片布局
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {items.map(item => (
    <Card key={item.id} className="p-4 md:p-6">
      <CardContent className="text-sm md:text-base">
        {item.content}
      </CardContent>
    </Card>
  ))}
</div>
\`\`\`

### 表单布局
\`\`\`tsx
// 单列到双列表单
<form className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormField name="firstName" />
    <FormField name="lastName" />
  </div>
  <FormField name="email" className="md:col-span-2" />
</form>
\`\`\`

## 内容优先级

### 移动端内容策略
- 显示最重要的信息和操作
- 隐藏或折叠次要内容
- 使用渐进式披露
- 优化触摸目标大小（最小44px）

### 桌面端增强
- 显示更多详细信息
- 提供更多操作选项
- 利用更大的屏幕空间
- 实现更复杂的交互

## 性能优化

### 图片响应式
\`\`\`tsx
<Image
  src="/image.jpg"
  alt="描述"
  width={800}
  height={600}
  className="w-full h-auto"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
\`\`\`

### 字体加载优化
\`\`\`css
/* 字体显示优化 */
.font-sans { font-display: swap; }
\`\`\`

请确保所有组件都具有良好的响应式行为和移动端体验。`,
    examples: [
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
      'flex flex-col md:flex-row items-start md:items-center',
      'text-sm md:text-base lg:text-lg',
      'hidden md:block'
    ],
    bestPractices: [
      '移动优先的设计策略',
      '合理使用断点系统',
      '优化触摸交互体验',
      '考虑内容优先级'
    ]
  }
];

/**
 * 交互设计提示词
 */
export const INTERACTION_PROMPTS: StylePrompt[] = [
  {
    id: 'user-interactions',
    name: '用户交互提示词',
    category: 'interaction',
    description: '用户交互和状态管理规范',
    version: '1.0.0',
    prompt: `实现优秀的用户交互体验，包括状态反馈、动画效果和用户引导：

## 交互设计原则

### 1. 即时反馈
- 为所有用户操作提供即时的视觉反馈
- 使用加载状态指示长时间操作
- 实现成功、错误、警告的状态提示
- 提供操作确认和撤销功能

### 2. 状态管理
\`\`\`tsx
// 加载状态
const [isLoading, setIsLoading] = useState(false)

// 错误处理
const [error, setError] = useState<string | null>(null)

// 成功反馈
const { toast } = useToast()

const handleSubmit = async (data) => {
  setIsLoading(true)
  setError(null)
  
  try {
    await submitData(data)
    toast({
      title: "操作成功",
      description: "数据已保存",
    })
  } catch (err) {
    setError("操作失败，请重试")
  } finally {
    setIsLoading(false)
  }
}
\`\`\`

### 3. 微交互设计
\`\`\`css
/* 悬停效果 */
.hover:scale-105.transition-transform.duration-200
.hover:shadow-lg.transition-shadow

/* 点击效果 */
.active:scale-95.transition-transform

/* 焦点效果 */
.focus:ring-2.focus:ring-primary.focus:ring-offset-2
\`\`\`

## 常见交互模式

### 按钮交互
\`\`\`tsx
<Button
  onClick={handleClick}
  disabled={isLoading}
  className="transition-all duration-200 hover:scale-105 active:scale-95"
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      处理中...
    </>
  ) : (
    "提交"
  )}
</Button>
\`\`\`

### 表单交互
\`\`\`tsx
<FormField
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>邮箱</FormLabel>
      <FormControl>
        <Input
          {...field}
          className={cn(
            "transition-colors",
            fieldState.error && "border-destructive focus:ring-destructive"
          )}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
\`\`\`

### 列表交互
\`\`\`tsx
<div className="space-y-2">
  {items.map((item) => (
    <div
      key={item.id}
      className="p-4 rounded-lg border transition-colors hover:bg-accent cursor-pointer"
      onClick={() => handleItemClick(item)}
    >
      <h3 className="font-medium">{item.title}</h3>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </div>
  ))}
</div>
\`\`\`

## 动画和过渡

### 页面过渡
\`\`\`tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
\`\`\`

### 组件动画
\`\`\`css
/* 进入动画 */
.animate-in.slide-in-from-bottom-2.duration-300

/* 退出动画 */
.animate-out.slide-out-to-top-2.duration-200

/* 状态过渡 */
.transition-all.duration-200.ease-in-out
\`\`\`

## 键盘导航

### 焦点管理
\`\`\`tsx
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      handleActivate()
      break
    case 'Escape':
      handleClose()
      break
    case 'ArrowDown':
      focusNext()
      break
    case 'ArrowUp':
      focusPrevious()
      break
  }
}
\`\`\`

### Tab 顺序
\`\`\`tsx
<div className="space-y-4">
  <Button tabIndex={1}>主要操作</Button>
  <Button variant="outline" tabIndex={2}>次要操作</Button>
  <Button variant="ghost" tabIndex={3}>其他操作</Button>
</div>
\`\`\`

请确保所有交互都提供清晰的反馈和流畅的用户体验。`,
    examples: [
      'hover:bg-accent hover:text-accent-foreground transition-colors',
      'focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      'animate-in slide-in-from-bottom-2 duration-300'
    ],
    bestPractices: [
      '提供即时的视觉反馈',
      '实现流畅的状态过渡',
      '支持键盘导航',
      '优化触摸交互体验'
    ]
  }
];

/**
 * 性能优化提示词
 */
export const PERFORMANCE_PROMPTS: StylePrompt[] = [
  {
    id: 'react-performance',
    name: 'React 性能优化提示词',
    category: 'performance',
    description: 'React 组件和应用性能优化技术',
    version: '1.0.0',
    prompt: `实现 React 应用的性能优化，确保流畅的用户体验：

## React 性能优化策略

### 1. 组件优化
\`\`\`tsx
// 使用 React.memo 防止不必要的重渲染
const OptimizedComponent = React.memo(({ data, onAction }) => {
  return (
    <div>
      {data.map(item => (
        <ItemComponent key={item.id} item={item} onAction={onAction} />
      ))}
    </div>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.data.length === nextProps.data.length &&
         prevProps.onAction === nextProps.onAction
})

// 使用 useMemo 缓存计算结果
const ExpensiveComponent = ({ items, filter }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter)
  }, [items, filter])

  const totalValue = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.value, 0)
  }, [filteredItems])

  return (
    <div>
      <p>总计: {totalValue}</p>
      {filteredItems.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

// 使用 useCallback 缓存函数引用
const ListComponent = ({ items, onItemUpdate }) => {
  const handleItemClick = useCallback((itemId) => {
    onItemUpdate(itemId, { clicked: true })
  }, [onItemUpdate])

  const handleItemDelete = useCallback((itemId) => {
    onItemUpdate(itemId, { deleted: true })
  }, [onItemUpdate])

  return (
    <div>
      {items.map(item => (
        <ItemComponent
          key={item.id}
          item={item}
          onClick={handleItemClick}
          onDelete={handleItemDelete}
        />
      ))}
    </div>
  )
}
\`\`\`

### 2. 代码分割和懒加载
\`\`\`tsx
// 路由级代码分割
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

// 组件级懒加载
const HeavyChart = lazy(() => import('./components/HeavyChart'))

const DashboardPage = () => {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <h1>仪表板</h1>
      <Button onClick={() => setShowChart(true)}>
        显示图表
      </Button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  )
}
\`\`\`

### 3. 虚拟化处理大列表
\`\`\`tsx
import { FixedSizeList as List } from 'react-window'

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style} className="flex items-center p-4 border-b">
      <ItemComponent item={items[index]} />
    </div>
  )

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      className="border rounded-lg"
    >
      {Row}
    </List>
  )
}
\`\`\`

### 4. 状态管理优化
\`\`\`tsx
// 使用 Context 避免 prop drilling
const ThemeContext = createContext()
const UserContext = createContext()

// 分离不同类型的状态
const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <UserProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

// 使用 useReducer 管理复杂状态
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null }
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, data: action.payload }
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
\`\`\`

## 资源优化

### 图片优化
\`\`\`tsx
import Image from 'next/image'

// 使用 Next.js Image 组件
<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // 关键图片优先加载
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 响应式图片
<Image
  src="/responsive-image.jpg"
  alt="Responsive image"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
\`\`\`

### 字体优化
\`\`\`tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="zh" className={inter.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
\`\`\`

## 网络优化

### 数据获取优化
\`\`\`tsx
// 使用 SWR 进行数据缓存
import useSWR from 'swr'

const ProfilePage = () => {
  const { data: user, error, mutate } = useSWR('/api/user', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1分钟内去重
  })

  if (error) return <ErrorMessage />
  if (!user) return <LoadingSkeleton />

  return <UserProfile user={user} onUpdate={mutate} />
}

// 预加载关键数据
const HomePage = () => {
  useEffect(() => {
    // 预加载可能需要的数据
    router.prefetch('/dashboard')
    preloadQuery('/api/user')
  }, [])

  return <HomeContent />
}
\`\`\`

### 请求优化
\`\`\`tsx
// 防抖搜索
const SearchInput = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const { data: results } = useSWR(
    debouncedQuery ? \`/api/search?q=\${debouncedQuery}\` : null,
    fetcher
  )

  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="搜索..."
    />
  )
}

// 批量请求
const batchRequests = async (ids) => {
  const response = await fetch('/api/batch', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  })
  return response.json()
}
\`\`\`

请确保所有组件都经过性能优化，提供流畅的用户体验。`,
    examples: [
      'React.memo(Component, compareFunction)',
      'useMemo(() => expensiveCalculation(data), [data])',
      'useCallback((id) => handleClick(id), [handleClick])',
      'lazy(() => import("./HeavyComponent"))'
    ],
    bestPractices: [
      '使用 React.memo 防止不必要的重渲染',
      '应用 useMemo 和 useCallback 优化',
      '实现代码分割和懒加载',
      '优化数据获取和缓存策略'
    ]
  }
];

/**
 * 可访问性提示词
 */
export const ACCESSIBILITY_PROMPTS: StylePrompt[] = [
  {
    id: 'web-accessibility',
    name: 'Web 可访问性提示词',
    category: 'accessibility',
    description: 'Web 可访问性标准和实践指导',
    version: '1.0.0',
    prompt: `实现 Web 可访问性标准 (WCAG 2.1 AA)，确保所有用户都能使用应用：

## 可访问性核心原则

### 1. 可感知性 (Perceivable)
- 为所有非文本内容提供文本替代
- 提供多媒体的字幕和描述
- 确保足够的颜色对比度
- 支持文本缩放和响应式设计

### 2. 可操作性 (Operable)
- 支持完整的键盘导航
- 避免引起癫痫的闪烁内容
- 提供足够的时间完成任务
- 帮助用户导航和查找内容

### 3. 可理解性 (Understandable)
- 使文本可读和可理解
- 使内容以可预测的方式出现和操作
- 帮助用户避免和纠正错误

### 4. 健壮性 (Robust)
- 确保内容能被各种用户代理解释
- 使用有效的、语义化的标记
- 兼容辅助技术

## 语义化 HTML

### 正确的标签使用
\`\`\`tsx
// 使用语义化的 HTML 结构
<main>
  <header>
    <h1>页面标题</h1>
    <nav aria-label="主导航">
      <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/about">关于</a></li>
      </ul>
    </nav>
  </header>
  
  <section aria-labelledby="content-heading">
    <h2 id="content-heading">内容标题</h2>
    <article>
      <h3>文章标题</h3>
      <p>文章内容...</p>
    </article>
  </section>
  
  <aside aria-label="相关链接">
    <h2>相关内容</h2>
    <ul>
      <li><a href="/related">相关文章</a></li>
    </ul>
  </aside>
  
  <footer>
    <p>&copy; 2024 公司名称</p>
  </footer>
</main>

// 表单的语义化结构
<form>
  <fieldset>
    <legend>个人信息</legend>
    <div>
      <label htmlFor="name">姓名 <span aria-label="必填">*</span></label>
      <input
        id="name"
        type="text"
        required
        aria-describedby="name-help"
      />
      <div id="name-help">请输入您的真实姓名</div>
    </div>
  </fieldset>
</form>
\`\`\`

### 标题层次结构
\`\`\`tsx
// 正确的标题层次
<h1>页面主标题</h1>
  <h2>主要章节</h2>
    <h3>子章节</h3>
      <h4>详细内容</h4>
  <h2>另一个主要章节</h2>
    <h3>子章节</h3>
\`\`\`

## ARIA 标签和属性

### 常用 ARIA 属性
\`\`\`tsx
// 按钮和链接
<Button
  aria-label="关闭对话框"
  aria-describedby="close-help"
  onClick={handleClose}
>
  <X className="h-4 w-4" />
</Button>
<div id="close-help" className="sr-only">
  点击此按钮将关闭对话框并返回上一页
</div>

// 展开/收起状态
<Button
  aria-expanded={isOpen}
  aria-controls="menu-content"
  onClick={() => setIsOpen(!isOpen)}
>
  菜单 <ChevronDown className="h-4 w-4" />
</Button>
<div id="menu-content" hidden={!isOpen}>
  <MenuContent />
</div>

// 选择状态
<div role="tablist">
  <Button
    role="tab"
    aria-selected={activeTab === 'tab1'}
    aria-controls="panel1"
    onClick={() => setActiveTab('tab1')}
  >
    标签页 1
  </Button>
</div>
<div
  id="panel1"
  role="tabpanel"
  aria-labelledby="tab1"
  hidden={activeTab !== 'tab1'}
>
  内容 1
</div>

// 实时区域
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

<div aria-live="assertive">
  {errorMessage}
</div>
\`\`\`

### 表单可访问性
\`\`\`tsx
<FormField
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel htmlFor="email">
        邮箱地址 <span className="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <Input
          {...field}
          id="email"
          type="email"
          required
          aria-invalid={fieldState.error ? 'true' : 'false'}
          aria-describedby={
            fieldState.error ? 'email-error' : 'email-description'
          }
        />
      </FormControl>
      <FormDescription id="email-description">
        我们将使用此邮箱发送重要通知
      </FormDescription>
      {fieldState.error && (
        <FormMessage id="email-error" role="alert">
          {fieldState.error.message}
        </FormMessage>
      )}
    </FormItem>
  )}
/>
\`\`\`

## 键盘导航

### 焦点管理
\`\`\`tsx
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // 保存当前焦点
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // 将焦点移到模态框
      modalRef.current?.focus()
      
      // 阻止背景滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 恢复焦点
      previousFocusRef.current?.focus()
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
    
    // 焦点陷阱
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border bg-background p-6 shadow-lg"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
\`\`\`

### 跳过链接
\`\`\`tsx
const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded"
  >
    跳转到主要内容
  </a>
)
\`\`\`

## 颜色和对比度

### 对比度要求
\`\`\`css
/* 确保足够的对比度 */
/* 正常文本: 4.5:1 */
/* 大文本 (18px+ 或 14px+ 粗体): 3:1 */
/* 非文本元素: 3:1 */

.text-high-contrast {
  color: hsl(0 0% 0%); /* 黑色文本 */
  background: hsl(0 0% 100%); /* 白色背景 */
}

.button-accessible {
  background: hsl(220 100% 40%); /* 深蓝色 */
  color: hsl(0 0% 100%); /* 白色文字 */
}
\`\`\`

### 不依赖颜色传达信息
\`\`\`tsx
// 错误示例：仅用颜色表示状态
<span className="text-red-500">错误</span>

// 正确示例：结合图标和文字
<span className="text-destructive flex items-center">
  <AlertCircle className="mr-1 h-4 w-4" />
  错误：请检查输入内容
</span>

// 表单验证
<FormMessage className="flex items-center text-destructive">
  <X className="mr-1 h-4 w-4" />
  {error.message}
</FormMessage>
\`\`\`

请确保所有组件都符合可访问性标准，为所有用户提供平等的使用体验。`,
    examples: [
      'aria-label="关闭对话框"',
      'aria-expanded={isOpen}',
      'role="button" tabIndex={0}',
      'aria-describedby="help-text"'
    ],
    bestPractices: [
      '使用语义化的 HTML 结构',
      '提供适当的 ARIA 标签',
      '支持完整的键盘导航',
      '确保足够的颜色对比度'
    ]
  }
];

/**
 * 获取所有样式提示词
 */
export function getAllStylePrompts(): StylePrompt[] {
  return [
    ...STYLING_PROMPTS,
    ...INTERACTION_PROMPTS,
    ...PERFORMANCE_PROMPTS,
    ...ACCESSIBILITY_PROMPTS,
  ];
}

/**
 * 根据类别获取样式提示词
 */
export function getStylePromptsByCategory(category: StylePrompt['category']): StylePrompt[] {
  return getAllStylePrompts().filter(prompt => prompt.category === category);
}

/**
 * 根据ID获取样式提示词
 */
export function getStylePromptById(id: string): StylePrompt | undefined {
  return getAllStylePrompts().find(prompt => prompt.id === id);
}

/**
 * 搜索样式提示词
 */
export function searchStylePrompts(query: string): StylePrompt[] {
  const lowerQuery = query.toLowerCase();
  return getAllStylePrompts().filter(prompt =>
    prompt.name.toLowerCase().includes(lowerQuery) ||
    prompt.description.toLowerCase().includes(lowerQuery) ||
    prompt.bestPractices.some(practice => practice.toLowerCase().includes(lowerQuery))
  );
}