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
        primary: "#2ec4b6",
        secondary: "#aceae4",
        brand: "#a799b7",
        dark: "#011627", 
        light: "#cbf3f0"
      }
      
    },
  },
  plugins: [],
} satisfies Config;
