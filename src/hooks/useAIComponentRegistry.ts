/**
 * AI Component Registry Hook
 * 
 * React hook for initializing and managing the AI component registry.
 * Provides access to component configurations, templates, and generation utilities.
 */

import { useEffect, useState, useCallback } from 'react';
import { 
  aiComponentRegistry, 
  AIComponentHelpers 
} from '@/lib/ai-component-registry';
import { 
  initializeComponentRegistry, 
  getRegistryStats 
} from '@/lib/initialize-component-registry';
import { 
  AIComponentConfig, 
  ComponentTemplate, 
  AIGenerationContext 
} from '@/types/ai-component';

export interface UseAIComponentRegistryReturn {
  // Registry state
  isInitialized: boolean;
  stats: ReturnType<typeof getRegistryStats>;
  
  // Component operations
  getComponent: (name: string) => AIComponentConfig | undefined;
  getTemplate: (id: string) => ComponentTemplate | undefined;
  searchComponents: (criteria: {
    type?: string;
    name?: string;
    description?: string;
  }) => AIComponentConfig[];
  
  // AI generation helpers
  findBestComponent: (requirement: string, type?: string) => AIComponentConfig | null;
  generateComponentCode: (
    componentName: string,
    props?: Record<string, any>,
    options?: {
      includeTypes?: boolean;
      includeTests?: boolean;
      includeStories?: boolean;
    }
  ) => string;
  getSuggestions: (context: AIGenerationContext) => AIComponentConfig[];
  
  // Registry management
  registerComponent: (config: AIComponentConfig) => void;
  registerTemplate: (template: ComponentTemplate) => void;
  refreshRegistry: () => void;
}

/**
 * Hook for managing AI component registry
 */
export function useAIComponentRegistry(): UseAIComponentRegistryReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [stats, setStats] = useState(getRegistryStats());

  // Initialize registry on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeComponentRegistry();
      setIsInitialized(true);
      setStats(getRegistryStats());
    }
  }, [isInitialized]);

  // Component operations
  const getComponent = useCallback((name: string) => {
    return aiComponentRegistry.getComponent(name);
  }, []);

  const getTemplate = useCallback((id: string) => {
    return aiComponentRegistry.getTemplate(id);
  }, []);

  const searchComponents = useCallback((criteria: {
    type?: string;
    name?: string;
    description?: string;
  }) => {
    return aiComponentRegistry.searchComponents(criteria);
  }, []);

  // AI generation helpers
  const findBestComponent = useCallback((requirement: string, type?: string) => {
    return AIComponentHelpers.findBestComponent(requirement, type);
  }, []);

  const generateComponentCode = useCallback((
    componentName: string,
    props: Record<string, any> = {},
    options: {
      includeTypes?: boolean;
      includeTests?: boolean;
      includeStories?: boolean;
    } = {}
  ) => {
    try {
      return AIComponentHelpers.generateComponentCode(componentName, props, options);
    } catch (error) {
      console.error('Error generating component code:', error);
      return `// Error generating component: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }, []);

  const getSuggestions = useCallback((context: AIGenerationContext) => {
    return aiComponentRegistry.getSuggestions(context);
  }, []);

  // Registry management
  const registerComponent = useCallback((config: AIComponentConfig) => {
    aiComponentRegistry.registerComponent(config);
    setStats(getRegistryStats());
  }, []);

  const registerTemplate = useCallback((template: ComponentTemplate) => {
    aiComponentRegistry.registerTemplate(template);
    setStats(getRegistryStats());
  }, []);

  const refreshRegistry = useCallback(() => {
    setStats(getRegistryStats());
  }, []);

  return {
    isInitialized,
    stats,
    getComponent,
    getTemplate,
    searchComponents,
    findBestComponent,
    generateComponentCode,
    getSuggestions,
    registerComponent,
    registerTemplate,
    refreshRegistry
  };
}

/**
 * Hook for AI component suggestions based on user input
 */
export function useAIComponentSuggestions(
  requirement: string,
  componentType?: string
) {
  const { findBestComponent, getSuggestions, isInitialized } = useAIComponentRegistry();
  const [suggestions, setSuggestions] = useState<AIComponentConfig[]>([]);
  const [bestMatch, setBestMatch] = useState<AIComponentConfig | null>(null);

  useEffect(() => {
    if (!isInitialized || !requirement.trim()) {
      setSuggestions([]);
      setBestMatch(null);
      return;
    }

    // Find best component match
    const best = findBestComponent(requirement, componentType);
    setBestMatch(best);

    // Get additional suggestions
    const context: AIGenerationContext = {
      componentType: componentType || 'ui',
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

    const allSuggestions = getSuggestions(context);
    setSuggestions(allSuggestions.slice(0, 5)); // Limit to top 5 suggestions
  }, [requirement, componentType, isInitialized, findBestComponent, getSuggestions]);

  return {
    suggestions,
    bestMatch,
    isLoading: !isInitialized
  };
}

/**
 * Hook for component documentation generation
 */
export function useComponentDocumentation(componentName?: string) {
  const { getComponent } = useAIComponentRegistry();
  const [documentation, setDocumentation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDocumentation = useCallback(async (name: string) => {
    if (!name) return;

    setIsGenerating(true);
    
    try {
      const config = getComponent(name);
      if (!config) {
        setDocumentation(`# Component Not Found\n\nThe component "${name}" was not found in the registry.`);
        return;
      }

      // Import documentation generator dynamically to avoid circular dependencies
      const { componentDocGenerator } = await import('@/lib/component-documentation-generator');
      const markdown = componentDocGenerator.generateMarkdown(config);
      setDocumentation(markdown);
    } catch (error) {
      setDocumentation(`# Error Generating Documentation\n\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [getComponent]);

  useEffect(() => {
    if (componentName) {
      generateDocumentation(componentName);
    }
  }, [componentName, generateDocumentation]);

  return {
    documentation,
    isGenerating,
    generateDocumentation
  };
}