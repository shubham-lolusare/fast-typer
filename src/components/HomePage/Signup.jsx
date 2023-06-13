/* eslint-disable react/prop-types */
/*
 This component is responsible for the user creation in firebase
 There are twi ways using which the user accounts are created using this component
 One way is letting the user to signup using their existing Gmail account and the other way
 is to let user enter the valid email address.

 Once the user is created, the user is sent the email verification mail on their entered email id.
 If the user verifies using the link sent on their email, then only they will be able to login into their accounts

Note: when the user signs in with their google account there is not need for email verifiaction as 
verification is done at Google level. Hence the user will be automatically redirected to the test page 
without the nedd of email verification 
*/

import { useState } from "react";

// importing icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

// importing toast
import { toast } from "react-toastify";

// importing firebase related modules
import { auth } from "../../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import Loading from "../LoadingPage/LoadingPage";

// importing routing related modules
import { useNavigate } from "react-router-dom";

export default function Signup() {
  // This state is used to toggle the hide and show of the password in input box using the eye icon
  let [passwordState, setPasswordState] = useState("hide");

  // states for the input field: email, password and conf passowrd
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confPassword, setConfPassword] = useState("");

  /* state for setting the display of loading page. The loading page will 
  be shown when the network fethching request are done. 
  By default it is set false as we need to show the loading apge only on the fetching process*/
  let [loading, setLoading] = useState(false);

  // We are using the useNavigate hook to navigate to the test page on successfull authentication for Google signups only
  let navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  // function for handling google signup
  function handleGoogleSignup() {
    // toggle of loading page
    setLoading(true);
    signInWithPopup(auth, googleProvider)
      .then(() => {
        setLoading(false);

        // here the user will be navigated to the test page after successfull suthentication
        navigate("/test");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  }

  // function for handling non google signups
  function handleSignup(e) {
    // preventing forms default behaviour
    e.preventDefault();

    // toggle of loading page
    setLoading(true);

    // user in firebase will only be created if password and confirm password matches
    // else the error is shown
    if (password === confPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // after the user creation is done the user will be assigned the user name automatically
          // This if condition ensures the username is set only once
          if (auth.currentUser.displayName == null) {
            updateProfile(auth.currentUser, {
              displayName: auth.currentUser.email.slice(
                0,
                auth.currentUser.email.indexOf("@")
              ),
            });
          }

          // after theis the verification email is sen to the user email id
          sendEmailVerification(auth.currentUser)
            .then(() => {
              // since the user creation in firebase signs in the user  we have to explicitly sign
              //  them out and navigate to the home page
              // to ensure the smooth functioning of verified user login only
              signOut(auth)
                .then(() => {
                  setLoading(false);
                  toast.success(
                    "Please verify the Email ID using the verification link sent to your email account!",
                    {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                    }
                  );
                  navigate("/");
                })
                // catch block for signout function
                .catch((error) => {
                  toast.error(error.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
                });
            })
            // catch block for verification email sent function
            .catch((error) => {
              toast.error(error.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            });
        })
        // catch block for user creation in firebase funtion
        .catch((error) => {
          setLoading(false);
          toast.error(error.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
    } else {
      setLoading(false);
      toast.error("Two passwords do not match", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  return (
    <article className="p-4 flex flex-col gap-4">
      {/* signup form */}
      <form
        className="flex flex-col text-textColor xs:text-sm"
        onSubmit={handleSignup}
      >
        {/* form heading */}
        <h1 className="text-xl mb-4 text-textColor font-semibold">
          Register with us
        </h1>

        {/* email adress input */}
        <div className="relative mb-3">
          <input
            type="email"
            className="peer m-0 block h-[58px] w-full rounded border-[1px] border-textColor bg-transparent bg-clip-padding px-3 py-4 font-normal leading-tight text-textColor transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-textColor focus:outline-thematicColor focus:outline-[2px] focus:outline peer-focus:text-textColor [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem] focus:shadow-md"
            id="emailID"
            placeholder="Email Address"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label
            htmlFor="emailID"
            className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-autofill:-translate-y-2 peer-autofill:translate-x-[0.15rem] peer-autofill:scale-[0.85] peer-autofill:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
          >
            Email Address
          </label>
        </div>

        {/* password input */}
        <div className="relative mb-3">
          <input
            type={passwordState === "hide" ? "password" : "text"}
            className="peer m-0 block h-[58px] w-full rounded border-[1px] border-textColor bg-transparent bg-clip-padding px-3 py-4 font-normal leading-tight text-textColor transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-textColor focus:outline-thematicColor focus:outline-[2px] focus:outline peer-focus:text-textColor [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem] focus:shadow-md"
            id="password"
            placeholder="Password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <label
            htmlFor="password"
            className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-autofill:-translate-y-2 peer-autofill:translate-x-[0.15rem] peer-autofill:scale-[0.85] peer-autofill:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
          >
            Password
          </label>
        </div>

        {/* confirm password input */}
        <div className="relative mb-3">
          {/* password show/hide eye for both password and confirm password input box*/}
          {/* using this we are changing the type of the input field and based on the 
          passwordState state, the tyoe will be assigned as password or either text */}
          <div
            className="text-2xl text-textColor absolute right-[15px] top-[17px] cursor-pointer"
            onClick={() => {
              if (passwordState === "hide") {
                setPasswordState("show");
              } else {
                setPasswordState("hide");
              }
            }}
          >
            {passwordState === "hide" ? (
              <AiOutlineEye />
            ) : (
              <AiOutlineEyeInvisible />
            )}
          </div>

          <input
            type={passwordState === "hide" ? "password" : "text"}
            className="peer m-0 block h-[58px] w-full rounded border-[1px] border-textColor bg-transparent bg-clip-padding px-3 py-4 font-normal leading-tight text-textColor transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-textColor focus:outline-thematicColor focus:outline-[2px] focus:outline peer-focus:text-textColor [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem] focus:shadow-md"
            id="confPassword"
            placeholder="Confirm Password"
            required
            onChange={(e) => {
              setConfPassword(e.target.value);
            }}
          />
          <label
            htmlFor="confPassword"
            className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-autofill:-translate-y-2 peer-autofill:translate-x-[0.15rem] peer-autofill:scale-[0.85] peer-autofill:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
          >
            Confirm Password
          </label>
        </div>

        {/* sublit button for sign up form */}
        <input
          type="submit"
          value="Register"
          className="cursor-pointer w-[50%] p-2 pl-5 pr-5 font-bold shadow-md text-textColor bg-thematicColor/80 rounded-lg tracking-wider hover:bg-thematicColor/100 mobile:w-full"
        />
      </form>

      {/* OR divider for asthetic pruposes */}
      <div className="w-[50%] text-center text-xs font-bold text-textColor mobile:w-full">
        OR
      </div>

      {/* google signup button */}
      <button
        className="w-[50%] p-2 pl-5 pr-5 border-2 border-thematicColor font-bold shadow-md text-textColor bg-transparent rounded-lg tracking-wider flex justify-center items-center mobile:w-full xs:text-sm "
        onClick={handleGoogleSignup}
      >
        <FcGoogle className="text-xl mr-2 xs:text-base" />{" "}
        <div className="xs:text-[13px]">Continue with Google</div>
      </button>

      <p className="text-textColor text-sm xs:text-[13px]">
        <strong>Note:</strong> If you already have your account with us, Click
        on <b>LOGIN</b>
      </p>

      {/* loading page component which will be displayed when the network request are done */}
      {loading && <Loading />}
    </article>
  );
}
