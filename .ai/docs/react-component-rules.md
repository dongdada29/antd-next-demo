# React 组件开发规则

## 组件结构

### 仅使用函数组件
```tsx
// ✅ 正确 - 带有 TypeScript 的函数组件
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  return <div>{title}</div>;
};

export default Component;
```

### TypeScript 要求
- 所有组件必须有明确的 props 接口
- 对函数组件使用 `React.FC`
- 可选 props 使用 `?` 修饰符
- 为事件处理器使用适当的 TypeScript 类型

### 组件组织
```tsx
// ✅ 正确的组织方式
import React from 'react';
import { Button } from '@/components/ui/button';

interface ComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  className 
}) => {
  // 状态和副作用
  const [loading, setLoading] = React.useState(false);

  // 事件处理器
  const handleClick = () => {
    onAction?.();
  };

  return (
    <div className={className}>
      <Button 
        type="primary" 
        loading={loading}
        onClick={handleClick}
      >
        {title}
      </Button>
    </div>
  );
};

export default Component;
```

## shadcn/ui 集成规则

### 导入模式
```tsx
// ✅ 正确 - 从组件路径导入
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

// ❌ 避免 - 从错误路径导入
import { Button } from 'shadcn/ui';
```

### 组件使用
```tsx
// ✅ 正确 - 正确使用 shadcn/ui 组件
const FormComponent = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="请输入用户名" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
```

## 状态管理

### 本地状态
- 对简单的本地状态使用 `useState`
- 对复杂的状态逻辑使用 `useReducer`
- 除非必要，避免使用全局状态

### 表单状态
```tsx
// ✅ 正确 - 使用 React Hook Form + shadcn/ui
const UserForm = () => {
  const form = useForm();
  
  const onFinish = (values: FormValues) => {
    console.log('表单值:', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFinish)}>
        {/* 表单字段 */}
      </form>
    </Form>
  );
};
```

## 性能规则

### 记忆化
```tsx
// ✅ 正确 - 对昂贵的组件使用 React.memo
const ExpensiveComponent = React.memo(({ data }) => {
  // 昂贵的渲染逻辑
  return <div>{/* 复杂的渲染 */}</div>;
});

// ✅ 正确 - 对事件处理器使用 useCallback
const Component = ({ onItemClick }) => {
  const handleClick = React.useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return <Button onClick={handleClick}>点击</Button>;
};
```

### 避免不必要的重渲染
```tsx
// ✅ 正确 - 使用 useMemo 缓存计算结果
const Component = ({ items }) => {
  const expensiveValue = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  return <div>总计: {expensiveValue}</div>;
};
```

## 可访问性规则

### 语义化 HTML
- 为内容使用适当的 HTML 元素
- 包含适当的 ARIA 标签
- 确保键盘导航
- 为图片提供 alt 文本

### 焦点管理
```tsx
// ✅ 正确 - 正确处理焦点
const ModalComponent = ({ isOpen, onClose }) => {
  const modalRef = React.useRef();

  React.useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div 
      ref={modalRef}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
    >
      {/* 模态框内容 */}
    </div>
  );
};
```

## 错误处理

### 组件边界
```tsx
// ✅ 正确 - 使用错误边界
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('组件错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>出现了错误</div>;
    }

    return this.props.children;
  }
}
```

### 异步操作
```tsx
// ✅ 正确 - 处理加载和错误状态
const DataComponent = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.getData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;

  return <div>{/* 渲染数据 */}</div>;
};
```

## 组件生命周期

### 副作用管理
```tsx
// ✅ 正确 - 使用 useEffect 管理副作用
const Component = ({ userId }) => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        const userData = await api.getUser(userId);
        if (!cancelled) {
          setUser(userData);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('获取用户失败:', error);
        }
      }
    };

    if (userId) {
      fetchUser();
    }

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return user ? <UserProfile user={user} /> : <Spin />;
};
```

## 测试要求

### 组件测试
- 所有组件都应该有对应的测试文件
- 测试组件渲染和用户交互
- 模拟外部依赖
- 测试错误场景

### 测试结构
```tsx
// ✅ 正确 - 测试结构
describe('Component', () => {
  it('正确渲染', () => {
    render(<Component title="测试" />);
    expect(screen.getByText('测试')).toBeInTheDocument();
  });

  it('处理点击事件', () => {
    const mockClick = jest.fn();
    render(<Component onAction={mockClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockClick).toHaveBeenCalled();
  });

  it('处理加载状态', () => {
    render(<Component loading />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

## 代码风格规则

### 命名约定
```tsx
// ✅ 正确 - 组件名使用 PascalCase
const UserProfile = () => {};
const DataTable = () => {};

// ✅ 正确 - 变量名使用 camelCase
const userName = 'john';
const isLoading = false;

// ✅ 正确 - 常量使用 UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
```

### 文件组织
```
src/
  components/
    common/
      Button/
        index.tsx
        Button.test.tsx
        Button.stories.tsx
    forms/
      UserForm/
        index.tsx
        UserForm.test.tsx
    layout/
      Header/
        index.tsx
        Header.test.tsx
```

## 性能最佳实践

### 1. 避免内联对象和函数
```tsx
// ❌ 避免 - 内联对象会导致重渲染
const Component = () => {
  return <ChildComponent style={{ margin: 10 }} />;
};

// ✅ 正确 - 将对象提取到组件外部
const styles = { margin: 10 };
const Component = () => {
  return <ChildComponent style={styles} />;
};
```

### 2. 使用 key 属性
```tsx
// ✅ 正确 - 为列表项提供稳定的 key
const ItemList = ({ items }) => {
  return (
    <div>
      {items.map(item => (
        <Item key={item.id} data={item} />
      ))}
    </div>
  );
};
```

### 3. 条件渲染优化
```tsx
// ✅ 正确 - 使用短路运算符进行条件渲染
const Component = ({ showDetails, user }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      {showDetails && <UserDetails user={user} />}
    </div>
  );
};
```

通过遵循这些规则，可以确保 React 组件的高质量、可维护性和性能。