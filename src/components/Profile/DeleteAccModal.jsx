/* eslint-disable react/prop-types */

// this component will let the user to delete their account after entering the account password

import { useState } from "react";

// importin icons
import { RxCross1, RxGear } from "react-icons/rx";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

// importing firebase related modules
import { auth } from "../../config/firebaseConfig";
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";

// importing toast
import { toast } from "react-toastify";

// import react-router hook
import { useNavigate } from "react-router-dom";

export default function DeleteAccModal({ setDeleteAccModal }) {
  //state for setting the display of spinning gears in modal.
  let [loading, setLoading] = useState(false);

  // This state is used to toggle the hide and show of the password in input box using the eye icon
  let [passwordState, setPasswordState] = useState("hide");

  // state for storing the input password
  let [password, setPassword] = useState("");

  let navigate = useNavigate();

  // for deleteing the user account we need them to re-authenticate first and then delete them from firebase
  // this function let us do that
  function deleteAccount() {
    setLoading(true);
    if (password != "") {
      signInWithEmailAndPassword(auth, auth.currentUser.email, password)
        .then(() => {
          deleteUser(auth.currentUser)
            .then(() => {
              navigate("/");
            })
            // deleteUser function cathc block
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
        })
        // sign in catch block
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
      toast.error("Enter valid password", {
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
    <main className="p-4 h-screen w-screen fixed top-0 left-0 bg-black/90 flex justify-center items-center z-[2000]">
      <section className="bg-bgColor relative w-[50%] h-[60%] rounded-xl p-4 text-textColor flex flex-col gap-4 justify-between md:w-[70%] sm:h-[40%] mobile:h-[50%] mobile:w-full tall:h-[70%]">
        <RxCross1
          className="absolute right-4 top-8 text-textColor hover:text-thematicColor cursor-pointer"
          onClick={() => setDeleteAccModal(false)}
        />
        <article className="flex flex-col gap-4">
          {/* heading */}
          <h1 className="text-textColor text-4xl font-bold pr-8 mobile:text-2xl xs:text-xl mobile:pr-6">
            Are you sure you want to delete your account ??
          </h1>

          {/* email input */}
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
              placeholder="Enter your password to delete your account"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label
              htmlFor="password"
              className="mobile:text-[12px] xs:text-[10px] pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 mobile:py-5 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
            >
              Enter your password
            </label>
          </div>
        </article>

        {/* Asthetic gear icon which starts spinning once the network request is sent 
        Its display is managed by loading state */}
        <article className="flex-1 flex w-full flex-wrap overflow-hidden justify-center items-center text-9xl text-thematicColor xs:text-6xl mobile:text-8xl">
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
        </article>

        {/* Submit button for the modal */}
        <div className="flex gap-4 xs:gap-2 xs:text-sm">
          <button
            onClick={deleteAccount}
            className="w-full p-2 pl-5 pr-5 font-semibold shadow-md text-textColor bg-thematicColor/80 rounded-lg hover:bg-thematicColor/100 "
          >
            Yes
          </button>
          <button
            onClick={() => {
              setDeleteAccModal(false);
            }}
            className="w-full p-2 pl-5 pr-5 font-semibold shadow-md text-textColor bg-thematicColor/80 rounded-lg hover:bg-thematicColor/100 xs:text-sm"
          >
            No
          </button>
        </div>
      </section>
    </main>
  );
}
