import { useState, useEffect } from "react";
import home from "../assets/home1.png";
import LoginModal from "../components/loginModal";
import { useSearchParams } from "react-router-dom";

function Home() {
  const [params, setParams] = useSearchParams();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setLoaded(true);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div>
      {params.get("loginModal") === "open" && <LoginModal setOpen={() => {setParams("loginModal=close")}}/>}
      <div className="h-svh bg-gradient-to-b from-[#1b3e48] to-black flex flex-row items-center font-sans">
        <div className="font-bold text-white leading-snug">
          <h1 className={`transition-all duration-300 ${loaded ? "ml-20 opacity-100 text-9xl" : "-ml-20 opacity-0 text-8xl"}`}>
            Code.
          </h1>
          <h1 className={`transition-all duration-500 ${loaded ? "ml-20 opacity-100 text-9xl" : "-ml-20 opacity-0 text-8xl"}`}>
            Edit.
          </h1>
          <h1 className={`transition-all duration-700 ${loaded ? "ml-20 opacity-100 text-9xl" : "-ml-20 opacity-0 text-8xl"}`}>
            Deploy.
          </h1>
          <div className="mt-20 ml-24 flex gap-5">
            <button
              className="bg-green-600 text-white h-12 w-36 rounded-md shadow-md shadow-black"
              onClick={() => { setParams("loginModal=open") }}
            >
              Try Now
            </button>
            <button className="bg-opacity-10 bg-white text-green-600 border-green-600 border h-12 w-36 rounded-md shadow-md shadow-black">
              Learn More
            </button>
          </div>
        </div>
        <div className={`absolute h-svh w-1/2 p-5 flex justify-center transition-all duration-300 ${loaded ? "opacity-100 right-10" : "opacity-0 -right-10"}`}>
          <img src={home} alt="home" className="object-cover block" />
        </div>
      </div>
    </div>
  );
}

export default Home;
