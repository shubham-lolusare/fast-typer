/*This component will be responsible for the successfull authentication of the user.
  Authentication can be done in two ways. 

  One with google, which will successfully check for the user account and signs in.
  Using google authentication email verifiction is not required and the users will be redirected automaticlly 
  to the test page

  Another one with the user entered email. For this method email verification is required thorugh the link sent to the user 
  on their email. Using this method, user will only be authenticated if the users email is verified else it will show error

  There is also the provision of forgot password through which the user can rest their email passwords
*/

import { useState } from "react";

// importing icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

// importing components
import Loading from "../LoadingPage/LoadingPage";
import ForgetPasswordModal from "../ForgetPasswordModal/ForgetPasswordModal";

// importing react-router module hook
import { useNavigate } from "react-router-dom";

// importing toast
import { toast } from "react-toastify";

// importing firebase related modules
import { auth } from "../../config/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function Login() {
  // This state is used to toggle the hide and show of the password in input box using the eye icon

  let [passwordState, setPasswordState] = useState("hide");

  /* state for setting the display of loading page. The loading page will 
  be shown when the network fethching request are done. 
  By default it is set false as we need to show the loading apge only on the fetching process*/
  let [loading, setLoading] = useState(false);

  /* state for setting the display of forgot password modal. It will be shown when the user clicks forgot password
  By default it is set false as we need to show this modal only when the user requires*/
  let [showModal, setShowModal] = useState(false);

  // states for the input field: email and password
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  // We are using the useNavigate hook to navigate to the test page on successfull authentication for Google signups only
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // function for handling google signin
  function handleGoogleSignin() {
    // toggle of the loading page
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

  // function for handling non google login
  function handleLogin(e) {
    // preventing forms default behaviour
    e.preventDefault();

    // toggle of loading page
    setLoading(true);

    // using this function the user will be logged in in firebase
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);

        //After then we are checking for the user credentials email is verified or not
        // If it is verified we will redirect the user to the test page else the error is shown
        if (userCredential.user.emailVerified) {
          navigate("/test");
        } else {
          // Since we know that the user is still logged in firbase, we have to first logged them out and then show the error
          // for the verification process to work
          signOut(auth)
            .then(() => {
              toast.error("Your Email ID is not verified yet!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
              setLoading(false);

              // This will ensure the user is not redirected to the test page
              navigate("/");
            })
            // catch block for signout funtion
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
        }
      })
      // catch block for firebase login function
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

  return (
    <article className="p-4 flex flex-col gap-4">
      {/* login form */}
      <form
        className="flex flex-col text-textColor xs:text-sm"
        onSubmit={handleLogin}
      >
        {/* for heading */}
        <h1 className="text-xl mb-4 text-textColor font-semibold">
          Login to your Account
        </h1>

        {/* email input */}
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
            className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
          >
            Email Address
          </label>
        </div>

        {/* password input */}
        <div className="relative mb-3">
          {/* password show/hide eye for password input box*/}
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
            id="password"
            placeholder="Password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <label
            htmlFor="password"
            className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
          >
            Password
          </label>
        </div>

        {/* forgot password button which will toggle forgot password modal display */}
        <p
          onClick={() => setShowModal(!showModal)}
          className="mb-4 text-textColor text-sm font-bold underline underline-offset-2 cursor-pointer hover:text-[15px] transition-all duration-75 ease-linear self-start"
        >
          Forgot Password?
        </p>

        {/* submit button for login form */}
        <input
          type="submit"
          value="Login"
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
        onClick={handleGoogleSignin}
      >
        <FcGoogle className="text-xl mr-2 xs:text-base" />{" "}
        <div className="xs:text-[13px]">Continue with Google</div>
      </button>

      <p className="text-textColor text-sm xs:text-[13px]">
        <strong>Note:</strong> If you do not have your account with us, Click on{" "}
        <b>SIGNUP</b>
      </p>

      {/* loading page component which will be displayed when the network request are done */}
      {loading && <Loading />}

      {/* forgot password modal*/}
      {showModal && (
        <ForgetPasswordModal show={showModal} setShowModal={setShowModal} />
      )}
    </article>
  );
}
