/**
 * Accessibility Testing Utilities
 * Provides comprehensive accessibility testing capabilities
 */

export class AccessibilityTester {
  private violations: any[] = [];
  private testResults: any[] = [];

  /**
   * Calculate color contrast ratio between foreground and background colors
   */
  async calculateColorContrast(foreground: string, background: string): Promise<number> {
    const getLuminance = (color: string): number => {
      // Convert color to RGB values
      const rgb = this.parseColor(color);
      if (!rgb) return 0;

      // Calculate relative luminance
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): [number, number, number] | null {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16)
        ];
      } else if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      }
    }

    // Handle rgb/rgba colors
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return [
        parseInt(rgbMatch[1]),
        parseInt(rgbMatch[2]),
        parseInt(rgbMatch[3])
      ];
    }

    // Handle named colors (basic set)
    const namedColors: Record<string, [number, number, number]> = {
      black: [0, 0, 0],
      white: [255, 255, 255],
      red: [255, 0, 0],
      green: [0, 128, 0],
      blue: [0, 0, 255],
      yellow: [255, 255, 0],
      cyan: [0, 255, 255],
      magenta: [255, 0, 255],
      gray: [128, 128, 128],
      grey: [128, 128, 128]
    };

    return namedColors[color.toLowerCase()] || null;
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(container: HTMLElement): Promise<boolean> {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    let canNavigate = true;

    // Test tab navigation
    for (let i = 0; i < focusableElements.length; i++) {
      const element = focusableElements[i] as HTMLElement;
      
      try {
        element.focus();
        if (document.activeElement !== element) {
          canNavigate = false;
          this.violations.push({
            type: 'keyboard-navigation',
            element: element.tagName,
            message: 'Element cannot receive keyboard focus'
          });
        }
      } catch (error) {
        canNavigate = false;
        this.violations.push({
          type: 'keyboard-navigation',
          element: element.tagName,
          message: 'Error focusing element',
          error
        });
      }
    }

    return canNavigate;
  }

  /**
   * Test screen reader compatibility
   */
  async testScreenReaderCompatibility(container: HTMLElement): Promise<boolean> {
    let isCompatible = true;

    // Check for semantic HTML
    const semanticElements = container.querySelectorAll(
      'main, section, article, aside, nav, header, footer, h1, h2, h3, h4, h5, h6'
    );

    // Check for proper heading hierarchy
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        isCompatible = false;
        this.violations.push({
          type: 'heading-hierarchy',
          element: heading.tagName,
          message: 'Heading levels should not skip levels'
        });
      }
      previousLevel = level;
    });

    // Check for ARIA labels on interactive elements
    const interactiveElements = container.querySelectorAll(
      'button, input, select, textarea, [role="button"], [role="link"]'
    );

    interactiveElements.forEach(element => {
      const hasLabel = element.getAttribute('aria-label') ||
                      element.getAttribute('aria-labelledby') ||
                      container.querySelector(`label[for="${element.id}"]`);

      if (!hasLabel) {
        isCompatible = false;
        this.violations.push({
          type: 'missing-label',
          element: element.tagName,
          message: 'Interactive element missing accessible label'
        });
      }
    });

    // Check for alt text on images
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      if (!img.getAttribute('alt')) {
        isCompatible = false;
        this.violations.push({
          type: 'missing-alt-text',
          element: 'IMG',
          message: 'Image missing alt text'
        });
      }
    });

    return isCompatible;
  }

  /**
   * Test ARIA implementation
   */
  async testARIAImplementation(container: HTMLElement): Promise<boolean> {
    let isValid = true;

    // Check for proper ARIA roles
    const elementsWithRoles = container.querySelectorAll('[role]');
    const validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
      'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
      'contentinfo', 'definition', 'dialog', 'directory', 'document',
      'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
      'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
      'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
      'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
      'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
      'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
      'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
      'tooltip', 'tree', 'treegrid', 'treeitem'
    ];

    elementsWithRoles.forEach(element => {
      const role = element.getAttribute('role');
      if (role && !validRoles.includes(role)) {
        isValid = false;
        this.violations.push({
          type: 'invalid-aria-role',
          element: element.tagName,
          role,
          message: `Invalid ARIA role: ${role}`
        });
      }
    });

    // Check for required ARIA properties
    const elementsWithAriaExpanded = container.querySelectorAll('[aria-expanded]');
    elementsWithAriaExpanded.forEach(element => {
      const expanded = element.getAttribute('aria-expanded');
      if (expanded !== 'true' && expanded !== 'false') {
        isValid = false;
        this.violations.push({
          type: 'invalid-aria-expanded',
          element: element.tagName,
          message: 'aria-expanded must be "true" or "false"'
        });
      }
    });

    return isValid;
  }

  /**
   * Test color accessibility
   */
  async testColorAccessibility(container: HTMLElement): Promise<boolean> {
    let isAccessible = true;

    // Get all elements with color styling
    const coloredElements = container.querySelectorAll('[class*="text-"], [class*="bg-"]');

    for (const element of coloredElements) {
      const styles = window.getComputedStyle(element);
      const textColor = styles.color;
      const backgroundColor = styles.backgroundColor;

      if (textColor && backgroundColor) {
        const contrast = await this.calculateColorContrast(textColor, backgroundColor);
        
        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
        
        const requiredContrast = isLargeText ? 3 : 4.5;
        
        if (contrast < requiredContrast) {
          isAccessible = false;
          this.violations.push({
            type: 'color-contrast',
            element: element.tagName,
            contrast: contrast.toFixed(2),
            required: requiredContrast,
            message: `Insufficient color contrast: ${contrast.toFixed(2)}:1 (required: ${requiredContrast}:1)`
          });
        }
      }
    }

    return isAccessible;
  }

  /**
   * Generate comprehensive accessibility report
   */
  async generateReport(): Promise<any> {
    return {
      timestamp: new Date().toISOString(),
      violations: this.violations,
      testResults: this.testResults,
      summary: {
        totalViolations: this.violations.length,
        violationsByType: this.violations.reduce((acc, violation) => {
          acc[violation.type] = (acc[violation.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        overallScore: Math.max(0, 100 - (this.violations.length * 5)) // Deduct 5 points per violation
      },
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Generate accessibility improvement recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const violationTypes = new Set(this.violations.map(v => v.type));

    if (violationTypes.has('color-contrast')) {
      recommendations.push('Improve color contrast ratios to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)');
    }

    if (violationTypes.has('missing-label')) {
      recommendations.push('Add accessible labels to all interactive elements using aria-label, aria-labelledby, or associated label elements');
    }

    if (violationTypes.has('keyboard-navigation')) {
      recommendations.push('Ensure all interactive elements are keyboard accessible and have proper focus management');
    }

    if (violationTypes.has('heading-hierarchy')) {
      recommendations.push('Maintain proper heading hierarchy (h1 → h2 → h3, etc.) for screen reader navigation');
    }

    if (violationTypes.has('missing-alt-text')) {
      recommendations.push('Add descriptive alt text to all images, or use alt="" for decorative images');
    }

    if (violationTypes.has('invalid-aria-role')) {
      recommendations.push('Use only valid ARIA roles and ensure they are appropriate for the element context');
    }

    return recommendations;
  }

  /**
   * Clear violations and test results
   */
  reset(): void {
    this.violations = [];
    this.testResults = [];
  }
}