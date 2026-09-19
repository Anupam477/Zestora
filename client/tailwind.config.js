/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FEA116',
          dark: '#E08B07',
          light: '#FFF5E6',
        },
        dark: {
          DEFAULT: '#0F172B',
          deep: '#0B1120',
          card: '#162035',
          border: '#1E293B',
        },
        accent: {
          amber: '#F59E0B',
          orange: '#EA580C',
          gold: '#D97706',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        cursive: ['Pacifico', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 50s linear infinite',
      },
    },
  },
  plugins: [],
}
