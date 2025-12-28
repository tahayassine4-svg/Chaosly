/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        background: '#0a0a0a',
        card: '#1a1a1a',
        text: '#ffffff',
        textSecondary: '#9ca3af',
      },
    },
  },
  plugins: [],
}
