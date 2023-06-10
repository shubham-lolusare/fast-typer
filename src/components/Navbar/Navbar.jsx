/*
This component will serve as the navbar which includes all the pages, Test page analysis page 
feedback portal page and profile page.
It also contains theme selector button and logout button
This navbar is common to all the above mention pages
It dynamically displays the users username and profile avatar
*/

import { useEffect, useState } from "react";

// importing icons
import { CgProfile } from "react-icons/cg";
import { HiOutlineHome } from "react-icons/hi";
import { AiOutlineLogout } from "react-icons/ai";
import { IoMdAnalytics } from "react-icons/io";
import { IoApps } from "react-icons/io5";

// importing firebase related modules
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

// importing react router hook
import { useNavigate } from "react-router-dom";

// importing toast
import { toast } from "react-toastify";

export default function Navbar() {
  // This hook is used to navigate between different routes
  let navigate = useNavigate();

  // This two states are used to dynammically display the username and profile photo
  let [userName, setUserName] = useState("Profile");
  let [profileUrl, setProfileUrl] = useState(null);

  // state for navbar open and close
  let [navShow, setNavShow] = useState(true);

  // logged in user details will be fetched after redndering navbar and the profile photo and username states are set
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setProfileUrl(user.photoURL);
      }
    });

    // navbar reposiveness is decided by this function
    // below 912px the content of navbar is hidden and the option icon is shown
    window.addEventListener("resize", () => {
      if (window.outerWidth > 912) {
        setNavShow(true);
      } else {
        setNavShow(false);
      }
    });

    return window.removeEventListener("resize", () => {
      if (window.outerWidth > 912) {
        setNavShow(true);
      } else {
        setNavShow(false);
      }
    });
  });

  return (
    <nav className="border-t-4 border-thematicColor w-full p-4 text-textColor flex justify-between items-center bg-bgColor shadow-lg sticky top-0 z-50 md:items-start md:gap-4">
      {/* logo */}
      <div className="flex items-center gap-1 ">
        <div className="text-4xl font-semibold">fast-typer</div>
        <div className="border-2 border-thematicColor h-[50px] animate-cursor-blink"></div>
      </div>

      <div className="flex justify-center items-center gap-4 h-full">
        {navShow && (
          <div className="flex gap-4 sm:flex-col sm:w-full sm:absolute sm:top-[80px] sm:left-0 sm:p-4 sm:pl-6 sm:pr-6 sm:z-[1000] sm:bg-bgColor sm:shadow-sm">
            {/* Home tab */}
            <div
              className="flex gap-2 justify-between items-center cursor-pointer sm:justify-start sm:w-full sm:p-3 sm:border sm:border-thematicColor sm:rounded-lg"
              onClick={() => {
                navigate("/test");
              }}
            >
              <HiOutlineHome className="text-2xl" /> Home
            </div>
            <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 sm:hidden"></div>
            {/* Analysis tab */}
            <div
              className="flex gap-2 justify-between items-center cursor-pointer sm:justify-start sm:w-full sm:p-3 sm:border sm:border-thematicColor sm:rounded-lg"
              onClick={() => {
                navigate("/analysis");
              }}
            >
              <IoMdAnalytics className="text-2xl" /> Analysis
            </div>
            <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 sm:hidden"></div>

            {/* profile tab where username and avatar are displayed */}
            <div
              className="flex gap-2 justify-between items-center cursor-pointer sm:justify-start sm:w-full sm:p-3 sm:border sm:border-thematicColor sm:rounded-lg"
              onClick={() => {
                navigate("/profile");
              }}
            >
              {profileUrl != null ? (
                <div className="w-[40px] h-[40px] rounded-full">
                  <img
                    src={
                      auth.currentUser != null
                        ? auth.currentUser.photoURL
                        : profileUrl
                    }
                    alt="Profile image"
                    className="object-contain w-full h-full rounded-full bg-thematicColor"
                  />
                </div>
              ) : (
                <CgProfile className="text-2xl" />
              )}

              {auth.currentUser != null
                ? auth.currentUser.displayName
                : userName}
            </div>
            <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 sm:hidden "></div>

            {/* log out button */}
            <div
              className="flex gap-2 justify-between items-center cursor-pointer sm:justify-start sm:w-full sm:p-3 sm:border sm:border-thematicColor sm:rounded-lg sm:order-1"
              onClick={() => {
                signOut(auth)
                  .then(() => {
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
              }}
            >
              <AiOutlineLogout className="text-2xl" title="Logout" />{" "}
              <div>Log Out</div>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            setNavShow(!navShow);
          }}
          className="justify-center items-center mobile:h-[60px] hidden sm:flex"
        >
          <IoApps className="text-4xl text-thematicColor hover:outline hover:outline-[10px] hover:outline-thematicColor/20 hover:rounded xs:text-2xl" />
        </button>
      </div>
    </nav>
  );
}
