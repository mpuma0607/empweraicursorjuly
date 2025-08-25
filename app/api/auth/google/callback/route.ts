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
    
    console.log('Empower AI OAuth Callback - State:', state, 'Stored State:', storedState)
    
    // Default redirect for Empower AI
    const callbackRedirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration`
    
    if (error) {
      console.error('OAuth error:', error)
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=oauth_denied`)
      // Clear cookies after redirect
      response.cookies.delete('oauth_state')
      response.cookies.delete('oauth_code_verifier')
      return response
    }

    // Validate state parameter
    if (!state || !storedState || state !== storedState) {
      console.error('OAuth state mismatch')
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=oauth_state_mismatch`)
      // Clear cookies after redirect
      response.cookies.delete('oauth_state')
      response.cookies.delete('oauth_code_verifier')
      return response
    }

    // Validate code and code verifier
    if (!code || !codeVerifier) {
      console.error('Missing OAuth code or verifier')
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=oauth_invalid_request`)
      // Clear cookies after redirect
      response.cookies.delete('oauth_state')
      response.cookies.delete('oauth_code_verifier')
      return response
    }

    // Exchange code for tokens using Empower AI OAuth credentials
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
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://getempowerai.com/api/auth/google/callback',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=token_exchange_failed`)
      // Clear cookies after redirect
      response.cookies.delete('oauth_state')
      response.cookies.delete('oauth_code_verifier')
      return response
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
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=user_info_failed`)
      // Clear cookies after redirect
      response.cookies.delete('oauth_state')
      response.cookies.delete('oauth_code_verifier')
      return response
    }

    const userInfo = await userInfoResponse.json()
    
    // Store tokens securely in database with Empower AI tenant context
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)
    
    await oauthTokens.store(userInfo.email, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      tenant: 'empower-ai' // Always Empower AI tenant
    })
    
    console.log(`OAuth completed successfully for ${userInfo.email} on Empower AI tenant`)
    
    // Redirect back to Empower AI email integration page
    const response = NextResponse.redirect(
      `${callbackRedirectUrl}?success=oauth_completed&email=${encodeURIComponent(userInfo.email)}`
    )
    // Clear cookies after redirect
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_code_verifier')
    return response
    
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    const fallbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration`
    const response = NextResponse.redirect(`${fallbackUrl}?error=oauth_callback_failed`)
    // Clear cookies after redirect
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_code_verifier')
    return response
  }
}
