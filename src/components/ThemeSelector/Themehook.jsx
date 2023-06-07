import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/Theme";
import { lightTheme, darkTheme, iceTheme } from "../../config/themeConfig";

export default function useTheme() {
  let { theme } = useContext(ThemeContext);
  let [themeState, setThemeState] = useState(lightTheme);

  useEffect(() => {
    if (theme === "light") setThemeState(lightTheme);
    else if (theme === "dark") setThemeState(darkTheme);
    else if (theme === "ice") setThemeState(iceTheme);
  }, [theme, themeState]);

  return themeState;
}