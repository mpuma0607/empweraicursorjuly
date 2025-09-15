import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // Clear all OAuth tokens to force re-authentication
    const result = await sql`
      DELETE FROM oauth_tokens 
      WHERE provider = 'google'
    `
    
    console.log(`Cleared ${result.length} OAuth tokens`)
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${result.length} OAuth tokens. All users will need to reconnect their Google accounts.`,
      clearedCount: result.length
    })
    
  } catch (error) {
    console.error('Error clearing OAuth tokens:', error)
    return NextResponse.json({ 
      error: "Failed to clear OAuth tokens", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
