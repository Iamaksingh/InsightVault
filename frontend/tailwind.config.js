/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent-color, #7c3aed)',
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
    },
  },
  plugins: [],
};


