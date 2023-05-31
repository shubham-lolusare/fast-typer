import { Input, initTE, Ripple } from "tw-elements";
import { useEffect, useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  let [passwordState, setPasswordState] = useState("hide");

  useEffect(() => {
    initTE({ Input, Ripple });
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <form className="flex flex-col gap-2">
        <h1 className="text-2xl mb-4 text-textColor">Register with us</h1>
        <div className="relative mb-3">
          <input
            type="email"
            className="peer m-0 block h-[58px] w-full rounded border-[1px] border-textColor bg-transparent bg-clip-padding px-3 py-4 font-normal leading-tight text-textColor transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-textColor focus:outline-thematicColor focus:outline-[2px] focus:outline peer-focus:text-textColor [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem] focus:shadow-md"
            id="emailID"
            placeholder="Email Address"
            required
          />
          <label
            htmlFor="emailID"
            className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
          >
            Email Address
          </label>
        </div>

        <div className="relative mb-3">
          <input
            type={passwordState === "hide" ? "password" : "text"}
            className="peer m-0 block h-[58px] w-full rounded border-[1px] border-textColor bg-transparent bg-clip-padding px-3 py-4 font-normal leading-tight text-textColor transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-textColor focus:outline-thematicColor focus:outline-[2px] focus:outline peer-focus:text-textColor [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem] focus:shadow-md"
            id="password"
            placeholder="Password"
            required
          />
          <label
            htmlFor="password"
            className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
          >
            Password
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
            id="confPassword"
            placeholder="Confirm Password"
            required
          />
          <label
            htmlFor="confPassword"
            className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-textColor transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-textColor peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
          >
            Confirm Password
          </label>
        </div>

        <button
          data-te-ripple-init
          data-te-ripple-color="light"
          className="w-[50%] p-2 pl-5 pr-5 font-bold shadow-md text-textColor bg-thematicColor/80 rounded-lg tracking-wider hover:bg-thematicColor/100 "
        >
          Register
        </button>
      </form>

      <div className="w-[50%] text-center text-xs font-bold text-textColor">
        OR
      </div>

      <div>
        <button
          data-te-ripple-init
          data-te-ripple-color="light"
          className="w-[50%] p-2 pl-5 pr-5 border-2 border-thematicColor font-bold shadow-md text-textColor bg-transparent rounded-lg tracking-wider"
        >
          <FcGoogle className="inline-block text-xl align-text-bottom mr-2" />
          Continue with Google
        </button>
      </div>
      <p className="text-textColor text-sm">
        <strong>Note:</strong> If you already have your account with us, Click
        on <b>LOGIN</b>
      </p>
    </div>
  );
}
