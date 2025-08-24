import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    // For now, we'll remove all stored tokens
    // TODO: In production, get user ID from session/auth and remove specific user's tokens
    
    const allEmails = await oauthTokens.getAllEmails()
    console.log('Disconnecting Gmail for emails:', allEmails)
    
    // Revoke tokens with Google and remove locally
    for (const email of allEmails) {
      const tokens = await oauthTokens.get(email)
      if (tokens?.accessToken) {
        try {
          // Revoke access token with Google
          await fetch('https://oauth2.googleapis.com/revoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${tokens.accessToken}`
          })
          console.log(`Revoked Google token for ${email}`)
        } catch (error) {
          console.error('Error revoking token with Google:', error)
          // Continue with local cleanup even if Google revocation fails
        }
      }
      
      // Remove tokens locally
      await oauthTokens.remove(email)
    }
    
    return NextResponse.json({ success: true, message: 'Gmail disconnected successfully' })
    
  } catch (error) {
    console.error('Error disconnecting Gmail:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail' },
      { status: 500 }
    )
  }
}
