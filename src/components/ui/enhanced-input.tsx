/**
 * Enhanced Input Component
 * 
 * AI-friendly input component with comprehensive documentation,
 * validation support, and generation guidance for AI agents.
 * 
 * @ai-component-config inputComponentConfig
 * @ai-generation-prompt "Create a styled input field with proper states and validation"
 * @ai-styling-guide "Use consistent focus states and accessibility features"
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Input variant styles
 * 
 * @ai-variants {
 *   "default": "Standard input styling",
 *   "error": "Error state with red border",
 *   "success": "Success state with green border"
 * }
 */
const inputVariants = cva(
  "flex w-full rounded-md border bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
      },
      size: {
        sm: "h-8 px-2 text-sm",
        default: "h-10 px-3 py-2",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Input component props interface
 * 
 * @ai-props-guide "Extend HTML input attributes with variant and validation props"
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  /**
   * Error message to display
   * @ai-usage "Show validation errors below input"
   */
  error?: string;
  
  /**
   * Success message to display
   * @ai-usage "Show success feedback below input"
   */
  success?: string;
  
  /**
   * Helper text to display
   * @ai-usage "Provide additional context or instructions"
   */
  helperText?: string;
  
  /**
   * Label for the input
   * @ai-usage "Accessible label text"
   */
  label?: string;
  
  /**
   * Whether the input is required
   * @ai-usage "Add visual indicator for required fields"
   */
  required?: boolean;
}

/**
 * Enhanced Input Component
 * 
 * @ai-component-description "Styled input field with validation states and helper text"
 * @ai-usage-examples [
 *   "<Input placeholder='Enter text' />",
 *   "<Input type='email' label='Email' required />",
 *   "<Input error='This field is required' />",
 *   "<Input success='Email is valid' />"
 * ]
 * 
 * @ai-accessibility-features [
 *   "Proper label association",
 *   "ARIA attributes for validation",
 *   "Keyboard navigation support",
 *   "Screen reader compatible"
 * ]
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    type = "text", 
    error, 
    success, 
    helperText, 
    label, 
    required,
    id,
    ...props 
  }, ref) => {
    // Generate unique ID if not provided
    const inputId = id || React.useId();
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    
    // Determine variant based on validation state
    const effectiveVariant = error ? "error" : success ? "success" : variant;
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <input
          type={type}
          className={cn(inputVariants({ variant: effectiveVariant, size }), className)}
          ref={ref}
          id={inputId}
          aria-describedby={
            error ? errorId : 
            success ? helperId : 
            helperText ? helperId : 
            undefined
          }
          aria-invalid={error ? "true" : undefined}
          aria-required={required}
          {...props}
        />
        
        {/* Helper text, error, or success message */}
        {(helperText || error || success) && (
          <div
            id={error ? errorId : helperId}
            className={cn(
              "text-sm",
              error && "text-destructive",
              success && "text-green-600",
              !error && !success && "text-muted-foreground"
            )}
          >
            {error || success || helperText}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/**
 * Simple Input without wrapper (for compatibility)
 */
const SimpleInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'label' | 'error' | 'success' | 'helperText'>>(
  ({ className, variant, size, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
SimpleInput.displayName = "SimpleInput";

/**
 * AI Generation Metadata for Input Component
 */
export const InputAIMetadata = {
  componentName: "Input",
  category: "form",
  description: "Styled input field with validation states and accessibility features",
  
  // Input types for AI understanding
  inputTypes: {
    text: "General text input",
    email: "Email address input with validation",
    password: "Password input with hidden text",
    number: "Numeric input with step controls",
    tel: "Telephone number input",
    url: "URL input with validation",
    search: "Search input with clear functionality",
    date: "Date picker input",
    time: "Time picker input",
    file: "File upload input"
  },
  
  // Common use cases
  useCases: [
    "Form fields (name, email, phone)",
    "Search inputs (site search, filters)",
    "Authentication (username, password)",
    "Data entry (numbers, dates, text)",
    "File uploads (documents, images)"
  ],
  
  // AI generation patterns
  patterns: {
    basic: '<Input placeholder="Enter text" />',
    
    withLabel: `<Input 
  label="Email Address" 
  type="email" 
  placeholder="john@example.com"
  required 
/>`,
    
    withValidation: `<Input 
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>`,
    
    withHelper: `<Input 
  label="Username"
  helperText="Must be 3-20 characters, letters and numbers only"
  placeholder="johndoe123"
/>`,
    
    search: `<Input 
  type="search"
  placeholder="Search products..."
  className="pl-10"
/>`,
    
    controlled: `const [value, setValue] = useState("");

<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>`
  },
  
  // Validation patterns
  validationPatterns: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    },
    phone: {
      pattern: /^\+?[\d\s\-\(\)]+$/,
      message: "Please enter a valid phone number"
    },
    url: {
      pattern: /^https?:\/\/.+/,
      message: "Please enter a valid URL starting with http:// or https://"
    },
    required: {
      pattern: /.+/,
      message: "This field is required"
    }
  },
  
  // Styling guidelines
  stylingGuidelines: {
    states: "Use variant prop for error/success states",
    sizing: "Use size prop (sm, default, lg) for consistent dimensions",
    focus: "Focus ring automatically applied with proper colors",
    disabled: "Disabled state reduces opacity and prevents interaction",
    placeholder: "Use muted foreground color for placeholder text"
  },
  
  // Accessibility guidelines
  accessibility: {
    labels: "Always provide labels for form inputs",
    validation: "Use aria-invalid and aria-describedby for errors",
    required: "Mark required fields with aria-required",
    autocomplete: "Use autocomplete attributes for better UX",
    keyboard: "Support Tab navigation and Enter submission"
  },
  
  // AI prompts for different scenarios
  prompts: {
    basic: "Create a simple input field for text entry",
    form: "Create a labeled input with validation for forms",
    search: "Create a search input with appropriate styling",
    validation: "Create an input with error handling and validation",
    controlled: "Create a controlled input with state management"
  },
  
  // Integration with form libraries
  formLibraries: {
    reactHookForm: "Use register() and error handling",
    formik: "Use field props and error/touched state",
    native: "Use controlled components with useState"
  }
};

export { 
  Input, 
  SimpleInput, 
  InputAIMetadata, 
  inputVariants 
};