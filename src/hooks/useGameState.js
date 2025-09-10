import { useState, useEffect } from 'react';
import { GAME_STATES, GAME_SETTINGS } from '../constants/gameConstants';

export const useGameState = () => {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(GAME_SETTINGS.INITIAL_LIVES);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [highScores, setHighScores] = useState([]);
  const [usedCountries, setUsedCountries] = useState(new Set());
  const [answerLog, setAnswerLog] = useState([]);

  // Load high scores on mount
  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('capitalCitiesHighScores') || '[]');
    setHighScores(savedScores);
  }, []);

  const saveHighScore = (playerName, finalScore, totalQuestions) => {
    const newScore = {
      name: playerName,
      score: finalScore,
      questions: totalQuestions,
      date: new Date().toLocaleDateString()
    };
    
    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, GAME_SETTINGS.HIGH_SCORES_LIMIT);
    
    setHighScores(updatedScores);
    localStorage.setItem('capitalCitiesHighScores', JSON.stringify(updatedScores));
  };

  const resetGameState = () => {
    setScore(0);
    setLives(GAME_SETTINGS.INITIAL_LIVES);
    setQuestionsAnswered(0);
    setDifficulty(1);
    setUsedCountries(new Set());
    setAnswerLog([]);
  };

  return {
    gameState,
    setGameState,
    score,
    setScore,
    lives,
    setLives,
    questionsAnswered,
    setQuestionsAnswered,
    difficulty,
    setDifficulty,
    highScores,
    usedCountries,
    setUsedCountries,
    answerLog,
    setAnswerLog,
    saveHighScore,
    resetGameState
  };
};
