import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  ThemeName, 
  ColorPalette, 
  colorPalettes, 
  applyTheme, 
  getCurrentTheme, 
  initializeTheme 
} from '../config/theme';

interface ThemeState {
  currentTheme: ThemeName;
  isDark: boolean;
  palette: ColorPalette;
  isLoading: boolean;
}

interface ThemeContextValue {
  state: ThemeState;
  setTheme: (theme: ThemeName) => void;
  toggleDarkMode: () => void;
  getAvailableThemes: () => { name: ThemeName; displayName: string }[];
  resetTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

type ThemeAction =
  | { type: 'SET_THEME'; payload: ThemeName }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INITIALIZE_THEME'; payload: ThemeName };

const initialState: ThemeState = {
  currentTheme: 'default',
  isDark: false,
  palette: colorPalettes.default,
  isLoading: true,
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        palette: colorPalettes[action.payload],
        isDark: action.payload === 'dark',
        isLoading: false,
      };
    case 'TOGGLE_DARK_MODE':
      const newTheme = state.isDark ? 'default' : 'dark';
      return {
        ...state,
        currentTheme: newTheme,
        palette: colorPalettes[newTheme],
        isDark: !state.isDark,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'INITIALIZE_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        palette: colorPalettes[action.payload],
        isDark: action.payload === 'dark',
        isLoading: false,
      };
    default:
      return state;
  }
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'default' 
}) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  const setTheme = (theme: ThemeName): void => {
    try {
      applyTheme(theme);
      dispatch({ type: 'SET_THEME', payload: theme });
      
      // Store theme preference
      localStorage.setItem('theme', theme);
      
      // Update body class for dark mode
      if (theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  const toggleDarkMode = (): void => {
    const newTheme = state.isDark ? 'default' : 'dark';
    setTheme(newTheme);
  };

  const getAvailableThemes = (): { name: ThemeName; displayName: string }[] => {
    return Object.entries(colorPalettes).map(([name, palette]) => ({
      name: name as ThemeName,
      displayName: palette.name,
    }));
  };

  const resetTheme = (): void => {
    setTheme(defaultTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const savedTheme = getCurrentTheme();
      const themeToUse = savedTheme || defaultTheme;
      
      initializeTheme();
      dispatch({ type: 'INITIALIZE_THEME', payload: themeToUse });
      
      // Set initial body class
      if (themeToUse === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      dispatch({ type: 'INITIALIZE_THEME', payload: defaultTheme });
    }
  }, [defaultTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if no manual theme preference is stored
      const storedTheme = localStorage.getItem('theme');
      if (!storedTheme) {
        const systemTheme = e.matches ? 'dark' : 'default';
        setTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Update CSS custom properties when theme changes
  useEffect(() => {
    if (state.palette) {
      const root = document.documentElement;
      
      // Apply color variables
      Object.entries(state.palette).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (typeof subValue === 'string') {
              root.style.setProperty(`--${key}-${subKey}`, subValue);
            }
          });
        } else if (typeof value === 'string') {
          root.style.setProperty(`--${key}`, value);
        }
      });
    }
  }, [state.palette]);

  const value: ThemeContextValue = {
    state,
    setTheme,
    toggleDarkMode,
    getAvailableThemes,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for getting current theme colors
export const useThemeColors = () => {
  const { state } = useTheme();
  
  const getColor = (colorKey: string): string => {
    const keys = colorKey.split('.');
    let value: any = state.palette;
    
    for (const key of keys) {
      value = value?.[key];
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
  
  return {
    palette: state.palette,
    getColor,
    getPrimaryColor,
    getSecondaryColor,
    getAccentColor,
    isDark: state.isDark,
    currentTheme: state.currentTheme,
  };
};

// Hook for theme-aware CSS classes
export const useThemeClasses = () => {
  const { state } = useTheme();
  
  const getCardClass = (): string => {
    return state.isDark 
      ? 'bg-card border-border text-card-foreground' 
      : 'bg-card border-border text-card-foreground';
  };
  
  const getButtonClass = (variant: 'primary' | 'secondary' | 'accent' = 'primary'): string => {
    const baseClass = 'transition-colors duration-200 font-medium rounded-lg px-4 py-2';
    
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
    return 'bg-background border-input text-foreground placeholder:text-muted-foreground';
  };
  
  return {
    getCardClass,
    getButtonClass,
    getInputClass,
    isDark: state.isDark,
  };
};

// Higher-order component for theme-aware components
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};