import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.BEGGINS_GOOGLE_CLIENT_ID
    const redirectUri = process.env.BEGGINS_GOOGLE_REDIRECT_URI

    if (!clientId || !redirectUri) {
      console.error("Missing Beggins Google OAuth environment variables")
      return NextResponse.json(
        { error: "OAuth configuration missing" },
        { status: 500 }
      )
    }

    // Generate PKCE challenge and verifier (using same method as Empower)
    const codeVerifier = randomBytes(32).toString('base64url')
    const codeChallenge = codeVerifier // Using plain PKCE for now (can upgrade to S256 later)
    
    // Generate state for CSRF protection
    const state = randomBytes(16).toString('hex')
    
    // Build OAuth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email')}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=plain` +
      `&include_granted_scopes=true`

    console.log("Beggins Google OAuth URL generated:", authUrl)

    // Set secure cookies for PKCE and state (same as Empower implementation)
    const response = NextResponse.redirect(authUrl)
    
    response.cookies.set('beggins_oauth_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })
    
    response.cookies.set('beggins_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error("Error starting Beggins Google OAuth:", error)
    return NextResponse.json(
      { error: "Failed to start OAuth flow" },
      { status: 500 }
    )
  }
}
