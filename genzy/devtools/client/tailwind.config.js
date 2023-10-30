module.exports = {
  content: ["./src/**/*.{html,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#04F7B5",
          accent: "#1CDAFF",
          text: "#292929",
          node: { dark: "#181a1a", gray: "#343435" },
        },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};
