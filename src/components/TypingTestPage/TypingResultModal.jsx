/* eslint-disable react/prop-types */
import { RxCross1 } from "react-icons/rx";
import randomWords from "random-words";

export default function TypingResultModal({
  correctWordCount,
  setCorrectWordCount,
  correctCharCount,
  setCorrectCharCount,
  attemptedWords,
  setWordIndex,
  setCharIndex,
  setTestState,
  setShowResultModal,
  setWords,
}) {
  function handleReset() {
    setCorrectWordCount(0);
    setCorrectCharCount(0);
    setCharIndex(0);
    setWordIndex(0);
    setTestState("");
    setShowResultModal(false);
    setWords(randomWords({ min: 300, max: 1000 }));
  }

  return (
    <div className="h-screen w-full absolute top-0 left-0 bg-black/90 flex justify-center items-center">
      <div className="bg-bgColor relative w-[40%] h-[55%] rounded-xl p-4 text-textColor flex flex-col gap-4 justify-between">
        <RxCross1
          className="absolute right-6 top-8 hover:text-thematicColor cursor-pointer"
          onClick={handleReset}
        />
        <div className="h-full flex flex-col gap-4">
          <h1 className="text-textColor text-4xl font-bold">
            Your Test Result
          </h1>
          <div className="flex-1 flex flex-col gap-8">
            <div className="text-6xl">Excellent</div>

            <div className="flex-1 flex gap-4">
              <div className="p-4 bg-thematicColor flex-1 rounded-xl shadow-lg flex flex-col justify-evenly items-center">
                <div className="text-9xl font-bold">{correctWordCount}</div>
                <div>Words per minute</div>
              </div>
              <div className="p-4 bg-thematicColor flex-1 rounded-xl shadow-lg flex flex-col justify-between items-start">
                <div className="text-5xl font-bold">{correctCharCount} CPM</div>
                <div className="text-sm">with</div>
                <div className="text-6xl">
                  {correctWordCount != 0
                    ? Math.round((correctWordCount / attemptedWords) * 100)
                    : 0}
                  % accuracy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
