/**
 * Enhanced Layout Components
 * 
 * AI-friendly layout components for consistent page structure,
 * responsive design, and comprehensive layout patterns.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { 
  EnhancedButton, 
  EnhancedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui';

/**
 * Page Container Component
 * 
 * @ai-component-description "Main page container with consistent spacing and responsive design"
 * @ai-usage-examples [
 *   "<PageContainer>...</PageContainer>",
 *   "<PageContainer maxWidth='lg' padding='lg'>...</PageContainer>"
 * ]
 */
const pageContainerVariants = cva(
  'mx-auto w-full',
  {
    variants: {
      maxWidth: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        '2xl': 'max-w-7xl',
        full: 'max-w-full',
      },
      padding: {
        none: '',
        sm: 'px-4 py-2',
        md: 'px-6 py-4',
        lg: 'px-8 py-6',
        xl: 'px-12 py-8',
      },
    },
    defaultVariants: {
      maxWidth: 'xl',
      padding: 'lg',
    },
  }
);

export interface PageContainerProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageContainerVariants> {}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, maxWidth, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(pageContainerVariants({ maxWidth, padding }), className)}
        {...props}
      />
    );
  }
);
PageContainer.displayName = 'PageContainer';

/**
 * Page Header Component
 * 
 * @ai-component-description "Consistent page header with title, description, and actions"
 * @ai-usage-examples [
 *   "<PageHeader title='Dashboard' description='Overview of your account' />",
 *   "<PageHeader title='Users' actions={<Button>Add User</Button>} />"
 * ]
 */
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Header actions (buttons, etc.) */
  actions?: React.ReactNode;
  /** Breadcrumb navigation */
  breadcrumb?: React.ReactNode;
  /** Show divider below header */
  showDivider?: boolean;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ 
    className, 
    title, 
    description, 
    actions, 
    breadcrumb, 
    showDivider = true,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'space-y-4',
          showDivider && 'border-b pb-6 mb-6',
          className
        )}
        {...props}
      >
        {breadcrumb && (
          <div className="text-sm text-muted-foreground">
            {breadcrumb}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);
PageHeader.displayName = 'PageHeader';

/**
 * Grid Layout Component
 * 
 * @ai-component-description "Responsive grid layout with customizable columns and gaps"
 * @ai-usage-examples [
 *   "<GridLayout cols={3}>...</GridLayout>",
 *   "<GridLayout cols={{ sm: 1, md: 2, lg: 3 }} gap='lg'>...</GridLayout>"
 * ]
 */
const gridLayoutVariants = cva(
  'grid w-full',
  {
    variants: {
      gap: {
        none: 'gap-0',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
    },
    defaultVariants: {
      gap: 'md',
    },
  }
);

export interface GridLayoutProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridLayoutVariants> {
  /** Number of columns (responsive object or number) */
  cols?: number | {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const GridLayout = React.forwardRef<HTMLDivElement, GridLayoutProps>(
  ({ className, gap, cols = 1, ...props }, ref) => {
    // Generate responsive grid classes
    const getGridCols = () => {
      if (typeof cols === 'number') {
        return `grid-cols-${cols}`;
      }
      
      const classes = [];
      if (cols.sm) classes.push(`grid-cols-${cols.sm}`);
      if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
      if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
      if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
      
      return classes.join(' ');
    };

    return (
      <div
        ref={ref}
        className={cn(
          gridLayoutVariants({ gap }),
          getGridCols(),
          className
        )}
        {...props}
      />
    );
  }
);
GridLayout.displayName = 'GridLayout';

/**
 * Sidebar Layout Component
 * 
 * @ai-component-description "Two-column layout with sidebar and main content area"
 * @ai-usage-examples [
 *   "<SidebarLayout sidebar={<Nav />}>...</SidebarLayout>",
 *   "<SidebarLayout sidebar={<Menu />} sidebarWidth='sm'>...</SidebarLayout>"
 * ]
 */
const sidebarLayoutVariants = cva(
  'flex min-h-screen',
  {
    variants: {
      sidebarPosition: {
        left: 'flex-row',
        right: 'flex-row-reverse',
      },
    },
    defaultVariants: {
      sidebarPosition: 'left',
    },
  }
);

export interface SidebarLayoutProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarLayoutVariants> {
  /** Sidebar content */
  sidebar: React.ReactNode;
  /** Sidebar width */
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether sidebar is collapsible */
  collapsible?: boolean;
  /** Whether sidebar is initially collapsed */
  defaultCollapsed?: boolean;
}

const SidebarLayout = React.forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ 
    className, 
    sidebarPosition,
    sidebar, 
    sidebarWidth = 'md',
    collapsible = false,
    defaultCollapsed = false,
    children,
    ...props 
  }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const sidebarWidthClasses = {
      sm: isCollapsed ? 'w-16' : 'w-48',
      md: isCollapsed ? 'w-16' : 'w-64',
      lg: isCollapsed ? 'w-16' : 'w-80',
      xl: isCollapsed ? 'w-16' : 'w-96',
    };

    return (
      <div
        ref={ref}
        className={cn(sidebarLayoutVariants({ sidebarPosition }), className)}
        {...props}
      >
        {/* Sidebar */}
        <aside className={cn(
          'border-r bg-card transition-all duration-300',
          sidebarWidthClasses[sidebarWidth]
        )}>
          <div className="flex h-full flex-col">
            {collapsible && (
              <div className="border-b p-4">
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? '→' : '←'}
                </EnhancedButton>
              </div>
            )}
            <div className="flex-1 overflow-auto">
              {sidebar}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    );
  }
);
SidebarLayout.displayName = 'SidebarLayout';

/**
 * Dashboard Layout Component
 * 
 * @ai-component-description "Complete dashboard layout with header, sidebar, and content areas"
 * @ai-usage-examples [
 *   "<DashboardLayout header={<Header />} sidebar={<Nav />}>...</DashboardLayout>"
 * ]
 */
export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header content */
  header?: React.ReactNode;
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Whether to show sidebar */
  showSidebar?: boolean;
  /** Sidebar width */
  sidebarWidth?: 'sm' | 'md' | 'lg';
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ 
    className,
    header,
    sidebar,
    footer,
    showSidebar = true,
    sidebarWidth = 'md',
    children,
    ...props 
  }, ref) => {
    return (
      <div ref={ref} className={cn('min-h-screen bg-background', className)} {...props}>
        {/* Header */}
        {header && (
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {header}
          </header>
        )}

        {/* Main layout */}
        <div className="flex flex-1">
          {/* Sidebar */}
          {showSidebar && sidebar && (
            <aside className={cn(
              'border-r bg-card',
              sidebarWidth === 'sm' && 'w-48',
              sidebarWidth === 'md' && 'w-64',
              sidebarWidth === 'lg' && 'w-80'
            )}>
              <div className="h-full overflow-auto">
                {sidebar}
              </div>
            </aside>
          )}

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>

        {/* Footer */}
        {footer && (
          <footer className="border-t bg-card">
            {footer}
          </footer>
        )}
      </div>
    );
  }
);
DashboardLayout.displayName = 'DashboardLayout';

/**
 * Content Section Component
 * 
 * @ai-component-description "Structured content section with optional card wrapper"
 * @ai-usage-examples [
 *   "<ContentSection title='Settings'>...</ContentSection>",
 *   "<ContentSection title='Profile' description='Manage your profile' showCard>...</ContentSection>"
 * ]
 */
export interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Section actions */
  actions?: React.ReactNode;
  /** Wrap content in card */
  showCard?: boolean;
  /** Section spacing */
  spacing?: 'sm' | 'md' | 'lg';
}

const ContentSection = React.forwardRef<HTMLDivElement, ContentSectionProps>(
  ({ 
    className,
    title,
    description,
    actions,
    showCard = false,
    spacing = 'md',
    children,
    ...props 
  }, ref) => {
    const spacingClasses = {
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
    };

    const content = (
      <div className={cn(spacingClasses[spacing])}>
        {(title || description || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              {title && <h2 className="text-xl font-semibold">{title}</h2>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    );

    if (showCard) {
      return (
        <EnhancedCard ref={ref} className={className} {...props}>
          <CardContent className="p-6">
            {content}
          </CardContent>
        </EnhancedCard>
      );
    }

    return (
      <div ref={ref} className={cn(spacingClasses[spacing], className)} {...props}>
        {content}
      </div>
    );
  }
);
ContentSection.displayName = 'ContentSection';

/**
 * AI Generation Metadata for Layout Components
 */
export const LayoutAIMetadata = {
  PageContainer: {
    componentName: 'PageContainer',
    category: 'layout',
    description: 'Main page container with consistent spacing and responsive design',
    useCases: [
      'Page wrappers',
      'Content containers',
      'Responsive layouts',
      'Consistent spacing'
    ],
    patterns: {
      basic: '<PageContainer>...</PageContainer>',
      customWidth: '<PageContainer maxWidth="lg" padding="xl">...</PageContainer>',
      fullWidth: '<PageContainer maxWidth="full" padding="none">...</PageContainer>'
    }
  },

  PageHeader: {
    componentName: 'PageHeader',
    category: 'layout',
    description: 'Consistent page header with title, description, and actions',
    useCases: [
      'Page titles',
      'Section headers',
      'Action bars',
      'Breadcrumb navigation'
    ],
    patterns: {
      basic: '<PageHeader title="Dashboard" description="Overview of your account" />',
      withActions: '<PageHeader title="Users" actions={<Button>Add User</Button>} />',
      withBreadcrumb: '<PageHeader title="Profile" breadcrumb={<Breadcrumb />} />'
    }
  },

  GridLayout: {
    componentName: 'GridLayout',
    category: 'layout',
    description: 'Responsive grid layout with customizable columns and gaps',
    useCases: [
      'Card grids',
      'Product listings',
      'Dashboard widgets',
      'Gallery layouts'
    ],
    patterns: {
      basic: '<GridLayout cols={3}>...</GridLayout>',
      responsive: '<GridLayout cols={{ sm: 1, md: 2, lg: 3 }}>...</GridLayout>',
      withGap: '<GridLayout cols={2} gap="lg">...</GridLayout>'
    }
  },

  SidebarLayout: {
    componentName: 'SidebarLayout',
    category: 'layout',
    description: 'Two-column layout with sidebar and main content area',
    useCases: [
      'Admin panels',
      'Documentation sites',
      'Application layouts',
      'Navigation layouts'
    ],
    patterns: {
      basic: '<SidebarLayout sidebar={<Nav />}>...</SidebarLayout>',
      collapsible: '<SidebarLayout sidebar={<Menu />} collapsible>...</SidebarLayout>',
      rightSidebar: '<SidebarLayout sidebar={<Aside />} sidebarPosition="right">...</SidebarLayout>'
    }
  },

  DashboardLayout: {
    componentName: 'DashboardLayout',
    category: 'layout',
    description: 'Complete dashboard layout with header, sidebar, and content areas',
    useCases: [
      'Admin dashboards',
      'Application shells',
      'Management interfaces',
      'Control panels'
    ],
    patterns: {
      full: '<DashboardLayout header={<Header />} sidebar={<Nav />} footer={<Footer />}>...</DashboardLayout>',
      minimal: '<DashboardLayout header={<Header />}>...</DashboardLayout>',
      noSidebar: '<DashboardLayout header={<Header />} showSidebar={false}>...</DashboardLayout>'
    }
  },

  ContentSection: {
    componentName: 'ContentSection',
    category: 'layout',
    description: 'Structured content section with optional card wrapper',
    useCases: [
      'Content sections',
      'Settings panels',
      'Form sections',
      'Information blocks'
    ],
    patterns: {
      basic: '<ContentSection title="Settings">...</ContentSection>',
      withCard: '<ContentSection title="Profile" showCard>...</ContentSection>',
      withActions: '<ContentSection title="Users" actions={<Button>Add</Button>}>...</ContentSection>'
    }
  }
};

export {
  PageContainer,
  PageHeader,
  GridLayout,
  SidebarLayout,
  DashboardLayout,
  ContentSection,
  pageContainerVariants,
  gridLayoutVariants,
  sidebarLayoutVariants
};