import { TEXT } from "../const";

const StartScreen = ({ startTest }) => {
  return (
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
  );
};

export default StartScreen;