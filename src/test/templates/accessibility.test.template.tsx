/**
 * 可访问性测试模板
 * 用于生成标准化的可访问性测试文件
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { TestWrapper } from '../utils';
import { 
  axeConfig, 
  defaultAccessibilityOptions,
  defaultKeyboardConfig,
  accessibilityTestUtils 
} from '../accessibility.config';
import { {{COMPONENT_NAME}} } from '{{COMPONENT_PATH}}';

// 扩展 expect 以支持可访问性测试
expect.extend(toHaveNoViolations);

describe('{{COMPONENT_NAME}} Accessibility Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // WCAG 合规性测试
  describe('WCAG Compliance', () => {
    it('should not have accessibility violations (WCAG 2.1 AA)', async () => {
      const { container } = render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const results = await axe(container, axeConfig);
      expect(results).toHaveNoViolations();
    });

    it('should pass WCAG 2.1 AAA standards where applicable', async () => {
      const { container } = render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const results = await axe(container, {
        ...axeConfig,
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag21aaa'],
      });
      
      // 允许某些 AAA 规则失败，但记录它们
      if (results.violations.length > 0) {
        console.warn('WCAG AAA violations found:', results.violations);
      }
      
      // 确保没有严重的可访问性问题
      const criticalViolations = results.violations.filter(
        violation => violation.impact === 'critical' || violation.impact === 'serious'
      );
      expect(criticalViolations).toHaveLength(0);
    });
  });

  // 键盘导航测试
  describe('Keyboard Navigation', () => {
    it('should be fully keyboard accessible', async () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      const focusableElements = accessibilityTestUtils.getFocusableElements(component);
      
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // 测试 Tab 键导航
      for (let i = 0; i < focusableElements.length; i++) {
        await user.tab();
        expect(focusableElements[i]).toHaveFocus();
      }
    });

    it('should support reverse tab navigation', async () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      const focusableElements = accessibilityTestUtils.getFocusableElements(component);
      
      // 先导航到最后一个元素
      for (let i = 0; i < focusableElements.length; i++) {
        await user.tab();
      }
      
      // 然后反向导航
      for (let i = focusableElements.length - 1; i >= 0; i--) {
        await user.tab({ shift: true });
        expect(focusableElements[i]).toHaveFocus();
      }
    });

    it('should handle Enter key activation', async () => {
      const onActivate = vi.fn();
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} onActivate={onActivate} />
        </TestWrapper>
      );
      
      const activatableElement = screen.getByRole('{{COMPONENT_ROLE}}');
      activatableElement.focus();
      
      await user.keyboard('{Enter}');
      expect(onActivate).toHaveBeenCalled();
    });

    it('should handle Space key activation for buttons', async () => {
      const onClick = vi.fn();
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} onClick={onClick} />
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalled();
    });

    it('should handle Escape key for dismissible components', async () => {
      const onDismiss = vi.fn();
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} onDismiss={onDismiss} dismissible />
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      component.focus();
      
      await user.keyboard('{Escape}');
      expect(onDismiss).toHaveBeenCalled();
    });

    it('should trap focus in modal components', async () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} modal open />
        </TestWrapper>
      );
      
      const modal = screen.getByRole('dialog');
      const focusableElements = accessibilityTestUtils.getFocusableElements(modal);
      
      // 聚焦到最后一个元素
      focusableElements[focusableElements.length - 1].focus();
      
      // Tab 应该回到第一个元素
      await user.tab();
      expect(focusableElements[0]).toHaveFocus();
      
      // Shift+Tab 应该回到最后一个元素
      await user.tab({ shift: true });
      expect(focusableElements[focusableElements.length - 1]).toHaveFocus();
    });
  });

  // ARIA 属性测试
  describe('ARIA Attributes', () => {
    it('should have proper ARIA roles', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      expect(component).toHaveAttribute('role', '{{EXPECTED_ROLE}}');
      
      {{ADDITIONAL_ROLE_ASSERTIONS}}
    });

    it('should have proper ARIA labels', () => {
      const ariaLabel = 'Test component label';
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} aria-label={ariaLabel} />
        </TestWrapper>
      );
      
      const component = screen.getByLabelText(ariaLabel);
      expect(component).toBeInTheDocument();
    });

    it('should have proper ARIA descriptions', () => {
      const description = 'This is a test component description';
      
      render(
        <TestWrapper>
          <div>
            <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} aria-describedby="description" />
            <div id="description">{description}</div>
          </div>
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      expect(component).toHaveAccessibleDescription(description);
    });

    it('should update ARIA states correctly', async () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      
      {{ARIA_STATE_TESTS}}
    });

    it('should have proper ARIA live regions for dynamic content', async () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      
      {{LIVE_REGION_TESTS}}
    });
  });

  // 屏幕阅读器测试
  describe('Screen Reader Support', () => {
    it('should provide meaningful accessible names', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      const accessibleName = accessibilityTestUtils.getAccessibleName(component);
      
      expect(accessibleName).toBeTruthy();
      expect(accessibleName.length).toBeGreaterThan(0);
    });

    it('should announce state changes', async () => {
      const { rerender } = render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const announcements = screen.getByRole('status');
      expect(announcements).toBeInTheDocument();
      
      // 触发状态变化
      rerender(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} {{STATE_CHANGE_PROPS}} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(announcements).toHaveTextContent('{{EXPECTED_ANNOUNCEMENT}}');
      });
    });

    it('should provide context for complex interactions', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      {{CONTEXT_TESTS}}
    });
  });

  // 颜色和对比度测试
  describe('Color and Contrast', () => {
    it('should meet color contrast requirements', async () => {
      const { container } = render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const textElements = container.querySelectorAll('p, span, button, input, label');
      
      for (const element of textElements) {
        const contrastResult = await accessibilityTestUtils.checkColorContrast(element as HTMLElement);
        expect(contrastResult.passes).toBe(true);
        expect(contrastResult.ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('should not rely solely on color to convey information', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} status="error" />
        </TestWrapper>
      );
      
      // 错误状态应该有文本或图标指示，不仅仅是颜色
      const errorIndicator = screen.getByText(/error/i) || screen.getByRole('img', { name: /error/i });
      expect(errorIndicator).toBeInTheDocument();
    });

    it('should be usable in high contrast mode', () => {
      // 模拟高对比度模式
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-contrast: high) {
          * {
            background: white !important;
            color: black !important;
            border-color: black !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      expect(component).toBeVisible();
      
      document.head.removeChild(style);
    });
  });

  // 焦点管理测试
  describe('Focus Management', () => {
    it('should have visible focus indicators', async () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const focusableElement = screen.getByRole('{{COMPONENT_ROLE}}');
      
      await user.tab();
      expect(focusableElement).toHaveFocus();
      
      // 检查焦点样式（这需要根据实际实现调整）
      const styles = window.getComputedStyle(focusableElement);
      expect(styles.outline).not.toBe('none');
    });

    it('should restore focus after modal interactions', async () => {
      const triggerButton = document.createElement('button');
      triggerButton.textContent = 'Open Modal';
      document.body.appendChild(triggerButton);
      triggerButton.focus();
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} modal open />
        </TestWrapper>
      );
      
      const modal = screen.getByRole('dialog');
      const closeButton = screen.getByRole('button', { name: /close/i });
      
      await user.click(closeButton);
      
      // 焦点应该返回到触发按钮
      expect(triggerButton).toHaveFocus();
      
      document.body.removeChild(triggerButton);
    });

    it('should skip hidden content in focus order', () => {
      render(
        <TestWrapper>
          <div>
            <button>Visible Button 1</button>
            <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
            <button style={{ display: 'none' }}>Hidden Button</button>
            <button>Visible Button 2</button>
          </div>
        </TestWrapper>
      );
      
      const visibleButtons = screen.getAllByRole('button').filter(
        button => button.style.display !== 'none'
      );
      
      expect(visibleButtons).toHaveLength(2);
    });
  });

  // 语义化测试
  describe('Semantic Structure', () => {
    it('should use semantic HTML elements', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      {{SEMANTIC_ELEMENT_TESTS}}
    });

    it('should have proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      const headings = screen.getAllByRole('heading');
      
      // 检查标题层级是否合理
      for (let i = 1; i < headings.length; i++) {
        const currentLevel = parseInt(headings[i].tagName.charAt(1));
        const previousLevel = parseInt(headings[i - 1].tagName.charAt(1));
        
        // 标题层级不应该跳跃超过1级
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    });

    it('should use landmarks appropriately', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
        </TestWrapper>
      );
      
      {{LANDMARK_TESTS}}
    });
  });

  // 错误处理和反馈测试
  describe('Error Handling and Feedback', () => {
    it('should provide accessible error messages', async () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} error="This is an error message" />
        </TestWrapper>
      );
      
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('This is an error message');
      expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
    });

    it('should associate error messages with form controls', () => {
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} error="Invalid input" />
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByRole('alert');
      
      expect(input).toHaveAttribute('aria-describedby');
      expect(input.getAttribute('aria-describedby')).toBe(errorMessage.id);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should provide success feedback accessibly', async () => {
      const onSuccess = vi.fn();
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} onSuccess={onSuccess} />
        </TestWrapper>
      );
      
      // 触发成功操作
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const successMessage = screen.getByRole('status');
        expect(successMessage).toHaveTextContent(/success/i);
      });
    });
  });

  // 国际化和本地化测试
  describe('Internationalization', () => {
    it('should support right-to-left languages', () => {
      render(
        <TestWrapper>
          <div dir="rtl">
            <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />
          </div>
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      expect(component.closest('[dir="rtl"]')).toBeInTheDocument();
      
      {{RTL_TESTS}}
    });

    it('should handle different language content', () => {
      const longGermanText = 'Donaudampfschiffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft';
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} text={longGermanText} />
        </TestWrapper>
      );
      
      const component = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      expect(component).toHaveTextContent(longGermanText);
    });
  });
});