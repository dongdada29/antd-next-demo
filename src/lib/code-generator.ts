/**
 * Code Generator
 * 
 * Advanced code generation system with template processing,
 * formatting, and quality checks for AI-generated components.
 */

import { templateEngine, TemplateContext, ValidationResult } from './template-engine';
import { ComponentTemplate } from '@/types/ai-component';

export interface CodeGenerationRequest {
  template: ComponentTemplate;
  context: TemplateContext;
  options: GenerationOptions;
}

export interface GenerationOptions {
  /** Target TypeScript version */
  typescript?: '4.9' | '5.0' | '5.1' | '5.2';
  /** React version */
  react?: '17' | '18' | '19';
  /** Code formatting style */
  formatting?: FormattingOptions;
  /** Quality checks to perform */
  qualityChecks?: QualityCheckOptions;
  /** Output preferences */
  output?: OutputOptions;
}

export interface FormattingOptions {
  /** Indentation style */
  indent?: 'spaces' | 'tabs';
  /** Number of spaces for indentation */
  indentSize?: number;
  /** Line ending style */
  lineEnding?: 'lf' | 'crlf';
  /** Maximum line length */
  maxLineLength?: number;
  /** Semicolon usage */
  semicolons?: boolean;
  /** Quote style */
  quotes?: 'single' | 'double';
  /** Trailing commas */
  trailingCommas?: 'none' | 'es5' | 'all';
}

export interface QualityCheckOptions {
  /** Check TypeScript types */
  typeChecking?: boolean;
  /** Check accessibility */
  accessibility?: boolean;
  /** Check performance patterns */
  performance?: boolean;
  /** Check security patterns */
  security?: boolean;
  /** Check code complexity */
  complexity?: boolean;
  /** Minimum quality score */
  minQualityScore?: number;
}

export interface OutputOptions {
  /** Include imports */
  includeImports?: boolean;
  /** Include exports */
  includeExports?: boolean;
  /** Include documentation */
  includeDocumentation?: boolean;
  /** Include tests */
  includeTests?: boolean;
  /** File extension */
  fileExtension?: '.tsx' | '.ts' | '.jsx' | '.js';
}

export interface GeneratedCode {
  /** Main component code */
  code: string;
  /** Import statements */
  imports: string[];
  /** Export statements */
  exports: string[];
  /** Type definitions */
  types: string;
  /** Documentation */
  documentation?: string;
  /** Test code */
  tests?: string;
  /** Quality metrics */
  quality: QualityMetrics;
  /** Generation metadata */
  metadata: GenerationMetadata;
}

export interface QualityMetrics {
  /** Overall quality score (0-100) */
  overallScore: number;
  /** Type safety score */
  typeSafety: number;
  /** Accessibility score */
  accessibility: number;
  /** Performance score */
  performance: number;
  /** Maintainability score */
  maintainability: number;
  /** Code complexity */
  complexity: number;
  /** Lines of code */
  linesOfCode: number;
  /** Cyclomatic complexity */
  cyclomaticComplexity: number;
}

export interface GenerationMetadata {
  /** Generation timestamp */
  timestamp: Date;
  /** Template used */
  templateId: string;
  /** Generation time (ms) */
  generationTime: number;
  /** Template engine version */
  engineVersion: string;
  /** Warnings generated */
  warnings: string[];
  /** Errors encountered */
  errors: string[];
}

/**
 * Code Generator Class
 */
export class CodeGenerator {
  private defaultOptions: GenerationOptions = {
    typescript: '5.2',
    react: '18',
    formatting: {
      indent: 'spaces',
      indentSize: 2,
      lineEnding: 'lf',
      maxLineLength: 100,
      semicolons: true,
      quotes: 'single',
      trailingCommas: 'es5'
    },
    qualityChecks: {
      typeChecking: true,
      accessibility: true,
      performance: true,
      security: true,
      complexity: true,
      minQualityScore: 80
    },
    output: {
      includeImports: true,
      includeExports: true,
      includeDocumentation: true,
      includeTests: false,
      fileExtension: '.tsx'
    }
  };

  /**
   * Generate code from template and context
   */
  async generateCode(request: CodeGenerationRequest): Promise<GeneratedCode> {
    const startTime = Date.now();
    const options = this.mergeOptions(request.options);
    
    try {
      // Validate template context
      const parsedTemplate = templateEngine.parseTemplate(request.template.template);
      const validation = templateEngine.validateContext(parsedTemplate, request.context);
      
      if (!validation.valid) {
        throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
      }

      // Generate raw code
      const rawCode = templateEngine.render(request.template.template, request.context);
      
      // Process and format code
      const processedCode = await this.processCode(rawCode, options);
      
      // Extract components
      const components = this.extractCodeComponents(processedCode, options);
      
      // Perform quality checks
      const quality = await this.performQualityChecks(processedCode, options);
      
      // Generate additional content
      const documentation = options.output?.includeDocumentation 
        ? this.generateDocumentation(request, processedCode)
        : undefined;
        
      const tests = options.output?.includeTests 
        ? this.generateTests(request, processedCode)
        : undefined;

      const generationTime = Date.now() - startTime;

      return {
        code: processedCode,
        imports: components.imports,
        exports: components.exports,
        types: components.types,
        documentation,
        tests,
        quality,
        metadata: {
          timestamp: new Date(),
          templateId: request.template.id,
          generationTime,
          engineVersion: '1.0.0',
          warnings: validation.warnings,
          errors: []
        }
      };
    } catch (error) {
      const generationTime = Date.now() - startTime;
      
      return {
        code: '',
        imports: [],
        exports: [],
        types: '',
        quality: this.getDefaultQualityMetrics(),
        metadata: {
          timestamp: new Date(),
          templateId: request.template.id,
          generationTime,
          engineVersion: '1.0.0',
          warnings: [],
          errors: [error instanceof Error ? error.message : String(error)]
        }
      };
    }
  }

  /**
   * Process and format generated code
   */
  private async processCode(code: string, options: GenerationOptions): Promise<string> {
    let processed = code;

    // Apply formatting
    processed = this.formatCode(processed, options.formatting!);
    
    // Optimize imports
    processed = this.optimizeImports(processed);
    
    // Apply code transformations
    processed = this.applyTransformations(processed, options);
    
    return processed;
  }

  /**
   * Format code according to options
   */
  private formatCode(code: string, formatting: FormattingOptions): string {
    let formatted = code;

    // Handle indentation
    if (formatting.indent === 'spaces' && formatting.indentSize) {
      const tabRegex = /^\t+/gm;
      formatted = formatted.replace(tabRegex, (match) => 
        ' '.repeat(match.length * formatting.indentSize!)
      );
    }

    // Handle line endings
    if (formatting.lineEnding === 'crlf') {
      formatted = formatted.replace(/\n/g, '\r\n');
    }

    // Handle quotes
    if (formatting.quotes === 'single') {
      formatted = formatted.replace(/"/g, "'");
    } else if (formatting.quotes === 'double') {
      formatted = formatted.replace(/'/g, '"');
    }

    // Handle semicolons
    if (formatting.semicolons) {
      formatted = this.addSemicolons(formatted);
    } else {
      formatted = this.removeSemicolons(formatted);
    }

    // Handle trailing commas
    formatted = this.handleTrailingCommas(formatted, formatting.trailingCommas!);

    // Handle line length
    if (formatting.maxLineLength) {
      formatted = this.wrapLongLines(formatted, formatting.maxLineLength);
    }

    return formatted;
  }

  /**
   * Optimize import statements
   */
  private optimizeImports(code: string): string {
    const lines = code.split('\n');
    const imports: string[] = [];
    const otherLines: string[] = [];

    // Separate imports from other code
    lines.forEach(line => {
      if (line.trim().startsWith('import ')) {
        imports.push(line);
      } else {
        otherLines.push(line);
      }
    });

    // Sort and deduplicate imports
    const sortedImports = this.sortImports(imports);
    const deduplicatedImports = this.deduplicateImports(sortedImports);

    // Combine back
    return [...deduplicatedImports, '', ...otherLines].join('\n');
  }

  /**
   * Sort imports by type and source
   */
  private sortImports(imports: string[]): string[] {
    return imports.sort((a, b) => {
      // React imports first
      if (a.includes('react') && !b.includes('react')) return -1;
      if (!a.includes('react') && b.includes('react')) return 1;
      
      // External packages next
      const aIsExternal = !a.includes('./') && !a.includes('../') && !a.includes('@/');
      const bIsExternal = !b.includes('./') && !b.includes('../') && !b.includes('@/');
      
      if (aIsExternal && !bIsExternal) return -1;
      if (!aIsExternal && bIsExternal) return 1;
      
      // Alphabetical within groups
      return a.localeCompare(b);
    });
  }

  /**
   * Remove duplicate imports
   */
  private deduplicateImports(imports: string[]): string[] {
    const seen = new Set<string>();
    return imports.filter(imp => {
      if (seen.has(imp)) return false;
      seen.add(imp);
      return true;
    });
  }

  /**
   * Apply code transformations
   */
  private applyTransformations(code: string, options: GenerationOptions): string {
    let transformed = code;

    // TypeScript specific transformations
    if (options.typescript) {
      transformed = this.applyTypeScriptTransformations(transformed, options.typescript);
    }

    // React specific transformations
    if (options.react) {
      transformed = this.applyReactTransformations(transformed, options.react);
    }

    return transformed;
  }

  /**
   * Apply TypeScript transformations
   */
  private applyTypeScriptTransformations(code: string, version: string): string {
    let transformed = code;

    // Add strict type annotations
    transformed = this.addStrictTypes(transformed);
    
    // Use modern TypeScript features
    if (version >= '5.0') {
      transformed = this.useModernTypeScriptFeatures(transformed);
    }

    return transformed;
  }

  /**
   * Apply React transformations
   */
  private applyReactTransformations(code: string, version: string): string {
    let transformed = code;

    // Use modern React patterns
    if (version >= '18') {
      transformed = this.useModernReactPatterns(transformed);
    }

    return transformed;
  }

  /**
   * Extract code components (imports, exports, types)
   */
  private extractCodeComponents(code: string, options: GenerationOptions): {
    imports: string[];
    exports: string[];
    types: string;
  } {
    const lines = code.split('\n');
    const imports: string[] = [];
    const exports: string[] = [];
    const typeLines: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('import ')) {
        imports.push(line);
      } else if (trimmed.startsWith('export ')) {
        exports.push(line);
      } else if (
        trimmed.startsWith('interface ') ||
        trimmed.startsWith('type ') ||
        trimmed.startsWith('enum ')
      ) {
        typeLines.push(line);
      }
    });

    return {
      imports,
      exports,
      types: typeLines.join('\n')
    };
  }

  /**
   * Perform quality checks on generated code
   */
  private async performQualityChecks(
    code: string, 
    options: GenerationOptions
  ): Promise<QualityMetrics> {
    const checks = options.qualityChecks!;
    
    const metrics: QualityMetrics = {
      overallScore: 0,
      typeSafety: checks.typeChecking ? this.checkTypeSafety(code) : 100,
      accessibility: checks.accessibility ? this.checkAccessibility(code) : 100,
      performance: checks.performance ? this.checkPerformance(code) : 100,
      maintainability: this.checkMaintainability(code),
      complexity: this.calculateComplexity(code),
      linesOfCode: code.split('\n').length,
      cyclomaticComplexity: this.calculateCyclomaticComplexity(code)
    };

    // Calculate overall score
    metrics.overallScore = Math.round(
      (metrics.typeSafety + 
       metrics.accessibility + 
       metrics.performance + 
       metrics.maintainability) / 4
    );

    return metrics;
  }

  /**
   * Check TypeScript type safety
   */
  private checkTypeSafety(code: string): number {
    let score = 100;
    
    // Check for 'any' types
    const anyCount = (code.match(/:\s*any/g) || []).length;
    score -= anyCount * 10;
    
    // Check for missing return types
    const functionRegex = /function\s+\w+\([^)]*\)\s*{/g;
    const functionsWithoutReturnType = (code.match(functionRegex) || []).length;
    score -= functionsWithoutReturnType * 5;
    
    // Check for proper interface usage
    const interfaceCount = (code.match(/interface\s+\w+/g) || []).length;
    if (interfaceCount === 0) score -= 10;
    
    return Math.max(0, score);
  }

  /**
   * Check accessibility compliance
   */
  private checkAccessibility(code: string): number {
    let score = 100;
    
    // Check for ARIA attributes
    const ariaAttributes = (code.match(/aria-\w+/g) || []).length;
    if (ariaAttributes === 0) score -= 20;
    
    // Check for semantic HTML
    const semanticTags = (code.match(/<(header|nav|main|section|article|aside|footer)/g) || []).length;
    if (semanticTags === 0) score -= 15;
    
    // Check for alt attributes on images
    const images = (code.match(/<img/g) || []).length;
    const alts = (code.match(/alt=/g) || []).length;
    if (images > alts) score -= (images - alts) * 10;
    
    return Math.max(0, score);
  }

  /**
   * Check performance patterns
   */
  private checkPerformance(code: string): number {
    let score = 100;
    
    // Check for React.memo usage
    if (code.includes('React.memo')) score += 5;
    
    // Check for useCallback/useMemo
    const optimizationHooks = (code.match(/use(Callback|Memo)/g) || []).length;
    score += optimizationHooks * 3;
    
    // Check for inline functions in JSX (performance anti-pattern)
    const inlineFunctions = (code.match(/\w+={() =>/g) || []).length;
    score -= inlineFunctions * 5;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Check code maintainability
   */
  private checkMaintainability(code: string): number {
    let score = 100;
    
    // Check function length
    const functions = code.match(/function[^{]*{[^}]*}/g) || [];
    functions.forEach(func => {
      const lines = func.split('\n').length;
      if (lines > 20) score -= 5;
      if (lines > 50) score -= 10;
    });
    
    // Check for comments
    const comments = (code.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || []).length;
    const codeLines = code.split('\n').filter(line => line.trim()).length;
    const commentRatio = comments / codeLines;
    
    if (commentRatio < 0.1) score -= 10;
    if (commentRatio > 0.3) score += 5;
    
    return Math.max(0, score);
  }

  /**
   * Calculate code complexity
   */
  private calculateComplexity(code: string): number {
    // Simple complexity calculation based on control structures
    const controlStructures = (code.match(/\b(if|else|for|while|switch|case|catch)\b/g) || []).length;
    const functions = (code.match(/function|\=>/g) || []).length;
    
    return Math.round((controlStructures + functions) / Math.max(1, functions));
  }

  /**
   * Calculate cyclomatic complexity
   */
  private calculateCyclomaticComplexity(code: string): number {
    // Count decision points
    const decisionPoints = (code.match(/\b(if|else if|while|for|case|catch|\?\?|\|\||&&)\b/g) || []).length;
    return decisionPoints + 1; // +1 for the main path
  }

  /**
   * Generate documentation for the code
   */
  private generateDocumentation(request: CodeGenerationRequest, code: string): string {
    const template = request.template;
    
    return `# ${template.name}

${template.metadata?.description || 'Generated component documentation'}

## Usage

\`\`\`tsx
${this.extractUsageExample(code)}
\`\`\`

## Props

${this.extractPropsDocumentation(code)}

## Generated Code

\`\`\`tsx
${code}
\`\`\`

---
*Generated by AI Code Generator v1.0.0*
`;
  }

  /**
   * Generate test code
   */
  private generateTests(request: CodeGenerationRequest, code: string): string {
    const componentName = this.extractComponentName(code);
    
    return `import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles props correctly', () => {
    render(<${componentName} data-testid="test-component" />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});`;
  }

  /**
   * Helper methods
   */
  private mergeOptions(options: GenerationOptions): GenerationOptions {
    return {
      ...this.defaultOptions,
      ...options,
      formatting: { ...this.defaultOptions.formatting, ...options.formatting },
      qualityChecks: { ...this.defaultOptions.qualityChecks, ...options.qualityChecks },
      output: { ...this.defaultOptions.output, ...options.output }
    };
  }

  private getDefaultQualityMetrics(): QualityMetrics {
    return {
      overallScore: 0,
      typeSafety: 0,
      accessibility: 0,
      performance: 0,
      maintainability: 0,
      complexity: 0,
      linesOfCode: 0,
      cyclomaticComplexity: 0
    };
  }

  private addSemicolons(code: string): string {
    return code.replace(/([^;{}\s])\s*$/gm, '$1;');
  }

  private removeSemicolons(code: string): string {
    return code.replace(/;$/gm, '');
  }

  private handleTrailingCommas(code: string, style: string): string {
    switch (style) {
      case 'none':
        return code.replace(/,(\s*[}\]])/g, '$1');
      case 'all':
        return code.replace(/([^,\s])(\s*[}\]])/g, '$1,$2');
      default:
        return code;
    }
  }

  private wrapLongLines(code: string, maxLength: number): string {
    return code.split('\n').map(line => {
      if (line.length <= maxLength) return line;
      
      // Simple line wrapping for long lines
      const indent = line.match(/^\s*/)?.[0] || '';
      const content = line.trim();
      
      if (content.includes(',')) {
        return content.split(',').map((part, index) => 
          index === 0 ? line.substring(0, line.indexOf(content)) + part.trim() + ',' :
          indent + '  ' + part.trim() + (index < content.split(',').length - 1 ? ',' : '')
        ).join('\n');
      }
      
      return line;
    }).join('\n');
  }

  private addStrictTypes(code: string): string {
    // Add explicit return types to functions
    return code.replace(
      /function\s+(\w+)\s*\([^)]*\)\s*{/g,
      'function $1(): void {'
    );
  }

  private useModernTypeScriptFeatures(code: string): string {
    // Use satisfies operator where appropriate
    return code.replace(
      /const\s+(\w+):\s*([^=]+)\s*=/g,
      'const $1 = {} satisfies $2'
    );
  }

  private useModernReactPatterns(code: string): string {
    // Use React 18+ patterns
    return code.replace(
      /React\.FC<([^>]+)>/g,
      '($1) => JSX.Element'
    );
  }

  private extractUsageExample(code: string): string {
    const componentName = this.extractComponentName(code);
    return `<${componentName} />`;
  }

  private extractPropsDocumentation(code: string): string {
    const propsInterface = code.match(/interface\s+\w+Props\s*{([^}]*)}/);
    if (!propsInterface) return 'No props defined.';
    
    return propsInterface[1]
      .split('\n')
      .filter(line => line.trim())
      .map(line => `- ${line.trim()}`)
      .join('\n');
  }

  private extractComponentName(code: string): string {
    const match = code.match(/(?:const|function)\s+(\w+)/);
    return match ? match[1] : 'Component';
  }
}

// Export singleton instance
export const codeGenerator = new CodeGenerator();