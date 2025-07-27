import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const email = searchParams.get("email")
    const name = searchParams.get("name")
    const brokerage = searchParams.get("brokerage")
    const market = searchParams.get("market")

    console.log("SSO Register Request received:", {
      username,
      email,
      name,
      brokerage,
      market,
    })

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const apiKey = process.env.WEBSITE_TOOLBOX_SSO_API_KEY
    const forumDomain = "forum.thenextlevelu.com"

    if (!apiKey) {
      console.error("SSO API key not configured")
      return NextResponse.json({ error: "SSO API key not configured" }, { status: 500 })
    }

    // Create a clean username from email (remove domain and special chars)
    const cleanUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "")
    const displayName = name || `${cleanUsername}`

    console.log("Attempting to register/login user:", {
      email,
      username: cleanUsername,
      displayName,
    })

    // Step 1: Try to register the user first
    const registerParams = new URLSearchParams({
      type: "json",
      apikey: apiKey,
      action: "register",
      username: cleanUsername,
      email: email,
      name: displayName,
      password: Math.random().toString(36).substring(2, 15), // Random password
      autoactivate: "1", // Auto-activate the account
    })

    // Add custom fields if provided
    if (brokerage) registerParams.append("custom1", brokerage)
    if (market) registerParams.append("custom2", market)

    const registerUrl = `https://${forumDomain}/register/api?${registerParams.toString()}`

    console.log("Registration URL (sanitized):", registerUrl.replace(apiKey, "***API_KEY***"))

    // Try to register the user
    const registerResponse = await fetch(registerUrl, {
      method: "GET",
      headers: {
        "User-Agent": "NextLevelU-Portal/1.0",
        Accept: "application/json",
      },
    })

    const registerText = await registerResponse.text()
    console.log("Registration response:", registerText)

    let registerData
    try {
      registerData = JSON.parse(registerText)
    } catch (e) {
      console.log("Registration response not JSON, might be HTML error")
    }

    // Step 2: Now try to get auth token (whether registration succeeded or user already exists)
    const authParams = new URLSearchParams({
      type: "json",
      apikey: apiKey,
      user: cleanUsername,
      email: email,
      name: displayName,
    })

    if (brokerage) authParams.append("custom1", brokerage)
    if (market) authParams.append("custom2", market)

    const authUrl = `https://${forumDomain}/register/setauthtoken?${authParams.toString()}`

    console.log("Auth URL (sanitized):", authUrl.replace(apiKey, "***API_KEY***"))

    const authResponse = await fetch(authUrl, {
      method: "GET",
      headers: {
        "User-Agent": "NextLevelU-Portal/1.0",
        Accept: "application/json",
      },
    })

    const authText = await authResponse.text()
    console.log("Auth response:", authText)

    let authData
    try {
      authData = JSON.parse(authText)
    } catch (e) {
      console.error("Failed to parse auth response as JSON:", e)
      return NextResponse.json(
        {
          error: "Invalid response from Website Toolbox",
          details: authText.substring(0, 200),
          registrationAttempt: registerData || "Registration response not JSON",
        },
        { status: 500 },
      )
    }

    // Check for auth errors
    if (authData.error || authData.message) {
      console.error("Website Toolbox Auth Error:", authData)
      return NextResponse.json(
        {
          error: authData.error || authData.message,
          details: "Auth failed after registration attempt",
          registrationAttempt: registerData || "Registration attempted",
        },
        { status: 400 },
      )
    }

    // Success!
    console.log("SSO successful for user:", cleanUsername)
    console.log("Auth token generated:", !!authData.authtoken)

    return NextResponse.json({
      success: true,
      authToken: authData.authtoken,
      userId: authData.userid,
      forumDomain: forumDomain,
      user: cleanUsername,
      registrationAttempt: registerData || "Registration attempted",
      originalEmail: email,
    })
  } catch (error) {
    console.error("SSO Register API Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
