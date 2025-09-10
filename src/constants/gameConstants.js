// Question types for the game
export const QUESTION_TYPES = {
  CAPITAL: 'capital',         // "What is the capital of Spain?"
  FLAG: 'flag',              // "What country does this flag belong to?"
  REVERSE_CAPITAL: 'reverse'  // "Madrid is the capital of which country?"
};

// Game states
export const GAME_STATES = {
  MENU: 'menu',
  MENU_UPDATE: 'menu-update',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
  GAME_OVER_UPDATE: 'gameOver-update'
};

// Game settings
export const GAME_SETTINGS = {
  INITIAL_LIVES: 3,
  QUESTIONS_PER_DIFFICULTY: 5,
  MAX_DIFFICULTY: 3,
  POINTS_MULTIPLIER: 10,
  HIGH_SCORES_LIMIT: 10,
  FEEDBACK_DELAY: 2000, // milliseconds
};
