// importing the images
import typewriter from "./type_animate.svg";

// importing the custom css for the HomePage Component
import "./HomePage.css";

// Importing the child components
import ThemeSelector from "../ThemeSelector/ThemeSelector";
import FooterLogo from "../FooterLogo/FooterLogo";

export default function HomePage() {
  return (
    <main className="h-screen w-full flex p-4 bg-amber-50 dark:bg-slate-950">
      <section className="flex flex-col justify-between">
        {" "}
        {/* heading class is for the entrance animation of the heading */}
        <h1 className="heading h-[16%] font-black text-center text-8xl text-slate-950 tracking-wider dark:text-white">
          fast-typer
        </h1>
        <img
          src={typewriter}
          alt="The Typewriter floating image"
          className="h-[74%]"
        />
        <footer className="h-[10%] flex justify-around">
          <ThemeSelector />
          <FooterLogo />
        </footer>
      </section>
      <section className="border-2 border-black flex-auto p-4">
        <h1>Login</h1>
        <form action=""></form>
      </section>
    </main>
  );
}
