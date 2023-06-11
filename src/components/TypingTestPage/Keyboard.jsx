/* eslint-disable react/prop-types */

import Key from "./Key";

export default function Keyboard({ keypress }) {
  return (
    <div className="border-[1px] border-thematicColor p-4 rounded-2xl shadow-lg flex flex-col gap-2 justify-evenly items-center tall:hidden mobile:hidden">
      <div className="flex gap-4">
        <Key value="Q" key="81" keycode="81" keypress={keypress} />
        <Key value="W" key="87" keycode="87" keypress={keypress} />
        <Key value="E" key="69" keycode="69" keypress={keypress} />
        <Key value="R" key="82" keycode="82" keypress={keypress} />
        <Key value="T" key="84" keycode="84" keypress={keypress} />
        <Key value="Y" key="89" keycode="89" keypress={keypress} />
        <Key value="U" key="85" keycode="85" keypress={keypress} />
        <Key value="I" key="73" keycode="73" keypress={keypress} />
        <Key value="O" key="79" keycode="79" keypress={keypress} />
        <Key value="P" key="80" keycode="80" keypress={keypress} />
      </div>
      <div className="flex gap-4">
        <Key value="A" key="65" keycode="65" keypress={keypress} />
        <Key value="S" key="83" keycode="83" keypress={keypress} />
        <Key value="D" key="68" keycode="68" keypress={keypress} />
        <Key value="F" key="70" keycode="70" keypress={keypress} />
        <Key value="G" key="71" keycode="71" keypress={keypress} />
        <Key value="H" key="72" keycode="72" keypress={keypress} />
        <Key value="J" key="74" keycode="74" keypress={keypress} />
        <Key value="K" key="75" keycode="75" keypress={keypress} />
        <Key value="L" key="76" keycode="76" keypress={keypress} />
      </div>
      <div className="flex gap-4">
        <Key value="Z" key="90" keycode="90" keypress={keypress} />
        <Key value="X" key="88" keycode="88" keypress={keypress} />
        <Key value="C" key="67" keycode="67" keypress={keypress} />
        <Key value="V" key="86" keycode="86" keypress={keypress} />
        <Key value="B" key="66" keycode="66" keypress={keypress} />
        <Key value="N" key="78" keycode="78" keypress={keypress} />
        <Key value="M" key="77" keycode="77" keypress={keypress} />
      </div>
      <div className="flex w-full gap-4">
        {keypress == 32 ? (
          <div
            id="32"
            className="border-[1px] border-thematicColor rounded-lg w-[60%] h-[50px] flex flex-[0.7] justify-center items-center bg-thematicColor text-textColor"
          >
            SPACEBAR
          </div>
        ) : (
          <div
            id="32"
            className="border-[1px] border-thematicColor bg-transparent rounded-lg w-[60%] h-[50px] flex flex-[0.7] justify-center items-center"
          >
            SPACEBAR
          </div>
        )}
        {keypress == 8 ? (
          <div
            id="8"
            className="border-[1px] border-thematicColor rounded-lg w-[60%] h-[50px] flex flex-[0.3] justify-center items-center bg-thematicColor text-textColor"
          >
            BACKSPACE
          </div>
        ) : (
          <div
            id="8"
            className="border-[1px] border-thematicColor bg-transparent rounded-lg w-[60%] h-[50px] flex flex-[0.3] justify-center items-center"
          >
            BACKSPACE
          </div>
        )}
      </div>
    </div>
  );
}
