import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'sans': [ 'Work Sans', ...defaultTheme.fontFamily.sans ],
      'display': [ 'DM Serif Display', ...defaultTheme.fontFamily.serif ],
    },
    extend: {
      aspectRatio: {
        '3/2': '3/2',
      },
      animation: {
        'wave': '1s cubic-bezier(0.4, 0, 0.6, 1) 0s infinite normal both running wave',
        'modalIn': '150ms cubic-bezier(0.4, 0, 0.6, 1) 100ms 1 normal both running modalIn',
        'backdropIn': '150ms cubic-bezier(0.4, 0, 0.6, 1) 0s 1 normal both running backdropIn',
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
      }
    }
  },
  plugins: [],
} satisfies Config;

