import type { Config } from 'tailwindcss'
// CORRECTED: Import the plugins using ES Module syntax
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssForms from '@tailwindcss/forms'
import tailwindcssTypography from '@tailwindcss/typography'

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Professional Navy/Blue Color Scheme matching globals.css
      colors: {
        primary: { 
          50: "rgb(var(--primary-50))", 
          100: "rgb(var(--primary-100))", 
          200: "rgb(var(--primary-200))", 
          300: "rgb(var(--primary-300))", 
          400: "rgb(var(--primary-400))", 
          500: "rgb(var(--primary-500))", 
          600: "rgb(var(--primary-600))", 
          700: "rgb(var(--primary-700))", 
          800: "rgb(var(--primary-800))", 
          900: "rgb(var(--primary-900))", 
          950: "rgb(var(--primary-950))", 
          DEFAULT: "rgb(var(--primary))", 
          foreground: "rgb(var(--primary-foreground))", 
        },
        secondary: { 
          50: "rgb(var(--secondary-50))", 
          100: "rgb(var(--secondary-100))", 
          200: "rgb(var(--secondary-200))", 
          300: "rgb(var(--secondary-300))", 
          400: "rgb(var(--secondary-400))", 
          500: "rgb(var(--secondary-500))", 
          600: "rgb(var(--secondary-600))", 
          700: "rgb(var(--secondary-700))", 
          800: "rgb(var(--secondary-800))", 
          900: "rgb(var(--secondary-900))", 
          950: "rgb(var(--secondary-950))", 
          DEFAULT: "rgb(var(--secondary))", 
          foreground: "rgb(var(--secondary-foreground))", 
        },
        accent: { 
          50: "rgb(var(--accent-50))", 
          100: "rgb(var(--accent-100))", 
          200: "rgb(var(--accent-200))", 
          300: "rgb(var(--accent-300))", 
          400: "rgb(var(--accent-400))", 
          500: "rgb(var(--accent-500))", 
          600: "rgb(var(--accent-600))", 
          700: "rgb(var(--accent-700))", 
          800: "rgb(var(--accent-800))", 
          900: "rgb(var(--accent-900))", 
          DEFAULT: "rgb(var(--accent))", 
          foreground: "rgb(var(--accent-foreground))", 
        },
        success: { 
          50: "rgb(var(--success-50))", 
          100: "rgb(var(--success-100))", 
          200: "rgb(var(--success-200))", 
          300: "rgb(var(--success-300))", 
          400: "rgb(var(--success-400))", 
          500: "rgb(var(--success-500))", 
          600: "rgb(var(--success-600))", 
          700: "rgb(var(--success-700))", 
          800: "rgb(var(--success-800))", 
          900: "rgb(var(--success-900))", 
          DEFAULT: "rgb(var(--success))", 
          foreground: "rgb(var(--success-foreground))", 
        },
        warning: { 
          50: "rgb(var(--warning-50))", 
          100: "rgb(var(--warning-100))", 
          200: "rgb(var(--warning-200))", 
          300: "rgb(var(--warning-300))", 
          400: "rgb(var(--warning-400))", 
          500: "rgb(var(--warning-500))", 
          600: "rgb(var(--warning-600))", 
          700: "rgb(var(--warning-700))", 
          800: "rgb(var(--warning-800))", 
          900: "rgb(var(--warning-900))", 
          DEFAULT: "rgb(var(--warning))", 
          foreground: "rgb(var(--warning-foreground))", 
        },
        error: { 
          50: "rgb(var(--error-50))", 
          100: "rgb(var(--error-100))", 
          200: "rgb(var(--error-200))", 
          300: "rgb(var(--error-300))", 
          400: "rgb(var(--error-400))", 
          500: "rgb(var(--error-500))", 
          600: "rgb(var(--error-600))", 
          700: "rgb(var(--error-700))", 
          800: "rgb(var(--error-800))", 
          900: "rgb(var(--error-900))", 
          DEFAULT: "rgb(var(--error))", 
          foreground: "rgb(var(--error-foreground))", 
        },
        background: "rgb(var(--background))",
        "background-secondary": "rgb(var(--background-secondary))",
        foreground: "rgb(var(--foreground))",
        card: { 
          DEFAULT: "rgb(var(--card))", 
          secondary: "rgb(var(--card-secondary))",
          foreground: "rgb(var(--card-foreground))" 
        },
        popover: { 
          DEFAULT: "rgb(var(--popover))", 
          foreground: "rgb(var(--popover-foreground))" 
        },
        muted: { 
          DEFAULT: "rgb(var(--muted))", 
          foreground: "rgb(var(--muted-foreground))" 
        },
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        chart: { 
          1: "rgb(var(--chart-1))", 
          2: "rgb(var(--chart-2))", 
          3: "rgb(var(--chart-3))", 
          4: "rgb(var(--chart-4))", 
          5: "rgb(var(--chart-5))",
          6: "rgb(var(--chart-6))" 
        },
      },
      fontFamily: { 
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'], 
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'], 
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'], 
      },
      fontSize: { 
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }], 
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }], 
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.0125em' }], 
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.0125em' }], 
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0.0125em' }], 
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.0125em' }], 
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '0.0125em' }], 
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '0.0125em' }], 
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.0125em' }], 
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '0.0125em' }], 
      },
      spacing: { 
        '18': '4.5rem', 
        '88': '22rem', 
        '128': '32rem', 
        '144': '36rem' 
      },
      // Enhanced smooth animations for gliding effects
      animation: { 
        // Smooth gliding entrance animations
        'slide-in-up': 'slideInUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        'slide-in-down': 'slideInDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        'fade-in': 'fadeIn 0.6s ease-out', 
        'fade-in-fast': 'fadeIn 0.3s ease-out', 
        'fade-out': 'fadeOut 0.3s ease-out', 
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        'scale-out': 'scaleOut 0.3s ease-out', 
        
        // Continuous smooth animations
        'float': 'float 3s ease-in-out infinite', 
        'glow': 'glow 2s ease-in-out infinite alternate', 
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite', 
        'shimmer': 'shimmer 2s ease-in-out infinite', 
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out', 
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', 
        'spin-slow': 'spin 3s linear infinite', 
        
        // Hover and interaction animations
        'hover-lift': 'hoverLift 0.2s ease-out', 
        'hover-scale': 'hoverScale 0.2s ease-out', 
        'hover-glow': 'hoverGlow 0.2s ease-out', 
      },
      keyframes: { 
        // Smooth gliding entrance keyframes
        slideInUp: { 
          '0%': { transform: 'translateY(20px)', opacity: '0' }, 
          '100%': { transform: 'translateY(0)', opacity: '1' }, 
        }, 
        slideInDown: { 
          '0%': { transform: 'translateY(-20px)', opacity: '0' }, 
          '100%': { transform: 'translateY(0)', opacity: '1' }, 
        }, 
        slideInLeft: { 
          '0%': { transform: 'translateX(-20px)', opacity: '0' }, 
          '100%': { transform: 'translateX(0)', opacity: '1' }, 
        }, 
        slideInRight: { 
          '0%': { transform: 'translateX(20px)', opacity: '0' }, 
          '100%': { transform: 'translateX(0)', opacity: '1' }, 
        }, 
        fadeIn: { 
          '0%': { opacity: '0' }, 
          '100%': { opacity: '1' }, 
        }, 
        fadeOut: { 
          '0%': { opacity: '1' }, 
          '100%': { opacity: '0' }, 
        }, 
        scaleIn: { 
          '0%': { transform: 'scale(0.9)', opacity: '0' }, 
          '100%': { transform: 'scale(1)', opacity: '1' }, 
        }, 
        scaleOut: { 
          '0%': { transform: 'scale(1)', opacity: '1' }, 
          '100%': { transform: 'scale(0.9)', opacity: '0' }, 
        }, 
        
        // Continuous smooth animations
        float: { 
          '0%, 100%': { transform: 'translateY(0px)' }, 
          '50%': { transform: 'translateY(-10px)' }, 
        }, 
        glow: { 
          '0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.2)' }, 
          '100%': { boxShadow: '0 0 30px rgba(14, 165, 233, 0.4)' }, 
        }, 
        pulseGlow: { 
          '0%, 100%': { boxShadow: '0 0 15px rgba(14, 165, 233, 0.3)' }, 
          '50%': { boxShadow: '0 0 25px rgba(14, 165, 233, 0.6)' }, 
        }, 
        shimmer: { 
          '0%': { backgroundPosition: '-200% 0' }, 
          '100%': { backgroundPosition: '200% 0' }, 
        }, 
        bounceGentle: { 
          '0%, 100%': { transform: 'translateY(0)' }, 
          '50%': { transform: 'translateY(-10px)' }, 
        }, 
        
        // Hover and interaction animations
        hoverLift: { 
          '0%': { transform: 'translateY(0)' }, 
          '100%': { transform: 'translateY(-4px)' }, 
        }, 
        hoverScale: { 
          '0%': { transform: 'scale(1)' }, 
          '100%': { transform: 'scale(1.05)' }, 
        }, 
        hoverGlow: { 
          '0%': { boxShadow: '0 0 0 rgba(14, 165, 233, 0)' }, 
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' }, 
        }, 
      },
      borderRadius: { 
        'xl': '1rem', 
        '2xl': '1.5rem', 
        '3xl': '2rem' 
      },
      boxShadow: { 
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)', 
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)', 
        'hard': '0 10px 50px -12px rgba(0, 0, 0, 0.25)', 
        'glow': '0 0 20px rgba(14, 165, 233, 0.3)', 
        'glow-accent': '0 0 20px rgba(20, 184, 166, 0.3)', 
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)', 
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)', 
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)', 
      },
      backdropBlur: { 
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
      gridTemplateColumns: { 
        'sidebar': '280px 1fr', 
        'sidebar-collapsed': '80px 1fr', 
        'dashboard': 'repeat(auto-fit, minmax(300px, 1fr))', 
        'metrics': 'repeat(auto-fit, minmax(250px, 1fr))', 
        'cards': 'repeat(auto-fill, minmax(320px, 1fr))', 
      },
      zIndex: { 
        modal: '1000', 
        dropdown: '1000', 
        tooltip: '1001', 
        notification: '1002', 
        overlay:' 999',
        sidebar: '100',
        header: '101',
      },
      // Enhanced transitions matching globals.css
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'glass': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        'micro': '0.1s',
        'fast': '0.2s',
        'normal': '0.3s',
        'slow': '0.5s',
        'spring': '0.4s',
        'bounce': '0.6s',
      },
      // Custom gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, rgb(14, 165, 233), rgb(3, 105, 161))',
        'gradient-secondary': 'linear-gradient(135deg, rgb(51, 65, 85), rgb(30, 41, 59))',
        'gradient-accent': 'linear-gradient(135deg, rgb(20, 184, 166), rgb(13, 148, 136))',
        'gradient-success': 'linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'shimmer': 'linear-gradient(110deg, rgba(148, 163, 184, 0.5) 45%, rgba(15, 23, 42, 1) 55%)',
      },
      // Custom blur utilities
      blur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssForms,
    tailwindcssTypography,
    // Custom plugin for additional utilities
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        '.glass-effect': {
          'backdrop-filter': 'blur(8px)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-card': {
          'backdrop-filter': 'blur(12px)',
          'background': 'rgba(255, 255, 255, 0.08)',
          'border': '1px solid rgba(255, 255, 255, 0.15)',
        },
        '.hover-lift': {
          'transition': 'transform 0.2s ease-out',
          '&:hover': {
            'transform': 'translateY(-4px)',
          },
        },
        '.hover-glow': {
          'transition': 'all 0.2s ease-out',
          '&:hover': {
            'box-shadow': '0 0 20px rgba(14, 165, 233, 0.3)',
          },
        },
        '.hover-scale': {
          'transition': 'transform 0.2s ease-out',
          '&:hover': {
            'transform': 'scale(1.05)',
          },
        },
      });
    },
  ],
} satisfies Config