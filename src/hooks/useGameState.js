import { useState, useEffect } from 'react';
import { GAME_STATES, GAME_SETTINGS } from '../constants/gameConstants';
import * as apiService from '../services/apiService';

export const useGameState = () => {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(GAME_SETTINGS.INITIAL_LIVES);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [highScores, setHighScores] = useState([]);
  const [usedCountries, setUsedCountries] = useState(new Set());
  const [answerLog, setAnswerLog] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Load high scores from API on mount
  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    setIsLoadingScores(true);
    setApiError(null);
    try {
      const scores = await apiService.fetchHighScores();
      setHighScores(scores);
    } catch (error) {
      console.error('Failed to load high scores:', error);
      setApiError('Failed to load high scores. They will be available once connection is restored.');
      // Optionally fallback to localStorage
      const savedScores = JSON.parse(localStorage.getItem('capitalCitiesHighScores') || '[]');
      setHighScores(savedScores);
    } finally {
      setIsLoadingScores(false);
    }
  };

  const saveHighScore = async (playerName, finalScore, totalQuestions) => {
    try {
      // Save to API
      await apiService.saveHighScore(playerName, finalScore, totalQuestions);
      
      // Save game session with additional details
      const sessionData = {
        playerName,
        finalScore,
        questionsAnswered: totalQuestions,
        livesRemaining: lives,
        maxDifficultyReached: difficulty,
        startedAt: gameStartTime,
        endedAt: new Date().toISOString()
      };
      
      const sessionResult = await apiService.saveGameSession(sessionData);
      
      // Save answer logs if we have a session ID
      if (sessionResult.sessionId && answerLog.length > 0) {
        const logsToSave = answerLog.map(log => ({
          sessionId: sessionResult.sessionId,
          countryCode: log.flag || 'XX',
          countryName: log.country,
          questionType: log.questionType,
          difficulty: log.difficulty,
          userAnswer: log.userAnswer,
          correctAnswer: log.correctAnswer,
          isCorrect: log.isCorrect,
          pointsEarned: log.points || 0
        }));
        
        await apiService.saveAnswerLogs(logsToSave);
      }
      
      // Reload high scores to get updated list
      await loadHighScores();
      
    } catch (error) {
      console.error('Failed to save to API:', error);
      setApiError('Failed to save score to database. Saving locally...');
      
      // Fallback to localStorage
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
    }
  };

  const resetGameState = () => {
    setScore(0);
    setLives(GAME_SETTINGS.INITIAL_LIVES);
    setQuestionsAnswered(0);
    setDifficulty(1);
    setUsedCountries(new Set());
    setAnswerLog([]);
    setGameStartTime(new Date().toISOString());
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
    resetGameState,
    isLoadingScores,
    apiError,
    setApiError
  };
};
