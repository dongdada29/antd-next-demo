/**
 * Template Engine
 * 
 * Advanced template parsing and variable replacement engine
 * for AI code generation with support for complex transformations.
 */

export interface TemplateVariable {
  name: string;
  type: 'string' | 'boolean' | 'array' | 'object' | 'function';
  description: string;
  required: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
  transform?: (value: any) => any;
}

export interface ValidationRule {
  type: 'regex' | 'length' | 'range' | 'custom';
  value: any;
  message: string;
}

export interface TemplateContext {
  variables: Record<string, any>;
  helpers: Record<string, Function>;
  partials: Record<string, string>;
}

export interface ParsedTemplate {
  content: string;
  variables: TemplateVariable[];
  dependencies: string[];
  metadata: TemplateMetadata;
}

export interface TemplateMetadata {
  version: string;
  author: string;
  description: string;
  tags: string[];
  complexity: 'simple' | 'intermediate' | 'advanced';
  estimatedLines: number;
}

/**
 * Template Engine Class
 */
export class TemplateEngine {
  private helpers: Map<string, Function> = new Map();
  private partials: Map<string, string> = new Map();

  constructor() {
    this.registerDefaultHelpers();
  }

  /**
   * Parse template and extract variables
   */
  parseTemplate(template: string): ParsedTemplate {
    const variables = this.extractVariables(template);
    const dependencies = this.extractDependencies(template);
    const metadata = this.extractMetadata(template);

    return {
      content: template,
      variables,
      dependencies,
      metadata
    };
  }

  /**
   * Render template with context
   */
  render(template: string, context: TemplateContext): string {
    let rendered = template;

    // Process partials first
    rendered = this.processPartials(rendered, context.partials);

    // Process helpers
    rendered = this.processHelpers(rendered, context.helpers);

    // Process variables
    rendered = this.processVariables(rendered, context.variables);

    // Clean up any remaining placeholders
    rendered = this.cleanupTemplate(rendered);

    return rendered;
  }

  /**
   * Validate template context
   */
  validateContext(template: ParsedTemplate, context: TemplateContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    template.variables.forEach(variable => {
      if (variable.required && !(variable.name in context.variables)) {
        errors.push(`Required variable '${variable.name}' is missing`);
      }

      // Validate variable values
      if (variable.name in context.variables) {
        const value = context.variables[variable.name];
        const validationResult = this.validateVariable(variable, value);
        
        if (!validationResult.valid) {
          errors.push(...validationResult.errors);
        }
        warnings.push(...validationResult.warnings);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Register custom helper function
   */
  registerHelper(name: string, fn: Function): void {
    this.helpers.set(name, fn);
  }

  /**
   * Register partial template
   */
  registerPartial(name: string, template: string): void {
    this.partials.set(name, template);
  }

  /**
   * Extract variables from template
   */
  private extractVariables(template: string): TemplateVariable[] {
    const variables: TemplateVariable[] = [];
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = template.matchAll(variableRegex);

    const seen = new Set<string>();

    for (const match of matches) {
      const variableExpression = match[1].trim();
      const variableName = this.parseVariableName(variableExpression);

      if (!seen.has(variableName)) {
        seen.add(variableName);
        variables.push(this.createVariableDefinition(variableName, variableExpression));
      }
    }

    return variables;
  }

  /**
   * Extract dependencies from template
   */
  private extractDependencies(template: string): string[] {
    const dependencies: string[] = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const matches = template.matchAll(importRegex);

    for (const match of matches) {
      const dependency = match[1];
      if (!dependency.startsWith('.') && !dependency.startsWith('/')) {
        dependencies.push(dependency);
      }
    }

    return [...new Set(dependencies)];
  }

  /**
   * Extract metadata from template comments
   */
  private extractMetadata(template: string): TemplateMetadata {
    const metadataRegex = /\/\*\*\s*\n([\s\S]*?)\*\//;
    const match = template.match(metadataRegex);

    const defaultMetadata: TemplateMetadata = {
      version: '1.0.0',
      author: 'AI Template Engine',
      description: 'Generated template',
      tags: [],
      complexity: 'intermediate',
      estimatedLines: template.split('\n').length
    };

    if (!match) return defaultMetadata;

    const comment = match[1];
    const lines = comment.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim());

    const metadata = { ...defaultMetadata };

    lines.forEach(line => {
      if (line.startsWith('@version')) {
        metadata.version = line.replace('@version', '').trim();
      } else if (line.startsWith('@author')) {
        metadata.author = line.replace('@author', '').trim();
      } else if (line.startsWith('@description')) {
        metadata.description = line.replace('@description', '').trim();
      } else if (line.startsWith('@tags')) {
        metadata.tags = line.replace('@tags', '').trim().split(',').map(t => t.trim());
      } else if (line.startsWith('@complexity')) {
        metadata.complexity = line.replace('@complexity', '').trim() as any;
      }
    });

    return metadata;
  }

  /**
   * Process partials in template
   */
  private processPartials(template: string, partials: Record<string, string>): string {
    const partialRegex = /\{\{>\s*([^}]+)\s*\}\}/g;
    
    return template.replace(partialRegex, (match, partialName) => {
      const name = partialName.trim();
      return partials[name] || this.partials.get(name) || match;
    });
  }

  /**
   * Process helper functions in template
   */
  private processHelpers(template: string, helpers: Record<string, Function>): string {
    const helperRegex = /\{\{#([^}]+)\}\}/g;
    
    return template.replace(helperRegex, (match, helperExpression) => {
      const [helperName, ...args] = helperExpression.trim().split(/\s+/);
      const helper = helpers[helperName] || this.helpers.get(helperName);
      
      if (helper) {
        try {
          return helper(...args);
        } catch (error) {
          console.warn(`Helper '${helperName}' failed:`, error);
          return match;
        }
      }
      
      return match;
    });
  }

  /**
   * Process variables in template
   */
  private processVariables(template: string, variables: Record<string, any>): string {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    
    return template.replace(variableRegex, (match, variableExpression) => {
      const expression = variableExpression.trim();
      
      // Handle simple variables
      if (variables.hasOwnProperty(expression)) {
        return this.formatValue(variables[expression]);
      }
      
      // Handle dot notation
      if (expression.includes('.')) {
        const value = this.resolveNestedProperty(variables, expression);
        if (value !== undefined) {
          return this.formatValue(value);
        }
      }
      
      // Handle array access
      if (expression.includes('[') && expression.includes(']')) {
        const value = this.resolveArrayAccess(variables, expression);
        if (value !== undefined) {
          return this.formatValue(value);
        }
      }
      
      // Handle conditional expressions
      if (expression.includes('?') && expression.includes(':')) {
        return this.resolveConditional(variables, expression);
      }
      
      return match;
    });
  }

  /**
   * Clean up remaining template artifacts
   */
  private cleanupTemplate(template: string): string {
    // Remove empty lines created by template processing
    return template
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^\s*\n/, '')
      .replace(/\n\s*$/, '\n');
  }

  /**
   * Parse variable name from expression
   */
  private parseVariableName(expression: string): string {
    // Extract base variable name (before dots, brackets, etc.)
    return expression.split(/[.\[\?]/)[0].trim();
  }

  /**
   * Create variable definition from name and expression
   */
  private createVariableDefinition(name: string, expression: string): TemplateVariable {
    return {
      name,
      type: this.inferVariableType(expression),
      description: `Template variable: ${name}`,
      required: true,
      defaultValue: this.getDefaultValue(expression)
    };
  }

  /**
   * Infer variable type from expression
   */
  private inferVariableType(expression: string): TemplateVariable['type'] {
    if (expression.includes('[') || expression.includes('map') || expression.includes('forEach')) {
      return 'array';
    }
    if (expression.includes('.') && !expression.includes('?')) {
      return 'object';
    }
    if (expression.includes('?') && expression.includes(':')) {
      return 'boolean';
    }
    if (expression.includes('()')) {
      return 'function';
    }
    return 'string';
  }

  /**
   * Get default value for variable
   */
  private getDefaultValue(expression: string): any {
    const type = this.inferVariableType(expression);
    
    switch (type) {
      case 'boolean': return false;
      case 'array': return [];
      case 'object': return {};
      case 'function': return () => '';
      default: return '';
    }
  }

  /**
   * Validate variable value
   */
  private validateVariable(variable: TemplateVariable, value: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Type validation
    if (!this.isValidType(value, variable.type)) {
      errors.push(`Variable '${variable.name}' expected ${variable.type}, got ${typeof value}`);
    }

    // Custom validation rules
    if (variable.validation) {
      variable.validation.forEach(rule => {
        if (!this.validateRule(value, rule)) {
          errors.push(rule.message);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if value matches expected type
   */
  private isValidType(value: any, expectedType: TemplateVariable['type']): boolean {
    switch (expectedType) {
      case 'string': return typeof value === 'string';
      case 'boolean': return typeof value === 'boolean';
      case 'array': return Array.isArray(value);
      case 'object': return typeof value === 'object' && !Array.isArray(value);
      case 'function': return typeof value === 'function';
      default: return true;
    }
  }

  /**
   * Validate against a rule
   */
  private validateRule(value: any, rule: ValidationRule): boolean {
    switch (rule.type) {
      case 'regex':
        return typeof value === 'string' && rule.value.test(value);
      case 'length':
        return value?.length === rule.value;
      case 'range':
        return value >= rule.value.min && value <= rule.value.max;
      case 'custom':
        return rule.value(value);
      default:
        return true;
    }
  }

  /**
   * Resolve nested property access
   */
  private resolveNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Resolve array access
   */
  private resolveArrayAccess(obj: any, expression: string): any {
    const match = expression.match(/([^[]+)\[([^\]]+)\]/);
    if (!match) return undefined;

    const [, arrayName, indexExpr] = match;
    const array = obj[arrayName];
    
    if (!Array.isArray(array)) return undefined;

    const index = parseInt(indexExpr, 10);
    return isNaN(index) ? undefined : array[index];
  }

  /**
   * Resolve conditional expression
   */
  private resolveConditional(variables: Record<string, any>, expression: string): string {
    const match = expression.match(/([^?]+)\?\s*([^:]+):\s*(.+)/);
    if (!match) return expression;

    const [, condition, trueValue, falseValue] = match;
    const conditionResult = this.evaluateCondition(variables, condition.trim());
    
    return conditionResult ? trueValue.trim() : falseValue.trim();
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(variables: Record<string, any>, condition: string): boolean {
    // Simple boolean evaluation
    if (variables.hasOwnProperty(condition)) {
      return Boolean(variables[condition]);
    }
    
    // Handle comparisons
    const comparisonMatch = condition.match(/([^=!<>]+)\s*([=!<>]+)\s*(.+)/);
    if (comparisonMatch) {
      const [, left, operator, right] = comparisonMatch;
      const leftValue = variables[left.trim()] || left.trim();
      const rightValue = variables[right.trim()] || right.trim();
      
      switch (operator) {
        case '==': return leftValue == rightValue;
        case '===': return leftValue === rightValue;
        case '!=': return leftValue != rightValue;
        case '!==': return leftValue !== rightValue;
        case '>': return leftValue > rightValue;
        case '<': return leftValue < rightValue;
        case '>=': return leftValue >= rightValue;
        case '<=': return leftValue <= rightValue;
        default: return false;
      }
    }
    
    return false;
  }

  /**
   * Format value for output
   */
  private formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  }

  /**
   * Register default helper functions
   */
  private registerDefaultHelpers(): void {
    // String helpers
    this.registerHelper('uppercase', (str: string) => str.toUpperCase());
    this.registerHelper('lowercase', (str: string) => str.toLowerCase());
    this.registerHelper('capitalize', (str: string) => 
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    );
    this.registerHelper('camelCase', (str: string) => 
      str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    );
    this.registerHelper('pascalCase', (str: string) => {
      const camelCase = str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
      return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    });
    this.registerHelper('kebabCase', (str: string) => 
      str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '')
    );

    // Array helpers
    this.registerHelper('join', (arr: any[], separator = ', ') => 
      Array.isArray(arr) ? arr.join(separator) : ''
    );
    this.registerHelper('length', (arr: any[]) => 
      Array.isArray(arr) ? arr.length : 0
    );

    // Conditional helpers
    this.registerHelper('if', (condition: any, trueValue: any, falseValue: any = '') => 
      condition ? trueValue : falseValue
    );
    this.registerHelper('unless', (condition: any, trueValue: any, falseValue: any = '') => 
      !condition ? trueValue : falseValue
    );

    // Code generation helpers
    this.registerHelper('indent', (text: string, spaces = 2) => 
      text.split('\n').map(line => ' '.repeat(spaces) + line).join('\n')
    );
    this.registerHelper('comment', (text: string, style = '//') => 
      `${style} ${text}`
    );
  }
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Export singleton instance
export const templateEngine = new TemplateEngine();