/* eslint-disable react/prop-types */
/**
 * This component will display the result of the user
 * It will also reset the state of the test
 */

// importing icon
import { RxCross1 } from "react-icons/rx";

// importing random words
import randomWords from "random-words";

export default function WordModeResultModal({
  correctWordCount,
  setCorrectWordCount,
  correctCharCount,
  setCorrectCharCount,
  setWordIndex,
  setCharIndex,
  setShowResultModal,
  setWords,
  setCount,
  setTestState,
  selectedWordSlot,
  setSelectedWordSlot,
  count,
}) {
  /**
   * This function will reset the test state and varoius other parameters to the iniital state when the
   * user clicks on the cancel button
   */
  function handleReset() {
    setCorrectWordCount(0);
    setCorrectCharCount(0);
    setCharIndex(0);
    setWordIndex(0);
    setCount(0);
    setSelectedWordSlot(20);
    setShowResultModal(false);
    setWords(randomWords(20));
    setTestState("");
  }

  return (
    <main className="p-2 h-screen w-screen fixed top-0 left-0 bg-black/90 flex justify-center items-center z-[2000]">
      <section className="bg-bgColor relative w-[40%] h-max rounded-xl p-4 text-textColor flex flex-col gap-4 justify-between animate-fade-in md:w-[60%] mobile:w-full">
        <RxCross1
          className="absolute right-6 top-8 hover:text-thematicColor cursor-pointer"
          onClick={handleReset}
        />
        <article className="h-full flex flex-col gap-4">
          <h1 className="text-textColor text-4xl font-bold xs:text-3xl">
            Your Test Result
          </h1>
          <div className="flex-1 flex flex-col gap-8">
            <div className="text-4xl xs:text-xl">You tried your best!!!</div>

            <div className="flex-1 flex gap-4 sm:flex-col">
              <div className="p-4 bg-thematicColor flex-1 rounded-xl shadow-lg flex flex-col justify-evenly items-center">
                <div className="text-9xl font-bold xs:text-5xl">
                  {Math.round(correctWordCount / (count / 60))}
                </div>
                <div className="xs:text-base">Words per minute</div>
              </div>

              <div className="p-4 bg-thematicColor flex-1 rounded-xl shadow-lg flex flex-col justify-between items-start">
                <div className="text-5xl font-bold xs:text-3xl">
                  {Math.round(correctCharCount / (count / 60))} CPM
                </div>
                <div className="text-sm mobile:text-base">with</div>
                <div className="text-6xl mobile:text-5xl xs:text-3xl">
                  {correctWordCount != 0
                    ? Math.round((correctWordCount / selectedWordSlot) * 100)
                    : 0}
                  % accuracy
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
