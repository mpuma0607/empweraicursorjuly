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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tenant_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_branding_profiles_user_tenant 
ON user_branding_profiles(user_id, tenant_id);

-- Create index for tenant lookups
CREATE INDEX IF NOT EXISTS idx_user_branding_profiles_tenant 
ON user_branding_profiles(tenant_id);

-- Insert some sample data for testing (optional)
-- INSERT INTO user_branding_profiles (
--     user_id, user_email, brand, brokerage, tenant_id
-- ) VALUES (
--     'test-user-123', 'test@example.com', 'Century 21', 'Century 21 Beggins Enterprises', 'century21-beggins'
-- ) ON CONFLICT (user_id, tenant_id) DO NOTHING;
