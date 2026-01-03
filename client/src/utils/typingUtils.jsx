

// typing calculator
export const calculateWPM = (startTime, charStates, currentWordIndex, words) => {
  if (!startTime) return 0;
  
  const timeElapsed = (Date.now() - startTime) / 60000; // Convert to minutes
  if (timeElapsed === 0) return 0;
  
  // Count all correctly typed characters
  let correctChars = 0;
  charStates.forEach((wordState) => {
    wordState.forEach((charState) => {
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
};

export const calculateAccuracy = (charStates) => {
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
};

export const calculateProgress = (currentWordIndex, userInputLength, currentWordLength, totalWords) => {
  const progress = ((currentWordIndex + (userInputLength / currentWordLength)) / totalWords) * 100;
  return Math.min(100, Math.max(0, progress));
};