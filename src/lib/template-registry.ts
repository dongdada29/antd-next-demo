/**
 * Template Registry System
 * Manages template versions, distribution, and updates
 */

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'component' | 'page' | 'layout' | 'hook' | 'utility';
  tags: string[];
  dependencies: string[];
  compatibility: {
    nextjs: string;
    react: string;
    typescript: string;
  };
  created: string;
  updated: string;
  downloads: number;
  rating: number;
  license: string;
  repository?: string;
  homepage?: string;
  preview?: string;
}

export interface TemplateFile {
  path: string;
  content: string;
  type: 'typescript' | 'javascript' | 'css' | 'json' | 'markdown';
}

export interface Template {
  metadata: TemplateMetadata;
  files: TemplateFile[];
  examples?: TemplateFile[];
  tests?: TemplateFile[];
  documentation?: string;
}

export interface TemplateVersion {
  version: string;
  changelog: string;
  breaking: boolean;
  deprecated: boolean;
  releaseDate: string;
  downloadUrl: string;
}

export class TemplateRegistry {
  private baseUrl: string;
  private apiKey?: string;
  private cache: Map<string, Template> = new Map();
  private versionCache: Map<string, TemplateVersion[]> = new Map();

  constructor(baseUrl: string = 'https://api.ai-template-registry.com', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Search templates by query, category, or tags
   */
  async searchTemplates(query: {
    search?: string;
    category?: string;
    tags?: string[];
    author?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ templates: TemplateMetadata[]; total: number }> {
    const params = new URLSearchParams();
    
    if (query.search) params.append('search', query.search);
    if (query.category) params.append('category', query.category);
    if (query.tags) params.append('tags', query.tags.join(','));
    if (query.author) params.append('author', query.author);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());

    const response = await fetch(`${this.baseUrl}/templates/search?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to search templates: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get template by ID
   */
  async getTemplate(id: string, version?: string): Promise<Template> {
    const cacheKey = `${id}@${version || 'latest'}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const url = version 
      ? `${this.baseUrl}/templates/${id}/versions/${version}`
      : `${this.baseUrl}/templates/${id}`;

    const response = await fetch(url, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get template: ${response.statusText}`);
    }

    const template = await response.json();
    this.cache.set(cacheKey, template);
    
    return template;
  }

  /**
   * Get template versions
   */
  async getTemplateVersions(id: string): Promise<TemplateVersion[]> {
    if (this.versionCache.has(id)) {
      return this.versionCache.get(id)!;
    }

    const response = await fetch(`${this.baseUrl}/templates/${id}/versions`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get template versions: ${response.statusText}`);
    }

    const versions = await response.json();
    this.versionCache.set(id, versions);
    
    return versions;
  }

  /**
   * Download template
   */
  async downloadTemplate(id: string, version?: string): Promise<Template> {
    const template = await this.getTemplate(id, version);
    
    // Track download
    await this.trackDownload(id, version);
    
    return template;
  }

  /**
   * Publish template (requires API key)
   */
  async publishTemplate(template: Template): Promise<{ success: boolean; id: string }> {
    if (!this.apiKey) {
      throw new Error('API key required for publishing templates');
    }

    const response = await fetch(`${this.baseUrl}/templates`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(template)
    });

    if (!response.ok) {
      throw new Error(`Failed to publish template: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update template (requires API key)
   */
  async updateTemplate(id: string, template: Partial<Template>): Promise<{ success: boolean }> {
    if (!this.apiKey) {
      throw new Error('API key required for updating templates');
    }

    const response = await fetch(`${this.baseUrl}/templates/${id}`, {
      method: 'PATCH',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(template)
    });

    if (!response.ok) {
      throw new Error(`Failed to update template: ${response.statusText}`);
    }

    // Clear cache
    this.clearCache(id);

    return response.json();
  }

  /**
   * Delete template (requires API key)
   */
  async deleteTemplate(id: string): Promise<{ success: boolean }> {
    if (!this.apiKey) {
      throw new Error('API key required for deleting templates');
    }

    const response = await fetch(`${this.baseUrl}/templates/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to delete template: ${response.statusText}`);
    }

    // Clear cache
    this.clearCache(id);

    return response.json();
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit: number = 10): Promise<TemplateMetadata[]> {
    const response = await fetch(`${this.baseUrl}/templates/popular?limit=${limit}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get popular templates: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get recent templates
   */
  async getRecentTemplates(limit: number = 10): Promise<TemplateMetadata[]> {
    const response = await fetch(`${this.baseUrl}/templates/recent?limit=${limit}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get recent templates: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Rate template
   */
  async rateTemplate(id: string, rating: number): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/templates/${id}/rate`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating })
    });

    if (!response.ok) {
      throw new Error(`Failed to rate template: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Check for template updates
   */
  async checkUpdates(installedTemplates: { id: string; version: string }[]): Promise<{
    id: string;
    currentVersion: string;
    latestVersion: string;
    hasUpdate: boolean;
    breaking: boolean;
  }[]> {
    const response = await fetch(`${this.baseUrl}/templates/check-updates`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ templates: installedTemplates })
    });

    if (!response.ok) {
      throw new Error(`Failed to check updates: ${response.statusText}`);
    }

    return response.json();
  }

  private async trackDownload(id: string, version?: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/templates/${id}/download`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ version })
      });
    } catch (error) {
      // Don't fail download if tracking fails
      console.warn('Failed to track download:', error);
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'AI-Template-CLI/1.0.0'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  private clearCache(id: string): void {
    // Clear all cached versions of this template
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${id}@`)) {
        this.cache.delete(key);
      }
    }
    this.versionCache.delete(id);
  }
}

// Default registry instance
export const templateRegistry = new TemplateRegistry();

// Template validation utilities
export class TemplateValidator {
  static validateMetadata(metadata: TemplateMetadata): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!metadata.id || !/^[a-z0-9-]+$/.test(metadata.id)) {
      errors.push('Template ID must contain only lowercase letters, numbers, and hyphens');
    }

    if (!metadata.name || metadata.name.length < 3) {
      errors.push('Template name must be at least 3 characters long');
    }

    if (!metadata.description || metadata.description.length < 10) {
      errors.push('Template description must be at least 10 characters long');
    }

    if (!metadata.version || !/^\d+\.\d+\.\d+/.test(metadata.version)) {
      errors.push('Template version must follow semantic versioning (e.g., 1.0.0)');
    }

    if (!metadata.author || metadata.author.length < 2) {
      errors.push('Template author is required');
    }

    if (!['component', 'page', 'layout', 'hook', 'utility'].includes(metadata.category)) {
      errors.push('Template category must be one of: component, page, layout, hook, utility');
    }

    if (!metadata.license) {
      errors.push('Template license is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateTemplate(template: Template): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate metadata
    const metadataValidation = this.validateMetadata(template.metadata);
    errors.push(...metadataValidation.errors);

    // Validate files
    if (!template.files || template.files.length === 0) {
      errors.push('Template must contain at least one file');
    }

    // Check for required files based on category
    const hasMainFile = template.files.some(file => 
      file.path.includes('index.') || file.path.includes(template.metadata.name)
    );

    if (!hasMainFile) {
      errors.push('Template must contain a main file (index.* or named after template)');
    }

    // Validate file paths
    for (const file of template.files) {
      if (!file.path || file.path.includes('..')) {
        errors.push(`Invalid file path: ${file.path}`);
      }

      if (!file.content) {
        errors.push(`File content is required: ${file.path}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}