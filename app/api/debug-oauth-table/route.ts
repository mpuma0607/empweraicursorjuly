import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if oauth_tokens table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'oauth_tokens'
      ) as exists
    `
    
    if (!tableExists[0]?.exists) {
      return NextResponse.json({ 
        error: "oauth_tokens table does not exist",
        tableExists: false
      })
    }

    // Get column information
    const columns = await sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'oauth_tokens' 
      ORDER BY ordinal_position
    `

    // Check if scopes column exists
    const scopesColumn = columns.find(col => col.column_name === 'scopes')
    const scopeColumn = columns.find(col => col.column_name === 'scope')

    return NextResponse.json({
      tableExists: true,
      columns: columns,
      hasScopesColumn: !!scopesColumn,
      hasScopeColumn: !!scopeColumn,
      scopesColumnInfo: scopesColumn,
      scopeColumnInfo: scopeColumn
    })

  } catch (error) {
    console.error('Error checking oauth_tokens table:', error)
    return NextResponse.json({ 
      error: "Failed to check database", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
