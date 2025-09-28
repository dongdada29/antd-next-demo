/**
 * 可访问性测试配置
 * 配置 axe-core 和相关工具进行可访问性测试
 */

import { configureAxe } from 'jest-axe';

// axe-core 配置
export const axeConfig = configureAxe({
  rules: {
    // 启用所有 WCAG 2.1 AA 规则
    'wcag2a': { enabled: true },
    'wcag2aa': { enabled: true },
    'wcag21aa': { enabled: true },
    
    // 最佳实践规则
    'best-practice': { enabled: true },
    
    // 实验性规则（可选）
    'experimental': { enabled: false },
    
    // 自定义规则配置
    'color-contrast': { 
      enabled: true,
      options: {
        noScroll: true,
        ignoreUseOfColorAlone: false,
      }
    },
    'focus-order-semantics': { enabled: true },
    'landmark-unique': { enabled: true },
    'region': { enabled: true },
    'skip-link': { enabled: true },
    
    // 禁用某些在测试环境中不适用的规则
    'bypass': { enabled: false }, // 跳过链接在组件测试中不适用
    'page-has-heading-one': { enabled: false }, // 组件测试中可能没有 h1
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
});

// 可访问性测试选项
export interface AccessibilityTestOptions {
  // 测试范围
  scope: {
    include?: string[];
    exclude?: string[];
  };
  
  // 规则配置
  rules: {
    enabled: string[];
    disabled: string[];
  };
  
  // 标签过滤
  tags: string[];
  
  // 超时设置
  timeout: number;
}

export const defaultAccessibilityOptions: AccessibilityTestOptions = {
  scope: {
    include: ['[data-testid]'],
    exclude: ['[aria-hidden="true"]'],
  },
  rules: {
    enabled: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    disabled: ['bypass', 'page-has-heading-one'],
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  timeout: 5000,
};

// 键盘导航测试配置
export interface KeyboardTestConfig {
  focusableElements: string[];
  keySequences: Array<{
    name: string;
    keys: string[];
    expectedFocus: string;
  }>;
  skipLinks: string[];
}

export const defaultKeyboardConfig: KeyboardTestConfig = {
  focusableElements: [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
  ],
  keySequences: [
    {
      name: 'Tab navigation',
      keys: ['Tab'],
      expectedFocus: 'next focusable element',
    },
    {
      name: 'Shift+Tab navigation',
      keys: ['Shift+Tab'],
      expectedFocus: 'previous focusable element',
    },
    {
      name: 'Enter activation',
      keys: ['Enter'],
      expectedFocus: 'current element',
    },
    {
      name: 'Space activation',
      keys: [' '],
      expectedFocus: 'current element',
    },
    {
      name: 'Escape dismissal',
      keys: ['Escape'],
      expectedFocus: 'trigger element or close modal',
    },
  ],
  skipLinks: ['[href="#main"]', '[href="#content"]'],
};

// 屏幕阅读器测试配置
export interface ScreenReaderTestConfig {
  announcements: Array<{
    trigger: string;
    expectedText: string;
    role?: string;
  }>;
  landmarks: string[];
  headingStructure: Array<{
    level: number;
    text: string;
  }>;
}

// 颜色对比度测试配置
export interface ColorContrastConfig {
  minimumRatio: {
    normal: number;
    large: number;
  };
  testElements: string[];
  ignoreElements: string[];
}

export const defaultColorContrastConfig: ColorContrastConfig = {
  minimumRatio: {
    normal: 4.5, // WCAG AA 标准
    large: 3.0,  // WCAG AA 大文本标准
  },
  testElements: [
    'p', 'span', 'div', 'button', 'input', 'label',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'li', 'td', 'th',
  ],
  ignoreElements: [
    '[aria-hidden="true"]',
    '.sr-only',
    '[data-ignore-contrast]',
  ],
};

// 可访问性测试工具函数
export const accessibilityTestUtils = {
  // 获取所有可聚焦元素
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = defaultKeyboardConfig.focusableElements.join(', ');
    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter((element) => {
        const htmlElement = element as HTMLElement;
        return (
          htmlElement.offsetWidth > 0 &&
          htmlElement.offsetHeight > 0 &&
          !htmlElement.disabled &&
          htmlElement.tabIndex !== -1
        );
      }) as HTMLElement[];
  },

  // 检查元素是否可访问
  isElementAccessible: (element: HTMLElement): boolean => {
    return (
      element.offsetWidth > 0 &&
      element.offsetHeight > 0 &&
      !element.hasAttribute('aria-hidden') &&
      element.getAttribute('aria-hidden') !== 'true'
    );
  },

  // 获取元素的可访问名称
  getAccessibleName: (element: HTMLElement): string => {
    // 优先级：aria-labelledby > aria-label > label > title > text content
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) {
        return labelElement.textContent?.trim() || '';
      }
    }

    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel.trim();
    }

    if (element.tagName === 'INPUT') {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) {
        return label.textContent?.trim() || '';
      }
    }

    const title = element.getAttribute('title');
    if (title) {
      return title.trim();
    }

    return element.textContent?.trim() || '';
  },

  // 检查颜色对比度
  checkColorContrast: async (element: HTMLElement): Promise<{
    ratio: number;
    passes: boolean;
    level: 'AA' | 'AAA' | 'fail';
  }> => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // 这里需要实际的颜色对比度计算逻辑
    // 可以使用 color-contrast 库或自定义实现
    return {
      ratio: 4.5, // 占位值
      passes: true,
      level: 'AA',
    };
  },
};

export default axeConfig;