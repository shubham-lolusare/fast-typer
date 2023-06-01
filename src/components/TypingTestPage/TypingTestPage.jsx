import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
export default function TypingTestPage() {
  let auth = getAuth();
  let navigate = useNavigate();

  return (
    <div>
      typing test page
      <button
        onClick={() => {
          signOut(auth)
            .then(() => {
              alert("Loged out");
              navigate("/");
            })
            .catch((error) => {
              alert(error.message);
            });
        }}
      >
        Signout
      </button>
    </div>
  );
}
