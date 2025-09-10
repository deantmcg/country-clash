import React from 'react';
import { getMessage } from '../utils/messageUtils';
import { QUESTION_TYPES } from '../constants/gameConstants';

const Question = ({ question }) => {
  switch (question.questionType) {
    case QUESTION_TYPES.CAPITAL:
      return (
        <>
          <h2 className="text-2xl font-bold text-white mb-4">
            {getMessage('questions.capitalOf')}
          </h2>
          <div className="flex flex-col items-center gap-3">
            <span className={`fi fi-${question.code} text-5xl w-24 h-16 rounded-lg shadow-lg border-2 border-white/20`}></span>
            <div className="text-4xl font-bold text-yellow-300">
              {question.name}
            </div>
          </div>
        </>
      );
      
    case QUESTION_TYPES.FLAG:
      return (
        <>
          <h2 className="text-2xl font-bold text-white mb-4">
            {getMessage('questions.flagOf')}
          </h2>
          <div className="flex justify-center mb-4">
            <span className={`fi fi-${question.code} text-7xl w-32 h-24 rounded-lg shadow-lg border-2 border-white/20`}></span>
          </div>
        </>
      );
      
    case QUESTION_TYPES.REVERSE_CAPITAL:
      return (
        <>
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="text-4xl font-bold text-yellow-300">{question.capital}</span>
            <div className="mt-3">
              {getMessage('questions.countryOf')}
            </div>
          </h2>
          <div className="flex justify-center mb-4">
            <span className={`fi fi-${question.code} text-5xl w-24 h-16 rounded-lg shadow-lg border-2 border-white/20 opacity-0`}></span>
          </div>
        </>
      );
      
    default:
      return null;
  }
};

export default Question;
