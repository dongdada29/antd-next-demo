/**
 * 性能优化提示词
 * 为 AI 代码生成提供性能优化指导
 */

// 性能优化提示词配置
export interface PerformancePromptConfig {
  category: 'component' | 'hook' | 'utility' | 'page';
  optimizationLevel: 'basic' | 'advanced' | 'expert';
  targetMetrics: string[];
  constraints: string[];
}

/**
 * 基础性能优化提示词
 */
export const PERFORMANCE_BASE_PROMPT = `
你是一个专注于性能优化的 React/Next.js 开发专家。在生成代码时，请始终考虑以下性能优化原则：

## 核心性能原则
1. **最小化重新渲染** - 使用 React.memo、useMemo、useCallback 优化
2. **代码分割** - 使用动态导入和懒加载
3. **内存管理** - 避免内存泄漏，及时清理资源
4. **Bundle 优化** - 减少包大小，Tree Shaking
5. **网络优化** - 减少请求数量，使用缓存策略

## 必须遵循的性能规范
- 组件渲染时间 < 16ms (60fps)
- 初始 Bundle 大小 < 250KB (gzipped)
- 首次内容绘制 (FCP) < 1.8s
- 最大内容绘制 (LCP) < 2.5s
- 累积布局偏移 (CLS) < 0.1
`;

/**
 * 组件性能优化提示词
 */
export const COMPONENT_PERFORMANCE_PROMPTS = {
  basic: `
${PERFORMANCE_BASE_PROMPT}

## 组件性能优化 (基础级别)

生成组件时请确保：

1. **使用 React.memo 包装纯组件**
\`\`\`typescript
const MyComponent = React.memo<Props>(({ prop1, prop2 }) => {
  // 组件逻辑
});
\`\`\`

2. **使用 useMemo 缓存计算结果**
\`\`\`typescript
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
\`\`\`

3. **使用 useCallback 缓存函数**
\`\`\`typescript
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
\`\`\`

4. **避免在渲染中创建对象**
\`\`\`typescript
// ❌ 错误 - 每次渲染都创建新对象
<Component style={{ margin: 10 }} />

// ✅ 正确 - 提取到组件外部
const componentStyle = { margin: 10 };
<Component style={componentStyle} />
\`\`\`

5. **使用合适的 key 属性**
\`\`\`typescript
{items.map(item => (
  <Item key={item.id} data={item} />
))}
\`\`\`
`,

  advanced: `
${PERFORMANCE_BASE_PROMPT}

## 组件性能优化 (高级级别)

生成组件时请实现：

1. **虚拟化长列表**
\`\`\`typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {Row}
  </List>
);
\`\`\`

2. **实现懒加载和预加载**
\`\`\`typescript
const LazyComponent = lazy(() => import('./HeavyComponent'));

const ComponentWithPreload = () => {
  useEffect(() => {
    // 预加载下一个可能需要的组件
    import('./NextComponent');
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
};
\`\`\`

3. **使用 Intersection Observer 优化可见性检测**
\`\`\`typescript
const useIntersectionObserver = (ref, options) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
};
\`\`\`

4. **实现智能批处理**
\`\`\`typescript
const useBatchedUpdates = <T>(items: T[], batchSize = 10) => {
  const [processedItems, setProcessedItems] = useState<T[]>([]);

  useEffect(() => {
    let index = 0;
    const processBatch = () => {
      const batch = items.slice(index, index + batchSize);
      if (batch.length > 0) {
        setProcessedItems(prev => [...prev, ...batch]);
        index += batchSize;
        requestIdleCallback(processBatch);
      }
    };
    processBatch();
  }, [items, batchSize]);

  return processedItems;
};
\`\`\`

5. **优化状态更新**
\`\`\`typescript
// 使用 useReducer 替代多个 useState
const [state, dispatch] = useReducer(reducer, initialState);

// 使用 unstable_batchedUpdates 批量更新
import { unstable_batchedUpdates } from 'react-dom';

const handleMultipleUpdates = () => {
  unstable_batchedUpdates(() => {
    setCount(c => c + 1);
    setName('new name');
    setVisible(true);
  });
};
\`\`\`
`,

  expert: `
${PERFORMANCE_BASE_PROMPT}

## 组件性能优化 (专家级别)

生成组件时请实现高级优化：

1. **自定义 Fiber 调度**
\`\`\`typescript
import { unstable_scheduleCallback, unstable_NormalPriority } from 'scheduler';

const useScheduledUpdate = () => {
  const scheduleUpdate = useCallback((updateFn) => {
    unstable_scheduleCallback(unstable_NormalPriority, () => {
      updateFn();
    });
  }, []);

  return scheduleUpdate;
};
\`\`\`

2. **实现对象池模式**
\`\`\`typescript
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(createFn: () => T, resetFn: (obj: T) => void) {
    this.createFn = createFn;
    this.resetFn = resetFn;
  }

  acquire(): T {
    return this.pool.pop() || this.createFn();
  }

  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}
\`\`\`

3. **使用 Web Workers 处理重计算**
\`\`\`typescript
const useWebWorker = (workerScript: string) => {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const w = new Worker(workerScript);
    setWorker(w);
    return () => w.terminate();
  }, [workerScript]);

  const postMessage = useCallback((data: any) => {
    return new Promise((resolve) => {
      if (worker) {
        worker.postMessage(data);
        worker.onmessage = (e) => resolve(e.data);
      }
    });
  }, [worker]);

  return postMessage;
};
\`\`\`

4. **实现时间切片**
\`\`\`typescript
const useTimeSlicing = <T>(
  items: T[],
  processItem: (item: T) => void,
  timeSlice = 5
) => {
  const [processedCount, setProcessedCount] = useState(0);

  useEffect(() => {
    let index = 0;
    
    const processSlice = () => {
      const start = performance.now();
      
      while (index < items.length && performance.now() - start < timeSlice) {
        processItem(items[index]);
        index++;
      }
      
      setProcessedCount(index);
      
      if (index < items.length) {
        requestIdleCallback(processSlice);
      }
    };
    
    processSlice();
  }, [items, processItem, timeSlice]);

  return processedCount;
};
\`\`\`

5. **内存泄漏检测和预防**
\`\`\`typescript
const useMemoryLeakDetection = (componentName: string) => {
  const mountTime = useRef(Date.now());
  const cleanupFunctions = useRef<(() => void)[]>([]);

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);

  useEffect(() => {
    return () => {
      // 执行所有清理函数
      cleanupFunctions.current.forEach(cleanup => cleanup());
      
      // 检测组件生命周期
      const lifetime = Date.now() - mountTime.current;
      if (lifetime > 60000) { // 超过1分钟
        console.warn(\`Component \${componentName} had long lifetime: \${lifetime}ms\`);
      }
    };
  }, [componentName]);

  return addCleanup;
};
\`\`\`
`
};

/**
 * Hook 性能优化提示词
 */
export const HOOK_PERFORMANCE_PROMPTS = {
  basic: `
${PERFORMANCE_BASE_PROMPT}

## Hook 性能优化 (基础级别)

生成 Hook 时请确保：

1. **正确使用依赖数组**
\`\`\`typescript
// ✅ 正确 - 包含所有依赖
useEffect(() => {
  fetchData(userId, filter);
}, [userId, filter]);

// ❌ 错误 - 缺少依赖
useEffect(() => {
  fetchData(userId, filter);
}, [userId]); // 缺少 filter
\`\`\`

2. **避免不必要的重新计算**
\`\`\`typescript
const useExpensiveCalculation = (data: any[]) => {
  return useMemo(() => {
    return data.reduce((acc, item) => {
      // 复杂计算
      return acc + heavyCalculation(item);
    }, 0);
  }, [data]);
};
\`\`\`

3. **优化事件处理器**
\`\`\`typescript
const useOptimizedEventHandler = (callback: (id: string) => void) => {
  return useCallback((event: React.MouseEvent) => {
    const id = event.currentTarget.getAttribute('data-id');
    if (id) callback(id);
  }, [callback]);
};
\`\`\`
`,

  advanced: `
${PERFORMANCE_BASE_PROMPT}

## Hook 性能优化 (高级级别)

生成 Hook 时请实现：

1. **防抖和节流**
\`\`\`typescript
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
};
\`\`\`

2. **缓存和记忆化**
\`\`\`typescript
const useCache = <K, V>(maxSize = 100) => {
  const cache = useRef(new Map<K, V>());

  const get = useCallback((key: K): V | undefined => {
    return cache.current.get(key);
  }, []);

  const set = useCallback((key: K, value: V): void => {
    if (cache.current.size >= maxSize) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }
    cache.current.set(key, value);
  }, [maxSize]);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  return { get, set, clear };
};
\`\`\`

3. **异步状态管理**
\`\`\`typescript
const useAsyncState = <T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList
) => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    asyncFn()
      .then(data => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({ data: null, loading: false, error });
        }
      });

    return () => { cancelled = true; };
  }, deps);

  return state;
};
\`\`\`
`
};

/**
 * 工具函数性能优化提示词
 */
export const UTILITY_PERFORMANCE_PROMPTS = {
  basic: `
${PERFORMANCE_BASE_PROMPT}

## 工具函数性能优化

生成工具函数时请确保：

1. **使用高效的算法**
\`\`\`typescript
// ✅ 使用 Map 进行 O(1) 查找
const createLookup = <T>(items: T[], keyFn: (item: T) => string) => {
  return new Map(items.map(item => [keyFn(item), item]));
};

// ❌ 使用 find 进行 O(n) 查找
const findItem = (items: T[], key: string) => {
  return items.find(item => item.id === key);
};
\`\`\`

2. **避免不必要的数组操作**
\`\`\`typescript
// ✅ 单次遍历
const processItems = <T>(items: T[]) => {
  const result = { filtered: [], mapped: [] };
  
  for (const item of items) {
    if (shouldInclude(item)) {
      result.filtered.push(item);
      result.mapped.push(transform(item));
    }
  }
  
  return result;
};

// ❌ 多次遍历
const processItemsInefficient = <T>(items: T[]) => {
  const filtered = items.filter(shouldInclude);
  const mapped = filtered.map(transform);
  return { filtered, mapped };
};
\`\`\`

3. **使用适当的数据结构**
\`\`\`typescript
// 使用 Set 进行去重
const uniqueItems = <T>(items: T[]): T[] => {
  return Array.from(new Set(items));
};

// 使用 WeakMap 进行缓存
const cache = new WeakMap();
const memoize = <T extends object, R>(fn: (obj: T) => R) => {
  return (obj: T): R => {
    if (cache.has(obj)) {
      return cache.get(obj);
    }
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
};
\`\`\`
`,

  advanced: `
${PERFORMANCE_BASE_PROMPT}

## 高级工具函数性能优化

生成工具函数时请实现：

1. **位运算优化**
\`\`\`typescript
// 快速判断奇偶
const isEven = (n: number): boolean => (n & 1) === 0;

// 快速乘以2的幂
const multiplyByPowerOf2 = (n: number, power: number): number => n << power;

// 快速除以2的幂
const divideByPowerOf2 = (n: number, power: number): number => n >> power;
\`\`\`

2. **字符串优化**
\`\`\`typescript
// 使用数组拼接大量字符串
const buildLargeString = (parts: string[]): string => {
  const buffer: string[] = [];
  for (const part of parts) {
    buffer.push(part);
  }
  return buffer.join('');
};

// 使用正则表达式缓存
const regexCache = new Map<string, RegExp>();
const getCachedRegex = (pattern: string, flags?: string): RegExp => {
  const key = \`\${pattern}|\${flags || ''}\`;
  if (!regexCache.has(key)) {
    regexCache.set(key, new RegExp(pattern, flags));
  }
  return regexCache.get(key)!;
};
\`\`\`

3. **异步操作优化**
\`\`\`typescript
// 并发控制
const concurrentMap = async <T, R>(
  items: T[],
  asyncFn: (item: T) => Promise<R>,
  concurrency = 3
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(asyncFn));
    results.push(...batchResults);
  }
  
  return results;
};

// 超时控制
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ]);
};
\`\`\`
`
};

/**
 * 页面性能优化提示词
 */
export const PAGE_PERFORMANCE_PROMPTS = {
  basic: `
${PERFORMANCE_BASE_PROMPT}

## 页面性能优化

生成页面组件时请确保：

1. **实现代码分割**
\`\`\`typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

const Page = () => {
  return (
    <div>
      <h1>Page Title</h1>
      <HeavyComponent />
    </div>
  );
};
\`\`\`

2. **优化图片加载**
\`\`\`typescript
import Image from 'next/image';

const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    loading="lazy"
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    {...props}
  />
);
\`\`\`

3. **实现预加载策略**
\`\`\`typescript
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // 预加载可能访问的页面
    router.prefetch('/next-page');
  }, [router]);

  return <div>Page content</div>;
};
\`\`\`
`,

  advanced: `
${PERFORMANCE_BASE_PROMPT}

## 高级页面性能优化

生成页面组件时请实现：

1. **服务端渲染优化**
\`\`\`typescript
export async function getServerSideProps(context) {
  // 并行获取数据
  const [userData, postsData] = await Promise.all([
    fetchUser(context.params.id),
    fetchPosts(context.params.id)
  ]);

  return {
    props: {
      user: userData,
      posts: postsData
    }
  };
}
\`\`\`

2. **增量静态再生成**
\`\`\`typescript
export async function getStaticProps() {
  const data = await fetchData();

  return {
    props: { data },
    revalidate: 60 // 60秒后重新生成
  };
}
\`\`\`

3. **流式渲染**
\`\`\`typescript
import { Suspense } from 'react';

const StreamingPage = () => {
  return (
    <div>
      <h1>Page Title</h1>
      <Suspense fallback={<div>Loading user...</div>}>
        <UserProfile />
      </Suspense>
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostsList />
      </Suspense>
    </div>
  );
};
\`\`\`
`
};

/**
 * 性能检查提示词
 */
export const PERFORMANCE_CHECK_PROMPTS = `
在生成代码后，请自动检查以下性能要点：

## 检查清单
- [ ] 是否使用了 React.memo、useMemo、useCallback
- [ ] 是否避免了在渲染中创建对象/函数
- [ ] 是否正确设置了依赖数组
- [ ] 是否实现了适当的懒加载
- [ ] 是否避免了不必要的重新渲染
- [ ] 是否使用了高效的数据结构和算法
- [ ] 是否实现了错误边界
- [ ] 是否添加了适当的 loading 状态
- [ ] 是否考虑了可访问性
- [ ] 是否添加了 TypeScript 类型定义

## 性能指标目标
- 组件渲染时间 < 16ms
- 内存使用增长 < 10MB/小时
- Bundle 大小增加 < 50KB
- 首次加载时间 < 3s
`;

/**
 * 获取性能优化提示词
 */
export function getPerformancePrompt(config: PerformancePromptConfig): string {
  const { category, optimizationLevel } = config;
  
  let prompt = PERFORMANCE_BASE_PROMPT;
  
  switch (category) {
    case 'component':
      prompt += '\n\n' + COMPONENT_PERFORMANCE_PROMPTS[optimizationLevel];
      break;
    case 'hook':
      prompt += '\n\n' + HOOK_PERFORMANCE_PROMPTS[optimizationLevel];
      break;
    case 'utility':
      prompt += '\n\n' + UTILITY_PERFORMANCE_PROMPTS[optimizationLevel];
      break;
    case 'page':
      prompt += '\n\n' + PAGE_PERFORMANCE_PROMPTS[optimizationLevel];
      break;
  }
  
  prompt += '\n\n' + PERFORMANCE_CHECK_PROMPTS;
  
  return prompt;
}

/**
 * 性能优化建议生成器
 */
export class PerformancePromptGenerator {
  /**
   * 根据代码分析生成优化建议
   */
  static generateOptimizationSuggestions(code: string): string[] {
    const suggestions: string[] = [];
    
    // 检查是否缺少 React.memo
    if (code.includes('const ') && code.includes('= (') && !code.includes('React.memo')) {
      suggestions.push('考虑使用 React.memo 包装组件以避免不必要的重新渲染');
    }
    
    // 检查是否在渲染中创建对象
    if (code.includes('style={{') || code.includes('className={`')) {
      suggestions.push('避免在渲染中创建对象，将样式对象提取到组件外部');
    }
    
    // 检查是否缺少 useCallback
    if (code.includes('onClick=') && !code.includes('useCallback')) {
      suggestions.push('使用 useCallback 缓存事件处理函数');
    }
    
    // 检查是否缺少 useMemo
    if (code.includes('.map(') || code.includes('.filter(') || code.includes('.reduce(')) {
      if (!code.includes('useMemo')) {
        suggestions.push('使用 useMemo 缓存计算结果');
      }
    }
    
    // 检查是否缺少 key 属性
    if (code.includes('.map(') && !code.includes('key=')) {
      suggestions.push('为列表项添加唯一的 key 属性');
    }
    
    return suggestions;
  }
  
  /**
   * 生成性能优化的代码模板
   */
  static generateOptimizedTemplate(componentType: string): string {
    switch (componentType) {
      case 'list':
        return `
import React, { memo, useMemo, useCallback } from 'react';

interface Item {
  id: string;
  // 其他属性
}

interface Props {
  items: Item[];
  onItemClick: (id: string) => void;
}

const OptimizedList = memo<Props>(({ items, onItemClick }) => {
  const handleItemClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  const renderedItems = useMemo(() => {
    return items.map(item => (
      <ListItem
        key={item.id}
        item={item}
        onClick={handleItemClick}
      />
    ));
  }, [items, handleItemClick]);

  return <div className="list">{renderedItems}</div>;
});

OptimizedList.displayName = 'OptimizedList';
`;
      
      case 'form':
        return `
import React, { memo, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  // 表单字段类型
}

interface Props {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

const OptimizedForm = memo<Props>(({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: initialData
  });

  const handleFormSubmit = useCallback((data: FormData) => {
    onSubmit(data);
  }, [onSubmit]);

  const formFields = useMemo(() => {
    // 渲染表单字段
    return (
      <>
        <input {...register('field1')} />
        <input {...register('field2')} />
      </>
    );
  }, [register]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {formFields}
      <button type="submit" disabled={formState.isSubmitting}>
        Submit
      </button>
    </form>
  );
});

OptimizedForm.displayName = 'OptimizedForm';
`;
      
      default:
        return `
import React, { memo } from 'react';

interface Props {
  // 组件属性
}

const OptimizedComponent = memo<Props>((props) => {
  // 组件逻辑
  return <div>Component content</div>;
});

OptimizedComponent.displayName = 'OptimizedComponent';
`;
    }
  }
}