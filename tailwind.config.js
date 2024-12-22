/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./components/**/*.{js,ts,vue}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue"
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'medical-primary': '#2c3e50',
          'medical-secondary': '#3498db'
        }
      },
    },
    plugins: [],
  }