import React from 'react';
import { getMessage } from '../utils/messageUtils';
import LanguageSelector from './LanguageSelector';
import { useLanguageUpdate } from '../hooks/useUIState';
import { GAME_STATES } from '../constants/gameConstants';

const MenuScreen = ({ 
  gameState, 
  setGameState, 
  playerName, 
  setPlayerName, 
  highScores, 
  startGame 
}) => {
  const handleLanguageChange = useLanguageUpdate(setGameState, gameState);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector onChange={handleLanguageChange} />
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
};

export default MenuScreen;
