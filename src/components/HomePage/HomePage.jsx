// importing the images
import typewriter from "./type_animate.svg";

// Importing the child components
import ThemeSelector from "../ThemeSelector/ThemeSelector";
import FooterLogo from "../FooterLogo/FooterLogo";
import LoginSignup from "../LoginSignup/LoginSignup";

export default function HomePage() {
  return (
    <main className="h-screen w-full p-4 flex gap-4 bg-bgColor">
      <section className="flex flex-col justify-between">
        {" "}
        {/* heading class is for the entrance animation of the heading */}
        <h1 className="overflow-hidden border-r-8 border-thematicColor whitespace-nowrap m-auto animate-typing h-[16%] font-black text-center text-8xl text-slate-950 tracking-wider dark:text-white">
          fast-typer
        </h1>
        <img
          src={typewriter}
          alt="The Typewriter floating image"
          className="h-[74%]"
        />
        <footer className="h-max flex justify-between">
          <ThemeSelector />
          <FooterLogo />
        </footer>
      </section>
      <section className="flex-auto p-4">
        <LoginSignup />
      </section>
    </main>
  );
}
