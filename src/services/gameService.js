import { GAME_SETTINGS } from '../constants/gameConstants';

export class GameService {
  static shouldIncreaseDifficulty(questionsAnswered, currentDifficulty) {
    return (questionsAnswered + 1) % GAME_SETTINGS.QUESTIONS_PER_DIFFICULTY === 0 && 
           currentDifficulty < GAME_SETTINGS.MAX_DIFFICULTY;
  }

  static calculatePoints(difficulty) {
    return difficulty * GAME_SETTINGS.POINTS_MULTIPLIER;
  }

  static isHighScore(score, highScores) {
    return highScores.length > 0 && score >= Math.min(...highScores.map(s => s.score));
  }

  static getRemainingQuestionsAtDifficulty(countriesData, currentDifficulty, usedCountries) {
    return countriesData.filter(country => 
      country.difficulty <= currentDifficulty && 
      !usedCountries.has(country.name)
    ).length;
  }

  static validateAnswer(question, answer) {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = question.capital.toLowerCase();
    return {
      isValid: userAnswer.length > 0,
      isCorrect: userAnswer === correctAnswer,
      correctAnswer
    };
  }
}
