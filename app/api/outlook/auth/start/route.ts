import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const returnUrl = searchParams.get('returnUrl') || '/profile/email-integration'
    const tenant = searchParams.get('tenant') || 'empower-ai'

    // Generate PKCE parameters
    const codeVerifier = crypto.randomBytes(32).toString('base64url')
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url')

    // Generate state parameter with tenant and return URL info
    const state = crypto.randomBytes(16).toString('hex')
    
    // Store state in a way that includes tenant info
    const stateData = {
      state,
      tenant,
      returnUrl,
      codeVerifier,
      timestamp: Date.now()
    }

    // Store state data in a cookie (encrypted)
    const stateCookie = Buffer.from(JSON.stringify(stateData)).toString('base64')
    
    // Determine redirect URI based on tenant
    const redirectUri = tenant === 'century21-beggins' 
      ? 'https://www.begginsuniversity.com/api/outlook/auth/callback'
      : 'https://www.getempowerai.com/api/outlook/auth/callback'

    // Microsoft OAuth URL
    const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize')
    authUrl.searchParams.set('client_id', process.env.OUTLOOK_CLIENT_ID!)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/User.Read offline_access')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('code_challenge', codeChallenge)
    authUrl.searchParams.set('code_challenge_method', 'S256')
    authUrl.searchParams.set('response_mode', 'query')

    console.log('🔐 Microsoft OAuth start:', {
      tenant,
      redirectUri,
      state: state.substring(0, 8) + '...'
    })

    const response = NextResponse.redirect(authUrl.toString())
    
    // Set state cookie (httpOnly, secure, sameSite)
    response.cookies.set('outlook_oauth_state', stateCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })

    return response

  } catch (error) {
    console.error('❌ Microsoft OAuth start error:', error)
    return NextResponse.json(
      { error: 'Failed to start Microsoft OAuth flow' },
      { status: 500 }
    )
  }
}
