/**
 * 测试生成器类型定义
 */

export interface ComponentConfig {
  name: string;
  path: string;
  type: 'component' | 'page' | 'hook';
  
  // 基础配置
  defaultProps?: Record<string, any>;
  customProps?: Record<string, any>;
  invalidProps?: Record<string, any>;
  
  // 交互配置
  interactions?: Array<{
    name: string;
    action: string;
    prop: string;
    expectedResult?: string;
  }>;
  
  // 状态测试配置
  stateTests?: Array<{
    name: string;
    initialValue: any;
    newValue: any;
    assertion?: string;
  }>;
  
  // 键盘行为配置
  keyboardBehavior?: {
    role: string;
    tabIndex?: number;
    keyHandlers?: Record<string, string>;
  };
  
  // ARIA 属性配置
  ariaAttributes?: Record<string, string>;
  
  // 响应式配置
  responsive?: {
    mobile?: {
      className: string;
      breakpoint: number;
      behavior?: string;
    };
    tablet?: {
      className: string;
      breakpoint: number;
      behavior?: string;
    };
    desktop?: {
      className: string;
      breakpoint: number;
      behavior?: string;
    };
  };
  
  // 主题配置
  themes?: {
    light?: {
      className: string;
      variables?: Record<string, string>;
    };
    dark?: {
      className: string;
      variables?: Record<string, string>;
    };
  };
  
  // 页面特定配置
  pageConfig?: {
    title: string;
    description: string;
    mockParams?: Record<string, any>;
    mockSearchParams?: Record<string, any>;
    apiModule?: string;
    apiMocks?: Record<string, any>;
    sections?: Array<{
      name: string;
      testId: string;
      required: boolean;
    }>;
    mockData?: any;
    dataAssertions?: Array<{
      text: string;
      selector?: string;
    }>;
    interactions?: Array<{
      name: string;
      trigger: string;
      expectedResult: string;
    }>;
    forms?: Array<{
      name: string;
      fields: Array<{
        name: string;
        type: string;
        validation?: string;
      }>;
    }>;
    navigation?: Array<{
      name: string;
      trigger: string;
      expectedRoute: string;
    }>;
    headings?: Array<{
      level: number;
      text: string;
      testId?: string;
    }>;
    keyboardNav?: {
      focusableElements: string[];
      skipLinks?: string[];
    };
    focusManagement?: {
      initialFocus?: string;
      focusTrap?: boolean;
      restoreFocus?: boolean;
    };
    cleanup?: Array<{
      resource: string;
      assertion: string;
    }>;
  };
  
  // Hook 特定配置
  hookConfig?: {
    defaultParams?: Record<string, any>;
    expectedInitialState?: any;
    customParams?: Record<string, any>;
    expectedCustomState?: any;
    stateUpdates?: Array<{
      name: string;
      action: string;
      expectedState: any;
    }>;
    sideEffects?: Array<{
      name: string;
      trigger: string;
      expectedEffect: string;
    }>;
    asyncActions?: Array<{
      name: string;
      action: string;
      expectedResult: any;
      errorScenario?: {
        mockError: string;
        expectedError: string;
      };
    }>;
    concurrentActions?: Array<{
      name: string;
      actions: string[];
      expectedResult: any;
    }>;
    dependencies?: {
      initial: Record<string, any>;
      updated: Record<string, any>;
      stable: Record<string, any>;
      updateAssertions?: string[];
    };
    invalidParams?: Record<string, any>;
    errorHandling?: {
      triggerError: string;
      recoveryAction: string;
      expectedRecovery: string;
    };
    computationResult?: any;
    edgeCases?: Array<{
      name: string;
      scenario: string;
      expectedBehavior: string;
    }>;
    integrationHooks?: Array<{
      name: string;
      params: Record<string, any>;
      assertions: string[];
    }>;
    contextProvider?: string;
    contextValue?: Record<string, any>;
    contextIntegration?: {
      assertions: string[];
    };
  };
  
  // 视觉测试配置
  visualConfig?: {
    path: string;
    variants?: Array<{
      name: string;
      props: Record<string, any>;
      viewport?: {
        width: number;
        height: number;
      };
    }>;
    interactions?: Array<{
      name: string;
      action: string;
      selector: string;
    }>;
    themes?: string[];
    viewports?: string[];
  };
  
  // 可访问性测试配置
  accessibilityConfig?: {
    role: string;
    expectedRole?: string;
    additionalRoles?: Array<{
      selector: string;
      role: string;
    }>;
    ariaStates?: Array<{
      name: string;
      trigger: string;
      expectedState: Record<string, string>;
    }>;
    liveRegions?: Array<{
      selector: string;
      type: 'polite' | 'assertive';
      expectedContent: string;
    }>;
    stateChangeProps?: Record<string, any>;
    expectedAnnouncement?: string;
    contextTests?: Array<{
      name: string;
      setup: string;
      assertion: string;
    }>;
    semanticElements?: Array<{
      selector: string;
      expectedTag: string;
    }>;
    landmarks?: Array<{
      role: string;
      selector: string;
    }>;
    rtlSupport?: {
      enabled: boolean;
      specificTests?: Array<{
        name: string;
        assertion: string;
      }>;
    };
  };
}

export interface TestConfig {
  component: ComponentConfig;
  outputDir: string;
  testTypes: Array<'component' | 'page' | 'hook' | 'visual' | 'accessibility'>;
  options?: {
    generateMocks?: boolean;
    includePerformanceTests?: boolean;
    includeE2ETests?: boolean;
    customTemplates?: Record<string, string>;
  };
}

export interface TestTemplate {
  name: string;
  path: string;
  content: string;
  variables: string[];
}

export interface TestGenerationResult {
  success: boolean;
  generatedFiles: string[];
  errors?: string[];
  warnings?: string[];
}

export interface MockConfig {
  apiEndpoints?: Array<{
    path: string;
    method: string;
    response: any;
    error?: any;
  }>;
  
  externalServices?: Array<{
    name: string;
    methods: Record<string, any>;
  }>;
  
  contextProviders?: Array<{
    name: string;
    value: any;
  }>;
  
  customMocks?: Record<string, string>;
}

export interface PerformanceTestConfig {
  renderTime?: {
    threshold: number;
    iterations: number;
  };
  
  memoryUsage?: {
    threshold: number;
    checkLeaks: boolean;
  };
  
  bundleSize?: {
    threshold: number;
    trackDependencies: boolean;
  };
  
  interactionLatency?: {
    threshold: number;
    interactions: string[];
  };
}

export interface E2ETestConfig {
  scenarios?: Array<{
    name: string;
    steps: Array<{
      action: string;
      selector?: string;
      value?: string;
      assertion?: string;
    }>;
  }>;
  
  userFlows?: Array<{
    name: string;
    startUrl: string;
    steps: string[];
    expectedOutcome: string;
  }>;
  
  crossBrowser?: {
    browsers: string[];
    viewports: Array<{
      width: number;
      height: number;
    }>;
  };
}

export interface TestMetrics {
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  
  performance: {
    testDuration: number;
    slowestTests: Array<{
      name: string;
      duration: number;
    }>;
  };
  
  accessibility: {
    violations: number;
    warnings: number;
    passedChecks: number;
  };
  
  visual: {
    screenshots: number;
    differences: number;
    regressions: number;
  };
}