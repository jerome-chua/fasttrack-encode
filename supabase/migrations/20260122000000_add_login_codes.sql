-- Login codes table for bot-based web authentication
CREATE TABLE IF NOT EXISTS login_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  telegram_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
  session_token TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired')),
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick code lookups
CREATE INDEX IF NOT EXISTS idx_login_codes_code ON login_codes(code);

-- Index for cleanup of expired codes
CREATE INDEX IF NOT EXISTS idx_login_codes_expires_at ON login_codes(expires_at);

-- Index for status checks
CREATE INDEX IF NOT EXISTS idx_login_codes_status ON login_codes(status);

-- Enable Row Level Security
ALTER TABLE login_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Allow all for login_codes" ON login_codes FOR ALL USING (true) WITH CHECK (true);
