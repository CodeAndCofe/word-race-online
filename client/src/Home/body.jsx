import { useState, useRef, useEffect } from "react";

export default function Body() {
  const [text] = useState(
    "Racing against time, I sprinted through the shadows and suddenly, a monstrous creature appeared right in front of me!"
  ); // the text requerment
  const [is_next_key_wrong, Setis_next_key_wrong] = useState(false);
  const [usertext, setUsertext] = useState("");// user inpiut words
  const [words, setWords] = useState([]);// bot words
  const [showButton, setShowButton] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const splitWords = text.trim().split(/\s+/);
    setWords(splitWords);
  }, [text]);

  useEffect(()=>
  {
    console.log(usertext);
    console.log("word is : " + words[currentIndex] + ",  user is : \"" + usertext +"\"");
      if (words[currentIndex] == usertext)
      {
        setCurrentIndex(prev => prev + 1);
        setUsertext("");
      }
  }, [usertext])

  useEffect(() => {
    function handleKeyDown(e)
    {
      if (is_next_key_wrong == true)
        return ;

      if (/^[A-Za-z]$/.test(e.key) === false && e.key !== "Backspace" && e.key !== " ")
          return ;
      if (e.key == "Backspace")// whataver user back space the string would erase back
      {
        setUsertext((prev) =>
        {
          prev = prev.substring(0, prev.length - 1);
          return prev;
        });
        return;
      }
      setUsertext((prev) =>
        {
          prev = (prev + e.key)
          return prev;
        });
      // if the current word matches with user word input

      
      

      
      // if next key wrong do
      // else add key to user and compare if it wrong
      // if it right then color key with color green or blue
      // howover the color should be red
      //once the word correct he can no longer back to previews word once he clicked espace
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showButton, currentIndex]);

  function TextPart() {
    return (
      <div className="flex flex-row gap-2 justify-center flex-wrap w-[50%]">
        {words.map((word, index) => (
          <div className="relative">
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
