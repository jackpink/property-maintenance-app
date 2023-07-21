import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        '128': '50rem',
      },
      screens: {
        '3xl': '1800px'
      },
      
    },
  },
  plugins: [],
} satisfies Config;
