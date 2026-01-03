import { calculateWPM, calculateAccuracy } from "../utils/typingUtils";

const ResultsScreen = ({ 
  charStates, 
  startTime, 
  currentWordIndex, 
  words, 
  resetTest, 
  setIsTestActive 
}) => {
  const wpm = calculateWPM(startTime, charStates, currentWordIndex, words);
  const accuracy = calculateAccuracy(charStates);
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900/30 rounded-xl p-8 max-w-lg w-full text-center ml-[50%] transform-[translateX(-50%)]">
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

export default ResultsScreen;