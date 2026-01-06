// Database connection module for Turso
import { createClient } from '@libsql/client';

let client = null;

/**
 * Get or create a Turso database client
 * @returns {Object} Turso client instance
 */
export function getDbClient() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
      throw new Error('Missing Turso credentials. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.');
    }

    client = createClient({
      url,
      authToken,
    });
  }

  return client;
}

/**
 * Execute a query with error handling
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function executeQuery(sql, params = []) {
  try {
    const db = getDbClient();
    const result = await db.execute({
      sql,
      args: params,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Close the database connection
 */
export function closeConnection() {
  if (client) {
    client.close();
    client = null;
  }
}
