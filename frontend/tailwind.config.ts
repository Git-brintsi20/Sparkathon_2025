import type { Config } from 'tailwindcss'
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
      // Professional Color Scheme matching globals.css
      colors: {
        primary: {
          50: "rgb(240, 244, 255)",
          100: "rgb(230, 237, 255)",
          200: "rgb(212, 225, 255)",
          300: "rgb(102, 126, 234)",
          400: "rgb(90, 111, 209)",
          500: "rgb(79, 99, 199)",
          600: "rgb(67, 86, 189)",
          700: "rgb(56, 73, 179)",
          800: "rgb(44, 59, 169)",
          900: "rgb(31, 46, 159)",
          950: "rgb(25, 37, 127)",
          DEFAULT: "rgb(102, 126, 234)",
          foreground: "rgb(255, 255, 255)",
        },
        secondary: {
          50: "rgb(250, 247, 255)",
          100: "rgb(245, 240, 255)",
          200: "rgb(237, 228, 255)",
          300: "rgb(118, 75, 162)",
          400: "rgb(138, 95, 181)",
          500: "rgb(158, 115, 200)",
          600: "rgb(178, 135, 219)",
          700: "rgb(198, 155, 238)",
          800: "rgb(218, 175, 241)",
          900: "rgb(238, 195, 244)",
          DEFAULT: "rgb(118, 75, 162)",
          foreground: "rgb(255, 255, 255)",
        },
        success: {
          50: "rgb(232, 245, 232)",
          100: "rgb(209, 235, 209)",
          200: "rgb(163, 215, 163)",
          300: "rgb(117, 195, 117)",
          400: "rgb(76, 175, 80)",
          500: "rgb(69, 160, 73)",
          600: "rgb(61, 139, 64)",
          700: "rgb(53, 122, 55)",
          800: "rgb(45, 105, 46)",
          900: "rgb(37, 88, 37)",
          DEFAULT: "rgb(76, 175, 80)",
          foreground: "rgb(255, 255, 255)",
        },
        warning: {
          50: "rgb(255, 243, 224)",
          100: "rgb(255, 231, 194)",
          200: "rgb(255, 219, 159)",
          300: "rgb(255, 207, 124)",
          400: "rgb(255, 195, 89)",
          500: "rgb(255, 152, 0)",
          600: "rgb(245, 124, 0)",
          700: "rgb(239, 108, 0)",
          800: "rgb(230, 81, 0)",
          900: "rgb(191, 54, 12)",
          DEFAULT: "rgb(255, 152, 0)",
          foreground: "rgb(255, 255, 255)",
        },
        error: {
          50: "rgb(255, 235, 238)",
          100: "rgb(255, 205, 210)",
          200: "rgb(239, 154, 154)",
          300: "rgb(229, 115, 115)",
          400: "rgb(239, 83, 80)",
          500: "rgb(244, 67, 54)",
          600: "rgb(229, 57, 53)",
          700: "rgb(211, 47, 47)",
          800: "rgb(198, 40, 40)",
          900: "rgb(183, 28, 28)",
          DEFAULT: "rgb(244, 67, 54)",
          foreground: "rgb(255, 255, 255)",
        },
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        chart: {
          1: "rgb(102, 126, 234)",
          2: "rgb(118, 75, 162)",
          3: "rgb(76, 175, 80)",
          4: "rgb(255, 152, 0)",
          5: "rgb(244, 67, 54)",
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
      // Smooth gliding animations
      animation: {
        'slide-in-up': 'slideInUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-in-down': 'slideInDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-fast': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'hover-lift': 'hoverLift 0.2s ease-out',
        'hover-glow': 'hoverGlow 0.2s ease-out',
      },
      keyframes: {
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
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(102, 126, 234, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(102, 126, 234, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        hoverGlow: {
          '0%': { boxShadow: '0 0 0 rgba(102, 126, 234, 0)' },
          '100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)' },
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-secondary': '0 0 20px rgba(118, 75, 162, 0.3)',
        'glow-success': '0 0 20px rgba(76, 175, 80, 0.3)',
        'glow-warning': '0 0 20px rgba(255, 152, 0, 0.3)',
        'glow-error': '0 0 20px rgba(244, 67, 54, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
        'gradient-success': 'linear-gradient(135deg, rgb(76, 175, 80), rgb(69, 160, 73))',
        'gradient-warning': 'linear-gradient(135deg, rgb(255, 152, 0), rgb(245, 124, 0))',
        'gradient-error': 'linear-gradient(135deg, rgb(244, 67, 54), rgb(229, 57, 53))',
        'shimmer': 'linear-gradient(110deg, rgba(102, 126, 234, 0.5) 45%, rgba(15, 23, 42, 1) 55%)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'glass': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        'fast': '0.15s',
        'normal': '0.3s',
        'slow': '0.5s',
        'spring': '0.4s',
      },
      zIndex: {
        'modal': '1000',
        'dropdown': '1000',
        'tooltip': '1001',
        'notification': '1002',
        'overlay': '999',
        'sidebar': '100',
        'header': '101',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssForms,
    tailwindcssTypography,
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
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
            'box-shadow': '0 0 20px rgba(102, 126, 234, 0.3)',
          },
        },
        '.hover-scale': {
          'transition': 'transform 0.2s ease-out',
          '&:hover': {
            'transform': 'scale(1.05)',
          },
        },
        '.text-gradient': {
          'background': 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          'color': 'transparent',
        },
      });
    },
  ],
} satisfies Config