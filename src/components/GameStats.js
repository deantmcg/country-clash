import React from 'react';
import { getMessage } from '../utils/messageUtils';
import { GAME_SETTINGS } from '../constants/gameConstants';

const GameStats = ({ score, lives, questionsAnswered, difficulty }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-white">
        <p className="font-bold">{getMessage('stats.score', score)}</p>
        <p className="text-sm text-white/80">{getMessage('stats.level', difficulty)}</p>
      </div>
      <div className="text-white text-right">
        <div className="flex gap-1">
          {[...Array(GAME_SETTINGS.INITIAL_LIVES)].map((_, i) => (
            <span key={i} className="text-2xl">
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        <p className="text-sm text-white/80">{getMessage('stats.questions', questionsAnswered)}</p>
      </div>
    </div>
  );
};

export default GameStats;
