/* eslint-disable react/prop-types */
import { RxCross1, RxGear } from "react-icons/rx";
import { useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { deleteUser, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

export default function DeleteAccModal({ setDeleteAccModal }) {
  let [loading, setLoading] = useState(false);
  let [passwordState, setPasswordState] = useState("hide");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();

  function deleteAccount() {
    setLoading(true);
    if (password != "") {
      signInWithEmailAndPassword(auth, auth.currentUser.email, password)
        .then(() => {
          deleteUser(auth.currentUser)
            .then(() => {
              navigate("/");
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
    <div className="h-screen w-full absolute top-0 left-0 bg-black/90 flex justify-center items-center">
      <div className="bg-bgColor relative w-[40%] h-[55%] rounded-xl p-4 text-textColor flex flex-col gap-4 justify-between">
        <RxCross1
          className="absolute right-4 top-8 text-textColor hover:text-thematicColor cursor-pointer"
          onClick={() => setDeleteAccModal(false)}
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-textColor text-4xl font-bold">
            Are you sure you want to delete your account ??
          </h1>
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
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
            >
              Enter your password to delete your account
            </label>
          </div>
        </div>
        <div className="flex-1 flex flex-wrap overflow-hidden justify-center items-center text-9xl text-thematicColor">
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
        </div>
        <div className="flex gap-4">
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
            className="w-full p-2 pl-5 pr-5 font-semibold shadow-md text-textColor bg-thematicColor/80 rounded-lg hover:bg-thematicColor/100 "
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
