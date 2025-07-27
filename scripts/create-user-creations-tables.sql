-- Create user creations table
CREATE TABLE IF NOT EXISTS user_creations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  tool_type VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  form_data JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

-- Create AI response cache table for performance
CREATE TABLE IF NOT EXISTS ai_response_cache (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(500) NOT NULL UNIQUE,
  tool_type VARCHAR(100) NOT NULL,
  input_hash VARCHAR(255) NOT NULL,
  response_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_creations_user_id ON user_creations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_creations_tool_type ON user_creations(tool_type);
CREATE INDEX IF NOT EXISTS idx_user_creations_created_at ON user_creations(created_at);
CREATE INDEX IF NOT EXISTS idx_user_creations_expires_at ON user_creations(expires_at);

CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON ai_response_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_tool_type ON ai_response_cache(tool_type);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires_at ON ai_response_cache(expires_at);

-- Create cleanup function to remove expired records
CREATE OR REPLACE FUNCTION cleanup_expired_records()
RETURNS void AS $$
BEGIN
  DELETE FROM user_creations WHERE expires_at < NOW();
  DELETE FROM ai_response_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
