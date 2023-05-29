import lightIcon from "./light.png";
import darkIcon from "./dark.png";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/Theme";

export default function ThemeSelector() {
  // Accessing the theme value and changeTheme function using the useContext hook
  let { theme, changeTheme } = useContext(ThemeContext);

  // Conditionally rendering the icons of the ThemeSelector.
  // If the theme is dark sun icon will be appeared and if the theme is light moon icon will be appeared
  return (
    <div
      title="Change Theme"
      className="w-16 h-16 cursor-pointer hover:outline-4 hover:outline-[#ffc100] hover:outline hover:rounded-full"
    >
      {theme === null || theme === "light" ? (
        <img src={darkIcon} alt="Dark Icon" onClick={changeTheme} />
      ) : (
        <img src={lightIcon} alt="Light Icon" onClick={changeTheme} />
      )}
    </div>
  );
}
