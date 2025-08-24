import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    // For now, we'll check all stored tokens and return the first valid one
    // TODO: In production, get user ID from session/auth and check specific user's tokens
    
    const allEmails = oauthTokens.getAllEmails()
    console.log('Checking OAuth status for emails:', allEmails)
    
    // Find the first user with valid tokens
    for (const email of allEmails) {
      if (oauthTokens.hasValidTokens(email)) {
        const tokens = oauthTokens.get(email)!
        
        // Update last used time
        oauthTokens.updateLastUsed(email)
        
        console.log(`Found valid tokens for ${email}`)
        
        return NextResponse.json({
          status: {
            connected: true,
            email: tokens.email,
            connectedAt: tokens.createdAt,
            scopes: tokens.scopes,
            lastUsed: tokens.lastUsed
          }
        })
      }
    }
    
    // No valid tokens found
    console.log('No valid OAuth tokens found')
    return NextResponse.json({
      status: {
        connected: false,
        email: undefined,
        connectedAt: undefined,
        scopes: undefined,
        lastUsed: undefined
      }
    })
    
  } catch (error) {
    console.error('Error checking OAuth status:', error)
    return NextResponse.json(
      { error: 'Failed to check connection status' },
      { status: 500 }
    )
  }
}
