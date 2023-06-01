import loading_pic from "./loading_animation.svg";

export default function Loading() {
  return (
    <div className="h-screen w-full absolute top-0 left-0 bg-black/90 flex flex-col justify-center items-center">
      <img src={loading_pic} alt="Loading Animation Picture" width="500vw" />
      <h1 className="text-[5vw] font-bold animate-rainbow">Loading...</h1>
    </div>
  );
}
