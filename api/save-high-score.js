// API endpoint to save a high score
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
    const { playerName, score, questionsAnswered } = req.body;

    // Validate input
    if (!playerName || playerName.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Player name is required' 
      });
    }

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid score is required' 
      });
    }

    if (typeof questionsAnswered !== 'number' || questionsAnswered <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid questions answered count is required' 
      });
    }

    const db = getDbClient();
    
    // Sanitize player name (limit to 20 characters)
    const sanitizedName = playerName.trim().substring(0, 20);
    
    // Get current timestamp in ISO 8601 format
    const gameDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Insert high score
    const result = await db.execute({
      sql: `
        INSERT INTO high_scores (player_name, score, questions_answered, game_date)
        VALUES (?, ?, ?, ?)
      `,
      args: [sanitizedName, score, questionsAnswered, gameDate]
    });

    return res.status(201).json({ 
      success: true, 
      message: 'High score saved successfully',
      id: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error saving high score:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save high score',
      message: error.message 
    });
  }
}
