import ThemeSelector from "../ThemeSelector/ThemeSelector";
import { CgProfile } from "react-icons/cg";
import { HiOutlineHome } from "react-icons/hi";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { IoMdAnalytics } from "react-icons/io";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function Navbar() {
  let navigate = useNavigate();
  let [userName, setUserName] = useState("Profile");
  let [profileUrl, setProfileUrl] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setProfileUrl(user.photoURL);
      }
    });
  });

  return (
    <nav className="border-t-4 border-thematicColor w-full p-4 text-textColor flex justify-between items-center bg-bgColor shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-1 ">
        <div className="text-4xl font-semibold">fast-typer</div>
        <div className="border-2 border-thematicColor h-[50px] animate-cursor-blink"></div>
      </div>
      <div className="flex gap-4">
        <div
          className="flex gap-2 justify-between items-center cursor-pointer"
          onClick={() => {
            navigate("/test");
          }}
        >
          <HiOutlineHome className="text-2xl" /> Home
        </div>
        <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 "></div>

        <div
          className="flex gap-2 justify-between items-center cursor-pointer"
          onClick={() => {
            navigate("/analysis");
          }}
        >
          <IoMdAnalytics className="text-2xl" /> Analysis
        </div>
        <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 "></div>

        <div
          className="flex gap-2 justify-between items-center cursor-pointer"
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

          {auth.currentUser != null ? auth.currentUser.displayName : userName}
        </div>
        <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 "></div>
        <ThemeSelector />
        <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 "></div>
        <div
          className="flex gap-2 justify-between items-center cursor-pointer"
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
          <AiOutlineLogout className="text-2xl" title="Logout" />
        </div>
      </div>
    </nav>
  );
}
