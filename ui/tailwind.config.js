/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  // important: true,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        playfair: ["var(--font-playfair)", "sans-serif"],
        oleo: ["var(--font-oleo)", "sans-serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        primary: "#590D82",
        secondary: "#9B51E0",
        // primary: '#1E1E1E',
        // secondary: '#9B51E0'
      },
    },
  },
  plugins: [],
};
