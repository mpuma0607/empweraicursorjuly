-- Create OAuth tokens table for Gmail integration
-- Run this script to add the OAuth tokens table to your database

-- OAuth tokens table for Gmail integration
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL DEFAULT 'google',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP NOT NULL,
  scopes TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Add foreign key constraint if users table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE oauth_tokens 
    ADD CONSTRAINT fk_oauth_tokens_user_email 
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint
ALTER TABLE oauth_tokens 
ADD CONSTRAINT unique_user_provider UNIQUE(user_email, provider);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user_email ON oauth_tokens(user_email);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_provider ON oauth_tokens(provider);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_expires_at ON oauth_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_is_active ON oauth_tokens(is_active);

-- Insert sample data for testing (optional)
-- INSERT INTO oauth_tokens (user_email, provider, access_token, expires_at, scopes) 
-- VALUES ('test@example.com', 'google', 'sample_token', NOW() + INTERVAL '1 hour', ARRAY['https://www.googleapis.com/auth/gmail.send']);

-- Verify table creation
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'oauth_tokens' 
ORDER BY ordinal_position;
