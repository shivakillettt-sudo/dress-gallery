/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#e8a0b5',
          deep: '#c85c7a',
          soft: '#f8dfe7',
          cream: '#fffaf5',
          beige: '#f3e8dc',
          gold: '#c9a45c',
          dark: '#252126',
          muted: '#756d72',
          light: '#fdfbf9'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(200, 92, 122, 0.08)',
        'float': '0 15px 35px rgba(37, 33, 38, 0.12)',
      }
    },
  },
  plugins: [],
}
