import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('=== OAUTH START DEBUG ===')
    console.log('GOOGLE_OAUTH_CLIENT_ID:', process.env.GOOGLE_OAUTH_CLIENT_ID ? 'SET' : 'NOT SET')
    console.log('GOOGLE_OAUTH_REDIRECT_URI:', process.env.GOOGLE_OAUTH_REDIRECT_URI || 'DEFAULT')
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'DEFAULT')
    
    // Get current host from request headers
    const host = request.headers.get('host') || 'getempowerai.com'
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const currentOrigin = `${protocol}://${host}`
    
    console.log('Current host:', host)
    console.log('Current origin:', currentOrigin)
    
    // Generate PKCE challenge and verifier
    const codeVerifier = randomBytes(32).toString('base64url')
    const codeChallenge = codeVerifier // For now, using plain PKCE (can upgrade to S256 later)
    
    // Generate state for CSRF protection and include tenant info
    const stateData = {
      csrf: randomBytes(16).toString('hex'),
      tenant: host.includes('beggins') ? 'century21-beggins' : 
              host.includes('empowerai') ? 'empower-ai' : 'empower-ai',
      origin: currentOrigin
    }
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64url')
    
    // Build OAuth URL with dynamic redirect URI
    const redirectUri = `${currentOrigin}/api/auth/google/callback`
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly')}` +
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
    
    // Store the original state data for validation
    response.cookies.set('oauth_state', JSON.stringify(stateData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Error starting OAuth flow:', error)
    const host = request.headers.get('host') || 'getempowerai.com'
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const currentOrigin = `${protocol}://${host}`
    return NextResponse.redirect(
      `${currentOrigin}/profile/email-integration?error=oauth_start_failed`
    )
  }
}
