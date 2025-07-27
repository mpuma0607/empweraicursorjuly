-- Create user progress tracking table
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  page_type VARCHAR(100) NOT NULL,
  step_id VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT true,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, page_type, step_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_progress_email_page ON user_progress(user_email, page_type);

-- Insert some sample data to verify table creation
INSERT INTO user_progress (user_email, page_type, step_id, completed) 
VALUES ('test@example.com', 'test-page', 'test-step', true)
ON CONFLICT (user_email, page_type, step_id) DO NOTHING;
