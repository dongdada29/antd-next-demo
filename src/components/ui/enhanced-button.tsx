/**
 * Enhanced Button Component
 * 
 * AI-friendly button component with comprehensive documentation,
 * examples, and generation prompts for AI agents.
 * 
 * @ai-component-config buttonComponentConfig
 * @ai-generation-prompt "Create a versatile button component with multiple variants"
 * @ai-styling-guide "Use Tailwind CSS with shadcn/ui design tokens"
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button variant styles using class-variance-authority
 * 
 * @ai-prompt "Generate button variants with proper Tailwind classes"
 * @ai-variants {
 *   "default": "Primary button with brand colors",
 *   "destructive": "For destructive actions like delete",
 *   "outline": "Secondary button with border",
 *   "secondary": "Muted secondary button",
 *   "ghost": "Minimal button without background",
 *   "link": "Link-styled button"
 * }
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component props interface
 * 
 * @ai-props-guide "Extend HTML button attributes with variant props"
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 
   * Render as child element using Radix Slot
   * @ai-usage "Use for composition with other components"
   */
  asChild?: boolean;
}

/**
 * Enhanced Button Component
 * 
 * @ai-component-description "Versatile button with multiple variants and sizes"
 * @ai-usage-examples [
 *   "<Button>Click me</Button>",
 *   "<Button variant='destructive'>Delete</Button>",
 *   "<Button variant='outline' size='sm'>Cancel</Button>",
 *   "<Button variant='ghost' size='icon'><Icon /></Button>"
 * ]
 * 
 * @ai-accessibility-features [
 *   "Keyboard navigation support",
 *   "Focus ring indicators", 
 *   "Screen reader compatible",
 *   "Proper ARIA attributes"
 * ]
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/**
 * AI Generation Metadata
 * 
 * This metadata helps AI agents understand how to use and generate
 * variations of this component.
 */
export const ButtonAIMetadata = {
  componentName: "Button",
  category: "ui",
  description: "A versatile button component with multiple variants and sizes",
  
  // Common use cases for AI to understand
  useCases: [
    "Primary actions (submit, save, create)",
    "Secondary actions (cancel, back)",
    "Destructive actions (delete, remove)",
    "Navigation (links, menu items)",
    "Icon-only actions (close, expand)"
  ],
  
  // AI generation prompts
  prompts: {
    basic: "Create a button with text content",
    withIcon: "Create a button with an icon and text",
    iconOnly: "Create an icon-only button",
    destructive: "Create a button for destructive actions",
    loading: "Create a button with loading state"
  },
  
  // Common patterns
  patterns: {
    formSubmit: '<Button type="submit">Submit</Button>',
    cancel: '<Button variant="outline">Cancel</Button>',
    delete: '<Button variant="destructive">Delete</Button>',
    iconButton: '<Button variant="ghost" size="icon"><Icon /></Button>',
    linkButton: '<Button variant="link">Learn more</Button>'
  },
  
  // Styling guidelines for AI
  stylingGuidelines: {
    spacing: "Use consistent padding from size variants",
    colors: "Use semantic color tokens (primary, destructive, etc.)",
    states: "Include hover, focus, and disabled states",
    accessibility: "Ensure proper contrast ratios and focus indicators"
  }
};

export { Button, buttonVariants, ButtonAIMetadata };