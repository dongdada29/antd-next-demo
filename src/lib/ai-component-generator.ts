/**
 * AI Component Generator
 * 
 * Advanced component generation system that creates React components
 * based on AI specifications, user requirements, and design patterns.
 */

import { 
  AIComponentConfig, 
  ComponentTemplate, 
  AIGenerationContext,
  TemplateVariable 
} from '@/types/ai-component';
import { aiComponentRegistry } from './ai-component-registry';

export interface ComponentGenerationRequest {
  /** Component name */
  name: string;
  /** Component type/category */
  type: 'ui' | 'form' | 'layout' | 'data' | 'common';
  /** Component description */
  description: string;
  /** Required props */
  props?: ComponentPropSpec[];
  /** Styling requirements */
  styling?: StylingSpec;
  /** Functionality requirements */
  functionality?: FunctionalitySpec;
  /** Template to use as base */
  baseTemplate?: string;
  /** Additional requirements */
  requirements?: string[];
}

export interface ComponentPropSpec {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
  description?: string;
}

export interface StylingSpec {
  variants?: VariantSpec[];
  responsive?: boolean;
  darkMode?: boolean;
  customClasses?: string[];
}

export interface VariantSpec {
  name: string;
  options: string[];
  defaultValue?: string;
}

export interface FunctionalitySpec {
  interactive?: boolean;
  stateful?: boolean;
  validation?: boolean;
  accessibility?: boolean;
  events?: string[];
}

export interface GeneratedComponent {
  /** Generated component code */
  code: string;
  /** Component configuration */
  config: AIComponentConfig;
  /** Usage examples */
  examples: string[];
  /** Documentation */
  documentation: string;
  /** Test code */
  tests?: string;
}

/**
 * AI Component Generator Class
 */
export class AIComponentGenerator {
  /**
   * Generate a complete component based on specifications
   */
  async generateComponent(request: ComponentGenerationRequest): Promise<GeneratedComponent> {
    // Find or create component configuration
    const config = await this.createComponentConfig(request);
    
    // Generate component code
    const code = await this.generateComponentCode(config, request);
    
    // Generate examples
    const examples = this.generateExamples(config, request);
    
    // Generate documentation
    const documentation = this.generateDocumentation(config, request);
    
    // Generate tests (optional)
    const tests = this.generateTests(config, request);

    return {
      code,
      config,
      examples,
      documentation,
      tests
    };
  }

  /**
   * Create component configuration from request
   */
  private async createComponentConfig(request: ComponentGenerationRequest): Promise<AIComponentConfig> {
    const config: AIComponentConfig = {
      name: request.name,
      type: request.type,
      description: request.description,
      props: this.convertPropsSpec(request.props || []),
      variants: this.convertVariantsSpec(request.styling?.variants || []),
      examples: [],
      prompts: this.generatePrompts(request),
      dependencies: this.determineDependencies(request),
      accessibility: this.generateAccessibilityConfig(request.functionality)
    };

    return config;
  }

  /**
   * Generate component code
   */
  private async generateComponentCode(
    config: AIComponentConfig, 
    request: ComponentGenerationRequest
  ): Promise<string> {
    // Try to use existing template
    if (request.baseTemplate) {
      const template = aiComponentRegistry.getTemplate(request.baseTemplate);
      if (template) {
        return this.applyTemplate(template, config, request);
      }
    }

    // Generate from scratch
    return this.generateFromScratch(config, request);
  }

  /**
   * Apply template to generate component
   */
  private applyTemplate(
    template: ComponentTemplate,
    config: AIComponentConfig,
    request: ComponentGenerationRequest
  ): string {
    let code = template.template;

    // Replace template variables
    const variables = this.createTemplateVariables(config, request);
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      code = code.replace(placeholder, String(value));
    }

    return code;
  }

  /**
   * Generate component from scratch
   */
  private generateFromScratch(
    config: AIComponentConfig,
    request: ComponentGenerationRequest
  ): string {
    const imports = this.generateImports(config, request);
    const types = this.generateTypes(config, request);
    const variants = this.generateVariants(config, request);
    const component = this.generateComponentFunction(config, request);
    const exports = this.generateExports(config);

    return `${imports}

${types}

${variants}

${component}

${exports}`;
  }

  /**
   * Generate imports section
   */
  private generateImports(config: AIComponentConfig, request: ComponentGenerationRequest): string {
    const imports = [
      `import * as React from "react";`
    ];

    // Add variant imports if needed
    if (config.variants.length > 0) {
      imports.push(`import { cva, type VariantProps } from "class-variance-authority";`);
    }

    // Add utility imports
    imports.push(`import { cn } from "@/lib/utils";`);

    // Add dependency imports
    if (config.dependencies) {
      config.dependencies.forEach(dep => {
        if (dep === '@radix-ui/react-slot') {
          imports.push(`import { Slot } from "@radix-ui/react-slot";`);
        }
      });
    }

    return imports.join('\n');
  }

  /**
   * Generate TypeScript types
   */
  private generateTypes(config: AIComponentConfig, request: ComponentGenerationRequest): string {
    const propsInterface = `export interface ${config.name}Props
  extends React.${this.getHTMLElementType(request)}HTMLAttributes<HTML${this.getHTMLElementType(request)}Element>${config.variants.length > 0 ? `,
    VariantProps<typeof ${config.name.toLowerCase()}Variants>` : ''} {
${config.props.map(prop => 
  `  /** ${prop.description} */
  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};`
).join('\n')}
}`;

    return propsInterface;
  }

  /**
   * Generate variant definitions
   */
  private generateVariants(config: AIComponentConfig, request: ComponentGenerationRequest): string {
    if (config.variants.length === 0) return '';

    const baseClasses = this.generateBaseClasses(request);
    const variantDefinitions = config.variants.map(variant => {
      const options = variant.options.map(option => 
        `        ${option.value}: "${option.className}"`
      ).join(',\n');
      
      return `      ${variant.name}: {
${options}
      }`;
    }).join(',\n');

    const defaultVariants = config.variants.map(variant => 
      `      ${variant.name}: "${variant.defaultValue}"`
    ).join(',\n');

    return `const ${config.name.toLowerCase()}Variants = cva(
  "${baseClasses}",
  {
    variants: {
${variantDefinitions}
    },
    defaultVariants: {
${defaultVariants}
    },
  }
);`;
  }

  /**
   * Generate component function
   */
  private generateComponentFunction(config: AIComponentConfig, request: ComponentGenerationRequest): string {
    const elementType = this.getHTMLElementType(request);
    const propsList = this.generatePropsList(config);
    const variantProps = config.variants.map(v => v.name).join(', ');

    return `const ${config.name} = React.forwardRef<
  HTML${elementType}Element,
  ${config.name}Props
>(({ className, ${propsList}, ...props }, ref) => {
  return (
    <${elementType.toLowerCase()}
      className={cn(${config.variants.length > 0 ? `${config.name.toLowerCase()}Variants({ ${variantProps}, className })` : 'className'})}
      ref={ref}
      {...props}
    />
  );
});

${config.name}.displayName = "${config.name}";`;
  }

  /**
   * Generate exports
   */
  private generateExports(config: AIComponentConfig): string {
    const exports = [`${config.name}`];
    
    if (config.variants.length > 0) {
      exports.push(`${config.name.toLowerCase()}Variants`);
    }

    return `export { ${exports.join(', ')} };`;
  }

  /**
   * Generate usage examples
   */
  private generateExamples(config: AIComponentConfig, request: ComponentGenerationRequest): string[] {
    const examples = [
      `// Basic usage
<${config.name}>
  Content
</${config.name}>`,
    ];

    // Add variant examples
    config.variants.forEach(variant => {
      variant.options.slice(0, 2).forEach(option => {
        examples.push(`// ${option.description}
<${config.name} ${variant.name}="${option.value}">
  ${option.description}
</${config.name}>`);
      });
    });

    // Add prop examples
    const requiredProps = config.props.filter(p => p.required);
    if (requiredProps.length > 0) {
      const propString = requiredProps.map(p => 
        `${p.name}={${p.examples[0] || 'value'}}`
      ).join(' ');
      
      examples.push(`// With required props
<${config.name} ${propString}>
  Content
</${config.name}>`);
    }

    return examples;
  }

  /**
   * Generate component documentation
   */
  private generateDocumentation(config: AIComponentConfig, request: ComponentGenerationRequest): string {
    return `# ${config.name}

${config.description}

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
${config.props.map(prop => 
  `| ${prop.name} | \`${prop.type}\` | ${prop.required ? '✓' : '✗'} | ${prop.defaultValue || '-'} | ${prop.description} |`
).join('\n')}

## Variants

${config.variants.map(variant => `
### ${variant.name}

${variant.description}

| Value | Description |
|-------|-------------|
${variant.options.map(opt => `| \`${opt.value}\` | ${opt.description} |`).join('\n')}
`).join('\n')}

## Examples

${this.generateExamples(config, request).map((example, index) => `
### Example ${index + 1}

\`\`\`tsx
${example}
\`\`\`
`).join('\n')}

## Accessibility

${config.accessibility ? `
- ${config.accessibility.ariaAttributes.map(attr => `ARIA attribute: ${attr}`).join('\n- ')}
- Keyboard navigation: ${config.accessibility.keyboardNavigation ? 'Supported' : 'Not applicable'}
- Screen reader: ${config.accessibility.screenReader ? 'Compatible' : 'Basic support'}
- Color contrast: ${config.accessibility.colorContrast} compliant
` : 'Standard HTML accessibility features'}`;
  }

  /**
   * Generate test code
   */
  private generateTests(config: AIComponentConfig, request: ComponentGenerationRequest): string {
    return `import { render, screen } from '@testing-library/react';
import { ${config.name} } from './${config.name}';

describe('${config.name}', () => {
  it('renders correctly', () => {
    render(<${config.name}>Test content</${config.name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<${config.name} className="custom-class">Content</${config.name}>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });

${config.variants.map(variant => `
  describe('${variant.name} variants', () => {
${variant.options.map(option => `    it('renders ${option.value} variant', () => {
      render(<${config.name} ${variant.name}="${option.value}">Content</${config.name}>);
      // Add specific assertions for ${option.value} variant
    });`).join('\n\n')}
  });`).join('\n')}

${config.props.filter(p => p.required).map(prop => `
  it('handles ${prop.name} prop', () => {
    const ${prop.name} = ${prop.examples[0] || 'testValue'};
    render(<${config.name} ${prop.name}={${prop.name}}>Content</${config.name}>);
    // Add assertions for ${prop.name} prop
  });`).join('\n')}
});`;
  }

  /**
   * Helper methods
   */
  private convertPropsSpec(props: ComponentPropSpec[]) {
    return props.map(prop => ({
      name: prop.name,
      type: prop.type,
      required: prop.required || false,
      description: prop.description || `${prop.name} prop`,
      defaultValue: prop.defaultValue,
      examples: [prop.defaultValue || 'value']
    }));
  }

  private convertVariantsSpec(variants: VariantSpec[]) {
    return variants.map(variant => ({
      name: variant.name,
      defaultValue: variant.defaultValue || variant.options[0],
      description: `Controls ${variant.name} appearance`,
      options: variant.options.map(option => ({
        value: option,
        className: this.generateVariantClassName(variant.name, option),
        description: `${variant.name} ${option}`
      }))
    }));
  }

  private generatePrompts(request: ComponentGenerationRequest) {
    return {
      generation: `Create a ${request.name} component with the following features: ${request.description}`,
      modification: `Modify the ${request.name} component while preserving its core functionality`,
      styling: `Style the ${request.name} component using Tailwind CSS classes`,
      testing: `Test the ${request.name} component functionality and variants`
    };
  }

  private determineDependencies(request: ComponentGenerationRequest): string[] {
    const deps = [];
    
    if (request.styling?.variants && request.styling.variants.length > 0) {
      deps.push('class-variance-authority');
    }
    
    if (request.functionality?.interactive) {
      deps.push('@radix-ui/react-slot');
    }
    
    return deps;
  }

  private generateAccessibilityConfig(functionality?: FunctionalitySpec) {
    return {
      ariaAttributes: functionality?.accessibility ? ['aria-label', 'aria-describedby'] : [],
      keyboardNavigation: functionality?.interactive || false,
      screenReader: true,
      colorContrast: 'AA' as const
    };
  }

  private createTemplateVariables(config: AIComponentConfig, request: ComponentGenerationRequest) {
    return {
      componentName: config.name,
      baseClasses: this.generateBaseClasses(request),
      htmlElement: this.getHTMLElementType(request),
      variants: this.generateVariantString(config.variants),
      defaultVariants: this.generateDefaultVariantString(config.variants),
      customProps: config.props.map(p => `${p.name}?: ${p.type};`).join('\n  '),
      propsList: this.generatePropsList(config),
      variantProps: config.variants.map(v => v.name).join(', ')
    };
  }

  private getHTMLElementType(request: ComponentGenerationRequest): string {
    switch (request.type) {
      case 'form': return 'Input';
      case 'layout': return 'Div';
      case 'ui': return 'Button';
      default: return 'Div';
    }
  }

  private generateBaseClasses(request: ComponentGenerationRequest): string {
    const baseClasses = [];
    
    switch (request.type) {
      case 'ui':
        baseClasses.push('inline-flex', 'items-center', 'justify-center');
        break;
      case 'form':
        baseClasses.push('flex', 'w-full', 'rounded-md', 'border');
        break;
      case 'layout':
        baseClasses.push('block');
        break;
      default:
        baseClasses.push('block');
    }

    if (request.styling?.responsive) {
      baseClasses.push('responsive');
    }

    return baseClasses.join(' ');
  }

  private generateVariantClassName(variantName: string, option: string): string {
    // Generate appropriate Tailwind classes based on variant and option
    const classMap: Record<string, Record<string, string>> = {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
      },
      size: {
        sm: 'h-8 px-2 text-sm',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-lg'
      }
    };

    return classMap[variantName]?.[option] || `${variantName}-${option}`;
  }

  private generateVariantString(variants: any[]): string {
    return variants.map(variant => {
      const options = variant.options.map((opt: any) => 
        `        ${opt.value}: "${opt.className}"`
      ).join(',\n');
      
      return `      ${variant.name}: {
${options}
      }`;
    }).join(',\n');
  }

  private generateDefaultVariantString(variants: any[]): string {
    return variants.map(variant => 
      `      ${variant.name}: "${variant.defaultValue}"`
    ).join(',\n');
  }

  private generatePropsList(config: AIComponentConfig): string {
    const props = ['className'];
    
    config.variants.forEach(variant => {
      props.push(variant.name);
    });
    
    config.props.forEach(prop => {
      props.push(prop.name);
    });
    
    return props.join(', ');
  }
}

// Export singleton instance
export const aiComponentGenerator = new AIComponentGenerator();