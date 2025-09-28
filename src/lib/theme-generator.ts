/**
 * Theme Generator for AI Agents
 * Automated theme generation and customization tools
 */

import { ThemeConfig, ThemeColors, themeUtils } from './theme-system';

export interface ThemeGenerationOptions {
  name: string;
  displayName: string;
  primaryColor: string; // HSL format: "221 83% 53%"
  secondaryColor?: string;
  accentColor?: string;
  radius?: string;
  fontFamily?: {
    sans: string[];
    mono: string[];
  };
  generateDarkMode?: boolean;
  contrastRatio?: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  neutral: string;
}

export class ThemeGenerator {
  /**
   * Generate a complete theme from basic options
   */
  static generateTheme(options: ThemeGenerationOptions): ThemeConfig {
    const {
      name,
      displayName,
      primaryColor,
      secondaryColor,
      accentColor,
      radius = '0.5rem',
      fontFamily = {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      generateDarkMode = true,
    } = options;

    // Generate primary color scale
    const primaryScale = themeUtils.generateColorScale(primaryColor);
    
    // Generate secondary color (or derive from primary)
    const secondaryHsl = secondaryColor || this.deriveSecondaryColor(primaryColor);
    const secondaryScale = themeUtils.generateColorScale(secondaryHsl);

    // Generate accent color (or derive from primary)
    const accentHsl = accentColor || this.deriveAccentColor(primaryColor);

    // Create light theme colors
    const lightColors: ThemeColors = {
      primary: {
        ...primaryScale,
        DEFAULT: primaryColor,
        foreground: this.getContrastingForeground(primaryColor),
      },
      secondary: {
        ...secondaryScale,
        DEFAULT: secondaryHsl,
        foreground: this.getContrastingForeground(secondaryHsl),
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
      accent: accentHsl,
      accentForeground: this.getContrastingForeground(accentHsl),
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: primaryColor,
    };

    // Generate dark theme colors
    const darkColors: ThemeColors = generateDarkMode
      ? this.generateDarkTheme(lightColors)
      : lightColors;

    return {
      name,
      displayName,
      colors: {
        light: lightColors,
        dark: darkColors,
      },
      radius,
      fontFamily,
    };
  }

  /**
   * Generate a theme from a color palette
   */
  static generateFromPalette(
    name: string,
    displayName: string,
    palette: ColorPalette,
    options: Partial<ThemeGenerationOptions> = {}
  ): ThemeConfig {
    return this.generateTheme({
      name,
      displayName,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
      ...options,
    });
  }

  /**
   * Generate multiple theme variations
   */
  static generateThemeVariations(
    baseName: string,
    baseDisplayName: string,
    primaryColor: string,
    variations: string[] = ['light', 'medium', 'dark']
  ): ThemeConfig[] {
    const themes: ThemeConfig[] = [];
    const [h, s, l] = primaryColor.split(' ').map(v => parseFloat(v.replace('%', '')));

    variations.forEach((variation, index) => {
      let adjustedL = l;
      let suffix = '';

      switch (variation) {
        case 'light':
          adjustedL = Math.min(l + 15, 85);
          suffix = ' Light';
          break;
        case 'medium':
          adjustedL = l;
          suffix = '';
          break;
        case 'dark':
          adjustedL = Math.max(l - 15, 25);
          suffix = ' Dark';
          break;
      }

      const adjustedColor = `${h} ${s}% ${adjustedL}%`;
      themes.push(
        this.generateTheme({
          name: `${baseName}-${variation}`,
          displayName: `${baseDisplayName}${suffix}`,
          primaryColor: adjustedColor,
        })
      );
    });

    return themes;
  }

  /**
   * Generate a theme from brand colors
   */
  static generateBrandTheme(
    name: string,
    displayName: string,
    brandColors: {
      primary: string;
      secondary?: string;
      accent?: string;
      logo?: string;
    },
    options: Partial<ThemeGenerationOptions> = {}
  ): ThemeConfig {
    return this.generateTheme({
      name,
      displayName,
      primaryColor: brandColors.primary,
      secondaryColor: brandColors.secondary,
      accentColor: brandColors.accent || brandColors.logo,
      ...options,
    });
  }

  /**
   * Generate accessible theme with high contrast
   */
  static generateAccessibleTheme(
    name: string,
    displayName: string,
    primaryColor: string,
    options: Partial<ThemeGenerationOptions> = {}
  ): ThemeConfig {
    const theme = this.generateTheme({
      name,
      displayName,
      primaryColor,
      contrastRatio: 7, // WCAG AAA standard
      ...options,
    });

    // Enhance contrast for accessibility
    theme.colors.light = this.enhanceContrast(theme.colors.light);
    theme.colors.dark = this.enhanceContrast(theme.colors.dark);

    return theme;
  }

  /**
   * Generate theme for specific use cases
   */
  static generateUseCaseTheme(
    useCase: 'dashboard' | 'marketing' | 'documentation' | 'ecommerce' | 'blog',
    name: string,
    displayName: string,
    primaryColor: string
  ): ThemeConfig {
    const baseOptions: ThemeGenerationOptions = {
      name,
      displayName,
      primaryColor,
    };

    switch (useCase) {
      case 'dashboard':
        return this.generateTheme({
          ...baseOptions,
          radius: '0.375rem', // Smaller radius for data density
          secondaryColor: this.deriveNeutralColor(primaryColor),
        });

      case 'marketing':
        return this.generateTheme({
          ...baseOptions,
          radius: '0.75rem', // Larger radius for modern look
          accentColor: this.deriveComplementaryColor(primaryColor),
        });

      case 'documentation':
        return this.generateTheme({
          ...baseOptions,
          radius: '0.25rem', // Minimal radius for clean look
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'Consolas', 'monospace'],
          },
        });

      case 'ecommerce':
        return this.generateTheme({
          ...baseOptions,
          radius: '0.5rem',
          accentColor: '142 76% 36%', // Green for success/purchase
        });

      case 'blog':
        return this.generateTheme({
          ...baseOptions,
          radius: '0.5rem',
          fontFamily: {
            sans: ['Georgia', 'serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
        });

      default:
        return this.generateTheme(baseOptions);
    }
  }

  /**
   * Private helper methods
   */
  private static deriveSecondaryColor(primaryColor: string): string {
    const [h, s, l] = primaryColor.split(' ').map(v => parseFloat(v.replace('%', '')));
    // Create a more neutral secondary color
    return `${h} ${Math.max(s - 30, 10)}% ${Math.min(l + 20, 90)}%`;
  }

  private static deriveAccentColor(primaryColor: string): string {
    const [h, s, l] = primaryColor.split(' ').map(v => parseFloat(v.replace('%', '')));
    // Create an accent color with shifted hue
    const newHue = (h + 30) % 360;
    return `${newHue} ${s}% ${l}%`;
  }

  private static deriveComplementaryColor(primaryColor: string): string {
    const [h, s, l] = primaryColor.split(' ').map(v => parseFloat(v.replace('%', '')));
    // Create complementary color (opposite on color wheel)
    const newHue = (h + 180) % 360;
    return `${newHue} ${s}% ${l}%`;
  }

  private static deriveNeutralColor(primaryColor: string): string {
    const [h, s, l] = primaryColor.split(' ').map(v => parseFloat(v.replace('%', '')));
    // Create a neutral color with very low saturation
    return `${h} ${Math.min(s, 20)}% ${Math.min(l + 30, 85)}%`;
  }

  private static getContrastingForeground(backgroundColor: string): string {
    const [h, s, l] = backgroundColor.split(' ').map(v => parseFloat(v.replace('%', '')));
    // Simple contrast calculation - use white for dark colors, dark for light colors
    return l > 50 ? '222.2 84% 4.9%' : '210 40% 98%';
  }

  private static generateDarkTheme(lightColors: ThemeColors): ThemeColors {
    // Invert lightness values and adjust for dark mode
    const invertColor = (color: string): string => {
      const [h, s, l] = color.split(' ').map(v => parseFloat(v.replace('%', '')));
      const invertedL = 100 - l;
      return `${h} ${s}% ${invertedL}%`;
    };

    return {
      ...lightColors,
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
      border: '217.2 32.6% 17.5%',
      input: '217.2 32.6% 17.5%',
      ring: lightColors.primary.DEFAULT,
    };
  }

  private static enhanceContrast(colors: ThemeColors): ThemeColors {
    // Enhance contrast ratios for accessibility
    // This is a simplified implementation
    return {
      ...colors,
      mutedForeground: '215.4 16.3% 35%', // Darker for better contrast
    };
  }
}

// AI-friendly theme generation prompts
export const themeGenerationPrompts = {
  generateTheme: (description: string, primaryColor?: string) => `
Generate a theme based on this description: "${description}"

Requirements:
1. Create a cohesive color palette with primary, secondary, and accent colors
2. Ensure proper contrast ratios for accessibility (WCAG AA minimum)
3. Generate both light and dark mode variants
4. Use semantic color naming (primary, secondary, success, warning, error, info)
5. Include appropriate border radius and typography settings
6. Consider the use case and target audience

${primaryColor ? `Primary color preference: ${primaryColor}` : 'Choose an appropriate primary color based on the description'}

Provide the theme configuration in the following format:
- Theme name and display name
- Primary color (HSL format)
- Secondary color (HSL format)
- Accent color (HSL format)
- Border radius value
- Font family preferences
  `,

  customizeTheme: (baseTheme: string, modifications: string[]) => `
Customize the "${baseTheme}" theme with these modifications:
${modifications.map(mod => `- ${mod}`).join('\n')}

Requirements:
1. Maintain accessibility standards
2. Keep the overall design cohesive
3. Ensure both light and dark modes work well
4. Preserve semantic color relationships
5. Test contrast ratios for all color combinations

Provide the updated theme configuration with explanations for the changes.
  `,

  brandTheme: (brandInfo: string, brandColors: string[]) => `
Create a brand theme based on this information:
Brand: ${brandInfo}
Brand colors: ${brandColors.join(', ')}

Requirements:
1. Use the provided brand colors as the foundation
2. Create a complete color system that extends the brand palette
3. Ensure the theme reflects the brand personality
4. Maintain professional appearance and accessibility
5. Generate appropriate semantic colors (success, warning, error, info)
6. Create both light and dark variants that work with the brand

Provide a complete theme configuration that captures the brand essence.
  `,
} as const;

export type ThemeGenerationPrompts = typeof themeGenerationPrompts;