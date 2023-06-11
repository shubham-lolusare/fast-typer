// This is the page where the new user will be landed while loading the first time.
// This page is also used for login purpose of the user
// If the user is already logged in the user will be navigated to test page where the user will be able to take test again

import { useEffect, useState } from "react";

// importing the images
import typewriter from "./type_animate.svg";

// Importing the child components
import ThemeSelector from "../ThemeSelector/ThemeSelector";
import LoginSignup from "./LoginSignup";
import LoadingPage from "../LoadingPage/LoadingPage";

// Importing icons
import { FaGithubSquare } from "react-icons/fa";

// importing firebase related package
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

// importing react-router related package
import { Navigate } from "react-router-dom";

export default function HomePage() {
  // state for checking if the user id logged in
  let [userLoggedIn, setUserLoggedIn] = useState(false);

  /* state for setting the display of loading page. The loading page will 
  be shown when the network fethching request are done. 
  By default it is set true becoz we want the loading page to be shown first and if the user login do not exists
  the loading page will not be shown else the user will be redirected to test page*/
  let [loading, setLoading] = useState(true);

  /*After rendering the home page, using onAuthStateChanged function user log in status is 
  fetched. If the user is logged in the user will be redirected to test page */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified === true) {
          /* here user login status is updated and set to true which will trigger 
          the Navigate component below to route to the test page*/
          setUserLoggedIn(true);
        }
      } else {
        setUserLoggedIn(false);

        // here the loading page display is hidden if user donot exist
        setLoading(false);
      }
    });
  });

  return (
    <main className="relative h-screen w-full p-4 flex gap-4 bg-bgColor animate-fade-in transition-all duration-200 ease-linear md:gap-0 md:flex-col md:w-[60%] md:h-max  md:items-center md:m-auto sm:w-full xs:p-2">
      {/* Navigate component for routing to the test page */}
      {userLoggedIn && <Navigate to="/test" replace />}

      <section className="flex flex-col justify-between md:w-full md:p-2 md:gap-0">
        <header className="flex justify-center md:flex-auto h-[120px] mobile:h-[60px] xs:h-[50px] mobile:tracking-widest">
          {/* heading */}
          <h1 className="h-full text-8xl text-textColor text-center font-black tracking-wider whitespace-nowrap overflow-hidden animate-typing mobile:text-5xl xs:text-4xl">
            fast-typer
          </h1>{" "}
          {/* blinking cursor */}
          <div className="border-8 border-thematicColor animate-cursor-blink mobile:border-4"></div>
        </header>

        {/* animating image below heading */}
        <img
          src={typewriter}
          alt="The Typewriter floating image"
          className="flex-1 md:flex-auto"
        />

        <footer className="flex justify-between md:absolute md:bottom-4 md:left-0 md:w-full md:pl-8 md:pr-8  xs:gap-4 xs:items-center xs:justify-between">
          {/* Themeselector component */}
          <div className="shadow-md flex-[0.5] rounded-md">
            <ThemeSelector />
          </div>

          {/* github repo link */}
          <div className="text-4xl">
            <a
              href="https://github.com/shubham-lolusare/fast-typer"
              target="_blank"
              rel="noreferrer"
              title="Github Repo"
            >
              {/* github icon */}
              <FaGithubSquare className="text-textColor" />
            </a>
          </div>
        </footer>
      </section>

      {/* login and signup section */}
      <section className="flex-auto p-2 pb-0 flex flex-col justify-between md:gap-0 ">
        {/* login and signup component */}
        <LoginSignup />

        {/* tageline part below login and signup */}
        <section className="text-7xl font-extrabold justify-between leading-tight md:p-4 md:leading-tight mobile:text-5xl mobile:leading-snug md:pb-16 xs:text-4xl xs:leading-normal">
          <span className="text-textColor">Just Login,</span>
          <span className="text-thematicColor"> Take the test </span>{" "}
          <span className="text-textColor">and</span>{" "}
          <span className="animate-rainbow text-textColor">
            See the results
          </span>
        </section>
      </section>

      {/* loading page component which will be displayed when the network request are done */}
      {loading && <LoadingPage />}
    </main>
  );
}
