/**
 * API服务验证器
 * 验证生成的API服务函数的正确性和完整性
 */

import type { APIDocumentation, APIEndpoint, Parameter } from '@/types/api-documentation';
import type { GeneratedService } from './service-generator';

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100的质量分数
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

// 验证错误
export interface ValidationError {
  type: 'syntax' | 'type' | 'logic' | 'security' | 'performance';
  severity: 'critical' | 'major' | 'minor';
  message: string;
  location?: {
    service?: string;
    function?: string;
    line?: number;
  };
  fix?: string;
}

// 验证警告
export interface ValidationWarning {
  type: 'best-practice' | 'compatibility' | 'maintainability';
  message: string;
  location?: {
    service?: string;
    function?: string;
  };
  suggestion?: string;
}

// 验证建议
export interface ValidationSuggestion {
  type: 'optimization' | 'enhancement' | 'refactoring';
  message: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

// 验证规则接口
export interface ValidationRule {
  name: string;
  description: string;
  category: 'syntax' | 'type' | 'logic' | 'security' | 'performance' | 'best-practice';
  severity: 'critical' | 'major' | 'minor';
  validate: (service: GeneratedService, documentation: APIDocumentation) => ValidationError[];
}

// API服务验证器类
export class ServiceValidator {
  private rules: ValidationRule[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  // 添加验证规则
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  // 移除验证规则
  removeRule(name: string): void {
    this.rules = this.rules.filter(rule => rule.name !== name);
  }

  // 获取所有规则
  getRules(): ValidationRule[] {
    return [...this.rules];
  }

  // 验证单个服务
  validateService(service: GeneratedService, documentation: APIDocumentation): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    // 应用所有验证规则
    this.rules.forEach(rule => {
      try {
        const ruleErrors = rule.validate(service, documentation);
        errors.push(...ruleErrors);
      } catch (error) {
        errors.push({
          type: 'logic',
          severity: 'major',
          message: `Validation rule '${rule.name}' failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          location: { service: service.name },
        });
      }
    });

    // 生成警告和建议
    this.generateWarnings(service, documentation, warnings);
    this.generateSuggestions(service, documentation, suggestions);

    // 计算质量分数
    const score = this.calculateQualityScore(errors, warnings);

    return {
      isValid: errors.filter(e => e.severity === 'critical').length === 0,
      score,
      errors,
      warnings,
      suggestions,
    };
  }

  // 验证多个服务
  validateServices(services: GeneratedService[], documentation: APIDocumentation): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];
    const allSuggestions: ValidationSuggestion[] = [];

    // 验证每个服务
    services.forEach(service => {
      const result = this.validateService(service, documentation);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
      allSuggestions.push(...result.suggestions);
    });

    // 添加跨服务验证
    const crossServiceErrors = this.validateCrossService(services, documentation);
    allErrors.push(...crossServiceErrors);

    // 计算整体质量分数
    const score = this.calculateQualityScore(allErrors, allWarnings);

    return {
      isValid: allErrors.filter(e => e.severity === 'critical').length === 0,
      score,
      errors: allErrors,
      warnings: allWarnings,
      suggestions: allSuggestions,
    };
  }

  // 初始化默认验证规则
  private initializeDefaultRules(): void {
    // 语法验证规则
    this.addRule({
      name: 'function-syntax',
      description: '验证函数语法正确性',
      category: 'syntax',
      severity: 'critical',
      validate: (service) => {
        const errors: ValidationError[] = [];
        
        // 检查函数名称
        if (!service.functionName || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(service.functionName)) {
          errors.push({
            type: 'syntax',
            severity: 'critical',
            message: 'Invalid function name',
            location: { service: service.name, function: service.functionName },
            fix: 'Use a valid JavaScript identifier for function name',
          });
        }

        // 检查代码语法（简单检查）
        if (!service.code.includes('export const') && !service.code.includes('export function')) {
          errors.push({
            type: 'syntax',
            severity: 'major',
            message: 'Function is not properly exported',
            location: { service: service.name, function: service.functionName },
            fix: 'Add proper export statement',
          });
        }

        return errors;
      },
    });

    // 类型安全验证规则
    this.addRule({
      name: 'type-safety',
      description: '验证TypeScript类型安全',
      category: 'type',
      severity: 'major',
      validate: (service) => {
        const errors: ValidationError[] = [];

        // 检查返回类型
        if (!service.code.includes('Promise<') && !service.code.includes(': Promise')) {
          errors.push({
            type: 'type',
            severity: 'major',
            message: 'Async function should return Promise type',
            location: { service: service.name, function: service.functionName },
            fix: 'Add Promise return type annotation',
          });
        }

        // 检查参数类型
        if (service.code.includes('any') && !service.code.includes('// @ts-ignore')) {
          errors.push({
            type: 'type',
            severity: 'minor',
            message: 'Using "any" type reduces type safety',
            location: { service: service.name, function: service.functionName },
            fix: 'Use specific types instead of "any"',
          });
        }

        return errors;
      },
    });

    // 安全性验证规则
    this.addRule({
      name: 'security-check',
      description: '验证安全性问题',
      category: 'security',
      severity: 'critical',
      validate: (service) => {
        const errors: ValidationError[] = [];

        // 检查SQL注入风险
        if (service.code.includes('${') && service.endpoint.path.includes('{')) {
          // 这是一个简化的检查，实际应该更复杂
          if (!service.code.includes('encodeURIComponent') && !service.code.includes('sanitize')) {
            errors.push({
              type: 'security',
              severity: 'major',
              message: 'Potential injection vulnerability in path parameters',
              location: { service: service.name, function: service.functionName },
              fix: 'Sanitize or encode path parameters',
            });
          }
        }

        return errors;
      },
    });

    // 性能验证规则
    this.addRule({
      name: 'performance-check',
      description: '验证性能相关问题',
      category: 'performance',
      severity: 'minor',
      validate: (service) => {
        const errors: ValidationError[] = [];

        // 检查是否有适当的错误处理
        if (!service.code.includes('try') && !service.code.includes('catch')) {
          errors.push({
            type: 'performance',
            severity: 'minor',
            message: 'Missing error handling may impact performance',
            location: { service: service.name, function: service.functionName },
            fix: 'Add try-catch block for better error handling',
          });
        }

        return errors;
      },
    });

    // 最佳实践验证规则
    this.addRule({
      name: 'best-practices',
      description: '验证最佳实践',
      category: 'best-practice',
      severity: 'minor',
      validate: (service) => {
        const errors: ValidationError[] = [];

        // 检查JSDoc注释
        if (!service.code.includes('/**')) {
          errors.push({
            type: 'logic',
            severity: 'minor',
            message: 'Missing JSDoc documentation',
            location: { service: service.name, function: service.functionName },
            fix: 'Add JSDoc comments for better documentation',
          });
        }

        return errors;
      },
    });
  }

  // 生成警告
  private generateWarnings(
    service: GeneratedService,
    documentation: APIDocumentation,
    warnings: ValidationWarning[]
  ): void {
    // 检查端点是否已废弃
    if (service.endpoint.deprecated) {
      warnings.push({
        type: 'compatibility',
        message: `Endpoint '${service.endpoint.name}' is deprecated`,
        location: { service: service.name },
        suggestion: 'Consider using alternative endpoints or plan for migration',
      });
    }

    // 检查是否缺少示例
    if (!service.endpoint.examples.request && !service.endpoint.examples.response) {
      warnings.push({
        type: 'maintainability',
        message: `Missing examples for endpoint '${service.endpoint.name}'`,
        location: { service: service.name },
        suggestion: 'Add request and response examples for better documentation',
      });
    }

    // 检查参数验证
    if (service.endpoint.parameters && service.endpoint.parameters.length > 0) {
      const hasValidation = service.endpoint.parameters.some(p => 
        p.pattern || p.minimum !== undefined || p.maximum !== undefined
      );
      
      if (!hasValidation) {
        warnings.push({
          type: 'best-practice',
          message: `No parameter validation defined for '${service.endpoint.name}'`,
          location: { service: service.name },
          suggestion: 'Add validation rules for parameters',
        });
      }
    }
  }

  // 生成建议
  private generateSuggestions(
    service: GeneratedService,
    documentation: APIDocumentation,
    suggestions: ValidationSuggestion[]
  ): void {
    // 建议添加缓存
    if (service.endpoint.method === 'GET' && !service.code.includes('cache')) {
      suggestions.push({
        type: 'optimization',
        message: `Consider adding caching for GET endpoint '${service.endpoint.name}'`,
        impact: 'medium',
        effort: 'low',
      });
    }

    // 建议添加重试机制
    if (!service.code.includes('retry') && service.endpoint.method !== 'GET') {
      suggestions.push({
        type: 'enhancement',
        message: `Consider adding retry mechanism for '${service.endpoint.name}'`,
        impact: 'low',
        effort: 'medium',
      });
    }

    // 建议优化类型定义
    if (service.types.length === 0) {
      suggestions.push({
        type: 'refactoring',
        message: `Generate specific types for '${service.endpoint.name}' instead of using generic types`,
        impact: 'high',
        effort: 'medium',
      });
    }
  }

  // 跨服务验证
  private validateCrossService(
    services: GeneratedService[],
    documentation: APIDocumentation
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // 检查函数名称冲突
    const functionNames = new Map<string, string[]>();
    services.forEach(service => {
      if (!functionNames.has(service.functionName)) {
        functionNames.set(service.functionName, []);
      }
      functionNames.get(service.functionName)!.push(service.name);
    });

    functionNames.forEach((serviceNames, functionName) => {
      if (serviceNames.length > 1) {
        errors.push({
          type: 'logic',
          severity: 'critical',
          message: `Duplicate function name '${functionName}' found in services: ${serviceNames.join(', ')}`,
          fix: 'Rename functions to avoid conflicts',
        });
      }
    });

    // 检查端点路径冲突
    const pathMethods = new Map<string, string[]>();
    services.forEach(service => {
      const key = `${service.endpoint.method}:${service.endpoint.path}`;
      if (!pathMethods.has(key)) {
        pathMethods.set(key, []);
      }
      pathMethods.get(key)!.push(service.name);
    });

    pathMethods.forEach((serviceNames, pathMethod) => {
      if (serviceNames.length > 1) {
        errors.push({
          type: 'logic',
          severity: 'major',
          message: `Duplicate endpoint '${pathMethod}' found in services: ${serviceNames.join(', ')}`,
          fix: 'Ensure each endpoint has a unique method-path combination',
        });
      }
    });

    return errors;
  }

  // 计算质量分数
  private calculateQualityScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    let score = 100;

    // 根据错误严重程度扣分
    errors.forEach(error => {
      switch (error.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'major':
          score -= 10;
          break;
        case 'minor':
          score -= 5;
          break;
      }
    });

    // 根据警告扣分
    warnings.forEach(() => {
      score -= 2;
    });

    return Math.max(0, score);
  }
}

// 便捷函数
export const createServiceValidator = (): ServiceValidator => {
  return new ServiceValidator();
};

// 验证服务的便捷函数
export const validateAPIService = (
  service: GeneratedService,
  documentation: APIDocumentation
): ValidationResult => {
  const validator = new ServiceValidator();
  return validator.validateService(service, documentation);
};

// 验证多个服务的便捷函数
export const validateAPIServices = (
  services: GeneratedService[],
  documentation: APIDocumentation
): ValidationResult => {
  const validator = new ServiceValidator();
  return validator.validateServices(services, documentation);
};