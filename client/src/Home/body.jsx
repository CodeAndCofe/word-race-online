import { useState, useEffect, useRef, useCallback } from "react";

export default function Body() {
  // Configuration constants
  const TEXT = "Racing against time, I sprinted through the shadows and suddenly, a monstrous creature appeared right in front of me!";
  const COLOR_SCHEME = {
    background: "#0a0e17",
    surface: "#111827",
    accent: "#3b82f6",
    success: "#10b981",
    error: "#ef4444",
    text: {
      primary: "#f3f4f6",
      secondary: "#9ca3af",
      typed: "#60a5fa",
      future: "#4b5563"
    }
  };

  // Non-printable keys that shouldn't affect typing
  const NON_PRINTABLE_KEYS = new Set([
    "Enter", "Tab", "Escape", "Shift", "Meta", "CapsLock", "Control",
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "Home", "End", "PageUp", "PageDown",
    "Insert", "PrintScreen", "Pause",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
    "NumLock", "ScrollLock", "Alt", "ContextMenu"
  ]);

  // State declarations
  const [userInput, setUserInput] = useState("");
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charStates, setCharStates] = useState([]);
  const [isTestActive, setIsTestActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [progress, setProgress] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const inputStateRef = useRef({
    userInput: "",
    currentWordIndex: 0,
    isTestActive: false
  });

  // Initialize words and character states
  useEffect(() => {
    const splitWords = TEXT.trim().split(/\s+/);
    setWords(splitWords);
    
    // Initialize character states: null = not typed, true = correct, false = incorrect
    const initialCharStates = splitWords.map(word => 
      Array(word.length).fill(null)
    );
    setCharStates(initialCharStates);
  }, []);

  // Update ref whenever state changes (for event handler)
  useEffect(() => {
    inputStateRef.current = {
      userInput,
      currentWordIndex,
      isTestActive
    };
  }, [userInput, currentWordIndex, isTestActive]);

  // Handle character state updates
  useEffect(() => {
    if (!isTestActive || !words.length || currentWordIndex >= words.length) return;

    const currentWord = words[currentWordIndex];
    const typedLength = userInput.length;

    // Update character states for the current word
    setCharStates(prev => {
      const newStates = [...prev];
      if (!newStates[currentWordIndex]) return prev;

      // Update each character's state based on user input
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

    // Update progress
    const newProgress = ((currentWordIndex + (userInput.length / currentWord.length)) / words.length) * 100;
    setProgress(Math.min(100, newProgress));

    // Check if test is completed
    if (currentWordIndex === words.length - 1 && userInput === currentWord) {
      setTestCompleted(true);
      setIsTestActive(false);
    }
  }, [userInput, currentWordIndex, words, isTestActive]);

  // Handle keyboard input with ref-based approach to avoid stale closures
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = inputStateRef.current;
      
      // Ignore if test is not active or test is completed
      if (!state.isTestActive || testCompleted) return;

      // Prevent default for space to avoid scrolling
      if (e.key === ' ') {
        e.preventDefault();
      }

      // Start timer on first character input
      if (!startTime && /^[a-zA-Z]$/.test(e.key)) {
        setStartTime(Date.now());
      }

      // Handle backspace
      if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
        return;
      }

      // Handle space - only move to next word if current word is completed
      if (e.key === ' ') {
        const currentWord = words[state.currentWordIndex];
        if (state.userInput === currentWord && state.currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setUserInput("");
        }
        return;
      }

      // Handle printable characters
      if (!NON_PRINTABLE_KEYS.has(e.key) && e.key.length === 1) {
        setUserInput(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [words, startTime, testCompleted]);

  // Auto-scroll to keep current word in view
  useEffect(() => {
    if (!containerRef.current || !isTestActive) return;

    const wordElements = containerRef.current.querySelectorAll('.word-container');
    if (wordElements[currentWordIndex]) {
      wordElements[currentWordIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [currentWordIndex, isTestActive]);

  // Calculate Words Per Minute (WPM)
  const calculateWPM = useCallback(() => {
    if (!startTime) return 0;
    
    const timeElapsed = (Date.now() - startTime) / 60000; // Convert to minutes
    if (timeElapsed === 0) return 0;
    
    // Count all correctly typed characters (green ones)
    let correctChars = 0;
    charStates.forEach((wordState, wordIdx) => {
      wordState.forEach((charState, charIdx) => {
        if (charState === true) correctChars++;
      });
    });
    
    // Add currently typed characters in the current word
    if (currentWordIndex < words.length) {
      const currentWordState = charStates[currentWordIndex] || [];
      currentWordState.forEach(state => {
        if (state === true) correctChars++;
      });
    }
    
    // Standard WPM calculation: (characters / 5) / minutes
    const wordsTyped = correctChars / 5;
    return Math.round(wordsTyped / timeElapsed);
  }, [startTime, charStates, currentWordIndex, words]);

  // Calculate accuracy percentage
  const calculateAccuracy = useCallback(() => {
    let totalTyped = 0;
    let correctTyped = 0;
    
    charStates.forEach(wordState => {
      wordState.forEach(charState => {
        if (charState !== null) {
          totalTyped++;
          if (charState === true) correctTyped++;
        }
      });
    });
    
    if (totalTyped === 0) return 100;
    return Math.round((correctTyped / totalTyped) * 100);
  }, [charStates]);

  // Render a single word with character-by-character styling
  const renderWord = (word, wordIndex) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const isPastWord = wordIndex < currentWordIndex;
    const isFutureWord = wordIndex > currentWordIndex;

    return (
      <div 
        key={wordIndex} 
        className={`word-container inline-flex items-center mx-1 mb-2 transition-all duration-200 ${
          isCurrentWord ? 'bg-blue-900/20 rounded px-1 py-1' : ''
        }`}
      >
        {word.split('').map((char, charIndex) => {
          let colorClass = "";
          let charState = charStates[wordIndex]?.[charIndex];
          
          // Determine character color based on state
          if (isPastWord) {
            colorClass = "text-green-500"; // Completed words are green
          } else if (isCurrentWord) {
            if (charState === true) {
              colorClass = "text-blue-400 font-medium"; // Correct character
            } else if (charState === false) {
              colorClass = "text-red-500 bg-red-500/10 rounded"; // Incorrect character
            } else if (charIndex < userInput.length) {
              colorClass = "text-blue-300"; // Currently typing (correct so far)
            } else {
              colorClass = "text-gray-300"; // Not yet typed
            }
          } else {
            colorClass = "text-gray-500"; // Future words
          }

          // Add cursor at the current typing position
          const showCursor = isCurrentWord && charIndex === userInput.length;
          
          return (
            <span 
              key={charIndex} 
              className={`relative font-mono text-xl tracking-wide ${colorClass} transition-colors duration-75`}
            >
              {char}
              {showCursor && (
                <span className="absolute top-0 left-0 w-[2px] h-6 bg-blue-400 animate-pulse ml-[-1px]"></span>
              )}
            </span>
          );
        })}
        
        {/* Show cursor at end of word if all characters are typed */}
        {isCurrentWord && userInput.length === word.length && (
          <span className="w-[2px] h-6 bg-blue-400 animate-pulse ml-1"></span>
        )}
        
        {/* Space indicator between words (except after last word) */}
        {wordIndex < words.length - 1 && (
          <span className="text-gray-600 mx-[2px]">␣</span>
        )}
      </div>
    );
  };

  // Progress bar component
  const ProgressBar = () => {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    return (
      <div className="w-full max-w-4xl mt-6">
        <div className="flex justify-between text-gray-300 text-sm mb-2">
          <div className="flex gap-6">
            <span className="font-medium">Progress: {Math.round(progress)}%</span>
            {startTime && (
              <>
                <span className="font-medium">WPM: {wpm}</span>
                <span className="font-medium">Accuracy: {accuracy}%</span>
              </>
            )}
          </div>
          <span className="text-gray-400">
            Word {Math.min(currentWordIndex + 1, words.length)} of {words.length}
          </span>
        </div>
        
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // Results screen component
  const ResultsScreen = () => {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    return (
      <div className="bg-gradient-to-br from-gray-900 to-blue-900/30 rounded-xl p-8 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Test Completed!</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400">{wpm}</div>
            <div className="text-gray-400 text-sm mt-1">WPM</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
            <div className="text-gray-400 text-sm mt-1">Accuracy</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={resetTest}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
          
          <button
            onClick={() => setIsTestActive(false)}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors duration-200"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  };

  // Reset test to initial state
  const resetTest = () => {
    setUserInput("");
    setCurrentWordIndex(0);
    setStartTime(null);
    setProgress(0);
    setTestCompleted(false);
    setIsTestActive(true);
    
    // Reset character states
    const initialCharStates = words.map(word => Array(word.length).fill(null));
    setCharStates(initialCharStates);
  };

  // Start the typing test
  const startTest = () => {
    setIsTestActive(true);
    setTestCompleted(false);
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 transition-all duration-300"
      style={{ backgroundColor: COLOR_SCHEME.background }}
    >
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Speed<span className="text-blue-400">Type</span>
          </h1>
          <p className="text-gray-400">Test your typing speed and accuracy</p>
        </div>

        {/* Main Content Area */}
        <div 
          className="rounded-2xl p-8 mb-8 transition-all duration-300"
          style={{ backgroundColor: COLOR_SCHEME.surface }}
        >
          {testCompleted ? (
            <ResultsScreen />
          ) : !isTestActive ? (
            // Start Screen
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center max-w-2xl">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Ready to test your typing speed?
                </h2>
                <p className="text-gray-400 mb-8">
                  Type the text below as fast and accurately as you can. Press space to move to the next word.
                </p>
                
                <button
                  onClick={startTest}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  Start Test
                </button>
                
                <div className="mt-10 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                  <p className="text-gray-400 text-sm mb-3">Sample Text:</p>
                  <p className="text-gray-300 font-mono text-lg leading-relaxed">
                    {TEXT}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Active Test Screen
            <>
              {/* Instructions */}
              <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Incorrect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span>Current</span>
                </div>
              </div>

              {/* Text Display Area */}
              <div 
                ref={containerRef}
                className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 min-h-[180px] max-h-[240px] overflow-y-auto"
              >
                <div className="flex flex-wrap justify-center items-center">
                  {words.map((word, index) => renderWord(word, index))}
                </div>
              </div>

              {/* Progress and Stats */}
              <ProgressBar />

              {/* Controls */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setIsTestActive(false)}
                  className="px-6 py-2.5 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-all duration-200"
                >
                  Pause
                </button>
                
                <button
                  onClick={resetTest}
                  className="px-6 py-2.5 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  Restart
                </button>
              </div>

              {/* Quick Tips */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-gray-500 text-sm text-center">
                  Tip: Focus on accuracy first, speed will come naturally. Use <kbd className="px-2 py-1 bg-gray-800 rounded mx-1">Space</kbd> to complete words.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Built with React • Inspired by MonkeyType</p>
        </div>
      </div>
    </div>
  );
}