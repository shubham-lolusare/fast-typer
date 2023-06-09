/* eslint-disable react/prop-types */
import randomWords from "random-words";
import "./TypingTestPage.css";
import Keyboard from "./Keyboard";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import WordModeResultModal from "./WordModeResultModal";
import LoadingPage from "../LoadingPage/LoadingPage";
import { toast } from "react-toastify";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";
import { db } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function WordModePage({ setTestMode }) {
  let inputRef = useRef(null);
  let typingBox = useRef(null);

  let [keypress, setKeyPress] = useState();
  let [wordIndex, setWordIndex] = useState(0);
  let [charIndex, setCharIndex] = useState(0);
  let [correctWordCount, setCorrectWordCount] = useState(0);
  let [correctCharCount, setCorrectCharCount] = useState(0);

  let [showResultModal, setShowResultModal] = useState(false);
  let [testState, setTestState] = useState("");
  let [loading, setLoading] = useState(false);
  let [count, setCount] = useState(0);
  let [uid, setUid] = useState();
  let [userEmailName, setUserEmailName] = useState();
  let navigate = useNavigate();
  let [selectedWordSlot, setSelectedWordSlot] = useState(20);
  let [words, setWords] = useState(randomWords(20));

  let wordRefArr = useMemo(() => {
    return Array(words.length)
      .fill(0)
      .map(() => {
        return createRef(null);
      });
  }, [words]);

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

  function handleType(e) {
    if (
      (e.keyCode >= 65 && e.keyCode <= 90) ||
      e.keyCode == 32 ||
      e.keyCode == 8
    ) {
      setKeyPress(e.keyCode);
      let charNodes = wordRefArr[wordIndex].current.childNodes;

      if (e.keyCode == 32 && charIndex >= 1) {
        if (wordIndex == words.length - 1) {
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

          setTestState("result");
          return;
        }

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

  function postResults(countValue) {
    addDoc(collection(db, uid, `${userEmailName}-result`, "result"), {
      wpm: Math.round(correctWordCount / (countValue / 60)),
      cpm: Math.round(correctCharCount / (countValue / 60)),
      accuracy: `${
        correctWordCount != 0
          ? Math.round((correctWordCount / selectedWordSlot) * 100)
          : 0
      }`,
      timeStamp: getTimeStamp(),
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
        setCount(0);
        setWords(randomWords(20));
      });
  }

  if (testState === "start") {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  }

  if (testState === "result") {
    setTestState("end");
    setLoading(true);
    postResults(count + 1);
  }

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
        <span className="animate-rainbow font-bold">Word Mode</span>{" "}
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
        <div className="w-[30%] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
          <div className="text-8xl text-mono">{count}</div>
          <div className="text-sm">
            {testState === "" ? "Test Time" : "seconds"}
          </div>
        </div>

        <div className="flex gap-8 flex-1 justify-evenly">
          <div className="w-[30%] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
            <div className="text-8xl text-mono">
              {count != 0 ? Math.round(correctWordCount / (count / 60)) : 0}
            </div>
            <div className="text-sm"> words/min</div>
          </div>
          <div className="w-[30%] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
            <div className="text-8xl text-mono">
              {" "}
              {count != 0 ? Math.round(correctCharCount / (count / 60)) : 0}
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
            setSelectedWordSlot(10);
            setWords(randomWords(10));
          }}
          className={`cursor-pointer pl-12 pr-12 p-0 ${
            selectedWordSlot == 10 && " bg-thematicColor"
          }`}
        >
          10 words
        </button>
        <button
          onClick={() => {
            setSelectedWordSlot(20);
            setWords(randomWords(20));
          }}
          className={`cursor-pointer pl-12 pr-12 p-0 ${
            selectedWordSlot == 20 && " bg-thematicColor"
          }`}
        >
          20 words
        </button>
        <button
          onClick={() => {
            setSelectedWordSlot(50);
            setWords(randomWords(50));
          }}
          className={`cursor-pointer pl-12 pr-12 p-0 ${
            selectedWordSlot == 50 && " bg-thematicColor"
          }`}
        >
          50 words
        </button>
        <button
          onClick={() => {
            setSelectedWordSlot(100);
            setWords(randomWords(100));
          }}
          className={`cursor-pointer pl-12 pr-12 p-0 ${
            selectedWordSlot == 100 && " bg-thematicColor"
          }`}
        >
          100 words
        </button>
      </div>

      <div className="text-sm text-textColor tracking-widest">
        Just select words slot above, click below and start typing
      </div>

      {testState === "end" ? (
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
        <WordModeResultModal
          correctWordCount={correctWordCount}
          setCorrectWordCount={setCorrectWordCount}
          correctCharCount={correctCharCount}
          setCorrectCharCount={setCorrectCharCount}
          setWordIndex={setWordIndex}
          setCharIndex={setCharIndex}
          setCount={setCount}
          showResultModal={showResultModal}
          setShowResultModal={setShowResultModal}
          setWords={setWords}
          typingBox={typingBox}
          setTestState={setTestState}
          selectedWordSlot={selectedWordSlot}
          setSelectedWordSlot={setSelectedWordSlot}
          count={count}
        />
      )}
      {loading && <LoadingPage />}
    </div>
  );
}

function getTimeStamp() {
  let date = new Date();

  let timeStampStr = `(${date.getDate()}/${date.getMonth()}/${date.getFullYear()})+(${date.getHours()}/${date.getMinutes()})`;

  return timeStampStr;
}