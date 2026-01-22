-- Sessions table for web authentication via Telegram Login
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick session lookups by token
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- Index for finding sessions by user
CREATE INDEX IF NOT EXISTS idx_sessions_telegram_id ON sessions(telegram_id);

-- Index for cleaning up expired sessions
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Allow all operations (server uses service role key)
CREATE POLICY "Allow all for sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);
