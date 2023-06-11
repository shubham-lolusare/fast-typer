import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/Theme";

export default function ThemeSelector() {
  let [themeValue, setThemeValue] = useState(
    `${
      localStorage.getItem("fast-typer-theme") != null
        ? localStorage.getItem("fast-typer-theme")
        : "light"
    }`
  );

  let { changeTheme } = useContext(ThemeContext);

  useEffect(() => {
    changeTheme(themeValue);
  }, [changeTheme, themeValue]);

  return (
    <div
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
        <option value="white">Formal Whites</option>
      </select>
    </div>
  );
}
