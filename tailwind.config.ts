import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

function themeColors(name: string) {
  return {
    DEFAULT: `rgb(var(--col-${name}) / <alpha-value>)`,
    1: `rgb(var(--col-${name}) / var(--op-1))`,
    2: `rgb(var(--col-${name}) / var(--op-2))`,
    3: `rgb(var(--col-${name}) / var(--op-3))`,
    4: `rgb(var(--col-${name}) / var(--op-4))`,
    5: `rgb(var(--col-${name}) / var(--op-5))`,
    6: `rgb(var(--col-${name}) / var(--op-6))`,
    high: `rgb(var(--col-${name}-high) / <alpha-value>)`,
  };
}

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'sans': [ 'Work Sans', ...defaultTheme.fontFamily.sans ],
      'display': [ 'DM Serif Display', ...defaultTheme.fontFamily.serif ],
    },
    colors: {
      // Utility colors
      current: colors.current,
      inherit: colors.inherit,
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,

      // Base colors
      surface: 'rgb(var(--col-surface) / <alpha-value>)',

      // Theme colors
      primary: themeColors('primary'),
      danger: themeColors('danger'),
      neutral: themeColors('neutral'),
    },

    extend: {
      backgroundColor: {
        default: 'rgb(var(--col-background) / <alpha-value>)',
      },
      textColor: {
        default: 'rgb(var(--col-text) / <alpha-value>)',
        light: 'rgb(var(--col-text-light) / <alpha-value>)',
      },

      aspectRatio: {
        '3/2': '3/2',
      },
      animation: {
        'wave': '1s cubic-bezier(0.4, 0, 0.6, 1) 0s infinite normal both running wave',
        'modalIn': '150ms cubic-bezier(0.4, 0, 0.6, 1) 100ms 1 normal both running modalIn',
        'backdropIn': '150ms cubic-bezier(0.4, 0, 0.6, 1) 0s 1 normal both running backdropIn',
        'slideInUp': '500ms cubic-bezier(0.35, 2, 0.7, 1) 0s 1 normal both running slideInUp',
        'slideInLeft': '500ms cubic-bezier(0.3, 1, 0.7, 1) 0s 1 normal both running slideInLeft',
      },
      keyframes: {
        'wave': {
          '0%, 50%, 100%': {transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-50%)' },
        },
        'modalIn': {
          from: {
            transform: 'translateX(-50%) translateY(0) scale(0.95)',
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          to: {
            transform: 'translateX(-50%) translateY(-50%)',
          },
        },
        'backdropIn': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'slideInUp': {
          from: {
            transform: 'translateY(2rem)',
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'slideInLeft': {
          from: {
            transform: 'translateX(4rem)',
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      }
    }
  },
  plugins: [],
} satisfies Config;

