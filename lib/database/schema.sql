-- Usage tracking tables for Neon database

-- Users table (synced from Memberspace)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  memberspace_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'active'
);

-- Tool usage tracking
CREATE TABLE IF NOT EXISTS tool_usage (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  tool_name VARCHAR(100) NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'generate', 'download', 'email', 'copy'
  device_type VARCHAR(20), -- 'mobile', 'desktop', 'tablet'
  user_agent TEXT,
  ip_address INET,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB, -- Additional data like input length, generation time, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Page views and content engagement
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(255),
  referrer VARCHAR(500),
  device_type VARCHAR(20),
  session_id VARCHAR(255),
  time_spent INTEGER, -- seconds spent on page
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content interactions (videos, training materials)
CREATE TABLE IF NOT EXISTS content_interactions (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  content_type VARCHAR(50) NOT NULL, -- 'video', 'training', 'document'
  content_id VARCHAR(255) NOT NULL,
  content_title VARCHAR(255),
  interaction_type VARCHAR(50) NOT NULL, -- 'view', 'complete', 'download'
  progress_percentage INTEGER DEFAULT 0,
  device_type VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for behavior analysis
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  device_type VARCHAR(20),
  user_agent TEXT,
  ip_address INET,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  page_count INTEGER DEFAULT 0,
  tool_usage_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_email ON tool_usage(user_email);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON tool_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_name ON tool_usage(tool_name);
CREATE INDEX IF NOT EXISTS idx_page_views_user_email ON page_views(user_email);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_content_interactions_user_email ON content_interactions(user_email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_email ON user_sessions(user_email);
