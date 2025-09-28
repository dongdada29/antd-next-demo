/**
 * 页面测试模板
 * 用于生成标准化的页面测试文件
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../utils';
import {{PAGE_NAME}} from '{{PAGE_PATH}}';

// 扩展 expect 以支持可访问性测试
expect.extend(toHaveNoViolations);

// 模拟路由参数
const mockParams = {{MOCK_PARAMS}};
const mockSearchParams = {{MOCK_SEARCH_PARAMS}};

// 模拟 API 调用
vi.mock('{{API_MODULE}}', () => ({
  {{API_MOCKS}}
}));

describe('{{PAGE_NAME}} Page', () => {
  beforeEach(() => {
    // 重置所有模拟
    vi.clearAllMocks();
  });

  afterEach(() => {
    // 清理
    vi.restoreAllMocks();
  });

  // 基础渲染测试
  describe('Page Rendering', () => {
    it('should render page without crashing', async () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      // 等待页面加载完成
      await waitFor(() => {
        expect(screen.getByTestId('{{PAGE_NAME_KEBAB}}-page')).toBeInTheDocument();
      });
    });

    it('should display page title correctly', async () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('{{PAGE_TITLE}}');
      });
    });

    it('should render all main sections', async () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        {{SECTION_ASSERTIONS}}
      });
    });
  });

  // 数据加载测试
  describe('Data Loading', () => {
    it('should display loading state initially', () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should load and display data correctly', async () => {
      const mockData = {{MOCK_DATA}};
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        {{DATA_ASSERTIONS}}
      });
    });

    it('should handle loading errors gracefully', async () => {
      // 模拟 API 错误
      {{API_ERROR_MOCK}}
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });
    });

    it('should handle empty data state', async () => {
      // 模拟空数据
      {{EMPTY_DATA_MOCK}}
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByText(/no data available/i)).toBeInTheDocument();
      });
    });
  });

  // 用户交互测试
  describe('User Interactions', () => {
    {{INTERACTION_TESTS}}
  });

  // 表单测试（如果页面包含表单）
  describe('Form Interactions', () => {
    {{FORM_TESTS}}
  });

  // 导航测试
  describe('Navigation', () => {
    it('should handle navigation correctly', async () => {
      const mockPush = vi.fn();
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      {{NAVIGATION_TESTS}}
    });
  });

  // SEO 测试
  describe('SEO', () => {
    it('should have proper meta tags', async () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        // 检查页面标题
        expect(document.title).toBe('{{PAGE_TITLE}}');
        
        // 检查 meta 描述
        const metaDescription = document.querySelector('meta[name="description"]');
        expect(metaDescription?.getAttribute('content')).toBe('{{PAGE_DESCRIPTION}}');
      });
    });

    it('should have proper Open Graph tags', async () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        expect(ogTitle?.getAttribute('content')).toBe('{{PAGE_TITLE}}');
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        expect(ogDescription?.getAttribute('content')).toBe('{{PAGE_DESCRIPTION}}');
      });
    });
  });

  // 可访问性测试
  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    it('should have proper heading hierarchy', async () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        const headings = screen.getAllByRole('heading');
        expect(headings[0]).toHaveAttribute('aria-level', '1');
        {{HEADING_HIERARCHY_ASSERTIONS}}
      });
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        {{KEYBOARD_NAVIGATION_TESTS}}
      });
    });

    it('should have proper focus management', async () => {
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        {{FOCUS_MANAGEMENT_TESTS}}
      });
    });
  });

  // 响应式设计测试
  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', async () => {
      // 设置移动端视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        {{MOBILE_RESPONSIVE_TESTS}}
      });
    });

    it('should adapt to tablet viewport', async () => {
      // 设置平板端视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        {{TABLET_RESPONSIVE_TESTS}}
      });
    });

    it('should adapt to desktop viewport', async () => {
      // 设置桌面端视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        {{DESKTOP_RESPONSIVE_TESTS}}
      });
    });
  });

  // 性能测试
  describe('Performance', () => {
    it('should load within acceptable time', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('{{PAGE_NAME_KEBAB}}-page')).toBeInTheDocument();
      });
      
      const loadTime = performance.now() - startTime;
      expect(loadTime).toBeLessThan(1000); // 1秒内加载完成
    });

    it('should not cause memory leaks', async () => {
      const { unmount } = render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('{{PAGE_NAME_KEBAB}}-page')).toBeInTheDocument();
      });
      
      // 卸载组件
      unmount();
      
      // 验证清理工作
      {{CLEANUP_ASSERTIONS}}
    });
  });

  // 错误边界测试
  describe('Error Handling', () => {
    it('should display error boundary when page crashes', () => {
      const ThrowError = () => {
        throw new Error('Test page error');
      };
      
      render(
        <TestWrapper>
          <ThrowError />
        </TestWrapper>
      );
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should handle network errors gracefully', async () => {
      // 模拟网络错误
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      render(
        <TestWrapper>
          <{{PAGE_NAME}} params={mockParams} searchParams={mockSearchParams} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });
});