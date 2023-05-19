import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'sans': [ 'DM Sans', ...defaultTheme.fontFamily.sans ],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;

