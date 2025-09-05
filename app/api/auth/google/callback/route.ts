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
    
    // Clear OAuth cookies
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration`
    )
    
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_code_verifier')
    
    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration?error=oauth_denied`
      )
    }
    
    // Validate state parameter
    if (!state || !storedState || state !== storedState) {
      console.error('OAuth state mismatch')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration?error=oauth_state_mismatch`
      )
    }
    
    // Validate code and code verifier
    if (!code || !codeVerifier) {
      console.error('Missing OAuth code or verifier')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration?error=oauth_invalid_request`
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
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://getempowerai.com/api/auth/google/callback',
      }),
    })
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration?error=token_exchange_failed`
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
        `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration?error=user_info_failed&details=${encodeURIComponent(errorText)}`
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
         'https://www.googleapis.com/auth/gmail.modify',
         'https://www.googleapis.com/auth/userinfo.email',
         'https://www.googleapis.com/auth/userinfo.profile'
       ]
     })
     
     console.log(`OAuth completed successfully for ${userInfo.email}`)
     
     // Always redirect back to email integration page with success
     // This ensures the main page gets the OAuth result regardless of popup/redirect
     return NextResponse.redirect(
       `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration?success=oauth_completed&email=${encodeURIComponent(userInfo.email)}`
     )
    
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://getempowerai.com'}/profile/email-integration?error=oauth_callback_failed`
    )
  }
}
