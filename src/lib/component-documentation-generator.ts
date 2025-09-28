/**
 * Component Documentation Generator
 * 
 * Generates comprehensive documentation for AI-friendly components,
 * including usage examples, API references, and generation prompts.
 */

import { AIComponentConfig, CodeExample } from '@/types/ai-component';

export interface ComponentDocumentation {
  name: string;
  description: string;
  category: string;
  apiReference: APIReference;
  examples: DocumentationExample[];
  usageGuide: UsageGuide;
  aiPrompts: AIPrompts;
  accessibility: AccessibilityGuide;
  styling: StylingGuide;
}

export interface APIReference {
  props: PropDocumentation[];
  variants: VariantDocumentation[];
  methods?: MethodDocumentation[];
  events?: EventDocumentation[];
}

export interface PropDocumentation {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
  examples: string[];
}

export interface VariantDocumentation {
  name: string;
  type: string;
  options: VariantOptionDoc[];
  defaultValue: string;
  description: string;
}

export interface VariantOptionDoc {
  value: string;
  description: string;
  preview?: string;
}

export interface MethodDocumentation {
  name: string;
  signature: string;
  description: string;
  parameters: ParameterDoc[];
  returnType: string;
}

export interface ParameterDoc {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface EventDocumentation {
  name: string;
  signature: string;
  description: string;
  when: string;
}

export interface DocumentationExample {
  title: string;
  description: string;
  code: string;
  preview?: string;
  category: 'basic' | 'advanced' | 'integration' | 'styling';
}

export interface UsageGuide {
  installation: string;
  basicUsage: string;
  commonPatterns: string[];
  bestPractices: string[];
  troubleshooting: TroubleshootingItem[];
}

export interface TroubleshootingItem {
  issue: string;
  solution: string;
  code?: string;
}

export interface AIPrompts {
  generation: string;
  modification: string;
  styling: string;
  testing: string;
  integration: string;
}

export interface AccessibilityGuide {
  overview: string;
  keyboardNavigation: string[];
  screenReader: string[];
  ariaAttributes: string[];
  colorContrast: string;
  bestPractices: string[];
}

export interface StylingGuide {
  overview: string;
  customization: string[];
  themes: string[];
  responsive: string[];
  darkMode: string[];
}

/**
 * Component Documentation Generator Class
 */
export class ComponentDocumentationGenerator {
  /**
   * Generate complete documentation for a component
   */
  generateDocumentation(config: AIComponentConfig): ComponentDocumentation {
    return {
      name: config.name,
      description: config.description,
      category: config.type,
      apiReference: this.generateAPIReference(config),
      examples: this.generateExamples(config),
      usageGuide: this.generateUsageGuide(config),
      aiPrompts: this.generateAIPrompts(config),
      accessibility: this.generateAccessibilityGuide(config),
      styling: this.generateStylingGuide(config)
    };
  }

  /**
   * Generate API reference documentation
   */
  private generateAPIReference(config: AIComponentConfig): APIReference {
    const props: PropDocumentation[] = config.props.map(prop => ({
      name: prop.name,
      type: prop.type,
      required: prop.required,
      defaultValue: prop.defaultValue?.toString(),
      description: prop.description,
      examples: prop.examples.map(ex => String(ex))
    }));

    const variants: VariantDocumentation[] = config.variants.map(variant => ({
      name: variant.name,
      type: variant.options.map(opt => `"${opt.value}"`).join(' | '),
      options: variant.options.map(opt => ({
        value: opt.value,
        description: opt.description,
        preview: opt.className
      })),
      defaultValue: variant.defaultValue,
      description: variant.description
    }));

    return { props, variants };
  }

  /**
   * Generate usage examples
   */
  private generateExamples(config: AIComponentConfig): DocumentationExample[] {
    const examples: DocumentationExample[] = [];

    // Convert config examples
    config.examples.forEach(example => {
      examples.push({
        title: example.title,
        description: example.description,
        code: example.code,
        category: 'basic'
      });
    });

    // Generate additional examples
    examples.push(...this.generateAdvancedExamples(config));
    examples.push(...this.generateIntegrationExamples(config));
    examples.push(...this.generateStylingExamples(config));

    return examples;
  }

  /**
   * Generate advanced usage examples
   */
  private generateAdvancedExamples(config: AIComponentConfig): DocumentationExample[] {
    const examples: DocumentationExample[] = [];

    if (config.type === 'form') {
      examples.push({
        title: 'Form Integration',
        description: 'Using with React Hook Form',
        code: `import { useForm } from 'react-hook-form';

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <${config.name}
        {...register('field', { required: 'This field is required' })}
        error={errors.field?.message}
        label="Field Label"
      />
    </form>
  );
};`,
        category: 'advanced'
      });
    }

    if (config.variants.length > 0) {
      examples.push({
        title: 'All Variants',
        description: 'Showcase of all available variants',
        code: config.variants[0].options.map(option => 
          `<${config.name} ${config.variants[0].name}="${option.value}">
  ${option.description}
</${config.name}>`
        ).join('\n\n'),
        category: 'advanced'
      });
    }

    return examples;
  }

  /**
   * Generate integration examples
   */
  private generateIntegrationExamples(config: AIComponentConfig): DocumentationExample[] {
    const examples: DocumentationExample[] = [];

    // State management example
    examples.push({
      title: 'With State Management',
      description: 'Using with React state',
      code: `import { useState } from 'react';

const StatefulExample = () => {
  const [value, setValue] = useState('');
  
  return (
    <${config.name}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter value"
    />
  );
};`,
      category: 'integration'
    });

    return examples;
  }

  /**
   * Generate styling examples
   */
  private generateStylingExamples(config: AIComponentConfig): DocumentationExample[] {
    const examples: DocumentationExample[] = [];

    examples.push({
      title: 'Custom Styling',
      description: 'Customizing appearance with className',
      code: `<${config.name}
  className="w-full max-w-md mx-auto"
  // Additional custom styles
/>`,
      category: 'styling'
    });

    if (config.variants.length > 0) {
      examples.push({
        title: 'Responsive Variants',
        description: 'Using different variants at different breakpoints',
        code: `<${config.name}
  ${config.variants[0].name}="${config.variants[0].options[0].value}"
  className="sm:${config.variants[0].name}-${config.variants[0].options[1]?.value || 'default'}"
/>`,
        category: 'styling'
      });
    }

    return examples;
  }

  /**
   * Generate usage guide
   */
  private generateUsageGuide(config: AIComponentConfig): UsageGuide {
    return {
      installation: `// The ${config.name} component is included in the UI library
import { ${config.name} } from '@/components/ui/${config.name.toLowerCase()}';`,
      
      basicUsage: `// Basic usage
<${config.name}${config.props.filter(p => p.required).map(p => ` ${p.name}={${p.examples[0] || 'value'}}`).join('')}>
  Content
</${config.name}>`,
      
      commonPatterns: [
        `Basic ${config.name.toLowerCase()} with default styling`,
        `${config.name} with custom variants`,
        `Responsive ${config.name.toLowerCase()} design`,
        `${config.name} with state management`,
        `Accessible ${config.name.toLowerCase()} implementation`
      ],
      
      bestPractices: [
        `Always provide meaningful ${config.type === 'form' ? 'labels and validation' : 'content'}`,
        `Use semantic HTML elements when possible`,
        `Test keyboard navigation and screen reader compatibility`,
        `Follow the design system color and spacing tokens`,
        `Implement proper error handling and loading states`
      ],
      
      troubleshooting: [
        {
          issue: `${config.name} not rendering correctly`,
          solution: 'Ensure all required props are provided and Tailwind CSS is properly configured'
        },
        {
          issue: 'Styling conflicts with custom CSS',
          solution: 'Use the className prop to override styles, or check CSS specificity'
        },
        {
          issue: 'Accessibility warnings',
          solution: 'Verify ARIA attributes and semantic HTML structure'
        }
      ]
    };
  }

  /**
   * Generate AI prompts
   */
  private generateAIPrompts(config: AIComponentConfig): AIPrompts {
    return {
      generation: config.prompts.generation,
      modification: config.prompts.modification,
      styling: config.prompts.styling,
      testing: config.prompts.testing,
      integration: `When integrating ${config.name} with other components:
- Ensure proper prop passing and event handling
- Maintain consistent styling and spacing
- Test component interactions and state management
- Verify accessibility across component boundaries
- Follow established patterns for component composition`
    };
  }

  /**
   * Generate accessibility guide
   */
  private generateAccessibilityGuide(config: AIComponentConfig): AccessibilityGuide {
    const accessibility = config.accessibility;
    
    return {
      overview: `The ${config.name} component follows WCAG ${accessibility?.colorContrast || 'AA'} guidelines and includes comprehensive accessibility features.`,
      
      keyboardNavigation: accessibility?.keyboardNavigation ? [
        'Tab navigation supported',
        'Enter/Space activation for interactive elements',
        'Arrow key navigation where applicable',
        'Escape key handling for dismissible elements'
      ] : ['No keyboard navigation required for this component'],
      
      screenReader: accessibility?.screenReader ? [
        'Proper semantic HTML structure',
        'Meaningful text alternatives',
        'Status announcements for dynamic content',
        'Logical reading order'
      ] : ['Basic screen reader support through semantic HTML'],
      
      ariaAttributes: accessibility?.ariaAttributes || [
        'Standard HTML attributes provide basic accessibility'
      ],
      
      colorContrast: `Meets WCAG ${accessibility?.colorContrast || 'AA'} color contrast requirements`,
      
      bestPractices: [
        'Test with keyboard-only navigation',
        'Verify screen reader announcements',
        'Check color contrast ratios',
        'Validate HTML semantics',
        'Test with assistive technologies'
      ]
    };
  }

  /**
   * Generate styling guide
   */
  private generateStylingGuide(config: AIComponentConfig): StylingGuide {
    return {
      overview: `The ${config.name} component uses Tailwind CSS classes and CSS variables for consistent theming.`,
      
      customization: [
        'Use className prop to add custom styles',
        'Override CSS variables for theme customization',
        'Extend variants using class-variance-authority',
        'Apply responsive classes for different breakpoints'
      ],
      
      themes: [
        'Light and dark mode support through CSS variables',
        'Custom color schemes via theme configuration',
        'Brand color integration through design tokens'
      ],
      
      responsive: [
        'Mobile-first responsive design',
        'Breakpoint-specific styling with Tailwind prefixes',
        'Flexible layouts that adapt to screen size'
      ],
      
      darkMode: [
        'Automatic dark mode support via CSS variables',
        'Dark mode specific variants available',
        'Proper contrast ratios maintained in both modes'
      ]
    };
  }

  /**
   * Generate markdown documentation
   */
  generateMarkdown(config: AIComponentConfig): string {
    const doc = this.generateDocumentation(config);
    
    return `# ${doc.name}

${doc.description}

## Installation

\`\`\`bash
${doc.usageGuide.installation}
\`\`\`

## Basic Usage

\`\`\`tsx
${doc.usageGuide.basicUsage}
\`\`\`

## API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
${doc.apiReference.props.map(prop => 
  `| ${prop.name} | \`${prop.type}\` | ${prop.required ? '✓' : '✗'} | ${prop.defaultValue || '-'} | ${prop.description} |`
).join('\n')}

### Variants

${doc.apiReference.variants.map(variant => `
#### ${variant.name}

${variant.description}

| Value | Description |
|-------|-------------|
${variant.options.map(opt => `| \`${opt.value}\` | ${opt.description} |`).join('\n')}
`).join('\n')}

## Examples

${doc.examples.map(example => `
### ${example.title}

${example.description}

\`\`\`tsx
${example.code}
\`\`\`
`).join('\n')}

## Accessibility

${doc.accessibility.overview}

### Keyboard Navigation
${doc.accessibility.keyboardNavigation.map(item => `- ${item}`).join('\n')}

### Screen Reader Support
${doc.accessibility.screenReader.map(item => `- ${item}`).join('\n')}

## Styling

${doc.styling.overview}

### Customization
${doc.styling.customization.map(item => `- ${item}`).join('\n')}

## AI Generation Prompts

### Generation
${doc.aiPrompts.generation}

### Modification
${doc.aiPrompts.modification}

### Styling
${doc.aiPrompts.styling}

### Testing
${doc.aiPrompts.testing}
`;
  }
}

// Export singleton instance
export const componentDocGenerator = new ComponentDocumentationGenerator();