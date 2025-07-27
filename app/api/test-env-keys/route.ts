import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== ENVIRONMENT VARIABLE CHECK ===")

    // Check all possible variations
    const possibleKeys = ["RAPIDAPI_ZILLOW_KEY", "ZILLOW_API_KEY", "RAPIDAPI_KEY", "X_RAPIDAPI_KEY", "RAPID_API_KEY"]

    const keyStatus = {}
    let workingKey = null

    for (const keyName of possibleKeys) {
      const keyValue = process.env[keyName]
      keyStatus[keyName] = {
        exists: !!keyValue,
        length: keyValue?.length || 0,
        preview: keyValue ? keyValue.substring(0, 10) + "..." : "none",
      }

      if (keyValue && !workingKey) {
        workingKey = keyValue
      }
    }

    console.log("Key Status:", keyStatus)

    if (!workingKey) {
      return NextResponse.json({
        success: false,
        error: "No RapidAPI key found in any expected environment variable",
        checkedVariables: possibleKeys,
        keyStatus,
        allEnvVars: Object.keys(process.env).filter(
          (key) => key.includes("API") || key.includes("RAPID") || key.includes("ZILLOW"),
        ),
        suggestion: "Add RAPIDAPI_ZILLOW_KEY to your Vercel environment variables",
      })
    }

    // Test with the working key
    const searchPrompt = "homes for sale in Tampa FL"
    const testUrl = `https://zillow-working-api.p.rapidapi.com/search/byaiprompt?ai_search_prompt=${encodeURIComponent(searchPrompt)}&page=1&sortOrder=Homes_for_you`

    console.log("Test URL:", testUrl)
    console.log("Using key:", workingKey.substring(0, 10) + "...")

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": workingKey,
        "x-rapidapi-host": "zillow-working-api.p.rapidapi.com",
      },
    })

    console.log("Response Status:", response.status)
    console.log("Response OK:", response.ok)

    let responseData = null
    let responseText = ""

    try {
      responseText = await response.text()
      console.log("Raw Response (first 500 chars):", responseText.substring(0, 500))
      responseData = JSON.parse(responseText)
    } catch (parseError) {
      console.log("JSON Parse Error:", parseError)
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      keyStatus,
      workingKeyFound: !!workingKey,
      test: {
        url: testUrl,
        searchPrompt,
      },
      response: {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        rawText: responseText.substring(0, 1000),
      },
    })
  } catch (error) {
    console.error("Test failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
