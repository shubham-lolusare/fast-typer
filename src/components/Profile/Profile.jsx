import Navbar from "../Navbar/Navbar";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Profile() {
  let navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [doj, setDoj] = useState("");
  let [img, setImg] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setEmail(user.email);
        setDoj(user.metadata.creationTime);
        setUsername(user.displayName);
        setImg(user.photoURL);
      } else {
        navigate("/");
      }
    });
  }, [navigate, username, email, doj, img]);

  return (
    <div className="border-2 border-red-500 w-full">
      <Navbar />
      <div className="bg-bgColor">
        <div>
          <img src={img} alt="Profile image" />
          <div>Username: {username}</div>
          <div>Email: {email}</div>
          <div>Day you joined us: {doj}</div>
        </div>
      </div>
    </div>
  );
}
