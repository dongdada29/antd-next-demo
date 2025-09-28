/**
 * AI Component Configuration Types
 * 
 * These types define the structure for AI-friendly component generation
 * and configuration, enabling AI agents to understand and generate
 * components that follow project standards.
 */

export interface AIComponentConfig {
  /** Component name in PascalCase */
  name: string;
  /** Component category for organization */
  type: 'ui' | 'layout' | 'form' | 'data' | 'common';
  /** Component description for AI understanding */
  description: string;
  /** Component properties definition */
  props: ComponentPropDefinition[];
  /** Available component variants */
  variants: VariantDefinition[];
  /** Usage examples for AI reference */
  examples: CodeExample[];
  /** AI-specific prompts for generation */
  prompts: ComponentPrompts;
  /** Dependencies required by this component */
  dependencies?: string[];
  /** Accessibility requirements */
  accessibility?: AccessibilityConfig;
}

export interface ComponentPropDefinition {
  /** Property name */
  name: string;
  /** TypeScript type */
  type: string;
  /** Whether the prop is required */
  required: boolean;
  /** Human-readable description */
  description: string;
  /** Default value if any */
  defaultValue?: any;
  /** Example values for AI reference */
  examples: any[];
  /** Validation rules */
  validation?: ValidationRule[];
}

export interface VariantDefinition {
  /** Variant name (e.g., 'variant', 'size') */
  name: string;
  /** Available options */
  options: VariantOption[];
  /** Default option */
  defaultValue: string;
  /** Description of what this variant controls */
  description: string;
}

export interface VariantOption {
  /** Option value */
  value: string;
  /** CSS classes for this option */
  className: string;
  /** Description of this option */
  description: string;
}

export interface CodeExample {
  /** Example title */
  title: string;
  /** Example description */
  description: string;
  /** Example code */
  code: string;
  /** Props used in this example */
  props?: Record<string, any>;
  /** Whether this is a live preview example */
  preview?: boolean;
}

export interface ComponentPrompts {
  /** Prompt for generating this component */
  generation: string;
  /** Prompt for modifying this component */
  modification: string;
  /** Prompt for styling this component */
  styling: string;
  /** Prompt for testing this component */
  testing: string;
  /** Context-specific prompts */
  context?: Record<string, string>;
}

export interface ValidationRule {
  /** Rule type */
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  /** Rule value */
  value?: any;
  /** Error message */
  message: string;
}

export interface AccessibilityConfig {
  /** Required ARIA attributes */
  ariaAttributes: string[];
  /** Keyboard navigation support */
  keyboardNavigation: boolean;
  /** Screen reader support */
  screenReader: boolean;
  /** Color contrast requirements */
  colorContrast: 'AA' | 'AAA';
  /** Focus management */
  focusManagement?: string[];
}

/**
 * Component Template Configuration
 */
export interface ComponentTemplate {
  /** Template ID */
  id: string;
  /** Template name */
  name: string;
  /** Template category */
  category: 'component' | 'page' | 'hook' | 'utility';
  /** Template content with placeholders */
  template: string;
  /** Template variables */
  variables: TemplateVariable[];
  /** AI prompts for this template */
  prompts: TemplatePrompts;
  /** Template metadata */
  metadata: TemplateMetadata;
}

export interface TemplateVariable {
  /** Variable name */
  name: string;
  /** Variable type */
  type: 'string' | 'boolean' | 'array' | 'object' | 'number';
  /** Variable description */
  description: string;
  /** Default value */
  defaultValue?: any;
  /** Validation rules */
  validation?: ValidationRule[];
  /** Whether this variable is required */
  required?: boolean;
}

export interface TemplatePrompts {
  /** Generation prompt */
  generation: string;
  /** Customization prompt */
  customization: string;
  /** Integration prompt */
  integration: string;
}

export interface TemplateMetadata {
  /** Template version */
  version: string;
  /** Author */
  author: string;
  /** Creation date */
  createdAt: string;
  /** Last updated */
  updatedAt: string;
  /** Tags for categorization */
  tags: string[];
  /** Complexity level */
  complexity: 'basic' | 'intermediate' | 'advanced';
}

/**
 * Component Registry for AI Agent
 */
export interface ComponentRegistry {
  /** All registered components */
  components: Map<string, AIComponentConfig>;
  /** Component templates */
  templates: Map<string, ComponentTemplate>;
  /** Component categories */
  categories: ComponentCategory[];
}

export interface ComponentCategory {
  /** Category ID */
  id: string;
  /** Category name */
  name: string;
  /** Category description */
  description: string;
  /** Components in this category */
  components: string[];
  /** Category icon */
  icon?: string;
}

/**
 * AI Generation Context
 */
export interface AIGenerationContext {
  /** Target component type */
  componentType: string;
  /** User requirements */
  requirements: string;
  /** Project context */
  projectContext: ProjectContext;
  /** Style preferences */
  stylePreferences: StylePreferences;
  /** Performance requirements */
  performanceRequirements?: PerformanceRequirements;
}

export interface ProjectContext {
  /** Project name */
  name: string;
  /** Technology stack */
  techStack: string[];
  /** Design system */
  designSystem: string;
  /** Existing components */
  existingComponents: string[];
  /** Project conventions */
  conventions: ProjectConventions;
}

export interface StylePreferences {
  /** Color scheme */
  colorScheme: 'light' | 'dark' | 'auto';
  /** Component size preference */
  size: 'sm' | 'md' | 'lg';
  /** Border radius preference */
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Animation preferences */
  animations: boolean;
}

export interface PerformanceRequirements {
  /** Bundle size constraints */
  bundleSize?: 'minimal' | 'standard' | 'flexible';
  /** Rendering performance */
  renderingPerformance?: 'high' | 'standard';
  /** Memory usage */
  memoryUsage?: 'low' | 'standard';
}

export interface ProjectConventions {
  /** Naming convention */
  naming: 'camelCase' | 'PascalCase' | 'kebab-case';
  /** File organization */
  fileOrganization: 'flat' | 'nested' | 'feature-based';
  /** Import style */
  importStyle: 'named' | 'default' | 'namespace';
  /** Testing approach */
  testing: 'unit' | 'integration' | 'e2e' | 'all';
}