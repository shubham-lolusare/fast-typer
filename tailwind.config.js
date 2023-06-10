/** @type {import('tailwindcss').Config} */
import { createThemes } from "tw-colors";
import {
  lightTheme,
  darkTheme,
  iceTheme,
  redTheme,
  goldTheme,
  whiteTheme,
} from "./src/config/themeConfig";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      md: { max: "1250px" },
      sm: { max: "912px" },
      mobile: { max: "500px" },
      xs: { max: "300px" },
      tall: { raw: "(max-height: 610px)" },
    },
    extend: {
      animation: {
        typing: "type-animation 1s steps(10, end)",
        "cursor-blink": "cursor-blink 0.75s step-end infinite",
        rainbow: "rainbow-animation 4s steps(15,end) infinite",
        "fade-out": "fade-out-animation 0.2s ease",
        "fade-in": "fade-in-animation 0.2s ease",
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
        "fade-out-animation": {
          "0%": { opacity: "100" },
          "100%": { opacity: "0" },
        },
        "fade-in-animation": {
          "0%": { opacity: "0" },
          "100%": { opacity: "100" },
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
      red: {
        bgColor: `${redTheme.bgColor}`,
        textColor: `${redTheme.textColor}`,
        thematicColor: `${redTheme.thematicColor}`,
      },
      gold: {
        bgColor: `${goldTheme.bgColor}`,
        textColor: `${goldTheme.textColor}`,
        thematicColor: `${goldTheme.thematicColor}`,
      },
      white: {
        bgColor: `${whiteTheme.bgColor}`,
        textColor: `${whiteTheme.textColor}`,
        thematicColor: `${whiteTheme.thematicColor}`,
      },
    }),
  ],
};
