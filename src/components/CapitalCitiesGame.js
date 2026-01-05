import React, { useState, useEffect } from 'react';
import countriesData from '../data/countries.json';
import { getMessage } from '../utils/messageUtils';
import LanguageSelector from './LanguageSelector';
import { GAME_STATES, QUESTION_TYPES, GAME_SETTINGS } from '../constants/gameConstants';
import { useGameState } from '../hooks/useGameState';
import { checkAnswer, generateQuestion, createLogEntry, getQuestionFeedback } from '../utils/gameUtils';
import GameStats from './GameStats';
import AnswerLog from './AnswerLog';

// Game data from JSON file
const COUNTRIES_DATA = countriesData.countries.map(country => ({
  ...country,
  flag: `fi fi-${country.code.toLowerCase()}`
}));

const CapitalCitiesGame = () => {
  const {
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
  } = useGameState();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Generate a new question based on current difficulty
  const getNextQuestion = () => {
    const question = generateQuestion(COUNTRIES_DATA, difficulty, usedCountries);
    
    if (question) {
      // Mark this country as used
      setUsedCountries(prev => new Set([...prev, question.name]));
      
      // If we've used all countries at current difficulty, increase it
      if (difficulty < GAME_SETTINGS.MAX_DIFFICULTY) {
        const remainingAtCurrentDifficulty = COUNTRIES_DATA.filter(country => 
          country.difficulty <= difficulty && 
          !usedCountries.has(country.name)
        ).length;
        
        if (remainingAtCurrentDifficulty === 0) {
          setDifficulty(prev => prev + 1);
        }
      }
      
      console.log('Generated question:', {
        country: question.name,
        questionType: question.questionType,
        difficulty: question.difficulty,
        remainingCountries: COUNTRIES_DATA.filter(c => !usedCountries.has(c.name)).length - 1
      });
    }
    
    return question;
  };

  // Start a new game
  const startGame = () => {
    if (!playerName.trim()) {
      alert(getMessage('errors.enterName'));
      return;
    }
    
    console.log('Starting new game'); // Debug log
    setGameState(GAME_STATES.PLAYING);
    resetGameState();
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);
    
    const question = getNextQuestion();
    console.log('Initial question:', question); // Debug log
    setCurrentQuestion(question);
  };

  // Check if difficulty should increase
  const shouldIncreaseDifficulty = () => {
    return (questionsAnswered + 1) % 5 === 0 && difficulty < 3;
  };

  // Get correct answer feedback message
  const getCorrectFeedbackMessage = (points) => {
    let feedback = getMessage('feedback.correctPoints', points);
    if (shouldIncreaseDifficulty()) {
      feedback = `${feedback} - ${getMessage('feedback.difficultyIncrease')}`;
    }
    return feedback;
  };

  // Get wrong answer feedback message
  const getWrongFeedbackMessage = (question) => {
    switch (question.questionType) {
      case QUESTION_TYPES.CAPITAL:
        return getMessage('feedback.wrongCapital', question.name, question.capital);
      case QUESTION_TYPES.FLAG:
        return getMessage('feedback.wrongFlag', question.name);
      case QUESTION_TYPES.REVERSE_CAPITAL:
        return getMessage('feedback.wrongCountry', question.capital, question.name);
      default:
        return '';
    }
  };

  // Get feedback message based on question type and result
  const getFeedbackMessage = (question, isCorrect, points = 0) => {
    return isCorrect 
      ? getCorrectFeedbackMessage(points)
      : getWrongFeedbackMessage(question);
  };

  // Helper function to check answers
  const checkAnswer = (question, answer) => {
    if (!answer.trim()) return { isCorrect: false, correctAnswer: '' };
    
    const correctAnswer = question.questionType === QUESTION_TYPES.CAPITAL
      ? question.capital.toLowerCase()
      : question.name.toLowerCase();
    
    return {
      isCorrect: answer.toLowerCase().trim() === correctAnswer,
      correctAnswer
    };
  };

  // Submit answer
  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const { isCorrect, correctAnswer } = checkAnswer(currentQuestion, userAnswer);
    
    // Mark this country as used
    setUsedCountries(prev => new Set([...prev, currentQuestion.name]));
    
    if (isCorrect) {
      const points = difficulty * GAME_SETTINGS.POINTS_MULTIPLIER;
      setScore(prev => prev + points);
      setFeedback(getQuestionFeedback(currentQuestion, true, points));
    } else {
      setLives(prev => prev - 1);
      setFeedback(getQuestionFeedback(currentQuestion, false));
    }
    
    setQuestionsAnswered(prev => prev + 1);
    setShowAnswer(true);

    // Add new log entry
    setAnswerLog(prev => [
      createLogEntry(currentQuestion, userAnswer, isCorrect, correctAnswer),
      ...prev
    ]);

    // Check if game should end due to no lives
    if (!isCorrect && lives <= 1) {
      setLives(0); // Ensure lives are set to 0
      setTimeout(() => endGame(), GAME_SETTINGS.FEEDBACK_DELAY);
      return;
    }
    
    // Next question after delay
    setTimeout(() => {
      setUserAnswer('');
      setFeedback('');
      setShowAnswer(false);
      const nextQuestion = getNextQuestion();
      if (nextQuestion) {
        console.log('New question:', nextQuestion); // Debug log
        if (nextQuestion.name === currentQuestion.name) {
          console.log('Warning: Same question generated!', {
            availableQuestions: COUNTRIES_DATA.filter(country => 
              country.difficulty <= difficulty && 
              !usedCountries.has(country.name)
            ),
            usedCountries: Array.from(usedCountries),
            currentDifficulty: difficulty
          });
        }
        setCurrentQuestion(nextQuestion);
      } else {
        endGame();
      }
    }, GAME_SETTINGS.FEEDBACK_DELAY);
  };

  // End game and save high score
  const endGame = () => {
    setGameState(GAME_STATES.GAME_OVER);
    saveHighScore(playerName, score, questionsAnswered);
  };

  // Reset to main menu
  const returnToMenu = () => {
    setGameState(GAME_STATES.MENU);
    setPlayerName('');
  };

  // Skip the current question
  const skipQuestion = () => {
    setShowAnswer(true);
    setFeedback(getQuestionFeedback(currentQuestion, false));
    
    // Mark country as used when skipped
    setUsedCountries(prev => new Set([...prev, currentQuestion.name]));
    
    if (lives <= 1) {
      setLives(0);
      setTimeout(() => endGame(), GAME_SETTINGS.FEEDBACK_DELAY);
    } else {
      setLives(prev => prev - 1);
      setTimeout(() => {
        setUserAnswer('');
        setFeedback('');
        setShowAnswer(false);
        const nextQuestion = getNextQuestion();
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
        } else {
          endGame();
        }
      }, GAME_SETTINGS.FEEDBACK_DELAY);
    }
  };

  // Handle keyboard input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showAnswer && gameState === GAME_STATES.PLAYING) {
      submitAnswer();
    }
  };

  // Render main menu
  if (gameState === 'menu' || gameState === 'menu-update') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector onChange={() => {
            // Force update by toggling a state value
            setGameState(prev => {
              // Toggle between menu and menu-update to force re-render
              return prev === 'menu' ? 'menu-update' : 'menu';
            });
          }} />
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🏛️ Country Clash 🌍</h1>
            <p className="text-blue-200">{getMessage('game.instructions')}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {getMessage('input.enterName')}
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={getMessage('input.namePlaceholder')}
                maxLength={20}
              />
            </div>
            
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all shadow-lg"
            >
              {getMessage('buttons.startGame')}
            </button>
            
            {apiError && (
              <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-3 text-yellow-100 text-sm">
                ⚠️ {apiError}
              </div>
            )}
            
            {isLoadingScores && (
              <div className="text-center text-white/70 text-sm">
                Loading high scores...
              </div>
            )}
            
            {highScores.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-bold text-center mb-3">{getMessage('highScores.title')}</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {highScores.slice(0, 5).map((score, index) => (
                    <div key={index} className="flex justify-between text-sm text-white/80">
                      <span>{getMessage('highScores.entry', index + 1, score.name)}</span>
                      <span>{getMessage('stats.score', score.score)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-white/60 text-sm">
            <p>{getMessage('tips.difficultyIncrease')}</p>
            <p>{getMessage('tips.lives')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render game over screen
  if (gameState === 'gameOver' || gameState === 'gameOver-update') {
    const isHighScore = highScores.length > 0 && score >= Math.min(...highScores.map(s => s.score));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector onChange={() => {
            // Force update by toggling a state value
            setGameState(prev => {
              // Toggle between gameOver and gameOver-update to force re-render
              return prev === 'gameOver' ? 'gameOver-update' : 'gameOver';
            });
          }} />
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center">
          <div className="text-6xl mb-4">
            {isHighScore ? '🏆' : '🎯'}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {isHighScore ? getMessage('result.highScore') : getMessage('result.gameOver')}
          </h2>
          
          <div className="bg-white/10 rounded-xl p-6 my-6 border border-white/20">
            <div className="text-white space-y-2">
              <p className="text-xl">{getMessage('stats.finalStats.score', score)}</p>
              <p>{getMessage('stats.finalStats.questionsAnswered', questionsAnswered)}</p>
              <p>{getMessage('stats.finalStats.highestDifficulty', difficulty)}</p>
            </div>
          </div>
          
          <button
            onClick={returnToMenu}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all shadow-lg"
          >
            {getMessage('buttons.returnToMenu')}
          </button>
        </div>
      </div>
    );
  }

  // Render game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector onChange={() => {
            // Force an immediate re-render by creating a new question object
            setCurrentQuestion({...currentQuestion});
          }} />
        </div>
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full border border-white/20 shadow-2xl">
        {/* Game stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <p className="font-bold">{getMessage('stats.score', score)}</p>
            <p className="text-sm text-white/80">{getMessage('stats.level', difficulty)}</p>
          </div>
          <div className="text-white text-right">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-2xl">
                  {i < lives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/80">{getMessage('stats.questions', questionsAnswered)}</p>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="text-center mb-8">
            <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-6">
              {(() => {
                switch (currentQuestion.questionType) {
                  case QUESTION_TYPES.CAPITAL:
                    return (
                      <>
                        <h2 className="text-2xl font-bold text-white mb-4">
                          {/* What is the capital of */}
                          {getMessage('questions.capitalOf')}
                        </h2>
                        <div className="flex flex-col items-center gap-3">
                          <span className={`fi fi-${currentQuestion.code} text-5xl w-24 h-16 rounded-lg shadow-lg border-2 border-white/20`}></span>
                          <div className="text-4xl font-bold text-yellow-300">
                            {currentQuestion.name}
                          </div>
                        </div>
                      </>
                    );
                  case QUESTION_TYPES.FLAG:
                    return (
                      <>
                        <h2 className="text-2xl font-bold text-white mb-4">
                          {/* What country does this flag belong to? */}
                          {getMessage('questions.flagOf')}
                        </h2>
                        <div className="flex justify-center mb-4">
                          <span className={`fi fi-${currentQuestion.code} text-7xl w-32 h-24 rounded-lg shadow-lg border-2 border-white/20`}></span>
                        </div>
                      </>
                    );
                  case QUESTION_TYPES.REVERSE_CAPITAL:
                    return (
                      <>
                        <h2 className="text-2xl font-bold text-white mb-4">
                          <span className="text-4xl font-bold text-yellow-300">{currentQuestion.capital}</span>
                          <div className="mt-3">
                            {/* is the capital of which country? */}
                            {getMessage('questions.countryOf')}
                          </div>
                        </h2>
                        <div className="flex justify-center mb-4">
                          <span className={`fi fi-${currentQuestion.code} text-5xl w-24 h-16 rounded-lg shadow-lg border-2 border-white/20 opacity-0`}></span>
                        </div>
                      </>
                    );
                  default:
                    return null;
                }
              })()}
              <div className="text-sm text-white/60 mt-4">
                Difficulty: {currentQuestion.difficulty} | Points: {currentQuestion.difficulty * 10}
              </div>
            </div>

            {!showAnswer && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 text-lg rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center"
                  placeholder={getMessage(`input.answerPlaceholder.${currentQuestion.questionType === QUESTION_TYPES.CAPITAL ? 'capital' : 'country'}`)}
                  disabled={showAnswer}
                  autoFocus
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAnswer(true);
                      setFeedback(getFeedbackMessage(currentQuestion, false));
                      
                      // Mark country as used when skipped
                      setUsedCountries(prev => new Set([...prev, currentQuestion.name]));
                      
                      if (lives <= 1) {
                        setLives(0);
                        setTimeout(() => endGame(), 2000);
                      } else {
                        setLives(prev => prev - 1);
                        setTimeout(() => {
                          setUserAnswer('');
                          setFeedback('');
                          setShowAnswer(false);
                          const nextQuestion = getNextQuestion();
                          if (nextQuestion) {
                            setCurrentQuestion(nextQuestion);
                          } else {
                            endGame();
                          }
                        }, GAME_SETTINGS.FEEDBACK_DELAY);
                      }
                    }}
                    title={getMessage('buttons.skipQuestion')}
                    className="aspect-square h-[58px] bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transform hover:scale-105 transition-all shadow-lg flex items-center justify-center text-2xl"
                  >
                    ✕
                  </button>
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim() || showAnswer}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all shadow-lg"
                  >
                    {getMessage('buttons.submitAnswer')}
                  </button>
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`mt-6 p-4 rounded-xl border shadow-lg transform scale-105 ${
                feedback.includes('Correct') 
                  ? 'bg-green-500/30 border-green-400 text-green-100' 
                  : 'bg-red-500/30 border-red-400 text-red-100'
              }`}>
                <p className="font-bold text-lg">{feedback}</p>
              </div>
            )}

            {/* Answer Log */}
            {answerLog.length > 0 && (
              <div className="mt-8">
                <h3 className="text-white font-bold mb-4">{getMessage('answerLog.title')}</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {answerLog.map((log, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        log.isCorrect
                          ? 'bg-green-500/10 border-green-400/30'
                          : 'bg-red-500/10 border-red-400/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`fi fi-${log.flag} w-6 h-4`}></span>
                          <span className="text-white/90">
                            {log.questionType === QUESTION_TYPES.CAPITAL ? 
                              getMessage('answerLog.capitalFormat', log.country, log.correctAnswer) : 
                              log.questionType === QUESTION_TYPES.REVERSE_CAPITAL ?
                                getMessage('answerLog.reverseCapitalFormat', log.correctAnswer, log.userAnswer) :
                                log.correctAnswer}
                          </span>
                        </div>
                        <span className="text-white/70">{getMessage('answerLog.difficulty', log.difficulty)}</span>
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="text-white/80">{getMessage('answerLog.yourAnswer', log.userAnswer)}</span>
                        {!log.isCorrect && (
                          <span className="text-white/80 block">
                            {getMessage('answerLog.correctAnswer', log.correctAnswer)}
                          </span>
                        )}
                      </div>
                      {log.isCorrect && (
                        <div className="mt-1 text-sm text-green-400">
                          {getMessage('feedback.points', log.points)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        )}
      </div>
    </div>
  );
};

export default CapitalCitiesGame;