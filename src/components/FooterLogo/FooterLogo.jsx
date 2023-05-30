import { FaGithubSquare } from "react-icons/fa";

// Importing the context related methods for dark mode
import { ThemeContext } from "../../contexts/Theme";
import { useContext } from "react";

export default function FooterLogo() {
  // using the theme value from the context. This value is used to conditionally render the
  let { theme } = useContext(ThemeContext);

  return (
    <div className="text-5xl">
      <a
        href="https://github.com/shubham-lolusare/fast-typer"
        target="_blank"
        rel="noreferrer"
        title="Github Repo"
      >
        {theme === null || theme === "light" ? (
          <FaGithubSquare />
        ) : (
          <FaGithubSquare className=" text-white" />
        )}
      </a>
    </div>
  );
}
