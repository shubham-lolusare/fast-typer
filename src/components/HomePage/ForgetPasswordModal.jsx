/* eslint-disable react/prop-types */
/* This component is for the users who forgot their password
 It shows the modal where user has to enter their email id and the passowrd
 can be resetted using the link sent on their email id
 */

import { useState } from "react";

// importing icons
import { RxGear, RxCross1 } from "react-icons/rx";

// importing firebase related modules
import { auth } from "../../config/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

// importing toast
import { toast } from "react-toastify";

export default function ForgetPasswordModal({ show, setShowModal }) {
  // state for user email input
  let [email, setEmail] = useState("");

  // state for displaying any error
  let [status, setStatus] = useState("");

  //state for setting the display of spinning gears in modal.
  let [loading, setLoading] = useState(false);

  // function for resetting the password
  function handleReset() {
    // toggle of loading page
    setLoading(true);

    // This function will send the user a password reset email in which he/she can reset the password using the link in mail
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        setStatus("");
        toast.success("Link Sent!!!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          setShowModal(!show);
        }, 2000);
      })
      // catch block for email reset function
      .catch((error) => {
        setStatus("");
        setLoading(false);
        setStatus(error.message);
      });
  }

  return (
    <main className="h-screen w-full fixed top-0 left-0 bg-black/90 flex justify-center items-center mobile:p-4">
      <section className="bg-bgColor relative w-[40%] h-[55%] rounded-xl p-4 text-textColor flex flex-col gap-4 justify-between sm:w-[80%] sm:h-[30%] mobile:h-[50%] mobile:w-full">
        {/* modal closing button */}
        <RxCross1
          className="absolute right-4 top-6 text-textColor hover:text-thematicColor cursor-pointer"
          onClick={() => setShowModal(!show)}
        />

        <article className="flex flex-col gap-4 ">
          {/* heading */}
          <h1 className="text-textColor text-3xl font-bold mobile:text-2xl xs:text-xl">
            Reset your password
          </h1>

          {/* email input */}
          <div className="relative ">
            <input
              type="email"
              className="peer m-0 block h-[58px] w-full rounded border-[1px] border-textColor bg-transparent bg-clip-padding px-3 py-4 font-normal leading-tight text-textColor transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-textColor focus:outline-thematicColor focus:outline-[2px] focus:outline peer-focus:text-textColor [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem] focus:shadow-md "
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

          {/* Error will be shown here if any. Its display is managed by the status state */}
          <div className=" text-textColor font-bold">
            {status !== "" ? status : ""}
          </div>
        </article>

        {/* Asthetic gear icon which starts spinning once the network request is sent 
        Its display is managed by loading state */}
        <article className="flex-1 flex flex-wrap overflow-hidden justify-center items-center text-9xl text-thematicColor xs:text-6xl mobile:text-8xl">
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
          <RxGear className={loading && "animate-spin"} />
        </article>

        {/* Submit button for the modal */}
        <div>
          <button
            onClick={handleReset}
            className="w-full p-2 pl-5 pr-5 font-semibold shadow-md text-textColor bg-thematicColor/80 rounded-lg hover:bg-thematicColor/100 xs:text-sm"
          >
            Send Password Reset Link
          </button>
        </div>
      </section>
    </main>
  );
}
