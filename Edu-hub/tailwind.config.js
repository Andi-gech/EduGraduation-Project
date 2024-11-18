/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./app/**/*.{js,jsx,ts,tsx}","./Components/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textColor:{
      "buttoncolor":"2B4E7B",
      "LightTextcolor":"#9E9191"
      },

      backgroundColor:{
        "buttoncolor":"#2B4E7B",
        "FormColor":"#F6F6F6"
      }
    },
  },
  plugins: [],

}

