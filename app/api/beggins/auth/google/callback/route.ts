import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")
    
    // Get stored OAuth data from cookies
    const storedState = request.cookies.get('beggins_oauth_state')?.value
    const codeVerifier = request.cookies.get('beggins_oauth_code_verifier')?.value
    
    // Clear OAuth cookies
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration`
    )
    
    response.cookies.delete('beggins_oauth_state')
    response.cookies.delete('beggins_oauth_code_verifier')

    if (error) {
      console.error("OAuth error:", error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?error=oauth_denied`
      )
    }

    // Validate state parameter
    if (!state || !storedState || state !== storedState) {
      console.error("OAuth state mismatch")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?error=oauth_state_mismatch`
      )
    }

    // Validate code and code verifier
    if (!code || !codeVerifier) {
      console.error("Missing OAuth code or verifier")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?error=oauth_invalid_request`
      )
    }

    const clientId = process.env.BEGGINS_GOOGLE_CLIENT_ID
    const clientSecret = process.env.BEGGINS_GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.BEGGINS_GOOGLE_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("Missing Beggins Google OAuth environment variables")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?error=config_missing`
      )
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        code_verifier: codeVerifier,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("Token exchange failed:", errorText)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?error=token_exchange_failed`
      )
    }

    const tokenData = await tokenResponse.json()
    console.log("Beggins Google OAuth tokens received:", {
      access_token: tokenData.access_token ? "present" : "missing",
      refresh_token: tokenData.refresh_token ? "present" : "missing",
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
    })

    // Get user info to identify the user
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      console.error("Failed to get user info")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?error=user_info_failed`
      )
    }

    const userInfo = await userInfoResponse.json()
    console.log("Beggins user info:", userInfo)

    // Store tokens in database with Beggins tenant identifier
    const tokenStoreResult = await oauthTokens.store(
      userInfo.email,
      "century21-beggins", // Beggins tenant ID
      tokenData.access_token,
      tokenData.refresh_token,
      tokenData.expires_in,
      tokenData.scope
    )

    if (!tokenStoreResult.success) {
      console.error("Failed to store Beggins OAuth tokens:", tokenStoreResult.error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?error=token_storage_failed`
      )
    }

    console.log("Beggins OAuth tokens stored successfully for user:", userInfo.email)

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?success=oauth_completed&email=${encodeURIComponent(userInfo.email)}`
    )
  } catch (error) {
    console.error("Error in Beggins Google OAuth callback:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/beggins-home/email-integration?error=callback_error`
    )
  }
}
