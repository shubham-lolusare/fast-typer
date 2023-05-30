/** @type {import('tailwindcss').Config} */
import { createThemes } from "tw-colors";
import {
  lightTheme,
  darkTheme,
} from "./src/components/ThemeSelector/themeConfig";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      md: { max: "1200px" },
      sm: { max: "770px" },
      xs: { max: "300px" },
      tall: { raw: "(max-height: 610px)" },
    },
    extend: {
      animation: {
        typing:
          "type-animation 1s steps(10, end), cursor-blink 0.75s step-end infinite",
      },
      keyframes: {
        "cursor-blink": {
          "0%, 100%": { "border-color": "transparent" },
          "50%": { "border-color": `${lightTheme.thematicColor}` },
        },
        "type-animation": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
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
    }),
  ],
  darkMode: "class",
};
