/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#03dea4",
          "primary-light": "#04f7b5",
          accent: "#1cdaff",
          dark: "#292929",
          light: "#f5f5f5",
        },
      },
    },
  },
  plugins: [],
  darkMode: ["class", '[data-theme="dark"]'],
};
