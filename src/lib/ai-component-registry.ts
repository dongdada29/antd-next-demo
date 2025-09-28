/**
 * AI Component Registry
 * 
 * Central registry for managing AI-friendly component configurations,
 * templates, and generation logic.
 */

import { 
  AIComponentConfig, 
  ComponentTemplate, 
  ComponentRegistry, 
  ComponentCategory,
  AIGenerationContext 
} from '@/types/ai-component';

class AIComponentRegistryManager implements ComponentRegistry {
  public components = new Map<string, AIComponentConfig>();
  public templates = new Map<string, ComponentTemplate>();
  public categories: ComponentCategory[] = [];

  /**
   * Register a new component configuration
   */
  registerComponent(config: AIComponentConfig): void {
    this.components.set(config.name, config);
    this.updateCategories(config);
  }

  /**
   * Register a new component template
   */
  registerTemplate(template: ComponentTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Get component configuration by name
   */
  getComponent(name: string): AIComponentConfig | undefined {
    return this.components.get(name);
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): ComponentTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all components by category
   */
  getComponentsByCategory(categoryId: string): AIComponentConfig[] {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    return category.components
      .map(name => this.components.get(name))
      .filter(Boolean) as AIComponentConfig[];
  }

  /**
   * Search components by criteria
   */
  searchComponents(criteria: {
    type?: string;
    name?: string;
    description?: string;
  }): AIComponentConfig[] {
    const results: AIComponentConfig[] = [];

    for (const [, config] of this.components) {
      let matches = true;

      if (criteria.type && config.type !== criteria.type) {
        matches = false;
      }

      if (criteria.name && !config.name.toLowerCase().includes(criteria.name.toLowerCase())) {
        matches = false;
      }

      if (criteria.description && !config.description.toLowerCase().includes(criteria.description.toLowerCase())) {
        matches = false;
      }

      if (matches) {
        results.push(config);
      }
    }

    return results;
  }

  /**
   * Get component suggestions based on context
   */
  getSuggestions(context: AIGenerationContext): AIComponentConfig[] {
    const suggestions: AIComponentConfig[] = [];

    // Find components that match the requirements
    for (const [, config] of this.components) {
      if (this.matchesContext(config, context)) {
        suggestions.push(config);
      }
    }

    // Sort by relevance (simple scoring for now)
    return suggestions.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, context);
      const scoreB = this.calculateRelevanceScore(b, context);
      return scoreB - scoreA;
    });
  }

  /**
   * Generate component code using template
   */
  generateComponent(
    templateId: string, 
    variables: Record<string, any>,
    context: AIGenerationContext
  ): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    let code = template.template;

    // Replace template variables
    for (const variable of template.variables) {
      const value = variables[variable.name] ?? variable.defaultValue;
      const placeholder = `{{${variable.name}}}`;
      code = code.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return code;
  }

  /**
   * Validate component configuration
   */
  validateComponent(config: AIComponentConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.name) {
      errors.push('Component name is required');
    }

    if (!config.type) {
      errors.push('Component type is required');
    }

    if (!config.description) {
      errors.push('Component description is required');
    }

    if (!config.props || config.props.length === 0) {
      errors.push('Component must have at least one prop definition');
    }

    // Validate props
    config.props?.forEach((prop, index) => {
      if (!prop.name) {
        errors.push(`Prop at index ${index} is missing name`);
      }
      if (!prop.type) {
        errors.push(`Prop at index ${index} is missing type`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Export registry data
   */
  export(): {
    components: AIComponentConfig[];
    templates: ComponentTemplate[];
    categories: ComponentCategory[];
  } {
    return {
      components: Array.from(this.components.values()),
      templates: Array.from(this.templates.values()),
      categories: this.categories
    };
  }

  /**
   * Import registry data
   */
  import(data: {
    components?: AIComponentConfig[];
    templates?: ComponentTemplate[];
    categories?: ComponentCategory[];
  }): void {
    if (data.components) {
      data.components.forEach(config => this.registerComponent(config));
    }

    if (data.templates) {
      data.templates.forEach(template => this.registerTemplate(template));
    }

    if (data.categories) {
      this.categories = data.categories;
    }
  }

  private updateCategories(config: AIComponentConfig): void {
    let category = this.categories.find(cat => cat.id === config.type);
    
    if (!category) {
      category = {
        id: config.type,
        name: this.formatCategoryName(config.type),
        description: `${this.formatCategoryName(config.type)} components`,
        components: []
      };
      this.categories.push(category);
    }

    if (!category.components.includes(config.name)) {
      category.components.push(config.name);
    }
  }

  private formatCategoryName(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  private matchesContext(config: AIComponentConfig, context: AIGenerationContext): boolean {
    // Simple matching logic - can be enhanced
    if (context.componentType && config.type !== context.componentType) {
      return false;
    }

    // Check if requirements mention this component
    const requirements = context.requirements.toLowerCase();
    const componentName = config.name.toLowerCase();
    const description = config.description.toLowerCase();

    return requirements.includes(componentName) || 
           requirements.includes(description) ||
           config.prompts.generation.toLowerCase().includes(requirements);
  }

  private calculateRelevanceScore(config: AIComponentConfig, context: AIGenerationContext): number {
    let score = 0;

    // Type match
    if (config.type === context.componentType) {
      score += 10;
    }

    // Name/description relevance
    const requirements = context.requirements.toLowerCase();
    if (config.name.toLowerCase().includes(requirements)) {
      score += 8;
    }
    if (config.description.toLowerCase().includes(requirements)) {
      score += 5;
    }

    // Complexity preference (simpler components get higher score for basic requirements)
    if (requirements.includes('simple') || requirements.includes('basic')) {
      score += config.props.length <= 3 ? 3 : -2;
    }

    return score;
  }
}

// Singleton instance
export const aiComponentRegistry = new AIComponentRegistryManager();

// Helper functions for AI agents
export const AIComponentHelpers = {
  /**
   * Find the best component for a given requirement
   */
  findBestComponent(requirement: string, type?: string): AIComponentConfig | null {
    const context: AIGenerationContext = {
      componentType: type || 'ui',
      requirements: requirement,
      projectContext: {
        name: 'current-project',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
        designSystem: 'shadcn/ui',
        existingComponents: [],
        conventions: {
          naming: 'PascalCase',
          fileOrganization: 'feature-based',
          importStyle: 'named',
          testing: 'unit'
        }
      },
      stylePreferences: {
        colorScheme: 'auto',
        size: 'md',
        borderRadius: 'md',
        animations: true
      }
    };

    const suggestions = aiComponentRegistry.getSuggestions(context);
    return suggestions.length > 0 ? suggestions[0] : null;
  },

  /**
   * Generate component with AI-friendly defaults
   */
  generateComponentCode(
    componentName: string,
    props: Record<string, any> = {},
    options: {
      includeTypes?: boolean;
      includeTests?: boolean;
      includeStories?: boolean;
    } = {}
  ): string {
    const config = aiComponentRegistry.getComponent(componentName);
    if (!config) {
      throw new Error(`Component not found: ${componentName}`);
    }

    // Find appropriate template
    const templateId = `${config.type}-component`;
    const template = aiComponentRegistry.getTemplate(templateId);
    
    if (!template) {
      // Generate basic template if none exists
      return AIComponentHelpers.generateBasicComponent(config, props);
    }

    const context: AIGenerationContext = {
      componentType: config.type,
      requirements: `Generate ${componentName} component`,
      projectContext: {
        name: 'current-project',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
        designSystem: 'shadcn/ui',
        existingComponents: [],
        conventions: {
          naming: 'PascalCase',
          fileOrganization: 'feature-based',
          importStyle: 'named',
          testing: 'unit'
        }
      },
      stylePreferences: {
        colorScheme: 'auto',
        size: 'md',
        borderRadius: 'md',
        animations: true
      }
    };

    return aiComponentRegistry.generateComponent(templateId, {
      componentName: config.name,
      ...props
    }, context);
  },

  /**
   * Generate basic component when no template exists
   */
  generateBasicComponent(config: AIComponentConfig, props: Record<string, any>): string {
    const propsInterface = config.props.map(prop => 
      `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};`
    ).join('\n');

    return `import * as React from "react";
import { cn } from "@/lib/utils";

export interface ${config.name}Props {
${propsInterface}
  className?: string;
}

export const ${config.name} = React.forwardRef<
  HTMLDivElement,
  ${config.name}Props
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("${config.type === 'ui' ? 'inline-flex items-center' : 'block'}", className)}
      {...props}
    />
  );
});

${config.name}.displayName = "${config.name}";
`;
  }
};