/**
 * 模板和组件分享系统
 * 
 * 提供模板上传、下载、评分、搜索等功能
 */

export interface SharedTemplate {
  id: string;
  name: string;
  description: string;
  category: 'component' | 'page' | 'hook' | 'utility';
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  code: string;
  preview?: string;
  dependencies: string[];
  version: string;
  downloads: number;
  rating: number;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
  license: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'Custom';
  isPublic: boolean;
  featured: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface TemplateSearchFilters {
  category?: string;
  tags?: string[];
  author?: string;
  minRating?: number;
  license?: string;
  sortBy?: 'downloads' | 'rating' | 'recent' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface TemplateUploadRequest {
  name: string;
  description: string;
  category: SharedTemplate['category'];
  tags: string[];
  code: string;
  preview?: string;
  dependencies: string[];
  license: SharedTemplate['license'];
  isPublic: boolean;
}

export class TemplateSharingService {
  private apiUrl: string;
  private apiKey?: string;

  constructor(apiUrl: string, apiKey?: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * 上传模板到社区
   */
  async uploadTemplate(template: TemplateUploadRequest): Promise<SharedTemplate> {
    const response = await this.makeRequest('/templates', {
      method: 'POST',
      body: JSON.stringify(template)
    });

    if (!response.ok) {
      throw new Error(`上传失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 搜索模板
   */
  async searchTemplates(
    query?: string,
    filters?: TemplateSearchFilters,
    page = 1,
    limit = 20
  ): Promise<{
    templates: SharedTemplate[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (query) {
      params.append('q', query);
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await this.makeRequest(`/templates/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`搜索失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取模板详情
   */
  async getTemplate(id: string): Promise<SharedTemplate> {
    const response = await this.makeRequest(`/templates/${id}`);
    
    if (!response.ok) {
      throw new Error(`获取模板失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 下载模板
   */
  async downloadTemplate(id: string): Promise<{
    template: SharedTemplate;
    files: { path: string; content: string }[];
  }> {
    const response = await this.makeRequest(`/templates/${id}/download`);
    
    if (!response.ok) {
      throw new Error(`下载失败: ${response.statusText}`);
    }

    // 记录下载次数
    await this.recordDownload(id);

    return response.json();
  }

  /**
   * 评价模板
   */
  async rateTemplate(
    templateId: string,
    rating: number,
    comment?: string
  ): Promise<Review> {
    if (rating < 1 || rating > 5) {
      throw new Error('评分必须在1-5之间');
    }

    const response = await this.makeRequest(`/templates/${templateId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });

    if (!response.ok) {
      throw new Error(`评价失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取用户的模板
   */
  async getUserTemplates(userId?: string): Promise<SharedTemplate[]> {
    const endpoint = userId ? `/users/${userId}/templates` : '/user/templates';
    const response = await this.makeRequest(endpoint);
    
    if (!response.ok) {
      throw new Error(`获取用户模板失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 更新模板
   */
  async updateTemplate(
    id: string,
    updates: Partial<TemplateUploadRequest>
  ): Promise<SharedTemplate> {
    const response = await this.makeRequest(`/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`更新失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 删除模板
   */
  async deleteTemplate(id: string): Promise<void> {
    const response = await this.makeRequest(`/templates/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`删除失败: ${response.statusText}`);
    }
  }

  /**
   * 获取热门模板
   */
  async getFeaturedTemplates(limit = 10): Promise<SharedTemplate[]> {
    const response = await this.makeRequest(`/templates/featured?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`获取热门模板失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取最新模板
   */
  async getRecentTemplates(limit = 10): Promise<SharedTemplate[]> {
    const response = await this.makeRequest(`/templates/recent?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`获取最新模板失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取分类统计
   */
  async getCategoryStats(): Promise<Record<string, number>> {
    const response = await this.makeRequest('/templates/stats/categories');
    
    if (!response.ok) {
      throw new Error(`获取分类统计失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 记录下载
   */
  private async recordDownload(templateId: string): Promise<void> {
    try {
      await this.makeRequest(`/templates/${templateId}/download`, {
        method: 'POST'
      });
    } catch (error) {
      // 下载记录失败不应该影响实际下载
      console.warn('记录下载失败:', error);
    }
  }

  /**
   * 发起 HTTP 请求
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.apiUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return fetch(url, {
      ...options,
      headers
    });
  }
}

/**
 * 本地模板管理器
 */
export class LocalTemplateManager {
  private storageKey = 'ai-templates';

  /**
   * 保存模板到本地
   */
  saveTemplate(template: Omit<SharedTemplate, 'id' | 'createdAt' | 'updatedAt'>): string {
    const templates = this.getLocalTemplates();
    const id = this.generateId();
    const now = new Date();

    const newTemplate: SharedTemplate = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now
    };

    templates.push(newTemplate);
    this.saveToStorage(templates);

    return id;
  }

  /**
   * 获取本地模板
   */
  getLocalTemplates(): SharedTemplate[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('读取本地模板失败:', error);
      return [];
    }
  }

  /**
   * 获取单个本地模板
   */
  getLocalTemplate(id: string): SharedTemplate | null {
    const templates = this.getLocalTemplates();
    return templates.find(t => t.id === id) || null;
  }

  /**
   * 更新本地模板
   */
  updateLocalTemplate(
    id: string,
    updates: Partial<SharedTemplate>
  ): boolean {
    const templates = this.getLocalTemplates();
    const index = templates.findIndex(t => t.id === id);

    if (index === -1) {
      return false;
    }

    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToStorage(templates);
    return true;
  }

  /**
   * 删除本地模板
   */
  deleteLocalTemplate(id: string): boolean {
    const templates = this.getLocalTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);

    if (filteredTemplates.length === templates.length) {
      return false; // 没有找到要删除的模板
    }

    this.saveToStorage(filteredTemplates);
    return true;
  }

  /**
   * 导出模板
   */
  exportTemplate(id: string): string {
    const template = this.getLocalTemplate(id);
    if (!template) {
      throw new Error('模板不存在');
    }

    return JSON.stringify(template, null, 2);
  }

  /**
   * 导入模板
   */
  importTemplate(templateJson: string): string {
    try {
      const template = JSON.parse(templateJson);
      
      // 验证模板格式
      if (!this.isValidTemplate(template)) {
        throw new Error('无效的模板格式');
      }

      // 移除 ID，让系统重新生成
      const { id, ...templateData } = template;
      
      return this.saveTemplate(templateData);
    } catch (error) {
      throw new Error(`导入模板失败: ${error.message}`);
    }
  }

  /**
   * 搜索本地模板
   */
  searchLocalTemplates(
    query?: string,
    filters?: TemplateSearchFilters
  ): SharedTemplate[] {
    let templates = this.getLocalTemplates();

    // 文本搜索
    if (query) {
      const lowerQuery = query.toLowerCase();
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // 应用过滤器
    if (filters) {
      if (filters.category) {
        templates = templates.filter(t => t.category === filters.category);
      }

      if (filters.tags && filters.tags.length > 0) {
        templates = templates.filter(t =>
          filters.tags!.some(tag => t.tags.includes(tag))
        );
      }

      if (filters.author) {
        templates = templates.filter(t => t.author.name === filters.author);
      }

      if (filters.minRating) {
        templates = templates.filter(t => t.rating >= filters.minRating!);
      }

      if (filters.license) {
        templates = templates.filter(t => t.license === filters.license);
      }
    }

    // 排序
    if (filters?.sortBy) {
      templates.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (filters.sortBy) {
          case 'downloads':
            aValue = a.downloads;
            bValue = b.downloads;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'recent':
            aValue = new Date(a.updatedAt).getTime();
            bValue = new Date(b.updatedAt).getTime();
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }

    return templates;
  }

  /**
   * 清空本地模板
   */
  clearLocalTemplates(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(templates: SharedTemplate[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(templates));
    } catch (error) {
      console.error('保存本地模板失败:', error);
      throw new Error('存储空间不足或其他存储错误');
    }
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 验证模板格式
   */
  private isValidTemplate(template: any): boolean {
    return (
      typeof template === 'object' &&
      typeof template.name === 'string' &&
      typeof template.description === 'string' &&
      typeof template.category === 'string' &&
      Array.isArray(template.tags) &&
      typeof template.code === 'string' &&
      typeof template.author === 'object' &&
      typeof template.author.name === 'string'
    );
  }
}

/**
 * 模板验证器
 */
export class TemplateValidator {
  /**
   * 验证模板代码
   */
  static async validateCode(code: string, category: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 基本语法检查
    if (!code.trim()) {
      errors.push('代码不能为空');
      return { isValid: false, errors, warnings };
    }

    // TypeScript 语法检查
    if (!code.includes('export')) {
      errors.push('代码必须包含 export 语句');
    }

    // React 组件检查
    if (category === 'component') {
      if (!code.includes('React') && !code.includes('react')) {
        warnings.push('组件代码建议导入 React');
      }

      if (!code.includes('interface') && !code.includes('type')) {
        warnings.push('建议为组件定义 TypeScript 类型');
      }

      if (!code.includes('forwardRef')) {
        warnings.push('建议使用 forwardRef 以支持 ref 传递');
      }
    }

    // Hook 检查
    if (category === 'hook') {
      if (!code.includes('use')) {
        errors.push('Hook 名称必须以 "use" 开头');
      }

      if (!code.includes('useState') && !code.includes('useEffect') && !code.includes('useCallback')) {
        warnings.push('Hook 通常应该使用 React Hooks');
      }
    }

    // 安全检查
    if (code.includes('eval(') || code.includes('Function(')) {
      errors.push('代码不能包含 eval 或 Function 构造函数');
    }

    if (code.includes('dangerouslySetInnerHTML')) {
      warnings.push('使用 dangerouslySetInnerHTML 可能存在 XSS 风险');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 验证依赖项
   */
  static validateDependencies(dependencies: string[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const allowedPackages = [
      'react',
      'react-dom',
      'next',
      '@radix-ui',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'react-hook-form',
      'zod',
      '@hookform/resolvers'
    ];

    dependencies.forEach(dep => {
      const packageName = dep.split('@')[0];
      
      if (!allowedPackages.some(allowed => packageName.startsWith(allowed))) {
        warnings.push(`依赖 "${dep}" 可能不被支持`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// 创建默认实例
export const templateSharingService = new TemplateSharingService(
  process.env.NEXT_PUBLIC_TEMPLATE_API_URL || '/api/templates'
);

export const localTemplateManager = new LocalTemplateManager();