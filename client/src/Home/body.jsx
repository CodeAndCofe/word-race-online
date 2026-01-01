import { useState, useEffect, useCallback, useRef } from "react";

export default function Body() {
  const [text] = useState(
    "Racing against time, I sprinted through the shadows and suddenly, a monstrous creature appeared right in front of me!"
  );
  const [userInput, setUserInput] = useState("");
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charStates, setCharStates] = useState([]); // 2D array of char states
  const [showButton, setShowButton] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const containerRef = useRef(null);

  // Initialize words and character states
  useEffect(() => {
    const splitWords = text.trim().split(/\s+/);
    setWords(splitWords);
    
    // Initialize char states: null = not typed, true = correct, false = incorrect
    const initialCharStates = splitWords.map(word => 
      Array(word.length).fill(null)
    );
    setCharStates(initialCharStates);
  }, [text]);

  // Handle typing logic
  useEffect(() => {
    if (!words.length || currentWordIndex >= words.length || showButton) return;

    const currentWord = words[currentWordIndex];
    const typedLength = userInput.length;

    // Update character states for current word
    setCharStates(prev => {
      const newStates = [...prev];
      if (!newStates[currentWordIndex]) return prev;

      for (let i = 0; i < currentWord.length; i++) {
        if (i < typedLength) {
          const typedChar = userInput[i];
          const correctChar = currentWord[i];
          newStates[currentWordIndex][i] = typedChar === correctChar;
        } else {
          newStates[currentWordIndex][i] = null;
        }
      }
      return newStates;
    });

    // Move to next word if current word is completed
    if (userInput === currentWord + ' ' || userInput === currentWord) {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setUserInput("");
      }
    }
  }, [userInput, currentWordIndex, words, showButton]);

  // Handle keyboard input
  useEffect(() => {
    if (showButton) return;

    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
      }

      // Record start time on first key press
      if (!startTime && /^[a-zA-Z]$/.test(e.key)) {
        setStartTime(Date.now());
      }

      // Handle backspace
      if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
        return;
      }

      // Handle space
      if (e.key === ' ') {
        const currentWord = words[currentWordIndex];
        if (userInput === currentWord && currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setUserInput("");
        }
        return;
      }

      // Handle letters only
      if (/^[a-zA-Z]$/.test(e.key)) {
        setUserInput(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showButton, userInput, currentWordIndex, words, startTime]);

  // Scroll to keep current word in view
  useEffect(() => {
    if (!containerRef.current || showButton) return;

    const wordElements = containerRef.current.querySelectorAll('.word-container');
    if (wordElements[currentWordIndex]) {
      wordElements[currentWordIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [currentWordIndex, showButton]);

  // Calculate WPM
  const calculateWPM = useCallback(() => {
    if (!startTime) return 0;
    const timeElapsed = (Date.now() - startTime) / 60000; // minutes
    const charsTyped = words
      .slice(0, currentWordIndex)
      .join('').length + userInput.length;
    const wordsTyped = charsTyped / 5; // standard word length
    return Math.round(wordsTyped / timeElapsed);
  }, [startTime, words, currentWordIndex, userInput]);

  // Render a single word with characters
  const renderWord = (word, wordIndex) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const currentWord = words[currentWordIndex];
    const currentTypedLength = userInput.length;

    return (
      <div 
        key={wordIndex} 
        className="word-container flex gap-[2px] items-center mx-1"
      >
        {word.split('').map((char, charIndex) => {
          let className = "font-mono text-2xl transition-colors duration-100";
          let charState = null;

          if (wordIndex < currentWordIndex) {
            // Past words - all correctly typed
            className += " text-green-500";
          } else if (wordIndex === currentWordIndex) {
            // Current word
            charState = charStates[wordIndex]?.[charIndex];
            if (charState === true) {
              className += " text-green-500";
            } else if (charState === false) {
              className += " text-red-500";
            } else {
              className += " text-gray-400";
            }

            // Show cursor at current position
            if (charIndex === currentTypedLength && isCurrentWord) {
              return (
                <div key={charIndex} className="relative">
                  <span className={className}>{char}</span>
                  <span className="absolute top-0 left-0 w-[2px] h-7 bg-yellow-400 animate-pulse ml-[-1px]"></span>
                </div>
              );
            }
          } else {
            // Future words
            className += " text-gray-600";
          }

          return <span key={charIndex} className={className}>{char}</span>;
        })}

        {/* Extra cursor if at end of word */}
        {isCurrentWord && currentTypedLength === word.length && (
          <span className="w-[2px] h-7 bg-yellow-400 animate-pulse ml-[-1px]"></span>
        )}

        {/* Space between words */}
        {wordIndex < words.length - 1 && (
          <span className="w-2"></span>
        )}
      </div>
    );
  };

  // Render progress bar
  const ProgressBar = () => {
    const progress = ((currentWordIndex + (userInput.length / words[currentWordIndex]?.length || 0)) / words.length) * 100;
    
    return (
      <div className="w-full max-w-2xl mt-4">
        <div className="flex justify-between text-gray-400 text-sm mb-1">
          <span>Progress: {Math.round(progress)}%</span>
          {startTime && <span>WPM: {calculateWPM()}</span>}
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 flex flex-col items-center w-screen min-h-screen bg-gray-900">
      <div className="rounded-lg p-8 min-h-[400px] w-full max-w-6xl bg-gray-800 flex flex-col items-center justify-center">
        {showButton ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-white text-2xl mb-6 text-center">
              Get ready to type! Focus on accuracy and speed.
            </h2>
            <button
              className="
                rounded-lg px-8 py-4 text-white font-bold text-xl
                bg-gradient-to-r from-blue-600 to-green-600
                hover:from-blue-700 hover:to-green-700
                transform hover:scale-105 transition-all duration-300
                active:scale-95
                shadow-lg
                cursor-pointer
                border-0
              "
              onClick={() => setShowButton(false)}
            >
              Start Typing Test
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              Press any letter key to begin timing
            </p>
          </div>
        ) : (
          <>
            <div 
              ref={containerRef}
              className="flex flex-wrap justify-center gap-y-4 p-6 rounded-lg bg-gray-900 w-full max-w-5xl min-h-[200px] items-center overflow-x-auto"
            >
              {words.map((word, index) => renderWord(word, index))}
            </div>
            
            <ProgressBar />
            
            <div className="mt-8 text-gray-400 text-sm">
              <p>Type the text above. Use <kbd className="px-2 py-1 bg-gray-700 rounded">Space</kbd> to move to next word.</p>
              <p className="mt-2">Current word: <span className="text-yellow-300">{currentWordIndex + 1}</span> of <span className="text-yellow-300">{words.length}</span></p>
            </div>

            <button
              className="mt-6 px-6 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => {
                setShowButton(true);
                setUserInput("");
                setCurrentWordIndex(0);
                setStartTime(null);
              }}
            >
              Restart Test
            </button>
          </>
        )}
      </div>
    </div>
  );
}