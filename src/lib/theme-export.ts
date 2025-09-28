/**
 * Theme Export and Import Utilities
 * Tools for sharing and distributing themes
 */

import { ThemeConfig } from './theme-system';

export interface ThemeExportFormat {
  version: string;
  theme: ThemeConfig;
  metadata: {
    createdAt: string;
    createdBy?: string;
    description?: string;
    tags?: string[];
  };
}

export interface TailwindConfigExport {
  colors: Record<string, any>;
  borderRadius: Record<string, string>;
  fontFamily: Record<string, string[]>;
}

export class ThemeExporter {
  /**
   * Export theme as JSON
   */
  static exportAsJSON(theme: ThemeConfig, metadata?: Partial<ThemeExportFormat['metadata']>): string {
    const exportData: ThemeExportFormat = {
      version: '1.0.0',
      theme,
      metadata: {
        createdAt: new Date().toISOString(),
        ...metadata,
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export theme as CSS variables
   */
  static exportAsCSS(theme: ThemeConfig, mode: 'light' | 'dark' | 'both' = 'both'): string {
    let css = '';

    if (mode === 'light' || mode === 'both') {
      css += this.generateCSSVariables(theme, 'light');
    }

    if (mode === 'dark' || mode === 'both') {
      css += '\n' + this.generateCSSVariables(theme, 'dark', true);
    }

    return css;
  }

  /**
   * Export theme as Tailwind config
   */
  static exportAsTailwindConfig(theme: ThemeConfig): string {
    const config: TailwindConfigExport = {
      colors: this.convertColorsToTailwind(theme),
      borderRadius: {
        lg: theme.radius,
        md: `calc(${theme.radius} - 2px)`,
        sm: `calc(${theme.radius} - 4px)`,
      },
      fontFamily: theme.fontFamily,
    };

    return `module.exports = {
  theme: {
    extend: ${JSON.stringify(config, null, 6)}
  }
}`;
  }

  /**
   * Export theme as SCSS variables
   */
  static exportAsSCSS(theme: ThemeConfig, mode: 'light' | 'dark' | 'both' = 'both'): string {
    let scss = '';

    if (mode === 'light' || mode === 'both') {
      scss += this.generateSCSSVariables(theme, 'light');
    }

    if (mode === 'dark' || mode === 'both') {
      scss += '\n' + this.generateSCSSVariables(theme, 'dark');
    }

    return scss;
  }

  /**
   * Export theme as design tokens (JSON)
   */
  static exportAsDesignTokens(theme: ThemeConfig): string {
    const tokens = {
      color: this.convertToDesignTokens(theme.colors),
      borderRadius: {
        value: theme.radius,
        type: 'borderRadius',
      },
      fontFamily: {
        sans: {
          value: theme.fontFamily.sans,
          type: 'fontFamily',
        },
        mono: {
          value: theme.fontFamily.mono,
          type: 'fontFamily',
        },
      },
    };

    return JSON.stringify(tokens, null, 2);
  }

  /**
   * Import theme from JSON
   */
  static importFromJSON(jsonString: string): ThemeConfig {
    try {
      const data = JSON.parse(jsonString) as ThemeExportFormat;
      
      if (!data.theme || !this.validateThemeStructure(data.theme)) {
        throw new Error('Invalid theme structure');
      }

      return data.theme;
    } catch (error) {
      throw new Error(`Failed to import theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate downloadable theme file
   */
  static generateDownloadableFile(
    theme: ThemeConfig,
    format: 'json' | 'css' | 'tailwind' | 'scss' | 'tokens' = 'json',
    metadata?: Partial<ThemeExportFormat['metadata']>
  ): { content: string; filename: string; mimeType: string } {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = this.exportAsJSON(theme, metadata);
        filename = `${theme.name}-theme.json`;
        mimeType = 'application/json';
        break;
      case 'css':
        content = this.exportAsCSS(theme);
        filename = `${theme.name}-theme.css`;
        mimeType = 'text/css';
        break;
      case 'tailwind':
        content = this.exportAsTailwindConfig(theme);
        filename = `${theme.name}-tailwind.config.js`;
        mimeType = 'text/javascript';
        break;
      case 'scss':
        content = this.exportAsSCSS(theme);
        filename = `${theme.name}-theme.scss`;
        mimeType = 'text/scss';
        break;
      case 'tokens':
        content = this.exportAsDesignTokens(theme);
        filename = `${theme.name}-tokens.json`;
        mimeType = 'application/json';
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    return { content, filename, mimeType };
  }

  /**
   * Private helper methods
   */
  private static generateCSSVariables(
    theme: ThemeConfig,
    mode: 'light' | 'dark',
    isDarkMode: boolean = false
  ): string {
    const colors = theme.colors[mode];
    const selector = isDarkMode ? '.dark' : ':root';
    let css = `${selector} {\n`;

    // Add color variables
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

    // Add other variables
    css += `  --radius: ${theme.radius};\n`;
    css += `  --font-sans: ${theme.fontFamily.sans.join(', ')};\n`;
    css += `  --font-mono: ${theme.fontFamily.mono.join(', ')};\n`;
    css += '}\n';

    return css;
  }

  private static generateSCSSVariables(
    theme: ThemeConfig,
    mode: 'light' | 'dark'
  ): string {
    const colors = theme.colors[mode];
    const prefix = mode === 'dark' ? '$dark-' : '$';
    let scss = `// ${mode} mode variables\n`;

    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        scss += `${prefix}${this.kebabCase(key)}: hsl(${value});\n`;
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          const varName = subKey === 'DEFAULT' ? key : `${key}-${subKey}`;
          scss += `${prefix}${this.kebabCase(varName)}: hsl(${subValue});\n`;
        });
      }
    });

    scss += `${prefix}radius: ${theme.radius};\n`;
    scss += `${prefix}font-sans: ${theme.fontFamily.sans.join(', ')};\n`;
    scss += `${prefix}font-mono: ${theme.fontFamily.mono.join(', ')};\n`;

    return scss;
  }

  private static convertColorsToTailwind(theme: ThemeConfig) {
    const tailwindColors: Record<string, any> = {};

    // Convert light mode colors (primary structure)
    const lightColors = theme.colors.light;
    
    Object.entries(lightColors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        tailwindColors[key] = `hsl(var(--${this.kebabCase(key)}))`;
      } else if (typeof value === 'object') {
        tailwindColors[key] = {};
        Object.entries(value).forEach(([subKey, subValue]) => {
          const varName = subKey === 'DEFAULT' ? key : `${key}-${subKey}`;
          if (subKey === 'DEFAULT') {
            tailwindColors[key].DEFAULT = `hsl(var(--${this.kebabCase(key)}))`;
          } else {
            tailwindColors[key][subKey] = `hsl(var(--${this.kebabCase(varName)}))`;
          }
        });
      }
    });

    return tailwindColors;
  }

  private static convertToDesignTokens(colors: ThemeConfig['colors']) {
    const tokens: Record<string, any> = {};

    ['light', 'dark'].forEach(mode => {
      tokens[mode] = {};
      const modeColors = colors[mode as keyof typeof colors];

      Object.entries(modeColors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          tokens[mode][key] = {
            value: `hsl(${value})`,
            type: 'color',
          };
        } else if (typeof value === 'object') {
          tokens[mode][key] = {};
          Object.entries(value).forEach(([subKey, subValue]) => {
            tokens[mode][key][subKey] = {
              value: `hsl(${subValue})`,
              type: 'color',
            };
          });
        }
      });
    });

    return tokens;
  }

  private static validateThemeStructure(theme: any): theme is ThemeConfig {
    return (
      typeof theme === 'object' &&
      typeof theme.name === 'string' &&
      typeof theme.displayName === 'string' &&
      typeof theme.colors === 'object' &&
      typeof theme.colors.light === 'object' &&
      typeof theme.colors.dark === 'object' &&
      typeof theme.radius === 'string' &&
      typeof theme.fontFamily === 'object' &&
      Array.isArray(theme.fontFamily.sans) &&
      Array.isArray(theme.fontFamily.mono)
    );
  }

  private static kebabCase(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
}

// Theme sharing utilities
export class ThemeSharing {
  /**
   * Generate shareable theme URL
   */
  static generateShareableURL(theme: ThemeConfig, baseURL: string = window.location.origin): string {
    const themeData = ThemeExporter.exportAsJSON(theme);
    const encoded = btoa(encodeURIComponent(themeData));
    return `${baseURL}/theme?data=${encoded}`;
  }

  /**
   * Parse theme from shareable URL
   */
  static parseFromURL(url: string): ThemeConfig | null {
    try {
      const urlObj = new URL(url);
      const data = urlObj.searchParams.get('data');
      
      if (!data) return null;
      
      const decoded = decodeURIComponent(atob(data));
      return ThemeExporter.importFromJSON(decoded);
    } catch (error) {
      console.error('Failed to parse theme from URL:', error);
      return null;
    }
  }

  /**
   * Generate theme preview image (placeholder)
   */
  static generatePreviewImage(theme: ThemeConfig): string {
    // This would generate a preview image of the theme
    // For now, return a placeholder SVG
    const primaryColor = theme.colors.light.primary.DEFAULT;
    const secondaryColor = theme.colors.light.secondary.DEFAULT;
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="hsl(${theme.colors.light.background})"/>
        <rect x="20" y="20" width="120" height="40" rx="8" fill="hsl(${primaryColor})"/>
        <rect x="160" y="20" width="120" height="40" rx="8" fill="hsl(${secondaryColor})"/>
        <text x="20" y="90" font-family="sans-serif" font-size="16" fill="hsl(${theme.colors.light.foreground})">${theme.displayName}</text>
      </svg>
    `)}`;
  }
}

// Browser download utility
export function downloadTheme(
  theme: ThemeConfig,
  format: 'json' | 'css' | 'tailwind' | 'scss' | 'tokens' = 'json',
  metadata?: Partial<ThemeExportFormat['metadata']>
) {
  const { content, filename, mimeType } = ThemeExporter.generateDownloadableFile(
    theme,
    format,
    metadata
  );

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}