import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    // Generate PKCE challenge and verifier
    const codeVerifier = randomBytes(32).toString('base64url')
    const codeChallenge = codeVerifier // For now, using plain PKCE (can upgrade to S256 later)
    
    // Generate state for CSRF protection
    const state = randomBytes(16).toString('hex')
    
    // Store these securely (in production, use Redis or database)
    // For now, we'll use cookies with httpOnly
    const response = NextResponse.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || 'https://getempowerai.com/api/auth/google/callback')}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.send')}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=plain` +
      `&include_granted_scopes=true`
    )
    
    // Set secure cookies for PKCE and state
    response.cookies.set('oauth_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })
    
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Error starting OAuth flow:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration?error=oauth_start_failed`
    )
  }
}
