// API endpoint to save a complete game session
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
    const { 
      playerName, 
      finalScore, 
      questionsAnswered, 
      livesRemaining, 
      maxDifficultyReached,
      startedAt,
      endedAt 
    } = req.body;

    // Validate required fields
    if (!playerName || playerName.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Player name is required' 
      });
    }

    if (typeof finalScore !== 'number' || finalScore < 0) {
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

    if (typeof livesRemaining !== 'number' || livesRemaining < 0 || livesRemaining > 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Lives remaining must be between 0 and 3' 
      });
    }

    if (typeof maxDifficultyReached !== 'number' || maxDifficultyReached < 1 || maxDifficultyReached > 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Max difficulty must be between 1 and 3' 
      });
    }

    const db = getDbClient();
    
    // Sanitize player name
    const sanitizedName = playerName.trim().substring(0, 20);
    
    // Format timestamps
    const started = startedAt ? new Date(startedAt).toISOString().replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19);
    const ended = endedAt ? new Date(endedAt).toISOString().replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Insert game session
    const result = await db.execute({
      sql: `
        INSERT INTO game_sessions 
        (player_name, final_score, questions_answered, lives_remaining, max_difficulty_reached, started_at, ended_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [sanitizedName, finalScore, questionsAnswered, livesRemaining, maxDifficultyReached, started, ended]
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Game session saved successfully',
      sessionId: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error saving game session:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save game session',
      message: error.message 
    });
  }
}
