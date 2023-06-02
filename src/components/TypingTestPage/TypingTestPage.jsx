import Navbar from "../Navbar/Navbar";
import randomWords from "random-words";
import "./TypingTestPage.css";
import Keyboard from "../Keyboard/Keyboard";
import { createRef, useEffect, useMemo, useRef, useState } from "react";

export default function TypingTestPage() {
  let [words, setWords] = useState(() => {
    return randomWords({ exactly: 212 });
  });
  let inputRef = useRef(null);
  let [keypress, setKeyPress] = useState();
  let [wordIndex, setWordIndex] = useState(0);
  let [charIndex, setCharIndex] = useState(0);

  let refArr = useMemo(() => {
    return Array(words.length)
      .fill(0)
      .map(() => {
        return createRef(null);
      });
  }, [words]);

  function handleType(e) {
    setKeyPress(e.keyCode);

    let charNodes = refArr[wordIndex].current.childNodes;

    if (e.key === charNodes[charIndex].innerText) {
      console.log(charNodes[charIndex]);
      charNodes[charIndex].setAttribute("class", "correct");
    } else {
      charNodes[charIndex].className = "incorrect";
    }
    setCharIndex(charIndex + 1);
    console.log(charIndex);
  }

  function handleTypeBoxClick() {
    inputRef.current.focus();
  }

  useEffect(() => {
    inputRef.current.focus();
    refArr[0].current.childNodes[0].className = "current";
  });

  return (
    <main className="bg-bgColor w-full h-screen flex flex-col">
      <input
        type="text"
        ref={inputRef}
        className="absolute top-0 left-0 opacity-0"
        onKeyDown={handleType}
      />
      <Navbar />
      <div className="border-2 border-red-700 p-4 text-textColor text-xl leading-normal tracking-wider flex flex-1 flex-col gap-12 overflow-y-hidden items-center justify-center">
        <div
          onClick={handleTypeBoxClick}
          className="cursor-text text-5xl p-8 w-[80%] pl-[40%] flex gap-8 items-center justify-start textbox border-[1px] border-thematicColor bg-black/80 text-white overflow-y-scroll rounded-2xl shadow-lg scroll-smooth"
        >
          {words.map((word, index) => {
            return (
              <div key={index} className="flex gap-1" ref={refArr[index]}>
                {word.split("").map((char, index) => {
                  return <div key={index}>{char}</div>;
                })}
              </div>
            );
          })}
        </div>
        <Keyboard keypress={keypress} />
      </div>
    </main>
  );
}
