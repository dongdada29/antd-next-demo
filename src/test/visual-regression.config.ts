/**
 * 视觉回归测试配置
 * 配置 Playwright 和 Chromatic 进行视觉测试
 */

import { PlaywrightTestConfig } from '@playwright/test';

export const visualRegressionConfig: PlaywrightTestConfig = {
  testDir: './src/test/visual',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/visual-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
};

// 视觉测试配置选项
export interface VisualTestOptions {
  // 截图选项
  screenshot: {
    mode: 'fullPage' | 'viewport';
    animations: 'disabled' | 'allow';
    caret: 'hide' | 'initial';
  };
  
  // 比较选项
  comparison: {
    threshold: number;
    maxDiffPixels: number;
    animations: 'disabled' | 'allow';
  };
  
  // 等待选项
  wait: {
    timeout: number;
    selector?: string;
    state?: 'attached' | 'detached' | 'visible' | 'hidden';
  };
}

export const defaultVisualTestOptions: VisualTestOptions = {
  screenshot: {
    mode: 'fullPage',
    animations: 'disabled',
    caret: 'hide',
  },
  comparison: {
    threshold: 0.2,
    maxDiffPixels: 100,
    animations: 'disabled',
  },
  wait: {
    timeout: 5000,
  },
};

// 组件视觉测试配置
export interface ComponentVisualTestConfig {
  name: string;
  path: string;
  variants: Array<{
    name: string;
    props: Record<string, any>;
    viewport?: { width: number; height: number };
  }>;
  interactions?: Array<{
    name: string;
    action: string;
    selector: string;
  }>;
}

// 预定义的视口尺寸
export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  wide: { width: 1920, height: 1080 },
} as const;

// 主题配置
export const themes = {
  light: 'light',
  dark: 'dark',
} as const;

export default visualRegressionConfig;