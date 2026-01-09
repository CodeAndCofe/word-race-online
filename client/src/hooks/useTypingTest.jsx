import { useState, useEffect, useRef, useCallback } from "react";
import { TEXT, NON_PRINTABLE_KEYS } from "../const/index.js";
import { calculateProgress } from "../utils/typingUtils";

const useTypingTest = () => {
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
    isTestActive: false,
    words: []
  });

  // Initialize words and character states
  useEffect(() => {
    const splitWords = TEXT.trim().split(/\s+/);
    setWords(splitWords);
    
    const initialCharStates = splitWords.map(word => 
      Array(word.length).fill(null)
    );
    setCharStates(initialCharStates);
    
    // Also update the ref with initial words
    inputStateRef.current.words = splitWords;
  }, []);

  // Update ref whenever state changes
  useEffect(() => {
    inputStateRef.current = {
      userInput,
      currentWordIndex,
      isTestActive,
      words: inputStateRef.current.words // Keep the existing words
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
    const newProgress = calculateProgress(
      currentWordIndex,
      userInput.length,
      currentWord.length,
      words.length
    );
    setProgress(newProgress);

    // Check if test is completed
    if (currentWordIndex === words.length - 1 && userInput === currentWord) {
      setTestCompleted(true);
      setIsTestActive(false);
    }
  }, [userInput, currentWordIndex, words, isTestActive]);

  // Handle keyboard input - FIXED VERSION
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = inputStateRef.current;
      
      if (!state.isTestActive || testCompleted) return;

      if (e.key === ' ') {
        e.preventDefault();
        
        // Use the current state from ref
        const currentWord = words[state.currentWordIndex];
        if (state.userInput === currentWord && state.currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setUserInput("");
        }
        return;
      }

      if (!startTime && /^[a-zA-Z]$/.test(e.key)) {
        setStartTime(Date.now());
      }

      if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
        return;
      }

      if (!NON_PRINTABLE_KEYS.has(e.key) && e.key.length === 1) {
        setUserInput(prev => {
          const currentWord = words[inputStateRef.current.currentWordIndex];
          // Prevent typing beyond word length
          if (prev.length < currentWord.length) {
            return prev + e.key;
          }
          return prev;
        });
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

  // Reset test to initial state
  const resetTest = useCallback(() => {
    setUserInput("");
    setCurrentWordIndex(0);
    setStartTime(null);
    setProgress(0);
    setTestCompleted(false);
    setIsTestActive(true);
    
    const initialCharStates = words.map(word => Array(word.length).fill(null));
    setCharStates(initialCharStates);
  }, [words]);

  // Start the typing test
  const startTest = useCallback(() => {
    setIsTestActive(true);
    setTestCompleted(false);
  }, []);

  return {
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
    setIsTestActive,
    
    // Setters
    setUserInput,
    setCurrentWordIndex
  };
};

export default useTypingTest;