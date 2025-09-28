/**
 * Design System Configuration
 * Centralized design tokens for AI-friendly code generation
 */

export const designTokens = {
  // Color system
  colors: {
    // Primary color scale
    primary: {
      50: 'hsl(var(--primary-50))',
      100: 'hsl(var(--primary-100))',
      200: 'hsl(var(--primary-200))',
      300: 'hsl(var(--primary-300))',
      400: 'hsl(var(--primary-400))',
      500: 'hsl(var(--primary-500))',
      600: 'hsl(var(--primary-600))',
      700: 'hsl(var(--primary-700))',
      800: 'hsl(var(--primary-800))',
      900: 'hsl(var(--primary-900))',
      950: 'hsl(var(--primary-950))',
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))',
    },
    // Secondary color scale
    secondary: {
      50: 'hsl(var(--secondary-50))',
      100: 'hsl(var(--secondary-100))',
      200: 'hsl(var(--secondary-200))',
      300: 'hsl(var(--secondary-300))',
      400: 'hsl(var(--secondary-400))',
      500: 'hsl(var(--secondary-500))',
      600: 'hsl(var(--secondary-600))',
      700: 'hsl(var(--secondary-700))',
      800: 'hsl(var(--secondary-800))',
      900: 'hsl(var(--secondary-900))',
      950: 'hsl(var(--secondary-950))',
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))',
    },
    // Semantic colors
    semantic: {
      success: {
        DEFAULT: 'hsl(var(--success))',
        foreground: 'hsl(var(--success-foreground))',
      },
      warning: {
        DEFAULT: 'hsl(var(--warning))',
        foreground: 'hsl(var(--warning-foreground))',
      },
      error: {
        DEFAULT: 'hsl(var(--error))',
        foreground: 'hsl(var(--error-foreground))',
      },
      info: {
        DEFAULT: 'hsl(var(--info))',
        foreground: 'hsl(var(--info-foreground))',
      },
    },
    // UI colors
    ui: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: 'hsl(var(--card))',
      cardForeground: 'hsl(var(--card-foreground))',
      popover: 'hsl(var(--popover))',
      popoverForeground: 'hsl(var(--popover-foreground))',
      muted: 'hsl(var(--muted))',
      mutedForeground: 'hsl(var(--muted-foreground))',
      accent: 'hsl(var(--accent))',
      accentForeground: 'hsl(var(--accent-foreground))',
      destructive: 'hsl(var(--destructive))',
      destructiveForeground: 'hsl(var(--destructive-foreground))',
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
    },
  },

  // Spacing system
  spacing: {
    xs: 'var(--spacing-xs)',     // 0.25rem / 4px
    sm: 'var(--spacing-sm)',     // 0.5rem / 8px
    md: 'var(--spacing-md)',     // 1rem / 16px
    lg: 'var(--spacing-lg)',     // 1.5rem / 24px
    xl: 'var(--spacing-xl)',     // 2rem / 32px
    '2xl': 'var(--spacing-2xl)', // 3rem / 48px
    '3xl': 'var(--spacing-3xl)', // 4rem / 64px
  },

  // Typography system
  typography: {
    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Border radius system
  borderRadius: {
    xs: '0.125rem',
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 2px)',
    '2xl': 'calc(var(--radius) + 4px)',
    '3xl': 'calc(var(--radius) + 8px)',
    full: '9999px',
  },

  // Shadow system
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgb(var(--primary) / 0.3)',
    glowLg: '0 0 40px rgb(var(--primary) / 0.4)',
  },

  // Animation system
  animations: {
    duration: {
      fast: 'var(--duration-fast)',
      normal: 'var(--duration-normal)',
      slow: 'var(--duration-slow)',
    },
    easing: {
      in: 'var(--ease-in)',
      out: 'var(--ease-out)',
      inOut: 'var(--ease-in-out)',
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },

  // Z-index system
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// AI-friendly component variants
export const componentVariants = {
  button: {
    variant: {
      default: 'ai-button-primary',
      secondary: 'ai-button-secondary',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
    size: {
      sm: 'h-9 rounded-md px-3 text-xs',
      default: 'h-10 px-4 py-2',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
  },
  card: {
    variant: {
      default: 'ai-card',
      outline: 'border border-border bg-card text-card-foreground shadow-sm',
      filled: 'bg-muted/50 text-card-foreground',
      elevated: 'bg-card text-card-foreground shadow-lg border-0',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
    },
  },
  input: {
    variant: {
      default: 'ai-input',
      outline: 'border border-input bg-background',
      filled: 'bg-muted border-0',
      ghost: 'border-0 bg-transparent',
    },
    size: {
      sm: 'h-9 px-3 text-xs',
      default: 'h-10 px-3 py-2',
      lg: 'h-11 px-4 text-base',
    },
  },
} as const;

// AI-friendly layout patterns
export const layoutPatterns = {
  container: {
    default: 'ai-container',
    fluid: 'w-full px-4',
    narrow: 'max-w-2xl mx-auto px-4',
    wide: 'max-w-7xl mx-auto px-4',
  },
  grid: {
    auto: 'ai-grid-auto',
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  },
  flex: {
    center: 'ai-flex-center',
    between: 'ai-flex-between',
    start: 'flex items-start justify-start',
    end: 'flex items-end justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
  },
  spacing: {
    section: 'ai-spacing-section',
    content: 'ai-spacing-content',
    compact: 'ai-spacing-compact',
  },
} as const;

// AI-friendly text patterns
export const textPatterns = {
  heading: {
    h1: 'ai-text-heading text-4xl',
    h2: 'ai-text-heading text-3xl',
    h3: 'ai-text-heading text-2xl',
    h4: 'ai-text-subheading text-xl',
    h5: 'ai-text-subheading text-lg',
    h6: 'ai-text-subheading',
  },
  body: {
    default: 'ai-text-body',
    large: 'text-base text-foreground',
    small: 'text-xs text-muted-foreground',
    muted: 'text-sm text-muted-foreground',
  },
  display: {
    large: 'text-5xl font-bold tracking-tight',
    medium: 'text-4xl font-bold tracking-tight',
    small: 'text-3xl font-bold tracking-tight',
  },
} as const;

// Export types for TypeScript support
export type DesignTokens = typeof designTokens;
export type ComponentVariants = typeof componentVariants;
export type LayoutPatterns = typeof layoutPatterns;
export type TextPatterns = typeof textPatterns;