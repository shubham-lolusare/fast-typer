import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/Theme";
import { GiPaintBucket } from "react-icons/gi";
import { Select, initTE } from "tw-elements";

export default function ThemeSelector() {
  let [themeValue, setThemeValue] = useState("light");

  let { changeTheme } = useContext(ThemeContext);

  useEffect(() => {
    initTE({ Select });
    changeTheme(themeValue);
  }, [changeTheme, themeValue]);

  return (
    <div title="Change Theme" className="flex gap-4 text-xl">
      <GiPaintBucket className="text-5xl text-textColor" />
      <select
        data-te-select-init
        data-te-class-dropdown="bg-white border-thematicColor border-2 relative outline-none min-w-[100px] m-0 scale-[0.8] opacity-0 shadow-[0_2px_5px_0_rgba(0,0,0,0.16),_0_2px_10px_0_rgba(0,0,0,0.12)] transition duration-200 motion-reduce:transition-none data-[te-select-open]:scale-100 data-[te-select-open]:opacity-100"
        data-te-class-select-option="flex flex-row items-center justify-between w-full px-4 truncate text-black bg-transparent select-none cursor-pointer hover:[&:not([data-te-select-option-disabled])]:bg-thematicColor hover:[&:not([data-te-select-option-disabled])]:text-textColor data-[te-select-option-selected]:data-[te-input-state-active]:bg-thematicColor/5 data-[te-select-selected]:data-[te-select-option-disabled]:cursor-default data-[te-select-selected]:data-[te-select-option-disabled]:text-textColor data-[te-select-selected]:data-[te-select-option-disabled]:bg-transparent data-[te-select-option-selected]:bg-thematicColor/[0.02] data-[te-select-option-disabled]:text-textColor data-[te-select-option-disabled]:cursor-default group-data-[te-select-option-group-ref]/opt:pl-7"
        data-te-class-select-input="peer block min-h-[auto] w-full rounded border-[3px] border-black bg-thematicColor text-textColor transition-all duration-200 ease-linear outline-2 outline-thematicColor outline motion-reduce:transition-none cursor-pointer"
        data-te-class-select-arrow="absolute right-3 top-[15px] text-[0.8rem] cursor-pointer text-textColor w-5 h-5"
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
