import { calculateWPM, calculateAccuracy } from "../utils/typingUtils";

const ProgressBar = ({ 
  progress, 
  currentWordIndex, 
  words, 
  startTime, 
  charStates 
}) => {
  const wpm = calculateWPM(startTime, charStates, currentWordIndex, words);
  const accuracy = calculateAccuracy(charStates);
  
  return (
    <div className="w-full  mt-6">
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

export default ProgressBar;