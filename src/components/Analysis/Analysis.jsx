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
      if (data[0].length == 0) {
        toast.info("No test data found", {
          position: "top-right",
          autoClose: 5000,
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
    });
  }, [navigate, theme.thematicColor, uid, userEmailName]);

  return (
    <div className="bg-bgColor w-full min-h-screen">
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

        <div className="w-3/5 h-3/5 p-4 rounded-2xl shadow-lg bg-bgColor ">
          <LineGraph dataSet={dataSet} />
        </div>

        <div className="w-3/5 p-4 rounded-2xl shadow-lg bg-bgColor flex flex-col mt-4">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium">
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
                        Test Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b transition duration-300 ease-in-out hover:bg-thematicColor text-textColor font-normal">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        1
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">Mark</td>
                      <td className="whitespace-nowrap px-6 py-4">Otto</td>
                      <td className="whitespace-nowrap px-6 py-4">@mdo</td>
                      <td className="whitespace-nowrap px-6 py-4">@mdo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getData(uid, segment) {
  let wpmArr = [];
  let cpmArr = [];
  let accArr = [];
  let labelArr = [];

  let querySnapshot = await getDocs(collection(db, uid, segment, "result"));

  querySnapshot.forEach((doc) => {
    let docObj = doc.data();
    wpmArr.push(docObj.wpm);
    cpmArr.push(docObj.cpm);
    accArr.push(docObj.accuracy);
    labelArr.push(docObj.timeStamp);
  });

  return [wpmArr, cpmArr, accArr, labelArr];
}
