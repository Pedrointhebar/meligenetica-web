/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          mel: '#C9861A',
          soft: '#F5E6C8',
          dark: '#8B5E10',
        },
        earth: '#6B4F2A',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
