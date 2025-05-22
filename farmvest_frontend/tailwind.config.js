/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0d1814',
        "background1": "#18191b",
        "nav_color" : "#117938",

      },
    },
  },
  plugins: [],
}

