'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  Code, 
  Lightbulb, 
  Target, 
  Zap,
  Shield,
  Accessibility,
  Smartphone,
  Gauge,
  BookOpen,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const BestPracticesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('components');

  const categories = {
    components: {
      title: '组件设计',
      icon: <Code className="h-4 w-4" />,
      description: '组件设计和开发的最佳实践'
    },
    accessibility: {
      title: '可访问性',
      icon: <Accessibility className="h-4 w-4" />,
      description: '确保应用对所有用户都可访问'
    },
    performance: {
      title: '性能优化',
      icon: <Gauge className="h-4 w-4" />,
      description: '提升应用性能和用户体验'
    },
    responsive: {
      title: '响应式设计',
      icon: <Smartphone className="h-4 w-4" />,
      description: '适配不同设备和屏幕尺寸'
    },
    security: {
      title: '安全实践',
      icon: <Shield className="h-4 w-4" />,
      description: '保护应用和用户数据安全'
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('代码已复制到剪贴板');
  };

  const ComponentBestPractices = () => (
    <div className="space-y-8">
      {/* 组件结构 */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          组件结构设计
        </h3>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                推荐做法
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">使用 forwardRef 和 TypeScript</h4>
                <ScrollArea className="h-48 rounded-md border bg-background p-4">
                  <pre className="text-sm">
                    <code>{`import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ 
  className, 
  variant = 'default', 
  size = 'default',
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : 'button';
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, type ButtonProps };`}</code>
                  </pre>
                </ScrollArea>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCode(`import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ 
  className, 
  variant = 'default', 
  size = 'default',
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : 'button';
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, type ButtonProps };`)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  复制代码
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <XCircle className="h-5 w-5" />
                避免的做法
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">缺少类型定义和 ref 支持</h4>
                <ScrollArea className="h-48 rounded-md border bg-background p-4">
                  <pre className="text-sm">
                    <code>{`// ❌ 不推荐：缺少类型定义
const Button = ({ children, onClick }) => {
  return (
    <button 
      className="px-4 py-2 bg-blue-500 text-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ 不推荐：硬编码样式
const Card = ({ children }) => {
  return (
    <div style={{
      padding: '16px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      {children}
    </div>
  );
};`}</code>
                  </pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 样式管理 */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5" />
          样式管理最佳实践
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>使用 class-variance-authority</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>使用 cva 创建类型安全的组件变体：</p>
              <ScrollArea className="h-32 rounded-md border bg-background p-2 mt-2">
                <pre className="text-xs">
                  <code>{`const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input hover:bg-accent",
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
);`}</code>
                </pre>
              </ScrollArea>
            </AlertDescription>
          </Alert>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>CSS 变量和主题</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>使用 CSS 变量实现主题切换：</p>
              <ScrollArea className="h-32 rounded-md border bg-background p-2 mt-2">
                <pre className="text-xs">
                  <code>{`:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 84% 4.9%;
}`}</code>
                </pre>
              </ScrollArea>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* 状态管理 */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">状态管理模式</h3>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>受控 vs 非受控组件</CardTitle>
              <CardDescription>
                选择合适的组件状态管理模式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700 dark:text-green-300">✅ 受控组件（推荐）</h4>
                  <ScrollArea className="h-40 rounded-md border bg-background p-3">
                    <pre className="text-xs">
                      <code>{`interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

const Input = ({ value, onChange, ...props }: InputProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  );
};

// 使用
const [value, setValue] = useState('');
<Input value={value} onChange={setValue} />`}</code>
                    </pre>
                  </ScrollArea>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-700 dark:text-amber-300">⚠️ 非受控组件（特定场景）</h4>
                  <ScrollArea className="h-40 rounded-md border bg-background p-3">
                    <pre className="text-xs">
                      <code>{`const Input = ({ defaultValue, ...props }: InputProps) => {
  const [value, setValue] = useState(defaultValue || '');
  
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
};

// 使用
<Input defaultValue="初始值" />`}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const AccessibilityBestPractices = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          可访问性核心原则
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">可感知</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                信息和用户界面组件必须以用户能够感知的方式呈现
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">可操作</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                用户界面组件和导航必须是可操作的
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">可理解</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                信息和用户界面的操作必须是可理解的
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-lg">健壮性</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                内容必须足够健壮，能够被各种用户代理解释
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">ARIA 属性使用</h3>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">正确使用 ARIA</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 rounded-md border bg-background p-4">
                <pre className="text-sm">
                  <code>{`// 按钮组件
<button
  aria-label="关闭对话框"
  aria-describedby="dialog-description"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</button>

// 表单字段
<div>
  <label htmlFor="email" className="sr-only">
    邮箱地址
  </label>
  <input
    id="email"
    type="email"
    placeholder="输入邮箱地址"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <div id="email-error" role="alert" className="text-red-500">
      请输入有效的邮箱地址
    </div>
  )}
</div>

// 导航菜单
<nav aria-label="主导航">
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem" aria-current="page">
        首页
      </a>
    </li>
    <li role="none">
      <button
        role="menuitem"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleSubmenu}
      >
        产品
      </button>
    </li>
  </ul>
</nav>`}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>键盘导航支持</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 rounded-md border bg-background p-4">
                <pre className="text-sm">
                  <code>{`const Dialog = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 聚焦到对话框
      dialogRef.current?.focus();
      
      // 捕获焦点
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        
        // Tab 键循环聚焦
        if (e.key === 'Tab') {
          trapFocus(e, dialogRef.current);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-background p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};`}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">颜色对比度</h3>
        
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>WCAG 2.1 AA 标准</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              <p>确保文本和背景的对比度符合标准：</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>普通文本：至少 4.5:1 的对比度</li>
                <li>大文本（18pt+ 或 14pt+ 粗体）：至少 3:1 的对比度</li>
                <li>非文本元素：至少 3:1 的对比度</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  const PerformanceBestPractices = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          性能优化策略
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>React 性能优化</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 rounded-md border bg-background p-4">
                <pre className="text-sm">
                  <code>{`// 使用 React.memo 优化组件渲染
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  return (
    <div>
      {data.map(item => (
        <ItemComponent key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.data.length === nextProps.data.length &&
         prevProps.data.every((item, index) => 
           item.id === nextProps.data[index].id
         );
});

// 使用 useMemo 缓存计算结果
const DataTable = ({ data, filters }) => {
  const filteredData = useMemo(() => {
    return data.filter(item => 
      filters.every(filter => filter.test(item))
    );
  }, [data, filters]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);

  return <Table data={sortedData} />;
};

// 使用 useCallback 缓存函数
const ParentComponent = ({ items }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <div>
      {items.map(item => (
        <ChildComponent
          key={item.id}
          item={item}
          onSelect={handleSelect}
          isSelected={selectedId === item.id}
        />
      ))}
    </div>
  );
};`}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>代码分割和懒加载</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 rounded-md border bg-background p-4">
                <pre className="text-sm">
                  <code>{`// 路由级代码分割
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

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
  );
}

// 组件级懒加载
const HeavyChart = lazy(() => import('./HeavyChart'));

const Dashboard = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>仪表板</h1>
      <button onClick={() => setShowChart(true)}>
        显示图表
      </button>
      
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
};

// 动态导入
const loadFeature = async () => {
  const { AdvancedFeature } = await import('./AdvancedFeature');
  return AdvancedFeature;
};`}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">图片和资源优化</h3>
        
        <div className="grid gap-4 lg:grid-cols-2">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Next.js Image 组件</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>使用 Next.js Image 组件自动优化图片：</p>
              <ScrollArea className="h-32 rounded-md border bg-background p-2 mt-2">
                <pre className="text-xs">
                  <code>{`import Image from 'next/image';

// 自动优化、懒加载、响应式
<Image
  src="/hero-image.jpg"
  alt="英雄图片"
  width={800}
  height={600}
  priority // 首屏图片
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 填充容器
<div className="relative w-full h-64">
  <Image
    src="/background.jpg"
    alt="背景"
    fill
    className="object-cover"
  />
</div>`}</code>
                </pre>
              </ScrollArea>
            </AlertDescription>
          </Alert>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>资源预加载</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>预加载关键资源提升性能：</p>
              <ScrollArea className="h-32 rounded-md border bg-background p-2 mt-2">
                <pre className="text-xs">
                  <code>{`// 在 _document.tsx 中预加载字体
<Head>
  <link
    rel="preload"
    href="/fonts/inter-var.woff2"
    as="font"
    type="font/woff2"
    crossOrigin=""
  />
</Head>

// 预加载关键 CSS
<link
  rel="preload"
  href="/styles/critical.css"
  as="style"
  onLoad="this.onload=null;this.rel='stylesheet'"
/>

// 预连接外部域名
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://api.example.com" />`}</code>
                </pre>
              </ScrollArea>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );

  const ResponsiveBestPractices = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          响应式设计原则
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">移动优先</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                从最小屏幕开始设计，逐步增强到更大屏幕
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">弹性布局</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                使用 Flexbox 和 Grid 创建灵活的布局系统
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">触摸友好</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                确保触摸目标足够大，间距合理
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Tailwind CSS 响应式</h3>
        
        <Card>
          <CardHeader>
            <CardTitle>断点系统</CardTitle>
            <CardDescription>
              Tailwind CSS 的响应式断点和使用方法
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">断点定义</h4>
                  <ScrollArea className="h-32 rounded-md border bg-background p-3">
                    <pre className="text-xs">
                      <code>{`// tailwind.config.ts
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // 小屏幕
      'md': '768px',   // 中等屏幕
      'lg': '1024px',  // 大屏幕
      'xl': '1280px',  // 超大屏幕
      '2xl': '1536px', // 2倍超大屏幕
    }
  }
}`}</code>
                    </pre>
                  </ScrollArea>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">使用示例</h4>
                  <ScrollArea className="h-32 rounded-md border bg-background p-3">
                    <pre className="text-xs">
                      <code>{`<!-- 响应式网格 -->
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4
">
  <!-- 内容 -->
</div>

<!-- 响应式文字大小 -->
<h1 className="
  text-2xl 
  sm:text-3xl 
  lg:text-4xl 
  xl:text-5xl
">
  标题
</h1>`}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </div>
              
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>最佳实践</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                    <li>使用移动优先的方法，基础样式不加前缀</li>
                    <li>合理使用断点，避免过度复杂的响应式规则</li>
                    <li>测试所有断点的显示效果</li>
                    <li>考虑中间尺寸的设备显示</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const SecurityBestPractices = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          前端安全实践
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>XSS 防护</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48 rounded-md border bg-background p-4">
                <pre className="text-sm">
                  <code>{`// ✅ 安全：React 自动转义
const UserProfile = ({ user }) => {
  return (
    <div>
      <h1>{user.name}</h1> {/* 自动转义 */}
      <p>{user.bio}</p>
    </div>
  );
};

// ❌ 危险：直接插入 HTML
const DangerousComponent = ({ htmlContent }) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

// ✅ 安全：使用 DOMPurify 清理
import DOMPurify from 'dompurify';

const SafeHTMLComponent = ({ htmlContent }) => {
  const cleanHTML = DOMPurify.sanitize(htmlContent);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};`}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSRF 防护</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48 rounded-md border bg-background p-4">
                <pre className="text-sm">
                  <code>{`// 使用 CSRF Token
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'X-CSRF-Token': getCSRFToken(),
  },
});

// 表单提交时包含 CSRF Token
const ContactForm = () => {
  const [csrfToken] = useState(() => getCSRFToken());

  const handleSubmit = async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="_token" value={csrfToken} />
      {/* 表单字段 */}
    </form>
  );
};`}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">数据验证</h3>
        
        <Card>
          <CardHeader>
            <CardTitle>输入验证和清理</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 rounded-md border bg-background p-4">
              <pre className="text-sm">
                <code>{`import { z } from 'zod';

// 定义验证模式
const userSchema = z.object({
  name: z.string()
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符')
    .regex(/^[a-zA-Z\u4e00-\u9fa5\s]+$/, '姓名只能包含字母、汉字和空格'),
  
  email: z.string()
    .email('请输入有效的邮箱地址')
    .toLowerCase(),
  
  age: z.number()
    .int('年龄必须是整数')
    .min(0, '年龄不能为负数')
    .max(150, '年龄不能超过150岁'),
  
  website: z.string()
    .url('请输入有效的网址')
    .optional(),
});

// 在组件中使用
const UserForm = () => {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 0,
    },
  });

  const onSubmit = async (data) => {
    try {
      // 数据已经通过验证
      const validatedData = userSchema.parse(data);
      await submitUser(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // 处理验证错误
        error.errors.forEach(err => {
          form.setError(err.path[0], { message: err.message });
        });
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* 表单字段 */}
    </form>
  );
};`}</code>
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">环境变量安全</h3>
        
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>环境变量最佳实践</AlertTitle>
          <AlertDescription className="space-y-2">
            <div className="space-y-2 mt-2">
              <p>正确管理敏感信息：</p>
              <ScrollArea className="h-32 rounded-md border bg-background p-2">
                <pre className="text-xs">
                  <code>{`// ✅ 服务端环境变量（安全）
DATABASE_URL=postgresql://...
API_SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_test_...

// ✅ 客户端环境变量（公开，使用 NEXT_PUBLIC_ 前缀）
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=GA_MEASUREMENT_ID

// ❌ 错误：敏感信息不应该暴露给客户端
NEXT_PUBLIC_DATABASE_PASSWORD=secret123
NEXT_PUBLIC_API_SECRET=your-secret`}</code>
                </pre>
              </ScrollArea>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case 'components':
        return <ComponentBestPractices />;
      case 'accessibility':
        return <AccessibilityBestPractices />;
      case 'performance':
        return <PerformanceBestPractices />;
      case 'responsive':
        return <ResponsiveBestPractices />;
      case 'security':
        return <SecurityBestPractices />;
      default:
        return <ComponentBestPractices />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            最佳实践指南
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          学习现代 React 开发的最佳实践，包括组件设计、可访问性、性能优化、响应式设计和安全实践。
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* 侧边栏导航 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>实践分类</CardTitle>
            <CardDescription>
              选择要学习的最佳实践类型
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(categories).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(key)}
              >
                {category.icon}
                <span className="ml-2">{category.title}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* 主要内容区域 */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {categories[selectedCategory as keyof typeof categories].icon}
                {categories[selectedCategory as keyof typeof categories].title}
              </CardTitle>
              <CardDescription>
                {categories[selectedCategory as keyof typeof categories].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 底部资源链接 */}
      <div className="space-y-6">
        <Separator />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">相关资源</h2>
          <p className="text-muted-foreground">
            深入学习的推荐资源和文档
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">React 官方文档</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                React 18 的最新特性和最佳实践
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                访问文档
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">WCAG 指南</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Web 内容可访问性指南 2.1
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                查看指南
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tailwind CSS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                实用优先的 CSS 框架文档
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                学习更多
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BestPracticesPage;