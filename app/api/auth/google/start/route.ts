import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    // Determine the current tenant from the request hostname
    const host = request.headers.get('host') || ''
    
    // ALWAYS use Empower AI's OAuth flow and redirect URI
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://getempowerai.com/api/auth/google/callback'
    
    // Only the final destination after OAuth is tenant-aware
    let callbackRedirectUrl: string
    
    if (host.includes('beggins') || host.includes('begginsuniversity')) {
      // Beggins tenant - redirect to Beggins email integration page
      callbackRedirectUrl = 'https://begginsuniversity.com/beggins-home/email-integration'
      console.log('OAuth Start: Using Beggins tenant (final destination)')
    } else {
      // Empower tenant - redirect to Empower email integration page
      callbackRedirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration`
      console.log('OAuth Start: Using Empower tenant (final destination)')
    }
    
    console.log('OAuth Start - Domain:', host, 'OAuth Redirect URI:', redirectUri, 'Final Destination:', callbackRedirectUrl)

    // Generate PKCE challenge and verifier
    const codeVerifier = randomBytes(32).toString('base64url')
    const codeChallenge = codeVerifier // Using plain PKCE for now
    
    // Generate state for CSRF protection - include redirect URL in state
    const state = randomBytes(16).toString('hex')
    const stateWithRedirect = `${state}:${encodeURIComponent(callbackRedirectUrl)}`
    
    // Build OAuth URL - ALWAYS use Empower AI's OAuth
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email')}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${encodeURIComponent(stateWithRedirect)}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=plain` +
      `&include_granted_scopes=true`

    console.log('Google OAuth URL generated (using Empower AI OAuth):', authUrl)

    // Set secure cookies for PKCE and state
    const response = NextResponse.redirect(authUrl)
    
    // Store tenant info in cookies for the callback (only for final redirect)
    response.cookies.set('oauth_tenant', host.includes('beggins') ? 'century21-beggins' : 'empower-ai', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })
    
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
    console.error('Error starting Google OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to start OAuth flow' },
      { status: 500 }
    )
  }
}
