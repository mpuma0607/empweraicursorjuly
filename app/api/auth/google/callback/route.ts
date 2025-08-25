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
    const tenant = request.cookies.get('oauth_tenant')?.value || 'empower-ai'
    const callbackRedirectUrl = request.cookies.get('oauth_callback_redirect')?.value || 
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration`
    
    console.log('OAuth Callback - Tenant:', tenant, 'Callback Redirect:', callbackRedirectUrl)
    
    // Clear OAuth cookies
    const response = NextResponse.redirect(callbackRedirectUrl)
    
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_code_verifier')
    response.cookies.delete('oauth_tenant')
    response.cookies.delete('oauth_callback_redirect')

    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `${callbackRedirectUrl}?error=oauth_denied`
      )
    }

    // Validate state parameter
    if (!state || !storedState || state !== storedState) {
      console.error('OAuth state mismatch')
      return NextResponse.redirect(
        `${callbackRedirectUrl}?error=oauth_state_mismatch`
      )
    }

    // Validate code and code verifier
    if (!code || !codeVerifier) {
      console.error('Missing OAuth code or verifier')
      return NextResponse.redirect(
        `${callbackRedirectUrl}?error=oauth_invalid_request`
      )
    }

    // Exchange code for tokens
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
        redirect_uri: tenant === 'century21-beggins' 
          ? 'https://begginsuniversity.com/api/auth/google/callback'
          : (process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://getempowerai.com/api/auth/google/callback'),
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(
        `${callbackRedirectUrl}?error=token_exchange_failed`
      )
    }

    const tokenData = await tokenResponse.json()
    
    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      console.error('Failed to get user info')
      return NextResponse.redirect(
        `${callbackRedirectUrl}?error=user_info_failed`
      )
    }

    const userInfo = await userInfoResponse.json()
    
    // Store tokens securely in database with tenant context
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Google tokens typically expire in 1 hour
    
    await oauthTokens.store(userInfo.email, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      tenant: tenant // Store tenant context
    })
    
    console.log(`OAuth completed successfully for ${userInfo.email} on tenant: ${tenant}`)
    
    // Always redirect back to the appropriate tenant's email integration page
    return NextResponse.redirect(
      `${callbackRedirectUrl}?success=oauth_completed&email=${encodeURIComponent(userInfo.email)}`
    )
    
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    return NextResponse.redirect(
      `${callbackRedirectUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration`}?error=oauth_callback_failed`
    )
  }
}
