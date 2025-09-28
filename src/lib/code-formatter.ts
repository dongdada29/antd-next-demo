/**
 * Code Formatter
 * 
 * Advanced code formatting and quality checking system
 * with support for multiple formatting styles and linting rules.
 */

export interface FormattingConfig {
  /** Language/file type */
  language: 'typescript' | 'javascript' | 'tsx' | 'jsx';
  /** Indentation settings */
  indentation: {
    type: 'spaces' | 'tabs';
    size: number;
  };
  /** Line settings */
  lines: {
    maxLength: number;
    ending: 'lf' | 'crlf';
    preserveEmpty: boolean;
  };
  /** Quote settings */
  quotes: {
    style: 'single' | 'double';
    jsx: 'single' | 'double';
  };
  /** Semicolon settings */
  semicolons: {
    required: boolean;
    avoidUnnecessary: boolean;
  };
  /** Comma settings */
  commas: {
    trailing: 'none' | 'es5' | 'all';
    spacing: boolean;
  };
  /** Bracket settings */
  brackets: {
    spacing: boolean;
    sameLine: boolean;
  };
  /** Import/Export settings */
  imports: {
    sort: boolean;
    grouping: boolean;
    removeUnused: boolean;
  };
}

export interface QualityRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: 'style' | 'performance' | 'accessibility' | 'security' | 'maintainability';
  check: (code: string) => QualityIssue[];
}

export interface QualityIssue {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
  fixable?: boolean;
}

export interface FormattingResult {
  /** Formatted code */
  code: string;
  /** Quality issues found */
  issues: QualityIssue[];
  /** Formatting statistics */
  stats: FormattingStats;
  /** Applied transformations */
  transformations: string[];
}

export interface FormattingStats {
  /** Original lines of code */
  originalLines: number;
  /** Formatted lines of code */
  formattedLines: number;
  /** Changes made */
  changes: number;
  /** Processing time (ms) */
  processingTime: number;
}

/**
 * Code Formatter Class
 */
export class CodeFormatter {
  private rules: Map<string, QualityRule> = new Map();
  private defaultConfig: FormattingConfig = {
    language: 'tsx',
    indentation: {
      type: 'spaces',
      size: 2
    },
    lines: {
      maxLength: 100,
      ending: 'lf',
      preserveEmpty: false
    },
    quotes: {
      style: 'single',
      jsx: 'double'
    },
    semicolons: {
      required: true,
      avoidUnnecessary: false
    },
    commas: {
      trailing: 'es5',
      spacing: true
    },
    brackets: {
      spacing: true,
      sameLine: false
    },
    imports: {
      sort: true,
      grouping: true,
      removeUnused: true
    }
  };

  constructor() {
    this.initializeQualityRules();
  }

  /**
   * Format code with given configuration
   */
  async formatCode(code: string, config?: Partial<FormattingConfig>): Promise<FormattingResult> {
    const startTime = Date.now();
    const fullConfig = { ...this.defaultConfig, ...config };
    const originalLines = code.split('\n').length;
    
    let formatted = code;
    const transformations: string[] = [];
    let changes = 0;

    try {
      // Apply formatting transformations
      const formatResult = this.applyFormatting(formatted, fullConfig);
      formatted = formatResult.code;
      changes += formatResult.changes;
      transformations.push(...formatResult.transformations);

      // Run quality checks
      const issues = this.runQualityChecks(formatted);

      // Apply auto-fixes for fixable issues
      const fixResult = this.applyAutoFixes(formatted, issues);
      formatted = fixResult.code;
      changes += fixResult.changes;
      transformations.push(...fixResult.transformations);

      const processingTime = Date.now() - startTime;

      return {
        code: formatted,
        issues: issues.filter(issue => !issue.fixable),
        stats: {
          originalLines,
          formattedLines: formatted.split('\n').length,
          changes,
          processingTime
        },
        transformations
      };
    } catch (error) {
      throw new Error(`Formatting failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Apply formatting rules
   */
  private applyFormatting(code: string, config: FormattingConfig): {
    code: string;
    changes: number;
    transformations: string[];
  } {
    let formatted = code;
    let changes = 0;
    const transformations: string[] = [];

    // Apply indentation
    const indentResult = this.applyIndentation(formatted, config.indentation);
    formatted = indentResult.code;
    changes += indentResult.changes;
    if (indentResult.changes > 0) transformations.push('indentation');

    // Apply line formatting
    const lineResult = this.applyLineFormatting(formatted, config.lines);
    formatted = lineResult.code;
    changes += lineResult.changes;
    if (lineResult.changes > 0) transformations.push('line-formatting');

    // Apply quote formatting
    const quoteResult = this.applyQuoteFormatting(formatted, config.quotes);
    formatted = quoteResult.code;
    changes += quoteResult.changes;
    if (quoteResult.changes > 0) transformations.push('quote-formatting');

    // Apply semicolon formatting
    const semicolonResult = this.applySemicolonFormatting(formatted, config.semicolons);
    formatted = semicolonResult.code;
    changes += semicolonResult.changes;
    if (semicolonResult.changes > 0) transformations.push('semicolon-formatting');

    // Apply comma formatting
    const commaResult = this.applyCommaFormatting(formatted, config.commas);
    formatted = commaResult.code;
    changes += commaResult.changes;
    if (commaResult.changes > 0) transformations.push('comma-formatting');

    // Apply bracket formatting
    const bracketResult = this.applyBracketFormatting(formatted, config.brackets);
    formatted = bracketResult.code;
    changes += bracketResult.changes;
    if (bracketResult.changes > 0) transformations.push('bracket-formatting');

    // Apply import formatting
    const importResult = this.applyImportFormatting(formatted, config.imports);
    formatted = importResult.code;
    changes += importResult.changes;
    if (importResult.changes > 0) transformations.push('import-formatting');

    return { code: formatted, changes, transformations };
  }

  /**
   * Apply indentation formatting
   */
  private applyIndentation(code: string, config: FormattingConfig['indentation']): {
    code: string;
    changes: number;
  } {
    const lines = code.split('\n');
    let changes = 0;
    
    const formatted = lines.map(line => {
      const leadingWhitespace = line.match(/^[\s]*/)?.[0] || '';
      const content = line.substring(leadingWhitespace.length);
      
      if (!content) return line; // Empty line
      
      // Calculate indentation level
      const tabCount = (leadingWhitespace.match(/\t/g) || []).length;
      const spaceCount = (leadingWhitespace.match(/ /g) || []).length;
      const currentLevel = tabCount + Math.floor(spaceCount / (config.size || 2));
      
      // Apply new indentation
      const newIndent = config.type === 'tabs' 
        ? '\t'.repeat(currentLevel)
        : ' '.repeat(currentLevel * config.size);
      
      if (newIndent !== leadingWhitespace) {
        changes++;
        return newIndent + content;
      }
      
      return line;
    });

    return {
      code: formatted.join('\n'),
      changes
    };
  }

  /**
   * Apply line formatting
   */
  private applyLineFormatting(code: string, config: FormattingConfig['lines']): {
    code: string;
    changes: number;
  } {
    let formatted = code;
    let changes = 0;

    // Handle line endings
    if (config.ending === 'crlf' && !formatted.includes('\r\n')) {
      formatted = formatted.replace(/\n/g, '\r\n');
      changes++;
    } else if (config.ending === 'lf' && formatted.includes('\r\n')) {
      formatted = formatted.replace(/\r\n/g, '\n');
      changes++;
    }

    // Handle empty lines
    if (!config.preserveEmpty) {
      const beforeLines = formatted.split('\n').length;
      formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
      const afterLines = formatted.split('\n').length;
      if (beforeLines !== afterLines) changes++;
    }

    // Handle long lines (basic wrapping)
    const lines = formatted.split('\n');
    const wrappedLines = lines.map(line => {
      if (line.length <= config.maxLength) return line;
      
      // Simple wrapping for long lines
      const indent = line.match(/^\s*/)?.[0] || '';
      if (line.includes(',') && line.length > config.maxLength) {
        changes++;
        return this.wrapLongLine(line, config.maxLength, indent);
      }
      
      return line;
    });

    return {
      code: wrappedLines.join('\n'),
      changes
    };
  }

  /**
   * Apply quote formatting
   */
  private applyQuoteFormatting(code: string, config: FormattingConfig['quotes']): {
    code: string;
    changes: number;
  } {
    let formatted = code;
    let changes = 0;

    // Handle regular quotes
    if (config.style === 'single') {
      const beforeCount = (formatted.match(/"/g) || []).length;
      formatted = formatted.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, "'$1'");
      const afterCount = (formatted.match(/"/g) || []).length;
      if (beforeCount !== afterCount) changes++;
    } else if (config.style === 'double') {
      const beforeCount = (formatted.match(/'/g) || []).length;
      formatted = formatted.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"');
      const afterCount = (formatted.match(/'/g) || []).length;
      if (beforeCount !== afterCount) changes++;
    }

    // Handle JSX quotes separately
    if (config.jsx !== config.style) {
      const jsxQuoteRegex = config.jsx === 'double' 
        ? /(\w+)='([^']*)'/g 
        : /(\w+)="([^"]*)"/g;
      
      const replacement = config.jsx === 'double' ? '$1="$2"' : "$1='$2'";
      const before = formatted;
      formatted = formatted.replace(jsxQuoteRegex, replacement);
      if (before !== formatted) changes++;
    }

    return { code: formatted, changes };
  }

  /**
   * Apply semicolon formatting
   */
  private applySemicolonFormatting(code: string, config: FormattingConfig['semicolons']): {
    code: string;
    changes: number;
  } {
    let formatted = code;
    let changes = 0;

    if (config.required) {
      // Add missing semicolons
      const beforeCount = (formatted.match(/;/g) || []).length;
      formatted = formatted.replace(/([^;{}\s\n])\s*$/gm, '$1;');
      const afterCount = (formatted.match(/;/g) || []).length;
      if (beforeCount !== afterCount) changes++;
    } else {
      // Remove unnecessary semicolons
      const beforeCount = (formatted.match(/;/g) || []).length;
      formatted = formatted.replace(/;$/gm, '');
      const afterCount = (formatted.match(/;/g) || []).length;
      if (beforeCount !== afterCount) changes++;
    }

    return { code: formatted, changes };
  }

  /**
   * Apply comma formatting
   */
  private applyCommaFormatting(code: string, config: FormattingConfig['commas']): {
    code: string;
    changes: number;
  } {
    let formatted = code;
    let changes = 0;

    // Handle trailing commas
    switch (config.trailing) {
      case 'none':
        const beforeNone = (formatted.match(/,(\s*[}\]])/g) || []).length;
        formatted = formatted.replace(/,(\s*[}\]])/g, '$1');
        const afterNone = (formatted.match(/,(\s*[}\]])/g) || []).length;
        if (beforeNone !== afterNone) changes++;
        break;
        
      case 'all':
        const beforeAll = formatted;
        formatted = formatted.replace(/([^,\s])(\s*[}\]])/g, '$1,$2');
        if (beforeAll !== formatted) changes++;
        break;
        
      case 'es5':
        // Add trailing commas for multiline objects/arrays
        const beforeES5 = formatted;
        formatted = formatted.replace(/([^,\s])\n(\s*[}\]])/g, '$1,\n$2');
        if (beforeES5 !== formatted) changes++;
        break;
    }

    // Handle comma spacing
    if (config.spacing) {
      const beforeSpacing = formatted;
      formatted = formatted.replace(/,(?!\s)/g, ', ');
      if (beforeSpacing !== formatted) changes++;
    }

    return { code: formatted, changes };
  }

  /**
   * Apply bracket formatting
   */
  private applyBracketFormatting(code: string, config: FormattingConfig['brackets']): {
    code: string;
    changes: number;
  } {
    let formatted = code;
    let changes = 0;

    // Handle bracket spacing
    if (config.spacing) {
      const before = formatted;
      formatted = formatted.replace(/\{(?!\s)/g, '{ ');
      formatted = formatted.replace(/(?<!\s)\}/g, ' }');
      if (before !== formatted) changes++;
    } else {
      const before = formatted;
      formatted = formatted.replace(/\{\s+/g, '{');
      formatted = formatted.replace(/\s+\}/g, '}');
      if (before !== formatted) changes++;
    }

    return { code: formatted, changes };
  }

  /**
   * Apply import formatting
   */
  private applyImportFormatting(code: string, config: FormattingConfig['imports']): {
    code: string;
    changes: number;
  } {
    const lines = code.split('\n');
    const imports: string[] = [];
    const otherLines: string[] = [];
    let changes = 0;

    // Separate imports from other code
    lines.forEach(line => {
      if (line.trim().startsWith('import ')) {
        imports.push(line);
      } else {
        otherLines.push(line);
      }
    });

    let processedImports = imports;

    // Sort imports
    if (config.sort) {
      const sorted = this.sortImports(imports);
      if (JSON.stringify(sorted) !== JSON.stringify(imports)) {
        processedImports = sorted;
        changes++;
      }
    }

    // Group imports
    if (config.grouping) {
      const grouped = this.groupImports(processedImports);
      if (JSON.stringify(grouped) !== JSON.stringify(processedImports)) {
        processedImports = grouped;
        changes++;
      }
    }

    // Remove unused imports (basic implementation)
    if (config.removeUnused) {
      const codeContent = otherLines.join('\n');
      const filtered = processedImports.filter(imp => {
        const importedItems = this.extractImportedItems(imp);
        return importedItems.some(item => codeContent.includes(item));
      });
      
      if (filtered.length !== processedImports.length) {
        processedImports = filtered;
        changes++;
      }
    }

    return {
      code: [...processedImports, '', ...otherLines].join('\n'),
      changes
    };
  }

  /**
   * Run quality checks
   */
  private runQualityChecks(code: string): QualityIssue[] {
    const issues: QualityIssue[] = [];

    for (const rule of this.rules.values()) {
      try {
        const ruleIssues = rule.check(code);
        issues.push(...ruleIssues);
      } catch (error) {
        console.warn(`Quality rule '${rule.id}' failed:`, error);
      }
    }

    return issues;
  }

  /**
   * Apply auto-fixes for fixable issues
   */
  private applyAutoFixes(code: string, issues: QualityIssue[]): {
    code: string;
    changes: number;
    transformations: string[];
  } {
    let fixed = code;
    let changes = 0;
    const transformations: string[] = [];

    const fixableIssues = issues.filter(issue => issue.fixable && issue.suggestion);

    for (const issue of fixableIssues) {
      if (issue.suggestion) {
        const before = fixed;
        fixed = this.applyFix(fixed, issue);
        if (before !== fixed) {
          changes++;
          transformations.push(`fix-${issue.rule}`);
        }
      }
    }

    return { code: fixed, changes, transformations };
  }

  /**
   * Apply a specific fix
   */
  private applyFix(code: string, issue: QualityIssue): string {
    // This would implement specific fixes based on the issue type
    // For now, return the code unchanged
    return code;
  }

  /**
   * Helper methods
   */
  private wrapLongLine(line: string, maxLength: number, indent: string): string {
    if (line.includes(',')) {
      const parts = line.split(',');
      const wrapped = [parts[0] + ','];
      
      for (let i = 1; i < parts.length; i++) {
        wrapped.push(indent + '  ' + parts[i].trim() + (i < parts.length - 1 ? ',' : ''));
      }
      
      return wrapped.join('\n');
    }
    
    return line;
  }

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

  private groupImports(imports: string[]): string[] {
    const groups: string[][] = [[], [], []]; // React, External, Internal
    
    imports.forEach(imp => {
      if (imp.includes('react')) {
        groups[0].push(imp);
      } else if (!imp.includes('./') && !imp.includes('../') && !imp.includes('@/')) {
        groups[1].push(imp);
      } else {
        groups[2].push(imp);
      }
    });

    const result: string[] = [];
    groups.forEach((group, index) => {
      if (group.length > 0) {
        result.push(...group);
        if (index < groups.length - 1 && groups[index + 1].length > 0) {
          result.push(''); // Empty line between groups
        }
      }
    });

    return result;
  }

  private extractImportedItems(importStatement: string): string[] {
    const match = importStatement.match(/import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))/);
    if (!match) return [];

    if (match[1]) {
      // Named imports
      return match[1].split(',').map(item => item.trim().split(' as ')[0]);
    } else if (match[2]) {
      // Namespace import
      return [match[2]];
    } else if (match[3]) {
      // Default import
      return [match[3]];
    }

    return [];
  }

  /**
   * Initialize quality rules
   */
  private initializeQualityRules(): void {
    // TypeScript rules
    this.rules.set('no-any', {
      id: 'no-any',
      name: 'No Any Types',
      description: 'Avoid using "any" type',
      severity: 'warning',
      category: 'maintainability',
      check: (code: string) => {
        const matches = [...code.matchAll(/:\s*any\b/g)];
        return matches.map((match, index) => ({
          rule: 'no-any',
          severity: 'warning' as const,
          message: 'Avoid using "any" type. Use specific types instead.',
          line: code.substring(0, match.index).split('\n').length,
          column: match.index! - code.lastIndexOf('\n', match.index!),
          suggestion: 'Replace "any" with a specific type',
          fixable: false
        }));
      }
    });

    // Accessibility rules
    this.rules.set('missing-alt', {
      id: 'missing-alt',
      name: 'Missing Alt Text',
      description: 'Images should have alt text',
      severity: 'error',
      category: 'accessibility',
      check: (code: string) => {
        const imgTags = [...code.matchAll(/<img[^>]*>/g)];
        return imgTags
          .filter(match => !match[0].includes('alt='))
          .map(match => ({
            rule: 'missing-alt',
            severity: 'error' as const,
            message: 'Image elements must have alt text for accessibility',
            line: code.substring(0, match.index).split('\n').length,
            column: match.index! - code.lastIndexOf('\n', match.index!),
            suggestion: 'Add alt="" or alt="description" to the image',
            fixable: true
          }));
      }
    });

    // Performance rules
    this.rules.set('inline-functions', {
      id: 'inline-functions',
      name: 'Inline Functions in JSX',
      description: 'Avoid inline functions in JSX props',
      severity: 'warning',
      category: 'performance',
      check: (code: string) => {
        const matches = [...code.matchAll(/\w+={() =>/g)];
        return matches.map(match => ({
          rule: 'inline-functions',
          severity: 'warning' as const,
          message: 'Inline functions in JSX can cause unnecessary re-renders',
          line: code.substring(0, match.index).split('\n').length,
          column: match.index! - code.lastIndexOf('\n', match.index!),
          suggestion: 'Extract function to useCallback or component level',
          fixable: false
        }));
      }
    });
  }
}

// Export singleton instance
export const codeFormatter = new CodeFormatter();