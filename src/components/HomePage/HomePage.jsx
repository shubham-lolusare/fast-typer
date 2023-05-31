// importing the images
import typewriter from "./type_animate.svg";

// Importing the child components
import ThemeSelector from "../ThemeSelector/ThemeSelector";
import LoginSignup from "../LoginSignup/LoginSignup";
import { FaGithubSquare } from "react-icons/fa";

export default function HomePage() {
  return (
    <main className="h-screen w-full p-4 flex gap-4 bg-bgColor">
      <section className="flex flex-col justify-between">
        {" "}
        {/* heading class is for the entrance animation of the heading */}
        <div className="flex flex-[0.18] justify-center">
          <h1 className="h-full text-8xl text-textColor text-center font-black tracking-wider whitespace-nowrap overflow-hidden animate-typing">
            fast-typer
          </h1>{" "}
          <div className="border-8 border-thematicColor animate-cursor-blink"></div>
        </div>
        <img
          src={typewriter}
          alt="The Typewriter floating image"
          className="flex-[0.82]"
        />
        <footer className="flex justify-between">
          <ThemeSelector />
          <div className="text-5xl">
            <a
              href="https://github.com/shubham-lolusare/fast-typer"
              target="_blank"
              rel="noreferrer"
              title="Github Repo"
            >
              <FaGithubSquare className="text-textColor" />
            </a>
          </div>
        </footer>
      </section>
      <section className="flex-auto p-4 flex flex-col justify-between">
        <LoginSignup />
        <p className="text-7xl font-extrabold justify-between">
          <span className="text-textColor">Just Login,</span>
          <span className="text-thematicColor"> Take the test </span>{" "}
          <span className="text-textColor">and</span>{" "}
          <span className="animate-rainbow text-textColor">
            See the results
          </span>
        </p>
      </section>
    </main>
  );
}
