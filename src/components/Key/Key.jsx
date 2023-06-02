/* eslint-disable react/prop-types */

export default function Key({ value, keycode, keypress }) {
  return keycode == keypress ? (
    <div
      id={keycode}
      className="border-[1px] border-thematicColor rounded-lg w-[50px] h-[50px] flex justify-center items-center bg-thematicColor text-textColor"
    >
      {value}
    </div>
  ) : (
    <div
      id={keycode}
      className="border-[1px] border-thematicColor bg-transparent rounded-lg w-[50px] h-[50px] flex justify-center items-center"
    >
      {value}
    </div>
  );
}
