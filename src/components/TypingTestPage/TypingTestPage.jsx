/* This component is test page component
 This is the place where user takes the test
 There are two modes in which the user can take tests

 First is the time mode in which the userr has to complete the test within the given period of time
 Second is the word mode in which user types the amount of words.

 Both modes are coded in two different components which will be loaded in lazy mode.
 */

import { useState, lazy, Suspense } from "react";

// importing components
import Navbar from "../Navbar/Navbar";
import Loading from "../LoadingPage/LoadingPage";
import FooterTabs from "../FooterTabs/FooterTabs";

// lazy loading the two modes of the tests
let TimeModePage = lazy(() => import("./TimeModePage"));
let WordModePage = lazy(() => import("./WordModePage"));

export default function TypingTestPage() {
  // state for selecting the mode of the test
  let [testMode, setTestMode] = useState("none");

  return (
    <Suspense fallback={<Loading />}>
      {" "}
      <main className="bg-bgColor w-full h-screen flex flex-col transition-all duration-500 ease-in-out animate-fade-in mobile:h-full sm:pb-[80px]">
        <Navbar />

        {/* based on the testMode state the components will be displayed  */}
        {testMode == "none" && (
          <section className="p-4 text-textColor text-xl leading-normal tracking-wider flex flex-1 items-center justify-center">
            <section className="w-[40%] p-4 border border-thematicColor rounded-2xl flex flex-col gap-6 shadow-lg md:w-[80%] mobile:w-full">
              <header className="text-center text-4xl font-bold mobile:text-2xl xs:text-xl">
                Select the test mode
              </header>

              {/* mode buttons */}
              <article className="w-full flex gap-4 mobile:flex-col">
                <button
                  onClick={() => {
                    setTestMode("time");
                  }}
                  className="p-4 text-2xl font-bold tracking-wide flex-1 bg-thematicColor/90 rounded-lg shadow-lg hover:bg-thematicColor cursor-pointer mobile:text-lg mobile:p-2 xs:text-base"
                >
                  Time Mode
                </button>
                <button
                  onClick={() => {
                    setTestMode("word");
                  }}
                  className="p-4 text-2xl font-bold tracking-wide flex-1 bg-thematicColor/90 rounded-lg shadow-lg hover:bg-thematicColor cursor-pointer mobile:text-lg mobile:p-2 xs:text-base"
                >
                  Word Mode
                </button>
              </article>

              {/* description box */}
              <article>
                <h1 className="font-bold text-xl mb-2 mobile:text-lg xs:text-base">
                  Description:
                </h1>
                <ul className="list-decimal list-outside text-base pl-5 mobile:text-sm xs:text-[13px]">
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

        {/* component for word mode */}
        {testMode == "word" && <WordModePage setTestMode={setTestMode} />}

        {/* component for test mode */}
        {testMode == "time" && <TimeModePage setTestMode={setTestMode} />}
      </main>
    </Suspense>
  );
}
