/**
 * THis component is used toprovide feedback by the user
 * User can post the comments and rating
 * All the data will be stored in firebase in seperate collection
 *
 */
import { useEffect, useState } from "react";

// importing components
import Navbar from "../Navbar/Navbar";
import Loading from "../LoadingPage/LoadingPage";
import ThemeSelector from "../ThemeSelector/ThemeSelector";

// inporting toast
import { toast } from "react-toastify";

// importing icons
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

// importing react-router hook
import { useNavigate } from "react-router-dom";

// importing firebase related modules
import { db, auth } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Feedback() {
  // state for storing inputs
  let [feedback, setFeedback] = useState("");
  let [rating, setRating] = useState(1);
  let [userName, setUserName] = useState();
  let [email, setEmail] = useState();
  let [profileUrl, setProfileUrl] = useState(null);

  // state for manipulating display of loading page
  let [loading, setLoading] = useState(false);

  // state for storing the array of feedback post fetched from firebase
  let [feedbackPostArr, setFeedbackPostArr] = useState([]);

  // State for showing or hiding feedback posts
  let [showFeedbackPost, setShowFeedbackPost] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setEmail(user.email);
        setProfileUrl(user.photoURL);
      } else {
        navigate("/");
      }
    });
  });

  // this function handle the feedback input and posting of feedback to firestore
  function handlePostFeedback(e) {
    e.preventDefault();
    setLoading(true);
    setShowFeedbackPost(false);

    if (feedback != "") {
      addDoc(collection(db, "feedback"), {
        username: userName,
        email: email,
        text: feedback,
        rating: rating,
        profilePic: profileUrl,
        timeStamp: new Date(),
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
        // add doc catch block
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

  // this function will handle the fetching of the feedback posts from firestore
  function handleGetFeedback() {
    setShowFeedbackPost(true);
    setLoading(true);
    getData()
      .then((data) => {
        setLoading(false);
        setFeedbackPostArr(() => {
          return data.map((dataObj, index) => {
            return (
              <article
                key={index + 1}
                className="w-full border border-thematicColor p-4 rounded-2xl shadow-md flex flex-col gap-4"
              >
                {/* profile pic and email */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-[40px] h-[40px] rounded-full shadow-md flex justify-center items-center text-4xl text-bgColor bg-thematicColor">
                      {dataObj.profilePic == null ||
                      dataObj.profilePic == "" ? (
                        <FaUserCircle />
                      ) : (
                        <img
                          src={dataObj.profilePic}
                          className="object-contain w-full h-full rounded-full"
                        />
                      )}
                    </div>
                    <div className="text-base font-semibold">
                      {dataObj.username}
                    </div>
                  </div>
                  <div className="text-base font-semibold mobile:hidden">
                    {dataObj.email}
                  </div>
                </div>

                {/* comment */}
                <div className="text-xl text-textColor w-full xs:text-base">
                  {dataObj.text}
                </div>

                {/* stars and time stamp */}
                <div className="flex justify-between mobile:flex-col mobile:gap-2">
                  <div className="flex xs:text-sm">
                    {getStars(dataObj.rating)}
                  </div>
                  <div className="text:[11px] xs:text-[9px]">
                    {getPostDateAndTime(dataObj.timeStamp)}
                  </div>
                </div>
              </article>
            );
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
  }

  return (
    <main className="bg-bgColor w-full h-screen flex flex-col transition-all duration-500 ease-in-out animate-fade-in">
      <Navbar />
      <section className="w-full flex flex-col items-center p-4 tracking-wider gap-4 pb-16">
        <section className="w-[80%] flex flex-col items-center gap-4 mobile:w-full">
          <h1 className="text-3xl text-textColor font-bold pt-6">
            Feedback Portal
          </h1>
          <form
            className="w-full p-4 flex flex-col gap-4 shadow-lg rounded-2xl"
            onSubmit={handlePostFeedback}
          >
            <h1 className="text-2xl font-semibold text-textColor xs:text-lg">
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
              <div className="xs:text-base">Rating:</div>
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
              className="self-start p-2 pl-12 pr-12 bg-thematicColor/80 rounded-lg text-textColor text-lg font-semibold hover:bg-thematicColor cursor-pointer xs:pl-6 xs:pr-6"
            />
          </form>
        </section>

        <section className="w-[80%] flex flex-col items-center gap-6 rounded-2xl pt-8 mobile:w-full">
          <h1 className="text-2xl font-semibold text-textColor self-start xs:text-xl">
            Feedback posted by our users
          </h1>

          {showFeedbackPost == false && (
            <button
              onClick={handleGetFeedback}
              className="self-start p-2 pl-12 pr-12 bg-thematicColor/80 rounded-lg text-textColor text-lg font-semibold hover:bg-thematicColor cursor-pointer"
            >
              Show Posts
            </button>
          )}
          {showFeedbackPost && (
            <section className="w-full flex flex-col gap-4">
              {feedbackPostArr.length != 0 ? feedbackPostArr : "No posts yet"}
            </section>
          )}
        </section>
        <footer className="fixed bottom-0 rounded-t-xl p-2 bg-thematicColor text-textColor shadow-lg flex justify-center items-center gap-2">
          <ThemeSelector />
        </footer>
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
    if (b.timeStamp > a.timeStamp) return 1;
    else return -1;
  });
  return feedBackArrObj;
}

function getStars(num) {
  let starArr = [];

  for (let i = 0; i < num; i++) {
    starArr.push(
      <AiFillStar className="text-2xl text-thematicColor" key={`f${i + 1}`} />
    );
  }

  for (let i = 0; i < 5 - num; i++) {
    starArr.push(<AiOutlineStar className="text-2xl" key={`nf${i + 1}`} />);
  }

  return starArr;
}

function getPostDateAndTime(dateObj) {
  let date = new Date(dateObj.toDate());
  return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
}
