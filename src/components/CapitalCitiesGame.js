import React, { useState, useEffect } from 'react';
import countriesData from '../data/countries.json';

// Game data from JSON file
const COUNTRIES_DATA = countriesData.countries.map(country => ({
  ...country,
  flag: `fi fi-${country.code}` // Add flag class for each country
}));

const CapitalCitiesGame = () => {
  // Question types
  const QUESTION_TYPES = {
    CAPITAL: 'capital',         // "What is the capital of Spain?"
    FLAG: 'flag',              // "What country does this flag belong to?"
    REVERSE_CAPITAL: 'reverse'  // "Madrid is the capital of which country?"
  };

  // Game state
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [usedQuestionTypes, setUsedQuestionTypes] = useState(new Set());
  const [lastQuestionType, setLastQuestionType] = useState(null);
  const [answerLog, setAnswerLog] = useState([]);

  // Load high scores on component mount
  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('capitalCitiesHighScores') || '[]');
    setHighScores(savedScores);
  }, []);

  // Generate a new question based on current difficulty
  const generateQuestion = () => {
    const availableQuestions = COUNTRIES_DATA.filter(country => 
      country.difficulty <= difficulty && 
      !Object.values(QUESTION_TYPES).some(type => 
        usedQuestionTypes.has(`${country.name}-${type}`)
      )
    );
    
    if (availableQuestions.length === 0) {
      // Reset used questions if we've exhausted all options
      setUsedQuestionTypes(new Set());
      const resetAvailable = COUNTRIES_DATA.filter(country => country.difficulty <= difficulty);
      if (resetAvailable.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * resetAvailable.length);
      const question = resetAvailable[randomIndex];
      
      // Pick next question type that hasn't been used for this country
      const availableTypes = Object.values(QUESTION_TYPES).filter(type => 
        !usedQuestionTypes.has(`${question.name}-${type}`)
      );
      
      const questionType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      setLastQuestionType(questionType);
      
      console.log('Reset: Generated question:', {
        country: question.name,
        questionType: questionType,
        difficulty: question.difficulty
      });
      
      return { ...question, questionType };
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    
    // Pick next question type that hasn't been used for this country
    const availableTypes = Object.values(QUESTION_TYPES).filter(type => 
      !usedQuestionTypes.has(`${question.name}-${type}`)
    );
    
    const questionType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    console.log('Generated question:', {
      country: question.name,
      questionType: questionType,
      lastType: lastQuestionType,
      difficulty: question.difficulty,
      remainingQuestions: availableQuestions.length
    });
    
    setLastQuestionType(questionType);
    return { ...question, questionType };
  };

  // Start a new game
  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name to start the game!');
      return;
    }
    
    console.log('Starting new game'); // Debug log
    setGameState('playing');
    setScore(0);
    setLives(3);
    setQuestionsAnswered(0);
    setDifficulty(1);
    setUsedQuestionTypes(new Set());
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);
    setAnswerLog([]);
    
    const question = generateQuestion();
    console.log('Initial question:', question); // Debug log
    setCurrentQuestion(question);
  };

  // Submit answer
  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    let isCorrect = false;
    let correctAnswer = '';
    
    switch (currentQuestion.questionType) {
      case QUESTION_TYPES.CAPITAL:
        correctAnswer = currentQuestion.capital.toLowerCase();
        break;
      case QUESTION_TYPES.FLAG:
      case QUESTION_TYPES.REVERSE_CAPITAL:
        correctAnswer = currentQuestion.name.toLowerCase();
        break;
    }
    
    isCorrect = userAnswer.toLowerCase().trim() === correctAnswer;
    
    // Mark this question type as used for this country
    const newUsedQuestions = new Set(usedQuestionTypes);
    newUsedQuestions.add(`${currentQuestion.name}-${currentQuestion.questionType}`);
    setUsedQuestionTypes(newUsedQuestions);
    
    if (isCorrect) {
      const points = difficulty * 10;
      setScore(prev => prev + points);
      setFeedback(`Correct! +${points} points`);
      
      // Increase difficulty every 5 correct answers
      if ((questionsAnswered + 1) % 5 === 0 && difficulty < 3) {
        setDifficulty(prev => prev + 1);
        setFeedback(prev => prev + ` - Difficulty increased!`);
      }
    } else {
      setLives(prev => prev - 1);
      switch (currentQuestion.questionType) {
        case QUESTION_TYPES.CAPITAL:
          setFeedback(`Wrong! The capital of ${currentQuestion.name} is ${currentQuestion.capital}`);
          break;
        case QUESTION_TYPES.FLAG:
          setFeedback(`Wrong! This is the flag of ${currentQuestion.name}`);
          break;
        case QUESTION_TYPES.REVERSE_CAPITAL:
          setFeedback(`Wrong! ${currentQuestion.capital} is the capital of ${currentQuestion.name}`);
          break;
      }
    }
    
    setQuestionsAnswered(prev => prev + 1);
    setShowAnswer(true);

    // Add to answer log
    setAnswerLog(prev => [{
      flag: currentQuestion.code,
      country: currentQuestion.name,
      questionType: currentQuestion.questionType,
      difficulty: currentQuestion.difficulty,
      userAnswer: userAnswer.trim(),
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
      points: isCorrect ? difficulty * 10 : 0
    }, ...prev]);    // Check if game should end
    if (!isCorrect && lives <= 1) {
      setTimeout(() => endGame(), 2000);
      return;
    }
    
    // Next question after delay
    setTimeout(() => {
      setUserAnswer('');
      setFeedback('');
      setShowAnswer(false);
      const nextQuestion = generateQuestion();
      if (nextQuestion) {
        console.log('New question:', nextQuestion); // Debug log
        if (nextQuestion.name === currentQuestion.name) {
          console.log('Warning: Same question generated!', {
            availableQuestions: COUNTRIES_DATA.filter(country => country.difficulty <= difficulty && 
              !Object.values(QUESTION_TYPES).some(type => usedQuestionTypes.has(`${country.name}-${type}`))),
            usedQuestionTypes: Array.from(usedQuestionTypes),
            currentDifficulty: difficulty
          });
        }
        setCurrentQuestion(nextQuestion);
      } else {
        endGame();
      }
    }, 2000);
  };

  // End game and save high score
  const endGame = () => {
    setGameState('gameOver');
    
    // Save high score
    const newScore = {
      name: playerName,
      score: score,
      questions: questionsAnswered,
      date: new Date().toLocaleDateString()
    };
    
    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10 scores
    
    setHighScores(updatedScores);
    localStorage.setItem('capitalCitiesHighScores', JSON.stringify(updatedScores));
  };

  // Reset to main menu
  const returnToMenu = () => {
    setGameState('menu');
    setPlayerName('');
  };

  // Handle keyboard input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showAnswer && gameState === 'playing') {
      submitAnswer();
    }
  };

  // Render main menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🏛️ Capital Cities</h1>
            <p className="text-blue-200">Test your geography knowledge!</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Enter your name:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your name..."
                maxLength={20}
              />
            </div>
            
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all shadow-lg"
            >
              🎮 Start Game
            </button>
            
            {highScores.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-bold text-center mb-3">🏆 High Scores</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {highScores.slice(0, 5).map((score, index) => (
                    <div key={index} className="flex justify-between text-sm text-white/80">
                      <span>{index + 1}. {score.name}</span>
                      <span>{score.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-white/60 text-sm">
            <p>💡 Difficulty increases every 5 correct answers</p>
            <p>❤️ You have 3 lives - good luck!</p>
          </div>
        </div>
      </div>
    );
  }

  // Render game over screen
  if (gameState === 'gameOver') {
    const isHighScore = highScores.length > 0 && score >= Math.min(...highScores.map(s => s.score));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center">
          <div className="text-6xl mb-4">
            {isHighScore ? '🏆' : '🎯'}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {isHighScore ? 'High Score!' : 'Game Over'}
          </h2>
          
          <div className="bg-white/10 rounded-xl p-6 my-6 border border-white/20">
            <div className="text-white space-y-2">
              <p className="text-xl">Final Score: <span className="font-bold text-yellow-300">{score}</span></p>
              <p>Questions Answered: {questionsAnswered}</p>
              <p>Highest Difficulty: {difficulty}</p>
            </div>
          </div>
          
          <button
            onClick={returnToMenu}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all shadow-lg"
          >
            🏠 Return to Menu
          </button>
        </div>
      </div>
    );
  }

  // Render game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full border border-white/20 shadow-2xl">
        {/* Game stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <p className="font-bold">Score: {score}</p>
            <p className="text-sm text-white/80">Level {difficulty}</p>
          </div>
          <div className="text-white text-right">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-2xl">
                  {i < lives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/80">Questions: {questionsAnswered}</p>
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
                          What is the capital of
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
                          What country does this flag belong to?
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
                          <div className="mt-3">is the capital of which country?</div>
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
                  placeholder={currentQuestion.questionType === QUESTION_TYPES.CAPITAL ? "Enter capital city..." : "Enter country name..."}
                  disabled={showAnswer}
                  autoFocus
                />
                
                <button
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim() || showAnswer}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all shadow-lg"
                >
                  Submit Answer ✓
                </button>
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
                <h3 className="text-white font-bold mb-4">Answer Log:</h3>
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
                              `${log.country} → ${log.correctAnswer}` : 
                              log.questionType === QUESTION_TYPES.REVERSE_CAPITAL ?
                                `${log.correctAnswer} → ${log.userAnswer}` :
                                log.correctAnswer}
                          </span>
                        </div>
                        <span className="text-white/70">Difficulty: {log.difficulty}</span>
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="text-white/80">Your answer: {log.userAnswer}</span>
                        {!log.isCorrect && (
                          <span className="text-white/80 block">
                            Correct answer: {log.correctAnswer}
                          </span>
                        )}
                      </div>
                      {log.isCorrect && (
                        <div className="mt-1 text-sm text-green-400">
                          +{log.points} points
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