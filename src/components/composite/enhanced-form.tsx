/**
 * Enhanced Form Components
 * 
 * AI-friendly composite form components with validation,
 * state management, and comprehensive documentation.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { 
  EnhancedInput, 
  EnhancedButton, 
  EnhancedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui';

/**
 * Form field wrapper with label and validation
 * 
 * @ai-component-description "Wrapper for form fields with consistent styling and validation"
 * @ai-usage-examples [
 *   "<FormField label='Email' error='Invalid email'>...</FormField>",
 *   "<FormField label='Password' required>...</FormField>"
 * ]
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Helper text */
  helperText?: string;
  /** Whether field is required */
  required?: boolean;
  /** Field ID for accessibility */
  fieldId?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ 
    className, 
    label, 
    error, 
    success, 
    helperText, 
    required, 
    fieldId,
    children,
    ...props 
  }, ref) => {
    const id = fieldId || React.useId();
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label 
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              id,
              'aria-describedby': error ? errorId : helperText || success ? helperId : undefined,
              'aria-invalid': error ? 'true' : undefined,
              'aria-required': required,
              ...child.props
            });
          }
          return child;
        })}
        
        {(helperText || error || success) && (
          <div
            id={error ? errorId : helperId}
            className={cn(
              'text-sm',
              error && 'text-destructive',
              success && 'text-green-600',
              !error && !success && 'text-muted-foreground'
            )}
          >
            {error || success || helperText}
          </div>
        )}
      </div>
    );
  }
);
FormField.displayName = 'FormField';

/**
 * Form container with validation and submission handling
 * 
 * @ai-component-description "Complete form container with validation and submission"
 * @ai-usage-examples [
 *   "<Form onSubmit={handleSubmit} title='Contact Form'>...</Form>",
 *   "<Form variant='card' isLoading={loading}>...</Form>"
 * ]
 */
const formVariants = cva(
  'space-y-6',
  {
    variants: {
      variant: {
        default: '',
        card: 'p-0',
        inline: 'space-y-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface FormProps 
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Show cancel button */
  showCancel?: boolean;
  /** Cancel handler */
  onCancel?: () => void;
  /** Form validation errors */
  errors?: Record<string, string>;
  /** Success message */
  successMessage?: string;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ 
    className,
    variant,
    title,
    description,
    isLoading = false,
    submitText = 'Submit',
    cancelText = 'Cancel',
    showCancel = false,
    onCancel,
    errors = {},
    successMessage,
    children,
    ...props 
  }, ref) => {
    const formContent = (
      <>
        {(title || description) && (
          <div className="space-y-2">
            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800">
            {successMessage}
          </div>
        )}
        
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <form
          ref={ref}
          className={cn(formVariants({ variant }), className)}
          {...props}
        >
          <div className="space-y-4">
            {children}
          </div>
          
          <div className="flex gap-2 pt-4">
            <EnhancedButton 
              type="submit" 
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              {isLoading ? 'Submitting...' : submitText}
            </EnhancedButton>
            
            {showCancel && (
              <EnhancedButton 
                type="button" 
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelText}
              </EnhancedButton>
            )}
          </div>
        </form>
      </>
    );

    if (variant === 'card') {
      return (
        <EnhancedCard>
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            {formContent}
          </CardContent>
        </EnhancedCard>
      );
    }

    return <div className="space-y-6">{formContent}</div>;
  }
);
Form.displayName = 'Form';

/**
 * Contact Form Component
 * 
 * @ai-component-description "Pre-built contact form with validation"
 * @ai-usage "Ready-to-use contact form component"
 */
export interface ContactFormProps {
  /** Form submission handler */
  onSubmit: (data: ContactFormData) => void | Promise<void>;
  /** Loading state */
  isLoading?: boolean;
  /** Success message */
  successMessage?: string;
  /** Form variant */
  variant?: 'default' | 'card';
  /** Additional CSS classes */
  className?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isLoading = false,
  successMessage,
  variant = 'card',
  className
}) => {
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: keyof ContactFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  return (
    <div className={className}>
      <Form
        variant={variant}
        title="Contact Us"
        description="Send us a message and we'll get back to you as soon as possible."
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText="Send Message"
        errors={errors}
        successMessage={successMessage}
      >
        <FormField 
          label="Full Name" 
          required 
          error={errors.name}
        >
          <EnhancedInput
            placeholder="John Doe"
            value={formData.name}
            onChange={handleInputChange('name')}
          />
        </FormField>
        
        <FormField 
          label="Email Address" 
          required 
          error={errors.email}
        >
          <EnhancedInput
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleInputChange('email')}
          />
        </FormField>
        
        <FormField 
          label="Subject" 
          helperText="Optional - helps us categorize your message"
        >
          <EnhancedInput
            placeholder="What is this about?"
            value={formData.subject}
            onChange={handleInputChange('subject')}
          />
        </FormField>
        
        <FormField 
          label="Message" 
          required 
          error={errors.message}
        >
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Your message here..."
            value={formData.message}
            onChange={handleInputChange('message')}
            rows={4}
          />
        </FormField>
      </Form>
    </div>
  );
};

/**
 * AI Generation Metadata for Form Components
 */
export const FormAIMetadata = {
  FormField: {
    componentName: 'FormField',
    category: 'form',
    description: 'Wrapper for form fields with consistent styling and validation',
    useCases: [
      'Form input wrappers',
      'Validation message display',
      'Accessible form labels',
      'Consistent form styling'
    ],
    patterns: {
      basic: '<FormField label="Name"><Input /></FormField>',
      withValidation: '<FormField label="Email" error="Invalid email" required><Input type="email" /></FormField>',
      withHelper: '<FormField label="Password" helperText="Must be at least 8 characters"><Input type="password" /></FormField>'
    }
  },
  
  Form: {
    componentName: 'Form',
    category: 'form',
    description: 'Complete form container with validation and submission handling',
    useCases: [
      'Contact forms',
      'Registration forms',
      'Settings forms',
      'Data entry forms'
    ],
    patterns: {
      basic: '<Form onSubmit={handleSubmit} title="My Form">...</Form>',
      card: '<Form variant="card" title="Settings">...</Form>',
      withValidation: '<Form errors={errors} successMessage="Saved!">...</Form>'
    }
  },
  
  ContactForm: {
    componentName: 'ContactForm',
    category: 'form',
    description: 'Pre-built contact form with validation',
    useCases: [
      'Website contact pages',
      'Customer support forms',
      'Feedback collection',
      'Lead generation'
    ],
    patterns: {
      basic: '<ContactForm onSubmit={handleSubmit} />',
      withLoading: '<ContactForm onSubmit={handleSubmit} isLoading={loading} />',
      withSuccess: '<ContactForm onSubmit={handleSubmit} successMessage="Message sent!" />'
    }
  }
};

export { FormField, Form, formVariants };