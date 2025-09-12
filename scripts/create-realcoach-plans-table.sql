-- Create realcoach_plans table for storing user's RealCoach AI plans
CREATE TABLE IF NOT EXISTS realcoach_plans (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(255) NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  profile_data JSON NOT NULL,
  plan_data JSON NOT NULL,
  status ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Create plan_progress table for tracking daily/weekly progress
CREATE TABLE IF NOT EXISTS realcoach_plan_progress (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  plan_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  week_number INT NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  activity_name VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (plan_id) REFERENCES realcoach_plans(id) ON DELETE CASCADE,
  INDEX idx_plan_id (plan_id),
  INDEX idx_user_id (user_id),
  INDEX idx_week_day (week_number, day_of_week),
  UNIQUE KEY unique_activity (plan_id, week_number, day_of_week, activity_type)
);
