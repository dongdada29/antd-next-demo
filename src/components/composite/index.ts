/**
 * Composite Components Index
 * 
 * Exports all AI-friendly composite components including forms,
 * data tables, and complex UI patterns.
 */

// Form components
export {
  FormField,
  Form,
  ContactForm,
  formVariants,
  FormAIMetadata,
  type FormFieldProps,
  type FormProps,
  type ContactFormProps,
  type ContactFormData
} from './enhanced-form';

// Data table components
export {
  DataTable,
  SimpleDataTable,
  dataTableVariants,
  DataTableAIMetadata,
  type DataTableProps,
  type SimpleDataTableProps,
  type DataTableColumn,
  type SortConfig,
  type PaginationConfig
} from './enhanced-data-table';

// Composite component registry for AI agents
export const CompositeComponentRegistry = {
  FormField: {
    component: 'FormField',
    category: 'form',
    description: 'Wrapper for form fields with consistent styling and validation',
    complexity: 'basic'
  },
  Form: {
    component: 'Form',
    category: 'form',
    description: 'Complete form container with validation and submission handling',
    complexity: 'intermediate'
  },
  ContactForm: {
    component: 'ContactForm',
    category: 'form',
    description: 'Pre-built contact form with validation',
    complexity: 'advanced'
  },
  DataTable: {
    component: 'DataTable',
    category: 'data',
    description: 'Comprehensive data table with search, sort, and pagination',
    complexity: 'advanced'
  },
  SimpleDataTable: {
    component: 'SimpleDataTable',
    category: 'data',
    description: 'Basic data table for simple display needs',
    complexity: 'basic'
  }
};

// Helper functions for AI agents
export const CompositeComponentHelpers = {
  /**
   * Get all form components
   */
  getFormComponents: () => {
    return Object.entries(CompositeComponentRegistry)
      .filter(([, info]) => info.category === 'form')
      .map(([name]) => name);
  },

  /**
   * Get all data components
   */
  getDataComponents: () => {
    return Object.entries(CompositeComponentRegistry)
      .filter(([, info]) => info.category === 'data')
      .map(([name]) => name);
  },

  /**
   * Get components by complexity
   */
  getComponentsByComplexity: (complexity: 'basic' | 'intermediate' | 'advanced') => {
    return Object.entries(CompositeComponentRegistry)
      .filter(([, info]) => info.complexity === complexity)
      .map(([name]) => name);
  },

  /**
   * Get component info
   */
  getComponentInfo: (componentName: string) => {
    return CompositeComponentRegistry[componentName as keyof typeof CompositeComponentRegistry];
  }
};