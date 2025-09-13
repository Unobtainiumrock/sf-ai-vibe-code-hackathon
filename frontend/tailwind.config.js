/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aha-blue': '#3B82F6',
        'aha-green': '#10B981',
        'aha-red': '#EF4444',
        'aha-yellow': '#F59E0B',
        'aha-gray': '#6B7280'
      }
    },
  },
  plugins: [],
}
