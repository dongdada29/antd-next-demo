/**
 * Component Generation Hook
 * 
 * React hook for accessing AI component generation capabilities,
 * managing generation state, and providing UI integration.
 */

import { useState, useCallback, useRef } from 'react';
import { 
  ComponentGenerationRequest,
  GeneratedComponent,
  aiComponentGenerator 
} from '@/lib/ai-component-generator';
import { 
  ComponentBuilder,
  ComponentPatterns 
} from '@/lib/component-config-builder';
import { 
  componentMetadataManager,
  ComponentMetadata 
} from '@/lib/component-metadata-system';
import { useAIComponentRegistry } from './useAIComponentRegistry';

export interface UseComponentGenerationOptions {
  /** Auto-register generated components */
  autoRegister?: boolean;
  /** Enable generation history */
  enableHistory?: boolean;
  /** Maximum history size */
  maxHistorySize?: number;
}

export interface GenerationState {
  /** Current generation status */
  status: 'idle' | 'generating' | 'success' | 'error';
  /** Generation progress (0-100) */
  progress: number;
  /** Current step description */
  currentStep: string;
  /** Generated component */
  result?: GeneratedComponent;
  /** Error message if generation failed */
  error?: string;
  /** Generation metadata */
  metadata?: ComponentMetadata;
}

export interface GenerationHistory {
  /** History entries */
  entries: GenerationHistoryEntry[];
  /** Add entry to history */
  add: (entry: GenerationHistoryEntry) => void;
  /** Clear history */
  clear: () => void;
  /** Get entry by ID */
  get: (id: string) => GenerationHistoryEntry | undefined;
}

export interface GenerationHistoryEntry {
  /** Unique ID */
  id: string;
  /** Generation request */
  request: ComponentGenerationRequest;
  /** Generated component */
  result: GeneratedComponent;
  /** Generation timestamp */
  timestamp: Date;
  /** Generation duration (ms) */
  duration: number;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Component Generation Hook
 */
export function useComponentGeneration(options: UseComponentGenerationOptions = {}) {
  const {
    autoRegister = true,
    enableHistory = true,
    maxHistorySize = 50
  } = options;

  const { registerComponent } = useAIComponentRegistry();
  
  // Generation state
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
    currentStep: ''
  });

  // Generation history
  const [history, setHistory] = useState<GenerationHistoryEntry[]>([]);
  const generationId = useRef<string | null>(null);

  /**
   * Generate component from request
   */
  const generateComponent = useCallback(async (
    request: ComponentGenerationRequest
  ): Promise<GeneratedComponent> => {
    const startTime = Date.now();
    generationId.current = `gen-${startTime}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Update state to generating
      setState({
        status: 'generating',
        progress: 0,
        currentStep: 'Initializing generation...'
      });

      // Step 1: Validate request
      setState(prev => ({
        ...prev,
        progress: 10,
        currentStep: 'Validating component specification...'
      }));

      if (!request.name || !request.type || !request.description) {
        throw new Error('Component name, type, and description are required');
      }

      // Step 2: Generate component configuration
      setState(prev => ({
        ...prev,
        progress: 25,
        currentStep: 'Creating component configuration...'
      }));

      // Step 3: Generate component code
      setState(prev => ({
        ...prev,
        progress: 50,
        currentStep: 'Generating component code...'
      }));

      const result = await aiComponentGenerator.generateComponent(request);

      // Step 4: Register component (if enabled)
      setState(prev => ({
        ...prev,
        progress: 75,
        currentStep: 'Registering component...'
      }));

      let metadata: ComponentMetadata | undefined;
      
      if (autoRegister) {
        metadata = componentMetadataManager.registerComponent(request, result);
        registerComponent(result.config);
      }

      // Step 5: Complete
      setState(prev => ({
        ...prev,
        progress: 100,
        currentStep: 'Generation complete!',
        status: 'success',
        result,
        metadata
      }));

      // Add to history
      if (enableHistory) {
        const historyEntry: GenerationHistoryEntry = {
          id: generationId.current,
          request,
          result,
          timestamp: new Date(),
          duration: Date.now() - startTime,
          success: true
        };

        setHistory(prev => {
          const newHistory = [historyEntry, ...prev];
          return newHistory.slice(0, maxHistorySize);
        });
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState({
        status: 'error',
        progress: 0,
        currentStep: '',
        error: errorMessage
      });

      // Add failed generation to history
      if (enableHistory && generationId.current) {
        const historyEntry: GenerationHistoryEntry = {
          id: generationId.current,
          request,
          result: {} as GeneratedComponent, // Empty result for failed generation
          timestamp: new Date(),
          duration: Date.now() - startTime,
          success: false,
          error: errorMessage
        };

        setHistory(prev => {
          const newHistory = [historyEntry, ...prev];
          return newHistory.slice(0, maxHistorySize);
        });
      }

      throw error;
    }
  }, [autoRegister, enableHistory, maxHistorySize, registerComponent]);

  /**
   * Generate component using predefined pattern
   */
  const generateFromPattern = useCallback(async (
    patternName: keyof typeof ComponentPatterns,
    customizations?: Partial<ComponentGenerationRequest>
  ): Promise<GeneratedComponent> => {
    let builder;

    switch (patternName) {
      case 'button':
        builder = ComponentPatterns.button();
        break;
      case 'input':
        builder = ComponentPatterns.input();
        break;
      case 'card':
        builder = ComponentPatterns.card();
        break;
      case 'dataTable':
        builder = ComponentPatterns.dataTable();
        break;
      case 'form':
        builder = ComponentPatterns.form();
        break;
      case 'layout':
        builder = ComponentPatterns.layout();
        break;
      default:
        throw new Error(`Unknown pattern: ${patternName}`);
    }

    // Apply customizations
    if (customizations) {
      if (customizations.name) builder.name(customizations.name);
      if (customizations.description) builder.description(customizations.description);
      if (customizations.props) builder.props(customizations.props);
      if (customizations.requirements) builder.requirements(...customizations.requirements);
    }

    const request = builder.build();
    return generateComponent(request);
  }, [generateComponent]);

  /**
   * Generate component using builder pattern
   */
  const generateWithBuilder = useCallback(async (
    builderFn: (builder: ReturnType<typeof ComponentBuilder.create>) => ReturnType<typeof ComponentBuilder.create>
  ): Promise<GeneratedComponent> => {
    const builder = ComponentBuilder.create();
    const configuredBuilder = builderFn(builder);
    const request = configuredBuilder.build();
    return generateComponent(request);
  }, [generateComponent]);

  /**
   * Reset generation state
   */
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      currentStep: ''
    });
  }, []);

  /**
   * Clear generation history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  /**
   * Get history entry by ID
   */
  const getHistoryEntry = useCallback((id: string) => {
    return history.find(entry => entry.id === id);
  }, [history]);

  /**
   * Regenerate from history entry
   */
  const regenerateFromHistory = useCallback(async (id: string): Promise<GeneratedComponent> => {
    const entry = getHistoryEntry(id);
    if (!entry) {
      throw new Error(`History entry not found: ${id}`);
    }
    return generateComponent(entry.request);
  }, [generateComponent, getHistoryEntry]);

  /**
   * Get generation statistics
   */
  const getStatistics = useCallback(() => {
    const totalGenerations = history.length;
    const successfulGenerations = history.filter(entry => entry.success).length;
    const failedGenerations = totalGenerations - successfulGenerations;
    const averageDuration = history.length > 0 
      ? history.reduce((sum, entry) => sum + entry.duration, 0) / history.length 
      : 0;

    const componentTypes = history.reduce((acc, entry) => {
      if (entry.success) {
        const type = entry.request.type;
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalGenerations,
      successfulGenerations,
      failedGenerations,
      successRate: totalGenerations > 0 ? (successfulGenerations / totalGenerations) * 100 : 0,
      averageDuration,
      componentTypes
    };
  }, [history]);

  // History object with utility methods
  const historyObject: GenerationHistory = {
    entries: history,
    add: (entry: GenerationHistoryEntry) => {
      setHistory(prev => {
        const newHistory = [entry, ...prev];
        return newHistory.slice(0, maxHistorySize);
      });
    },
    clear: clearHistory,
    get: getHistoryEntry
  };

  return {
    // Generation state
    state,
    
    // Generation methods
    generateComponent,
    generateFromPattern,
    generateWithBuilder,
    
    // State management
    reset,
    
    // History management
    history: historyObject,
    clearHistory,
    getHistoryEntry,
    regenerateFromHistory,
    
    // Statistics
    getStatistics,
    
    // Utility methods
    isGenerating: state.status === 'generating',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    hasResult: !!state.result
  };
}

/**
 * Hook for component generation templates
 */
export function useComponentTemplates() {
  const [templates, setTemplates] = useState<ComponentGenerationRequest[]>([]);

  /**
   * Save a generation request as a template
   */
  const saveTemplate = useCallback((
    name: string,
    request: ComponentGenerationRequest
  ) => {
    const template = {
      ...request,
      name: `${name}Template`
    };
    
    setTemplates(prev => [...prev, template]);
  }, []);

  /**
   * Load a template by name
   */
  const loadTemplate = useCallback((name: string) => {
    return templates.find(template => template.name === `${name}Template`);
  }, [templates]);

  /**
   * Delete a template
   */
  const deleteTemplate = useCallback((name: string) => {
    setTemplates(prev => prev.filter(template => template.name !== `${name}Template`));
  }, []);

  /**
   * Get all template names
   */
  const getTemplateNames = useCallback(() => {
    return templates.map(template => template.name.replace('Template', ''));
  }, [templates]);

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    getTemplateNames
  };
}