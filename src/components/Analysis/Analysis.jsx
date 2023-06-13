/**
 * This component is used to show the results in two modes
 * i. Graph mode
 * ii. Table mode
 *
 * The results are fetched from the firebase every time the user clicks on the
 * analysis tab
 */

import { useEffect, useState } from "react";
import "./Analysis.css";

// importing components
import Navbar from "../Navbar/Navbar";
import LineGraph from "./LineGraph";
import LoadingPage from "../LoadingPage/LoadingPage";
import FooterTabs from "../FooterTabs/FooterTabs";

// importing firebase related modules
import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// importing react-router hook
import { useNavigate } from "react-router-dom";

// importing toast
import { toast } from "react-toastify";

// importing custom hook which gives us the current hook value
import useTheme from "../../hooks/Themehook";

export default function Analysis() {
  // theme value from custom hook
  let theme = useTheme();

  // state for storing uid and collection segment to fetch user related data
  let [uid, setUid] = useState();
  let [userEmailName, setUserEmailName] = useState();

  let navigate = useNavigate();

  // state for graph: label and data sets
  let [label] = useState([]);
  let [dataSet, setDataSet] = useState({
    label,
    datasets: [],
  });

  // state for storing total tests taken
  let [totalTest, setTotalTest] = useState(0);

  // state for storing the table body
  let [tableBody, setTableBody] = useState([]);

  /* state for setting the display of loading page. The loading page will 
  be shown when the network fethching request are done. 
  By default it is set true becoz we want the loading page to be shown first till the 
  test data is fetched*/
  let [loading, setLoading] = useState(true);

  // state for setting the data display modes i.e graph mode or table mode
  let [displyeMode, setDisplayMode] = useState("graph");

  useEffect(() => {
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

    // user data is fetched on each render of the page
    getData(uid, `${userEmailName}-result`).then((data) => {
      setLoading(false);
      if (data[0].length == 0) {
        toast.info("No test data found", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      setTotalTest(data[0].length);

      setDataSet({
        labels: data[3].map((element) => element),
        datasets: [
          {
            label: "Words/min",
            data: data[0].map((element) => element),
            borderColor: theme.thematicColor,
          },
          {
            label: "Characters/min",
            data: data[1].map((element) => element),
            borderColor: "#640064",
          },
          {
            label: "Accuracy",
            data: data[2].map((element) => element),
            borderColor: "rgb(255, 69, 0)",
          },
        ],
      });

      setTableBody(() => {
        let tableCells = [];
        let srno = 0;

        for (let i = data[0].length - 1; i >= 0; i--, srno++) {
          tableCells.push(
            <tr
              key={i + 1}
              className="border-b transition duration-300 ease-in-out hover:bg-thematicColor"
            >
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                {srno + 1}
              </td>
              <td className="whitespace-nowrap px-6 py-4">{data[0][i]}</td>
              <td className="whitespace-nowrap px-6 py-4">{data[1][i]}</td>
              <td className="whitespace-nowrap px-6 py-4">{data[2][i]}</td>
              <td className="whitespace-nowrap px-6 py-4">{`${data[4][i]}`}</td>
            </tr>
          );
        }

        return tableCells;
      });
    });
  }, [uid, userEmailName]);

  return (
    <main className="bg-bgColor w-full min-h-screen animate-fade-in transition-all duration-500 ease-in-out">
      <Navbar />
      <section className="flex flex-col justify-center items-center p-4 pb-16 gap-4 xs:gap-2">
        {/* heading data */}
        <header className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-center font-bold text-5xl text-textColor xs:text-3xl">
            Test Analysis
          </h1>
          <div className="text-sm font-bold text-textColor">
            Total tests taken: {totalTest}
          </div>
        </header>

        {/* mode switching tabs */}
        <section className="flex items-center w-[30%] border border-thematicColor divide-x-2 divide-thematicColor rounded-lg text-textColor shadow-md md:w-[40%] sm:w-[60%] mobile:w-full xs:text-sm">
          <button
            onClick={() => {
              setDisplayMode("graph");
            }}
            className={`flex-1 p-1 ${
              displyeMode === "graph" && "rounded-l-md bg-thematicColor"
            }`}
          >
            Graph Mode
          </button>
          <button
            onClick={() => {
              setDisplayMode("table");
            }}
            className={`flex-1 p-1 ${
              displyeMode === "table" && "rounded-r-md bg-thematicColor"
            }`}
          >
            Table Mode
          </button>
        </section>

        {/* graph component */}
        {displyeMode === "graph" && (
          <div className="w-[80%] h-3/5 p-4 border border-thematicColor rounded-2xl shadow-lg bg-bgColor sm:w-full sm:p-1">
            <LineGraph dataSet={dataSet} />
          </div>
        )}

        {/* table for test data */}
        {displyeMode === "table" && totalTest != 0 && (
          <div
            id="tableBox"
            className="w-[80%] p-4 border border-thematicColor rounded-2xl shadow-lg bg-bgColor flex flex-col md:w-full overflow-x-scroll md:border-0"
          >
            <table className="min-w-max text-center text-textColor rounded-2xl xs:text-sm">
              <thead className="border-b font-medium bg-thematicColor">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Words Per Min
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Characters Per Min
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Accuracy
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Test Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>{tableBody}</tbody>
            </table>
          </div>
        )}

        {/* footer tabs */}
        <footer className="fixed bottom-0 rounded-t-xl p-2 bg-thematicColor text-textColor shadow-lg flex justify-center items-center gap-2">
          <FooterTabs />
        </footer>
      </section>

      {/* loading page */}
      {loading && <LoadingPage />}
    </main>
  );
}

// this function will return the test data in array format of WPM,CPM, Accuracy, Chart labels
// sorted in ascending order of the test date given
async function getData(uid, segment) {
  let wpmArr = [];
  let cpmArr = [];
  let accArr = [];
  let labelArr = [];
  let timeArr = [];
  let docObjArr = [];

  let querySnapshot = await getDocs(collection(db, uid, segment, "result"));

  querySnapshot.forEach((doc) => {
    docObjArr.push(doc.data());
  });

  docObjArr.sort((a, b) => {
    if (b.timeStamp > a.timeStamp) return -1;
    else return 1;
  });
  // console.log("ascending", docObjArr);

  for (let i = 0; i < docObjArr.length; i++) {
    wpmArr.push(docObjArr[i].wpm);
    cpmArr.push(docObjArr[i].cpm);
    accArr.push(docObjArr[i].accuracy);
    labelArr.push(docObjArr[i].timeStamp.toDate().toDateString());
    timeArr.push(getTimeandDate(docObjArr[i].timeStamp));
  }

  return [wpmArr, cpmArr, accArr, labelArr, timeArr];
}

// this function simply returns the formated time and date stamp
function getTimeandDate(dateObj) {
  let date = new Date(dateObj.toDate());
  return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
}
