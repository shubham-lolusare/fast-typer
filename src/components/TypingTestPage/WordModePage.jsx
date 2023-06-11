/* eslint-disable react/prop-types */
/*This is the word mode typing test component

  In this mode the user have to select the number of words he/she wants to type and the words per
  minute will be calculated accordingly

  After taking test the user results are posted to the firebase automatically

  There are various word modes in for which the user have to select but by default 20 words slot is selected
 */

import { createRef, useEffect, useMemo, useRef, useState } from "react";
import "./TypingTestPage.css";

// importing random words module
import randomWords from "random-words";

// importing components
import Keyboard from "./Keyboard";
import WordModeResultModal from "./WordModeResultModal";
import LoadingPage from "../LoadingPage/LoadingPage";
import FooterTabs from "../FooterTabs/FooterTabs";

// Importing icons
import { AiOutlineArrowRight } from "react-icons/ai";

// importing toast
import { toast } from "react-toastify";

// importing react router hook
import { useNavigate } from "react-router-dom";

// importing firebase related modules
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";
import { db } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function WordModePage({ setTestMode }) {
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

  // this state is used for setting the timer and displying the second remaining passed
  let [count, setCount] = useState(0);

  // this states are used to store the uid of the current user and their email name to generate the firestore collection segment
  let [uid, setUid] = useState();
  let [userEmailName, setUserEmailName] = useState();

  // this hook is used for the navigation to other routes
  let navigate = useNavigate();

  /* This state is used for storing the word slot values
  The allowed slots are 10words, 20words, 50words and 100words
  */
  let [selectedWordSlot, setSelectedWordSlot] = useState(20);

  // state for storing the random words generated
  let [words, setWords] = useState(randomWords(20));

  // state for manipulating the display of drawer
  let [drawerShow, setDrawerShow] = useState(true);

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

  So the idea is, we have created an input box and hide it.
  So whenever the user click on the typing box of the ui, the hidden input box will get focussed and user will be
  able to enter the characters but not see them

  As we are storing the DOM reference of hidden input box in inputRef using useRef() hook, we will be able to get the value 
  as the user types.

  On each change of the hidden input box, this handle type function will be invoked and using the DOM references of the 
  typing box words we able to manipulate the DOM
   */
  function handleType(e) {
    /* This function will only be called if the users enters all alphabets, spacebar or backspace
       For all other key presses it will not be called
       */
    if (
      (e.keyCode >= 65 && e.keyCode <= 90) ||
      e.keyCode == 32 ||
      e.keyCode == 8
    ) {
      /* This state change is to show the keyboard effect on screen. It stores the key pressed and then it is transferred to the
      keyboard component as prop*/
      setKeyPress(e.keyCode);
      let charNodes = wordRefArr[wordIndex].current.childNodes;

      /**These are the following key points that are considered while manipulating the DOM
       * 1. User should see the current position of the cursor in typing bmobile:flex-1. For valid characters, green color character should be displayed and for the invalid characters
       *    new DOM Element (div) should be inserted in between
       * 2. User should be able to do backspace, if the character entered in invalid
       * 3. For navigating from one word to another, space key should be used and it will only gets activated if and
       *    only if the user types atleast one valid or invalid character
       * 4. Since we are in the word mode the test should be end after the last word
       *    typed and space key is pressed
       */

      /**
       * This condition defines the working of space bar. This if block will only run
       * if the user pressess the space key and the number of characters types represented by
       * charIndex state is atleast one
       * This block is where it is decided if the typed word is correct or not.
       */
      if (e.keyCode == 32 && charIndex >= 1) {
        /**
         * This if block specifies what to do when the last word is typed
         * When the last word is typed and space key is pressed it will check for the validity
         * of the last word typed and end the test by settig test state
         */
        if (wordIndex == words.length - 1) {
          /**
           * This function will keep the track of the words that the user is typing by accessing
           * them using the DOM references. It will be used to compared to the original array of word and tell if
           * the typed word is correct or not
           */
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

        /**
         * This block of code, specifies the change of cursor from the previous word last
         * character to next word first character
         */
        if (charIndex >= charNodes.length) {
          charNodes[charIndex - 1].classList.remove("currentCursorRight");
        } else {
          charNodes[charIndex].classList.remove("currentCursor");
        }
        wordRefArr[wordIndex + 1].current.childNodes[0].classList.add(
          "currentCursor"
        );

        /**
         * This function will keep the track of the words that the user is typing by accessing
         * them using the DOM references. It will be used to compared to the original array of word and tell if
         * the typed word is correct or not
         */
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

        //State is changes from previous word to next word
        setWordIndex(wordIndex + 1);

        // state is changed from previois word last character to next word first character
        setCharIndex(0);

        // this function centers the next word we are typing every time we press spacebar
        centerWord();

        // Since no other functionality is required after this we are returning from here
        return;
      }

      /**
       * This if block handles the backspace functionality
       * While handling backspace these points are considered
       * There are two cases:
       *
       * Case I: Deleting the extra invalid characters that are inserted.
       * We will be usning the class extra to identify the extra characters.
       * In this case there ar three scenarios
       * 1. Deleting extra characters from the end of the word
       * 2. Deleting extra characters from in between the word
       * 3. Deleting extra charcters from the start of the word
       *
       * Case II: Deleting the valid characters
       * This case is for the user who types one incorrect and correct character
       * consecutively. So to access the incorect character we have to delete the correct one first.
       */
      if (e.keyCode == 8) {
        // Case I handled by this if block
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
        }
        // Case II handled by this else block
        else {
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

      /**
       * This if block handles if the user types letters that are shown in typing box
       * As discussed for correct characte we ar showing them in green and for incorrect characters
       * we are inserting the DOM elements and showing them in red
       */
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        // This if block ensures to start the count down as soon as the user starts typing the characters
        if (testState === "") setTestState("start");

        /**
         * This if block handles the insertion of the invalid extra character typed
         * at the end of the words.
         */
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

        /**
         * This if else block will handle the case for the insertion of the  invalid characters in between words
         * If the user types corect character of the word it will be shown green
         * else new extra red colored DOM elements are inserted in between
         */
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

        /**
         * If the character typed is the last character of the word then this if else block will run
         * The cursor is generally displayed on the left side of the character to give the asthetic feel
         * This if else block will ensure that when the last character is typed the cursor should move
         * to the right side of the character
         */
        if (charIndex + 1 == charNodes.length) {
          charNodes[charIndex].classList.add("currentCursorRight");
          charNodes[charIndex].classList.remove("currentCursor");
        } else {
          charNodes[charIndex + 1].classList.add("currentCursor");
        }

        /**
         * This if else block handle the smooth functioning of the cursor diaplay using the classes
         * It will ensure to move the cursor to the current character
         */
        if (charIndex != 0) {
          charNodes[charIndex - 1].classList.remove("currentCursor");
          charNodes[charIndex].classList.remove("currentCursor");
        } else charNodes[charIndex].classList.remove("currentCursor");

        // This shate will increment the character index as it is typed
        setCharIndex(charIndex + 1);
      }
    }
  }

  // This function is used to center the word to be typed
  function centerWord() {
    wordRefArr[wordIndex + 1].current.scrollIntoView({
      block: "center",
      inline: "center",
    });
  }

  /**
   * When the user click the typing box the hidden input box should get focused and the cursor shoul be
   * displayed in the typing box
   * THis function will ensure this functionality
   */
  function handleTypeBoxClick() {
    inputRef.current.focus();
    wordRefArr[wordIndex].current.childNodes[charIndex].classList.add(
      "currentCursor"
    );
  }

  /**
   * This function ensured the smooth posting of the results and after posting the results only the result modal is shown
   */
  function postResults(countValue) {
    addDoc(collection(db, uid, `${userEmailName}-result`, "result"), {
      wpm: Math.round(correctWordCount / (countValue / 60)),
      cpm: Math.round(correctCharCount / (countValue / 60)),
      accuracy: `${
        correctWordCount != 0
          ? Math.round((correctWordCount / selectedWordSlot) * 100)
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
        setCount(0);
        setWords(randomWords(20));
      });
  }

  /**
   * This if block is used for the fucntioning of the timer.
   * When the test is over or timer sets to zero results will be posted to fire base
   * and result modal is displayed
   */
  if (testState === "start") {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  }

  // postng the results after the test ends is handled by this if block
  if (testState === "result") {
    setTestState("end");
    setLoading(true);
    postResults(count + 1);
  }

  useEffect(() => {
    // On each page render this will ensure the centering of the first word in typing box
    typingBox.current.childNodes[0].scrollIntoView({
      block: "center",
      inline: "center",
    });

    /**
     * If there is no user present this function will ensure to navigate to the login page and if the usr exists it
     * will fetch its uid and set the segment name for posting the results to firebase
     */
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

    window.addEventListener("resize", () => {
      if (window.outerWidth > 1250) {
        setDrawerShow(true);
      } else {
        setDrawerShow(false);
      }
    });

    window.addEventListener("load", () => {
      if (window.outerWidth > 1250) {
        setDrawerShow(true);
      } else {
        setDrawerShow(false);
      }
    });
  }, [words]);

  return (
    <main className="p-4 text-textColor text-xl leading-normal tracking-wider flex flex-1 flex-col items-center justify-center gap-3 xs:p-2">
      {/* hidden input box */}
      <input
        type="text"
        className="absolute top-0 left-0 opacity-0"
        onKeyDown={handleType}
        ref={inputRef}
      />

      {/* mode name display aside */}
      <aside className="fixed top-[110px] left-0 bg-thematicColor p-2 rounded-e-lg text-[18px] shadow-lg flex gap-2 mobile:top-[605px] tall:top-[110px]">
        {drawerShow && (
          <div className="flex flex-col gap-2 xs:text-base">
            <div className="flex justify-center items-center gap-2">
              <span className="animate-rainbow font-bold rounded shadow-md bg-bgColor p-1 pl-2 pr-2">
                Word Mode
              </span>{" "}
              {/* button to exit the current tyoing mode */}
              <button
                onClick={() => {
                  setTestMode("none");
                }}
                className="cursor-pointer p-1 pl-2 pr-2 bg-bgColor text-textColor shadow-md rounded hover:bg-red-600 hover:text-white"
              >
                Exit
              </button>
            </div>
            <div className="text-textColor flex flex-col items-start gap-2 w-full">
              <FooterTabs />
            </div>
          </div>
        )}
        <div
          onClick={() => setDrawerShow(!drawerShow)}
          className="flex justify-center items-center p-2 text-textColor text-2xl cursor-pointer xs:text-base"
        >
          <AiOutlineArrowRight
            className={`hover:outline-8 hover:outline hover:outline-textColor/30 rounded-full ${
              drawerShow && "rotate-180"
            }`}
          />
        </div>
      </aside>

      {/* Live results are shown using this part of DOM */}
      <section className="flex justify-between w-[60%] gap-8 mobile:flex-col mobile:w-full mobile:gap-4 sm:w-[90%]">
        {/* Timer */}
        <article className="p-2 flex-[0.3] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 pt-2 justify-between items-center shadow-lg mobile:w-full">
          <div className="text-8xl flex-1 flex justify-center items-center w-full xs:text-6xl">
            {count}
          </div>
          <div className="text-sm h-max xs:text-[9px]">
            {testState === "" ? "Test Time" : "seconds"}
          </div>
        </article>

        {/* WPM, CPM and accuracy */}
        <article className="flex gap-8 flex-[0.7] justify-evenly mobile:gap-2">
          {/* Words per minute count */}
          <div className="flex-1 rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
            <div className="text-8xl text-mono mobile:text-3xl">
              {count != 0 ? Math.round(correctWordCount / (count / 60)) : 0}
            </div>
            <div className="text-sm xs:text-[9px]"> words/min</div>
          </div>

          {/* characters per minute count */}
          <div className="flex-1 rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
            <div className="text-8xl text-mono mobile:text-3xl">
              {" "}
              {count != 0 ? Math.round(correctCharCount / (count / 60)) : 0}
            </div>
            <div className="text-sm xs:text-[9px]">chars/min</div>
          </div>

          {/* accuracy count */}
          <div className="flex-1 rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
            <div className="text-8xl text-mono mobile:text-3xl">
              {correctWordCount != 0
                ? Math.round((correctWordCount / wordIndex) * 100)
                : 0}
            </div>
            <div className="text-sm xs:text-[9px]">% accuracy</div>
          </div>
        </article>
      </section>

      {/* Mode selection tabs */}
      <section
        className={`w-[30%] flex border border-thematicColor rounded-lg divide-x divide-thematicColor text-base transition-all duration-500 ease-in-out xs:text-sm mobile:w-full ${
          testState !== "" && "invisible animate-fade-out"
        }`}
      >
        <button
          onClick={() => {
            setSelectedWordSlot(10);
            setWords(randomWords(10));
          }}
          className={`cursor-pointer flex-1 p-1 ${
            selectedWordSlot == 10 && "rounded-l-md bg-thematicColor"
          }`}
        >
          10 words
        </button>
        <button
          onClick={() => {
            setSelectedWordSlot(20);
            setWords(randomWords(20));
          }}
          className={`cursor-pointer flex-1 p-1 ${
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
          className={`cursor-pointer flex-1 p-1 ${
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
          className={`cursor-pointer flex-1 p-1 ${
            selectedWordSlot == 100 && "rounded-r-md bg-thematicColor"
          }`}
        >
          100 words
        </button>
      </section>

      {/* Info block */}
      <div className="text-sm text-textColor tracking-widest mobile:text-center xs:text-[12px]">
        Just select words slot above, click below and start typing
      </div>

      {testState === "end" ? (
        <div className="text-5xl p-16 w-[80%] h-[100px] flex items-center justify-center bg-black/70 text-white rounded-2xl shadow-lg scrollbar sm:w-[90%] mobile:w-full">
          Test Over
        </div>
      ) : (
        <div
          onClick={handleTypeBoxClick}
          ref={typingBox}
          id="textbox"
          className="cursor-text text-5xl p-6 w-[80%] pl-[40%] flex gap-[40px] items-center justify-start  border-[1px] border-thematicColor bg-black/70 text-white overflow-x-scroll rounded-2xl shadow-lg scrollbar sm:w-[90%] sm:pl-[45%] mobile:w-full mobile:text-4xl mobile:pl-[50%] mobile:h-[100px]"
        >
          {wordData}
        </div>
      )}

      {/* Keyboard displayed on screen */}
      <Keyboard keypress={keypress} />

      {/* Resultmodal for showing results */}

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

      {/* loading page  */}
      {loading && <LoadingPage />}
    </main>
  );
}
