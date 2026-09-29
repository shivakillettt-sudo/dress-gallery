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
          pink: 'var(--primary-pink, #e8a0b5)',
          deep: 'var(--deep-pink, #c85c7a)',
          soft: 'var(--soft-pink, #f8dfe7)',
          cream: 'var(--cream, #fffaf5)',
          beige: 'var(--beige, #f3e8dc)',
          gold: 'var(--gold, #c9a45c)',
          dark: 'var(--dark, #252126)',
          muted: 'var(--muted, #756d72)',
          light: '#fdfbf9'
        }
      },
      fontFamily: {
        serif: ['var(--font-heading, "Playfair Display")', 'Georgia', 'serif'],
        sans: ['var(--font-body, "Plus Jakarta Sans")', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(200, 92, 122, 0.08)',
        'float': '0 15px 35px rgba(37, 33, 38, 0.12)',
      }
    },
  },
  plugins: [],
}
