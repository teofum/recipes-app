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
      animation: {
        'wave': '1s cubic-bezier(0.4, 0, 0.6, 1) 0s infinite normal both running wave',
        'modalIn': '300ms cubic-bezier(0.4, 0, 0.6, 1) 100ms 1 normal both running modalIn',
        'backdropIn': '300ms cubic-bezier(0.4, 0, 0.6, 1) 0s 1 normal both running backdropIn',
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
            'backdrop-filter': 'blur(0)',
          },
          '50%': {
            opacity: '1',
          },
          to: {
            'backdrop-filter': 'blur(12px)',
          },
        },
      }
    }
  },
  plugins: [],
} satisfies Config;

