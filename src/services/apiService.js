// API service for Turso backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Fetch high scores from the API
 * @returns {Promise<Array>} Array of high scores
 */
export async function fetchHighScores() {
  try {
    const response = await fetch(`${API_BASE_URL}/get-high-scores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.highScores || [];
    } else {
      throw new Error(data.error || 'Failed to fetch high scores');
    }
  } catch (error) {
    console.error('Error fetching high scores:', error);
    // Return empty array on error to allow game to continue
    return [];
  }
}

/**
 * Save a high score to the API
 * @param {string} playerName - Player's name
 * @param {number} score - Final score
 * @param {number} questionsAnswered - Number of questions answered
 * @returns {Promise<Object>} Response from API
 */
export async function saveHighScore(playerName, score, questionsAnswered) {
  try {
    const response = await fetch(`${API_BASE_URL}/save-high-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName,
        score,
        questionsAnswered,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to save high score');
    }

    return data;
  } catch (error) {
    console.error('Error saving high score:', error);
    throw error;
  }
}

/**
 * Save a complete game session to the API
 * @param {Object} sessionData - Game session data
 * @returns {Promise<Object>} Response from API with sessionId
 */
export async function saveGameSession(sessionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/save-game-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to save game session');
    }

    return data;
  } catch (error) {
    console.error('Error saving game session:', error);
    throw error;
  }
}

/**
 * Save answer logs to the API
 * @param {Array} answerLogs - Array of answer log entries
 * @returns {Promise<Object>} Response from API
 */
export async function saveAnswerLogs(answerLogs) {
  try {
    const response = await fetch(`${API_BASE_URL}/save-answer-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answerLogs }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to save answer logs');
    }

    return data;
  } catch (error) {
    console.error('Error saving answer logs:', error);
    throw error;
  }
}
