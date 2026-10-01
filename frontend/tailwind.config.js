/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          300: '#fef08a',
          400: '#facc15',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}
