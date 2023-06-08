import Navbar from "../Navbar/Navbar";
import { auth, storage } from "../../config/firebaseConfig";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import "./Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "../LoadingPage/LoadingPage";
import SetUserNameModal from "./SetUserNameModal";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import DeleteAccModal from "./DeleteAccModal";

export default function Profile() {
  let navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [doj, setDoj] = useState("");
  let [img, setImg] = useState("");
  let [loading, setLoading] = useState(true);
  let [userNameModal, setUserNameModal] = useState(false);
  let [deleteAccModal, setDeleteAccModal] = useState(false);
  let [imageFile, setImageFile] = useState(null);
  let [uid, setUid] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setDoj(user.metadata.creationTime);
        setUsername(user.displayName);
        setImg(user.photoURL);
        setLoading(false);
        setUid(user.uid);
      } else {
        navigate("/");
      }
    });
  }, [navigate, username, email, doj, img]);

  function handleResetPassword() {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {})
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

  function handleSetUserName() {
    setUserNameModal(true);
  }

  function handleDeleteAccount() {
    setDeleteAccModal(true);
  }

  function handleUpdateProfilePic() {
    setLoading(true);

    if (imageFile != null) {
      const imageRef = ref(storage, uid);
      uploadBytes(imageRef, imageFile)
        .then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              updateProfile(auth.currentUser, {
                photoURL: url,
              })
                .then(() => {
                  setLoading(false);
                  setImg(url);
                  toast.success("Profile image updated successfully", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
                  setImageFile(null);
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
      toast.error("Please select a valid file", {
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
    <div className="w-full h-screen flex flex-col">
      <ToastContainer />
      <Navbar />
      <div className="bg-bgColor flex-1 flex justify-center p-4">
        <div className="flex w-[40%] flex-col justify-between gap-4 items-center rounded-3xl shadow-lg p-4">
          <h1 className="text-4xl font-bold text-textColor">
            Your Profile Details
          </h1>
          <div className="w-[40%] flex flex-col gap-4 justify-center items-center">
            <div className="flex w-[250px] h-[200px] justify-center items-center ">
              {img != null ? (
                <img
                  src={
                    auth.currentUser != null ? auth.currentUser.photoURL : img
                  }
                  alt="Profile image"
                  className="object-contain w-full h-full border-l-[20px] border-r-[20px] border-thematicColor imageBorder"
                />
              ) : (
                <FaUserAlt className="text-[200px]" />
              )}
            </div>
            <div>
              <div className="mb-3">
                <input
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-textColor bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-textColor transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-thematicColor/90 file:px-3 file:py-[0.32rem] file:cursor-pointer file:text-textColor file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-thematicColor focus:border-primary focus:text-textColor focus:shadow-te-primary focus:outline focus:outline-2 focus:outline-thematicColor"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <button
                onClick={handleUpdateProfilePic}
                className=" w-full p-2 pl-6 pr-6 rounded-xl shadow-md bg-thematicColor cursor-pointer"
              >
                Update profile photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[max-content_minmax(0px,_1fr)] gap-2 place-content-evenly text-textColor">
            <div className="border-textColor border p-3 rounded-lg font-semibold">
              Username{" "}
            </div>
            <div className="border-textColor border p-3 rounded-lg">
              {auth.currentUser != null
                ? auth.currentUser.displayName
                : username}
            </div>
            <div className="border-textColor border p-3 rounded-lg font-semibold">
              Email Address
            </div>
            <div className="border-textColor border p-3 rounded-lg">
              {auth.currentUser != null ? auth.currentUser.email : email}
            </div>
            <div className="border-textColor border p-3 rounded-lg font-semibold">
              Day you joined us
            </div>
            <div className="border-textColor border p-3 rounded-lg">{doj}</div>
          </div>

          <div className="flex w-full gap-4 justify-center items-center text-textColor">
            <button
              onClick={handleResetPassword}
              className="p-2 pl-6 pr-6 rounded-xl shadow-md bg-thematicColor cursor-pointer"
            >
              Reset Password
            </button>
            <button
              onClick={handleSetUserName}
              className="p-2 pl-6 pr-6 rounded-xl shadow-md bg-thematicColor cursor-pointer"
            >
              Change Username
            </button>
            <button
              onClick={handleDeleteAccount}
              className="p-2 pl-6 pr-6 rounded-xl shadow-md bg-thematicColor cursor-pointer"
            >
              Delete your account
            </button>
          </div>
        </div>
      </div>
      {loading && <LoadingPage />}
      {userNameModal && (
        <SetUserNameModal setUserNameModal={setUserNameModal} />
      )}
      {deleteAccModal && (
        <DeleteAccModal setDeleteAccModal={setDeleteAccModal} />
      )}
    </div>
  );
}
