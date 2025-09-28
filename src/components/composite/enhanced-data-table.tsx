/**
 * Enhanced Data Table Components
 * 
 * AI-friendly data table components with sorting, filtering,
 * pagination, and comprehensive functionality.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  EnhancedInput, 
  EnhancedButton, 
  EnhancedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui';

/**
 * Column definition for data tables
 */
export interface DataTableColumn<T = any> {
  /** Unique column key */
  key: keyof T | string;
  /** Column header title */
  title: string;
  /** Custom render function */
  render?: (value: any, item: T, index: number) => React.ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: string | number;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether column is searchable */
  searchable?: boolean;
}

/**
 * Sort configuration
 */
export interface SortConfig<T = any> {
  key: keyof T | string;
  direction: 'asc' | 'desc';
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Data table variants
 */
const dataTableVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border',
        striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
        compact: '[&_td]:py-2 [&_th]:py-2',
      },
      size: {
        sm: 'text-sm',
        default: '',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Enhanced Data Table Props
 */
export interface DataTableProps<T = any> 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataTableVariants> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Enable search functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Enable sorting */
  sortable?: boolean;
  /** Initial sort configuration */
  defaultSort?: SortConfig<T>;
  /** Enable pagination */
  paginated?: boolean;
  /** Pagination configuration */
  pagination?: PaginationConfig;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Row click handler */
  onRowClick?: (item: T, index: number) => void;
  /** Sort change handler */
  onSortChange?: (sort: SortConfig<T> | null) => void;
  /** Search change handler */
  onSearchChange?: (search: string) => void;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Page size change handler */
  onPageSizeChange?: (pageSize: number) => void;
  /** Table title */
  title?: string;
  /** Table description */
  description?: string;
  /** Show table in card */
  showCard?: boolean;
}

/**
 * Enhanced Data Table Component
 * 
 * @ai-component-description "Comprehensive data table with search, sort, and pagination"
 * @ai-usage-examples [
 *   "<DataTable data={users} columns={userColumns} />",
 *   "<DataTable data={products} columns={productColumns} searchable paginated />",
 *   "<DataTable data={orders} columns={orderColumns} sortable onRowClick={handleRowClick} />"
 * ]
 */
export const DataTable = <T extends Record<string, any>>({
  className,
  variant,
  size,
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  searchable = false,
  searchPlaceholder = 'Search...',
  sortable = false,
  defaultSort,
  paginated = false,
  pagination,
  pageSizeOptions = [10, 25, 50, 100],
  onRowClick,
  onSortChange,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  title,
  description,
  showCard = false,
  ...props
}: DataTableProps<T>) => {
  // Local state for search, sort, and pagination
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<SortConfig<T> | null>(defaultSort || null);
  const [currentPage, setCurrentPage] = React.useState(pagination?.page || 1);
  const [pageSize, setPageSize] = React.useState(pagination?.pageSize || pageSizeOptions[0]);

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data;

    return data.filter(item => {
      return columns.some(column => {
        if (column.searchable === false) return false;
        
        const value = item[column.key as keyof T];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns, searchable]);

  // Sort filtered data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare values
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate sorted data
  const paginatedData = React.useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, paginated, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    onSearchChange?.(value);
  };

  // Handle sort
  const handleSort = (columnKey: keyof T | string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!sortable || column?.sortable === false) return;

    const newSortConfig: SortConfig<T> = {
      key: columnKey,
      direction: 
        sortConfig?.key === columnKey && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    };

    setSortConfig(newSortConfig);
    onSortChange?.(newSortConfig);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
    onPageSizeChange?.(newPageSize);
  };

  // Render table content
  const tableContent = (
    <div className="space-y-4">
      {/* Search and controls */}
      {(searchable || paginated) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {searchable && (
            <div className="flex-1 max-w-sm">
              <EnhancedInput
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
          
          {paginated && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="h-8 rounded border border-input bg-background px-2 text-sm"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table className={cn(dataTableVariants({ variant, size }))}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    sortable && column.sortable !== false && 'cursor-pointer select-none',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {sortable && column.sortable !== false && sortConfig?.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onRowClick?.(item, index)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={cn(
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {column.render
                        ? column.render(item[column.key as keyof T], item, index)
                        : String(item[column.key as keyof T] || '')
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginated && !loading && paginatedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </EnhancedButton>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <EnhancedButton
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </EnhancedButton>
                );
              })}
            </div>
            
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </EnhancedButton>
          </div>
        </div>
      )}
    </div>
  );

  if (showCard) {
    return (
      <EnhancedCard className={className} {...props}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          {tableContent}
        </CardContent>
      </EnhancedCard>
    );
  }

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {(title || description) && (
        <div className="space-y-2">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      {tableContent}
    </div>
  );
};

/**
 * Simple Data Table for basic use cases
 */
export interface SimpleDataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
}

export const SimpleDataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className
}: SimpleDataTableProps<T>) => {
  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage={emptyMessage}
      onRowClick={onRowClick}
      className={className}
    />
  );
};

/**
 * AI Generation Metadata for Data Table Components
 */
export const DataTableAIMetadata = {
  DataTable: {
    componentName: 'DataTable',
    category: 'data',
    description: 'Comprehensive data table with search, sort, and pagination functionality',
    useCases: [
      'User management tables',
      'Product listings',
      'Order history',
      'Analytics dashboards',
      'Content management'
    ],
    patterns: {
      basic: `<DataTable 
  data={users} 
  columns={[
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' }
  ]} 
/>`,
      
      withFeatures: `<DataTable 
  data={products} 
  columns={productColumns}
  searchable
  sortable
  paginated
  onRowClick={handleProductClick}
/>`,
      
      customRender: `<DataTable 
  data={orders} 
  columns={[
    { key: 'id', title: 'Order ID' },
    { 
      key: 'status', 
      title: 'Status',
      render: (status) => <Badge variant={status}>{status}</Badge>
    },
    { key: 'total', title: 'Total', align: 'right' }
  ]}
/>`
    }
  },
  
  SimpleDataTable: {
    componentName: 'SimpleDataTable',
    category: 'data',
    description: 'Basic data table for simple display needs',
    useCases: [
      'Simple data display',
      'Read-only tables',
      'Quick prototyping',
      'Embedded tables'
    ]
  }
};

export { dataTableVariants };