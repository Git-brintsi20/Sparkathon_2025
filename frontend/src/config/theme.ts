// Theme Configuration System
// Easy palette switching for the entire app

export type ThemeName = 'default' | 'corporate' | 'modern' | 'warm' | 'dark';

export interface ColorPalette {
  name: string;
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
    DEFAULT: string;
    foreground: string;
  };
  accent: {
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
    DEFAULT: string;
    foreground: string;
  };
  success: {
    50: string;
    500: string;
    700: string;
    DEFAULT: string;
    foreground: string;
  };
  warning: {
    50: string;
    500: string;
    700: string;
    DEFAULT: string;
    foreground: string;
  };
  error: {
    50: string;
    500: string;
    700: string;
    DEFAULT: string;
    foreground: string;
  };
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  chart: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}

export interface Typography {
  fontFamily: {
    sans: string[];
    mono: string[];
    display: string[];
  };
  fontSize: {
    xs: [string, { lineHeight: string }];
    sm: [string, { lineHeight: string }];
    base: [string, { lineHeight: string }];
    lg: [string, { lineHeight: string }];
    xl: [string, { lineHeight: string }];
    '2xl': [string, { lineHeight: string }];
    '3xl': [string, { lineHeight: string }];
    '4xl': [string, { lineHeight: string }];
    '5xl': [string, { lineHeight: string }];
    '6xl': [string, { lineHeight: string }];
  };
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface Animation {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

// Color Palettes
export const colorPalettes: Record<ThemeName, ColorPalette> = {
  default: {
    name: 'Default Blue',
    primary: {
      50: '239 246 255',
      100: '219 234 254',
      200: '191 219 254',
      300: '147 197 253',
      400: '96 165 250',
      500: '59 130 246',
      600: '37 99 235',
      700: '29 78 216',
      800: '30 64 175',
      900: '30 58 138',
      950: '23 37 84',
      DEFAULT: '59 130 246',
      foreground: '255 255 255',
    },
    secondary: {
      50: '248 250 252',
      100: '241 245 249',
      200: '226 232 240',
      300: '203 213 225',
      400: '148 163 184',
      500: '100 116 139',
      600: '71 85 105',
      700: '51 65 85',
      800: '30 41 59',
      900: '15 23 42',
      DEFAULT: '100 116 139',
      foreground: '255 255 255',
    },
    accent: {
      50: '240 253 250',
      100: '204 251 241',
      200: '153 246 228',
      300: '94 234 212',
      400: '45 212 191',
      500: '20 184 166',
      600: '13 148 136',
      700: '15 118 110',
      800: '17 94 89',
      900: '19 78 74',
      DEFAULT: '20 184 166',
      foreground: '255 255 255',
    },
    success: {
      50: '240 253 244',
      500: '34 197 94',
      700: '21 128 61',
      DEFAULT: '34 197 94',
      foreground: '255 255 255',
    },
    warning: {
      50: '255 251 235',
      500: '245 158 11',
      700: '180 83 9',
      DEFAULT: '245 158 11',
      foreground: '255 255 255',
    },
    error: {
      50: '254 242 242',
      500: '239 68 68',
      700: '185 28 28',
      DEFAULT: '239 68 68',
      foreground: '255 255 255',
    },
    background: '255 255 255',
    foreground: '9 9 11',
    card: '255 255 255',
    cardForeground: '9 9 11',
    popover: '255 255 255',
    popoverForeground: '9 9 11',
    muted: '244 244 245',
    mutedForeground: '113 113 122',
    border: '228 228 231',
    input: '228 228 231',
    ring: '59 130 246',
    chart: {
      1: '59 130 246',
      2: '20 184 166',
      3: '245 158 11',
      4: '239 68 68',
      5: '168 85 247',
    },
  },
  corporate: {
    name: 'Corporate Navy',
    primary: {
      50: '248 250 252',
      100: '241 245 249',
      200: '226 232 240',
      300: '203 213 225',
      400: '148 163 184',
      500: '30 58 138',
      600: '23 37 84',
      700: '30 41 59',
      800: '15 23 42',
      900: '2 6 23',
      950: '1 4 19',
      DEFAULT: '30 58 138',
      foreground: '255 255 255',
    },
    secondary: {
      50: '249 250 251',
      100: '243 244 246',
      200: '229 231 235',
      300: '209 213 219',
      400: '156 163 175',
      500: '107 114 128',
      600: '75 85 99',
      700: '55 65 81',
      800: '31 41 55',
      900: '17 24 39',
      DEFAULT: '107 114 128',
      foreground: '255 255 255',
    },
    accent: {
      50: '236 254 255',
      100: '207 250 254',
      200: '165 243 252',
      300: '103 232 249',
      400: '34 211 238',
      500: '6 182 212',
      600: '8 145 178',
      700: '14 116 144',
      800: '21 94 117',
      900: '22 78 99',
      DEFAULT: '6 182 212',
      foreground: '255 255 255',
    },
    success: {
      50: '240 253 244',
      500: '34 197 94',
      700: '21 128 61',
      DEFAULT: '34 197 94',
      foreground: '255 255 255',
    },
    warning: {
      50: '255 251 235',
      500: '245 158 11',
      700: '180 83 9',
      DEFAULT: '245 158 11',
      foreground: '255 255 255',
    },
    error: {
      50: '254 242 242',
      500: '239 68 68',
      700: '185 28 28',
      DEFAULT: '239 68 68',
      foreground: '255 255 255',
    },
    background: '255 255 255',
    foreground: '15 23 42',
    card: '255 255 255',
    cardForeground: '15 23 42',
    popover: '255 255 255',
    popoverForeground: '15 23 42',
    muted: '248 250 252',
    mutedForeground: '100 116 139',
    border: '226 232 240',
    input: '226 232 240',
    ring: '30 58 138',
    chart: {
      1: '30 58 138',
      2: '6 182 212',
      3: '245 158 11',
      4: '239 68 68',
      5: '107 114 128',
    },
  },
  modern: {
    name: 'Modern Purple',
    primary: {
      50: '250 245 255',
      100: '243 232 255',
      200: '233 213 255',
      300: '196 181 253',
      400: '168 85 247',
      500: '147 51 234',
      600: '126 34 206',
      700: '107 33 168',
      800: '88 28 135',
      900: '74 29 115',
      950: '49 46 129',
      DEFAULT: '147 51 234',
      foreground: '255 255 255',
    },
    secondary: {
      50: '250 250 250',
      100: '245 245 245',
      200: '229 229 229',
      300: '212 212 212',
      400: '163 163 163',
      500: '115 115 115',
      600: '82 82 82',
      700: '64 64 64',
      800: '38 38 38',
      900: '23 23 23',
      DEFAULT: '115 115 115',
      foreground: '255 255 255',
    },
    accent: {
      50: '255 247 237',
      100: '255 237 213',
      200: '254 215 170',
      300: '253 186 116',
      400: '251 146 60',
      500: '249 115 22',
      600: '234 88 12',
      700: '194 65 12',
      800: '154 52 18',
      900: '124 45 18',
      DEFAULT: '249 115 22',
      foreground: '255 255 255',
    },
    success: {
      50: '240 253 244',
      500: '34 197 94',
      700: '21 128 61',
      DEFAULT: '34 197 94',
      foreground: '255 255 255',
    },
    warning: {
      50: '255 251 235',
      500: '245 158 11',
      700: '180 83 9',
      DEFAULT: '245 158 11',
      foreground: '255 255 255',
    },
    error: {
      50: '254 242 242',
      500: '239 68 68',
      700: '185 28 28',
      DEFAULT: '239 68 68',
      foreground: '255 255 255',
    },
    background: '255 255 255',
    foreground: '23 23 23',
    card: '255 255 255',
    cardForeground: '23 23 23',
    popover: '255 255 255',
    popoverForeground: '23 23 23',
    muted: '250 250 250',
    mutedForeground: '115 115 115',
    border: '229 229 229',
    input: '229 229 229',
    ring: '147 51 234',
    chart: {
      1: '147 51 234',
      2: '249 115 22',
      3: '245 158 11',
      4: '239 68 68',
      5: '34 197 94',
    },
  },
  warm: {
    name: 'Warm Earth',
    primary: {
      50: '254 252 232',
      100: '254 249 195',
      200: '254 240 138',
      300: '253 224 71',
      400: '250 204 21',
      500: '234 179 8',
      600: '202 138 4',
      700: '161 98 7',
      800: '133 77 14',
      900: '113 63 18',
      950: '66 32 6',
      DEFAULT: '234 179 8',
      foreground: '255 255 255',
    },
    secondary: {
      50: '254 252 232',
      100: '254 249 195',
      200: '254 240 138',
      300: '253 224 71',
      400: '250 204 21',
      500: '234 179 8',
      600: '202 138 4',
      700: '161 98 7',
      800: '133 77 14',
      900: '113 63 18',
      DEFAULT: '202 138 4',
      foreground: '255 255 255',
    },
    accent: {
      50: '255 247 237',
      100: '255 237 213',
      200: '254 215 170',
      300: '253 186 116',
      400: '251 146 60',
      500: '249 115 22',
      600: '234 88 12',
      700: '194 65 12',
      800: '154 52 18',
      900: '124 45 18',
      DEFAULT: '249 115 22',
      foreground: '255 255 255',
    },
    success: {
      50: '240 253 244',
      500: '34 197 94',
      700: '21 128 61',
      DEFAULT: '34 197 94',
      foreground: '255 255 255',
    },
    warning: {
      50: '255 251 235',
      500: '245 158 11',
      700: '180 83 9',
      DEFAULT: '245 158 11',
      foreground: '255 255 255',
    },
    error: {
      50: '254 242 242',
      500: '239 68 68',
      700: '185 28 28',
      DEFAULT: '239 68 68',
      foreground: '255 255 255',
    },
    background: '255 255 255',
    foreground: '124 45 18',
    card: '255 255 255',
    cardForeground: '124 45 18',
    popover: '255 255 255',
    popoverForeground: '124 45 18',
    muted: '254 252 232',
    mutedForeground: '161 98 7',
    border: '254 240 138',
    input: '254 240 138',
    ring: '234 179 8',
    chart: {
      1: '234 179 8',
      2: '249 115 22',
      3: '245 158 11',
      4: '239 68 68',
      5: '34 197 94',
    },
  },
  dark: {
    name: 'Dark Mode',
    primary: {
      50: '23 37 84',
      100: '30 58 138',
      200: '37 99 235',
      300: '59 130 246',
      400: '96 165 250',
      500: '147 197 253',
      600: '191 219 254',
      700: '219 234 254',
      800: '239 246 255',
      900: '248 250 252',
      950: '255 255 255',
      DEFAULT: '147 197 253',
      foreground: '2 6 23',
    },
    secondary: {
      50: '2 6 23',
      100: '15 23 42',
      200: '30 41 59',
      300: '51 65 85',
      400: '71 85 105',
      500: '100 116 139',
      600: '148 163 184',
      700: '203 213 225',
      800: '226 232 240',
      900: '241 245 249',
      DEFAULT: '100 116 139',
      foreground: '241 245 249',
    },
    accent: {
      50: '19 78 74',
      100: '17 94 89',
      200: '15 118 110',
      300: '13 148 136',
      400: '20 184 166',
      500: '45 212 191',
      600: '94 234 212',
      700: '153 246 228',
      800: '204 251 241',
      900: '240 253 250',
      DEFAULT: '45 212 191',
      foreground: '2 6 23',
    },
    success: {
      50: '21 128 61',
      500: '34 197 94',
      700: '74 222 128',
      DEFAULT: '34 197 94',
      foreground: '2 6 23',
    },
    warning: {
      50: '180 83 9',
      500: '245 158 11',
      700: '252 211 77',
      DEFAULT: '245 158 11',
      foreground: '2 6 23',
    },
    error: {
      50: '185 28 28',
      500: '239 68 68',
      700: '248 113 113',
      DEFAULT: '239 68 68',
      foreground: '2 6 23',
    },
    background: '2 6 23',
    foreground: '248 250 252',
    card: '15 23 42',
    cardForeground: '248 250 252',
    popover: '15 23 42',
    popoverForeground: '248 250 252',
    muted: '30 41 59',
    mutedForeground: '148 163 184',
    border: '51 65 85',
    input: '51 65 85',
    ring: '147 197 253',
    chart: {
      1: '147 197 253',
      2: '45 212 191',
      3: '245 158 11',
      4: '239 68 68',
      5: '168 85 247',
    },
  },
};

// Typography Configuration
export const typography: Typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
    display: ['Poppins', 'system-ui', 'sans-serif'],
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
};

// Spacing Configuration
export const spacing: Spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem',
  '3xl': '6rem',
  '4xl': '8rem',
  '5xl': '10rem',
  '6xl': '12rem',
};

// Animation Configuration
export const animation: Animation = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.6s',
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Theme switching utility
export const applyTheme = (themeName: ThemeName) => {
  const palette = colorPalettes[themeName];
  const root = document.documentElement;
  
  // Apply all color variables
  Object.entries(palette).forEach(([key, value]) => {
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
  
  // Store current theme
  localStorage.setItem('theme', themeName);
};

// Get current theme
export const getCurrentTheme = (): ThemeName => {
  const stored = localStorage.getItem('theme') as ThemeName;
  return stored && colorPalettes[stored] ? stored : 'default';
};

// Initialize theme
export const initializeTheme = () => {
  const theme = getCurrentTheme();
  applyTheme(theme);
  return theme;
};