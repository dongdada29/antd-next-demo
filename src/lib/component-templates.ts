/**
 * AI-Friendly Component Templates
 * 
 * Standardized component templates with AI generation prompts
 * and comprehensive configuration for shadcn/ui components.
 */

import { AIComponentConfig, ComponentTemplate } from '@/types/ai-component';

/**
 * Button Component Configuration
 */
export const buttonComponentConfig: AIComponentConfig = {
  name: 'Button',
  type: 'ui',
  description: 'A versatile button component with multiple variants and sizes, built on shadcn/ui Button with Tailwind CSS styling.',
  props: [
    {
      name: 'variant',
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      required: false,
      description: 'The visual style variant of the button',
      defaultValue: 'default',
      examples: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    },
    {
      name: 'size',
      type: '"default" | "sm" | "lg" | "icon"',
      required: false,
      description: 'The size of the button',
      defaultValue: 'default',
      examples: ['default', 'sm', 'lg', 'icon']
    },
    {
      name: 'asChild',
      type: 'boolean',
      required: false,
      description: 'Render as child element (using Radix Slot)',
      defaultValue: false,
      examples: [true, false]
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Whether the button is disabled',
      defaultValue: false,
      examples: [true, false]
    },
    {
      name: 'onClick',
      type: '(event: React.MouseEvent<HTMLButtonElement>) => void',
      required: false,
      description: 'Click event handler',
      examples: ['() => console.log("clicked")', 'handleSubmit', 'onSave']
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'Button content (text, icons, etc.)',
      examples: ['"Click me"', '"Save"', '"<Icon /> Submit"']
    }
  ],
  variants: [
    {
      name: 'variant',
      defaultValue: 'default',
      description: 'Controls the visual appearance and color scheme',
      options: [
        {
          value: 'default',
          className: 'bg-primary text-primary-foreground hover:bg-primary/90',
          description: 'Primary button with brand colors'
        },
        {
          value: 'destructive',
          className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          description: 'Destructive actions (delete, remove)'
        },
        {
          value: 'outline',
          className: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          description: 'Outlined button for secondary actions'
        },
        {
          value: 'secondary',
          className: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          description: 'Secondary button with muted colors'
        },
        {
          value: 'ghost',
          className: 'hover:bg-accent hover:text-accent-foreground',
          description: 'Minimal button without background'
        },
        {
          value: 'link',
          className: 'text-primary underline-offset-4 hover:underline',
          description: 'Link-styled button'
        }
      ]
    },
    {
      name: 'size',
      defaultValue: 'default',
      description: 'Controls the button dimensions and padding',
      options: [
        {
          value: 'default',
          className: 'h-10 px-4 py-2',
          description: 'Standard button size'
        },
        {
          value: 'sm',
          className: 'h-9 rounded-md px-3',
          description: 'Small button for compact layouts'
        },
        {
          value: 'lg',
          className: 'h-11 rounded-md px-8',
          description: 'Large button for emphasis'
        },
        {
          value: 'icon',
          className: 'h-10 w-10',
          description: 'Square button for icons only'
        }
      ]
    }
  ],
  examples: [
    {
      title: 'Basic Button',
      description: 'A simple primary button',
      code: '<Button>Click me</Button>',
      props: { children: 'Click me' }
    },
    {
      title: 'Destructive Button',
      description: 'Button for destructive actions',
      code: '<Button variant="destructive">Delete</Button>',
      props: { variant: 'destructive', children: 'Delete' }
    },
    {
      title: 'Outline Button',
      description: 'Secondary action button',
      code: '<Button variant="outline" size="sm">Cancel</Button>',
      props: { variant: 'outline', size: 'sm', children: 'Cancel' }
    },
    {
      title: 'Icon Button',
      description: 'Button with icon only',
      code: '<Button variant="ghost" size="icon"><Icon /></Button>',
      props: { variant: 'ghost', size: 'icon', children: '<Icon />' }
    }
  ],
  prompts: {
    generation: `Create a Button component using shadcn/ui with the following characteristics:
- Use the existing buttonVariants from class-variance-authority
- Support all standard HTML button attributes
- Include proper TypeScript types with VariantProps
- Use React.forwardRef for ref forwarding
- Support asChild prop for composition with Radix Slot
- Apply Tailwind CSS classes through the cn utility
- Include proper accessibility attributes
- Follow shadcn/ui patterns and conventions`,
    modification: `When modifying the Button component:
- Preserve existing variant system and props
- Maintain TypeScript type safety
- Keep accessibility features intact
- Use Tailwind CSS classes for styling
- Test all variants and sizes
- Ensure proper focus states and keyboard navigation`,
    styling: `For Button styling:
- Use CSS variables for colors (--primary, --destructive, etc.)
- Apply hover and focus states with Tailwind modifiers
- Ensure proper contrast ratios for accessibility
- Use consistent spacing and sizing scales
- Support dark mode through CSS variables
- Include smooth transitions for interactive states`,
    testing: `Test the Button component:
- Render all variants and sizes correctly
- Handle click events properly
- Support keyboard navigation (Enter, Space)
- Maintain accessibility attributes
- Work with asChild prop and Radix Slot
- Display proper focus indicators
- Support disabled state correctly`
  },
  dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
  accessibility: {
    ariaAttributes: ['aria-label', 'aria-describedby', 'aria-pressed'],
    keyboardNavigation: true,
    screenReader: true,
    colorContrast: 'AA',
    focusManagement: ['focus-visible:outline-none', 'focus-visible:ring-2']
  }
};

/**
 * Card Component Configuration
 */
export const cardComponentConfig: AIComponentConfig = {
  name: 'Card',
  type: 'ui',
  description: 'A flexible card container component with header, content, and footer sections, perfect for displaying grouped information.',
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'Additional CSS classes for the card container',
      examples: ['"w-full max-w-md"', '"shadow-lg"', '"border-2"']
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'Card content (typically CardHeader, CardContent, CardFooter)',
      examples: ['<CardHeader>...</CardHeader>', '<CardContent>...</CardContent>']
    }
  ],
  variants: [
    {
      name: 'elevation',
      defaultValue: 'default',
      description: 'Controls the card shadow and elevation',
      options: [
        {
          value: 'flat',
          className: 'border',
          description: 'Flat card with border only'
        },
        {
          value: 'default',
          className: 'border shadow-sm',
          description: 'Standard card with subtle shadow'
        },
        {
          value: 'elevated',
          className: 'border shadow-md',
          description: 'Elevated card with prominent shadow'
        }
      ]
    }
  ],
  examples: [
    {
      title: 'Basic Card',
      description: 'Simple card with header and content',
      code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>`
    },
    {
      title: 'Card with Footer',
      description: 'Complete card with all sections',
      code: `<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Manage your account settings</p>
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>`
    }
  ],
  prompts: {
    generation: `Create a Card component system with the following structure:
- Main Card container with rounded corners and border
- CardHeader for titles and descriptions
- CardContent for main content area
- CardFooter for actions and buttons
- CardTitle for semantic heading elements
- CardDescription for subtitle text
- Use React.forwardRef for all components
- Apply proper semantic HTML structure
- Include consistent spacing and typography`,
    modification: `When modifying Card components:
- Maintain the modular structure (Header, Content, Footer)
- Preserve semantic HTML elements
- Keep consistent spacing between sections
- Ensure proper TypeScript types
- Test responsive behavior
- Maintain accessibility structure`,
    styling: `For Card styling:
- Use consistent border radius and shadows
- Apply proper spacing between sections
- Ensure readable typography hierarchy
- Support dark mode through CSS variables
- Use semantic color tokens
- Include hover states where appropriate`,
    testing: `Test Card components:
- Render all sub-components correctly
- Maintain proper spacing and layout
- Support responsive design
- Work with various content types
- Preserve semantic structure for screen readers
- Handle overflow content gracefully`
  },
  accessibility: {
    ariaAttributes: ['role', 'aria-labelledby', 'aria-describedby'],
    keyboardNavigation: false,
    screenReader: true,
    colorContrast: 'AA'
  }
};

/**
 * Input Component Configuration
 */
export const inputComponentConfig: AIComponentConfig = {
  name: 'Input',
  type: 'form',
  description: 'A styled input field component with proper focus states, validation support, and accessibility features.',
  props: [
    {
      name: 'type',
      type: 'string',
      required: false,
      description: 'HTML input type',
      defaultValue: 'text',
      examples: ['text', 'email', 'password', 'number', 'tel', 'url']
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      description: 'Placeholder text',
      examples: ['"Enter your email"', '"Search..."', '"Type here..."']
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Whether the input is disabled',
      defaultValue: false,
      examples: [true, false]
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Controlled input value',
      examples: ['state.email', 'formData.name']
    },
    {
      name: 'onChange',
      type: '(event: React.ChangeEvent<HTMLInputElement>) => void',
      required: false,
      description: 'Change event handler',
      examples: ['handleChange', 'setEmail', '(e) => setValue(e.target.value)']
    }
  ],
  variants: [
    {
      name: 'size',
      defaultValue: 'default',
      description: 'Controls input dimensions',
      options: [
        {
          value: 'sm',
          className: 'h-8 px-2 text-sm',
          description: 'Small input for compact forms'
        },
        {
          value: 'default',
          className: 'h-10 px-3',
          description: 'Standard input size'
        },
        {
          value: 'lg',
          className: 'h-12 px-4 text-lg',
          description: 'Large input for emphasis'
        }
      ]
    }
  ],
  examples: [
    {
      title: 'Basic Input',
      description: 'Simple text input',
      code: '<Input placeholder="Enter text" />',
      props: { placeholder: 'Enter text' }
    },
    {
      title: 'Email Input',
      description: 'Email input with validation',
      code: '<Input type="email" placeholder="Enter your email" />',
      props: { type: 'email', placeholder: 'Enter your email' }
    },
    {
      title: 'Controlled Input',
      description: 'Input with controlled value',
      code: '<Input value={value} onChange={setValue} />',
      props: { value: 'controlled value' }
    }
  ],
  prompts: {
    generation: `Create an Input component with the following features:
- Extend all standard HTML input attributes
- Use React.forwardRef for ref forwarding
- Apply consistent styling with Tailwind CSS
- Include proper focus and hover states
- Support disabled state styling
- Use the cn utility for class merging
- Include proper TypeScript types
- Support file inputs with custom styling`,
    modification: `When modifying Input component:
- Preserve all HTML input functionality
- Maintain focus and accessibility states
- Keep consistent styling patterns
- Test with different input types
- Ensure proper validation styling
- Support form libraries integration`,
    styling: `For Input styling:
- Use consistent border and focus ring colors
- Apply proper padding and height
- Include smooth transitions for states
- Support dark mode through CSS variables
- Ensure proper contrast for readability
- Style placeholder text appropriately`,
    testing: `Test Input component:
- Accept all standard input props
- Handle focus and blur events
- Support keyboard navigation
- Work with form validation
- Display proper error states
- Maintain accessibility attributes`
  },
  accessibility: {
    ariaAttributes: ['aria-label', 'aria-describedby', 'aria-invalid'],
    keyboardNavigation: true,
    screenReader: true,
    colorContrast: 'AA',
    focusManagement: ['focus-visible:ring-2']
  }
};

/**
 * Component Templates for Code Generation
 */
export const componentTemplates: ComponentTemplate[] = [
  {
    id: 'ui-component',
    name: 'UI Component Template',
    category: 'component',
    template: `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const {{componentName}}Variants = cva(
  "{{baseClasses}}",
  {
    variants: {
      {{variants}}
    },
    defaultVariants: {
      {{defaultVariants}}
    },
  }
);

export interface {{componentName}}Props
  extends React.{{htmlElement}}HTMLAttributes<HTML{{htmlElement}}Element>,
    VariantProps<typeof {{componentName}}Variants> {
  {{customProps}}
}

const {{componentName}} = React.forwardRef<
  HTML{{htmlElement}}Element,
  {{componentName}}Props
>(({ className, {{propsList}}, ...props }, ref) => {
  return (
    <{{htmlElement}}
      className={cn({{componentName}}Variants({ {{variantProps}}, className }))}
      ref={ref}
      {...props}
    />
  );
});

{{componentName}}.displayName = "{{componentName}}";

export { {{componentName}}, {{componentName}}Variants };`,
    variables: [
      {
        name: 'componentName',
        type: 'string',
        description: 'Name of the component in PascalCase',
        required: true
      },
      {
        name: 'baseClasses',
        type: 'string',
        description: 'Base Tailwind CSS classes',
        defaultValue: 'inline-flex items-center justify-center'
      },
      {
        name: 'htmlElement',
        type: 'string',
        description: 'HTML element type',
        defaultValue: 'Div'
      },
      {
        name: 'variants',
        type: 'string',
        description: 'Variant definitions',
        defaultValue: ''
      },
      {
        name: 'customProps',
        type: 'string',
        description: 'Custom component props',
        defaultValue: ''
      }
    ],
    prompts: {
      generation: 'Generate a shadcn/ui style component with variants',
      customization: 'Customize the component variants and props',
      integration: 'Integrate with existing design system'
    },
    metadata: {
      version: '1.0.0',
      author: 'AI Component Generator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['ui', 'component', 'shadcn'],
      complexity: 'intermediate'
    }
  }
];

/**
 * Default component configurations
 */
export const defaultComponentConfigs = [
  buttonComponentConfig,
  cardComponentConfig,
  inputComponentConfig
];