import React from 'react';
import { getMessage } from '../utils/messageUtils';
import LanguageSelector from './LanguageSelector';
import { useLanguageUpdate } from '../hooks/useUIState';

const GameOverScreen = ({
  gameState,
  setGameState,
  score,
  questionsAnswered,
  difficulty,
  highScores,
  returnToMenu
}) => {
  const handleLanguageChange = useLanguageUpdate(setGameState, gameState);
  const isHighScore = highScores.length > 0 && score >= Math.min(...highScores.map(s => s.score));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector onChange={handleLanguageChange} />
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
};

export default GameOverScreen;
