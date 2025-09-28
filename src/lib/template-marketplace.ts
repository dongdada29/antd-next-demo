/**
 * Template Marketplace System
 * Provides marketplace functionality for template discovery and management
 */

import { templateRegistry, TemplateMetadata, Template } from './template-registry';

export interface MarketplaceConfig {
  apiUrl: string;
  apiKey?: string;
  cacheTimeout: number;
  maxConcurrentDownloads: number;
}

export interface TemplateCollection {
  id: string;
  name: string;
  description: string;
  templates: string[];
  author: string;
  created: string;
  updated: string;
}

export interface TemplateStats {
  totalTemplates: number;
  totalDownloads: number;
  categoryCounts: Record<string, number>;
  popularTags: { tag: string; count: number }[];
  recentActivity: {
    date: string;
    downloads: number;
    uploads: number;
  }[];
}

export class TemplateMarketplace {
  private config: MarketplaceConfig;
  private downloadQueue: Map<string, Promise<Template>> = new Map();

  constructor(config: Partial<MarketplaceConfig> = {}) {
    this.config = {
      apiUrl: 'https://api.ai-template-marketplace.com',
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      maxConcurrentDownloads: 3,
      ...config
    };
  }

  /**
   * Browse templates with advanced filtering
   */
  async browseTemplates(filters: {
    category?: string;
    tags?: string[];
    author?: string;
    minRating?: number;
    sortBy?: 'popularity' | 'rating' | 'recent' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  } = {}): Promise<{
    templates: TemplateMetadata[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }> {
    const {
      category,
      tags,
      author,
      minRating,
      sortBy = 'popularity',
      sortOrder = 'desc',
      page = 1,
      pageSize = 20
    } = filters;

    const params = new URLSearchParams({
      sortBy,
      sortOrder,
      page: page.toString(),
      pageSize: pageSize.toString()
    });

    if (category) params.append('category', category);
    if (tags?.length) params.append('tags', tags.join(','));
    if (author) params.append('author', author);
    if (minRating) params.append('minRating', minRating.toString());

    const response = await fetch(`${this.config.apiUrl}/marketplace/browse?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to browse templates: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      ...data,
      hasMore: (page * pageSize) < data.total
    };
  }

  /**
   * Get featured templates
   */
  async getFeaturedTemplates(): Promise<TemplateMetadata[]> {
    const response = await fetch(`${this.config.apiUrl}/marketplace/featured`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get featured templates: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get template collections
   */
  async getCollections(): Promise<TemplateCollection[]> {
    const response = await fetch(`${this.config.apiUrl}/marketplace/collections`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get collections: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get collection by ID
   */
  async getCollection(id: string): Promise<TemplateCollection & { templates: TemplateMetadata[] }> {
    const response = await fetch(`${this.config.apiUrl}/marketplace/collections/${id}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get collection: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get marketplace statistics
   */
  async getStats(): Promise<TemplateStats> {
    const response = await fetch(`${this.config.apiUrl}/marketplace/stats`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get marketplace stats: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search templates with advanced search capabilities
   */
  async searchTemplates(query: string, filters: {
    category?: string;
    tags?: string[];
    author?: string;
    minRating?: number;
    includeDescription?: boolean;
    includeCode?: boolean;
  } = {}): Promise<{
    templates: TemplateMetadata[];
    suggestions: string[];
    total: number;
  }> {
    const params = new URLSearchParams({ query });
    
    if (filters.category) params.append('category', filters.category);
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters.author) params.append('author', filters.author);
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.includeDescription) params.append('includeDescription', 'true');
    if (filters.includeCode) params.append('includeCode', 'true');

    const response = await fetch(`${this.config.apiUrl}/marketplace/search?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to search templates: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get similar templates
   */
  async getSimilarTemplates(templateId: string, limit: number = 5): Promise<TemplateMetadata[]> {
    const response = await fetch(
      `${this.config.apiUrl}/marketplace/templates/${templateId}/similar?limit=${limit}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to get similar templates: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get template recommendations based on user activity
   */
  async getRecommendations(userId?: string, limit: number = 10): Promise<TemplateMetadata[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (userId) params.append('userId', userId);

    const response = await fetch(`${this.config.apiUrl}/marketplace/recommendations?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Download template with queue management
   */
  async downloadTemplate(templateId: string, version?: string): Promise<Template> {
    const queueKey = `${templateId}@${version || 'latest'}`;
    
    // Check if already downloading
    if (this.downloadQueue.has(queueKey)) {
      return this.downloadQueue.get(queueKey)!;
    }

    // Check queue size
    if (this.downloadQueue.size >= this.config.maxConcurrentDownloads) {
      throw new Error('Maximum concurrent downloads reached. Please try again later.');
    }

    // Start download
    const downloadPromise = this.performDownload(templateId, version);
    this.downloadQueue.set(queueKey, downloadPromise);

    try {
      const template = await downloadPromise;
      return template;
    } finally {
      this.downloadQueue.delete(queueKey);
    }
  }

  /**
   * Bulk download templates
   */
  async downloadTemplates(templates: { id: string; version?: string }[]): Promise<{
    successful: Template[];
    failed: { id: string; error: string }[];
  }> {
    const successful: Template[] = [];
    const failed: { id: string; error: string }[] = [];

    // Process in batches to respect concurrent download limit
    const batchSize = this.config.maxConcurrentDownloads;
    
    for (let i = 0; i < templates.length; i += batchSize) {
      const batch = templates.slice(i, i + batchSize);
      
      const promises = batch.map(async ({ id, version }) => {
        try {
          const template = await this.downloadTemplate(id, version);
          successful.push(template);
        } catch (error) {
          failed.push({
            id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      await Promise.all(promises);
    }

    return { successful, failed };
  }

  /**
   * Install template locally
   */
  async installTemplate(templateId: string, version?: string, targetPath?: string): Promise<{
    success: boolean;
    installedFiles: string[];
    errors: string[];
  }> {
    const template = await this.downloadTemplate(templateId, version);
    
    const installedFiles: string[] = [];
    const errors: string[] = [];

    try {
      // Install template files
      for (const file of template.files) {
        try {
          const filePath = targetPath 
            ? `${targetPath}/${file.path}`
            : file.path;

          // Create directory if needed
          const fs = await import('fs/promises');
          const path = await import('path');
          
          const dir = path.dirname(filePath);
          await fs.mkdir(dir, { recursive: true });
          
          // Write file
          await fs.writeFile(filePath, file.content, 'utf8');
          installedFiles.push(filePath);
        } catch (error) {
          errors.push(`Failed to install ${file.path}: ${error}`);
        }
      }

      // Update local template registry
      await this.updateLocalRegistry(template);

      return {
        success: errors.length === 0,
        installedFiles,
        errors
      };
    } catch (error) {
      errors.push(`Installation failed: ${error}`);
      return {
        success: false,
        installedFiles,
        errors
      };
    }
  }

  /**
   * Uninstall template
   */
  async uninstallTemplate(templateId: string): Promise<{
    success: boolean;
    removedFiles: string[];
    errors: string[];
  }> {
    const removedFiles: string[] = [];
    const errors: string[] = [];

    try {
      // Get installed template info
      const installedTemplate = await this.getInstalledTemplate(templateId);
      
      if (!installedTemplate) {
        throw new Error('Template not found in local registry');
      }

      // Remove files
      const fs = await import('fs/promises');
      
      for (const file of installedTemplate.files) {
        try {
          await fs.unlink(file.path);
          removedFiles.push(file.path);
        } catch (error) {
          errors.push(`Failed to remove ${file.path}: ${error}`);
        }
      }

      // Remove from local registry
      await this.removeFromLocalRegistry(templateId);

      return {
        success: errors.length === 0,
        removedFiles,
        errors
      };
    } catch (error) {
      errors.push(`Uninstallation failed: ${error}`);
      return {
        success: false,
        removedFiles,
        errors
      };
    }
  }

  /**
   * Check for template updates
   */
  async checkForUpdates(): Promise<{
    id: string;
    name: string;
    currentVersion: string;
    latestVersion: string;
    hasUpdate: boolean;
    breaking: boolean;
    changelog?: string;
  }[]> {
    const installedTemplates = await this.getInstalledTemplates();
    
    if (installedTemplates.length === 0) {
      return [];
    }

    return templateRegistry.checkUpdates(
      installedTemplates.map(t => ({ id: t.metadata.id, version: t.metadata.version }))
    );
  }

  private async performDownload(templateId: string, version?: string): Promise<Template> {
    return templateRegistry.downloadTemplate(templateId, version);
  }

  private async updateLocalRegistry(template: Template): Promise<void> {
    // Implementation would store template info locally
    // This could be in a local database, file system, or cache
    console.log(`Updated local registry for template: ${template.metadata.id}`);
  }

  private async removeFromLocalRegistry(templateId: string): Promise<void> {
    // Implementation would remove template info from local storage
    console.log(`Removed from local registry: ${templateId}`);
  }

  private async getInstalledTemplate(templateId: string): Promise<Template | null> {
    // Implementation would retrieve template from local storage
    return null;
  }

  private async getInstalledTemplates(): Promise<Template[]> {
    // Implementation would retrieve all installed templates
    return [];
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'AI-Template-Marketplace/1.0.0',
      'Content-Type': 'application/json'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }
}

// Default marketplace instance
export const templateMarketplace = new TemplateMarketplace();