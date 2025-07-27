import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("=== AUTO CREATING USER BRANDING PROFILES TABLE ===")

    // Check if table already exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_branding_profiles'
      )
    `

    if (tableExists[0].exists) {
      console.log("Table already exists, skipping creation")
      return Response.json({
        success: true,
        message: "user_branding_profiles table already exists",
        alreadyExists: true,
      })
    }

    // Create the table
    await sql`
      CREATE TABLE user_branding_profiles (
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
      )
    `

    // Create indexes
    await sql`
      CREATE INDEX idx_user_branding_profiles_user_tenant 
      ON user_branding_profiles(user_id, tenant_id)
    `

    await sql`
      CREATE INDEX idx_user_branding_profiles_tenant 
      ON user_branding_profiles(tenant_id)
    `

    await sql`
      CREATE INDEX idx_user_branding_profiles_user_email 
      ON user_branding_profiles(user_email)
    `

    // Create update function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `

    // Create trigger
    await sql`
      CREATE TRIGGER update_user_branding_profiles_updated_at
        BEFORE UPDATE ON user_branding_profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `

    // Verify table was created
    const verification = await sql`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'user_branding_profiles'
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `

    console.log("Table creation verification:", verification)

    return Response.json({
      success: true,
      message: "user_branding_profiles table created successfully",
      verification: verification,
    })
  } catch (error) {
    console.error("Error creating table:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// Auto-run table creation on GET request too
export async function GET() {
  return POST()
}
