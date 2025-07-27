import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const email = searchParams.get("email")
    const name = searchParams.get("name")
    const brokerage = searchParams.get("brokerage")
    const market = searchParams.get("market")
    const remember = searchParams.get("remember") === "true"

    console.log("SSO Request received:", {
      username,
      email,
      name,
      brokerage,
      market,
      remember,
    })

    if (!email) {
      return NextResponse.json({ error: "Email is required for SSO" }, { status: 400 })
    }

    const apiKey = process.env.WEBSITE_TOOLBOX_SSO_API_KEY
    const forumDomain = "forum.thenextlevelu.com"

    if (!apiKey) {
      console.error("SSO API key not configured")
      return NextResponse.json({ error: "SSO API key not configured" }, { status: 500 })
    }

    // For existing users like Michael, use their known username
    // For new users, use email as username (Website Toolbox supports this)
    let ssoUsername = username || email

    // Special case: if this is Michael's email, use his existing username
    if (email === "mikepuma@c21be.com") {
      ssoUsername = "nextlevelu"
    }

    console.log("Using username for SSO:", ssoUsername)

    // Build SSO parameters exactly as per Website Toolbox documentation
    const ssoParams = new URLSearchParams({
      type: "json",
      apikey: apiKey,
      user: ssoUsername,
      email: email, // This is the KEY parameter that auto-creates accounts!
    })

    // Add optional parameters
    if (name) {
      ssoParams.append("name", encodeURIComponent(name))
    }

    // Add custom fields if provided (these might need to be configured in Website Toolbox)
    if (brokerage) {
      ssoParams.append("custom1", encodeURIComponent(brokerage))
    }
    if (market) {
      ssoParams.append("custom2", encodeURIComponent(market))
    }

    const ssoUrl = `https://${forumDomain}/register/setauthtoken?${ssoParams.toString()}`

    console.log("Making SSO request for user:", ssoUsername)
    console.log("SSO URL (sanitized):", ssoUrl.replace(apiKey, "***API_KEY***"))

    // Make the SSO request
    const response = await fetch(ssoUrl, {
      method: "GET",
      headers: {
        "User-Agent": "NextLevelU-Portal/1.0",
        Accept: "application/json",
      },
    })

    console.log("Website Toolbox response status:", response.status)

    const responseText = await response.text()
    console.log("Website Toolbox raw response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse Website Toolbox response as JSON:", e)

      // Check if it's an HTML error page
      if (responseText.includes("<html") || responseText.includes("<!DOCTYPE")) {
        return NextResponse.json(
          {
            error: "Website Toolbox configuration issue - returned HTML instead of JSON",
            details: "Please check your forum SSO settings",
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "Invalid response from Website Toolbox",
          details: responseText.substring(0, 200),
        },
        { status: 500 },
      )
    }

    // Check for errors in the response
    if (data.message) {
      console.error("Website Toolbox API Error:", data.message)
      return NextResponse.json(
        {
          error: data.message,
          details: "Website Toolbox SSO API returned an error",
        },
        { status: 400 },
      )
    }

    // Check for successful response
    if (!data.authtoken) {
      console.error("No auth token in response:", data)
      return NextResponse.json(
        {
          error: "No authentication token received",
          details: "Website Toolbox did not return an auth token",
        },
        { status: 500 },
      )
    }

    // Success!
    console.log("SSO successful for user:", ssoUsername)
    console.log("Auth token generated:", !!data.authtoken)
    console.log("User ID:", data.userid)

    return NextResponse.json({
      success: true,
      authToken: data.authtoken,
      userId: data.userid,
      forumDomain: forumDomain,
      user: ssoUsername,
      autoCreated: true, // Account was auto-created if it didn't exist
    })
  } catch (error) {
    console.error("SSO API Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
