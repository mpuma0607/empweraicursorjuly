-- Create user_branding_profiles table
CREATE TABLE IF NOT EXISTS user_branding_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL DEFAULT 'century21',
  brokerage VARCHAR(100) NOT NULL,
  custom_logo_url TEXT,
  logo_public_id VARCHAR(255),
  preferences JSONB DEFAULT '{"auto_brand": true}',
  tenant_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Create unique constraint on user_id and tenant_id
  UNIQUE(user_id, tenant_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_branding_user_id ON user_branding_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_branding_tenant_id ON user_branding_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_branding_user_tenant ON user_branding_profiles(user_id, tenant_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_branding_profiles_updated_at ON user_branding_profiles;
CREATE TRIGGER update_user_branding_profiles_updated_at
    BEFORE UPDATE ON user_branding_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create user_branding table for storing user branding preferences
CREATE TABLE IF NOT EXISTS user_branding (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    logo_url TEXT,
    logo_file_name VARCHAR(255),
    brand_name VARCHAR(255),
    brand_colors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_branding_user_id ON user_branding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_branding_user_email ON user_branding(user_email);
