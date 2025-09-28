/**
 * 组件测试模板
 * 用于生成标准化的组件测试文件
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../utils';
import { {{COMPONENT_NAME}} } from '{{COMPONENT_PATH}}';

// 扩展 expect 以支持可访问性测试
expect.extend(toHaveNoViolations);

describe('{{COMPONENT_NAME}}', () => {
  // 基础渲染测试
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('{{COMPONENT_NAME_KEBAB}}')).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      const customProps = {{CUSTOM_PROPS}};
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {...customProps} />
        </TestWrapper>
      );
      
      // 验证自定义属性是否正确应用
      {{CUSTOM_PROPS_ASSERTIONS}}
    });

    it('should apply custom className', () => {
      const customClass = 'custom-test-class';
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} className={customClass} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('{{COMPONENT_NAME_KEBAB}}')).toHaveClass(customClass);
    });
  });

  // 交互测试
  describe('Interactions', () => {
    {{INTERACTION_TESTS}}
  });

  // 状态测试
  describe('State Management', () => {
    {{STATE_TESTS}}
  });

  // 可访问性测试
  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const element = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      
      // 测试 Tab 键导航
      element.focus();
      expect(element).toHaveFocus();
      
      // 测试 Enter 键
      fireEvent.keyDown(element, { key: 'Enter', code: 'Enter' });
      {{KEYBOARD_ASSERTIONS}}
    });

    it('should have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const element = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      {{ARIA_ASSERTIONS}}
    });
  });

  // 响应式测试
  describe('Responsive Design', () => {
    it('should adapt to different screen sizes', () => {
      // 测试移动端
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      {{MOBILE_ASSERTIONS}}
      
      // 测试桌面端
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      {{DESKTOP_ASSERTIONS}}
    });
  });

  // 错误处理测试
  describe('Error Handling', () => {
    it('should handle invalid props gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{INVALID_PROPS}} />
        </TestWrapper>
      );
      
      // 组件应该仍然渲染，但可能显示错误状态
      expect(screen.getByTestId('{{COMPONENT_NAME_KEBAB}}')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('should display error boundary when component crashes', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}}>
            <ThrowError />
          </{{COMPONENT_NAME}}>
        </TestWrapper>
      );
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  // 性能测试
  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const renderSpy = vi.fn();
      
      const TestComponent = () => {
        renderSpy();
        return <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />;
      };
      
      const { rerender } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // 重新渲染相同的 props
      rerender(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // 应该没有额外的渲染
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });

  // 主题测试
  describe('Theming', () => {
    it('should apply light theme correctly', () => {
      render(
        <TestWrapper theme="light">
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      {{LIGHT_THEME_ASSERTIONS}}
    });

    it('should apply dark theme correctly', () => {
      render(
        <TestWrapper theme="dark">
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      {{DARK_THEME_ASSERTIONS}}
    });
  });
});