/**
 * Enhanced Card Component System
 * 
 * AI-friendly card components with comprehensive documentation,
 * usage patterns, and generation guidance for AI agents.
 * 
 * @ai-component-config cardComponentConfig
 * @ai-generation-prompt "Create a flexible card container with header, content, and footer"
 * @ai-styling-guide "Use consistent spacing and semantic structure"
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Card variant styles
 * 
 * @ai-variants {
 *   "default": "Standard card with subtle shadow",
 *   "elevated": "Card with prominent shadow for emphasis",
 *   "flat": "Minimal card with border only"
 * }
 */
const cardVariants = cva(
  "rounded-lg bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default: "border shadow-sm",
        elevated: "border shadow-md",
        flat: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Card container component props
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Main Card Container
 * 
 * @ai-component-description "Flexible container for grouped content"
 * @ai-usage "Use as wrapper for CardHeader, CardContent, and CardFooter"
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * Card Header Component
 * 
 * @ai-component-description "Container for card title and description"
 * @ai-usage "Place CardTitle and CardDescription inside"
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Card Title Component
 * 
 * @ai-component-description "Semantic heading for card content"
 * @ai-usage "Use for main card heading, automatically uses h3 element"
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Card Description Component
 * 
 * @ai-component-description "Subtitle or description text for cards"
 * @ai-usage "Use below CardTitle for additional context"
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Card Content Component
 * 
 * @ai-component-description "Main content area of the card"
 * @ai-usage "Contains the primary card content (text, forms, lists, etc.)"
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * Card Footer Component
 * 
 * @ai-component-description "Footer area for actions and buttons"
 * @ai-usage "Place buttons and action elements here"
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/**
 * AI Generation Metadata for Card System
 */
export const CardAIMetadata = {
  componentName: "Card",
  category: "ui",
  description: "Flexible card container system with header, content, and footer sections",
  
  // Component structure for AI understanding
  structure: {
    container: "Card - Main wrapper component",
    header: "CardHeader - Contains title and description",
    title: "CardTitle - Main heading (h3 element)",
    description: "CardDescription - Subtitle text",
    content: "CardContent - Main content area",
    footer: "CardFooter - Actions and buttons"
  },
  
  // Common use cases
  useCases: [
    "Information display (profiles, stats, summaries)",
    "Form containers (settings, preferences)",
    "Content previews (articles, products)",
    "Dashboard widgets (metrics, charts)",
    "Action panels (quick actions, tools)"
  ],
  
  // AI generation patterns
  patterns: {
    basic: `<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
</Card>`,
    
    withActions: `<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Configure your preferences</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
    <Button variant="outline">Cancel</Button>
  </CardFooter>
</Card>`,
    
    profile: `<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <CardDescription>Manage your account information</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div>Name: John Doe</div>
      <div>Email: john@example.com</div>
    </div>
  </CardContent>
</Card>`,
    
    stats: `<Card>
  <CardHeader>
    <CardTitle>Total Revenue</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">$12,345</div>
    <p className="text-sm text-muted-foreground">+20% from last month</p>
  </CardContent>
</Card>`
  },
  
  // Styling guidelines
  stylingGuidelines: {
    spacing: "Use consistent padding (p-6) for sections",
    typography: "CardTitle uses text-2xl, CardDescription uses text-sm",
    layout: "CardHeader has flex-col with space-y-1.5",
    colors: "Use semantic tokens (card, card-foreground, muted-foreground)",
    borders: "Consistent border radius and shadow variants"
  },
  
  // Accessibility guidelines
  accessibility: {
    structure: "Use semantic HTML (h3 for titles, p for descriptions)",
    navigation: "Cards can be focusable if interactive",
    contrast: "Ensure proper contrast for text elements",
    screenReader: "Provide meaningful titles and descriptions"
  },
  
  // AI prompts for different scenarios
  prompts: {
    informational: "Create a card to display information with title and content",
    interactive: "Create a card with actions in the footer",
    dashboard: "Create a dashboard widget card with metrics",
    form: "Create a card container for form elements",
    preview: "Create a preview card for content items"
  }
};

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardAIMetadata,
  cardVariants
};