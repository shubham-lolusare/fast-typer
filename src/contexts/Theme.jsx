/* eslint-disable react/prop-types */

import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider(props) {
  let [theme, setTheme] = useState();

  function changeTheme(value) {
    setTheme(value);
    document.documentElement.setAttribute("class", `theme-${value}`);
    localStorage.setItem("fast-typer-theme", value);
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
