# 测试指南

本项目使用 Vitest + React Testing Library 进行组件和功能测试。

## 测试框架

- **Vitest**: 快速的单元测试框架
- **React Testing Library**: React 组件测试工具
- **@testing-library/user-event**: 用户交互模拟
- **@testing-library/jest-dom**: 额外的断言匹配器

## 目录结构

```
src/test/
├── setup.ts                    # 测试环境设置
├── utils.tsx                   # 测试工具函数
├── README.md                   # 测试指南（本文件）
└── templates/                  # 测试模板
    ├── form-component.test.template.tsx
    ├── list-component.test.template.tsx
    ├── page-component.test.template.tsx
    └── hook.test.template.tsx
```

## 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm run test -- BasicForm.test.tsx

# 运行匹配模式的测试
npm run test -- --grep "表单验证"
```

## 测试模板使用

### 1. 表单组件测试

使用 `form-component.test.template.tsx` 模板：

```typescript
// 复制模板文件
cp src/test/templates/form-component.test.template.tsx src/components/forms/__tests__/BasicForm.test.tsx

// 修改导入和组件名称
import { BasicForm } from '../BasicForm';

describe('BasicForm', () => {
  // 根据实际组件调整测试用例
});
```

### 2. 列表组件测试

使用 `list-component.test.template.tsx` 模板：

```typescript
// 复制模板文件
cp src/test/templates/list-component.test.template.tsx src/components/lists/__tests__/BasicTable.test.tsx

// 修改导入和组件名称
import { BasicTable } from '../BasicTable';
```

### 3. 页面组件测试

使用 `page-component.test.template.tsx` 模板：

```typescript
// 复制模板文件
cp src/test/templates/page-component.test.template.tsx src/app/users/__tests__/page.test.tsx

// 修改导入和组件名称
import UserPage from '../page';
```

### 4. Hook 测试

使用 `hook.test.template.tsx` 模板：

```typescript
// 复制模板文件
cp src/test/templates/hook.test.template.tsx src/hooks/__tests__/useApi.test.tsx

// 修改导入和Hook名称
import { useApi } from '../useApi';
```

## 测试工具函数

### renderWithProviders

为组件提供必要的 Provider 包装：

```typescript
import { renderWithProviders } from '@/test/utils';

test('应该正确渲染组件', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### 数据生成器

使用 `testDataGenerators` 生成测试数据：

```typescript
import { testDataGenerators } from '@/test/utils';

const mockUser = testDataGenerators.user();
const mockUsers = testDataGenerators.userList(5);
const mockFormData = testDataGenerators.formData();
```

### API 模拟

```typescript
import { mockApiResponse, mockApiError } from '@/test/utils';

// 模拟成功响应
vi.mocked(fetch).mockResolvedValueOnce({
  ok: true,
  json: () => mockApiResponse(mockData),
} as Response);

// 模拟错误响应
vi.mocked(fetch).mockRejectedValueOnce(mockApiError('API Error', 500));
```

### 事件处理器模拟

```typescript
import { createMockHandler } from '@/test/utils';

const mockHandlers = {
  onSubmit: createMockHandler<(values: any) => void>(),
  onClick: createMockHandler<() => void>(),
};

// 使用
<MyComponent onSubmit={mockHandlers.onSubmit.handler} />

// 断言
expect(mockHandlers.onSubmit.mock).toHaveBeenCalledWith(expectedData);
```

## 测试最佳实践

### 1. 测试结构

```typescript
describe('ComponentName', () => {
  describe('渲染测试', () => {
    it('应该正确渲染基本元素', () => {
      // 测试基本渲染
    });
  });

  describe('交互测试', () => {
    it('应该响应用户交互', async () => {
      // 测试用户交互
    });
  });

  describe('错误处理测试', () => {
    it('应该正确处理错误状态', () => {
      // 测试错误处理
    });
  });
});
```

### 2. 用户交互模拟

```typescript
import userEvent from '@testing-library/user-event';

test('用户交互测试', async () => {
  const user = userEvent.setup();
  
  renderWithProviders(<MyForm />);
  
  // 输入文本
  await user.type(screen.getByLabelText('用户名'), 'test user');
  
  // 点击按钮
  await user.click(screen.getByRole('button', { name: '提交' }));
  
  // 选择选项
  await user.selectOptions(screen.getByLabelText('状态'), 'active');
});
```

### 3. 异步操作测试

```typescript
import { waitFor } from '@testing-library/react';

test('异步操作测试', async () => {
  renderWithProviders(<AsyncComponent />);
  
  // 等待异步操作完成
  await waitFor(() => {
    expect(screen.getByText('加载完成')).toBeInTheDocument();
  });
  
  // 或者等待元素消失
  await waitFor(() => {
    expect(screen.queryByText('加载中')).not.toBeInTheDocument();
  });
});
```

### 4. 错误边界测试

```typescript
test('错误边界测试', () => {
  const ErrorComponent = () => {
    throw new Error('Test Error');
  };
  
  renderWithProviders(<ErrorComponent />);
  
  expect(screen.getByText('页面出错了')).toBeInTheDocument();
});
```

### 5. 可访问性测试

```typescript
test('可访问性测试', () => {
  renderWithProviders(<MyComponent />);
  
  // 检查ARIA标签
  expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  
  // 检查键盘导航
  const button = screen.getByRole('button');
  button.focus();
  expect(button).toHaveFocus();
});
```

## 测试覆盖率

项目配置了测试覆盖率报告，目标覆盖率：

- **语句覆盖率**: >= 80%
- **分支覆盖率**: >= 75%
- **函数覆盖率**: >= 80%
- **行覆盖率**: >= 80%

查看覆盖率报告：

```bash
npm run test:coverage
open coverage/index.html
```

## 常见问题

### 1. Ant Design 组件测试

```typescript
// 模拟 message 和 notification
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});
```

### 2. Next.js 路由测试

```typescript
// 模拟 Next.js 路由
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test',
}));
```

### 3. 环境变量测试

```typescript
// 设置测试环境变量
beforeEach(() => {
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
});
```

### 4. 时间相关测试

```typescript
// 模拟时间
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2023-01-01'));
});

afterEach(() => {
  vi.useRealTimers();
});
```

## 调试测试

### 1. 调试渲染结果

```typescript
import { screen } from '@testing-library/react';

test('调试测试', () => {
  renderWithProviders(<MyComponent />);
  
  // 打印DOM结构
  screen.debug();
  
  // 打印特定元素
  screen.debug(screen.getByRole('button'));
});
```

### 2. 查看查询结果

```typescript
// 查看所有匹配的元素
console.log(screen.getAllByRole('button'));

// 查看元素属性
const button = screen.getByRole('button');
console.log(button.getAttribute('class'));
```

### 3. 测试失败时的截图

```typescript
// 在测试失败时自动截图（需要配置）
afterEach(async () => {
  if (expect.getState().currentTestName?.includes('FAIL')) {
    // 保存截图逻辑
  }
});
```

## 持续集成

测试在 CI/CD 流水线中自动运行：

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## 性能测试

对于性能敏感的组件，可以添加性能测试：

```typescript
test('性能测试', async () => {
  const startTime = performance.now();
  
  renderWithProviders(<LargeListComponent data={largeData} />);
  
  await waitFor(() => {
    expect(screen.getByText('渲染完成')).toBeInTheDocument();
  });
  
  const endTime = performance.now();
  expect(endTime - startTime).toBeLessThan(1000); // 1秒内完成
});
```