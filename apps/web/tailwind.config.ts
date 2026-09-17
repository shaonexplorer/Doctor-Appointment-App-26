import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Clinical Precision Design System colors
        cobalt: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // Clinical Cobalt - Primary
          900: '#1e3a8a',
          950: '#172554',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669', // Vital Emerald - Secondary
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706', // Triage Amber - Tertiary
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Critical Red - Destructive
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Deep Navy - Neutral
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': [
          '4.5rem',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-lg': [
          '3.75rem',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': [
          '2.25rem',
          { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'heading-xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'body-xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'label-lg': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        'label-md': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        'label-sm': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],
        overline: ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.1em', fontWeight: '600' }],
      },
      spacing: {
        '0': '0',
        '1': '0.25rem', // 4px
        '2': '0.5rem', // 8px
        '3': '0.75rem', // 12px
        '4': '1rem', // 16px
        '5': '1.25rem', // 20px
        '6': '1.5rem', // 24px
        '8': '2rem', // 32px
        '10': '2.5rem', // 40px
        '12': '3rem', // 48px
        '16': '4rem', // 64px
        '20': '5rem', // 80px
        '24': '6rem', // 96px,
        gutter: '2rem', // 32px - desktop gutter
        margin: '2.5rem', // 40px - desktop margin
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem', // 4px
        DEFAULT: '0.375rem', // 6px
        md: '0.5rem', // 8px
        lg: '0.75rem', // 12px
        xl: '1rem', // 16px
        '2xl': '1.5rem', // 24px
        full: '9999px',
      },
      boxShadow: {
        'level-0': 'none',
        'level-1': '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 0 0 1px rgb(0 0 0 / 0.05)',
        'level-2':
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(0 0 0 / 0.05)',
        'level-3':
          '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(0 0 0 / 0.05)',
        'level-3-blur': '0 25px 50px -12px rgb(0 0 0 / 0.25), backdrop-blur-sm',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      gridTemplateColumns: {
        desktop: 'repeat(12, minmax(0, 1fr))',
        tablet: 'repeat(8, minmax(0, 1fr))',
        mobile: 'repeat(4, minmax(0, 1fr))',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
