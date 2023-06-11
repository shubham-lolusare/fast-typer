/**
 * This component shows the user profile details
 * From here the user is able to select the profile picture, update user name , reset password and
 * even delete the account
 */
import { useEffect, useState } from "react";
import "./Profile.css";

// importing components
import Navbar from "../Navbar/Navbar";
import LoadingPage from "../LoadingPage/LoadingPage";
import SetUserNameModal from "./SetUserNameModal";
import DeleteAccModal from "./DeleteAccModal";
import FooterTabs from "../FooterTabs/FooterTabs";

// importing toast
import { toast } from "react-toastify";

// importing react-router hook
import { useNavigate } from "react-router-dom";

// importing icons
import { FaUserAlt } from "react-icons/fa";

// importing firbase related modules
import { auth, storage } from "../../config/firebaseConfig";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

export default function Profile() {
  let navigate = useNavigate();

  // state to save the user details: username, email, date of joining
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [doj, setDoj] = useState("");
  let [img, setImg] = useState("");

  /* state for setting the display of loading page. The loading page will 
  be shown when the network fethching request are done. 
  By default it is set true becoz we want the loading page to be shown first till the 
  user data is fetched*/
  let [loading, setLoading] = useState(true);

  // state for modal to set userr name
  let [userNameModal, setUserNameModal] = useState(false);

  // state for modal to delete account
  let [deleteAccModal, setDeleteAccModal] = useState(false);

  // state for storing the profile image and uid for which userr to change
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

  // This function handles the reset password functionality
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

  // this function show the username change modal. User name change is done in SetUserName modal
  function handleSetUserName() {
    setUserNameModal(true);
  }

  // this function show the delete account modal. Delete account is done in DeleteAccount modal
  function handleDeleteAccount() {
    setDeleteAccModal(true);
  }

  // this function handles the change of user profile picture
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
                // catch block for update profile
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
            // catch block for getDownloadurl function
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
        // catch block for uploadBytes function
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
    <main className="w-full h-screen flex flex-col animate-fade-in tracking-wider transition-all duration-500 ease-in-out mobile:h-max">
      <Navbar />

      <section className="bg-bgColor h-full flex justify-center items-center p-4 text-base tall:items-start tall:pb-16">
        <section className="border border-thematicColor flex w-[60%] flex-col gap-4 items-center rounded-xl shadow-lg p-4 md:w-[80%] sm:w-full xs:gap-2">
          <header className="text-4xl font-bold text-textColor mobile:text-3xl xs:text-xl">
            Your Profile Details
          </header>

          {/* profile picture */}
          <article className="w-full flex flex-col gap-4 justify-center items-center">
            {/* Profile pic with details */}
            <div className="w-full flex gap-8 tall:gap-0 mobile:flex-col mobile:gap-2">
              <div className="basis-[250px] flex-shrink-0 flex w-[250px] h-[200px] justify-center items-center mobile:w-full">
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

              {/* user details */}
              <article className="p-4 flex-1 flex flex-col justify-center w-full text-textColor gap-4 mobile:p-2 mobile:items-center xs:gap-2">
                <div className="text-5xl font-bold text-thematicColor mobile:text-4xl xs:text-2xl">
                  {auth.currentUser != null
                    ? auth.currentUser.displayName
                    : username}
                </div>

                <div className="text-xl xs:text-base">
                  {auth.currentUser != null ? auth.currentUser.email : email}
                </div>
                <div className="text-sm xs:text-[10px]">DOJ: {doj}</div>
              </article>
            </div>

            {/* profile pic changeing div */}
            <div className="w-full flex-1 flex items-center gap-2 mobile:flex-col mobile:gap-4 xs:gap-2">
              <div className="flex-[0.6] mobile:w-full">
                <input
                  className="w-full p-1 rounded-md file:bg-thematicColor file:outline-0 border border-thematicColor text-textColor file:text-textColor shadow-md file:cursor-pointer cursor-pointer xs:text-sm"
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
                className="text-textColor h-full flex-[0.4] shadow-md rounded-md p-2 bg-thematicColor/90 cursor-pointer hover:bg-thematicColor mobile:w-full xs:text-sm"
              >
                Update profile photo
              </button>
            </div>
          </article>

          {/* functional buttons */}
          <article className="flex w-full gap-2 justify-between items-center text-textColor md:justify-center xs:flex-col xs:text-sm">
            <button
              onClick={handleResetPassword}
              className="flex-1 p-2 rounded-md shadow-md bg-thematicColor/90 cursor-pointer hover:bg-thematicColor xs:w-full"
            >
              Reset Password
            </button>
            <button
              onClick={handleSetUserName}
              className="flex-1 p-2 rounded-md shadow-md bg-thematicColor/90 cursor-pointer hover:bg-thematicColor xs:w-full"
            >
              Change Username
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 p-2 rounded-md shadow-md bg-thematicColor/90 cursor-pointer hover:bg-thematicColor xs:w-full"
            >
              Delete your account
            </button>
          </article>
        </section>

        {/* footer tabs */}
        <footer className="fixed bottom-0 rounded-t-xl p-2 bg-thematicColor text-textColor shadow-lg flex justify-center items-center gap-2">
          <FooterTabs />
        </footer>
      </section>

      {loading && <LoadingPage />}

      {userNameModal && (
        <SetUserNameModal setUserNameModal={setUserNameModal} />
      )}

      {deleteAccModal && (
        <DeleteAccModal setDeleteAccModal={setDeleteAccModal} />
      )}
    </main>
  );
}
