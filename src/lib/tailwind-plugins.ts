/**
 * Custom Tailwind CSS Plugins
 * AI-friendly utilities and components
 */

import plugin from 'tailwindcss/plugin';

// AI-friendly utilities plugin
export const aiUtilitiesPlugin = plugin(function({ addUtilities, theme }) {
  const newUtilities = {
    // Layout utilities
    '.ai-container': {
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: theme('spacing.4'),
      paddingRight: theme('spacing.4'),
      '@screen sm': {
        paddingLeft: theme('spacing.6'),
        paddingRight: theme('spacing.6'),
      },
      '@screen lg': {
        paddingLeft: theme('spacing.8'),
        paddingRight: theme('spacing.8'),
      },
    },
    '.ai-container-narrow': {
      maxWidth: '768px',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: theme('spacing.4'),
      paddingRight: theme('spacing.4'),
    },
    '.ai-container-wide': {
      maxWidth: '1400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: theme('spacing.4'),
      paddingRight: theme('spacing.4'),
    },
    '.ai-grid-auto': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: theme('spacing.4'),
    },
    '.ai-grid-auto-sm': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: theme('spacing.3'),
    },
    '.ai-grid-auto-lg': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: theme('spacing.6'),
    },

    // Flexbox utilities
    '.ai-flex-center': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.ai-flex-between': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    '.ai-flex-start': {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    '.ai-flex-end': {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    '.ai-flex-col-center': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Text utilities
    '.ai-text-balance': {
      textWrap: 'balance',
    },
    '.ai-text-pretty': {
      textWrap: 'pretty',
    },
    '.ai-text-ellipsis': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '.ai-text-clamp-2': {
      display: '-webkit-box',
      '-webkit-line-clamp': '2',
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
    },
    '.ai-text-clamp-3': {
      display: '-webkit-box',
      '-webkit-line-clamp': '3',
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
    },

    // Accessibility utilities
    '.ai-focus-visible': {
      '&:focus-visible': {
        outline: '2px solid hsl(var(--ring))',
        outlineOffset: '2px',
      },
    },
    '.ai-sr-only': {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    },
    '.ai-not-sr-only': {
      position: 'static',
      width: 'auto',
      height: 'auto',
      padding: '0',
      margin: '0',
      overflow: 'visible',
      clip: 'auto',
      whiteSpace: 'normal',
    },

    // Interactive utilities
    '.ai-clickable': {
      cursor: 'pointer',
      userSelect: 'none',
      '&:hover': {
        opacity: '0.8',
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
    '.ai-disabled': {
      opacity: '0.5',
      pointerEvents: 'none',
      cursor: 'not-allowed',
    },

    // Animation utilities
    '.ai-animate-in': {
      animationDuration: 'var(--duration-normal)',
      animationFillMode: 'both',
    },
    '.ai-animate-out': {
      animationDuration: 'var(--duration-fast)',
      animationFillMode: 'both',
    },

    // Scrollbar utilities
    '.ai-scrollbar-thin': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'hsl(var(--muted)) transparent',
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'hsl(var(--muted))',
        borderRadius: '3px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'hsl(var(--muted-foreground))',
      },
    },
    '.ai-scrollbar-none': {
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  };

  addUtilities(newUtilities);
});

// AI-friendly components plugin
export const aiComponentsPlugin = plugin(function({ addComponents, theme }) {
  const components = {
    // Card components
    '.ai-card': {
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
      borderRadius: theme('borderRadius.lg'),
      border: '1px solid hsl(var(--border))',
      boxShadow: theme('boxShadow.sm'),
    },
    '.ai-card-hover': {
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
      borderRadius: theme('borderRadius.lg'),
      border: '1px solid hsl(var(--border))',
      boxShadow: theme('boxShadow.sm'),
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: theme('boxShadow.md'),
        transform: 'translateY(-2px)',
      },
    },

    // Button components
    '.ai-button-primary': {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      '&:hover': {
        backgroundColor: 'hsl(var(--primary) / 0.9)',
      },
      '&:focus-visible': {
        ringColor: 'hsl(var(--primary))',
      },
    },
    '.ai-button-secondary': {
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--secondary-foreground))',
      '&:hover': {
        backgroundColor: 'hsl(var(--secondary) / 0.8)',
      },
      '&:focus-visible': {
        ringColor: 'hsl(var(--secondary))',
      },
    },
    '.ai-button-outline': {
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))',
      '&:hover': {
        backgroundColor: 'hsl(var(--accent))',
        color: 'hsl(var(--accent-foreground))',
      },
    },
    '.ai-button-ghost': {
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground))',
      '&:hover': {
        backgroundColor: 'hsl(var(--accent))',
        color: 'hsl(var(--accent-foreground))',
      },
    },

    // Input components
    '.ai-input': {
      backgroundColor: 'hsl(var(--background))',
      border: '1px solid hsl(var(--input))',
      borderRadius: theme('borderRadius.md'),
      padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
      fontSize: theme('fontSize.sm[0]'),
      '&:focus-visible': {
        ringColor: 'hsl(var(--ring))',
        outline: 'none',
        ringWidth: '2px',
        ringOffset: '2px',
      },
      '&::placeholder': {
        color: 'hsl(var(--muted-foreground))',
      },
    },

    // Text components
    '.ai-text-heading': {
      fontSize: theme('fontSize.2xl[0]'),
      fontWeight: theme('fontWeight.semibold'),
      letterSpacing: theme('letterSpacing.tight'),
      lineHeight: theme('fontSize.2xl[1].lineHeight'),
    },
    '.ai-text-subheading': {
      fontSize: theme('fontSize.lg[0]'),
      fontWeight: theme('fontWeight.medium'),
      lineHeight: theme('fontSize.lg[1].lineHeight'),
    },
    '.ai-text-body': {
      fontSize: theme('fontSize.sm[0]'),
      color: 'hsl(var(--muted-foreground))',
      lineHeight: theme('fontSize.sm[1].lineHeight'),
    },

    // Spacing components
    '.ai-spacing-section': {
      '& > * + *': {
        marginTop: theme('spacing.6'),
      },
    },
    '.ai-spacing-content': {
      '& > * + *': {
        marginTop: theme('spacing.4'),
      },
    },
    '.ai-spacing-compact': {
      '& > * + *': {
        marginTop: theme('spacing.2'),
      },
    },

    // Status components
    '.ai-status-success': {
      backgroundColor: 'hsl(var(--success) / 0.1)',
      color: 'hsl(var(--success))',
      border: '1px solid hsl(var(--success) / 0.2)',
    },
    '.ai-status-warning': {
      backgroundColor: 'hsl(var(--warning) / 0.1)',
      color: 'hsl(var(--warning))',
      border: '1px solid hsl(var(--warning) / 0.2)',
    },
    '.ai-status-error': {
      backgroundColor: 'hsl(var(--error) / 0.1)',
      color: 'hsl(var(--error))',
      border: '1px solid hsl(var(--error) / 0.2)',
    },
    '.ai-status-info': {
      backgroundColor: 'hsl(var(--info) / 0.1)',
      color: 'hsl(var(--info))',
      border: '1px solid hsl(var(--info) / 0.2)',
    },
  };

  addComponents(components);
});

// Animation plugin
export const aiAnimationsPlugin = plugin(function({ addUtilities, theme }) {
  const animations = {
    '.ai-fade-in': {
      animation: 'fade-in var(--duration-normal) var(--ease-out)',
    },
    '.ai-fade-out': {
      animation: 'fade-out var(--duration-fast) var(--ease-in)',
    },
    '.ai-slide-in-top': {
      animation: 'slide-in-from-top var(--duration-normal) var(--ease-out)',
    },
    '.ai-slide-in-bottom': {
      animation: 'slide-in-from-bottom var(--duration-normal) var(--ease-out)',
    },
    '.ai-slide-in-left': {
      animation: 'slide-in-from-left var(--duration-normal) var(--ease-out)',
    },
    '.ai-slide-in-right': {
      animation: 'slide-in-from-right var(--duration-normal) var(--ease-out)',
    },
    '.ai-pulse-glow': {
      animation: 'pulse-glow 2s var(--ease-in-out) infinite',
    },
  };

  addUtilities(animations);
});

// Export all plugins
export const aiTailwindPlugins = [
  aiUtilitiesPlugin,
  aiComponentsPlugin,
  aiAnimationsPlugin,
];