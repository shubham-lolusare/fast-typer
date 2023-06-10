import { useNavigate } from "react-router-dom";
import ThemeSelector from "../ThemeSelector/ThemeSelector";
import { VscFeedback } from "react-icons/vsc";

export default function FooterTabs() {
  let navigate = useNavigate();
  return (
    <footer className="fixed bottom-0 p-2 bg-thematicColor text-textColor rounded-t-xl shadow-lg flex justify-center items-center gap-4">
      <button
        onClick={() => {
          navigate("/feedback");
        }}
        className="flex justify-center items-center gap-2 cursor-pointer p-1 pl-4 pr-4 bg-bgColor text-textColor shadow-md rounded hover:bg-green-600 hover:text-white xs:p-1"
      >
        <VscFeedback className="text-2xl xs:text-xl" />{" "}
        <span className="text-base xs:text-[13px]">Feedback</span>
      </button>
      <ThemeSelector />
    </footer>
  );
}
