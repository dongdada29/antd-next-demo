/**
 * 视觉回归测试模板
 * 用于生成标准化的视觉测试文件
 */

import { test, expect, Page } from '@playwright/test';
import { 
  defaultVisualTestOptions, 
  viewports, 
  themes,
  type VisualTestOptions 
} from '../visual-regression.config';

// 测试辅助函数
async function setupPage(page: Page, theme: keyof typeof themes = 'light') {
  // 设置主题
  await page.addInitScript(`
    localStorage.setItem('theme', '${theme}');
  `);
  
  // 禁用动画以确保一致的截图
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
}

async function waitForComponentLoad(page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'visible' });
  await page.waitForLoadState('networkidle');
  
  // 等待字体加载完成
  await page.evaluate(() => document.fonts.ready);
}

test.describe('{{COMPONENT_NAME}} Visual Tests', () => {
  const componentPath = '{{COMPONENT_PATH}}';
  const componentSelector = '[data-testid="{{COMPONENT_NAME_KEBAB}}"]';
  
  // 基础视觉测试
  test.describe('Basic Rendering', () => {
    test('should render correctly in light theme', async ({ page }) => {
      await setupPage(page, 'light');
      await page.goto(componentPath);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-light.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });

    test('should render correctly in dark theme', async ({ page }) => {
      await setupPage(page, 'dark');
      await page.goto(componentPath);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-dark.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });
  });

  // 响应式视觉测试
  test.describe('Responsive Design', () => {
    Object.entries(viewports).forEach(([viewportName, viewport]) => {
      test(`should render correctly on ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await setupPage(page);
        await page.goto(componentPath);
        await waitForComponentLoad(page, componentSelector);
        
        await expect(page).toHaveScreenshot(
          `{{COMPONENT_NAME_KEBAB}}-${viewportName}.png`,
          {
            ...defaultVisualTestOptions.screenshot,
            ...defaultVisualTestOptions.comparison,
          }
        );
      });
    });
  });

  // 组件变体视觉测试
  test.describe('Component Variants', () => {
    {{VARIANT_TESTS}}
  });

  // 交互状态视觉测试
  test.describe('Interactive States', () => {
    test('should render hover state correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(componentPath);
      await waitForComponentLoad(page, componentSelector);
      
      // 悬停到组件上
      await page.hover(componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-hover.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });

    test('should render focus state correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(componentPath);
      await waitForComponentLoad(page, componentSelector);
      
      // 聚焦到组件
      await page.focus(componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-focus.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });

    test('should render active state correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(componentPath);
      await waitForComponentLoad(page, componentSelector);
      
      // 激活组件
      await page.click(componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-active.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });

    test('should render disabled state correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(`${componentPath}?disabled=true`);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-disabled.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });
  });

  // 错误状态视觉测试
  test.describe('Error States', () => {
    test('should render error state correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(`${componentPath}?error=true`);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-error.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });

    test('should render loading state correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(`${componentPath}?loading=true`);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-loading.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });
  });

  // 内容变化视觉测试
  test.describe('Content Variations', () => {
    test('should render with long content correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(`${componentPath}?content=long`);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-long-content.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });

    test('should render with short content correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(`${componentPath}?content=short`);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-short-content.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });

    test('should render with empty content correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(`${componentPath}?content=empty`);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-empty-content.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });
  });

  // 动画测试（如果组件包含动画）
  test.describe('Animations', () => {
    test('should render animation start state correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(`${componentPath}?animation=start`);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-animation-start.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });

    test('should render animation end state correctly', async ({ page }) => {
      await setupPage(page);
      await page.goto(`${componentPath}?animation=end`);
      await waitForComponentLoad(page, componentSelector);
      
      // 等待动画完成
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-animation-end.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });
  });

  // 浏览器兼容性测试
  test.describe('Browser Compatibility', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`should render consistently in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`);
        
        await setupPage(page);
        await page.goto(componentPath);
        await waitForComponentLoad(page, componentSelector);
        
        await expect(page).toHaveScreenshot(
          `{{COMPONENT_NAME_KEBAB}}-${browserName}.png`,
          {
            ...defaultVisualTestOptions.screenshot,
            ...defaultVisualTestOptions.comparison,
          }
        );
      });
    });
  });

  // 高对比度模式测试
  test.describe('High Contrast Mode', () => {
    test('should render correctly in high contrast mode', async ({ page }) => {
      await setupPage(page);
      
      // 启用高对比度模式
      await page.emulateMedia({ 
        colorScheme: 'dark',
        forcedColors: 'active'
      });
      
      await page.goto(componentPath);
      await waitForComponentLoad(page, componentSelector);
      
      await expect(page).toHaveScreenshot('{{COMPONENT_NAME_KEBAB}}-high-contrast.png', {
        ...defaultVisualTestOptions.screenshot,
        ...defaultVisualTestOptions.comparison,
      });
    });
  });

  // 缩放测试
  test.describe('Zoom Levels', () => {
    [0.5, 1, 1.5, 2].forEach(zoomLevel => {
      test(`should render correctly at ${zoomLevel}x zoom`, async ({ page }) => {
        await setupPage(page);
        await page.goto(componentPath);
        await waitForComponentLoad(page, componentSelector);
        
        // 设置缩放级别
        await page.evaluate((zoom) => {
          document.body.style.zoom = zoom.toString();
        }, zoomLevel);
        
        await expect(page).toHaveScreenshot(
          `{{COMPONENT_NAME_KEBAB}}-zoom-${zoomLevel}x.png`,
          {
            ...defaultVisualTestOptions.screenshot,
            ...defaultVisualTestOptions.comparison,
          }
        );
      });
    });
  });
});