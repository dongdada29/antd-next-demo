/**
 * Comprehensive Validation Test Suite
 * Tests functionality, performance, accessibility, and AI code quality
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { performance } from 'perf_hooks';
import { AICodeQualityValidator } from '../lib/ai-code-quality-validator';
import { PerformanceAnalyzer } from '../lib/performance-analyzer';
import { AccessibilityTester } from './utils/accessibility-tester';
import { ComponentRegistry } from '../lib/ai-component-registry';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Comprehensive Validation Suite', () => {
  let performanceAnalyzer: PerformanceAnalyzer;
  let codeQualityValidator: AICodeQualityValidator;
  let accessibilityTester: AccessibilityTester;

  beforeAll(async () => {
    performanceAnalyzer = new PerformanceAnalyzer();
    codeQualityValidator = new AICodeQualityValidator();
    accessibilityTester = new AccessibilityTester();
  });

  describe('Functional Testing', () => {
    it('should validate all UI components functionality', async () => {
      const components = ComponentRegistry.getAllComponents();
      
      for (const component of components) {
        const { container } = render(component.render());
        
        // Test basic rendering
        expect(container.firstChild).toBeTruthy();
        
        // Test component props
        if (component.props) {
          for (const prop of component.props) {
            if (prop.required) {
              expect(() => component.render({ [prop.name]: undefined }))
                .toThrow();
            }
          }
        }
        
        // Test component variants
        if (component.variants) {
          for (const variant of component.variants) {
            const variantComponent = component.render({ variant: variant.name });
            expect(variantComponent).toBeTruthy();
          }
        }
      }
    });

    it('should validate form components with validation', async () => {
      // Test form validation, submission, error handling
      const formComponents = ComponentRegistry.getComponentsByType('form');
      
      for (const formComponent of formComponents) {
        const { container } = render(formComponent.render());
        
        // Test form validation
        const form = container.querySelector('form');
        if (form) {
          // Test required field validation
          const requiredInputs = form.querySelectorAll('[required]');
          expect(requiredInputs.length).toBeGreaterThan(0);
          
          // Test form submission
          const submitButton = form.querySelector('[type="submit"]');
          if (submitButton) {
            expect(submitButton).toBeTruthy();
          }
        }
      }
    });

    it('should validate data table components', async () => {
      const tableComponents = ComponentRegistry.getComponentsByType('table');
      
      for (const tableComponent of tableComponents) {
        const { container } = render(tableComponent.render({
          data: [
            { id: 1, name: 'Test 1', status: 'active' },
            { id: 2, name: 'Test 2', status: 'inactive' }
          ]
        }));
        
        // Test table structure
        const table = container.querySelector('table');
        expect(table).toBeTruthy();
        
        // Test table headers
        const headers = table?.querySelectorAll('th');
        expect(headers?.length).toBeGreaterThan(0);
        
        // Test table rows
        const rows = table?.querySelectorAll('tbody tr');
        expect(rows?.length).toBe(2);
      }
    });
  });

  describe('Performance Testing', () => {
    it('should meet performance benchmarks', async () => {
      const startTime = performance.now();
      
      // Test component rendering performance
      const components = ComponentRegistry.getAllComponents();
      const renderTimes: number[] = [];
      
      for (const component of components) {
        const componentStartTime = performance.now();
        render(component.render());
        const componentEndTime = performance.now();
        
        const renderTime = componentEndTime - componentStartTime;
        renderTimes.push(renderTime);
        
        // Each component should render within 16ms (60fps)
        expect(renderTime).toBeLessThan(16);
      }
      
      const totalTime = performance.now() - startTime;
      const averageRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      
      console.log(`Total render time: ${totalTime}ms`);
      console.log(`Average component render time: ${averageRenderTime}ms`);
      
      // Total rendering should be efficient
      expect(totalTime).toBeLessThan(1000); // 1 second max
      expect(averageRenderTime).toBeLessThan(10); // 10ms average
    });

    it('should validate bundle size optimization', async () => {
      const bundleAnalysis = await performanceAnalyzer.analyzeBundleSize();
      
      // CSS bundle should be optimized
      expect(bundleAnalysis.css.size).toBeLessThan(bundleAnalysis.css.originalSize * 0.7);
      
      // JavaScript bundle should be tree-shaken
      expect(bundleAnalysis.js.unusedExports).toBe(0);
      
      // Total bundle size should meet targets
      expect(bundleAnalysis.total.gzipped).toBeLessThan(500 * 1024); // 500KB gzipped
    });

    it('should validate memory usage', async () => {
      const memoryBefore = process.memoryUsage();
      
      // Render multiple components
      const components = ComponentRegistry.getAllComponents();
      const renderedComponents = components.map(component => render(component.render()));
      
      const memoryAfter = process.memoryUsage();
      const memoryIncrease = memoryAfter.heapUsed - memoryBefore.heapUsed;
      
      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB max
      
      // Cleanup
      renderedComponents.forEach(({ unmount }) => unmount());
    });
  });

  describe('Accessibility Testing', () => {
    it('should pass WCAG 2.1 AA compliance', async () => {
      const components = ComponentRegistry.getAllComponents();
      
      for (const component of components) {
        const { container } = render(component.render());
        
        // Run axe accessibility tests
        const results = await axe(container);
        expect(results).toHaveNoViolations();
        
        // Test keyboard navigation
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
          expect(element.getAttribute('tabindex')).not.toBe('-1');
        });
        
        // Test ARIA labels
        const interactiveElements = container.querySelectorAll('button, input, select, textarea');
        interactiveElements.forEach(element => {
          const hasLabel = element.getAttribute('aria-label') || 
                          element.getAttribute('aria-labelledby') ||
                          container.querySelector(`label[for="${element.id}"]`);
          expect(hasLabel).toBeTruthy();
        });
      }
    });

    it('should support high contrast mode', async () => {
      const components = ComponentRegistry.getAllComponents();
      
      for (const component of components) {
        const { container } = render(component.render());
        
        // Test color contrast
        const coloredElements = container.querySelectorAll('[class*="text-"], [class*="bg-"]');
        
        for (const element of coloredElements) {
          const styles = window.getComputedStyle(element);
          const contrast = await accessibilityTester.calculateColorContrast(
            styles.color,
            styles.backgroundColor
          );
          
          // WCAG AA requires 4.5:1 contrast ratio
          expect(contrast).toBeGreaterThanOrEqual(4.5);
        }
      }
    });

    it('should support screen readers', async () => {
      const components = ComponentRegistry.getAllComponents();
      
      for (const component of components) {
        const { container } = render(component.render());
        
        // Test semantic HTML
        const semanticElements = container.querySelectorAll(
          'main, section, article, aside, nav, header, footer, h1, h2, h3, h4, h5, h6'
        );
        
        if (semanticElements.length > 0) {
          semanticElements.forEach(element => {
            expect(element.tagName).toMatch(/^(MAIN|SECTION|ARTICLE|ASIDE|NAV|HEADER|FOOTER|H[1-6])$/);
          });
        }
        
        // Test ARIA roles
        const elementsWithRoles = container.querySelectorAll('[role]');
        elementsWithRoles.forEach(element => {
          const role = element.getAttribute('role');
          expect(role).toBeTruthy();
          expect(role).toMatch(/^(button|link|textbox|combobox|listbox|option|tab|tabpanel|dialog|alert|status|region)$/);
        });
      }
    });
  });

  describe('AI Code Quality Validation', () => {
    it('should validate AI-generated component quality', async () => {
      const aiGeneratedComponents = ComponentRegistry.getAIGeneratedComponents();
      
      for (const component of aiGeneratedComponents) {
        const qualityReport = await codeQualityValidator.validateComponent(component);
        
        // Code quality metrics
        expect(qualityReport.typeScript.coverage).toBeGreaterThan(0.9); // 90% type coverage
        expect(qualityReport.complexity.cyclomatic).toBeLessThan(10); // Low complexity
        expect(qualityReport.maintainability.index).toBeGreaterThan(70); // Good maintainability
        
        // Best practices
        expect(qualityReport.bestPractices.usesHooks).toBe(true);
        expect(qualityReport.bestPractices.hasProperTypes).toBe(true);
        expect(qualityReport.bestPractices.followsNamingConventions).toBe(true);
        
        // Performance
        expect(qualityReport.performance.hasUnnecessaryRerenders).toBe(false);
        expect(qualityReport.performance.usesMemoization).toBe(true);
        
        // Accessibility
        expect(qualityReport.accessibility.hasAriaLabels).toBe(true);
        expect(qualityReport.accessibility.hasSemanticHtml).toBe(true);
        expect(qualityReport.accessibility.supportsKeyboard).toBe(true);
      }
    });

    it('should validate AI prompt consistency', async () => {
      const promptResults = await codeQualityValidator.validatePromptConsistency();
      
      // Prompt quality metrics
      expect(promptResults.consistency.score).toBeGreaterThan(0.8); // 80% consistency
      expect(promptResults.coverage.components).toBe(1.0); // 100% component coverage
      expect(promptResults.coverage.patterns).toBeGreaterThan(0.9); // 90% pattern coverage
      
      // Output quality
      expect(promptResults.output.averageQuality).toBeGreaterThan(0.85); // 85% quality
      expect(promptResults.output.errorRate).toBeLessThan(0.05); // <5% error rate
    });

    it('should validate code generation consistency', async () => {
      const testPrompts = [
        'Create a button component with primary and secondary variants',
        'Create a form with validation using React Hook Form',
        'Create a data table with sorting and filtering'
      ];
      
      const generationResults = [];
      
      for (const prompt of testPrompts) {
        const result = await codeQualityValidator.testCodeGeneration(prompt);
        generationResults.push(result);
        
        // Each generation should be successful
        expect(result.success).toBe(true);
        expect(result.code).toBeTruthy();
        expect(result.quality.score).toBeGreaterThan(0.8);
      }
      
      // Consistency across generations
      const consistencyScore = codeQualityValidator.calculateConsistency(generationResults);
      expect(consistencyScore).toBeGreaterThan(0.85);
    });
  });

  describe('User Experience Validation', () => {
    it('should validate component usability', async () => {
      const components = ComponentRegistry.getAllComponents();
      
      for (const component of components) {
        const { container } = render(component.render());
        
        // Test visual feedback
        const interactiveElements = container.querySelectorAll('button, input, select, textarea, [role="button"]');
        
        interactiveElements.forEach(element => {
          // Should have hover states
          expect(element.className).toMatch(/hover:/);
          
          // Should have focus states
          expect(element.className).toMatch(/focus:/);
          
          // Should have disabled states if applicable
          if (element.hasAttribute('disabled')) {
            expect(element.className).toMatch(/disabled:/);
          }
        });
        
        // Test loading states
        const loadingElements = container.querySelectorAll('[data-loading="true"]');
        loadingElements.forEach(element => {
          expect(element.getAttribute('aria-busy')).toBe('true');
        });
      }
    });

    it('should validate responsive design', async () => {
      const components = ComponentRegistry.getAllComponents();
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];
      
      for (const component of components) {
        for (const viewport of viewports) {
          // Mock viewport
          Object.defineProperty(window, 'innerWidth', { value: viewport.width });
          Object.defineProperty(window, 'innerHeight', { value: viewport.height });
          
          const { container } = render(component.render());
          
          // Component should render without overflow
          const element = container.firstChild as HTMLElement;
          if (element) {
            const rect = element.getBoundingClientRect();
            expect(rect.width).toBeLessThanOrEqual(viewport.width);
          }
        }
      }
    });
  });

  describe('Developer Experience Validation', () => {
    it('should validate TypeScript integration', async () => {
      const components = ComponentRegistry.getAllComponents();
      
      for (const component of components) {
        // Should have proper TypeScript definitions
        expect(component.types).toBeTruthy();
        expect(component.types.props).toBeTruthy();
        
        // Should have JSDoc comments
        expect(component.documentation).toBeTruthy();
        expect(component.documentation.description).toBeTruthy();
        
        // Should have examples
        expect(component.examples).toBeTruthy();
        expect(component.examples.length).toBeGreaterThan(0);
      }
    });

    it('should validate development tools integration', async () => {
      // Test ESLint configuration
      const eslintConfig = await import('../../eslint.config.mjs');
      expect(eslintConfig.default).toBeTruthy();
      
      // Test Prettier configuration
      const prettierConfig = await import('../../.prettierrc');
      expect(prettierConfig).toBeTruthy();
      
      // Test TypeScript configuration
      const tsConfig = await import('../../tsconfig.json');
      expect(tsConfig.compilerOptions.strict).toBe(true);
    });
  });

  afterAll(async () => {
    // Generate comprehensive test report
    const report = {
      timestamp: new Date().toISOString(),
      performance: await performanceAnalyzer.generateReport(),
      accessibility: await accessibilityTester.generateReport(),
      codeQuality: await codeQualityValidator.generateReport(),
      summary: {
        totalTests: expect.getState().testPath ? 1 : 0,
        passedTests: 0,
        failedTests: 0,
        coverage: {
          components: ComponentRegistry.getAllComponents().length,
          functions: 0,
          lines: 0
        }
      }
    };
    
    console.log('Comprehensive Validation Report:', JSON.stringify(report, null, 2));
  });
});