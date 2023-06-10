/*It is the master component which consist of login and signup component.
With the help of this component user will be able to select whether he want to login or signup*/

import { useState } from "react";

// importing components
import Login from "./Login";
import Signup from "./Signup";

export default function LoginSignup() {
  // user choice is the state where the user will choose whether to login or signup
  let [userChoice, setUserChoice] = useState("login");

  // conditional classes variable definiton for the selected tab
  // general classes for all the tab
  let generalTabStyle =
    "p-2 w-full font-bold text-textColor hover:text-lg tracking-widest xs:text-base";

  // class list for selected tab
  let selectedTabStyle = "border-b-4 border-thematicColor text-lg shadow";

  // conditionally applying class list based on userChoice state
  let loginStyle = `${
    userChoice === "login"
      ? generalTabStyle + " " + selectedTabStyle
      : generalTabStyle
  }`;
  let signupStyle = `${
    userChoice === "signup"
      ? generalTabStyle + " " + selectedTabStyle
      : generalTabStyle
  }`;

  return (
    <section className="shadow-lg rounded-2xl">
      <header className="flex justify-evenly">
        {/* login tab */}
        <button className={loginStyle} onClick={() => setUserChoice("login")}>
          LOGIN
        </button>

        {/* signup tab */}
        <button className={signupStyle} onClick={() => setUserChoice("signup")}>
          SIGNUP
        </button>
      </header>

      {/* conditionally rendering login component or signup component based on userChoice state */}
      {userChoice === "login" ? <Login /> : <Signup />}
    </section>
  );
}
