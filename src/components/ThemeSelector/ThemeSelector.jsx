import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/Theme";
import { LuPaintbrush } from "react-icons/lu";
export default function ThemeSelector() {
  let [themeValue, setThemeValue] = useState("light");

  let { changeTheme } = useContext(ThemeContext);

  useEffect(() => {
    changeTheme(themeValue);
  }, [changeTheme, themeValue]);

  return (
    <div title="Change Theme" className="flex gap-4 text-xl">
      <LuPaintbrush className="text-5xl" />
      <select
        name="theme"
        id="theme"
        onChange={(e) => setThemeValue(e.target.value)}
      >
        <option value="light" defaultValue>
          Yellow Sunrise
        </option>
        <option value="dark">Sleek & Modern</option>
        <option value="ice">Icy Blues & Grays</option>
      </select>
    </div>
  );
}
