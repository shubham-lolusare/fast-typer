import darkLogo from "./github-mark-white.png";
import lightLogo from "./github-mark.png";

// Importing the context related methods for dark mode
import { ThemeContext } from "../../contexts/Theme";
import { useContext } from "react";

export default function FooterLogo() {
  // using the theme value from the context. This value is used to conditionally render the
  let { theme } = useContext(ThemeContext);

  return (
    <div className="w-12 h-12 hover:scale-200">
      <a
        href="https://github.com/shubham-lolusare/fast-typer"
        target="_blank"
        rel="noreferrer"
        title="Github Repo"
      >
        {theme === null || theme === "light" ? (
          <img src={lightLogo} alt="Light Github Logo" />
        ) : (
          <img src={darkLogo} alt="Dark Github Logo" />
        )}
      </a>
    </div>
  );
}
