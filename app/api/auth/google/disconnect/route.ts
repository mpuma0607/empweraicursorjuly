import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    // Get user email from request headers
    const userEmail = request.headers.get('x-user-email') || request.headers.get('user-email')
    
    console.log('Disconnecting Gmail for user:', userEmail)
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required for disconnect' },
        { status: 400 }
      )
    }
    
    // Get tokens for this specific user
    const tokens = await oauthTokens.get(userEmail)
    
    if (tokens?.accessToken) {
      try {
        // Revoke access token with Google
        await fetch('https://oauth2.googleapis.com/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `token=${tokens.accessToken}`
        })
        console.log(`Revoked Google token for ${userEmail}`)
      } catch (error) {
        console.error('Error revoking token with Google:', error)
        // Continue with local cleanup even if Google revocation fails
      }
    }
    
    // Remove tokens locally for this user only
    await oauthTokens.remove(userEmail)
    
    return NextResponse.json({ success: true, message: 'Gmail disconnected successfully' })
    
  } catch (error) {
    console.error('Error disconnecting Gmail:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail' },
      { status: 500 }
    )
  }
}
