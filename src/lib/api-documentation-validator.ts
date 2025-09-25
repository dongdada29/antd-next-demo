/**
 * API文档验证器
 * 用于验证API文档的完整性和正确性
 */

import {
  APIDocumentation,
  APIEndpoint,
  Parameter,
  RequestBodySchema,
  ResponseSchema,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  AuthConfig,
  PropertySchema
} from '@/types/api-documentation';

export class APIDocumentationValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  /**
   * 验证完整的API文档
   */
  validate(doc: APIDocumentation): ValidationResult {
    this.errors = [];
    this.warnings = [];

    this.validateBasicInfo(doc);
    this.validateAuthentication(doc.authentication);
    this.validateEndpoints(doc.endpoints);
    this.validateModels(doc.models);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * 验证基础信息
   */
  private validateBasicInfo(doc: APIDocumentation): void {
    if (!doc.title || doc.title.trim().length === 0) {
      this.addError('title', '标题不能为空', 'REQUIRED_FIELD');
    }

    if (!doc.version || doc.version.trim().length === 0) {
      this.addError('version', '版本号不能为空', 'REQUIRED_FIELD');
    } else if (!this.isValidVersion(doc.version)) {
      this.addError('version', '版本号格式不正确，应该类似 "1.0.0"', 'INVALID_FORMAT');
    }

    if (!doc.baseURL || doc.baseURL.trim().length === 0) {
      this.addError('baseURL', '基础URL不能为空', 'REQUIRED_FIELD');
    } else if (!this.isValidURL(doc.baseURL)) {
      this.addError('baseURL', '基础URL格式不正确', 'INVALID_URL');
    }

    if (!doc.description || doc.description.trim().length === 0) {
      this.addWarning('description', '建议添加API描述信息');
    }

    if (!doc.endpoints || doc.endpoints.length === 0) {
      this.addError('endpoints', 'API文档必须包含至少一个端点', 'REQUIRED_FIELD');
    }
  }

  /**
   * 验证认证配置
   */
  private validateAuthentication(auth?: AuthConfig): void {
    if (!auth) {
      this.addWarning('authentication', '建议配置认证信息以确保API安全');
      return;
    }

    const validAuthTypes = ['bearer', 'apiKey', 'basic', 'oauth2'];
    if (!validAuthTypes.includes(auth.type)) {
      this.addError('authentication.type', `认证类型必须是: ${validAuthTypes.join(', ')}`, 'INVALID_VALUE');
    }

    if (auth.type === 'apiKey' && !auth.headerName) {
      this.addError('authentication.headerName', 'API Key认证必须指定header名称', 'REQUIRED_FIELD');
    }

    if (auth.type === 'bearer' && auth.tokenPrefix && auth.tokenPrefix !== 'Bearer') {
      this.addWarning('authentication.tokenPrefix', 'Bearer认证的token前缀通常是 "Bearer"');
    }
  }

  /**
   * 验证端点列表
   */
  private validateEndpoints(endpoints: APIEndpoint[]): void {
    if (!endpoints || endpoints.length === 0) {
      return;
    }

    const endpointIds = new Set<string>();
    const pathMethodCombos = new Set<string>();

    endpoints.forEach((endpoint, index) => {
      const context = `endpoints[${index}]`;
      
      // 验证基础字段
      this.validateEndpointBasicFields(endpoint, context);
      
      // 检查ID唯一性
      if (endpoint.id) {
        if (endpointIds.has(endpoint.id)) {
          this.addError(`${context}.id`, `端点ID "${endpoint.id}" 重复`, 'DUPLICATE_ID');
        } else {
          endpointIds.add(endpoint.id);
        }
      }

      // 检查路径和方法组合的唯一性
      const pathMethodCombo = `${endpoint.method}:${endpoint.path}`;
      if (pathMethodCombos.has(pathMethodCombo)) {
        this.addError(`${context}`, `路径和方法组合 "${pathMethodCombo}" 重复`, 'DUPLICATE_ENDPOINT');
      } else {
        pathMethodCombos.add(pathMethodCombo);
      }

      // 验证参数
      this.validateParameters(endpoint.parameters, `${context}.parameters`);
      
      // 验证请求体
      this.validateRequestBody(endpoint.requestBody, `${context}.requestBody`);
      
      // 验证响应
      this.validateResponses(endpoint.responses, `${context}.responses`);
    });
  }

  /**
   * 验证端点基础字段
   */
  private validateEndpointBasicFields(endpoint: APIEndpoint, context: string): void {
    if (!endpoint.id || endpoint.id.trim().length === 0) {
      this.addError(`${context}.id`, '端点ID不能为空', 'REQUIRED_FIELD');
    }

    if (!endpoint.name || endpoint.name.trim().length === 0) {
      this.addError(`${context}.name`, '端点名称不能为空', 'REQUIRED_FIELD');
    }

    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    if (!validMethods.includes(endpoint.method)) {
      this.addError(`${context}.method`, `HTTP方法必须是: ${validMethods.join(', ')}`, 'INVALID_VALUE');
    }

    if (!endpoint.path || endpoint.path.trim().length === 0) {
      this.addError(`${context}.path`, '端点路径不能为空', 'REQUIRED_FIELD');
    } else if (!endpoint.path.startsWith('/')) {
      this.addError(`${context}.path`, '端点路径必须以 "/" 开头', 'INVALID_FORMAT');
    }

    if (!endpoint.summary || endpoint.summary.trim().length === 0) {
      this.addWarning(`${context}.summary`, '建议添加端点简短描述');
    }

    if (!endpoint.description || endpoint.description.trim().length === 0) {
      this.addWarning(`${context}.description`, '建议添加端点详细描述');
    }

    // 验证路径参数
    const pathParams = this.extractPathParameters(endpoint.path);
    const definedPathParams = endpoint.parameters?.filter(p => p.in === 'path').map(p => p.name) || [];
    
    pathParams.forEach(param => {
      if (!definedPathParams.includes(param)) {
        this.addError(`${context}.parameters`, `路径参数 "{${param}}" 未在参数列表中定义`, 'MISSING_PATH_PARAM');
      }
    });
  }

  /**
   * 验证参数列表
   */
  private validateParameters(parameters?: Parameter[], context?: string): void {
    if (!parameters || !context) return;

    parameters.forEach((param, index) => {
      const paramContext = `${context}[${index}]`;
      
      if (!param.name || param.name.trim().length === 0) {
        this.addError(`${paramContext}.name`, '参数名称不能为空', 'REQUIRED_FIELD');
      }

      const validLocations = ['query', 'path', 'header', 'body'];
      if (!validLocations.includes(param.in)) {
        this.addError(`${paramContext}.in`, `参数位置必须是: ${validLocations.join(', ')}`, 'INVALID_VALUE');
      }

      const validTypes = ['string', 'number', 'boolean', 'array', 'object'];
      if (!validTypes.includes(param.type)) {
        this.addError(`${paramContext}.type`, `参数类型必须是: ${validTypes.join(', ')}`, 'INVALID_VALUE');
      }

      if (!param.description || param.description.trim().length === 0) {
        this.addWarning(`${paramContext}.description`, '建议添加参数描述');
      }

      // 验证数值范围
      if (param.type === 'number') {
        if (param.minimum !== undefined && param.maximum !== undefined && param.minimum > param.maximum) {
          this.addError(`${paramContext}`, '最小值不能大于最大值', 'INVALID_RANGE');
        }
      }

      // 验证字符串长度
      if (param.type === 'string') {
        if (param.minLength !== undefined && param.maxLength !== undefined && param.minLength > param.maxLength) {
          this.addError(`${paramContext}`, '最小长度不能大于最大长度', 'INVALID_RANGE');
        }
      }
    });
  }

  /**
   * 验证请求体
   */
  private validateRequestBody(requestBody?: RequestBodySchema, context?: string): void {
    if (!requestBody || !context) return;

    const validContentTypes = ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'];
    if (!validContentTypes.includes(requestBody.contentType)) {
      this.addError(`${context}.contentType`, `内容类型必须是: ${validContentTypes.join(', ')}`, 'INVALID_VALUE');
    }

    if (!requestBody.schema) {
      this.addError(`${context}.schema`, '请求体必须定义schema', 'REQUIRED_FIELD');
    } else {
      this.validatePropertySchema(requestBody.schema, `${context}.schema`);
    }
  }

  /**
   * 验证响应列表
   */
  private validateResponses(responses: ResponseSchema[], context: string): void {
    if (!responses || responses.length === 0) {
      this.addError(context, '端点必须定义至少一个响应', 'REQUIRED_FIELD');
      return;
    }

    const statusCodes = new Set<number>();
    let hasSuccessResponse = false;

    responses.forEach((response, index) => {
      const responseContext = `${context}[${index}]`;
      
      if (!response.statusCode) {
        this.addError(`${responseContext}.statusCode`, '响应状态码不能为空', 'REQUIRED_FIELD');
      } else {
        if (statusCodes.has(response.statusCode)) {
          this.addError(`${responseContext}.statusCode`, `状态码 ${response.statusCode} 重复`, 'DUPLICATE_STATUS');
        } else {
          statusCodes.add(response.statusCode);
        }

        if (response.statusCode >= 200 && response.statusCode < 300) {
          hasSuccessResponse = true;
        }

        if (!this.isValidStatusCode(response.statusCode)) {
          this.addError(`${responseContext}.statusCode`, '无效的HTTP状态码', 'INVALID_STATUS_CODE');
        }
      }

      if (!response.description || response.description.trim().length === 0) {
        this.addWarning(`${responseContext}.description`, '建议添加响应描述');
      }

      if (response.schema) {
        this.validatePropertySchema(response.schema, `${responseContext}.schema`);
      }
    });

    if (!hasSuccessResponse) {
      this.addWarning(context, '建议定义至少一个成功响应（2xx状态码）');
    }
  }

  /**
   * 验证属性结构
   */
  private validatePropertySchema(schema: any, context: string): void {
    if (!schema.type) {
      this.addError(`${context}.type`, '属性类型不能为空', 'REQUIRED_FIELD');
      return;
    }

    const validTypes = ['object', 'array', 'string', 'number', 'boolean'];
    if (!validTypes.includes(schema.type)) {
      this.addError(`${context}.type`, `属性类型必须是: ${validTypes.join(', ')}`, 'INVALID_VALUE');
    }

    if (schema.type === 'object' && schema.properties) {
      Object.keys(schema.properties).forEach(propName => {
        this.validatePropertySchema(schema.properties[propName], `${context}.properties.${propName}`);
      });
    }

    if (schema.type === 'array' && schema.items) {
      this.validatePropertySchema(schema.items, `${context}.items`);
    }
  }

  /**
   * 验证数据模型
   */
  private validateModels(models?: Record<string, any>): void {
    if (!models) return;

    Object.keys(models).forEach(modelName => {
      const model = models[modelName];
      const context = `models.${modelName}`;

      if (!model.name || model.name.trim().length === 0) {
        this.addError(`${context}.name`, '模型名称不能为空', 'REQUIRED_FIELD');
      }

      if (model.type !== 'object') {
        this.addError(`${context}.type`, '模型类型必须是 "object"', 'INVALID_VALUE');
      }

      if (!model.properties) {
        this.addError(`${context}.properties`, '模型必须定义属性', 'REQUIRED_FIELD');
      } else {
        Object.keys(model.properties).forEach(propName => {
          this.validatePropertySchema(model.properties[propName], `${context}.properties.${propName}`);
        });
      }
    });
  }

  /**
   * 添加错误
   */
  private addError(field: string, message: string, code: string, suggestion?: string): void {
    this.errors.push({
      field,
      message,
      code,
      severity: 'error',
      suggestion
    });
  }

  /**
   * 添加警告
   */
  private addWarning(field: string, message: string, suggestion?: string): void {
    this.warnings.push({
      field,
      message,
      suggestion
    });
  }

  /**
   * 验证URL格式
   */
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 验证版本号格式
   */
  private isValidVersion(version: string): boolean {
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$/;
    return versionRegex.test(version);
  }

  /**
   * 验证HTTP状态码
   */
  private isValidStatusCode(code: number): boolean {
    return code >= 100 && code <= 599;
  }

  /**
   * 从路径中提取参数
   */
  private extractPathParameters(path: string): string[] {
    const matches = path.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  }

  /**
   * 获取验证建议
   */
  static getValidationSuggestions(): Record<string, string> {
    return {
      REQUIRED_FIELD: '请确保填写所有必需字段',
      INVALID_URL: '请检查URL格式，确保包含协议（http://或https://）',
      INVALID_FORMAT: '请检查格式是否正确',
      DUPLICATE_ID: '请确保所有ID都是唯一的',
      DUPLICATE_ENDPOINT: '请确保路径和方法的组合是唯一的',
      MISSING_PATH_PARAM: '请在参数列表中定义所有路径参数',
      INVALID_VALUE: '请使用有效的值',
      INVALID_RANGE: '请确保数值范围设置正确',
      DUPLICATE_STATUS: '请确保每个端点的状态码都是唯一的',
      INVALID_STATUS_CODE: '请使用有效的HTTP状态码（100-599）'
    };
  }
}