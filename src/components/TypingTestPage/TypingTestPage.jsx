import { useState, lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import Loading from "../LoadingPage/LoadingPage";
import FooterTabs from "../FooterTabs/FooterTabs";

let TimeModePage = lazy(() => import("./TimeModePage"));
let WordModePage = lazy(() => import("./WordModePage"));

export default function TypingTestPage() {
  let [testMode, setTestMode] = useState("none");

  return (
    <Suspense fallback={<Loading />}>
      {" "}
      <main className="bg-bgColor w-full h-screen flex flex-col transition-all duration-500 ease-in-out animate-fade-in">
        <Navbar />
        <ToastContainer />
        {testMode == "none" && (
          <section className="p-4 text-textColor text-xl leading-normal tracking-wider flex flex-1 items-center justify-center">
            <section className="w-[40%] p-4 border border-thematicColor rounded-2xl flex flex-col gap-6 shadow-lg">
              <h1 className="text-center text-4xl font-bold">
                Select the test mode
              </h1>
              <article className="w-full flex gap-4">
                <button
                  onClick={() => {
                    setTestMode("time");
                  }}
                  className="p-4 text-2xl font-bold tracking-wide flex-1 bg-thematicColor/90 rounded-lg shadow-lg hover:bg-thematicColor cursor-pointer"
                >
                  Time Mode
                </button>
                <button
                  onClick={() => {
                    setTestMode("word");
                  }}
                  className="p-4 text-2xl font-bold tracking-wide flex-1 bg-thematicColor/90 rounded-lg shadow-lg hover:bg-thematicColor cursor-pointer"
                >
                  Word Mode
                </button>
              </article>
              <article>
                <h1 className="font-bold text-xl mb-2">Description:</h1>
                <ul className="list-decimal list-outside text-base pl-5">
                  <li className="mb-1">
                    Time mode lets you take the test within a given time slot
                    and the Words per minute (WPM) will be calculated according
                    to the number of words typed by you within the given time
                    slot. While giving test in this mode, you have to select the
                    time slot given on test page or by default 1min time slot
                    will be selected.
                  </li>
                  <li>
                    In word mode, you have to select the number of words you
                    want to type and the WPM will be calculated by the time
                    taken by you to type the given words or by default, 20 words
                    will be selected.
                  </li>
                </ul>
              </article>
            </section>
            <FooterTabs />
          </section>
        )}
        {testMode == "word" && <WordModePage setTestMode={setTestMode} />}
        {testMode == "time" && <TimeModePage setTestMode={setTestMode} />}
      </main>
    </Suspense>
  );
}
