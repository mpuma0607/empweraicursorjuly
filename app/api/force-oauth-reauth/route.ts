import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // Mark all OAuth tokens as inactive to force re-authentication
    const result = await sql`
      UPDATE oauth_tokens 
      SET is_active = false
      WHERE provider = 'google'
    `
    
    console.log(`Marked ${result.length} OAuth tokens as inactive`)
    
    return NextResponse.json({
      success: true,
      message: `Marked ${result.length} OAuth tokens as inactive. All users will need to reconnect their Google accounts.`,
      affectedCount: result.length
    })
    
  } catch (error) {
    console.error('Error forcing OAuth reauth:', error)
    return NextResponse.json({ 
      error: "Failed to force OAuth reauth", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
