/**
 * Theme Provider Component
 * Provides theme context and management for the application
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, ThemeManager, themePresets } from '@/lib/theme-system';

interface ThemeContextType {
  theme: ThemeConfig;
  isDark: boolean;
  setTheme: (themeName: string) => void;
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
  availableThemes: ThemeConfig[];
  themeManager: ThemeManager;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultMode?: 'light' | 'dark' | 'system';
}

export function ThemeProvider({
  children,
  defaultTheme = 'default',
  defaultMode = 'system',
}: ThemeProviderProps) {
  const [themeManager] = useState(() => new ThemeManager());
  const [theme, setThemeState] = useState(themeManager.getCurrentTheme());
  const [isDark, setIsDarkState] = useState(themeManager.isDark());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize theme based on props
    if (defaultTheme !== 'default') {
      themeManager.setTheme(defaultTheme);
      setThemeState(themeManager.getCurrentTheme());
    }

    // Initialize dark mode based on props
    if (defaultMode !== 'system') {
      themeManager.setDarkMode(defaultMode === 'dark');
      setIsDarkState(themeManager.isDark());
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme-mode') === null) {
        themeManager.setDarkMode(e.matches);
        setIsDarkState(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeManager, defaultTheme, defaultMode]);

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

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    setDarkMode,
    toggleDarkMode,
    availableThemes: Object.values(themePresets),
    themeManager,
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme selector component
export function ThemeSelector() {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <select
      value={theme.name}
      onChange={(e) => setTheme(e.target.value)}
      className="ai-input w-auto"
    >
      {availableThemes.map((t) => (
        <option key={t.name} value={t.name}>
          {t.displayName}
        </option>
      ))}
    </select>
  );
}

// Dark mode toggle component
export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="ai-button-ghost p-2"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

// Theme customizer component
export function ThemeCustomizer() {
  const { theme, themeManager } = useTheme();
  const [customTheme, setCustomTheme] = useState(theme);

  const handleColorChange = (
    colorKey: string,
    value: string,
    mode: 'light' | 'dark' = 'light'
  ) => {
    setCustomTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [mode]: {
          ...prev.colors[mode],
          [colorKey]: value,
        },
      },
    }));
  };

  const applyCustomTheme = () => {
    const newTheme = themeManager.createCustomTheme(
      'custom',
      'Custom',
      theme,
      customTheme
    );
    themeManager.setTheme('custom');
  };

  return (
    <div className="ai-spacing-content">
      <h3 className="ai-text-heading">Theme Customizer</h3>
      
      <div className="ai-spacing-compact">
        <label className="text-sm font-medium">Primary Color</label>
        <input
          type="color"
          value={`hsl(${customTheme.colors.light.primary.DEFAULT})`}
          onChange={(e) => handleColorChange('primary', e.target.value)}
          className="w-full h-10 rounded border"
        />
      </div>

      <div className="ai-spacing-compact">
        <label className="text-sm font-medium">Border Radius</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={parseFloat(customTheme.radius)}
          onChange={(e) =>
            setCustomTheme((prev) => ({
              ...prev,
              radius: `${e.target.value}rem`,
            }))
          }
          className="w-full"
        />
        <span className="text-xs text-muted-foreground">
          {customTheme.radius}
        </span>
      </div>

      <button
        onClick={applyCustomTheme}
        className="ai-button-primary"
      >
        Apply Custom Theme
      </button>
    </div>
  );
}