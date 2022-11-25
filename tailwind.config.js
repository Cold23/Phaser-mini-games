/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    screens: {
      sm: { max: '576px', min: '0px' },
      md: '960px',
      lg: '1440px',
    },
  },
  plugins: [],
}
