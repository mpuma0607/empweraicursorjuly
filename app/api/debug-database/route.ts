import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Check database connection
    const connectionTest =
      await sql`SELECT NOW() as current_time, current_database() as db_name, current_user as user_name`

    // Get all tables
    const allTables = await sql`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Check for any branding-related tables
    const brandingTables = await sql`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%brand%'
      ORDER BY table_name
    `

    return NextResponse.json({
      success: true,
      data: {
        connection: connectionTest,
        allTables,
        brandingTables,
      },
    })
  } catch (error) {
    console.error("Database diagnostic error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
