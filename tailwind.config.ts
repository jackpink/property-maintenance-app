import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        '128': '50rem',
        '144': '56rem',
        '160': '64rem',
        '176': '72rem',
        '192': '80rem',
        '208': '88rem',
      },
      screens: {
        '3xl': '1800px'
      },
      colors: {
        primary: "#acf7c1",
        secondary: " #ccfff4",
        brand: "#7df2cd",
        dark: "#011627", 
        light: "#f7ece1",
        altPrimary: "#c470e7",
        altSecondary: "#d8c2ff",
      }
      
    },
  },
  plugins: [],
} satisfies Config;
