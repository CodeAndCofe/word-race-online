const TextDisplay = ({ 
  words, 
  currentWordIndex, 
  charStates, 
  userInput, 
  containerRef 
}) => {
  const renderWord = (word, wordIndex) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const isPastWord = wordIndex < currentWordIndex;

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
            colorClass = "text-green-500";
          } else if (isCurrentWord) {
            if (charState === true) {
              colorClass = "text-blue-400 font-medium";
            } else if (charState === false) {
              colorClass = "text-red-500 bg-red-500/10 rounded";
            } else if (charIndex < userInput.length) {
              colorClass = "text-blue-300";
            } else {
              colorClass = "text-gray-300";
            }
          } else {
            colorClass = "text-gray-500";
          }

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
        
        {isCurrentWord && userInput.length === word.length && (
          <span className="w-[2px] h-6 bg-blue-400 animate-pulse ml-1"></span>
        )}
        
        {wordIndex < words.length - 1 && (
          <span className="text-gray-600 mx-[2px]">␣</span>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 min-h-[180px] max-h-[240px] overflow-y-auto"
    >
      <div className="flex flex-wrap justify-center items-center">
        {words.map((word, index) => renderWord(word, index))}
      </div>
    </div>
  );
};

export default TextDisplay;