/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["'M PLUS 1p'", "sans-serif"],
      bold: ["'M PLUS 1p'", "sans-serif"],
      extraBold: ["'M PLUS 1p'", "sans-serif"],
    },
    fontWeight: {
      sans: 300,
      semibold: 400,
      bold: 500,
      extrabold: 700,
    },
    extend: {
      colors: {
        theme: "#48b0d5",
        "theme-dark": "#2c7a9b"
      }
    },
  },
  plugins: [],
};
