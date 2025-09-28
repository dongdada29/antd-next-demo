/**
 * Component Registry Initialization
 * 
 * Initializes the AI component registry with all available components,
 * templates, and configurations for AI agent use.
 */

import { aiComponentRegistry } from './ai-component-registry';
import { 
  defaultComponentConfigs, 
  componentTemplates 
} from './component-templates';
import { ComponentTemplate } from '@/types/ai-component';

/**
 * Initialize the component registry with default components and templates
 */
export function initializeComponentRegistry(): void {
  // Register default component configurations
  defaultComponentConfigs.forEach(config => {
    aiComponentRegistry.registerComponent(config);
  });

  // Register component templates
  componentTemplates.forEach(template => {
    aiComponentRegistry.registerTemplate(template);
  });

  // Register additional specialized templates
  registerSpecializedTemplates();
  
  console.log('AI Component Registry initialized with', 
    aiComponentRegistry.components.size, 'components and',
    aiComponentRegistry.templates.size, 'templates'
  );
}

/**
 * Register specialized component templates for different use cases
 */
function registerSpecializedTemplates(): void {
  // Form component template
  const formComponentTemplate: ComponentTemplate = {
    id: 'form-component',
    name: 'Form Component Template',
    category: 'component',
    template: `import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const {{componentName}}Schema = z.object({
  {{schemaFields}}
});

type {{componentName}}Data = z.infer<typeof {{componentName}}Schema>;

export interface {{componentName}}Props {
  onSubmit: (data: {{componentName}}Data) => void;
  defaultValues?: Partial<{{componentName}}Data>;
  isLoading?: boolean;
}

export const {{componentName}}: React.FC<{{componentName}}Props> = ({
  onSubmit,
  defaultValues,
  isLoading = false
}) => {
  const form = useForm<{{componentName}}Data>({
    resolver: zodResolver({{componentName}}Schema),
    defaultValues
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{{title}}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {{formFields}}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "{{loadingText}}" : "{{submitText}}"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};`,
    variables: [
      {
        name: 'componentName',
        type: 'string',
        description: 'Name of the form component',
        required: true
      },
      {
        name: 'title',
        type: 'string',
        description: 'Form title',
        defaultValue: 'Form'
      },
      {
        name: 'schemaFields',
        type: 'string',
        description: 'Zod schema field definitions',
        defaultValue: 'name: z.string().min(1, "Name is required")'
      },
      {
        name: 'formFields',
        type: 'string',
        description: 'Form field JSX',
        defaultValue: '<Input {...form.register("name")} label="Name" />'
      },
      {
        name: 'submitText',
        type: 'string',
        description: 'Submit button text',
        defaultValue: 'Submit'
      },
      {
        name: 'loadingText',
        type: 'string',
        description: 'Loading button text',
        defaultValue: 'Submitting...'
      }
    ],
    prompts: {
      generation: 'Generate a form component with validation using React Hook Form and Zod',
      customization: 'Customize form fields and validation rules',
      integration: 'Integrate with API endpoints and state management'
    },
    metadata: {
      version: '1.0.0',
      author: 'AI Component Generator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['form', 'validation', 'react-hook-form'],
      complexity: 'advanced'
    }
  };

  // Data table component template
  const dataTableTemplate: ComponentTemplate = {
    id: 'data-table-component',
    name: 'Data Table Component Template',
    category: 'component',
    template: `import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface {{componentName}}Props<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  sortable?: boolean;
  onRowClick?: (item: T) => void;
}

export interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

export function {{componentName}}<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  sortable = false,
  onRowClick
}: {{componentName}}Props<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const filteredData = React.useMemo(() => {
    if (!searchable || !searchTerm) return data;
    
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchable]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof T) => {
    if (!sortable) return;
    
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={sortable && column.sortable !== false ? "cursor-pointer" : ""}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                {column.title}
                {sortConfig?.key === column.key && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow
              key={index}
              className={onRowClick ? "cursor-pointer" : ""}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}`,
    variables: [
      {
        name: 'componentName',
        type: 'string',
        description: 'Name of the data table component',
        required: true
      }
    ],
    prompts: {
      generation: 'Generate a data table component with search and sort functionality',
      customization: 'Customize table columns and data rendering',
      integration: 'Integrate with data fetching and pagination'
    },
    metadata: {
      version: '1.0.0',
      author: 'AI Component Generator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['table', 'data', 'search', 'sort'],
      complexity: 'advanced'
    }
  };

  // Dashboard widget template
  const dashboardWidgetTemplate: ComponentTemplate = {
    id: 'dashboard-widget',
    name: 'Dashboard Widget Template',
    category: 'component',
    template: `import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface {{componentName}}Props {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const {{componentName}}: React.FC<{{componentName}}Props> = ({
  title,
  value,
  description,
  trend,
  icon,
  className
}) => {
  return (
    <Card className={cn("{{cardClasses}}", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {trend && (
              <span className={cn(
                "flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};`,
    variables: [
      {
        name: 'componentName',
        type: 'string',
        description: 'Name of the dashboard widget component',
        required: true
      },
      {
        name: 'cardClasses',
        type: 'string',
        description: 'Additional CSS classes for the card',
        defaultValue: ''
      }
    ],
    prompts: {
      generation: 'Generate a dashboard widget component for displaying metrics',
      customization: 'Customize widget appearance and data display',
      integration: 'Integrate with analytics and data sources'
    },
    metadata: {
      version: '1.0.0',
      author: 'AI Component Generator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['dashboard', 'widget', 'metrics'],
      complexity: 'basic'
    }
  };

  // Register all specialized templates
  aiComponentRegistry.registerTemplate(formComponentTemplate);
  aiComponentRegistry.registerTemplate(dataTableTemplate);
  aiComponentRegistry.registerTemplate(dashboardWidgetTemplate);
}

/**
 * Get registry statistics for debugging
 */
export function getRegistryStats() {
  return {
    components: aiComponentRegistry.components.size,
    templates: aiComponentRegistry.templates.size,
    categories: aiComponentRegistry.categories.length,
    componentsByCategory: aiComponentRegistry.categories.map(cat => ({
      category: cat.name,
      count: cat.components.length
    }))
  };
}

/**
 * Export registry data for backup/restore
 */
export function exportRegistryData() {
  return aiComponentRegistry.export();
}

/**
 * Import registry data from backup
 */
export function importRegistryData(data: ReturnType<typeof exportRegistryData>) {
  aiComponentRegistry.import(data);
}