/**
 * 测试代码自动生成器
 * 基于组件配置自动生成测试文件
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { ComponentConfig, TestConfig, TestTemplate } from '../types/test-generator';

export class TestGenerator {
  private templateCache: Map<string, string> = new Map();
  
  constructor(private templatesDir: string = 'src/test/templates') {}

  /**
   * 生成组件测试文件
   */
  async generateComponentTest(config: ComponentConfig): Promise<string> {
    const template = await this.loadTemplate('component.test.template.tsx');
    const testCode = this.processTemplate(template, {
      COMPONENT_NAME: config.name,
      COMPONENT_PATH: config.path,
      COMPONENT_NAME_KEBAB: this.toKebabCase(config.name),
      DEFAULT_PROPS: this.formatProps(config.defaultProps),
      CUSTOM_PROPS: this.formatProps(config.customProps),
      CUSTOM_PROPS_ASSERTIONS: this.generatePropsAssertions(config.customProps),
      INTERACTION_TESTS: this.generateInteractionTests(config.interactions),
      STATE_TESTS: this.generateStateTests(config.stateTests),
      KEYBOARD_ASSERTIONS: this.generateKeyboardAssertions(config.keyboardBehavior),
      ARIA_ASSERTIONS: this.generateAriaAssertions(config.ariaAttributes),
      MOBILE_ASSERTIONS: this.generateResponsiveAssertions(config.responsive?.mobile),
      DESKTOP_ASSERTIONS: this.generateResponsiveAssertions(config.responsive?.desktop),
      INVALID_PROPS: this.formatProps(config.invalidProps),
      LIGHT_THEME_ASSERTIONS: this.generateThemeAssertions(config.themes?.light),
      DARK_THEME_ASSERTIONS: this.generateThemeAssertions(config.themes?.dark),
    });

    return testCode;
  }

  /**
   * 生成页面测试文件
   */
  async generatePageTest(config: ComponentConfig): Promise<string> {
    const template = await this.loadTemplate('page.test.template.tsx');
    const testCode = this.processTemplate(template, {
      PAGE_NAME: config.name,
      PAGE_PATH: config.path,
      PAGE_NAME_KEBAB: this.toKebabCase(config.name),
      PAGE_TITLE: config.pageConfig?.title || config.name,
      PAGE_DESCRIPTION: config.pageConfig?.description || `${config.name} page`,
      MOCK_PARAMS: this.formatProps(config.pageConfig?.mockParams),
      MOCK_SEARCH_PARAMS: this.formatProps(config.pageConfig?.mockSearchParams),
      API_MODULE: config.pageConfig?.apiModule || './api',
      API_MOCKS: this.generateApiMocks(config.pageConfig?.apiMocks),
      SECTION_ASSERTIONS: this.generateSectionAssertions(config.pageConfig?.sections),
      MOCK_DATA: this.formatProps(config.pageConfig?.mockData),
      DATA_ASSERTIONS: this.generateDataAssertions(config.pageConfig?.dataAssertions),
      API_ERROR_MOCK: this.generateApiErrorMock(config.pageConfig?.apiModule),
      EMPTY_DATA_MOCK: this.generateEmptyDataMock(config.pageConfig?.apiModule),
      INTERACTION_TESTS: this.generatePageInteractionTests(config.pageConfig?.interactions),
      FORM_TESTS: this.generateFormTests(config.pageConfig?.forms),
      NAVIGATION_TESTS: this.generateNavigationTests(config.pageConfig?.navigation),
      HEADING_HIERARCHY_ASSERTIONS: this.generateHeadingHierarchyAssertions(config.pageConfig?.headings),
      KEYBOARD_NAVIGATION_TESTS: this.generateKeyboardNavigationTests(config.pageConfig?.keyboardNav),
      FOCUS_MANAGEMENT_TESTS: this.generateFocusManagementTests(config.pageConfig?.focusManagement),
      MOBILE_RESPONSIVE_TESTS: this.generateResponsiveTests(config.responsive?.mobile),
      TABLET_RESPONSIVE_TESTS: this.generateResponsiveTests(config.responsive?.tablet),
      DESKTOP_RESPONSIVE_TESTS: this.generateResponsiveTests(config.responsive?.desktop),
      CLEANUP_ASSERTIONS: this.generateCleanupAssertions(config.pageConfig?.cleanup),
    });

    return testCode;
  }

  /**
   * 生成 Hook 测试文件
   */
  async generateHookTest(config: ComponentConfig): Promise<string> {
    const template = await this.loadTemplate('hook.test.template.tsx');
    const testCode = this.processTemplate(template, {
      HOOK_NAME: config.name,
      HOOK_PATH: config.path,
      DEFAULT_PARAMS: this.formatProps(config.hookConfig?.defaultParams),
      EXPECTED_INITIAL_STATE: this.formatProps(config.hookConfig?.expectedInitialState),
      CUSTOM_PARAMS: this.formatProps(config.hookConfig?.customParams),
      EXPECTED_CUSTOM_STATE: this.formatProps(config.hookConfig?.expectedCustomState),
      STATE_UPDATE_TESTS: this.generateStateUpdateTests(config.hookConfig?.stateUpdates),
      SIDE_EFFECT_TESTS: this.generateSideEffectTests(config.hookConfig?.sideEffects),
      ASYNC_ACTION: this.generateAsyncAction(config.hookConfig?.asyncActions?.[0]),
      ASYNC_RESULT_ASSERTIONS: this.generateAsyncResultAssertions(config.hookConfig?.asyncActions?.[0]),
      ASYNC_ERROR_MOCK: this.generateAsyncErrorMock(config.hookConfig?.asyncActions?.[0]),
      ASYNC_ERROR_ACTION: this.generateAsyncErrorAction(config.hookConfig?.asyncActions?.[0]),
      CONCURRENT_ASYNC_ACTIONS: this.generateConcurrentAsyncActions(config.hookConfig?.concurrentActions),
      CONCURRENT_RESULT_ASSERTIONS: this.generateConcurrentResultAssertions(config.hookConfig?.concurrentActions),
      START_ASYNC_OPERATION: this.generateStartAsyncOperation(config.hookConfig?.asyncActions?.[0]),
      CANCELLATION_ASSERTIONS: this.generateCancellationAssertions(config.hookConfig?.asyncActions?.[0]),
      INITIAL_DEPS: this.formatProps(config.hookConfig?.dependencies?.initial),
      UPDATED_DEPS: this.formatProps(config.hookConfig?.dependencies?.updated),
      DEPENDENCY_UPDATE_ASSERTIONS: this.generateDependencyUpdateAssertions(config.hookConfig?.dependencies),
      STABLE_DEPS: this.formatProps(config.hookConfig?.dependencies?.stable),
      INVALID_PARAMS: this.formatProps(config.hookConfig?.invalidParams),
      TRIGGER_ERROR: this.generateTriggerError(config.hookConfig?.errorHandling),
      RECOVERY_ACTION: this.generateRecoveryAction(config.hookConfig?.errorHandling),
      COMPUTATION_RESULT: this.formatProps(config.hookConfig?.computationResult),
      EDGE_CASE_TESTS: this.generateEdgeCaseTests(config.hookConfig?.edgeCases),
      OTHER_HOOK: config.hookConfig?.integrationHooks?.[0]?.name || 'useOtherHook',
      OTHER_HOOK_PARAMS: this.formatProps(config.hookConfig?.integrationHooks?.[0]?.params),
      INTEGRATION_ASSERTIONS: this.generateIntegrationAssertions(config.hookConfig?.integrationHooks),
      CONTEXT_PROVIDER: config.hookConfig?.contextProvider || 'TestContextProvider',
      CONTEXT_VALUE: this.formatProps(config.hookConfig?.contextValue),
      CONTEXT_INTEGRATION_ASSERTIONS: this.generateContextIntegrationAssertions(config.hookConfig?.contextIntegration),
    });

    return testCode;
  }

  /**
   * 生成视觉回归测试文件
   */
  async generateVisualTest(config: ComponentConfig): Promise<string> {
    const template = await this.loadTemplate('visual.test.template.ts');
    const testCode = this.processTemplate(template, {
      COMPONENT_NAME: config.name,
      COMPONENT_PATH: config.visualConfig?.path || `/components/${this.toKebabCase(config.name)}`,
      COMPONENT_NAME_KEBAB: this.toKebabCase(config.name),
      VARIANT_TESTS: this.generateVariantTests(config.visualConfig?.variants),
    });

    return testCode;
  }

  /**
   * 生成可访问性测试文件
   */
  async generateAccessibilityTest(config: ComponentConfig): Promise<string> {
    const template = await this.loadTemplate('accessibility.test.template.tsx');
    const testCode = this.processTemplate(template, {
      COMPONENT_NAME: config.name,
      COMPONENT_PATH: config.path,
      COMPONENT_NAME_KEBAB: this.toKebabCase(config.name),
      DEFAULT_PROPS: this.formatProps(config.defaultProps),
      COMPONENT_ROLE: config.accessibilityConfig?.role || 'button',
      EXPECTED_ROLE: config.accessibilityConfig?.expectedRole || config.accessibilityConfig?.role || 'button',
      ADDITIONAL_ROLE_ASSERTIONS: this.generateAdditionalRoleAssertions(config.accessibilityConfig?.additionalRoles),
      ARIA_STATE_TESTS: this.generateAriaStateTests(config.accessibilityConfig?.ariaStates),
      LIVE_REGION_TESTS: this.generateLiveRegionTests(config.accessibilityConfig?.liveRegions),
      STATE_CHANGE_PROPS: this.formatProps(config.accessibilityConfig?.stateChangeProps),
      EXPECTED_ANNOUNCEMENT: config.accessibilityConfig?.expectedAnnouncement || 'State changed',
      CONTEXT_TESTS: this.generateContextTests(config.accessibilityConfig?.contextTests),
      SEMANTIC_ELEMENT_TESTS: this.generateSemanticElementTests(config.accessibilityConfig?.semanticElements),
      LANDMARK_TESTS: this.generateLandmarkTests(config.accessibilityConfig?.landmarks),
      RTL_TESTS: this.generateRTLTests(config.accessibilityConfig?.rtlSupport),
    });

    return testCode;
  }

  /**
   * 批量生成测试文件
   */
  async generateAllTests(config: ComponentConfig, outputDir: string): Promise<void> {
    const tests = [
      { type: 'component', generator: () => this.generateComponentTest(config) },
      { type: 'accessibility', generator: () => this.generateAccessibilityTest(config) },
      { type: 'visual', generator: () => this.generateVisualTest(config) },
    ];

    if (config.type === 'page') {
      tests.push({ type: 'page', generator: () => this.generatePageTest(config) });
    }

    if (config.type === 'hook') {
      tests.push({ type: 'hook', generator: () => this.generateHookTest(config) });
    }

    for (const test of tests) {
      const testCode = await test.generator();
      const fileName = `${this.toKebabCase(config.name)}.${test.type}.test.tsx`;
      const filePath = join(outputDir, fileName);
      
      // 确保目录存在
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      
      writeFileSync(filePath, testCode, 'utf-8');
    }
  }

  /**
   * 加载模板文件
   */
  private async loadTemplate(templateName: string): Promise<string> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    const templatePath = join(this.templatesDir, templateName);
    const template = readFileSync(templatePath, 'utf-8');
    this.templateCache.set(templateName, template);
    
    return template;
  }

  /**
   * 处理模板变量替换
   */
  private processTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    }
    
    return result;
  }

  /**
   * 格式化属性对象为字符串
   */
  private formatProps(props: any): string {
    if (!props) return '{}';
    if (typeof props === 'string') return props;
    return JSON.stringify(props, null, 2);
  }

  /**
   * 转换为 kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  // 以下是各种测试代码生成方法的实现
  private generatePropsAssertions(props: any): string {
    if (!props) return '';
    
    const assertions = Object.entries(props).map(([key, value]) => {
      if (typeof value === 'string') {
        return `expect(screen.getByTestId('component')).toHaveTextContent('${value}');`;
      } else if (typeof value === 'boolean') {
        return `expect(screen.getByTestId('component')).toHaveAttribute('data-${key}', '${value}');`;
      }
      return `// Assert ${key}: ${JSON.stringify(value)}`;
    });
    
    return assertions.join('\n      ');
  }

  private generateInteractionTests(interactions: any[]): string {
    if (!interactions?.length) return '// No interaction tests defined';
    
    return interactions.map(interaction => `
    it('should handle ${interaction.name}', async () => {
      const handler = vi.fn();
      
      render(
        <TestWrapper>
          <{{COMPONENT_NAME}} {{DEFAULT_PROPS}} ${interaction.prop}={handler} />
        </TestWrapper>
      );
      
      const element = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      await user.${interaction.action}(element);
      
      expect(handler).toHaveBeenCalled();
    });`).join('\n');
  }

  private generateStateTests(stateTests: any[]): string {
    if (!stateTests?.length) return '// No state tests defined';
    
    return stateTests.map(test => `
    it('should manage ${test.name} state correctly', () => {
      const { result } = renderHook(() => useState(${test.initialValue}));
      
      act(() => {
        result.current[1](${test.newValue});
      });
      
      expect(result.current[0]).toBe(${test.newValue});
    });`).join('\n');
  }

  private generateKeyboardAssertions(keyboardBehavior: any): string {
    if (!keyboardBehavior) return '// No keyboard behavior defined';
    
    return `
      // Test keyboard behavior
      expect(element).toHaveAttribute('tabindex', '0');
      expect(element).toHaveAttribute('role', '${keyboardBehavior.role || 'button'}');
    `;
  }

  private generateAriaAssertions(ariaAttributes: any): string {
    if (!ariaAttributes) return '// No ARIA attributes defined';
    
    const assertions = Object.entries(ariaAttributes).map(([key, value]) => 
      `expect(element).toHaveAttribute('aria-${key}', '${value}');`
    );
    
    return assertions.join('\n      ');
  }

  private generateResponsiveAssertions(responsive: any): string {
    if (!responsive) return '// No responsive behavior defined';
    
    return `
      const element = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      expect(element).toHaveClass('${responsive.className || 'responsive'}');
    `;
  }

  private generateThemeAssertions(theme: any): string {
    if (!theme) return '// No theme assertions defined';
    
    return `
      const element = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      expect(element).toHaveClass('${theme.className || 'theme-default'}');
    `;
  }

  // 更多生成方法的占位符实现
  private generateApiMocks(apiMocks: any): string {
    return apiMocks ? JSON.stringify(apiMocks, null, 2) : '// No API mocks defined';
  }

  private generateSectionAssertions(sections: any[]): string {
    if (!sections?.length) return '// No sections defined';
    
    return sections.map(section => 
      `expect(screen.getByTestId('${section.testId}')).toBeInTheDocument();`
    ).join('\n        ');
  }

  private generateDataAssertions(assertions: any[]): string {
    if (!assertions?.length) return '// No data assertions defined';
    
    return assertions.map(assertion => 
      `expect(screen.getByText('${assertion.text}')).toBeInTheDocument();`
    ).join('\n        ');
  }

  private generateApiErrorMock(apiModule: string): string {
    return `vi.mocked(${apiModule}).mockRejectedValue(new Error('API Error'));`;
  }

  private generateEmptyDataMock(apiModule: string): string {
    return `vi.mocked(${apiModule}).mockResolvedValue([]);`;
  }

  // 其他生成方法的简化实现
  private generatePageInteractionTests(interactions: any): string { return '// Page interaction tests'; }
  private generateFormTests(forms: any): string { return '// Form tests'; }
  private generateNavigationTests(navigation: any): string { return '// Navigation tests'; }
  private generateHeadingHierarchyAssertions(headings: any): string { return '// Heading hierarchy assertions'; }
  private generateKeyboardNavigationTests(keyboardNav: any): string { return '// Keyboard navigation tests'; }
  private generateFocusManagementTests(focusManagement: any): string { return '// Focus management tests'; }
  private generateResponsiveTests(responsive: any): string { return '// Responsive tests'; }
  private generateCleanupAssertions(cleanup: any): string { return '// Cleanup assertions'; }
  private generateStateUpdateTests(stateUpdates: any): string { return '// State update tests'; }
  private generateSideEffectTests(sideEffects: any): string { return '// Side effect tests'; }
  private generateAsyncAction(action: any): string { return 'result.current.asyncAction();'; }
  private generateAsyncResultAssertions(action: any): string { return 'expect(result.current.data).toBeDefined();'; }
  private generateAsyncErrorMock(action: any): string { return 'vi.fn().mockRejectedValue(new Error("Async error"));'; }
  private generateAsyncErrorAction(action: any): string { return 'result.current.asyncErrorAction();'; }
  private generateConcurrentAsyncActions(actions: any): string { return '// Concurrent async actions'; }
  private generateConcurrentResultAssertions(actions: any): string { return '// Concurrent result assertions'; }
  private generateStartAsyncOperation(action: any): string { return 'result.current.startOperation();'; }
  private generateCancellationAssertions(action: any): string { return '// Cancellation assertions'; }
  private generateDependencyUpdateAssertions(deps: any): string { return '// Dependency update assertions'; }
  private generateTriggerError(errorHandling: any): string { return 'result.current.triggerError();'; }
  private generateRecoveryAction(errorHandling: any): string { return 'result.current.recover();'; }
  private generateEdgeCaseTests(edgeCases: any): string { return '// Edge case tests'; }
  private generateIntegrationAssertions(hooks: any): string { return '// Integration assertions'; }
  private generateContextIntegrationAssertions(context: any): string { return '// Context integration assertions'; }
  private generateVariantTests(variants: any): string { return '// Variant tests'; }
  private generateAdditionalRoleAssertions(roles: any): string { return '// Additional role assertions'; }
  private generateAriaStateTests(states: any): string { return '// ARIA state tests'; }
  private generateLiveRegionTests(regions: any): string { return '// Live region tests'; }
  private generateContextTests(tests: any): string { return '// Context tests'; }
  private generateSemanticElementTests(elements: any): string { return '// Semantic element tests'; }
  private generateLandmarkTests(landmarks: any): string { return '// Landmark tests'; }
  private generateRTLTests(rtl: any): string { return '// RTL tests'; }
}

export default TestGenerator;