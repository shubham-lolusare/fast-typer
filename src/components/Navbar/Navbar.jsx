import ThemeSelector from "../ThemeSelector/ThemeSelector";
import { CgProfile } from "react-icons/cg";
import { HiOutlineHome } from "react-icons/hi";
import { VscGitCompare } from "react-icons/vsc";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";

export default function Navbar() {
  let navigate = useNavigate();

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
            onAuthStateChanged(auth, (user) => {
              if (user) {
                navigate("/test");
              } else {
                navigate("/");
              }
            });
          }}
        >
          <HiOutlineHome className="text-2xl" /> Home
        </div>
        <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 "></div>
        <div
          className="flex gap-2 justify-between items-center cursor-pointer"
          onClick={() => {
            onAuthStateChanged(auth, (user) => {
              if (user) {
                navigate("/compare");
              } else {
                navigate("/");
              }
            });
          }}
        >
          <VscGitCompare className="text-2xl" /> Compare
        </div>
        <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 "></div>
        <div
          className="flex gap-2 justify-between items-center cursor-pointer"
          onClick={() => {
            onAuthStateChanged(auth, (user) => {
              if (user) {
                navigate("/profile");
              } else {
                navigate("/");
              }
            });
          }}
        >
          <CgProfile className="text-2xl" /> Profile
        </div>
        <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 "></div>
        <div
          className="flex gap-2 justify-between items-center cursor-pointer"
          onClick={() => {
            signOut(auth)
              .then(() => {
                navigate("/");
              })
              .catch((error) => {
                alert(error.message);
              });
          }}
        >
          <AiOutlineLogout className="text-2xl" /> Logout
        </div>
        <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-thematicColor opacity-100 "></div>
        <ThemeSelector />
      </div>
    </nav>
  );
}
