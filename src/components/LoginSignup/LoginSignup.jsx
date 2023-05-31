import { useState } from "react";

import Login from "./Login";
import Signup from "./Signup";

export default function LoginSignup() {
  // user choice is the state where the user will choose whether to login or signup
  let [userChoice, setUserChoice] = useState("login");

  let generalTabStyle =
    "p-2 w-full font-bold text-textColor hover:text-xl tracking-widest";
  let selectedTabStyle = "border-b-4 border-thematicColor text-xl shadow";
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
    <article className="shadow-lg rounded-2xl ">
      <div className="flex justify-evenly">
        <button className={loginStyle} onClick={() => setUserChoice("login")}>
          LOGIN
        </button>
        <button className={signupStyle} onClick={() => setUserChoice("signup")}>
          SIGNUP
        </button>
      </div>
      <div>{userChoice === "login" ? <Login /> : <Signup />}</div>
    </article>
  );
}
