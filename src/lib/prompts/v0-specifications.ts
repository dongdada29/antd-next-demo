/**
 * V0 提示词规范和核心原则
 * 基于 V0 系统提示词的分析和提取
 */

export interface V0CorePrinciples {
  componentFirst: boolean;
  tailwindFirst: boolean;
  typescriptStrict: boolean;
  accessibilityCompliant: boolean;
  performanceOptimized: boolean;
}

export interface V0ComponentPattern {
  name: string;
  description: string;
  template: string;
  examples: string[];
  bestPractices: string[];
}

export interface V0StylePattern {
  category: 'layout' | 'typography' | 'colors' | 'spacing' | 'responsive';
  pattern: string;
  description: string;
  examples: string[];
  antiPatterns: string[];
}

/**
 * V0 核心原则配置
 */
export const V0_CORE_PRINCIPLES: V0CorePrinciples = {
  componentFirst: true,
  tailwindFirst: true,
  typescriptStrict: true,
  accessibilityCompliant: true,
  performanceOptimized: true,
};

/**
 * V0 组件生成模式
 */
export const V0_COMPONENT_PATTERNS: V0ComponentPattern[] = [
  {
    name: 'BasicComponent',
    description: '基础组件模式，包含变体和尺寸支持',
    template: `
interface {ComponentName}Props {
  variant?: 'default' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const {ComponentName} = ({ 
  variant = 'default', 
  size = 'md', 
  disabled = false,
  children,
  className,
  ...props 
}: {ComponentName}Props) => {
  return (
    <div 
      className={cn(
        // 基础样式
        "{baseStyles}",
        // 变体样式
        {
          'default': "{defaultStyles}",
          'secondary': "{secondaryStyles}",
          'destructive': "{destructiveStyles}"
        }[variant],
        // 尺寸样式
        {
          'sm': "{smallStyles}",
          'md': "{mediumStyles}",
          'lg': "{largeStyles}"
        }[size],
        // 禁用状态
        disabled && "{disabledStyles}",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );
};
    `,
    examples: [
      '<Button variant="default" size="md">点击我</Button>',
      '<Card variant="secondary" className="w-full">内容</Card>'
    ],
    bestPractices: [
      '使用 TypeScript 接口定义属性',
      '提供合理的默认值',
      '支持 className 覆盖',
      '使用 cn() 函数合并类名',
      '实现变体和尺寸系统'
    ]
  },
  {
    name: 'CompositeComponent',
    description: '复合组件模式，组合多个基础组件',
    template: `
interface {ComponentName}Props {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const {ComponentName} = ({ 
  title, 
  description, 
  children, 
  className 
}: {ComponentName}Props) => {
  return (
    <Card className={cn("w-full", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
    `,
    examples: [
      '<FormCard title="用户信息" description="请填写基本信息">表单内容</FormCard>',
      '<DataCard title="统计数据">图表内容</DataCard>'
    ],
    bestPractices: [
      '组合现有的 shadcn/ui 组件',
      '提供灵活的内容插槽',
      '支持条件渲染',
      '保持组件的单一职责',
      '提供清晰的组件层次结构'
    ]
  },
  {
    name: 'FormComponent',
    description: '表单组件模式，包含验证和状态管理',
    template: `
interface {ComponentName}Props {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  disabled?: boolean;
  className?: string;
}

const {ComponentName} = ({ 
  onSubmit, 
  defaultValues, 
  disabled = false,
  className 
}: {ComponentName}Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={cn("space-y-6", className)}
      >
        <FormField
          control={form.control}
          name="fieldName"
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
        <Button type="submit" disabled={disabled}>
          提交
        </Button>
      </form>
    </Form>
  );
};
    `,
    examples: [
      '<UserForm onSubmit={handleSubmit} defaultValues={user} />',
      '<LoginForm onSubmit={handleLogin} disabled={isLoading} />'
    ],
    bestPractices: [
      '使用 react-hook-form 进行表单管理',
      '使用 zod 进行数据验证',
      '提供清晰的错误提示',
      '支持默认值和禁用状态',
      '实现无障碍表单标签'
    ]
  }
];

/**
 * V0 样式应用模式
 */
export const V0_STYLE_PATTERNS: V0StylePattern[] = [
  {
    category: 'layout',
    pattern: 'Flexbox Layout',
    description: '使用 Flexbox 进行灵活布局',
    examples: [
      'flex items-center justify-between',
      'flex flex-col space-y-4',
      'flex flex-wrap gap-4'
    ],
    antiPatterns: [
      '避免使用 float 布局',
      '避免绝对定位进行布局',
      '避免使用 table 布局'
    ]
  },
  {
    category: 'layout',
    pattern: 'Grid Layout',
    description: '使用 CSS Grid 进行网格布局',
    examples: [
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      'grid grid-cols-12 gap-4',
      'grid place-items-center min-h-screen'
    ],
    antiPatterns: [
      '避免复杂的嵌套网格',
      '避免固定的网格尺寸',
      '避免不必要的网格容器'
    ]
  },
  {
    category: 'responsive',
    pattern: 'Mobile First',
    description: '移动优先的响应式设计',
    examples: [
      'text-sm md:text-base lg:text-lg',
      'p-4 md:p-6 lg:p-8',
      'hidden md:block'
    ],
    antiPatterns: [
      '避免桌面优先的设计',
      '避免固定的像素值',
      '避免过多的断点'
    ]
  },
  {
    category: 'colors',
    pattern: 'Semantic Colors',
    description: '使用语义化的颜色系统',
    examples: [
      'bg-primary text-primary-foreground',
      'text-destructive border-destructive',
      'bg-muted text-muted-foreground'
    ],
    antiPatterns: [
      '避免硬编码的颜色值',
      '避免使用非语义化的颜色',
      '避免低对比度的颜色组合'
    ]
  },
  {
    category: 'spacing',
    pattern: 'Consistent Spacing',
    description: '使用一致的间距系统',
    examples: [
      'space-y-4',
      'gap-6',
      'p-4 m-2'
    ],
    antiPatterns: [
      '避免任意的间距值',
      '避免负边距的过度使用',
      '避免不一致的间距模式'
    ]
  },
  {
    category: 'typography',
    pattern: 'Typography Scale',
    description: '使用标准的字体大小和行高',
    examples: [
      'text-sm leading-5',
      'text-lg font-semibold',
      'text-2xl font-bold tracking-tight'
    ],
    antiPatterns: [
      '避免任意的字体大小',
      '避免过小或过大的字体',
      '避免不合适的行高'
    ]
  }
];

/**
 * V0 可访问性规范
 */
export const V0_ACCESSIBILITY_PATTERNS = {
  semanticHTML: [
    '使用语义化的 HTML 标签',
    '提供适当的标题层次结构',
    '使用 landmark 元素进行页面结构'
  ],
  ariaLabels: [
    '为交互元素提供 aria-label',
    '使用 aria-describedby 关联描述',
    '实现 aria-expanded 状态'
  ],
  keyboardNavigation: [
    '支持 Tab 键导航',
    '实现焦点管理',
    '提供键盘快捷键'
  ],
  colorContrast: [
    '确保文本对比度 >= 4.5:1',
    '大文本对比度 >= 3:1',
    '非文本元素对比度 >= 3:1'
  ]
};

/**
 * V0 性能优化规范
 */
export const V0_PERFORMANCE_PATTERNS = {
  reactOptimization: [
    '使用 React.memo 防止不必要的重渲染',
    '使用 useMemo 缓存计算结果',
    '使用 useCallback 缓存函数引用',
    '实现组件懒加载'
  ],
  bundleOptimization: [
    '使用动态导入进行代码分割',
    '优化第三方库的导入',
    '移除未使用的代码',
    '压缩和优化资源'
  ],
  runtimeOptimization: [
    '避免在渲染中进行昂贵的计算',
    '使用虚拟化处理大列表',
    '实现图片懒加载',
    '优化网络请求'
  ]
};

/**
 * 获取适用于项目的 V0 规范
 */
export function getProjectV0Specifications() {
  return {
    principles: V0_CORE_PRINCIPLES,
    componentPatterns: V0_COMPONENT_PATTERNS,
    stylePatterns: V0_STYLE_PATTERNS,
    accessibilityPatterns: V0_ACCESSIBILITY_PATTERNS,
    performancePatterns: V0_PERFORMANCE_PATTERNS,
  };
}

/**
 * 验证组件是否符合 V0 规范
 */
export function validateV0Compliance(componentCode: string): {
  compliant: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // 检查 TypeScript 接口
  if (!componentCode.includes('interface') && !componentCode.includes('type')) {
    issues.push('缺少 TypeScript 类型定义');
    suggestions.push('添加组件属性接口定义');
  }

  // 检查 Tailwind CSS 使用
  if (componentCode.includes('style=') || componentCode.includes('styled-components')) {
    issues.push('使用了内联样式或 CSS-in-JS');
    suggestions.push('改用 Tailwind CSS 类名');
  }

  // 检查可访问性
  if (!componentCode.includes('aria-') && componentCode.includes('button')) {
    suggestions.push('考虑添加 ARIA 标签提升可访问性');
  }

  // 检查组件组合
  if (!componentCode.includes('shadcn') && !componentCode.includes('ui/')) {
    suggestions.push('考虑使用 shadcn/ui 组件作为基础');
  }

  return {
    compliant: issues.length === 0,
    issues,
    suggestions,
  };
}