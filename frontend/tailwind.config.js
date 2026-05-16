/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(165, 180, 252, 0.08), 0 20px 80px rgba(99, 102, 241, 0.12)',
      },
    },
  },
  plugins: [],
}
