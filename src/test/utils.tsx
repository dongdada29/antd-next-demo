/**
 * 测试工具函数
 * 提供常用的测试辅助函数和组件包装器
 */

import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { vi } from 'vitest';

// 测试包装器组件
interface TestWrapperProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  antdConfig?: any;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ 
  children, 
  queryClient,
  antdConfig = {} 
}) => {
  const defaultQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const client = queryClient || defaultQueryClient;

  return (
    <QueryClientProvider client={client}>
      <ConfigProvider locale={zhCN} {...antdConfig}>
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
};

// 自定义渲染函数
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  antdConfig?: any;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { queryClient, antdConfig, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestWrapper queryClient={queryClient} antdConfig={antdConfig}>
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// 创建模拟的 QueryClient
export function createMockQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// 模拟 API 响应
export function mockApiResponse<T>(data: T, delay = 0): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

// 模拟 API 错误
export function mockApiError(message = 'API Error', status = 500, delay = 0): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message);
      (error as any).status = status;
      reject(error);
    }, delay);
  });
}

// 模拟表单提交
export function mockFormSubmit<T>(data: T): Promise<T> {
  return mockApiResponse(data, 100);
}

// 等待异步操作完成
export function waitForAsync(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 模拟用户交互延迟
export function mockUserDelay(ms = 100): Promise<void> {
  return waitForAsync(ms);
}

// 创建模拟的事件处理器
export function createMockHandler<T extends (...args: any[]) => any>(): {
  handler: T;
  mock: ReturnType<typeof vi.fn>;
} {
  const mock = vi.fn();
  return {
    handler: mock as T,
    mock,
  };
}

// 模拟文件上传
export function createMockFile(
  name = 'test.txt',
  content = 'test content',
  type = 'text/plain'
): File {
  const file = new File([content], name, { type });
  return file;
}

// 模拟图片文件
export function createMockImageFile(
  name = 'test.jpg',
  width = 100,
  height = 100
): File {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob!], name, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  }) as any;
}

// 模拟拖拽事件
export function createMockDragEvent(files: File[]): Event {
  const event = new Event('drop');
  Object.defineProperty(event, 'dataTransfer', {
    value: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
    },
  });
  return event;
}

// 模拟网络状态
export function mockNetworkStatus(online = true): void {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: online,
  });
}

// 模拟设备信息
export function mockDeviceInfo(userAgent: string): void {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: userAgent,
  });
}

// 模拟屏幕尺寸
export function mockScreenSize(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    value: height,
  });
  
  // 触发 resize 事件
  window.dispatchEvent(new Event('resize'));
}

// 模拟滚动位置
export function mockScrollPosition(x: number, y: number): void {
  Object.defineProperty(window, 'scrollX', {
    writable: true,
    value: x,
  });
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    value: y,
  });
  
  // 触发 scroll 事件
  window.dispatchEvent(new Event('scroll'));
}

// 测试数据生成器
export const testDataGenerators = {
  // 生成用户数据
  user: (overrides: Partial<any> = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    ...overrides,
  }),

  // 生成列表数据
  userList: (count = 5, overrides: Partial<any> = {}) => 
    Array.from({ length: count }, (_, index) => 
      testDataGenerators.user({ 
        id: index + 1, 
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        ...overrides 
      })
    ),

  // 生成分页数据
  paginatedData: function<T>(data: T[], page = 1, pageSize = 10) {
    return {
      data: data.slice((page - 1) * pageSize, page * pageSize),
      total: data.length,
      page,
      pageSize,
      totalPages: Math.ceil(data.length / pageSize),
    };
  },

  // 生成表单数据
  formData: (overrides: Record<string, any> = {}) => {
    return {
      name: 'Test Name',
      email: 'test@example.com',
      phone: '1234567890',
      address: 'Test Address',
      ...overrides,
    };
  },

  // 生成API错误
  apiError: (message = 'API Error', status = 500, details?: any) => {
    return {
      message,
      status,
      details,
      timestamp: new Date().toISOString(),
    };
  },
};

// 断言辅助函数
export const assertions = {
  // 检查元素是否可见
  toBeVisible: (element: HTMLElement) => {
    expect(element).toBeInTheDocument();
    expect(element).toBeVisible();
  },

  // 检查表单字段
  toHaveFormField: (container: HTMLElement, label: string, value?: string) => {
    const field = container.querySelector(`[aria-label="${label}"], [placeholder="${label}"]`);
    expect(field).toBeInTheDocument();
    if (value !== undefined) {
      expect(field).toHaveValue(value);
    }
  },

  // 检查加载状态
  toShowLoading: (container: HTMLElement) => {
    const loading = container.querySelector('.ant-spin, [data-testid="loading"]');
    expect(loading).toBeInTheDocument();
  },

  // 检查错误状态
  toShowError: (container: HTMLElement, message?: string) => {
    const error = container.querySelector('.ant-alert-error, [data-testid="error"]');
    expect(error).toBeInTheDocument();
    if (message) {
      expect(error).toHaveTextContent(message);
    }
  },

  // 检查成功状态
  toShowSuccess: (container: HTMLElement, message?: string) => {
    const success = container.querySelector('.ant-alert-success, [data-testid="success"]');
    expect(success).toBeInTheDocument();
    if (message) {
      expect(success).toHaveTextContent(message);
    }
  },
};

// 重新导出常用的测试工具
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { vi } from 'vitest';