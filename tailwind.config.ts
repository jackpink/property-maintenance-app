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
        brandSecondary: "#c470e7",
        dark: "#011627", 
        light: "#f7ece1",
        altPrimary: "#0E7C7B",
        altSecondary: "#86bbbd",
      }
      
    },
  },
  plugins: [],
} satisfies Config;
