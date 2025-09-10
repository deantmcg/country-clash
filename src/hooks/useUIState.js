import { useState } from 'react';
import { GAME_STATES } from '../constants/gameConstants';

export const useUIState = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const resetUIState = () => {
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);
  };

  return {
    currentQuestion,
    setCurrentQuestion,
    userAnswer,
    setUserAnswer,
    feedback,
    setFeedback,
    showAnswer,
    setShowAnswer,
    playerName,
    setPlayerName,
    resetUIState
  };
};

export const useLanguageUpdate = (setGameState, currentState) => {
  return () => {
    switch (currentState) {
      case GAME_STATES.MENU:
        setGameState(GAME_STATES.MENU_UPDATE);
        break;
      case GAME_STATES.MENU_UPDATE:
        setGameState(GAME_STATES.MENU);
        break;
      case GAME_STATES.GAME_OVER:
        setGameState(GAME_STATES.GAME_OVER_UPDATE);
        break;
      case GAME_STATES.GAME_OVER_UPDATE:
        setGameState(GAME_STATES.GAME_OVER);
        break;
      default:
        // For the playing state, we'll handle it differently
        break;
    }
  };
};
