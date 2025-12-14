/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F5EFF',       // Xanh chủ đạo
        'primary-dark': '#1040B0',
        'primary-light': '#E8F0FF',
      }
    },
  },
  plugins: [],
}