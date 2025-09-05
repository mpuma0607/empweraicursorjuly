import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    // Get user email from query params or headers
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('email')
    
    if (!userEmail) {
      return NextResponse.json({
        connected: false,
        error: "User email is required to check Gmail connection"
      }, { status: 400 })
    }
    
    // Check if user has valid OAuth tokens for Gmail
    const hasValidTokens = await oauthTokens.hasValidTokens(userEmail, 'google')
    
    console.log(`Gmail connection check for ${userEmail}:`, hasValidTokens)
    
    return NextResponse.json({
      connected: hasValidTokens,
      message: hasValidTokens ? "Gmail OAuth connected" : "Gmail OAuth not connected"
    })
  } catch (error) {
    console.error("Error checking Gmail connection:", error)
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
