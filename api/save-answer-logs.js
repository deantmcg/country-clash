// API endpoint to save answer logs
import { getDbClient } from './lib/db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const answerLogs = req.body.answerLogs || [];

    if (!Array.isArray(answerLogs) || answerLogs.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Answer logs array is required' 
      });
    }

    const db = getDbClient();
    
    // Validate and insert all answer logs
    const insertPromises = answerLogs.map(async (log) => {
      const {
        sessionId,
        countryCode,
        countryName,
        questionType,
        difficulty,
        userAnswer,
        correctAnswer,
        isCorrect,
        pointsEarned
      } = log;

      // Validate each log entry
      if (!countryCode || !countryName || !questionType) {
        throw new Error('Missing required fields in answer log');
      }

      if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 3) {
        throw new Error('Difficulty must be between 1 and 3');
      }

      if (typeof isCorrect !== 'boolean' && isCorrect !== 0 && isCorrect !== 1) {
        throw new Error('isCorrect must be a boolean or 0/1');
      }

      if (typeof pointsEarned !== 'number' || pointsEarned < 0) {
        throw new Error('Points earned must be a non-negative number');
      }

      return db.execute({
        sql: `
          INSERT INTO answer_log 
          (session_id, country_code, country_name, question_type, difficulty, 
           user_answer, correct_answer, is_correct, points_earned)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          sessionId || null,
          countryCode.substring(0, 2).toUpperCase(),
          countryName.substring(0, 100),
          questionType.substring(0, 20),
          difficulty,
          userAnswer.substring(0, 100),
          correctAnswer.substring(0, 100),
          isCorrect ? 1 : 0,
          pointsEarned
        ]
      });
    });

    await Promise.all(insertPromises);

    return res.status(201).json({ 
      success: true, 
      message: 'Answer logs saved successfully',
      count: answerLogs.length
    });

  } catch (error) {
    console.error('Error saving answer logs:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save answer logs',
      message: error.message 
    });
  }
}
