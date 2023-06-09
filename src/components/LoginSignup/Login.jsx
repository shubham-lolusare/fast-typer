import { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Loading from "../LoadingPage/LoadingPage";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../config/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ForgetPasswordModal from "../ForgetPasswordModal/ForgetPasswordModal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  let [passwordState, setPasswordState] = useState("hide");
  let [loading, setLoading] = useState(false);
  let [showModal, setShowModal] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  function handleGoogleSignin() {
    setLoading(true);

    signInWithPopup(auth, googleProvider)
      .then(() => {
        setLoading(false);
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

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        if (userCredential.user.emailVerified) {
          navigate("/test");
        } else {
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
              navigate("/");
            })
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
    <div className="p-4 flex flex-col gap-4">
      <form className="flex flex-col" onSubmit={handleLogin}>
        <h1 className="text-xl mb-4 text-textColor font-semibold">
          Login into your Account
        </h1>
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

        <div className="relative mb-3">
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

        <p
          onClick={() => setShowModal(!showModal)}
          className="mb-4 text-textColor text-sm font-bold underline underline-offset-2 cursor-pointer hover:text-[15px] transition-all duration-75 ease-linear"
        >
          Forgot Password?
        </p>

        <input
          type="submit"
          value="Login"
          className="cursor-pointer w-[50%] p-2 pl-5 pr-5 font-bold shadow-md text-textColor bg-thematicColor/80 rounded-lg tracking-wider hover:bg-thematicColor/100 "
        />
      </form>

      <div className="w-[50%] text-center text-xs font-bold text-textColor">
        OR
      </div>

      <div>
        <button
          className="w-[50%] p-2 pl-5 pr-5 border-2 border-thematicColor font-bold shadow-md text-textColor bg-transparent rounded-lg tracking-wider"
          onClick={handleGoogleSignin}
        >
          <FcGoogle className="inline-block text-xl align-text-bottom mr-2" />
          Continue with Google
        </button>
      </div>
      <ToastContainer />
      <p className="text-textColor text-sm">
        <strong>Note:</strong> If you do not have your account with us, Click on{" "}
        <b>SIGNUP</b>
      </p>
      {loading && <Loading />}
      {showModal && (
        <ForgetPasswordModal show={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
}
