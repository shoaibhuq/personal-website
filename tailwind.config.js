/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },

  colors: {
    transparent: "transparent",
    current: "currentColor",
    white: "#ffffff",
    black: "#101010",
    purple: "#3f3cbb",
    midnight: "#121063",
    metal: "#565584",
    tahiti: "#3ab7bf",
    silver: "#ecebff",
    "bubble-gum": "#ff77e9",
    bermuda: "#78dcca",
  },
  darkMode: "class",
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
