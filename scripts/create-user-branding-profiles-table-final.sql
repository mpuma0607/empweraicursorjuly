-- Create user_branding_profiles table with all necessary fields
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tenant_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_branding_profiles_user_tenant 
ON user_branding_profiles(user_id, tenant_id);

CREATE INDEX IF NOT EXISTS idx_user_branding_profiles_tenant 
ON user_branding_profiles(tenant_id);

CREATE INDEX IF NOT EXISTS idx_user_branding_profiles_user_email 
ON user_branding_profiles(user_email);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_branding_profiles_updated_at ON user_branding_profiles;
CREATE TRIGGER update_user_branding_profiles_updated_at
    BEFORE UPDATE ON user_branding_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional - remove in production)
INSERT INTO user_branding_profiles (
    user_id, user_email, brand, brokerage, tenant_id
) VALUES (
    'test-user-123', 'test@example.com', 'century21', 'Century 21 Beggins Enterprises', 'century21-beggins'
) ON CONFLICT (user_id, tenant_id) DO NOTHING;

-- Verify table creation
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_branding_profiles'
ORDER BY ordinal_position;
