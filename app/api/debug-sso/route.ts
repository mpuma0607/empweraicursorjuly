import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== SSO DEBUG START ===")

    // Check environment variables
    const apiKey = process.env.WEBSITE_TOOLBOX_SSO_API_KEY
    const forumDomain = "forum.thenextlevelu.com"

    console.log("API Key exists:", !!apiKey)
    console.log("API Key first 10 chars:", apiKey?.substring(0, 10) + "...")
    console.log("Forum Domain:", forumDomain)

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "SSO API key not configured",
          debug: {
            hasApiKey: false,
            forumDomain,
            envVars: Object.keys(process.env).filter((key) => key.includes("WEBSITE")),
          },
        },
        { status: 500 },
      )
    }

    // Test with realistic MemberSpace user data
    const testUser = {
      user: "john.doe@example.com", // Using email as username
      email: "john.doe@example.com",
      name: "John Doe",
      brokerage: "Century 21 Test",
      market: "Miami, FL",
    }

    // Build query parameters for Website Toolbox
    const ssoParams = new URLSearchParams({
      type: "json",
      apikey: apiKey,
      user: testUser.user,
      email: testUser.email,
      name: testUser.name,
    })

    const fullUrl = `https://${forumDomain}/register/setauthtoken?${ssoParams.toString()}`
    console.log("Full SSO URL:", fullUrl.replace(apiKey, "***API_KEY***"))

    // Make request to Website Toolbox SSO API
    console.log("Making SSO request...")
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "User-Agent": "NextLevelU-Portal/1.0",
        Accept: "application/json",
      },
    })

    console.log("Response status:", response.status)
    console.log("Response status text:", response.statusText)

    const responseText = await response.text()
    console.log("Raw response length:", responseText.length)
    console.log("Raw response:", responseText.substring(0, 1000))

    let data
    try {
      data = JSON.parse(responseText)
      console.log("Parsed JSON:", data)
    } catch (e) {
      console.log("Failed to parse JSON:", e)

      // Check if it's an HTML error page
      if (responseText.includes("<html") || responseText.includes("<!DOCTYPE")) {
        return NextResponse.json(
          {
            error: "Website Toolbox returned HTML instead of JSON - possible configuration issue",
            debug: {
              status: response.status,
              isHtml: true,
              responsePreview: responseText.substring(0, 500),
              url: fullUrl.replace(apiKey, "***API_KEY***"),
              possibleIssues: [
                "API key might be incorrect",
                "Forum domain might be wrong",
                "SSO might not be enabled on the forum",
                "API endpoint might have changed",
              ],
            },
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          error: "Invalid JSON response from Website Toolbox",
          debug: {
            status: response.status,
            rawResponse: responseText.substring(0, 500),
            url: fullUrl.replace(apiKey, "***API_KEY***"),
          },
        },
        { status: 400 },
      )
    }

    // Check for common Website Toolbox error responses
    if (data.error || data.message) {
      console.log("Website Toolbox returned error:", data)
      return NextResponse.json(
        {
          error: "Website Toolbox API Error",
          websiteToolboxError: data.error || data.message,
          debug: {
            hasApiKey: true,
            forumDomain,
            requestUrl: fullUrl.replace(apiKey, "***API_KEY***"),
            responseStatus: response.status,
            responseData: data,
            troubleshooting: [
              "Check if SSO is enabled in Website Toolbox admin",
              "Verify API key permissions",
              "Confirm forum domain is correct",
              "Check if user already exists",
            ],
          },
        },
        { status: 400 },
      )
    }

    console.log("=== SSO DEBUG SUCCESS ===")

    return NextResponse.json({
      success: true,
      message: "SSO test successful!",
      debug: {
        hasApiKey: true,
        forumDomain,
        requestUrl: fullUrl.replace(apiKey, "***API_KEY***"),
        responseStatus: response.status,
        responseData: data,
      },
      ssoData: {
        authToken: data.authtoken,
        userId: data.userid,
        forumDomain,
      },
    })
  } catch (error) {
    console.error("SSO Debug Error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
