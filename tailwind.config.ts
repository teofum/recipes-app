import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'sans': [ 'Inter', ...defaultTheme.fontFamily.sans ],
      'display': [ 'Bitter', ...defaultTheme.fontFamily.serif ],
    },
    extend: {
      animation: {
        'wave': '1s cubic-bezier(0.4, 0, 0.6, 1) 0s infinite normal both running wave',
      },
      keyframes: {
        'wave': {
          '0%, 50%, 100%': {transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-50%)' },
        }
      }
    }
  },
  plugins: [],
} satisfies Config;

