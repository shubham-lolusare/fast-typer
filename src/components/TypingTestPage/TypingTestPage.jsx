/* This component is test page component
 This is the place where user takes the test
 There are two modes in which the user can take tests

 First is the time mode in which the userr has to complete the test within the given period of time
 Second is the word mode in which user types the amount of words.

 Both modes are coded in two different components which will be loaded in lazy mode.
 */

import { useState, lazy, Suspense, useEffect } from "react";

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

  // state for checking if the user is in the mobile mode
  // If the user is in the mobile mode, then the test canno be taken
  let [mobileMode, setMobileMode] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.outerWidth < 930) {
        setMobileMode(true);
      } else {
        setMobileMode(false);
      }
    });
    if (window.outerWidth < 930) {
      setMobileMode(true);
    } else {
      setMobileMode(false);
    }
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      {" "}
      <main className="bg-bgColor w-full h-screen flex flex-col transition-all duration-500 ease-in-out animate-fade-in mobile:h-screen sm:pb-[80px]">
        <Navbar />

        {/* based on the testMode state the components will be displayed  */}
        {!mobileMode && testMode == "none" ? (
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
            <footer className="fixed bottom-0 rounded-t-xl p-2 bg-thematicColor text-textColor shadow-lg flex justify-center items-center gap-2">
              <FooterTabs />
            </footer>
          </section>
        ) : (
          <section className="w-full h-full p-2 text-textColor text-xl tracking-wider flex items-center justify-center">
            <div className="w-[90%] h-full flex flex-col justify-center gap-6">
              <h1 className="text-5xl text-textColor text-center">Oops!</h1>
              <p className="text-lg leading-normal text-justify xs:text-base">
                Tests are not allowed in mobile devices. But don&apos;t worry,
                you can still analyze your results, post comments in feedback
                portal and tweek your profile{" "}
                <span className="text-xl">&#128526;</span>
              </p>{" "}
              <strong className="animate-rainbow text-base xs:text-sm">
                Note: If your are a tablet user, try changing the orientation of
                the device.
              </strong>
            </div>
            <footer className="fixed bottom-0 rounded-t-xl p-2 bg-thematicColor text-textColor shadow-lg flex justify-center items-center gap-2">
              <FooterTabs />
            </footer>
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
