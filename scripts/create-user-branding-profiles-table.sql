-- Create user_branding_profiles table
CREATE TABLE IF NOT EXISTS user_branding_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    brokerage VARCHAR(255) NOT NULL,
    custom_logo_url TEXT,
    logo_public_id VARCHAR(255),
    preferences JSONB DEFAULT '{"auto_brand": true}',
    tenant_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add unique constraint for user_id and tenant_id combination
ALTER TABLE user_branding_profiles 
ADD CONSTRAINT unique_user_tenant_branding 
UNIQUE (user_id, tenant_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_branding_profiles_updated_at
    BEFORE UPDATE ON user_branding_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
