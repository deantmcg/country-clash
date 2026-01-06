// API endpoint to get high scores
import { getDbClient } from './lib/db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDbClient();
    
    // Get top 10 high scores
    const result = await db.execute({
      sql: `
        SELECT 
          player_name as name, 
          score, 
          questions_answered as questions,
          DATE(game_date) as date
        FROM high_scores 
        ORDER BY score DESC, created_at DESC 
        LIMIT 10
      `,
      args: []
    });

    const highScores = result.rows.map(row => ({
      name: row.name,
      score: row.score,
      questions: row.questions,
      date: row.date
    }));

    return res.status(200).json({ 
      success: true, 
      highScores 
    });

  } catch (error) {
    console.error('Error fetching high scores:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch high scores',
      message: error.message 
    });
  }
}
