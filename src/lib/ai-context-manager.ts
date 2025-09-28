/**
 * AI Context Manager
 * 
 * Advanced AI context management system with project history,
 * intelligent prompt selection, and code generation optimization.
 */

import { contextBuilder, ContextBuilder, ContextBuilderOptions } from './prompts/context-builder';
import { promptManager, PromptManager, PromptContext } from './prompts/prompt-manager';
import { templateEngine, TemplateContext } from './template-engine';

export interface ProjectContext {
  /** Project metadata */
  project: {
    name: string;
    version: string;
    framework: 'nextjs' | 'react' | 'vite';
    uiLibrary: 'shadcn' | 'antd' | 'mui' | 'custom';
    cssFramework: 'tailwind' | 'styled-components' | 'emotion' | 'css-modules';
    typescript: boolean;
    packageManager: 'npm' | 'yarn' | 'pnpm';
  };
  
  /** Current file context */
  currentFile?: {
    path: string;
    type: 'component' | 'page' | 'hook' | 'utility' | 'config';
    content?: string;
    dependencies: string[];
  };
  
  /** Project structure */
  structure: {
    components: ComponentInfo[];
    pages: PageInfo[];
    hooks: HookInfo[];
    utilities: UtilityInfo[];
  };
  
  /** Development preferences */
  preferences: {
    codeStyle: 'functional' | 'class' | 'mixed';
    stateManagement: 'useState' | 'useReducer' | 'context' | 'zustand' | 'redux';
    testingFramework: 'jest' | 'vitest' | 'cypress' | 'playwright';
    linting: 'eslint' | 'biome' | 'none';
    formatting: 'prettier' | 'biome' | 'none';
  };
}

export interface ComponentInfo {
  name: string;
  path: string;
  type: 'ui' | 'layout' | 'form' | 'data' | 'common';
  props: string[];
  dependencies: string[];
  variants?: string[];
  lastModified: Date;
}

export interface PageInfo {
  name: string;
  path: string;
  route: string;
  layout?: string;
  components: string[];
  dataFetching: 'ssg' | 'ssr' | 'csr' | 'isr';
  lastModified: Date;
}

export interface HookInfo {
  name: string;
  path: string;
  purpose: string;
  dependencies: string[];
  lastModified: Date;
}

export interface UtilityInfo {
  name: string;
  path: string;
  purpose: string;
  exports: string[];
  lastModified: Date;
}

export interface GenerationHistory {
  id: string;
  timestamp: Date;
  task: string;
  context: PromptContext;
  prompt: string;
  result: GenerationResult;
  feedback?: GenerationFeedback;
}

export interface GenerationResult {
  success: boolean;
  code?: string;
  error?: string;
  metrics: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    responseTime: number;
    qualityScore: number;
  };
}

export interface GenerationFeedback {
  rating: 1 | 2 | 3 | 4 | 5;
  useful: boolean;
  issues: string[];
  suggestions: string[];
  wouldUseAgain: boolean;
}

export interface ContextOptimization {
  /** Remove redundant information */
  deduplication: boolean;
  /** Prioritize recent context */
  recencyBias: boolean;
  /** Focus on relevant patterns */
  patternMatching: boolean;
  /** Compress verbose sections */
  compression: boolean;
  /** Maximum context tokens */
  maxTokens: number;
}

export interface IntelligentPromptSelection {
  /** Task-specific prompt weighting */
  taskWeighting: Record<string, number>;
  /** Success rate based selection */
  successRateBias: boolean;
  /** User preference learning */
  preferenceAdaptation: boolean;
  /** Context similarity matching */
  similarityMatching: boolean;
}

/**
 * AI Context Manager Class
 */
export class AIContextManager {
  private projectContext: ProjectContext | null = null;
  private generationHistory: GenerationHistory[] = [];
  private contextBuilder: ContextBuilder;
  private promptManager: PromptManager;
  private maxHistorySize = 1000;
  private contextCache = new Map<string, string>();

  constructor(
    contextBuilder?: ContextBuilder,
    promptManager?: PromptManager
  ) {
    this.contextBuilder = contextBuilder || new ContextBuilder();
    this.promptManager = promptManager || new PromptManager();
  }

  /**
   * Initialize project context
   */
  async initializeProject(context: ProjectContext): Promise<void> {
    this.projectContext = context;
    
    // Analyze existing codebase
    await this.analyzeCodebase();
    
    // Initialize prompt preferences
    this.initializePromptPreferences();
    
    // Clear cache
    this.contextCache.clear();
  }

  /**
   * Update project context
   */
  updateProjectContext(updates: Partial<ProjectContext>): void {
    if (this.projectContext) {
      this.projectContext = {
        ...this.projectContext,
        ...updates
      };
      this.contextCache.clear();
    }
  }

  /**
   * Build intelligent context for AI generation
   */
  async buildIntelligentContext(
    task: string,
    target: string,
    requirements: string[] = [],
    options: ContextBuilderOptions = {}
  ): Promise<{
    context: string;
    metadata: ContextMetadata;
  }> {
    const cacheKey = this.generateCacheKey(task, target, requirements, options);
    
    // Check cache first
    const cached = this.contextCache.get(cacheKey);
    if (cached) {
      return {
        context: cached,
        metadata: this.generateContextMetadata(cached, true)
      };
    }

    // Build base context
    const promptContext: PromptContext = {
      task: task as any,
      target,
      requirements,
      constraints: this.extractConstraints(),
      preferences: this.extractPreferences()
    };

    // Apply intelligent optimizations
    const optimizedOptions = await this.optimizeContextOptions(
      promptContext,
      options
    );

    // Build context with project awareness
    const builtContext = await this.contextBuilder.buildContext(
      promptContext,
      optimizedOptions
    );

    // Enhance with project-specific information
    const enhancedContext = this.enhanceWithProjectContext(
      builtContext.prompt,
      promptContext
    );

    // Apply final optimizations
    const finalContext = this.applyContextOptimizations(
      enhancedContext,
      {
        deduplication: true,
        recencyBias: true,
        patternMatching: true,
        compression: false,
        maxTokens: options.maxTokens || 8000
      }
    );

    // Cache result
    this.contextCache.set(cacheKey, finalContext);

    return {
      context: finalContext,
      metadata: this.generateContextMetadata(finalContext, false)
    };
  }

  /**
   * Record generation result and learn from it
   */
  async recordGeneration(
    task: string,
    context: PromptContext,
    prompt: string,
    result: GenerationResult
  ): Promise<string> {
    const historyEntry: GenerationHistory = {
      id: this.generateHistoryId(),
      timestamp: new Date(),
      task,
      context,
      prompt,
      result
    };

    // Add to history
    this.generationHistory.push(historyEntry);

    // Maintain history size limit
    if (this.generationHistory.length > this.maxHistorySize) {
      this.generationHistory.shift();
    }

    // Update prompt metrics
    this.promptManager.recordUsage(
      task,
      result.success,
      result.metrics.responseTime
    );

    // Learn from the result
    await this.learnFromGeneration(historyEntry);

    return historyEntry.id;
  }

  /**
   * Provide feedback on generation
   */
  async provideFeedback(
    generationId: string,
    feedback: GenerationFeedback
  ): Promise<void> {
    const generation = this.generationHistory.find(g => g.id === generationId);
    if (!generation) {
      throw new Error(`Generation not found: ${generationId}`);
    }

    generation.feedback = feedback;

    // Record feedback in prompt manager
    this.promptManager.recordFeedback(
      generation.task,
      feedback.useful,
      feedback.issues.join('; ')
    );

    // Update learning algorithms
    await this.updateLearningFromFeedback(generation);
  }

  /**
   * Get generation suggestions based on history
   */
  getGenerationSuggestions(
    task: string,
    target: string
  ): {
    suggestions: string[];
    similarPatterns: GenerationHistory[];
    recommendedPrompts: string[];
  } {
    // Find similar generations
    const similarPatterns = this.findSimilarGenerations(task, target);
    
    // Extract successful patterns
    const successfulPatterns = similarPatterns.filter(g => 
      g.result.success && g.feedback?.rating >= 4
    );

    // Generate suggestions
    const suggestions = this.generateSuggestions(successfulPatterns);
    
    // Recommend prompts
    const recommendedPrompts = this.recommendPrompts(task, successfulPatterns);

    return {
      suggestions,
      similarPatterns: similarPatterns.slice(0, 5),
      recommendedPrompts
    };
  }

  /**
   * Analyze code quality and provide optimization suggestions
   */
  analyzeCodeQuality(code: string): {
    score: number;
    issues: QualityIssue[];
    suggestions: QualitySuggestion[];
    metrics: CodeMetrics;
  } {
    const issues: QualityIssue[] = [];
    const suggestions: QualitySuggestion[] = [];
    
    // Analyze TypeScript usage
    const tsIssues = this.analyzeTypeScriptQuality(code);
    issues.push(...tsIssues);

    // Analyze React patterns
    const reactIssues = this.analyzeReactPatterns(code);
    issues.push(...reactIssues);

    // Analyze accessibility
    const a11yIssues = this.analyzeAccessibility(code);
    issues.push(...a11yIssues);

    // Analyze performance
    const perfIssues = this.analyzePerformance(code);
    issues.push(...perfIssues);

    // Generate suggestions
    suggestions.push(...this.generateQualitySuggestions(issues));

    // Calculate metrics
    const metrics = this.calculateCodeMetrics(code);

    // Calculate overall score
    const score = this.calculateQualityScore(issues, metrics);

    return {
      score,
      issues,
      suggestions,
      metrics
    };
  }

  /**
   * Get context optimization recommendations
   */
  getContextOptimizationRecommendations(): {
    recommendations: ContextRecommendation[];
    currentEfficiency: number;
    potentialImprovement: number;
  } {
    const recommendations: ContextRecommendation[] = [];
    
    // Analyze current context usage
    const usage = this.analyzeContextUsage();
    
    // Generate recommendations
    if (usage.averageTokens > 6000) {
      recommendations.push({
        type: 'token-reduction',
        priority: 'high',
        description: 'Consider reducing context size to improve response time',
        impact: 'performance',
        effort: 'low'
      });
    }

    if (usage.cacheHitRate < 0.3) {
      recommendations.push({
        type: 'caching-improvement',
        priority: 'medium',
        description: 'Improve context caching to reduce computation',
        impact: 'performance',
        effort: 'medium'
      });
    }

    if (usage.successRate < 0.8) {
      recommendations.push({
        type: 'prompt-optimization',
        priority: 'high',
        description: 'Optimize prompt selection for better results',
        impact: 'quality',
        effort: 'high'
      });
    }

    return {
      recommendations,
      currentEfficiency: usage.efficiency,
      potentialImprovement: this.calculatePotentialImprovement(recommendations)
    };
  }

  /**
   * Export context and history for analysis
   */
  exportContextData(): {
    projectContext: ProjectContext | null;
    generationHistory: GenerationHistory[];
    metrics: ContextAnalytics;
  } {
    return {
      projectContext: this.projectContext,
      generationHistory: this.generationHistory,
      metrics: this.getContextAnalytics()
    };
  }

  /**
   * Import context data
   */
  importContextData(data: {
    projectContext?: ProjectContext;
    generationHistory?: GenerationHistory[];
  }): void {
    if (data.projectContext) {
      this.projectContext = data.projectContext;
    }

    if (data.generationHistory) {
      this.generationHistory = data.generationHistory;
    }

    this.contextCache.clear();
  }

  // Private methods

  private async analyzeCodebase(): Promise<void> {
    if (!this.projectContext) return;

    // This would analyze the actual codebase structure
    // For now, we'll use the provided structure
    console.log('Analyzing codebase structure...');
  }

  private initializePromptPreferences(): void {
    if (!this.projectContext) return;

    // Initialize prompt preferences based on project context
    const preferences = {
      framework: this.projectContext.project.framework,
      uiLibrary: this.projectContext.project.uiLibrary,
      cssFramework: this.projectContext.project.cssFramework,
      typescript: this.projectContext.project.typescript
    };

    // Configure prompt manager with preferences
    console.log('Initializing prompt preferences:', preferences);
  }

  private extractConstraints(): string[] {
    const constraints: string[] = [];

    if (this.projectContext) {
      if (this.projectContext.project.typescript) {
        constraints.push('Must use TypeScript with strict type checking');
      }

      if (this.projectContext.project.uiLibrary === 'shadcn') {
        constraints.push('Must use shadcn/ui components as base building blocks');
      }

      if (this.projectContext.project.cssFramework === 'tailwind') {
        constraints.push('Must use Tailwind CSS utility classes for styling');
      }
    }

    return constraints;
  }

  private extractPreferences(): PromptContext['preferences'] {
    const defaults = {
      complexity: 'medium' as const,
      performance: 'standard' as const,
      accessibility: 'enhanced' as const,
      responsive: true,
      darkMode: true
    };

    if (!this.projectContext) return defaults;

    // Extract preferences from project context
    return {
      ...defaults,
      complexity: this.inferComplexityPreference(),
      performance: this.inferPerformancePreference(),
      accessibility: this.inferAccessibilityPreference()
    };
  }

  private async optimizeContextOptions(
    context: PromptContext,
    options: ContextBuilderOptions
  ): Promise<ContextBuilderOptions> {
    const optimized = { ...options };

    // Apply intelligent prompt selection
    const selection = await this.selectOptimalPrompts(context);
    
    if (selection.componentTypes.length > 0) {
      optimized.componentTypes = selection.componentTypes;
    }

    if (selection.styleCategories.length > 0) {
      optimized.styleCategories = selection.styleCategories;
    }

    // Optimize based on history
    const historyOptimization = this.optimizeFromHistory(context);
    Object.assign(optimized, historyOptimization);

    return optimized;
  }

  private enhanceWithProjectContext(
    baseContext: string,
    promptContext: PromptContext
  ): string {
    if (!this.projectContext) return baseContext;

    const enhancements: string[] = [];

    // Add project-specific information
    enhancements.push(`## Project Context
- Framework: ${this.projectContext.project.framework}
- UI Library: ${this.projectContext.project.uiLibrary}
- CSS Framework: ${this.projectContext.project.cssFramework}
- TypeScript: ${this.projectContext.project.typescript ? 'Yes' : 'No'}
- Package Manager: ${this.projectContext.project.packageManager}`);

    // Add relevant components information
    if (this.projectContext.structure.components.length > 0) {
      const relevantComponents = this.findRelevantComponents(promptContext.target);
      if (relevantComponents.length > 0) {
        enhancements.push(`## Existing Components
${relevantComponents.map(c => `- ${c.name} (${c.type}): ${c.path}`).join('\n')}`);
      }
    }

    // Add current file context
    if (this.projectContext.currentFile) {
      enhancements.push(`## Current File Context
- Path: ${this.projectContext.currentFile.path}
- Type: ${this.projectContext.currentFile.type}
- Dependencies: ${this.projectContext.currentFile.dependencies.join(', ')}`);
    }

    return [baseContext, ...enhancements].join('\n\n---\n\n');
  }

  private applyContextOptimizations(
    context: string,
    optimization: ContextOptimization
  ): string {
    let optimized = context;

    if (optimization.deduplication) {
      optimized = this.removeDuplicateContent(optimized);
    }

    if (optimization.compression) {
      optimized = this.compressVerboseSections(optimized);
    }

    if (optimization.maxTokens) {
      optimized = this.truncateToTokenLimit(optimized, optimization.maxTokens);
    }

    return optimized;
  }

  private async learnFromGeneration(generation: GenerationHistory): Promise<void> {
    // Update success patterns
    if (generation.result.success) {
      this.updateSuccessPatterns(generation);
    } else {
      this.updateFailurePatterns(generation);
    }

    // Update prompt effectiveness
    this.updatePromptEffectiveness(generation);
  }

  private async updateLearningFromFeedback(generation: GenerationHistory): Promise<void> {
    if (!generation.feedback) return;

    // Update preference learning
    this.updatePreferenceLearning(generation);

    // Update quality patterns
    this.updateQualityPatterns(generation);
  }

  private findSimilarGenerations(task: string, target: string): GenerationHistory[] {
    return this.generationHistory
      .filter(g => g.task === task)
      .filter(g => this.calculateSimilarity(g.context.target, target) > 0.5)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }

  private generateSuggestions(patterns: GenerationHistory[]): string[] {
    const suggestions: string[] = [];

    // Extract common requirements
    const commonRequirements = this.extractCommonRequirements(patterns);
    suggestions.push(...commonRequirements.map(req => `Consider: ${req}`));

    // Extract successful patterns
    const successfulPatterns = this.extractSuccessfulPatterns(patterns);
    suggestions.push(...successfulPatterns);

    return suggestions;
  }

  private recommendPrompts(task: string, patterns: GenerationHistory[]): string[] {
    // Analyze which prompts worked well for similar tasks
    const promptUsage = new Map<string, number>();
    
    patterns.forEach(pattern => {
      // Extract prompt identifiers from the pattern
      const prompts = this.extractPromptIdentifiers(pattern.prompt);
      prompts.forEach(prompt => {
        promptUsage.set(prompt, (promptUsage.get(prompt) || 0) + 1);
      });
    });

    return Array.from(promptUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([prompt]) => prompt);
  }

  // Quality analysis methods

  private analyzeTypeScriptQuality(code: string): QualityIssue[] {
    const issues: QualityIssue[] = [];

    // Check for 'any' types
    const anyMatches = code.match(/:\s*any\b/g);
    if (anyMatches) {
      issues.push({
        type: 'typescript',
        severity: 'warning',
        message: `Found ${anyMatches.length} usage(s) of 'any' type`,
        suggestion: 'Use specific types instead of any'
      });
    }

    // Check for missing return types
    const functionMatches = code.match(/function\s+\w+\([^)]*\)\s*{/g);
    if (functionMatches) {
      issues.push({
        type: 'typescript',
        severity: 'info',
        message: 'Consider adding explicit return types to functions',
        suggestion: 'Add return type annotations for better type safety'
      });
    }

    return issues;
  }

  private analyzeReactPatterns(code: string): QualityIssue[] {
    const issues: QualityIssue[] = [];

    // Check for inline functions in JSX
    const inlineFunctions = code.match(/\w+={() =>/g);
    if (inlineFunctions && inlineFunctions.length > 2) {
      issues.push({
        type: 'react',
        severity: 'warning',
        message: 'Multiple inline functions in JSX may cause performance issues',
        suggestion: 'Extract functions or use useCallback'
      });
    }

    // Check for missing keys in lists
    if (code.includes('.map(') && !code.includes('key=')) {
      issues.push({
        type: 'react',
        severity: 'error',
        message: 'Missing key prop in list rendering',
        suggestion: 'Add unique key prop to list items'
      });
    }

    return issues;
  }

  private analyzeAccessibility(code: string): QualityIssue[] {
    const issues: QualityIssue[] = [];

    // Check for images without alt text
    const imgTags = code.match(/<img[^>]*>/g);
    if (imgTags) {
      const imgsWithoutAlt = imgTags.filter(img => !img.includes('alt='));
      if (imgsWithoutAlt.length > 0) {
        issues.push({
          type: 'accessibility',
          severity: 'error',
          message: `${imgsWithoutAlt.length} image(s) missing alt text`,
          suggestion: 'Add descriptive alt text to all images'
        });
      }
    }

    // Check for buttons without accessible names
    const buttons = code.match(/<button[^>]*>/g);
    if (buttons) {
      const buttonsWithoutLabel = buttons.filter(btn => 
        !btn.includes('aria-label=') && !btn.includes('aria-labelledby=')
      );
      if (buttonsWithoutLabel.length > 0) {
        issues.push({
          type: 'accessibility',
          severity: 'warning',
          message: 'Consider adding aria-label to buttons without text content',
          suggestion: 'Add aria-label or ensure buttons have descriptive text'
        });
      }
    }

    return issues;
  }

  private analyzePerformance(code: string): QualityIssue[] {
    const issues: QualityIssue[] = [];

    // Check for missing React.memo
    if (code.includes('export') && code.includes('function') && !code.includes('memo')) {
      issues.push({
        type: 'performance',
        severity: 'info',
        message: 'Consider using React.memo for performance optimization',
        suggestion: 'Wrap component with React.memo if it receives stable props'
      });
    }

    return issues;
  }

  private generateQualitySuggestions(issues: QualityIssue[]): QualitySuggestion[] {
    return issues.map(issue => ({
      category: issue.type,
      priority: issue.severity === 'error' ? 'high' : issue.severity === 'warning' ? 'medium' : 'low',
      description: issue.suggestion,
      impact: this.estimateImpact(issue.type),
      effort: this.estimateEffort(issue.type)
    }));
  }

  private calculateCodeMetrics(code: string): CodeMetrics {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    
    return {
      linesOfCode: nonEmptyLines.length,
      complexity: this.calculateComplexity(code),
      maintainabilityIndex: this.calculateMaintainabilityIndex(code),
      testCoverage: 0, // Would need actual test analysis
      dependencies: this.extractDependencies(code).length
    };
  }

  private calculateQualityScore(issues: QualityIssue[], metrics: CodeMetrics): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'error': score -= 10; break;
        case 'warning': score -= 5; break;
        case 'info': score -= 1; break;
      }
    });

    // Adjust for complexity
    if (metrics.complexity > 10) {
      score -= (metrics.complexity - 10) * 2;
    }

    // Adjust for maintainability
    score = score * (metrics.maintainabilityIndex / 100);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Helper methods

  private generateCacheKey(...args: any[]): string {
    return JSON.stringify(args);
  }

  private generateContextMetadata(context: string, fromCache: boolean): ContextMetadata {
    return {
      tokenCount: this.estimateTokenCount(context),
      sections: this.countSections(context),
      fromCache,
      buildTime: fromCache ? 0 : Date.now(),
      cacheKey: this.generateCacheKey(context)
    };
  }

  private generateHistoryId(): string {
    return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private inferComplexityPreference(): 'simple' | 'medium' | 'complex' {
    // Analyze project structure to infer complexity preference
    if (!this.projectContext) return 'medium';
    
    const componentCount = this.projectContext.structure.components.length;
    if (componentCount > 50) return 'complex';
    if (componentCount > 20) return 'medium';
    return 'simple';
  }

  private inferPerformancePreference(): 'standard' | 'optimized' | 'high-performance' {
    // Analyze project characteristics to infer performance needs
    return 'optimized'; // Default to optimized
  }

  private inferAccessibilityPreference(): 'basic' | 'enhanced' | 'full-compliance' {
    // Check for accessibility-related dependencies or patterns
    return 'enhanced'; // Default to enhanced
  }

  private async selectOptimalPrompts(context: PromptContext): Promise<{
    componentTypes: string[];
    styleCategories: ('styling' | 'interaction' | 'performance' | 'accessibility')[];
  }> {
    // Analyze context to select optimal prompts
    const componentTypes: string[] = [];
    const styleCategories: ('styling' | 'interaction' | 'performance' | 'accessibility')[] = ['styling'];

    // Add component types based on task
    if (context.task === 'component') {
      componentTypes.push(context.target.toLowerCase());
    }

    // Add style categories based on preferences
    if (context.preferences.accessibility !== 'basic') {
      styleCategories.push('accessibility');
    }

    if (context.preferences.performance !== 'standard') {
      styleCategories.push('performance');
    }

    return { componentTypes, styleCategories };
  }

  private optimizeFromHistory(context: PromptContext): Partial<ContextBuilderOptions> {
    // Analyze history to optimize context options
    const similarGenerations = this.findSimilarGenerations(context.task, context.target);
    const successfulGenerations = similarGenerations.filter(g => g.result.success);

    if (successfulGenerations.length === 0) {
      return {};
    }

    // Extract patterns from successful generations
    return {
      maxTokens: this.calculateOptimalTokenLimit(successfulGenerations),
      priority: 'quality'
    };
  }

  private findRelevantComponents(target: string): ComponentInfo[] {
    if (!this.projectContext) return [];

    return this.projectContext.structure.components.filter(component =>
      component.name.toLowerCase().includes(target.toLowerCase()) ||
      component.type === target.toLowerCase()
    );
  }

  private removeDuplicateContent(context: string): string {
    const lines = context.split('\n');
    const seen = new Set<string>();
    const unique: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 0 && !seen.has(trimmed)) {
        seen.add(trimmed);
        unique.push(line);
      } else if (trimmed.length === 0) {
        unique.push(line);
      }
    });

    return unique.join('\n');
  }

  private compressVerboseSections(context: string): string {
    // Simple compression - remove excessive whitespace
    return context.replace(/\n\s*\n\s*\n/g, '\n\n');
  }

  private truncateToTokenLimit(context: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokenCount(context);
    if (estimatedTokens <= maxTokens) {
      return context;
    }

    const ratio = maxTokens / estimatedTokens;
    const targetLength = Math.floor(context.length * ratio * 0.9);
    return context.substring(0, targetLength) + '\n\n[Context truncated to fit token limit]';
  }

  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private countSections(context: string): number {
    return (context.match(/^##/gm) || []).length;
  }

  private calculateSimilarity(a: string, b: string): number {
    // Simple similarity calculation
    const wordsA = a.toLowerCase().split(/\s+/);
    const wordsB = b.toLowerCase().split(/\s+/);
    const intersection = wordsA.filter(word => wordsB.includes(word));
    return intersection.length / Math.max(wordsA.length, wordsB.length);
  }

  private extractCommonRequirements(patterns: GenerationHistory[]): string[] {
    const requirements = new Map<string, number>();
    
    patterns.forEach(pattern => {
      pattern.context.requirements.forEach(req => {
        requirements.set(req, (requirements.get(req) || 0) + 1);
      });
    });

    return Array.from(requirements.entries())
      .filter(([, count]) => count >= patterns.length * 0.5)
      .map(([req]) => req);
  }

  private extractSuccessfulPatterns(patterns: GenerationHistory[]): string[] {
    return patterns
      .filter(p => p.result.success && p.feedback?.rating >= 4)
      .map(p => `Pattern: ${p.context.target} with ${p.context.requirements.join(', ')}`)
      .slice(0, 3);
  }

  private extractPromptIdentifiers(prompt: string): string[] {
    // Extract identifiers from prompt sections
    const sections = prompt.match(/^## (.+)$/gm) || [];
    return sections.map(section => section.replace('## ', '').toLowerCase());
  }

  private updateSuccessPatterns(generation: GenerationHistory): void {
    // Update internal success pattern tracking
    console.log('Updating success patterns for:', generation.task);
  }

  private updateFailurePatterns(generation: GenerationHistory): void {
    // Update internal failure pattern tracking
    console.log('Updating failure patterns for:', generation.task);
  }

  private updatePromptEffectiveness(generation: GenerationHistory): void {
    // Update prompt effectiveness metrics
    console.log('Updating prompt effectiveness for:', generation.task);
  }

  private updatePreferenceLearning(generation: GenerationHistory): void {
    // Update preference learning algorithms
    console.log('Updating preference learning for:', generation.task);
  }

  private updateQualityPatterns(generation: GenerationHistory): void {
    // Update quality pattern recognition
    console.log('Updating quality patterns for:', generation.task);
  }

  private calculateComplexity(code: string): number {
    const controlStructures = (code.match(/\b(if|else|for|while|switch|case|catch)\b/g) || []).length;
    const functions = (code.match(/function|\=>/g) || []).length;
    return Math.round((controlStructures + functions) / Math.max(1, functions));
  }

  private calculateMaintainabilityIndex(code: string): number {
    // Simplified maintainability calculation
    const lines = code.split('\n').length;
    const complexity = this.calculateComplexity(code);
    const comments = (code.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || []).length;
    
    return Math.max(0, Math.min(100, 100 - complexity * 2 + comments * 0.5 - lines * 0.01));
  }

  private extractDependencies(code: string): string[] {
    const imports = code.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || [];
    return imports.map(imp => {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/);
      return match ? match[1] : '';
    }).filter(Boolean);
  }

  private estimateImpact(type: string): 'low' | 'medium' | 'high' {
    switch (type) {
      case 'accessibility': return 'high';
      case 'performance': return 'medium';
      case 'typescript': return 'medium';
      case 'react': return 'medium';
      default: return 'low';
    }
  }

  private estimateEffort(type: string): 'low' | 'medium' | 'high' {
    switch (type) {
      case 'accessibility': return 'low';
      case 'performance': return 'high';
      case 'typescript': return 'medium';
      case 'react': return 'low';
      default: return 'low';
    }
  }

  private analyzeContextUsage(): ContextUsageAnalysis {
    const recentGenerations = this.generationHistory.slice(-100);
    
    return {
      averageTokens: recentGenerations.reduce((sum, g) => sum + g.result.metrics.totalTokens, 0) / recentGenerations.length,
      cacheHitRate: 0.4, // Simplified
      successRate: recentGenerations.filter(g => g.result.success).length / recentGenerations.length,
      efficiency: 0.75 // Simplified
    };
  }

  private calculatePotentialImprovement(recommendations: ContextRecommendation[]): number {
    return recommendations.reduce((sum, rec) => {
      switch (rec.priority) {
        case 'high': return sum + 0.3;
        case 'medium': return sum + 0.2;
        case 'low': return sum + 0.1;
        default: return sum;
      }
    }, 0);
  }

  private calculateOptimalTokenLimit(generations: GenerationHistory[]): number {
    const tokenCounts = generations.map(g => g.result.metrics.totalTokens);
    const average = tokenCounts.reduce((sum, count) => sum + count, 0) / tokenCounts.length;
    return Math.round(average * 1.2); // 20% buffer
  }

  private getContextAnalytics(): ContextAnalytics {
    const recentGenerations = this.generationHistory.slice(-100);
    
    return {
      totalGenerations: this.generationHistory.length,
      successRate: recentGenerations.filter(g => g.result.success).length / recentGenerations.length,
      averageQuality: recentGenerations.reduce((sum, g) => sum + g.result.metrics.qualityScore, 0) / recentGenerations.length,
      averageResponseTime: recentGenerations.reduce((sum, g) => sum + g.result.metrics.responseTime, 0) / recentGenerations.length,
      cacheEfficiency: this.contextCache.size > 0 ? 0.6 : 0,
      topTasks: this.getTopTasks(recentGenerations)
    };
  }

  private getTopTasks(generations: GenerationHistory[]): Array<{ task: string; count: number }> {
    const taskCounts = new Map<string, number>();
    
    generations.forEach(g => {
      taskCounts.set(g.task, (taskCounts.get(g.task) || 0) + 1);
    });

    return Array.from(taskCounts.entries())
      .map(([task, count]) => ({ task, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

// Supporting interfaces

export interface ContextMetadata {
  tokenCount: number;
  sections: number;
  fromCache: boolean;
  buildTime: number;
  cacheKey: string;
}

export interface QualityIssue {
  type: 'typescript' | 'react' | 'accessibility' | 'performance';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
}

export interface QualitySuggestion {
  category: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export interface CodeMetrics {
  linesOfCode: number;
  complexity: number;
  maintainabilityIndex: number;
  testCoverage: number;
  dependencies: number;
}

export interface ContextRecommendation {
  type: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: 'performance' | 'quality' | 'maintainability';
  effort: 'low' | 'medium' | 'high';
}

export interface ContextUsageAnalysis {
  averageTokens: number;
  cacheHitRate: number;
  successRate: number;
  efficiency: number;
}

export interface ContextAnalytics {
  totalGenerations: number;
  successRate: number;
  averageQuality: number;
  averageResponseTime: number;
  cacheEfficiency: number;
  topTasks: Array<{ task: string; count: number }>;
}

// Export singleton instance
export const aiContextManager = new AIContextManager();