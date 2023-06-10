/* eslint-disable react/prop-types */
/*
  This is the time mode typing test component

  In this mode the user will be give a time slot in which he have to type as much words as he can 
  and the words per min will be calculated accordingly

  After taking test the user results are posted to the firebase automatically

  There are various time modes in for which the user have to select but by default 1 min time slot is selected
*/

import { createRef, useEffect, useMemo, useRef, useState } from "react";
import "./TypingTestPage.css";

// importing random words module
import randomWords from "random-words";

// importing components
import Keyboard from "./Keyboard";
import TimeModeResultModal from "./TimeModeResultModal";
import LoadingPage from "../LoadingPage/LoadingPage";

// importing toast
import { toast } from "react-toastify";

// importing react router hook
import { useNavigate } from "react-router-dom";

// importing firebase related modules
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";
import { db } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function TimeModePage({ setTestMode }) {
  // state for storing the random words generated

  let [words, setWords] = useState(randomWords({ min: 300, max: 2000 }));

  // state for storing the dom reference of input and the typing box resp.
  let inputRef = useRef(null);
  let typingBox = useRef(null);

  // state for storing the current key press
  let [keypress, setKeyPress] = useState();

  /* states for storing the word index and character index
  So the algorithm is that, we are bifurcating the words generated, in words div and the respective word's character div
  So lets say the random words generated is ["shubham","rakesh"]
  So we are bifurcating it in to following html
  <div>
    <div>
      <div>s</div>
      <div>h</div>
      <div>u</div>
      <div>b</div>
      <div>h</div>
      <div>a</div>
      <div>m</div>
    </div>
    <div>
      <div>r</div>
      <div>a</div>
      <div>k</div>
      <div>e</div>
      <div>s</div>
      <div>h</div>
    </div>
 </div>
 so in this way we will be able to cross check the letters and words typed by the user are correct or not
 In dom to represent the pointer references for calculation we are creating two indexes
 word index to keep the track of the word that the user currently is typing
 and char index to keep the track of the character in the word the user is typing.
  */
  let [wordIndex, setWordIndex] = useState(0);
  let [charIndex, setCharIndex] = useState(0);

  /*using above algorithm we will be able to checck the correct word count, correct characte count which will be 
  represented by the below two states*/
  let [correctWordCount, setCorrectWordCount] = useState(0);
  let [correctCharCount, setCorrectCharCount] = useState(0);

  // This state is use to manage the display of result modal
  let [showResultModal, setShowResultModal] = useState(false);

  // This state is responsible to store the current state of the state
  let [testState, setTestState] = useState("");

  /*state for setting the display of loading page. The loading page will 
  be shown when the network fethching request are done. */
  let [loading, setLoading] = useState(false);

  // this state is used for setting the timer and displying the second remaining
  let [count, setCount] = useState(60);

  // this states are used to store the uid of the current user and their email name to generate the firestore collection segment
  let [uid, setUid] = useState();
  let [userEmailName, setUserEmailName] = useState();

  /* This state is used for storing the time slot values
  The allowed slots are 15s, 30s, 1min and 5min
  */
  let [selectedTime, setSelectedTime] = useState(60);

  // this hook is used for the navigation to other routes
  let navigate = useNavigate();

  /* So according to the above discussed algorithm we will be requiring the dom references
  for the word. DOM references are note requied for individual characters as we can easily access them using the
  word DOM references.
  To get that references we are creating the references with the help of createRef() function and then storing it in array
  Since it is a expensive calcultion we are memoizing it with the help of useMemo() hook and it will only be executed 
  when the generated words in the words state changes.
  */
  let wordRefArr = useMemo(() => {
    return Array(words.length)
      .fill(0)
      .map(() => {
        return createRef(null);
      });
  }, [words]);

  /*According to the above discussed algorithm we are creating the DOM elements
  Since the DOM elements creation is a very expensive calculation we are memoizing it and the new DOM element swill only be created
  if the words state changes
  We will also add the above created DOM reference references to the individual words element
  */
  let wordData = useMemo(() => {
    return words.map((word, index) => {
      return (
        <div key={index} className="flex" ref={wordRefArr[index]}>
          {word.split("").map((char, index) => {
            return (
              <div
                className="box-border w-[40px] h-[80px] font-mono flex justify-center items-center"
                key={index}
              >
                {char}
              </div>
            );
          })}
        </div>
      );
    });
  }, [words, wordRefArr]);

  /*This function is entirely responsible for the function of the type box we see

  So the idea is, we have created on input box and hide it.
  So whenever the user click on the typing box of the ui, the hidden input box will get focussed and user will be
  able to enter the characters but not see them

  As we are storing the DOM reference of hidden input box in inputRef using useRef() hook, we will be able to get the value 
  as the user types.

  On each change of the hidden input box, this handle type function will be invoked and using the DOM references of the 
  typing box words we will be ble to manipulate the DOM
   */
  function handleType(e) {
    if (
      (e.keyCode >= 65 && e.keyCode <= 90) ||
      e.keyCode == 32 ||
      e.keyCode == 8
    ) {
      setKeyPress(e.keyCode);
      let charNodes = wordRefArr[wordIndex].current.childNodes;

      if (e.keyCode == 32 && charIndex >= 1) {
        if (charIndex >= charNodes.length) {
          charNodes[charIndex - 1].classList.remove("currentCursorRight");
        } else {
          charNodes[charIndex].classList.remove("currentCursor");
        }

        wordRefArr[wordIndex + 1].current.childNodes[0].classList.add(
          "currentCursor"
        );

        let word = () => {
          let temp = [];
          for (let i = 0; i < charIndex; i++) {
            temp.push(charNodes[i].textContent);
          }
          return temp.join("");
        };

        setCorrectWordCount(() => {
          if (word() == words[wordIndex]) {
            setCorrectCharCount(correctCharCount + word().length);
            return correctWordCount + 1;
          } else return correctWordCount;
        });

        setWordIndex(wordIndex + 1);
        setCharIndex(0);
        centerWord();
        return;
      }

      if (e.keyCode == 8) {
        if (
          charIndex != 0 &&
          charNodes[charIndex - 1].classList.contains("extra")
        ) {
          if (charIndex != 0) {
            if (
              charNodes[charIndex - 1].classList.contains("currentCursorRight")
            ) {
              charNodes[charIndex - 1].remove();
              charNodes[charIndex - 2].classList.add("currentCursorRight");
            } else {
              charNodes[charIndex - 1].remove();
              charNodes[charIndex - 1].classList.add("currentCursor");
            }
            setCharIndex(charIndex - 1);
          } else {
            charNodes[charIndex].remove();
            charNodes[charIndex].classList.add("currentCursor");
          }
        } else {
          if (charIndex != 0) {
            charNodes[charIndex - 1].classList.remove("text-green-400");
            if (
              charNodes[charIndex - 1].classList.contains("currentCursorRight")
            ) {
              charNodes[charIndex - 1].classList.remove("currentCursorRight");
              charNodes[charIndex - 1].classList.add("currentCursor");
              setCharIndex(charIndex - 1);
              return;
            }
            charNodes[charIndex].classList.remove("currentCursor");
            charNodes[charIndex - 1].classList.add("currentCursor");
            setCharIndex(charIndex - 1);
          }
        }
        return;
      }

      if (e.keyCode >= 65 && e.keyCode <= 90) {
        if (testState === "") setTestState("start");

        if (charIndex == charNodes.length) {
          typingBox.current.scrollBy(40, 0);
          charNodes[charIndex - 1].classList.remove("currentCursorRight");
          let extraElement = document.createElement("div");
          let text = document.createTextNode(e.key);
          extraElement.appendChild(text);
          extraElement.setAttribute(
            "class",
            "extra box-border w-[40px] h-[80px] font-mono flex justify-center items-center text-red-400 currentCursorRight"
          );
          wordRefArr[wordIndex].current.appendChild(extraElement);
          setCharIndex(charIndex + 1);
          return;
        }

        if (e.key === charNodes[charIndex].innerText) {
          charNodes[charIndex].classList.add("text-green-400");
        } else {
          typingBox.current.scrollBy(40, 0);
          let extraElement = document.createElement("div");
          let text = document.createTextNode(e.key);
          extraElement.appendChild(text);
          extraElement.setAttribute(
            "class",
            "extra box-border w-[40px] h-[80px] font-mono flex justify-center items-center text-red-400 currentCursor"
          );
          if (charIndex != 0) {
            charNodes[charIndex - 1].after(extraElement);
            charNodes[charIndex].classList.remove("currentCursor");
          } else {
            charNodes[charIndex].before(extraElement);
            charNodes[charIndex].classList.remove("currentCursor");
          }
          setCharIndex(charIndex + 1);
          return;
        }

        if (charIndex + 1 == charNodes.length) {
          charNodes[charIndex].classList.add("currentCursorRight");
          charNodes[charIndex].classList.remove("currentCursor");
        } else {
          charNodes[charIndex + 1].classList.add("currentCursor");
        }

        if (charIndex != 0) {
          charNodes[charIndex - 1].classList.remove("currentCursor");
          charNodes[charIndex].classList.remove("currentCursor");
        } else charNodes[charIndex].classList.remove("currentCursor");

        setCharIndex(charIndex + 1);
      }
    }
  }

  function centerWord() {
    wordRefArr[wordIndex + 1].current.scrollIntoView({
      block: "center",
      inline: "center",
    });
  }

  function handleTypeBoxClick() {
    inputRef.current.focus();
    wordRefArr[wordIndex].current.childNodes[charIndex].classList.add(
      "currentCursor"
    );
  }

  function start() {
    if (count != 0) {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else {
      setTestState("end");
      setLoading(true);
      postResults();
    }
  }

  function postResults() {
    addDoc(collection(db, uid, `${userEmailName}-result`, "result"), {
      wpm: Math.round(correctWordCount / (selectedTime / 60)),
      cpm: Math.round(correctCharCount / (selectedTime / 60)),
      accuracy: `${
        correctWordCount != 0
          ? Math.round((correctWordCount / wordIndex) * 100)
          : 0
      }`,
      timeStamp: new Date(),
    })
      .then(() => {
        setLoading(false);
        setShowResultModal(true);
      })
      .catch((error) => {
        toast.error(`${error.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setLoading(false);
        setTestState("");
        setCorrectWordCount(0);
        setCorrectCharCount(0);
        setCharIndex(0);
        setWordIndex(0);
        setCount(60);
        setWords(randomWords({ min: 300, max: 1000 }));
      });
  }

  if (testState === "start") start();

  useEffect(() => {
    typingBox.current.childNodes[0].scrollIntoView({
      block: "center",
      inline: "center",
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setUserEmailName(() => {
          let str = user.email;
          return str.slice(0, str.indexOf("@"));
        });
      } else {
        navigate("/");
      }
    });
  }, [words]);

  return (
    <div className="p-4 text-textColor text-xl leading-normal tracking-wider flex flex-1 flex-col items-center justify-between">
      <input
        type="text"
        className="absolute top-0 left-0 opacity-0"
        onKeyDown={handleType}
        ref={inputRef}
      />
      <aside className="fixed top-[100px] left-0 bg-thematicColor p-2 pl-4 pr-4 rounded-e-xl text-[18px] shadow-lg">
        <span className="animate-rainbow font-bold">Time Mode</span>{" "}
        <button
          onClick={() => {
            setTestMode("none");
          }}
          className="cursor-pointer ml-4 p-1 pl-2 pr-2 bg-bgColor text-textColor shadow-md rounded hover:bg-red-600 hover:text-white"
        >
          Exit
        </button>
      </aside>
      <div className="flex justify-between w-[60%] gap-8">
        <div className="w-[30%] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 pt-2 justify-between items-center shadow-lg">
          <div
            id="timer"
            className="text-8xl flex-1 flex justify-center items-center w-full"
          >
            {count}
          </div>

          <div className="text-sm h-max">
            {testState === "" ? "Test Time in seconds" : "seconds remaining"}
          </div>

          <progress
            className="h-[10px] w-full"
            value={count}
            max={selectedTime}
          ></progress>
        </div>
        <div className="flex gap-8 flex-1 justify-evenly">
          <div className="w-[30%] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
            <div className="text-8xl text-mono">
              {Math.round(correctWordCount / (selectedTime / 60))}
            </div>
            <div className="text-sm"> words/min</div>
          </div>
          <div className="w-[30%] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
            <div className="text-8xl text-mono">
              {" "}
              {Math.round(correctCharCount / (selectedTime / 60))}
            </div>
            <div className="text-sm">chars/min</div>
          </div>
          <div className="w-[30%] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
            <div className="text-8xl text-mono">
              {correctWordCount != 0
                ? Math.round((correctWordCount / wordIndex) * 100)
                : 0}
            </div>
            <div className="text-sm">% accuracy</div>
          </div>
        </div>
      </div>

      <div
        className={`flex border border-thematicColor rounded-lg divide-x divide-thematicColor text-base transition-all duration-500 ease-in-out ${
          testState !== "" && "invisible animate-fade-out"
        }`}
      >
        <button
          onClick={() => {
            setSelectedTime(15);
            setCount(15);
          }}
          className={`cursor-pointer pl-12 pr-12 p-0 ${
            selectedTime == 15 && " bg-thematicColor"
          }`}
        >
          15s
        </button>
        <button
          onClick={() => {
            setSelectedTime(30);
            setCount(30);
          }}
          className={`cursor-pointer pl-12 pr-12 p-0 ${
            selectedTime == 30 && " bg-thematicColor"
          }`}
        >
          30s
        </button>
        <button
          onClick={() => {
            setSelectedTime(60);
            setCount(60);
          }}
          className={`cursor-pointer pl-12 pr-12 p-0 ${
            selectedTime == 60 && " bg-thematicColor"
          }`}
        >
          1min
        </button>
        <button
          onClick={() => {
            setSelectedTime(300);
            setCount(300);
          }}
          className={`cursor-pointer pl-12 pr-12 p-0 ${
            selectedTime == 300 && " bg-thematicColor"
          }`}
        >
          5min
        </button>
      </div>

      <div className="text-sm text-textColor tracking-widest">
        Just select time above, click below and start typing
      </div>

      {count == 0 ? (
        <div className="text-5xl p-16 w-[80%] h-[100px] flex items-center justify-center bg-black/70 text-white rounded-2xl shadow-lg scrollbar">
          Test Over
        </div>
      ) : (
        <div
          onClick={handleTypeBoxClick}
          ref={typingBox}
          id="textbox"
          className="cursor-text text-5xl p-6 w-[80%] pl-[40%] flex gap-[40px] items-center justify-start  border-[1px] border-thematicColor bg-black/70 text-white overflow-x-scroll rounded-2xl shadow-lg scrollbar"
        >
          {wordData}
        </div>
      )}

      <Keyboard keypress={keypress} />
      {showResultModal && (
        <TimeModeResultModal
          correctWordCount={correctWordCount}
          setCorrectWordCount={setCorrectWordCount}
          correctCharCount={correctCharCount}
          setCorrectCharCount={setCorrectCharCount}
          attemptedWords={wordIndex}
          setWordIndex={setWordIndex}
          setCharIndex={setCharIndex}
          setCount={setCount}
          showResultModal={showResultModal}
          setShowResultModal={setShowResultModal}
          setWords={setWords}
          typingBox={typingBox}
          setTestState={setTestState}
          setSelectedTime={setSelectedTime}
          selectedTime={selectedTime}
        />
      )}
      {loading && <LoadingPage />}
    </div>
  );
}
