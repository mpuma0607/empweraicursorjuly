import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== Debug Comparable Homes API ===")

    const apiKey = process.env.RAPIDAPI_ZILLOW_KEY

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "RAPIDAPI_ZILLOW_KEY not found in environment variables",
        envVars: {
          hasRapidApiKey: !!process.env.RAPIDAPI_ZILLOW_KEY,
          hasOpenAiKey: !!process.env.OPENAI_API_KEY,
        },
      })
    }

    // Test with the exact same address and format from your working test
    const testAddress = "28702%20falling%20leaves%20way%20zephyr%20hills%20florida%2033543"
    const testUrl = `https://zillow-working-api.p.rapidapi.com/comparable_homes?byaddress=${testAddress}`

    console.log("Testing URL:", testUrl)
    console.log("API Key exists:", !!apiKey)

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "zillow-working-api.p.rapidapi.com",
      },
    })

    console.log("Response status:", response.status)

    const responseText = await response.text()
    console.log("Response length:", responseText.length)

    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (parseError) {
      responseData = { rawText: responseText, parseError: parseError.message }
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: testUrl,
      data: responseData,
      rawText: responseText.substring(0, 1000),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    })
  }
}
