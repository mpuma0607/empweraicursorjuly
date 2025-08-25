import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // Get stored OAuth data from Beggins-specific cookies
    const storedState = request.cookies.get('beggins_oauth_state')?.value
    const codeVerifier = request.cookies.get('beggins_oauth_code_verifier')?.value
    
    console.log('Beggins OAuth Callback - State:', state, 'Stored State:', storedState)
    
    // Default redirect for Beggins
    const callbackRedirectUrl = 'https://begginsuniversity.com/beggins-home/email-integration'
    
    if (error) {
      console.error('Beggins OAuth error:', error)
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=oauth_denied`)
      // Clear Beggins cookies after redirect
      response.cookies.delete('beggins_oauth_state')
      response.cookies.delete('beggins_oauth_code_verifier')
      return response
    }

    // Validate state parameter
    if (!state || !storedState || state !== storedState) {
      console.error('Beggins OAuth state mismatch')
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=oauth_state_mismatch`)
      // Clear Beggins cookies after redirect
      response.cookies.delete('beggins_oauth_state')
      response.cookies.delete('beggins_oauth_code_verifier')
      return response
    }

    // Validate code and code verifier
    if (!code || !codeVerifier) {
      console.error('Missing Beggins OAuth code or verifier')
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=oauth_invalid_request`)
      // Clear Beggins cookies after redirect
      response.cookies.delete('beggins_oauth_state')
      response.cookies.delete('beggins_oauth_code_verifier')
      return response
    }

    // Exchange code for tokens using Beggins OAuth credentials
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.BEGGINS_GOOGLE_OAUTH_CLIENT_ID!,
        client_secret: process.env.BEGGINS_GOOGLE_OAUTH_CLIENT_SECRET!,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: process.env.BEGGINS_GOOGLE_OAUTH_REDIRECT_URI || 'https://begginsuniversity.com/api/beggins/auth/google/callback',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Beggins token exchange failed:', errorData)
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=token_exchange_failed`)
      // Clear Beggins cookies after redirect
      response.cookies.delete('beggins_oauth_state')
      response.cookies.delete('beggins_oauth_code_verifier')
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
      console.error('Failed to get Beggins user info')
      const response = NextResponse.redirect(`${callbackRedirectUrl}?error=user_info_failed`)
      // Clear Beggins cookies after redirect
      response.cookies.delete('beggins_oauth_state')
      response.cookies.delete('beggins_oauth_code_verifier')
      return response
    }

    const userInfo = await userInfoResponse.json()
    
    // Store tokens securely in database with Beggins tenant context
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)
    
    await oauthTokens.store(userInfo.email, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      tenant: 'century21-beggins' // Always Beggins tenant
    })
    
    console.log(`Beggins OAuth completed successfully for ${userInfo.email}`)
    
    // Redirect back to Beggins email integration page
    const response = NextResponse.redirect(
      `${callbackRedirectUrl}?success=oauth_completed&email=${encodeURIComponent(userInfo.email)}`
    )
    // Clear Beggins cookies after redirect
    response.cookies.delete('beggins_oauth_state')
    response.cookies.delete('beggins_oauth_code_verifier')
    return response
    
  } catch (error) {
    console.error('Error in Beggins OAuth callback:', error)
    const fallbackUrl = 'https://begginsuniversity.com/beggins-home/email-integration'
    const response = NextResponse.redirect(`${fallbackUrl}?error=oauth_callback_failed`)
    // Clear Beggins cookies after redirect
    response.cookies.delete('beggins_oauth_state')
    response.cookies.delete('beggins_oauth_code_verifier')
    return response
  }
}
