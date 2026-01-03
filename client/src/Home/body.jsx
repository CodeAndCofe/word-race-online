import useTypingTest from "../hooks/useTypingTest";
import StartScreen from "./StartScreen";
import ActiveTestScreen from "./ActiveTestScreen";
import ResultsScreen from "./ResultsScreen";
import { COLOR_SCHEME } from "../const";

const Body = () => {
  const {
    // State
    userInput,
    words,
    currentWordIndex,
    charStates,
    isTestActive,
    startTime,
    progress,
    testCompleted,
    
    // Refs
    containerRef,
    
    // Functions
    resetTest,
    startTest,
    setIsTestActive
  } = useTypingTest();

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 transition-all duration-300"
      style={{ backgroundColor: COLOR_SCHEME.background }}
    >
      <div className="w-full max-w-6xl">
        <div 
          className="rounded-2xl p-8 mb-8 transition-all duration-300"
          style={{ backgroundColor: COLOR_SCHEME.surface }}
        >
          {testCompleted ? (
            <ResultsScreen
              charStates={charStates}
              startTime={startTime}
              currentWordIndex={currentWordIndex}
              words={words}
              resetTest={resetTest}
              setIsTestActive={setIsTestActive}
            />
          ) : !isTestActive ? (
            <StartScreen startTest={startTest} />
          ) : (
            <ActiveTestScreen
              words={words}
              currentWordIndex={currentWordIndex}
              charStates={charStates}
              userInput={userInput}
              containerRef={containerRef}
              progress={progress}
              startTime={startTime}
              resetTest={resetTest}
              setIsTestActive={setIsTestActive}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;