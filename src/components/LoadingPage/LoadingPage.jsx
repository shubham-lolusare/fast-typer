import loading_pic from "./loading_animation.svg";

export default function Loading() {
  return (
    <div className="h-screen w-full fixed top-0 left-0 bg-black/90 flex flex-col justify-center items-center z-[2000]">
      <img
        src={loading_pic}
        alt="Loading Animation Picture"
        width="500vw"
        className="sm:w-[60%] xs:w-[80%] mobile:w-[100%] tall:w-[40%]"
      />
      <h1 className="text-[5vw] font-bold animate-rainbow md:text-8xl sm:text-6xl xs:text-5xl tall:text-5xl">
        Loading...
      </h1>
    </div>
  );
}
