/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['Garamond', "'Times New Roman'", 'serif'],
        geist: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        ink: '#010101',
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.3em',
      },
    },
  },
  plugins: [],
};
