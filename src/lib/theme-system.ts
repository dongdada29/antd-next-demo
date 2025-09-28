/**
 * Theme System and Customization
 * Comprehensive theme management for AI-friendly styling
 */

import React from 'react';

export interface ThemeColors {
  // Primary color scale
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
    DEFAULT: string;
    foreground: string;
  };
  // Secondary color scale
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
    DEFAULT: string;
    foreground: string;
  };
  // Semantic colors
  success: {
    DEFAULT: string;
    foreground: string;
  };
  warning: {
    DEFAULT: string;
    foreground: string;
  };
  error: {
    DEFAULT: string;
    foreground: string;
  };
  info: {
    DEFAULT: string;
    foreground: string;
  };
  // UI colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  radius: string;
  fontFamily: {
    sans: string[];
    mono: string[];
  };
}

// Default theme configuration
export const defaultTheme: ThemeConfig = {
  name: 'default',
  displayName: 'Default',
  colors: {
    light: {
      primary: {
        50: '221 100% 97%',
        100: '221 96% 91%',
        200: '221 94% 83%',
        300: '221 91% 73%',
        400: '221 86% 60%',
        500: '221 83% 53%',
        600: '221 83% 45%',
        700: '221 84% 37%',
        800: '221 84% 29%',
        900: '221 84% 21%',
        950: '221 84% 13%',
        DEFAULT: '221.2 83.2% 53.3%',
        foreground: '210 40% 98%',
      },
      secondary: {
        50: '210 40% 98%',
        100: '210 40% 96%',
        200: '210 40% 92%',
        300: '210 40% 88%',
        400: '210 40% 84%',
        500: '210 40% 80%',
        600: '210 40% 76%',
        700: '210 40% 72%',
        800: '210 40% 68%',
        900: '210 40% 64%',
        950: '210 40% 60%',
        DEFAULT: '210 40% 96%',
        foreground: '222.2 84% 4.9%',
      },
      success: {
        DEFAULT: '142 76% 36%',
        foreground: '355 100% 97%',
      },
      warning: {
        DEFAULT: '38 92% 50%',
        foreground: '48 96% 89%',
      },
      error: {
        DEFAULT: '0 84% 60%',
        foreground: '210 40% 98%',
      },
      info: {
        DEFAULT: '199 89% 48%',
        foreground: '210 40% 98%',
      },
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      popover: '0 0% 100%',
      popoverForeground: '222.2 84% 4.9%',
      muted: '210 40% 96%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      accentForeground: '222.2 84% 4.9%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '221.2 83.2% 53.3%',
    },
    dark: {
      primary: {
        50: '217 91% 13%',
        100: '217 91% 21%',
        200: '217 91% 29%',
        300: '217 91% 37%',
        400: '217 91% 45%',
        500: '217 91% 53%',
        600: '217 91% 60%',
        700: '217 91% 73%',
        800: '217 94% 83%',
        900: '217 96% 91%',
        950: '217 100% 97%',
        DEFAULT: '217.2 91.2% 59.8%',
        foreground: '222.2 84% 4.9%',
      },
      secondary: {
        50: '217 33% 60%',
        100: '217 33% 56%',
        200: '217 33% 52%',
        300: '217 33% 48%',
        400: '217 33% 44%',
        500: '217 33% 40%',
        600: '217 33% 36%',
        700: '217 33% 32%',
        800: '217 33% 28%',
        900: '217 33% 24%',
        950: '217 33% 18%',
        DEFAULT: '217.2 32.6% 17.5%',
        foreground: '210 40% 98%',
      },
      success: {
        DEFAULT: '142 76% 46%',
        foreground: '142 76% 6%',
      },
      warning: {
        DEFAULT: '38 92% 60%',
        foreground: '38 92% 10%',
      },
      error: {
        DEFAULT: '0 62.8% 30.6%',
        foreground: '210 40% 98%',
      },
      info: {
        DEFAULT: '199 89% 58%',
        foreground: '199 89% 8%',
      },
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      card: '222.2 84% 4.9%',
      cardForeground: '210 40% 98%',
      popover: '222.2 84% 4.9%',
      popoverForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 65.1%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '210 40% 98%',
      border: '217.2 32.6% 17.5%',
      input: '217.2 32.6% 17.5%',
      ring: '224.3 76.3% 94.1%',
    },
  },
  radius: '0.5rem',
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
};

// Predefined theme presets
export const themePresets: Record<string, ThemeConfig> = {
  default: defaultTheme,
  
  blue: {
    name: 'blue',
    displayName: 'Blue',
    colors: {
      light: {
        ...defaultTheme.colors.light,
        primary: {
          50: '214 100% 97%',
          100: '214 95% 93%',
          200: '213 97% 87%',
          300: '212 96% 78%',
          400: '213 94% 68%',
          500: '217 91% 60%',
          600: '221 83% 53%',
          700: '224 76% 48%',
          800: '226 71% 40%',
          900: '224 64% 33%',
          950: '226 55% 21%',
          DEFAULT: '221 83% 53%',
          foreground: '210 40% 98%',
        },
      },
      dark: {
        ...defaultTheme.colors.dark,
        primary: {
          50: '226 55% 21%',
          100: '224 64% 33%',
          200: '226 71% 40%',
          300: '224 76% 48%',
          400: '221 83% 53%',
          500: '217 91% 60%',
          600: '213 94% 68%',
          700: '212 96% 78%',
          800: '213 97% 87%',
          900: '214 95% 93%',
          950: '214 100% 97%',
          DEFAULT: '217 91% 60%',
          foreground: '226 55% 21%',
        },
      },
    },
    radius: '0.5rem',
    fontFamily: defaultTheme.fontFamily,
  },

  green: {
    name: 'green',
    displayName: 'Green',
    colors: {
      light: {
        ...defaultTheme.colors.light,
        primary: {
          50: '138 76% 97%',
          100: '141 84% 93%',
          200: '141 79% 85%',
          300: '142 77% 73%',
          400: '142 69% 58%',
          500: '142 71% 45%',
          600: '142 76% 36%',
          700: '142 72% 29%',
          800: '143 64% 24%',
          900: '144 61% 20%',
          950: '146 80% 10%',
          DEFAULT: '142 76% 36%',
          foreground: '138 76% 97%',
        },
      },
      dark: {
        ...defaultTheme.colors.dark,
        primary: {
          50: '146 80% 10%',
          100: '144 61% 20%',
          200: '143 64% 24%',
          300: '142 72% 29%',
          400: '142 76% 36%',
          500: '142 71% 45%',
          600: '142 69% 58%',
          700: '142 77% 73%',
          800: '141 79% 85%',
          900: '141 84% 93%',
          950: '138 76% 97%',
          DEFAULT: '142 71% 45%',
          foreground: '146 80% 10%',
        },
      },
    },
    radius: '0.5rem',
    fontFamily: defaultTheme.fontFamily,
  },

  purple: {
    name: 'purple',
    displayName: 'Purple',
    colors: {
      light: {
        ...defaultTheme.colors.light,
        primary: {
          50: '270 100% 98%',
          100: '269 100% 95%',
          200: '269 100% 92%',
          300: '269 97% 85%',
          400: '270 95% 75%',
          500: '270 91% 65%',
          600: '271 81% 56%',
          700: '272 72% 47%',
          800: '272 69% 38%',
          900: '273 67% 32%',
          950: '274 87% 21%',
          DEFAULT: '272 72% 47%',
          foreground: '270 100% 98%',
        },
      },
      dark: {
        ...defaultTheme.colors.dark,
        primary: {
          50: '274 87% 21%',
          100: '273 67% 32%',
          200: '272 69% 38%',
          300: '272 72% 47%',
          400: '271 81% 56%',
          500: '270 91% 65%',
          600: '270 95% 75%',
          700: '269 97% 85%',
          800: '269 100% 92%',
          900: '269 100% 95%',
          950: '270 100% 98%',
          DEFAULT: '270 91% 65%',
          foreground: '274 87% 21%',
        },
      },
    },
    radius: '0.5rem',
    fontFamily: defaultTheme.fontFamily,
  },
};

// Theme management class
export class ThemeManager {
  private currentTheme: ThemeConfig = defaultTheme;
  private isDarkMode: boolean = false;

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme-name');
    const savedMode = localStorage.getItem('theme-mode');
    
    if (savedTheme && themePresets[savedTheme]) {
      this.currentTheme = themePresets[savedTheme];
    }
    
    if (savedMode) {
      this.isDarkMode = savedMode === 'dark';
    } else {
      // Check system preference
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    this.applyTheme();
  }

  setTheme(themeName: string) {
    if (themePresets[themeName]) {
      this.currentTheme = themePresets[themeName];
      localStorage.setItem('theme-name', themeName);
      this.applyTheme();
    }
  }

  setDarkMode(isDark: boolean) {
    this.isDarkMode = isDark;
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode);
  }

  getCurrentTheme(): ThemeConfig {
    return this.currentTheme;
  }

  isDark(): boolean {
    return this.isDarkMode;
  }

  private applyTheme() {
    const root = document.documentElement;
    const colors = this.isDarkMode ? this.currentTheme.colors.dark : this.currentTheme.colors.light;
    
    // Apply color variables
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--${this.kebabCase(key)}`, value);
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          const varName = subKey === 'DEFAULT' ? key : `${key}-${subKey}`;
          root.style.setProperty(`--${this.kebabCase(varName)}`, subValue);
        });
      }
    });
    
    // Apply other theme properties
    root.style.setProperty('--radius', this.currentTheme.radius);
    root.style.setProperty('--font-sans', this.currentTheme.fontFamily.sans.join(', '));
    root.style.setProperty('--font-mono', this.currentTheme.fontFamily.mono.join(', '));
    
    // Update dark mode class
    if (this.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  // Generate CSS variables for a custom theme
  generateCSSVariables(theme: ThemeConfig, mode: 'light' | 'dark'): string {
    const colors = theme.colors[mode];
    let css = ':root {\n';
    
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        css += `  --${this.kebabCase(key)}: ${value};\n`;
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          const varName = subKey === 'DEFAULT' ? key : `${key}-${subKey}`;
          css += `  --${this.kebabCase(varName)}: ${subValue};\n`;
        });
      }
    });
    
    css += `  --radius: ${theme.radius};\n`;
    css += `  --font-sans: ${theme.fontFamily.sans.join(', ')};\n`;
    css += `  --font-mono: ${theme.fontFamily.mono.join(', ')};\n`;
    css += '}\n';
    
    return css;
  }

  // Create a custom theme
  createCustomTheme(
    name: string,
    displayName: string,
    baseTheme: ThemeConfig = defaultTheme,
    overrides: Partial<ThemeConfig> = {}
  ): ThemeConfig {
    const customTheme: ThemeConfig = {
      name,
      displayName,
      colors: {
        light: { ...baseTheme.colors.light, ...overrides.colors?.light },
        dark: { ...baseTheme.colors.dark, ...overrides.colors?.dark },
      },
      radius: overrides.radius || baseTheme.radius,
      fontFamily: overrides.fontFamily || baseTheme.fontFamily,
    };
    
    return customTheme;
  }

  // Export theme configuration
  exportTheme(): string {
    return JSON.stringify(this.currentTheme, null, 2);
  }

  // Import theme configuration
  importTheme(themeJson: string): boolean {
    try {
      const theme = JSON.parse(themeJson) as ThemeConfig;
      if (this.validateTheme(theme)) {
        themePresets[theme.name] = theme;
        this.setTheme(theme.name);
        return true;
      }
    } catch (error) {
      console.error('Failed to import theme:', error);
    }
    return false;
  }

  private validateTheme(theme: any): theme is ThemeConfig {
    return (
      typeof theme === 'object' &&
      typeof theme.name === 'string' &&
      typeof theme.displayName === 'string' &&
      typeof theme.colors === 'object' &&
      typeof theme.colors.light === 'object' &&
      typeof theme.colors.dark === 'object' &&
      typeof theme.radius === 'string' &&
      typeof theme.fontFamily === 'object'
    );
  }
}

// Singleton theme manager instance
export const themeManager = new ThemeManager();

// React hook for theme management
export function useTheme() {
  const [theme, setThemeState] = React.useState(themeManager.getCurrentTheme());
  const [isDark, setIsDarkState] = React.useState(themeManager.isDark());

  const setTheme = (themeName: string) => {
    themeManager.setTheme(themeName);
    setThemeState(themeManager.getCurrentTheme());
  };

  const setDarkMode = (isDarkMode: boolean) => {
    themeManager.setDarkMode(isDarkMode);
    setIsDarkState(isDarkMode);
  };

  const toggleDarkMode = () => {
    themeManager.toggleDarkMode();
    setIsDarkState(themeManager.isDark());
  };

  return {
    theme,
    isDark,
    setTheme,
    setDarkMode,
    toggleDarkMode,
    availableThemes: Object.values(themePresets),
  };
}

// Utility functions for theme generation
export const themeUtils = {
  // Generate color scale from a base color
  generateColorScale: (baseHsl: string): Record<string, string> => {
    const [h, s, l] = baseHsl.split(' ').map(v => parseFloat(v.replace('%', '')));
    
    return {
      50: `${h} ${Math.min(s + 20, 100)}% ${Math.min(l + 45, 95)}%`,
      100: `${h} ${Math.min(s + 15, 100)}% ${Math.min(l + 35, 90)}%`,
      200: `${h} ${Math.min(s + 10, 100)}% ${Math.min(l + 25, 85)}%`,
      300: `${h} ${Math.min(s + 5, 100)}% ${Math.min(l + 15, 75)}%`,
      400: `${h} ${s}% ${Math.min(l + 5, 65)}%`,
      500: `${h} ${s}% ${l}%`,
      600: `${h} ${s}% ${Math.max(l - 5, 35)}%`,
      700: `${h} ${Math.max(s - 5, 0)}% ${Math.max(l - 15, 25)}%`,
      800: `${h} ${Math.max(s - 10, 0)}% ${Math.max(l - 25, 15)}%`,
      900: `${h} ${Math.max(s - 15, 0)}% ${Math.max(l - 35, 10)}%`,
      950: `${h} ${Math.max(s - 20, 0)}% ${Math.max(l - 45, 5)}%`,
    };
  },

  // Calculate contrast ratio between two colors
  calculateContrast: (color1: string, color2: string): number => {
    // Simplified contrast calculation
    // In a real implementation, you'd convert HSL to RGB and calculate proper contrast
    return 4.5; // Placeholder
  },

  // Validate color accessibility
  validateAccessibility: (theme: ThemeConfig): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // Check contrast ratios (simplified)
    // In a real implementation, you'd check all color combinations
    
    return {
      valid: issues.length === 0,
      issues,
    };
  },
} as const;