/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' if you want to use system preferences
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-kanit)', 'var(--font-outfit)', 'var(--font-plus-jakarta)'],
        kanit: ['var(--font-kanit)'],
        outfit: ['var(--font-outfit)'],
        jakarta: ['var(--font-plus-jakarta)'],
      },
    },
  },
}