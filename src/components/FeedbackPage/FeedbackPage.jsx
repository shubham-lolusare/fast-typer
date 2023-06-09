import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import Loading from "../LoadingPage/LoadingPage";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { db, auth } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import loadingImage from "../LoadingPage/loading_animation.svg";
import { FaUserCircle } from "react-icons/fa";

export default function Feedback() {
  let [feedback, setFeedback] = useState("");
  let [rating, setRating] = useState(1);
  let [userName, setUserName] = useState();
  let [email, setEmail] = useState();
  let [loading, setLoading] = useState(false);
  let [profileUrl, setProfileUrl] = useState();
  let [feedbackPostArr, setFeedbackPostArr] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setEmail(user.email);
        setProfileUrl(user.photoURL);
      }
    });

    getData()
      .then((data) => {
        setFeedbackPostArr(() => {
          return data.map((dataObj, index) => {
            return (
              <article
                key={index + 1}
                className="w-full border border-thematicColor p-4 rounded-2xl shadow-md flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-[50px] h-[50px] rounded-full shadow-md">
                      {dataObj.profileUrl == null ||
                      dataObj.profileUrl == "" ? (
                        <FaUserCircle />
                      ) : (
                        <img src={loadingImage} />
                      )}
                    </div>
                    <div className="text-base font-semibold">
                      {dataObj.username}
                    </div>
                  </div>
                  <div className="text-base font-semibold">{dataObj.email}</div>
                </div>
                <div className="text-xl text-textColor">{dataObj.text}</div>
                <div className="flex justify-between">
                  <div className="flex">{getStars(dataObj.rating)}</div>
                  <div>{dataObj.timeStamp}</div>
                </div>
              </article>
            );
          });
        });
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
  }, []);

  function handlePostFeedback(e) {
    e.preventDefault();
    setLoading(true);

    if (feedback != "") {
      addDoc(collection(db, "feedback"), {
        username: userName,
        email: email,
        text: feedback,
        rating: rating,
        profilePic: profileUrl,
        timeStamp: JSON.stringify(new Date()),
      })
        .then(() => {
          setLoading(false);
          setFeedback("");
          setRating(1);
          toast.success("Thankyou for your feedback!!!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        })
        .catch((error) => {
          setFeedback("");
          setRating(1);
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
      toast.error("Please provide valid feedback", {
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
    <main className="bg-bgColor w-full h-screen flex flex-col transition-all duration-500 ease-in-out animate-fade-in">
      <ToastContainer />
      <Navbar />
      <section className="w-full border-2 border-black flex flex-col items-center p-4 tracking-wider gap-4">
        <section className="w-[80%] flex flex-col items-center gap-6">
          <h1 className="text-3xl text-textColor font-bold">Feedback Portal</h1>
          <form
            className="w-full p-4 flex flex-col gap-4 shadow-lg rounded-2xl"
            onSubmit={handlePostFeedback}
          >
            <h1 className="text-2xl font-semibold text-textColor">
              Post your feedback here
            </h1>

            <textarea
              name="feedbackText"
              id="feedbackText"
              className="p-4 min-h-[150px] w-full bg-transparent border text-textColor rounded-xl border-textColor focus:outline focus:outline-2 focus:outline-thematicColor"
              placeholder="Enter here..."
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
              }}
            ></textarea>

            <div className="flex text-xl font-semibold text-textColor items-center gap-2">
              <div>Rating:</div>
              <div className="flex">
                {rating >= 1 ? (
                  <AiFillStar
                    className="text-2xl text-thematicColor"
                    onClick={() => {
                      setRating(1);
                    }}
                  />
                ) : (
                  <AiOutlineStar
                    className="text-2xl "
                    onClick={() => {
                      setRating(1);
                    }}
                  />
                )}{" "}
                {rating >= 2 ? (
                  <AiFillStar
                    className="text-2xl text-thematicColor"
                    onClick={() => {
                      setRating(2);
                    }}
                  />
                ) : (
                  <AiOutlineStar
                    className="text-2xl"
                    onClick={() => {
                      setRating(2);
                    }}
                  />
                )}
                {rating >= 3 ? (
                  <AiFillStar
                    className="text-2xl text-thematicColor"
                    onClick={() => {
                      setRating(3);
                    }}
                  />
                ) : (
                  <AiOutlineStar
                    className="text-2xl"
                    onClick={() => {
                      setRating(3);
                    }}
                  />
                )}
                {rating >= 4 ? (
                  <AiFillStar
                    className="text-2xl text-thematicColor"
                    onClick={() => {
                      setRating(4);
                    }}
                  />
                ) : (
                  <AiOutlineStar
                    className="text-2xl"
                    onClick={() => {
                      setRating(4);
                    }}
                  />
                )}
                {rating == 5 ? (
                  <AiFillStar
                    className="text-2xl text-thematicColor"
                    onClick={() => {
                      setRating(5);
                    }}
                  />
                ) : (
                  <AiOutlineStar
                    className="text-2xl"
                    onClick={() => {
                      setRating(5);
                    }}
                  />
                )}
              </div>
            </div>

            <input
              type="submit"
              value="Post"
              className="self-start p-2 pl-12 pr-12 bg-thematicColor/80 rounded-lg text-textColor text-lg font-semibold hover:bg-thematicColor cursor-pointer"
            />
          </form>
        </section>
        {feedbackPostArr.length != 0 && (
          <section className="w-[80%] flex flex-col items-center gap-6 shadow-lg rounded-2xl p-4 pt-8">
            <h1 className="text-2xl font-semibold text-textColor self-start">
              Feedback posted by our users
            </h1>

            <section className="w-full flex flex-col gap-4">
              {/* <article className="w-full border border-thematicColor p-4 rounded-2xl shadow-md flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-[50px] h-[50px] rounded-full shadow-md flex justify-center items-center text-4xl text-bgColor bg-thematicColor">
                    <img src={loadingImage} />
                    <FaUserCircle />
                  </div>
                  <div className="text-base font-semibold">
                    shubham lolusare
                  </div>
                </div>
                <div className="text-base font-semibold">
                  shubhamlolusare@gmail.com
                </div>
              </div>
              <div className="text-xl text-textColor">
                skjsfjdsdsjkdsjdskjsdjkdsjdsjndjsdjsddsjssdsdsdjknjdjdskj
              </div>
              <div className="flex justify-between">
                <div className="flex">{getStars(4)}</div>
                <div>12 / 06 / 2023</div>
              </div>
            </article> */}
              {feedbackPostArr}
            </section>
          </section>
        )}
      </section>
      {loading && <Loading />}
    </main>
  );
}

async function getData() {
  let feedBackArrObj = [];
  const querySnapshot = await getDocs(collection(db, "feedback"));
  querySnapshot.forEach((doc) => {
    feedBackArrObj.push(doc.data());
  });
  feedBackArrObj.sort((a, b) => {
    if (JSON.parse(b.timeStamp) > JSON.parse(a.timeStamp)) return 1;
    else return -1;
  });
  return feedBackArrObj;
}

function getStars(num) {
  let starArr = [];

  for (let i = 0; i < num; i++) {
    starArr.push(<AiFillStar className="text-2xl text-thematicColor" />);
  }

  for (let i = 0; i < 5 - num; i++) {
    starArr.push(<AiOutlineStar className="text-2xl" />);
  }

  return starArr;
}
