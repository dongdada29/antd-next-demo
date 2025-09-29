/**
 * Enhanced UI Components Index
 * 
 * Exports all AI-friendly UI components with metadata and documentation.
 * This index provides both the original components and enhanced versions
 * with AI generation capabilities.
 */

// Original shadcn/ui components
export { Button, buttonVariants } from './button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { Input } from './input';
export { Label } from './label';
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './table';
export { Badge } from './badge';

// Form components  
export { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from './form';

// New components
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { Alert, AlertTitle, AlertDescription } from './alert';
export { Separator } from './separator';
export { ScrollArea, ScrollBar } from './scroll-area';
export { Textarea } from './textarea';
export { Switch } from './switch';
export { Slider } from './slider';
export { Progress } from './progress';
export { Avatar, AvatarImage, AvatarFallback } from './avatar';

// Enhanced AI-friendly components with metadata
export { 
  Button as EnhancedButton, 
  buttonVariants as enhancedButtonVariants,
  ButtonAIMetadata 
} from './enhanced-button';

export { 
  Card as EnhancedCard,
  CardHeader as EnhancedCardHeader,
  CardFooter as EnhancedCardFooter,
  CardTitle as EnhancedCardTitle,
  CardDescription as EnhancedCardDescription,
  CardContent as EnhancedCardContent,
  CardAIMetadata,
  cardVariants
} from './enhanced-card';

export { 
  Input as EnhancedInput,
  SimpleInput,
  InputAIMetadata,
  inputVariants
} from './enhanced-input';

// AI Component metadata collection
export const AIComponentMetadata = {
  Button: () => import('./enhanced-button').then(m => m.ButtonAIMetadata),
  Card: () => import('./enhanced-card').then(m => m.CardAIMetadata),
  Input: () => import('./enhanced-input').then(m => m.InputAIMetadata),
};

// Component registry for AI agents
export const UIComponentRegistry = {
  // Basic UI components
  Button: {
    component: 'Button',
    enhanced: 'EnhancedButton',
    metadata: 'ButtonAIMetadata',
    category: 'ui',
    description: 'Versatile button component with multiple variants'
  },
  Card: {
    component: 'Card',
    enhanced: 'EnhancedCard',
    metadata: 'CardAIMetadata',
    category: 'ui',
    description: 'Flexible card container with header, content, and footer'
  },
  Input: {
    component: 'Input',
    enhanced: 'EnhancedInput',
    metadata: 'InputAIMetadata',
    category: 'form',
    description: 'Styled input field with validation support'
  },
  Label: {
    component: 'Label',
    category: 'form',
    description: 'Accessible label component for form fields'
  },
  Table: {
    component: 'Table',
    category: 'data',
    description: 'Data table components for displaying tabular data'
  }
};

// Helper function for AI agents to get component info
export function getComponentInfo(componentName: string) {
  return UIComponentRegistry[componentName as keyof typeof UIComponentRegistry];
}

// Helper function to get all available components
export function getAllComponents() {
  return Object.keys(UIComponentRegistry);
}

// Helper function to get components by category
export function getComponentsByCategory(category: string) {
  return Object.entries(UIComponentRegistry)
    .filter(([, info]) => info.category === category)
    .map(([name]) => name);
}