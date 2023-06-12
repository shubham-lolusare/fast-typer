/* eslint-disable react/prop-types */

import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider(props) {
  // state for storing the theme value
  let [theme, setTheme] = useState();

  // function for changing them value
  function changeTheme(value) {
    setTheme(value);
    document.documentElement.setAttribute("class", `theme-${value}`);
    localStorage.setItem("fast-typer-theme", value);
  }

  // providing theme context
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
