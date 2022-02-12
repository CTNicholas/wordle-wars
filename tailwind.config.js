const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        karla: 'Karla, Inter, sans-serif'
      },
      colors: {
        gray: {
          ...colors.zinc,
          50: colors.gray[50],
          100: colors.gray[100],
          200: colors.gray[200],
          850: '#202022'
        }
      }
    },
  },
  plugins: [],
}
