import Navbar from "../Navbar/Navbar";
import randomWords from "random-words";
import "./TypingTestPage.css";
import Keyboard from "./Keyboard";
import TypingData from "./TypingData";
import { createRef, useMemo, useRef, useState } from "react";

export default function TypingTestPage() {
  let [words] = useState(() => {
    return randomWords({ exactly: 1000 });
  });
  let inputRef = useRef(null);
  let typingBox = useRef(null);
  let [keypress, setKeyPress] = useState();
  let [wordIndex, setWordIndex] = useState(0);
  let [charIndex, setCharIndex] = useState(0);
  let [correctWordCount, setCorrectWordCount] = useState(0);
  let [correctCharCount, setCorrectCharCount] = useState(0);
  let [testState, setTestState] = useState("start");

  let wordRefArr = useMemo(() => {
    return Array(words.length)
      .fill(0)
      .map(() => {
        return createRef(null);
      });
  }, [words]);

  let divElements = useMemo(() => {
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
  }, [wordRefArr, words]);

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
        if (testState === "start") setTestState("end");

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

  if (testState == "retest") location.reload();

  return (
    <main className="bg-bgColor w-full h-screen flex flex-col">
      <input
        type="text"
        ref={inputRef}
        className="absolute top-0 left-0 opacity-0"
        onKeyDown={handleType}
      />
      <Navbar />
      <div className="p-4 text-textColor text-xl leading-normal tracking-wider flex flex-1 flex-col items-center justify-between">
        <TypingData
          correctWordCount={correctWordCount}
          correctCharCount={correctCharCount}
          attemptedWords={wordIndex}
          testState={testState}
          setTestState={setTestState}
        />
        <div
          ref={typingBox}
          onClick={handleTypeBoxClick}
          className="cursor-text text-5xl p-8 w-[80%] pl-[40%] flex gap-[40px] items-center justify-start textbox border-[1px] border-thematicColor bg-black/70 text-white overflow-y-scroll rounded-2xl shadow-lg"
        >
          {divElements}
        </div>
        <div className="text-sm text-textColor tracking-widest">
          Just click above and start typing
        </div>
        <Keyboard keypress={keypress} />
      </div>
    </main>
  );
}
