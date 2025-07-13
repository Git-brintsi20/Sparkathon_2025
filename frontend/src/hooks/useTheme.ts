import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import type { ThemeName, ColorPalette } from '../config/theme';

interface UseThemeReturn {
  // Current theme state
  currentTheme: ThemeName;
  isDark: boolean;
  palette: ColorPalette;
  isLoading: boolean;
  
  // Theme actions
  setTheme: (theme: ThemeName) => void;
  toggleDarkMode: () => void;
  resetTheme: () => void;
  
  // Helper functions
  getAvailableThemes: () => { name: ThemeName; displayName: string }[];
  getColor: (colorKey: string) => string;
  getPrimaryColor: (shade?: string) => string;
  getSecondaryColor: (shade?: string) => string;
  getAccentColor: (shade?: string) => string;
  
  // CSS class helpers
  getCardClass: () => string;
  getButtonClass: (variant?: 'primary' | 'secondary' | 'accent') => string;
  getInputClass: () => string;
  getBadgeClass: (variant?: 'success' | 'warning' | 'error' | 'info') => string;
}

export const useTheme = (): UseThemeReturn => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  const { state, setTheme, toggleDarkMode, getAvailableThemes, resetTheme } = context;
  
  // Color helper functions
  const getColor = (colorKey: string): string => {
    const keys = colorKey.split('.');
    let value: any = state.palette;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    
    return typeof value === 'string' ? `rgb(${value})` : '';
  };
  
  const getPrimaryColor = (shade: string = 'DEFAULT'): string => {
    return getColor(`primary.${shade}`);
  };
  
  const getSecondaryColor = (shade: string = 'DEFAULT'): string => {
    return getColor(`secondary.${shade}`);
  };
  
  const getAccentColor = (shade: string = 'DEFAULT'): string => {
    return getColor(`accent.${shade}`);
  };
  
  // CSS class helpers
  const getCardClass = (): string => {
    return 'bg-card border-border text-card-foreground shadow-sm rounded-lg';
  };
  
  const getButtonClass = (variant: 'primary' | 'secondary' | 'accent' = 'primary'): string => {
    const baseClass = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    switch (variant) {
      case 'primary':
        return `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`;
      case 'secondary':
        return `${baseClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
      case 'accent':
        return `${baseClass} bg-accent text-accent-foreground hover:bg-accent/90`;
      default:
        return `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`;
    }
  };
  
  const getInputClass = (): string => {
    return 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  };
  
  const getBadgeClass = (variant: 'success' | 'warning' | 'error' | 'info' = 'info'): string => {
    const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
    
    switch (variant) {
      case 'success':
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'warning':
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'error':
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      case 'info':
        return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`;
    }
  };
  
  return {
    // Current theme state
    currentTheme: state.currentTheme,
    isDark: state.isDark,
    palette: state.palette,
    isLoading: state.isLoading,
    
    // Theme actions
    setTheme,
    toggleDarkMode,
    resetTheme,
    
    // Helper functions
    getAvailableThemes,
    getColor,
    getPrimaryColor,
    getSecondaryColor,
    getAccentColor,
    
    // CSS class helpers
    getCardClass,
    getButtonClass,
    getInputClass,
    getBadgeClass,
  };
};

// Hook for theme-aware animations
export const useThemeAnimations = () => {
  const { isDark } = useTheme();
  
  const getTransitionClass = (duration: 'fast' | 'normal' | 'slow' = 'normal'): string => {
    switch (duration) {
      case 'fast':
        return 'transition-all duration-150 ease-in-out';
      case 'slow':
        return 'transition-all duration-500 ease-in-out';
      default:
        return 'transition-all duration-300 ease-in-out';
    }
  };
  
  const getHoverClass = (): string => {
    return 'hover:scale-105 active:scale-95 transition-transform duration-150';
  };
  
  const getFadeInClass = (): string => {
    return 'animate-fadeIn opacity-0';
  };
  
  const getSlideInClass = (direction: 'left' | 'right' | 'up' | 'down' = 'left'): string => {
    const baseClass = 'animate-slideIn';
    return `${baseClass} ${baseClass}-${direction}`;
  };
  
  return {
    getTransitionClass,
    getHoverClass,
    getFadeInClass,
    getSlideInClass,
    isDark,
  };
};

// Hook for responsive theme utilities
export const useResponsiveTheme = () => {
  const theme = useTheme();
  
  const getResponsiveCardClass = (): string => {
    return `${theme.getCardClass()} p-4 md:p-6 lg:p-8`;
  };
  
  const getResponsiveButtonClass = (variant?: 'primary' | 'secondary' | 'accent'): string => {
    return `${theme.getButtonClass(variant)} px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3`;
  };
  
  const getResponsiveTextClass = (size: 'sm' | 'base' | 'lg' | 'xl' = 'base'): string => {
    const sizeClasses = {
      sm: 'text-sm md:text-base',
      base: 'text-base md:text-lg',
      lg: 'text-lg md:text-xl',
      xl: 'text-xl md:text-2xl lg:text-3xl',
    };
    
    return `${sizeClasses[size]} text-foreground`;
  };
  
  return {
    ...theme,
    getResponsiveCardClass,
    getResponsiveButtonClass,
    getResponsiveTextClass,
  };
};