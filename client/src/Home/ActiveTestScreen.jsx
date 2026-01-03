import TextDisplay from "./TextDisplay";
import ProgressBar from "./ProgressBar";

const ActiveTestScreen = ({
  words,
  currentWordIndex,
  charStates,
  userInput,
  containerRef,
  progress,
  startTime,
  resetTest,
  setIsTestActive
}) => {
  return (
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
      <TextDisplay
        words={words}
        currentWordIndex={currentWordIndex}
        charStates={charStates}
        userInput={userInput}
        containerRef={containerRef}
      />

      <ProgressBar
        progress={progress}
        currentWordIndex={currentWordIndex}
        words={words}
        startTime={startTime}
        charStates={charStates}
      />

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
  );
};

export default ActiveTestScreen;