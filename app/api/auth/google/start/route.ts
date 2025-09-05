import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('=== OAUTH START DEBUG ===')
    console.log('GOOGLE_OAUTH_CLIENT_ID:', process.env.GOOGLE_OAUTH_CLIENT_ID ? 'SET' : 'NOT SET')
    console.log('GOOGLE_OAUTH_REDIRECT_URI:', process.env.GOOGLE_OAUTH_REDIRECT_URI || 'DEFAULT')
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'DEFAULT')
    
    // Generate PKCE challenge and verifier
    const codeVerifier = randomBytes(32).toString('base64url')
    const codeChallenge = codeVerifier // For now, using plain PKCE (can upgrade to S256 later)
    
    // Generate state for CSRF protection
    const state = randomBytes(16).toString('hex')
    
    // Build OAuth URL
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://getempowerai.com/api/auth/google/callback')}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=plain` +
      `&include_granted_scopes=true`
    
    console.log('OAuth URL:', oauthUrl)
    
    // Store these securely (in production, use Redis or database)
    // For now, we'll use cookies with httpOnly
    const response = NextResponse.redirect(oauthUrl)
    
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
