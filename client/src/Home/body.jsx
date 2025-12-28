import { useState, useRef, useEffect } from "react";

export default function Body() {
  const [text] = useState(
    "Racing against time, I sprinted through the shadows and suddenly, a monstrous creature appeared right in front of me!"
  );
  const [usertext, setUsertext] = useState([]);
  const [words, setWords] = useState([]);
  const [showButton, setShowButton] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const splitWords = text.trim().split(/\s+/);
    setWords(splitWords);
    setUsertext(new Array(splitWords.length).fill(""));
  }, [text]);


  useEffect(() => {
    function handleKeyDown(e) {
      if (showButton) return;

      if (e.key === "Backspace") {
        setUsertext(prev => {
          const copy = [...prev];
          copy[currentIndex] = (copy[currentIndex] || "").slice(0, -1);
          return copy;
        });
        return;
      }

      if (e.key.length !== 1) return;

      setUsertext(prev => {
        const copy = [...prev];
        copy[currentIndex] += e.key;
        return copy;
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showButton, currentIndex]);

  function TextPart() {
    return (
      <div className="flex flex-row gap-2 justify-center flex-wrap w-[50%]">
        {words.map((word, index) => (
          <div className="relative">
            <div className="bg-[#393E46] absolute top-0 left-0 text-blue-400 opacity-[100%] z-10 font-semibold text-2xl" ref={ref}>
              {usertext[index] }
            </div>
              <div
                key={index}
                className=" text-gray-500  font-semibold text-2xl z-1"
              >
                {word}
              </div>
            </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center w-screen">
      <div className="rounded-md p-4 h-[500px] w-[70%] bg-[#393E46] flex flex-col justify-evenly items-center">
        <TextPart />

        {showButton && (
          <button
            className="
              rounded-md px-6 py-3 text-white font-bold text-lg shadow-lg
              border-2 border-[#948979]
              hover:scale-105 transition-all duration-500
              active:scale-95 active:bg-[#948979] active:text-black
              cursor-pointer
            "
            onClick={() => setShowButton(false)}
          >
            Click Me
          </button>
        )}
      </div>
    </div>
  );
}
