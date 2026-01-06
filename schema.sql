-- High Scores Table
-- Stores player scores from completed games
CREATE TABLE high_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  game_date TEXT NOT NULL, -- ISO 8601 format (YYYY-MM-DD HH:MM:SS)
  created_at TEXT DEFAULT (datetime('now')),
  CONSTRAINT score_positive CHECK (score >= 0),
  CONSTRAINT questions_positive CHECK (questions_answered > 0)
);

-- Index for efficient retrieval of top scores
CREATE INDEX idx_high_scores_score_desc ON high_scores(score DESC, created_at DESC);

-- Index for player lookup
CREATE INDEX idx_high_scores_player ON high_scores(player_name);

-- Individual game sessions with more detail
CREATE TABLE game_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  final_score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  lives_remaining INTEGER NOT NULL,
  max_difficulty_reached INTEGER NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  CONSTRAINT score_positive CHECK (final_score >= 0),
  CONSTRAINT lives_valid CHECK (lives_remaining >= 0 AND lives_remaining <= 3),
  CONSTRAINT difficulty_valid CHECK (max_difficulty_reached >= 1 AND max_difficulty_reached <= 3)
);

CREATE INDEX idx_game_sessions_score ON game_sessions(final_score DESC);
CREATE INDEX idx_game_sessions_player ON game_sessions(player_name);
CREATE INDEX idx_game_sessions_date ON game_sessions(ended_at DESC);

-- Individual question/answer records
CREATE TABLE answer_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'capital', 'flag', 'reverse'
  difficulty INTEGER NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL, -- 0 or 1 (boolean)
  points_earned INTEGER NOT NULL,
  answered_at TEXT DEFAULT (datetime('now')),
  CONSTRAINT difficulty_valid CHECK (difficulty >= 1 AND difficulty <= 3),
  CONSTRAINT is_correct_boolean CHECK (is_correct IN (0, 1)),
  CONSTRAINT points_valid CHECK (points_earned >= 0),
  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_answer_log_session ON answer_log(session_id);
CREATE INDEX idx_answer_log_country ON answer_log(country_name);
CREATE INDEX idx_answer_log_correct ON answer_log(is_correct);
