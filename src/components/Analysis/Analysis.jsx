import Navbar from "../Navbar/Navbar";
import useTheme from "../ThemeSelector/Themehook";
import LineGraph from "./LineGraph";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "../LoadingPage/LoadingPage";

export default function Analysis() {
  let theme = useTheme();
  let [uid, setUid] = useState();
  let [userEmailName, setUserEmailName] = useState();
  let [label] = useState([]);
  let navigate = useNavigate();
  let [dataSet, setDataSet] = useState({
    label,
    datasets: [],
  });
  let [totalTest, setTotalTest] = useState(0);
  let [tableBody, setTableBody] = useState([]);
  let [loading, setLoading] = useState(true);

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
              <td className="whitespace-nowrap px-6 py-4">{`${data[3][i]}, ${data[4][i]}`}</td>
            </tr>
          );
        }

        return tableCells;
      });
    });
  }, [navigate, theme.thematicColor, uid, userEmailName]);

  return (
    <div className="bg-bgColor w-full min-h-screen animate-fade-in transition-all duration-500 ease-in-out">
      <ToastContainer />
      <Navbar />
      <div className="flex flex-col justify-center items-center p-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-center font-bold text-5xl text-textColor">
            Test Analysis
          </h1>
          <div className="text-sm font-bold text-textColor">
            Total tests taken: {totalTest}
          </div>
        </div>

        <div className="w-[80%] h-3/5 p-4 rounded-2xl shadow-lg bg-bgColor ">
          <LineGraph dataSet={dataSet} />
        </div>

        {totalTest != 0 && (
          <div className="w-3/5 p-4 rounded-2xl shadow-lg bg-bgColor flex flex-col mt-4">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-center text-textColor rounded-2xl">
                    <caption className="text-xl font-bold mb-4">
                      Test Data
                    </caption>
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
              </div>
            </div>
          </div>
        )}
      </div>
      {loading && <LoadingPage />}
    </div>
  );
}

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
    labelArr.push(getDateAsDDMMYYYY(docObjArr[i].timeStamp));
    timeArr.push(getTimeAsHHMM(docObjArr[i].timeStamp));
  }

  return [wpmArr, cpmArr, accArr, labelArr, timeArr];
}

function getDateAsDDMMYYYY(str) {
  let tempStr = "";

  for (let i = 1; i < str.length; i++) {
    if (str.charAt(i) == ")") {
      return tempStr;
    } else {
      tempStr += str.charAt(i);
    }
  }
}

function getTimeAsHHMM(str) {
  let tempStr = "";
  let tempArr = str.split("+");

  for (let i = 1; i < tempArr[1].length; i++) {
    if (tempArr[1].charAt(i) == ")") {
      let temp = tempStr.split("/");
      return `${temp[0]}:${temp[1]}`;
    } else {
      tempStr += tempArr[1].charAt(i);
    }
  }

  return `${tempArr[1]}`;
}
