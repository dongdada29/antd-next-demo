/**
 * Comprehensive Style Guide
 * AI-friendly styling patterns and best practices
 */

export const styleGuide = {
  // Color system documentation
  colors: {
    semantic: {
      primary: {
        description: 'Main brand color for primary actions and emphasis',
        usage: 'bg-primary text-primary-foreground',
        examples: ['Primary buttons', 'Active navigation items', 'Key CTAs'],
      },
      secondary: {
        description: 'Secondary brand color for supporting elements',
        usage: 'bg-secondary text-secondary-foreground',
        examples: ['Secondary buttons', 'Supporting content', 'Subtle highlights'],
      },
      success: {
        description: 'Positive feedback and successful states',
        usage: 'bg-success text-success-foreground',
        examples: ['Success messages', 'Completed states', 'Positive indicators'],
      },
      warning: {
        description: 'Caution and warning states',
        usage: 'bg-warning text-warning-foreground',
        examples: ['Warning messages', 'Pending states', 'Attention indicators'],
      },
      error: {
        description: 'Error states and destructive actions',
        usage: 'bg-error text-error-foreground',
        examples: ['Error messages', 'Delete buttons', 'Failed states'],
      },
      info: {
        description: 'Informational content and neutral states',
        usage: 'bg-info text-info-foreground',
        examples: ['Info messages', 'Help text', 'Neutral indicators'],
      },
    },
    neutral: {
      background: {
        description: 'Main background color',
        usage: 'bg-background text-foreground',
        examples: ['Page backgrounds', 'Main content areas'],
      },
      card: {
        description: 'Card and elevated surface color',
        usage: 'bg-card text-card-foreground',
        examples: ['Cards', 'Modals', 'Elevated surfaces'],
      },
      muted: {
        description: 'Subtle background and muted content',
        usage: 'bg-muted text-muted-foreground',
        examples: ['Secondary content', 'Disabled states', 'Subtle backgrounds'],
      },
      accent: {
        description: 'Accent color for highlights and hover states',
        usage: 'bg-accent text-accent-foreground',
        examples: ['Hover states', 'Selected items', 'Highlighted content'],
      },
    },
    ui: {
      border: {
        description: 'Standard border color',
        usage: 'border-border',
        examples: ['Card borders', 'Input borders', 'Dividers'],
      },
      input: {
        description: 'Input field background and border',
        usage: 'bg-input border-input',
        examples: ['Form inputs', 'Search fields', 'Text areas'],
      },
      ring: {
        description: 'Focus ring color',
        usage: 'focus-visible:ring-ring',
        examples: ['Focus indicators', 'Active states', 'Keyboard navigation'],
      },
    },
  },

  // Typography system
  typography: {
    headings: {
      h1: {
        classes: 'text-4xl font-bold tracking-tight lg:text-5xl',
        usage: 'Page titles, hero headings',
        lineHeight: 'leading-tight',
      },
      h2: {
        classes: 'text-3xl font-semibold tracking-tight',
        usage: 'Section headings, major content divisions',
        lineHeight: 'leading-tight',
      },
      h3: {
        classes: 'text-2xl font-semibold tracking-tight',
        usage: 'Subsection headings, card titles',
        lineHeight: 'leading-tight',
      },
      h4: {
        classes: 'text-xl font-medium',
        usage: 'Minor headings, component titles',
        lineHeight: 'leading-normal',
      },
      h5: {
        classes: 'text-lg font-medium',
        usage: 'Small headings, list titles',
        lineHeight: 'leading-normal',
      },
      h6: {
        classes: 'text-base font-medium',
        usage: 'Smallest headings, labels',
        lineHeight: 'leading-normal',
      },
    },
    body: {
      large: {
        classes: 'text-lg leading-relaxed',
        usage: 'Important body text, introductions',
      },
      default: {
        classes: 'text-base leading-normal',
        usage: 'Standard body text, paragraphs',
      },
      small: {
        classes: 'text-sm leading-normal',
        usage: 'Secondary text, captions',
      },
      muted: {
        classes: 'text-sm text-muted-foreground',
        usage: 'Helper text, descriptions, metadata',
      },
    },
    display: {
      large: {
        classes: 'text-6xl font-bold tracking-tight lg:text-7xl',
        usage: 'Hero displays, landing page titles',
      },
      medium: {
        classes: 'text-5xl font-bold tracking-tight lg:text-6xl',
        usage: 'Feature displays, section heroes',
      },
      small: {
        classes: 'text-4xl font-bold tracking-tight lg:text-5xl',
        usage: 'Card displays, component heroes',
      },
    },
  },

  // Spacing system
  spacing: {
    scale: {
      xs: { value: '0.25rem', usage: 'Tight spacing, small gaps' },
      sm: { value: '0.5rem', usage: 'Small spacing, compact layouts' },
      md: { value: '1rem', usage: 'Standard spacing, default gaps' },
      lg: { value: '1.5rem', usage: 'Large spacing, section gaps' },
      xl: { value: '2rem', usage: 'Extra large spacing, major sections' },
      '2xl': { value: '3rem', usage: 'Section dividers, page spacing' },
      '3xl': { value: '4rem', usage: 'Major page sections, hero spacing' },
    },
    patterns: {
      compact: {
        classes: 'space-y-2',
        usage: 'Tight content, form fields, list items',
      },
      content: {
        classes: 'space-y-4',
        usage: 'Standard content spacing, paragraphs',
      },
      section: {
        classes: 'space-y-6',
        usage: 'Section content, major content blocks',
      },
      page: {
        classes: 'space-y-8',
        usage: 'Page sections, major divisions',
      },
    },
  },

  // Layout patterns
  layout: {
    containers: {
      narrow: {
        classes: 'max-w-2xl mx-auto px-4',
        usage: 'Reading content, forms, focused content',
      },
      default: {
        classes: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        usage: 'Standard page content, main layouts',
      },
      wide: {
        classes: 'max-w-screen-2xl mx-auto px-4',
        usage: 'Wide layouts, dashboards, data tables',
      },
      fluid: {
        classes: 'w-full px-4',
        usage: 'Full-width content, hero sections',
      },
    },
    grids: {
      auto: {
        classes: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
        usage: 'Card grids, feature lists, auto-sizing content',
      },
      fixed: {
        classes: 'grid grid-cols-12 gap-6',
        usage: 'Complex layouts, precise control',
      },
      responsive: {
        classes: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4',
        usage: 'Responsive card layouts, product grids',
      },
    },
    flex: {
      center: {
        classes: 'flex items-center justify-center',
        usage: 'Centering content, loading states, empty states',
      },
      between: {
        classes: 'flex items-center justify-between',
        usage: 'Navigation bars, card headers, action rows',
      },
      start: {
        classes: 'flex items-start justify-start',
        usage: 'Left-aligned content, form layouts',
      },
      column: {
        classes: 'flex flex-col',
        usage: 'Vertical layouts, mobile-first designs',
      },
    },
  },

  // Component patterns
  components: {
    buttons: {
      primary: {
        classes: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
        usage: 'Main actions, form submissions, CTAs',
      },
      secondary: {
        classes: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        usage: 'Secondary actions, alternative options',
      },
      outline: {
        classes: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        usage: 'Subtle actions, cancel buttons, secondary CTAs',
      },
      ghost: {
        classes: 'hover:bg-accent hover:text-accent-foreground',
        usage: 'Minimal actions, icon buttons, subtle interactions',
      },
      destructive: {
        classes: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        usage: 'Delete actions, dangerous operations',
      },
    },
    cards: {
      default: {
        classes: 'bg-card text-card-foreground rounded-lg border shadow-sm',
        usage: 'Standard content cards, information display',
      },
      interactive: {
        classes: 'bg-card text-card-foreground rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer',
        usage: 'Clickable cards, navigation cards, interactive content',
      },
      elevated: {
        classes: 'bg-card text-card-foreground rounded-lg shadow-lg border-0',
        usage: 'Important content, featured items, modals',
      },
    },
    forms: {
      input: {
        classes: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        usage: 'Text inputs, email fields, password fields',
      },
      label: {
        classes: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        usage: 'Form labels, field descriptions',
      },
      error: {
        classes: 'text-sm font-medium text-destructive',
        usage: 'Error messages, validation feedback',
      },
      helper: {
        classes: 'text-sm text-muted-foreground',
        usage: 'Helper text, field descriptions, hints',
      },
    },
  },

  // Animation patterns
  animations: {
    transitions: {
      fast: {
        classes: 'transition-all duration-150 ease-out',
        usage: 'Quick interactions, hover effects, micro-animations',
      },
      normal: {
        classes: 'transition-all duration-300 ease-in-out',
        usage: 'Standard transitions, state changes, modal animations',
      },
      slow: {
        classes: 'transition-all duration-500 ease-in-out',
        usage: 'Complex animations, page transitions, loading states',
      },
    },
    effects: {
      hover: {
        scale: 'hover:scale-105 transition-transform duration-200',
        shadow: 'hover:shadow-lg transition-shadow duration-300',
        opacity: 'hover:opacity-80 transition-opacity duration-200',
      },
      focus: {
        ring: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        outline: 'focus-visible:outline-none focus-visible:ring-2',
      },
      loading: {
        spin: 'animate-spin',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
      },
    },
  },

  // Responsive patterns
  responsive: {
    breakpoints: {
      xs: { value: '475px', usage: 'Small phones' },
      sm: { value: '640px', usage: 'Large phones' },
      md: { value: '768px', usage: 'Tablets' },
      lg: { value: '1024px', usage: 'Small laptops' },
      xl: { value: '1280px', usage: 'Large laptops' },
      '2xl': { value: '1536px', usage: 'Desktops' },
      '3xl': { value: '1920px', usage: 'Large screens' },
    },
    patterns: {
      stack: {
        classes: 'flex flex-col md:flex-row',
        usage: 'Mobile stacking, desktop side-by-side',
      },
      grid: {
        classes: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        usage: 'Responsive card grids, product listings',
      },
      hide: {
        classes: 'hidden md:block',
        usage: 'Desktop-only content, detailed information',
      },
      show: {
        classes: 'block md:hidden',
        usage: 'Mobile-only content, simplified interfaces',
      },
    },
  },

  // Accessibility patterns
  accessibility: {
    focus: {
      visible: {
        classes: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        usage: 'All interactive elements, keyboard navigation',
      },
      within: {
        classes: 'focus-within:ring-2 focus-within:ring-ring',
        usage: 'Container focus, form groups',
      },
    },
    screenReader: {
      only: {
        classes: 'sr-only',
        usage: 'Screen reader only content, additional context',
      },
      notOnly: {
        classes: 'not-sr-only',
        usage: 'Revealing hidden content, responsive visibility',
      },
    },
    contrast: {
      high: {
        classes: 'text-foreground bg-background',
        usage: 'High contrast text, important content',
      },
      medium: {
        classes: 'text-muted-foreground',
        usage: 'Secondary text, helper content',
      },
    },
  },
} as const;

// Style guide utilities
export const styleGuideUtils = {
  // Get component classes by type and variant
  getComponentClasses: (component: keyof typeof styleGuide.components, variant: string = 'default') => {
    const componentStyles = styleGuide.components[component];
    if (componentStyles && variant in componentStyles) {
      return componentStyles[variant as keyof typeof componentStyles].classes;
    }
    return '';
  },

  // Get typography classes by type and size
  getTypographyClasses: (type: keyof typeof styleGuide.typography, size: string) => {
    const typeStyles = styleGuide.typography[type];
    if (typeStyles && size in typeStyles) {
      return typeStyles[size as keyof typeof typeStyles].classes;
    }
    return '';
  },

  // Get layout classes by type and variant
  getLayoutClasses: (type: keyof typeof styleGuide.layout, variant: string) => {
    const layoutStyles = styleGuide.layout[type];
    if (layoutStyles && variant in layoutStyles) {
      return layoutStyles[variant as keyof typeof layoutStyles].classes;
    }
    return '';
  },

  // Get responsive classes for breakpoints
  getResponsiveClasses: (baseClass: string, breakpoints: Record<string, string>) => {
    const classes = [baseClass];
    Object.entries(breakpoints).forEach(([breakpoint, value]) => {
      classes.push(`${breakpoint}:${value}`);
    });
    return classes.join(' ');
  },

  // Combine multiple class patterns
  combineClasses: (...classGroups: (string | undefined)[]) => {
    return classGroups.filter(Boolean).join(' ');
  },
} as const;

export type StyleGuide = typeof styleGuide;
export type StyleGuideUtils = typeof styleGuideUtils;