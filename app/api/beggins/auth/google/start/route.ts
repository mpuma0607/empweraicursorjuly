import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.BEGGINS_GOOGLE_CLIENT_ID
    const redirectUri = process.env.BEGGINS_GOOGLE_REDIRECT_URI

    if (!clientId || !redirectUri) {
      console.error("Missing Beggins Google OAuth environment variables")
      return NextResponse.json(
        { error: "OAuth configuration missing" },
        { status: 500 }
      )
    }

    // Generate PKCE challenge
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    // Store code verifier in session or temporary storage
    // For now, we'll use a simple approach - in production you might want to use a more secure method
    const state = Math.random().toString(36).substring(7)
    
    // Store the code verifier and state (you might want to use a more secure method)
    // For now, we'll pass them as URL parameters to the callback
    
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email")
    authUrl.searchParams.set("code_challenge", codeChallenge)
    authUrl.searchParams.set("code_challenge_method", "S256")
    authUrl.searchParams.set("state", state)
    authUrl.searchParams.set("access_type", "offline")
    authUrl.searchParams.set("prompt", "consent")

    console.log("Beggins Google OAuth URL generated:", authUrl.toString())

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error("Error starting Beggins Google OAuth:", error)
    return NextResponse.json(
      { error: "Failed to start OAuth flow" },
      { status: 500 }
    )
  }
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return base64URLEncode(new Uint8Array(digest))
}

function base64URLEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}
