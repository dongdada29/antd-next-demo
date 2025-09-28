/**
 * Component Configuration Builder
 * 
 * Fluent API for building component configurations and generation requests.
 * Provides a user-friendly interface for creating AI component specifications.
 */

import { 
  ComponentGenerationRequest,
  ComponentPropSpec,
  StylingSpec,
  FunctionalitySpec,
  VariantSpec
} from './ai-component-generator';

/**
 * Component Configuration Builder Class
 */
export class ComponentConfigBuilder {
  private config: Partial<ComponentGenerationRequest> = {};

  /**
   * Set component name
   */
  name(name: string): ComponentConfigBuilder {
    this.config.name = name;
    return this;
  }

  /**
   * Set component type
   */
  type(type: 'ui' | 'form' | 'layout' | 'data' | 'common'): ComponentConfigBuilder {
    this.config.type = type;
    return this;
  }

  /**
   * Set component description
   */
  description(description: string): ComponentConfigBuilder {
    this.config.description = description;
    return this;
  }

  /**
   * Add a prop to the component
   */
  prop(name: string, type: string, options?: {
    required?: boolean;
    defaultValue?: any;
    description?: string;
  }): ComponentConfigBuilder {
    if (!this.config.props) {
      this.config.props = [];
    }

    this.config.props.push({
      name,
      type,
      required: options?.required || false,
      defaultValue: options?.defaultValue,
      description: options?.description || `${name} prop`
    });

    return this;
  }

  /**
   * Add multiple props at once
   */
  props(props: ComponentPropSpec[]): ComponentConfigBuilder {
    this.config.props = [...(this.config.props || []), ...props];
    return this;
  }

  /**
   * Add a variant to the component
   */
  variant(name: string, options: string[], defaultValue?: string): ComponentConfigBuilder {
    if (!this.config.styling) {
      this.config.styling = {};
    }
    if (!this.config.styling.variants) {
      this.config.styling.variants = [];
    }

    this.config.styling.variants.push({
      name,
      options,
      defaultValue: defaultValue || options[0]
    });

    return this;
  }

  /**
   * Configure styling options
   */
  styling(options: {
    responsive?: boolean;
    darkMode?: boolean;
    customClasses?: string[];
  }): ComponentConfigBuilder {
    this.config.styling = {
      ...this.config.styling,
      ...options
    };
    return this;
  }

  /**
   * Configure functionality options
   */
  functionality(options: {
    interactive?: boolean;
    stateful?: boolean;
    validation?: boolean;
    accessibility?: boolean;
    events?: string[];
  }): ComponentConfigBuilder {
    this.config.functionality = options;
    return this;
  }

  /**
   * Set base template
   */
  baseTemplate(templateId: string): ComponentConfigBuilder {
    this.config.baseTemplate = templateId;
    return this;
  }

  /**
   * Add requirements
   */
  requirements(...requirements: string[]): ComponentConfigBuilder {
    this.config.requirements = [...(this.config.requirements || []), ...requirements];
    return this;
  }

  /**
   * Build the final configuration
   */
  build(): ComponentGenerationRequest {
    if (!this.config.name) {
      throw new Error('Component name is required');
    }
    if (!this.config.type) {
      throw new Error('Component type is required');
    }
    if (!this.config.description) {
      throw new Error('Component description is required');
    }

    return this.config as ComponentGenerationRequest;
  }

  /**
   * Reset the builder
   */
  reset(): ComponentConfigBuilder {
    this.config = {};
    return this;
  }

  /**
   * Clone the current configuration
   */
  clone(): ComponentConfigBuilder {
    const newBuilder = new ComponentConfigBuilder();
    newBuilder.config = JSON.parse(JSON.stringify(this.config));
    return newBuilder;
  }
}

/**
 * Predefined component builders for common patterns
 */
export class ComponentPatterns {
  /**
   * Create a basic button component
   */
  static button(): ComponentConfigBuilder {
    return new ComponentConfigBuilder()
      .name('Button')
      .type('ui')
      .description('A versatile button component with multiple variants and sizes')
      .prop('children', 'React.ReactNode', { required: true, description: 'Button content' })
      .prop('disabled', 'boolean', { defaultValue: false, description: 'Whether the button is disabled' })
      .prop('onClick', '(event: React.MouseEvent) => void', { description: 'Click event handler' })
      .variant('variant', ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'], 'default')
      .variant('size', ['sm', 'default', 'lg', 'icon'], 'default')
      .functionality({
        interactive: true,
        accessibility: true,
        events: ['onClick', 'onFocus', 'onBlur']
      })
      .styling({
        responsive: true,
        darkMode: true
      });
  }

  /**
   * Create a basic input component
   */
  static input(): ComponentConfigBuilder {
    return new ComponentConfigBuilder()
      .name('Input')
      .type('form')
      .description('A styled input field with validation support')
      .prop('type', 'string', { defaultValue: 'text', description: 'HTML input type' })
      .prop('placeholder', 'string', { description: 'Placeholder text' })
      .prop('value', 'string', { description: 'Input value' })
      .prop('onChange', '(event: React.ChangeEvent<HTMLInputElement>) => void', { description: 'Change handler' })
      .prop('disabled', 'boolean', { defaultValue: false, description: 'Whether input is disabled' })
      .prop('error', 'string', { description: 'Error message' })
      .variant('size', ['sm', 'default', 'lg'], 'default')
      .functionality({
        validation: true,
        accessibility: true,
        events: ['onChange', 'onFocus', 'onBlur']
      })
      .styling({
        responsive: true,
        darkMode: true
      });
  }

  /**
   * Create a card component
   */
  static card(): ComponentConfigBuilder {
    return new ComponentConfigBuilder()
      .name('Card')
      .type('ui')
      .description('A flexible card container for grouping related content')
      .prop('children', 'React.ReactNode', { required: true, description: 'Card content' })
      .variant('variant', ['default', 'elevated', 'flat'], 'default')
      .functionality({
        accessibility: true
      })
      .styling({
        responsive: true,
        darkMode: true
      });
  }

  /**
   * Create a data table component
   */
  static dataTable(): ComponentConfigBuilder {
    return new ComponentConfigBuilder()
      .name('DataTable')
      .type('data')
      .description('A comprehensive data table with sorting, filtering, and pagination')
      .prop('data', 'T[]', { required: true, description: 'Table data array' })
      .prop('columns', 'DataTableColumn<T>[]', { required: true, description: 'Column definitions' })
      .prop('loading', 'boolean', { defaultValue: false, description: 'Loading state' })
      .prop('searchable', 'boolean', { defaultValue: false, description: 'Enable search functionality' })
      .prop('sortable', 'boolean', { defaultValue: false, description: 'Enable sorting' })
      .prop('paginated', 'boolean', { defaultValue: false, description: 'Enable pagination' })
      .prop('onRowClick', '(item: T, index: number) => void', { description: 'Row click handler' })
      .variant('variant', ['default', 'bordered', 'striped', 'compact'], 'default')
      .variant('size', ['sm', 'default', 'lg'], 'default')
      .functionality({
        interactive: true,
        stateful: true,
        accessibility: true,
        events: ['onRowClick', 'onSortChange', 'onSearchChange']
      })
      .styling({
        responsive: true,
        darkMode: true
      });
  }

  /**
   * Create a form component
   */
  static form(): ComponentConfigBuilder {
    return new ComponentConfigBuilder()
      .name('Form')
      .type('form')
      .description('A form container with validation and submission handling')
      .prop('children', 'React.ReactNode', { required: true, description: 'Form fields' })
      .prop('onSubmit', '(event: React.FormEvent) => void', { required: true, description: 'Form submission handler' })
      .prop('title', 'string', { description: 'Form title' })
      .prop('description', 'string', { description: 'Form description' })
      .prop('isLoading', 'boolean', { defaultValue: false, description: 'Loading state' })
      .prop('errors', 'Record<string, string>', { description: 'Validation errors' })
      .variant('variant', ['default', 'card', 'inline'], 'default')
      .functionality({
        validation: true,
        stateful: true,
        accessibility: true,
        events: ['onSubmit']
      })
      .styling({
        responsive: true,
        darkMode: true
      });
  }

  /**
   * Create a layout component
   */
  static layout(): ComponentConfigBuilder {
    return new ComponentConfigBuilder()
      .name('Layout')
      .type('layout')
      .description('A flexible layout container with responsive design')
      .prop('children', 'React.ReactNode', { required: true, description: 'Layout content' })
      .prop('header', 'React.ReactNode', { description: 'Header content' })
      .prop('sidebar', 'React.ReactNode', { description: 'Sidebar content' })
      .prop('footer', 'React.ReactNode', { description: 'Footer content' })
      .variant('layout', ['default', 'sidebar', 'dashboard'], 'default')
      .functionality({
        accessibility: true
      })
      .styling({
        responsive: true,
        darkMode: true
      });
  }
}

/**
 * Component builder factory functions
 */
export const ComponentBuilder = {
  /**
   * Create a new component builder
   */
  create(): ComponentConfigBuilder {
    return new ComponentConfigBuilder();
  },

  /**
   * Create from existing configuration
   */
  from(config: Partial<ComponentGenerationRequest>): ComponentConfigBuilder {
    const builder = new ComponentConfigBuilder();
    builder['config'] = { ...config };
    return builder;
  },

  /**
   * Get predefined patterns
   */
  patterns: ComponentPatterns
};

/**
 * Helper functions for common configurations
 */
export const ConfigHelpers = {
  /**
   * Create common UI component props
   */
  commonUIProps(): ComponentPropSpec[] {
    return [
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes'
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Component content'
      }
    ];
  },

  /**
   * Create common form props
   */
  commonFormProps(): ComponentPropSpec[] {
    return [
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: false,
        description: 'Whether the field is disabled'
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: false,
        description: 'Whether the field is required'
      },
      {
        name: 'error',
        type: 'string',
        description: 'Error message to display'
      }
    ];
  },

  /**
   * Create common size variants
   */
  sizeVariants(): VariantSpec {
    return {
      name: 'size',
      options: ['sm', 'default', 'lg'],
      defaultValue: 'default'
    };
  },

  /**
   * Create common color variants
   */
  colorVariants(): VariantSpec {
    return {
      name: 'variant',
      options: ['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost'],
      defaultValue: 'default'
    };
  },

  /**
   * Create responsive styling config
   */
  responsiveStyling(): StylingSpec {
    return {
      responsive: true,
      darkMode: true,
      customClasses: []
    };
  },

  /**
   * Create interactive functionality config
   */
  interactiveFunctionality(): FunctionalitySpec {
    return {
      interactive: true,
      accessibility: true,
      events: ['onClick', 'onFocus', 'onBlur']
    };
  }
};