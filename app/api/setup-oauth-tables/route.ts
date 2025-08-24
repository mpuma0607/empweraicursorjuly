import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log('Setting up OAuth tokens table...')

    // Create OAuth tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS oauth_tokens (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        provider VARCHAR(50) NOT NULL DEFAULT 'google',
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at TIMESTAMP NOT NULL,
        scopes TEXT[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `

    // Add unique constraint
    try {
      await sql`
        ALTER TABLE oauth_tokens 
        ADD CONSTRAINT unique_user_provider UNIQUE(user_email, provider)
      `
    } catch (error) {
      // Constraint might already exist
      console.log('Unique constraint might already exist:', error)
    }

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user_email ON oauth_tokens(user_email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_oauth_tokens_provider ON oauth_tokens(provider)`
    await sql`CREATE INDEX IF NOT EXISTS idx_oauth_tokens_expires_at ON oauth_tokens(expires_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_oauth_tokens_is_active ON oauth_tokens(is_active)`

    // Verify table creation
    const tableInfo = await sql`
      SELECT 
        table_name, 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'oauth_tokens' 
      ORDER BY ordinal_position
    `

    console.log('OAuth tokens table setup completed successfully')
    console.log('Table structure:', tableInfo)

    return NextResponse.json({
      success: true,
      message: 'OAuth tokens table created successfully',
      tableStructure: tableInfo
    })

  } catch (error) {
    console.error('Error setting up OAuth tokens table:', error)
    return NextResponse.json(
      { error: 'Failed to setup OAuth tokens table' },
      { status: 500 }
    )
  }
}
