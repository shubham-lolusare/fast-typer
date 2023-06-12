// this component lets us select the themes
// It is using the changeTheme function defined in theme context using use context hook

import { useContext, useEffect, useState } from "react";

// importing context
import { ThemeContext } from "../../contexts/Theme";

export default function ThemeSelector() {
  // state for storing the theme value either from local storage or context
  let [themeValue, setThemeValue] = useState(
    `${
      localStorage.getItem("fast-typer-theme") != null
        ? localStorage.getItem("fast-typer-theme")
        : "light"
    }`
  );

  // change theme function from theme contsection
  let { changeTheme } = useContext(ThemeContext);

  useEffect(() => {
    changeTheme(themeValue);
  }, [changeTheme, themeValue]);

  return (
    <section
      title="Change Theme"
      className="w-full flex gap-2 items-center h-full rounded-md"
    >
      <select
        onChange={(e) => setThemeValue(e.target.value)}
        value={themeValue}
        className="min-w-full w-max h-full text-base p-1 pl-2 pr-2 border border-thematicColor bg-bgColor text-textColor rounded-md focus:outline-0"
      >
        <option value="light">Yellow Sunrise</option>
        <option value="dark">Sleek & Modern</option>
        <option value="ice">Icy Blues & Grays</option>
        <option value="red">Red Maharaja</option>
        <option value="gold">Golden Era</option>
        <option value="darkred">Dark Red Banga</option>
        <option value="white">Formal Whites</option>
        <option value="sea">Vitamin Sea</option>
        <option value="purple">Purple Saga</option>
        <option value="darkpurple">Jamaica Charm</option>
      </select>
    </section>
  );
}
