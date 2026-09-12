/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          panel: '#121824',
          card: 'rgba(22, 30, 46, 0.75)',
          border: 'rgba(56, 189, 248, 0.15)',
          accent: '#38bdf8',
          purple: '#a855f7',
          safe: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
