/**
 * Component Metadata System
 * 
 * Manages metadata for generated components, tracks usage patterns,
 * and provides analytics for AI component generation.
 */

import { AIComponentConfig } from '@/types/ai-component';
import { ComponentGenerationRequest, GeneratedComponent } from './ai-component-generator';

export interface ComponentMetadata {
  /** Component ID */
  id: string;
  /** Component name */
  name: string;
  /** Generation timestamp */
  createdAt: Date;
  /** Last modified timestamp */
  updatedAt: Date;
  /** Generation request that created this component */
  generationRequest: ComponentGenerationRequest;
  /** Generated component data */
  generatedComponent: GeneratedComponent;
  /** Usage statistics */
  usage: ComponentUsageStats;
  /** Quality metrics */
  quality: ComponentQualityMetrics;
  /** User feedback */
  feedback: ComponentFeedback[];
  /** Version history */
  versions: ComponentVersion[];
  /** Tags for categorization */
  tags: string[];
  /** Component status */
  status: 'draft' | 'active' | 'deprecated' | 'archived';
}

export interface ComponentUsageStats {
  /** Number of times component was generated */
  generationCount: number;
  /** Number of times component was used in projects */
  usageCount: number;
  /** Last used timestamp */
  lastUsed?: Date;
  /** Projects using this component */
  projects: string[];
  /** Popular variants */
  popularVariants: Record<string, number>;
  /** Common prop combinations */
  commonProps: Record<string, number>;
}

export interface ComponentQualityMetrics {
  /** Code quality score (0-100) */
  codeQuality: number;
  /** Accessibility score (0-100) */
  accessibility: number;
  /** Performance score (0-100) */
  performance: number;
  /** Maintainability score (0-100) */
  maintainability: number;
  /** Test coverage percentage */
  testCoverage: number;
  /** Bundle size impact */
  bundleSize: number;
}

export interface ComponentFeedback {
  /** Feedback ID */
  id: string;
  /** User ID */
  userId: string;
  /** Feedback type */
  type: 'bug' | 'improvement' | 'feature' | 'praise';
  /** Feedback content */
  content: string;
  /** Rating (1-5) */
  rating?: number;
  /** Timestamp */
  createdAt: Date;
  /** Status */
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
}

export interface ComponentVersion {
  /** Version number */
  version: string;
  /** Changes made */
  changes: string[];
  /** Timestamp */
  createdAt: Date;
  /** Component code at this version */
  code: string;
  /** Breaking changes */
  breakingChanges: boolean;
}

export interface ComponentAnalytics {
  /** Total components generated */
  totalComponents: number;
  /** Components by category */
  componentsByCategory: Record<string, number>;
  /** Most popular components */
  popularComponents: Array<{ name: string; count: number }>;
  /** Average quality scores */
  averageQuality: ComponentQualityMetrics;
  /** Generation trends */
  generationTrends: Array<{ date: string; count: number }>;
  /** User satisfaction */
  userSatisfaction: number;
}

/**
 * Component Metadata Manager
 */
export class ComponentMetadataManager {
  private metadata = new Map<string, ComponentMetadata>();
  private analytics: ComponentAnalytics | null = null;

  /**
   * Register a new generated component
   */
  registerComponent(
    request: ComponentGenerationRequest,
    generated: GeneratedComponent
  ): ComponentMetadata {
    const id = this.generateComponentId(request.name);
    const now = new Date();

    const metadata: ComponentMetadata = {
      id,
      name: request.name,
      createdAt: now,
      updatedAt: now,
      generationRequest: request,
      generatedComponent: generated,
      usage: {
        generationCount: 1,
        usageCount: 0,
        projects: [],
        popularVariants: {},
        commonProps: {}
      },
      quality: this.calculateQualityMetrics(generated),
      feedback: [],
      versions: [{
        version: '1.0.0',
        changes: ['Initial generation'],
        createdAt: now,
        code: generated.code,
        breakingChanges: false
      }],
      tags: this.generateTags(request),
      status: 'draft'
    };

    this.metadata.set(id, metadata);
    this.invalidateAnalytics();
    
    return metadata;
  }

  /**
   * Update component metadata
   */
  updateComponent(
    id: string,
    updates: Partial<ComponentMetadata>
  ): ComponentMetadata | null {
    const existing = this.metadata.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.metadata.set(id, updated);
    this.invalidateAnalytics();
    
    return updated;
  }

  /**
   * Get component metadata by ID
   */
  getComponent(id: string): ComponentMetadata | null {
    return this.metadata.get(id) || null;
  }

  /**
   * Get component metadata by name
   */
  getComponentByName(name: string): ComponentMetadata | null {
    for (const [, metadata] of this.metadata) {
      if (metadata.name === name) {
        return metadata;
      }
    }
    return null;
  }

  /**
   * Get all components
   */
  getAllComponents(): ComponentMetadata[] {
    return Array.from(this.metadata.values());
  }

  /**
   * Search components
   */
  searchComponents(criteria: {
    name?: string;
    category?: string;
    tags?: string[];
    status?: ComponentMetadata['status'];
    minQuality?: number;
  }): ComponentMetadata[] {
    return this.getAllComponents().filter(component => {
      if (criteria.name && !component.name.toLowerCase().includes(criteria.name.toLowerCase())) {
        return false;
      }
      
      if (criteria.category && component.generationRequest.type !== criteria.category) {
        return false;
      }
      
      if (criteria.tags && !criteria.tags.some(tag => component.tags.includes(tag))) {
        return false;
      }
      
      if (criteria.status && component.status !== criteria.status) {
        return false;
      }
      
      if (criteria.minQuality && component.quality.codeQuality < criteria.minQuality) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Record component usage
   */
  recordUsage(id: string, context: {
    project?: string;
    variants?: Record<string, string>;
    props?: Record<string, any>;
  }): void {
    const component = this.metadata.get(id);
    if (!component) return;

    component.usage.usageCount++;
    component.usage.lastUsed = new Date();

    if (context.project && !component.usage.projects.includes(context.project)) {
      component.usage.projects.push(context.project);
    }

    if (context.variants) {
      Object.entries(context.variants).forEach(([variant, value]) => {
        const key = `${variant}:${value}`;
        component.usage.popularVariants[key] = (component.usage.popularVariants[key] || 0) + 1;
      });
    }

    if (context.props) {
      const propsKey = Object.keys(context.props).sort().join(',');
      component.usage.commonProps[propsKey] = (component.usage.commonProps[propsKey] || 0) + 1;
    }

    this.updateComponent(id, { usage: component.usage });
  }

  /**
   * Add feedback for a component
   */
  addFeedback(id: string, feedback: Omit<ComponentFeedback, 'id' | 'createdAt'>): void {
    const component = this.metadata.get(id);
    if (!component) return;

    const newFeedback: ComponentFeedback = {
      ...feedback,
      id: this.generateFeedbackId(),
      createdAt: new Date()
    };

    component.feedback.push(newFeedback);
    this.updateComponent(id, { feedback: component.feedback });
  }

  /**
   * Create new version of component
   */
  createVersion(
    id: string,
    version: string,
    changes: string[],
    code: string,
    breakingChanges = false
  ): void {
    const component = this.metadata.get(id);
    if (!component) return;

    const newVersion: ComponentVersion = {
      version,
      changes,
      createdAt: new Date(),
      code,
      breakingChanges
    };

    component.versions.push(newVersion);
    this.updateComponent(id, { versions: component.versions });
  }

  /**
   * Get component analytics
   */
  getAnalytics(): ComponentAnalytics {
    if (!this.analytics) {
      this.analytics = this.calculateAnalytics();
    }
    return this.analytics;
  }

  /**
   * Export metadata for backup
   */
  exportMetadata(): ComponentMetadata[] {
    return this.getAllComponents();
  }

  /**
   * Import metadata from backup
   */
  importMetadata(data: ComponentMetadata[]): void {
    this.metadata.clear();
    data.forEach(metadata => {
      this.metadata.set(metadata.id, metadata);
    });
    this.invalidateAnalytics();
  }

  /**
   * Get component recommendations based on usage patterns
   */
  getRecommendations(context: {
    category?: string;
    project?: string;
    similarTo?: string;
  }): ComponentMetadata[] {
    const components = this.getAllComponents();
    
    // Score components based on various factors
    const scored = components.map(component => {
      let score = 0;
      
      // Base quality score
      score += component.quality.codeQuality * 0.3;
      
      // Usage popularity
      score += Math.min(component.usage.usageCount * 10, 100) * 0.2;
      
      // Category match
      if (context.category && component.generationRequest.type === context.category) {
        score += 50;
      }
      
      // Project usage
      if (context.project && component.usage.projects.includes(context.project)) {
        score += 30;
      }
      
      // Similarity (basic implementation)
      if (context.similarTo) {
        const similar = this.getComponentByName(context.similarTo);
        if (similar && this.areComponentsSimilar(component, similar)) {
          score += 40;
        }
      }
      
      // Recent activity
      const daysSinceUpdate = (Date.now() - component.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 30) {
        score += 20;
      }
      
      return { component, score };
    });
    
    // Sort by score and return top recommendations
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.component);
  }

  /**
   * Private helper methods
   */
  private generateComponentId(name: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}-${random}`;
  }

  private generateFeedbackId(): string {
    return `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTags(request: ComponentGenerationRequest): string[] {
    const tags = [request.type];
    
    if (request.styling?.responsive) tags.push('responsive');
    if (request.styling?.darkMode) tags.push('dark-mode');
    if (request.functionality?.interactive) tags.push('interactive');
    if (request.functionality?.validation) tags.push('validation');
    if (request.functionality?.accessibility) tags.push('accessible');
    
    return tags;
  }

  private calculateQualityMetrics(generated: GeneratedComponent): ComponentQualityMetrics {
    // Basic quality calculation - can be enhanced with actual analysis
    const codeLength = generated.code.length;
    const hasTests = !!generated.tests;
    const hasDocumentation = !!generated.documentation;
    const hasAccessibility = generated.config.accessibility?.ariaAttributes.length > 0;
    
    return {
      codeQuality: Math.min(100, 70 + (hasTests ? 15 : 0) + (hasDocumentation ? 10 : 0) + (codeLength > 500 ? 5 : 0)),
      accessibility: hasAccessibility ? 85 : 60,
      performance: 80, // Default score
      maintainability: hasDocumentation ? 85 : 70,
      testCoverage: hasTests ? 80 : 0,
      bundleSize: Math.max(1, Math.floor(codeLength / 100)) // Rough estimate
    };
  }

  private calculateAnalytics(): ComponentAnalytics {
    const components = this.getAllComponents();
    
    const componentsByCategory = components.reduce((acc, comp) => {
      const category = comp.generationRequest.type;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularComponents = components
      .sort((a, b) => b.usage.usageCount - a.usage.usageCount)
      .slice(0, 10)
      .map(comp => ({ name: comp.name, count: comp.usage.usageCount }));
    
    const totalQuality = components.reduce((acc, comp) => ({
      codeQuality: acc.codeQuality + comp.quality.codeQuality,
      accessibility: acc.accessibility + comp.quality.accessibility,
      performance: acc.performance + comp.quality.performance,
      maintainability: acc.maintainability + comp.quality.maintainability,
      testCoverage: acc.testCoverage + comp.quality.testCoverage,
      bundleSize: acc.bundleSize + comp.quality.bundleSize
    }), {
      codeQuality: 0,
      accessibility: 0,
      performance: 0,
      maintainability: 0,
      testCoverage: 0,
      bundleSize: 0
    });
    
    const averageQuality: ComponentQualityMetrics = {
      codeQuality: totalQuality.codeQuality / components.length || 0,
      accessibility: totalQuality.accessibility / components.length || 0,
      performance: totalQuality.performance / components.length || 0,
      maintainability: totalQuality.maintainability / components.length || 0,
      testCoverage: totalQuality.testCoverage / components.length || 0,
      bundleSize: totalQuality.bundleSize / components.length || 0
    };
    
    // Calculate user satisfaction from feedback
    const allFeedback = components.flatMap(comp => comp.feedback);
    const ratingsSum = allFeedback.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
    const userSatisfaction = allFeedback.length > 0 ? ratingsSum / allFeedback.length : 0;
    
    return {
      totalComponents: components.length,
      componentsByCategory,
      popularComponents,
      averageQuality,
      generationTrends: [], // Would need time-series data
      userSatisfaction
    };
  }

  private areComponentsSimilar(comp1: ComponentMetadata, comp2: ComponentMetadata): boolean {
    // Basic similarity check - can be enhanced
    return comp1.generationRequest.type === comp2.generationRequest.type &&
           comp1.tags.some(tag => comp2.tags.includes(tag));
  }

  private invalidateAnalytics(): void {
    this.analytics = null;
  }
}

// Export singleton instance
export const componentMetadataManager = new ComponentMetadataManager();