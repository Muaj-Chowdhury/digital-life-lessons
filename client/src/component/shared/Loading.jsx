import Lottie from "lottie-react";
import loaderAnimation from "../../assets/loading-animation.json";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="w-64 h-64">
        <Lottie 
          animationData={loaderAnimation} 
          loop={true} 
        />
      </div>
      {/* <p className="text-gray-500 font-medium animate-pulse mt-4">
        Gathering wisdom for you...
      </p> */}
    </div>
  );
};

export default Loading;
