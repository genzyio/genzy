module.exports = {
  content: ["./src/**/*.{html,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};
