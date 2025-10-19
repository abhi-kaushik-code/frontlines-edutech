/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        screens: {
        'sm': '720px',   // small screens
        'md': '1024px',  // medium screens
        'lg': '1440px',  // large screens
        'xl': '1920px',  // extra large screens
      },
    },
  },
  plugins: [],
}
