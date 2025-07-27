import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Use POST method to run migration",
    usage: "POST /api/run-migration",
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting database migration...")

    // Drop existing tables if they exist with wrong schema
    try {
      await sql`DROP TABLE IF EXISTS page_views CASCADE`
      await sql`DROP TABLE IF EXISTS user_events CASCADE`
      await sql`DROP TABLE IF EXISTS user_sessions CASCADE`
      console.log("Dropped existing tables with wrong schema")
    } catch (error) {
      console.log("No existing tables to drop, continuing...")
    }

    // Create tracking tables with correct schema
    await sql`
      CREATE TABLE user_sessions (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          user_agent TEXT,
          ip_address VARCHAR(45),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Created user_sessions table")

    await sql`
      CREATE TABLE page_views (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          page_path VARCHAR(500) NOT NULL,
          page_title VARCHAR(500),
          referrer VARCHAR(500),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Created page_views table")

    await sql`
      CREATE TABLE user_events (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          event_type VARCHAR(100) NOT NULL,
          event_data JSONB,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Created user_events table")

    await sql`
      CREATE TABLE IF NOT EXISTS user_creations (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          user_email VARCHAR(255) NOT NULL,
          tool_type VARCHAR(100) NOT NULL,
          title VARCHAR(500) NOT NULL,
          content TEXT NOT NULL,
          form_data JSONB,
          metadata JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP NOT NULL
      )
    `
    console.log("Created user_creations table")

    // Create indexes
    await sql`CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id)`
    await sql`CREATE INDEX idx_page_views_session_id ON page_views(session_id)`
    await sql`CREATE INDEX idx_page_views_timestamp ON page_views(timestamp)`
    await sql`CREATE INDEX idx_user_events_session_id ON user_events(session_id)`
    await sql`CREATE INDEX idx_user_events_timestamp ON user_events(timestamp)`
    await sql`CREATE INDEX idx_user_creations_user_id ON user_creations(user_id)`
    await sql`CREATE INDEX idx_user_creations_tool_type ON user_creations(tool_type)`
    await sql`CREATE INDEX idx_user_creations_created_at ON user_creations(created_at)`
    console.log("Created indexes")

    console.log("Database migration completed successfully")

    return NextResponse.json({
      success: true,
      message: "Database migration completed successfully",
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        error: "Migration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
