-- Add tenant column to oauth_tokens table
-- This migration adds tenant context to OAuth tokens for multi-tenant support

-- Add tenant column with default value
ALTER TABLE oauth_tokens 
ADD COLUMN IF NOT EXISTS tenant VARCHAR(50) DEFAULT 'empower-ai';

-- Update existing records to have the default tenant
UPDATE oauth_tokens 
SET tenant = 'empower-ai' 
WHERE tenant IS NULL;

-- Make tenant column NOT NULL after setting default values
ALTER TABLE oauth_tokens 
ALTER COLUMN tenant SET NOT NULL;

-- Add index for better performance on tenant queries
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_tenant ON oauth_tokens(tenant);

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user_provider_tenant ON oauth_tokens(user_email, provider, tenant);

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'oauth_tokens' 
AND column_name = 'tenant';

-- Show sample data
SELECT 
  user_email, 
  provider, 
  tenant, 
  created_at 
FROM oauth_tokens 
LIMIT 5;
