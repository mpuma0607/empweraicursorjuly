import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    // Get user email from request headers (set by middleware or session)
    const userEmail = request.headers.get('x-user-email') || request.headers.get('user-email')
    
    console.log('Checking OAuth status for user:', userEmail)
    
    if (!userEmail) {
      console.log('No user email provided in request')
      return NextResponse.json({
        status: {
          connected: false,
          email: undefined,
          connectedAt: undefined,
          scopes: undefined,
          lastUsed: undefined
        }
      })
    }
    
    // Check if this specific user has valid tokens
    if (await oauthTokens.hasValidTokens(userEmail)) {
      const tokens = await oauthTokens.get(userEmail)
      
      if (tokens) {
        // Update last used time
        await oauthTokens.updateLastUsed(userEmail)
        
        console.log(`Found valid tokens for ${userEmail}`)
        
        return NextResponse.json({
          status: {
            connected: true,
            email: tokens.userEmail,
            connectedAt: tokens.createdAt,
            scopes: tokens.scopes,
            lastUsed: tokens.lastUsed
          }
        })
      }
    }
    
    // No valid tokens found for this user
    console.log(`No valid OAuth tokens found for ${userEmail}`)
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
