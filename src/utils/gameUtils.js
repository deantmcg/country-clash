import { GAME_SETTINGS, QUESTION_TYPES } from '../constants/gameConstants';
import { getMessage } from './messageUtils';

export const checkAnswer = (question, answer) => {
  if (!answer.trim()) return { isCorrect: false, correctAnswer: '' };
  
  const correctAnswer = question.questionType === QUESTION_TYPES.CAPITAL
    ? question.capital.toLowerCase()
    : question.name.toLowerCase();
  
  return {
    isCorrect: answer.toLowerCase().trim() === correctAnswer,
    correctAnswer
  };
};

export const generateQuestion = (countriesData, currentDifficulty, usedCountries) => {
  // Get countries that haven't been used yet at the current difficulty
  let availableCountries = countriesData.filter(country => 
    country.difficulty <= currentDifficulty && 
    !usedCountries.has(country.name)
  );
  
  if (availableCountries.length === 0) {
    // If we've used all countries at this difficulty, check if we can increase difficulty
    if (currentDifficulty < GAME_SETTINGS.MAX_DIFFICULTY) {
      availableCountries = countriesData.filter(country => 
        country.difficulty <= (currentDifficulty + 1) && 
        !usedCountries.has(country.name)
      );
    }
    
    if (availableCountries.length === 0) {
      // No more questions available at any difficulty
      return null;
    }
  }
  
  // Pick a random country from available ones
  const randomIndex = Math.floor(Math.random() * availableCountries.length);
  const country = availableCountries[randomIndex];
  
  // Pick a random question type
  const questionTypes = Object.values(QUESTION_TYPES);
  const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  return { ...country, questionType };
};

export const createLogEntry = (question, userAnswer, isCorrect, correctAnswer) => ({
  flag: question.code,
  country: question.name,
  questionType: question.questionType,
  difficulty: question.difficulty,
  userAnswer: userAnswer.trim(),
  correctAnswer,
  isCorrect,
  points: isCorrect ? question.difficulty * GAME_SETTINGS.POINTS_MULTIPLIER : 0
});

export const getQuestionFeedback = (question, isCorrect, points = 0) => {
  if (isCorrect) {
    let feedback = getMessage('feedback.correctPoints', points);
    if ((points / GAME_SETTINGS.POINTS_MULTIPLIER) % GAME_SETTINGS.QUESTIONS_PER_DIFFICULTY === 0) {
      feedback = `${feedback} - ${getMessage('feedback.difficultyIncrease')}`;
    }
    return feedback;
  }

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
