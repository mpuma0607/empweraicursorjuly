import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // Get stored OAuth data from cookies
    const storedState = request.cookies.get('oauth_state')?.value
    const codeVerifier = request.cookies.get('oauth_code_verifier')?.value
    
    // Parse state to get tenant and origin info
    let stateData = null
    let targetOrigin = 'https://21goldconnect.com'
    let returnUrl = `${targetOrigin}/profile/email-integration`
    
    try {
      if (state) {
        stateData = JSON.parse(Buffer.from(state, 'base64url').toString())
        targetOrigin = stateData.origin || targetOrigin
        returnUrl = stateData.returnUrl || returnUrl
        console.log('Parsed state data:', stateData)
        console.log('Target origin:', targetOrigin)
        console.log('Return URL:', returnUrl)
      }
    } catch (parseError) {
      console.warn('Failed to parse state, using fallback origin:', parseError)
    }
    
    // Parse stored state for validation
    let storedStateData = null
    try {
      if (storedState) {
        storedStateData = JSON.parse(storedState)
        console.log('Stored state data:', storedStateData)
      }
    } catch (parseError) {
      console.warn('Failed to parse stored state:', parseError)
    }
    
    // Clear OAuth cookies
    const response = NextResponse.redirect(returnUrl)
    
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_code_verifier')
    
    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `${returnUrl}?error=oauth_denied`
      )
    }
    
    // Debug state validation
    console.log('=== STATE VALIDATION DEBUG ===')
    console.log('Received state:', state)
    console.log('Parsed stateData:', stateData)
    console.log('Stored state:', storedState)
    console.log('Parsed storedStateData:', storedStateData)
    
    // Validate state parameter - check CSRF token matches stored state
    if (!state || !stateData || !stateData.csrf || !storedStateData || !storedStateData.csrf) {
      console.error('OAuth state missing or invalid')
      console.error('State validation failed - missing required fields')
      return NextResponse.redirect(
        `${returnUrl}?error=oauth_state_mismatch`
      )
    }
    
    // Validate CSRF token matches
    if (stateData.csrf !== storedStateData.csrf) {
      console.error('OAuth CSRF token mismatch')
      console.error('Expected CSRF:', storedStateData.csrf)
      console.error('Received CSRF:', stateData.csrf)
      return NextResponse.redirect(
        `${returnUrl}?error=oauth_state_mismatch`
      )
    }
    
    console.log('State validation passed successfully')
    
    // Validate code and code verifier
    if (!code || !codeVerifier) {
      console.error('Missing OAuth code or verifier')
      return NextResponse.redirect(
        `${returnUrl}?error=oauth_invalid_request`
      )
    }
    
    // Exchange code for tokens - use Century 21 803 Realty specific redirect URI
    const redirectUri = 'https://21goldconnect.com/api/century21-803-realty/auth/google/callback'
    
    console.log('Using redirect URI for token exchange:', redirectUri)
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(
        `${returnUrl}?error=token_exchange_failed`
      )
    }
    
    const tokenData = await tokenResponse.json()
    
    // Get user info from Google
    console.log('Getting user info from Google API...')
    console.log('Access token (first 20 chars):', tokenData.access_token.substring(0, 20) + '...')
    console.log('Token type:', tokenData.token_type)
    console.log('Expires in:', tokenData.expires_in)
    
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
    
    console.log('User info response status:', userInfoResponse.status)
    console.log('User info response headers:', Object.fromEntries(userInfoResponse.headers.entries()))
    
    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text()
      console.error('Failed to get user info:', userInfoResponse.status, errorText)
      console.error('Full error response:', errorText)
      return NextResponse.redirect(
        `${returnUrl}?error=user_info_failed&details=${encodeURIComponent(errorText)}`
      )
    }
    
    const userInfo = await userInfoResponse.json()
    
    // Store tokens securely in database
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Google tokens typically expire in 1 hour
    
    await oauthTokens.store(userInfo.email, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.events.readonly'
      ]
    })
    
    console.log(`OAuth completed successfully for ${userInfo.email}`)
    
    // Always redirect back to email integration page with success
    // This ensures the main page gets the OAuth result regardless of popup/redirect
    return NextResponse.redirect(
      `${returnUrl}?success=oauth_completed&email=${encodeURIComponent(userInfo.email)}`
    )
    
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    // Try to get target origin from request if available
    const host = request.headers.get('host') || '21goldconnect.com'
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const fallbackOrigin = `${protocol}://${host}`
    return NextResponse.redirect(
      `${fallbackOrigin}/profile/email-integration?error=oauth_callback_failed`
    )
  }
}
