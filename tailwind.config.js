/** @type {import('tailwindcss').Config} */
import { createThemes } from "tw-colors";
import { lightTheme, darkTheme, iceTheme } from "./src/config/themeConfig";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    screens: {
      md: { max: "1200px" },
      sm: { max: "770px" },
      xs: { max: "300px" },
      tall: { raw: "(max-height: 610px)" },
    },
    extend: {
      animation: {
        typing: "type-animation 1s steps(10, end)",
        "cursor-blink": "cursor-blink 0.75s step-end infinite",
        rainbow: "rainbow-animation 4s steps(15,end) infinite",
      },
      keyframes: {
        "cursor-blink": {
          "0%, 100%": { visibility: "hidden" },
          "50%": { visibility: "visible" },
        },
        "type-animation": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "rainbow-animation": {
          "0%": { color: "#9400D3" },
          "14%": { color: "#4B0082" },
          "28%": { color: "#0000FF" },
          "42%": { color: "#00FF00" },
          "56%": { color: "#FFFF00" },
          "70%": { color: "#FF7F00" },
          "86%": { color: "#FF0000" },
          "100%": { color: "#9400D3" },
        },
      },
    },
  },
  plugins: [
    createThemes({
      light: {
        bgColor: `${lightTheme.bgColor}`,
        textColor: `${lightTheme.textColor}`,
        thematicColor: `${lightTheme.thematicColor}`,
      },
      dark: {
        bgColor: `${darkTheme.bgColor}`,
        textColor: `${darkTheme.textColor}`,
        thematicColor: `${darkTheme.thematicColor}`,
      },
      ice: {
        bgColor: `${iceTheme.bgColor}`,
        textColor: `${iceTheme.textColor}`,
        thematicColor: `${iceTheme.thematicColor}`,
      },
    }),
  ],
  darkMode: "class",
};
