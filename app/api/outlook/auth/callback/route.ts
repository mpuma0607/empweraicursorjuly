import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    console.log('🔐 Microsoft OAuth callback:', { 
      hasCode: !!code, 
      hasState: !!state, 
      error 
    })

    if (error) {
      console.error('❌ Microsoft OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=microsoft_oauth_failed&message=${encodeURIComponent(error)}`
      )
    }

    if (!code || !state) {
      console.error('❌ Missing code or state parameter')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=missing_parameters`
      )
    }

    // Get and validate state from cookie
    const stateCookie = request.cookies.get('outlook_oauth_state')?.value
    if (!stateCookie) {
      console.error('❌ No state cookie found')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=invalid_state`
      )
    }

    let stateData
    try {
      stateData = JSON.parse(Buffer.from(stateCookie, 'base64').toString())
    } catch (error) {
      console.error('❌ Failed to parse state cookie:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=invalid_state`
      )
    }

    // Validate state matches
    if (stateData.state !== state) {
      console.error('❌ State mismatch')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=state_mismatch`
      )
    }

    // Check if state is not too old (10 minutes)
    const now = Date.now()
    if (now - stateData.timestamp > 10 * 60 * 1000) {
      console.error('❌ State expired')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=state_expired`
      )
    }

    const { tenant, returnUrl, codeVerifier } = stateData

    // Exchange code for tokens
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID!,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET!,
        code: code,
        redirect_uri: tenant === 'century21-beggins' 
          ? 'https://www.begginsuniversity.com/api/outlook/auth/callback'
          : 'https://www.getempowerai.com/api/outlook/auth/callback',
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('❌ Token exchange failed:', errorData)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=token_exchange_failed`
      )
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Microsoft tokens received')

    // Get user info to get their email
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error('❌ Failed to get user info')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=user_info_failed`
      )
    }

    const userData = await userResponse.json()
    const userEmail = userData.mail || userData.userPrincipalName

    if (!userEmail) {
      console.error('❌ No email found in user data')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=no_email_found`
      )
    }

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000))

    // Store tokens for THIS SPECIFIC USER ONLY
    await oauthTokens.store(userEmail, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: expiresAt,
      scopes: tokenData.scope.split(' '),
      provider: 'microsoft'
    })

    console.log(`✅ Microsoft OAuth completed for user: ${userEmail}`)

    // Clear the state cookie
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}${returnUrl}?success=microsoft_connected`
    )
    
    response.cookies.delete('outlook_oauth_state')
    
    return response

  } catch (error) {
    console.error('❌ Microsoft OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/profile/email-integration?error=callback_failed`
    )
  }
}
