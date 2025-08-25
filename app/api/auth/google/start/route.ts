import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    // Determine the current tenant from the request hostname
    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const currentDomain = `${protocol}://${host}`
    
    // Determine tenant and redirect URI based on domain
    let redirectUri: string
    let callbackRedirectUrl: string
    
    if (host.includes('beggins') || host.includes('begginsuniversity')) {
      // Beggins tenant
      redirectUri = 'https://begginsuniversity.com/api/auth/google/callback'
      callbackRedirectUrl = 'https://begginsuniversity.com/beggins-home/email-integration'
      console.log('OAuth Start: Using Beggins tenant configuration')
    } else {
      // Empower tenant (default)
      redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://getempowerai.com/api/auth/google/callback'
      callbackRedirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration`
      console.log('OAuth Start: Using Empower tenant configuration')
    }
    
    console.log('OAuth Start - Domain:', host, 'Redirect URI:', redirectUri, 'Callback Redirect:', callbackRedirectUrl)

    // Generate PKCE challenge and verifier
    const codeVerifier = randomBytes(32).toString('base64url')
    const codeChallenge = codeVerifier // Using plain PKCE for now
    
    // Generate state for CSRF protection
    const state = randomBytes(16).toString('hex')
    
    // Build OAuth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email')}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=plain` +
      `&include_granted_scopes=true`

    console.log('Google OAuth URL generated:', authUrl)

    // Set secure cookies for PKCE and state
    const response = NextResponse.redirect(authUrl)
    
    // Store tenant info in cookies for the callback
    response.cookies.set('oauth_tenant', host.includes('beggins') ? 'century21-beggins' : 'empower-ai', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })
    
    response.cookies.set('oauth_callback_redirect', callbackRedirectUrl, {
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
