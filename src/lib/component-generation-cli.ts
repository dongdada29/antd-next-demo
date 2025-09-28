/**
 * Component Generation CLI
 * 
 * Command-line interface for generating AI components with
 * interactive prompts and configuration options.
 */

import { 
  ComponentGenerationRequest,
  aiComponentGenerator 
} from './ai-component-generator';
import { 
  ComponentBuilder, 
  ComponentPatterns 
} from './component-config-builder';
import { componentMetadataManager } from './component-metadata-system';
import { aiComponentRegistry } from './ai-component-registry';

export interface CLIOptions {
  /** Component name */
  name?: string;
  /** Component type */
  type?: 'ui' | 'form' | 'layout' | 'data' | 'common';
  /** Component description */
  description?: string;
  /** Use interactive mode */
  interactive?: boolean;
  /** Output directory */
  output?: string;
  /** Use predefined pattern */
  pattern?: string;
  /** Generate tests */
  tests?: boolean;
  /** Generate documentation */
  docs?: boolean;
  /** Verbose output */
  verbose?: boolean;
}

export interface InteractivePrompt {
  type: 'input' | 'select' | 'multiselect' | 'confirm';
  name: string;
  message: string;
  choices?: string[];
  default?: any;
  validate?: (value: any) => boolean | string;
}

/**
 * Component Generation CLI Class
 */
export class ComponentGenerationCLI {
  private options: CLIOptions = {};

  /**
   * Run the CLI with given options
   */
  async run(options: CLIOptions): Promise<void> {
    this.options = options;

    try {
      if (options.interactive) {
        await this.runInteractiveMode();
      } else {
        await this.runDirectMode();
      }
    } catch (error) {
      this.logError('Generation failed:', error);
      process.exit(1);
    }
  }

  /**
   * Run interactive mode with prompts
   */
  private async runInteractiveMode(): Promise<void> {
    this.log('🚀 AI Component Generator - Interactive Mode');
    this.log('');

    // Check if user wants to use a pattern
    const usePattern = await this.prompt({
      type: 'confirm',
      name: 'usePattern',
      message: 'Would you like to use a predefined pattern?',
      default: false
    });

    let request: ComponentGenerationRequest;

    if (usePattern) {
      request = await this.selectPattern();
    } else {
      request = await this.buildCustomComponent();
    }

    await this.generateAndSave(request);
  }

  /**
   * Run direct mode with provided options
   */
  private async runDirectMode(): Promise<void> {
    if (!this.options.name || !this.options.type || !this.options.description) {
      throw new Error('Name, type, and description are required in direct mode');
    }

    const request: ComponentGenerationRequest = {
      name: this.options.name,
      type: this.options.type,
      description: this.options.description
    };

    await this.generateAndSave(request);
  }

  /**
   * Select and configure a predefined pattern
   */
  private async selectPattern(): Promise<ComponentGenerationRequest> {
    const patterns = [
      { name: 'Button', description: 'Interactive button component' },
      { name: 'Input', description: 'Form input field' },
      { name: 'Card', description: 'Content container' },
      { name: 'DataTable', description: 'Data table with features' },
      { name: 'Form', description: 'Form container' },
      { name: 'Layout', description: 'Page layout component' }
    ];

    const selectedPattern = await this.prompt({
      type: 'select',
      name: 'pattern',
      message: 'Select a component pattern:',
      choices: patterns.map(p => `${p.name} - ${p.description}`)
    });

    const patternName = selectedPattern.split(' - ')[0].toLowerCase();
    let builder: any;

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
      case 'datatable':
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

    // Allow customization of the pattern
    const customize = await this.prompt({
      type: 'confirm',
      name: 'customize',
      message: 'Would you like to customize this pattern?',
      default: false
    });

    if (customize) {
      builder = await this.customizeBuilder(builder);
    }

    return builder.build();
  }

  /**
   * Build a custom component from scratch
   */
  private async buildCustomComponent(): Promise<ComponentGenerationRequest> {
    const builder = ComponentBuilder.create();

    // Basic information
    const name = await this.prompt({
      type: 'input',
      name: 'name',
      message: 'Component name (PascalCase):',
      validate: (value: string) => {
        if (!value) return 'Name is required';
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) return 'Name must be in PascalCase';
        return true;
      }
    });

    const type = await this.prompt({
      type: 'select',
      name: 'type',
      message: 'Component type:',
      choices: ['ui', 'form', 'layout', 'data', 'common']
    });

    const description = await this.prompt({
      type: 'input',
      name: 'description',
      message: 'Component description:',
      validate: (value: string) => value ? true : 'Description is required'
    });

    builder.name(name).type(type).description(description);

    // Add props
    const addProps = await this.prompt({
      type: 'confirm',
      name: 'addProps',
      message: 'Add custom props?',
      default: true
    });

    if (addProps) {
      await this.addPropsToBuilder(builder);
    }

    // Add variants
    const addVariants = await this.prompt({
      type: 'confirm',
      name: 'addVariants',
      message: 'Add style variants?',
      default: true
    });

    if (addVariants) {
      await this.addVariantsToBuilder(builder);
    }

    // Configure functionality
    await this.configureFunctionality(builder);

    return builder.build();
  }

  /**
   * Customize an existing builder
   */
  private async customizeBuilder(builder: any): Promise<any> {
    const customizations = await this.prompt({
      type: 'multiselect',
      name: 'customizations',
      message: 'What would you like to customize?',
      choices: [
        'Component name',
        'Description',
        'Add props',
        'Modify variants',
        'Configure functionality'
      ]
    });

    for (const customization of customizations) {
      switch (customization) {
        case 'Component name':
          const newName = await this.prompt({
            type: 'input',
            name: 'name',
            message: 'New component name:'
          });
          builder.name(newName);
          break;

        case 'Description':
          const newDescription = await this.prompt({
            type: 'input',
            name: 'description',
            message: 'New description:'
          });
          builder.description(newDescription);
          break;

        case 'Add props':
          await this.addPropsToBuilder(builder);
          break;

        case 'Modify variants':
          await this.addVariantsToBuilder(builder);
          break;

        case 'Configure functionality':
          await this.configureFunctionality(builder);
          break;
      }
    }

    return builder;
  }

  /**
   * Add props to builder interactively
   */
  private async addPropsToBuilder(builder: any): Promise<void> {
    let addMore = true;

    while (addMore) {
      const propName = await this.prompt({
        type: 'input',
        name: 'propName',
        message: 'Prop name:'
      });

      const propType = await this.prompt({
        type: 'input',
        name: 'propType',
        message: 'Prop type:',
        default: 'string'
      });

      const required = await this.prompt({
        type: 'confirm',
        name: 'required',
        message: 'Is this prop required?',
        default: false
      });

      const description = await this.prompt({
        type: 'input',
        name: 'description',
        message: 'Prop description:'
      });

      builder.prop(propName, propType, { required, description });

      addMore = await this.prompt({
        type: 'confirm',
        name: 'addMore',
        message: 'Add another prop?',
        default: false
      });
    }
  }

  /**
   * Add variants to builder interactively
   */
  private async addVariantsToBuilder(builder: any): Promise<void> {
    let addMore = true;

    while (addMore) {
      const variantName = await this.prompt({
        type: 'input',
        name: 'variantName',
        message: 'Variant name:'
      });

      const optionsInput = await this.prompt({
        type: 'input',
        name: 'options',
        message: 'Variant options (comma-separated):'
      });

      const options = optionsInput.split(',').map((opt: string) => opt.trim());

      const defaultValue = await this.prompt({
        type: 'select',
        name: 'defaultValue',
        message: 'Default value:',
        choices: options
      });

      builder.variant(variantName, options, defaultValue);

      addMore = await this.prompt({
        type: 'confirm',
        name: 'addMore',
        message: 'Add another variant?',
        default: false
      });
    }
  }

  /**
   * Configure functionality options
   */
  private async configureFunctionality(builder: any): Promise<void> {
    const features = await this.prompt({
      type: 'multiselect',
      name: 'features',
      message: 'Select functionality features:',
      choices: [
        'Interactive (click, hover, focus)',
        'Stateful (internal state management)',
        'Validation (form validation)',
        'Accessibility (ARIA attributes)',
        'Responsive design',
        'Dark mode support'
      ]
    });

    const functionality: any = {};
    const styling: any = {};

    if (features.includes('Interactive (click, hover, focus)')) {
      functionality.interactive = true;
      functionality.events = ['onClick', 'onFocus', 'onBlur'];
    }

    if (features.includes('Stateful (internal state management)')) {
      functionality.stateful = true;
    }

    if (features.includes('Validation (form validation)')) {
      functionality.validation = true;
    }

    if (features.includes('Accessibility (ARIA attributes)')) {
      functionality.accessibility = true;
    }

    if (features.includes('Responsive design')) {
      styling.responsive = true;
    }

    if (features.includes('Dark mode support')) {
      styling.darkMode = true;
    }

    if (Object.keys(functionality).length > 0) {
      builder.functionality(functionality);
    }

    if (Object.keys(styling).length > 0) {
      builder.styling(styling);
    }
  }

  /**
   * Generate component and save to files
   */
  private async generateAndSave(request: ComponentGenerationRequest): Promise<void> {
    this.log('🔄 Generating component...');

    const generated = await aiComponentGenerator.generateComponent(request);
    
    // Register with metadata system
    const metadata = componentMetadataManager.registerComponent(request, generated);
    
    // Register with component registry
    aiComponentRegistry.registerComponent(generated.config);

    this.log('✅ Component generated successfully!');
    this.log('');

    // Display summary
    this.displayGenerationSummary(generated, metadata);

    // Save files
    if (this.options.output) {
      await this.saveFiles(generated, this.options.output);
    } else {
      // Just display the code
      this.log('📄 Generated Code:');
      this.log('');
      this.log(generated.code);
    }
  }

  /**
   * Display generation summary
   */
  private displayGenerationSummary(generated: any, metadata: any): void {
    this.log('📊 Generation Summary:');
    this.log(`   Name: ${generated.config.name}`);
    this.log(`   Type: ${generated.config.type}`);
    this.log(`   Props: ${generated.config.props.length}`);
    this.log(`   Variants: ${generated.config.variants.length}`);
    this.log(`   Quality Score: ${metadata.quality.codeQuality}/100`);
    this.log(`   Lines of Code: ${generated.code.split('\n').length}`);
    this.log('');
  }

  /**
   * Save generated files
   */
  private async saveFiles(generated: any, outputDir: string): Promise<void> {
    // This would implement actual file saving
    this.log(`💾 Files would be saved to: ${outputDir}`);
    this.log(`   - ${generated.config.name}.tsx`);
    
    if (this.options.tests && generated.tests) {
      this.log(`   - ${generated.config.name}.test.tsx`);
    }
    
    if (this.options.docs) {
      this.log(`   - ${generated.config.name}.md`);
    }
  }

  /**
   * Utility methods for CLI interaction
   */
  private async prompt(config: InteractivePrompt): Promise<any> {
    // This would use a real CLI prompt library like inquirer
    // For now, return mock responses based on the prompt type
    switch (config.type) {
      case 'input':
        return config.default || 'MockInput';
      case 'select':
        return config.choices?.[0] || config.default;
      case 'multiselect':
        return config.choices?.slice(0, 2) || [];
      case 'confirm':
        return config.default || false;
      default:
        return config.default;
    }
  }

  private log(message: string): void {
    if (this.options.verbose !== false) {
      console.log(message);
    }
  }

  private logError(message: string, error?: any): void {
    console.error(`❌ ${message}`);
    if (error && this.options.verbose) {
      console.error(error);
    }
  }
}

/**
 * CLI Command Handlers
 */
export class ComponentCLICommands {
  private cli = new ComponentGenerationCLI();

  /**
   * Generate command
   */
  async generate(options: CLIOptions): Promise<void> {
    await this.cli.run(options);
  }

  /**
   * List existing components
   */
  async list(options: { category?: string; status?: string }): Promise<void> {
    const components = componentMetadataManager.searchComponents({
      category: options.category as any,
      status: options.status as any
    });

    console.log('📋 Generated Components:');
    console.log('');

    if (components.length === 0) {
      console.log('   No components found.');
      return;
    }

    components.forEach(comp => {
      console.log(`   ${comp.name} (${comp.generationRequest.type})`);
      console.log(`     Status: ${comp.status}`);
      console.log(`     Quality: ${comp.quality.codeQuality}/100`);
      console.log(`     Usage: ${comp.usage.usageCount} times`);
      console.log('');
    });
  }

  /**
   * Show analytics
   */
  async analytics(): Promise<void> {
    const analytics = componentMetadataManager.getAnalytics();

    console.log('📈 Component Analytics:');
    console.log('');
    console.log(`   Total Components: ${analytics.totalComponents}`);
    console.log(`   Average Quality: ${analytics.averageQuality.codeQuality.toFixed(1)}/100`);
    console.log(`   User Satisfaction: ${analytics.userSatisfaction.toFixed(1)}/5`);
    console.log('');

    console.log('   Components by Category:');
    Object.entries(analytics.componentsByCategory).forEach(([category, count]) => {
      console.log(`     ${category}: ${count}`);
    });
    console.log('');

    console.log('   Most Popular Components:');
    analytics.popularComponents.slice(0, 5).forEach(comp => {
      console.log(`     ${comp.name}: ${comp.count} uses`);
    });
  }

  /**
   * Show component details
   */
  async show(name: string): Promise<void> {
    const component = componentMetadataManager.getComponentByName(name);
    
    if (!component) {
      console.log(`❌ Component '${name}' not found.`);
      return;
    }

    console.log(`📄 Component: ${component.name}`);
    console.log('');
    console.log(`   Description: ${component.generationRequest.description}`);
    console.log(`   Type: ${component.generationRequest.type}`);
    console.log(`   Status: ${component.status}`);
    console.log(`   Created: ${component.createdAt.toLocaleDateString()}`);
    console.log(`   Updated: ${component.updatedAt.toLocaleDateString()}`);
    console.log('');
    console.log(`   Quality Metrics:`);
    console.log(`     Code Quality: ${component.quality.codeQuality}/100`);
    console.log(`     Accessibility: ${component.quality.accessibility}/100`);
    console.log(`     Maintainability: ${component.quality.maintainability}/100`);
    console.log('');
    console.log(`   Usage Statistics:`);
    console.log(`     Generation Count: ${component.usage.generationCount}`);
    console.log(`     Usage Count: ${component.usage.usageCount}`);
    console.log(`     Projects: ${component.usage.projects.length}`);
  }
}

// Export CLI instance
export const componentCLI = new ComponentCLICommands();