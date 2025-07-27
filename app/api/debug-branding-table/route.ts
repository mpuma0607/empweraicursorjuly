import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("=== DEBUGGING BRANDING TABLE ===")

    // Check if table exists
    const tableCheck = await sql`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_name LIKE '%branding%'
    `

    console.log("Tables with 'branding' in name:", tableCheck)

    // List all tables in public schema
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log("All tables in public schema:", allTables)

    // Try to describe the user_branding_profiles table
    let tableStructure = null
    try {
      tableStructure = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'user_branding_profiles'
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `
    } catch (error) {
      console.log("Error getting table structure:", error)
    }

    return Response.json({
      success: true,
      data: {
        brandingTables: tableCheck,
        allTables: allTables,
        tableStructure: tableStructure,
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
