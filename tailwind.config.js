const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        default: {
          50: "#f1efed",
          100: "#ddd8d5",
          200: "#c9c2bc",
          300: "#b5aba3",
          400: "#a1958b",
          500: "#8d7e72",
          600: "#74685e",
          700: "#5c524a",
          800: "#433c36",
          900: "#2a2622",
          foreground: "#000",
          DEFAULT: "#8d7e72"
        },
        primary: {
          50: "#f3e3e7",
          100: "#e3bdc6",
          200: "#d296a5",
          300: "#c16f84",
          400: "#b14963",
          500: "#a02242",
          600: "#841c36",
          700: "#68162b",
          800: "#4c101f",
          900: "#300a14",
          foreground: "#fff",
          DEFAULT: "#a02242"
        },
        secondary: {
          50: "#f7e8e8",
          100: "#ebc8c7",
          200: "#dfa7a7",
          300: "#d38786",
          400: "#c86666",
          500: "#bc4645",
          600: "#9b3a39",
          700: "#7a2e2d",
          800: "#592121",
          900: "#381515",
          foreground: "#fff",
          DEFAULT: "#bc4645"
        },
        success: {
          50: "#e8f2ef",
          100: "#c8dfd9",
          200: "#a9ccc3",
          300: "#89b9ac",
          400: "#69a696",
          500: "#499380",
          600: "#3c796a",
          700: "#2f6053",
          800: "#23463d",
          900: "#162c26",
          foreground: "#000",
          DEFAULT: "#499380"
        },
        warning: {
          50: "#fcefe2",
          100: "#f8d9b9",
          200: "#f5c28f",
          300: "#f1ac66",
          400: "#ed953d",
          500: "#e97f14",
          600: "#c06911",
          700: "#97530d",
          800: "#6f3c0a",
          900: "#462606",
          foreground: "#000",
          DEFAULT: "#e97f14"
        },
        danger: {
          50: "#fbe6e1",
          100: "#f6c2b6",
          200: "#f09f8c",
          300: "#eb7c62",
          400: "#e55837",
          500: "#e0350d",
          600: "#b92c0b",
          700: "#922208",
          800: "#6a1906",
          900: "#431004",
          foreground: "#000",
          DEFAULT: "#e0350d"
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()]
}

// tailwind.config.js
// module.exports = {
//   darkMode: 'class',
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
