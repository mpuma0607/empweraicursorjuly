import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== SSO DEBUG STATUS CHECK ===")

    // Check environment variables
    const apiKey = process.env.WEBSITE_TOOLBOX_SSO_API_KEY
    const forumDomain = "forum.thenextlevelu.com"

    const envStatus = {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      forumDomain: forumDomain,
      timestamp: new Date().toISOString(),
    }

    console.log("Environment Status:", envStatus)

    // Test basic connectivity to forum
    let forumConnectivity = null
    try {
      const forumResponse = await fetch(`https://${forumDomain}`, {
        method: "HEAD",
        timeout: 10000,
      })
      forumConnectivity = {
        status: forumResponse.status,
        accessible: forumResponse.ok,
        headers: Object.fromEntries(forumResponse.headers.entries()),
      }
    } catch (error) {
      forumConnectivity = {
        error: error instanceof Error ? error.message : String(error),
        accessible: false,
      }
    }

    // Test SSO API endpoint
    let ssoApiTest = null
    if (apiKey) {
      try {
        const testUrl = `https://${forumDomain}/register/setauthtoken?type=json&apikey=${apiKey}&user=test@example.com`
        const ssoResponse = await fetch(testUrl, {
          method: "GET",
          headers: {
            "User-Agent": "NextLevelU-Portal/1.0",
            Accept: "application/json",
          },
          timeout: 10000,
        })

        const responseText = await ssoResponse.text()

        ssoApiTest = {
          status: ssoResponse.status,
          ok: ssoResponse.ok,
          responseLength: responseText.length,
          isJson: responseText.startsWith("{") || responseText.startsWith("["),
          isHtml: responseText.includes("<html") || responseText.includes("<!DOCTYPE"),
          preview: responseText.substring(0, 200),
        }

        // Try to parse as JSON
        try {
          const jsonData = JSON.parse(responseText)
          ssoApiTest.jsonData = jsonData
        } catch (e) {
          ssoApiTest.jsonParseError = e instanceof Error ? e.message : String(e)
        }
      } catch (error) {
        ssoApiTest = {
          error: error instanceof Error ? error.message : String(error),
          failed: true,
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envStatus,
      forumConnectivity,
      ssoApiTest,
      recommendations: [
        !apiKey ? "❌ SSO API Key is missing" : "✅ SSO API Key is configured",
        !forumConnectivity?.accessible ? "❌ Forum is not accessible" : "✅ Forum is accessible",
        ssoApiTest?.failed
          ? "❌ SSO API test failed"
          : ssoApiTest?.ok
            ? "✅ SSO API is responding"
            : "⚠️ SSO API response unclear",
      ],
    })
  } catch (error) {
    console.error("SSO Debug Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
