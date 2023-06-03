/* eslint-disable react/prop-types */
import { useState } from "react";
import "./TypingData.css";

export default function TypingData({
  correctWordCount,
  correctCharCount,
  attemptedWords,
  testState,
  setTestState,
}) {
  let [count, setCount] = useState(15);

  function start() {
    setTimeout(() => {
      if (count != 0) setCount(count - 1);
      else return;
    }, 1000);
  }

  if (count == 0) setTestState("retest");

  if (testState === "end") start();
  return (
    <div className="flex justify-between w-[60%]">
      <div className="min-w-[20%] rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center shadow-lg">
        <div className="text-8xl text-mono"> {count}</div>
        <div className="text-sm">seconds</div>
        <progress className="h-[10px] w-full" value={count} max="15"></progress>
      </div>
      <div className="flex gap-8">
        <div className="rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
          <div className="text-8xl text-mono"> {correctWordCount}</div>
          <div className="text-sm"> words/min</div>
        </div>
        <div className="rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
          <div className="text-8xl text-mono"> {correctCharCount}</div>
          <div className="text-sm">chars/min</div>
        </div>
        <div className="rounded-xl bg-thematicColor text-textColor flex flex-col gap-2 justify-center items-center p-2 shadow-lg">
          <div className="text-8xl text-mono">
            {correctWordCount != 0
              ? Math.round((correctWordCount / attemptedWords) * 100)
              : 0}
          </div>
          <div className="text-sm">% accuracy</div>
        </div>
      </div>
    </div>
  );
}
