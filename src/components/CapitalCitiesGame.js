import React, { useState, useEffect } from 'react';

// Game data - countries and their capitals
const COUNTRIES_DATA = [
  { country: "France", capital: "Paris", difficulty: 1 },
  { country: "Germany", capital: "Berlin", difficulty: 1 },
  { country: "Italy", capital: "Rome", difficulty: 1 },
  { country: "Spain", capital: "Madrid", difficulty: 1 },
  { country: "United Kingdom", capital: "London", difficulty: 1 },
  { country: "Japan", capital: "Tokyo", difficulty: 1 },
  { country: "Australia", capital: "Canberra", difficulty: 2 },
  { country: "Brazil", capital: "Brasília", difficulty: 2 },
  { country: "Canada", capital: "Ottawa", difficulty: 2 },
  { country: "India", capital: "New Delhi", difficulty: 2 },
  { country: "South Africa", capital: "Cape Town", difficulty: 2 },
  { country: "Netherlands", capital: "Amsterdam", difficulty: 2 },
  { country: "Switzerland", capital: "Bern", difficulty: 2 },
  { country: "Turkey", capital: "Ankara", difficulty: 2 },
  { country: "Kazakhstan", capital: "Nur-Sultan", difficulty: 3 },
  { country: "Myanmar", capital: "Naypyidaw", difficulty: 3 },
  { country: "Sri Lanka", capital: "Sri Jayawardenepura Kotte", difficulty: 3 },
  { country: "Côte d'Ivoire", capital: "Yamoussoukro", difficulty: 3 },
  { country: "Palau", capital: "Ngerulmud", difficulty: 3 },
  { country: "Benin", capital: "Porto-Novo", difficulty: 3 },
  { country: "Bolivia", capital: "Sucre", difficulty: 3 },
  { country: "Montenegro", capital: "Podgorica", difficulty: 3 }
];

const CapitalCitiesGame = () => {
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
  const [usedQuestions, setUsedQuestions] = useState(new Set());

  // Load high scores on component mount
  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('capitalCitiesHighScores') || '[]');
    setHighScores(savedScores);
  }, []);

  // Generate a new question based on current difficulty
  const generateQuestion = () => {
    const availableQuestions = COUNTRIES_DATA.filter(
      country => country.difficulty <= difficulty && !usedQuestions.has(country.country)
    );
    
    if (availableQuestions.length === 0) {
      // Reset used questions if we've exhausted all options
      setUsedQuestions(new Set());
      const resetAvailable = COUNTRIES_DATA.filter(country => country.difficulty <= difficulty);
      if (resetAvailable.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * resetAvailable.length);
      return resetAvailable[randomIndex];
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  };

  // Start a new game
  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name to start the game!');
      return;
    }
    
    setGameState('playing');
    setScore(0);
    setLives(3);
    setQuestionsAnswered(0);
    setDifficulty(1);
    setUsedQuestions(new Set());
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);
    
    const question = generateQuestion();
    setCurrentQuestion(question);
  };

  // Submit answer
  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.capital.toLowerCase();
    const newUsedQuestions = new Set(usedQuestions);
    newUsedQuestions.add(currentQuestion.country);
    setUsedQuestions(newUsedQuestions);
    
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
      setFeedback(`Wrong! The capital of ${currentQuestion.country} is ${currentQuestion.capital}`);
    }
    
    setQuestionsAnswered(prev => prev + 1);
    setShowAnswer(true);
    
    // Check if game should end
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
                <span key={i} className={`text-2xl ${i < lives ? 'text-red-400' : 'text-gray-600'}`}>
                  ❤️
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
              <h2 className="text-2xl font-bold text-white mb-4">
                What is the capital of
              </h2>
              <div className="text-4xl font-bold text-yellow-300 mb-2">
                {currentQuestion.country}
              </div>
              <div className="text-sm text-white/60">
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
                  placeholder="Enter capital city..."
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
              <div className={`mt-6 p-4 rounded-xl border ${
                feedback.includes('Correct') 
                  ? 'bg-green-500/20 border-green-400 text-green-100' 
                  : 'bg-red-500/20 border-red-400 text-red-100'
              }`}>
                <p className="font-bold">{feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapitalCitiesGame;