import React from 'react';
import { QUESTION_TYPES } from '../constants/gameConstants';
import { getMessage } from '../utils/messageUtils';

const AnswerLog = ({ log }) => {
  return (
    <div className="mt-8">
      <h3 className="text-white font-bold mb-4">{getMessage('answerLog.title')}</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {log.map((entry, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              entry.isCorrect
                ? 'bg-green-500/10 border-green-400/30'
                : 'bg-red-500/10 border-red-400/30'
            }`}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`fi fi-${entry.flag} w-6 h-4`}></span>
                <span className="text-white/90">
                  {entry.questionType === QUESTION_TYPES.CAPITAL ? 
                    getMessage('answerLog.capitalFormat', entry.country, entry.correctAnswer) : 
                    entry.questionType === QUESTION_TYPES.REVERSE_CAPITAL ?
                      getMessage('answerLog.reverseCapitalFormat', entry.correctAnswer, entry.userAnswer) :
                      entry.correctAnswer}
                </span>
              </div>
              <span className="text-white/70">
                {getMessage('answerLog.difficulty', entry.difficulty)}
              </span>
            </div>
            <div className="mt-1 text-sm">
              <span className="text-white/80">
                {getMessage('answerLog.yourAnswer', entry.userAnswer)}
              </span>
              {!entry.isCorrect && (
                <span className="text-white/80 block">
                  {getMessage('answerLog.correctAnswer', entry.correctAnswer)}
                </span>
              )}
            </div>
            {entry.isCorrect && (
              <div className="mt-1 text-sm text-green-400">
                {getMessage('feedback.points', entry.points)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerLog;
