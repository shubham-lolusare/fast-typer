/* eslint-disable react/prop-types */
// This context is to choose the theme from light and dark mode
// The localstorage is used to give the caching effect, meaning if the user closes the site in dark mode,
// on re-opening the website, dark mode should be persisted.
// For triggering the re-rendering of the components that are accessing the context value, useState hook is used to store the
// theme mode and hence the theme value and theme changer function is provided by the provider down to the childs.

import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider(props) {
  let [theme, setTheme] = useState(localStorage.getItem("theme"));

  function changeTheme() {
    if (theme === null || theme === "light") {
      setTheme(() => {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        return localStorage.getItem("theme");
      });
    } else if (theme === "dark") {
      setTheme(() => {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        return localStorage.getItem("theme");
      });
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
