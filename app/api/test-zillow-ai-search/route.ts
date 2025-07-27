import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== ZILLOW AI SEARCH API DEBUG TEST ===")

    const apiKey = process.env.ZILLOW_API_KEY
    console.log("RapidAPI Key (ZILLOW_API_KEY) exists:", !!apiKey)
    console.log("RapidAPI Key length:", apiKey?.length || 0)
    console.log("RapidAPI Key first 10 chars:", apiKey?.substring(0, 10) + "...")

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "ZILLOW_API_KEY (RapidAPI key) not found in environment variables",
        debug: {
          envVars: Object.keys(process.env).filter((key) => key.includes("ZILLOW") || key.includes("RAPID")),
        },
      })
    }

    // Test the AI search endpoint
    console.log("Testing AI search endpoint...")
    const testPrompt = "Find all homes listed for sale within 5 miles of Tampa, FL"
    const testUrl = "https://zillow-com1.p.rapidapi.com/search/by-ai-prompt"

    const response = await fetch(testUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com",
        "X-RapidAPI-Key": apiKey,
      },
      body: JSON.stringify({
        prompt: testPrompt,
      }),
    })

    console.log("Response Status:", response.status)
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()))

    let responseData = null
    let responseError = null
    let rawResponse = ""

    try {
      rawResponse = await response.text()
      console.log("Raw Response (first 1000 chars):", rawResponse.substring(0, 1000))
      responseData = JSON.parse(rawResponse)
    } catch (parseError) {
      responseError = "Failed to parse JSON: " + parseError
      console.log("Parse Error:", parseError)
    }

    // Analyze the response structure
    const analysis = {
      hasResults: false,
      resultCount: 0,
      dataStructure: "unknown",
      sampleProperty: null,
    }

    if (responseData) {
      if (responseData.results && Array.isArray(responseData.results)) {
        analysis.hasResults = true
        analysis.resultCount = responseData.results.length
        analysis.dataStructure = "results array"
        analysis.sampleProperty = responseData.results[0]
      } else if (responseData.listings && Array.isArray(responseData.listings)) {
        analysis.hasResults = true
        analysis.resultCount = responseData.listings.length
        analysis.dataStructure = "listings array"
        analysis.sampleProperty = responseData.listings[0]
      } else if (responseData.properties && Array.isArray(responseData.properties)) {
        analysis.hasResults = true
        analysis.resultCount = responseData.properties.length
        analysis.dataStructure = "properties array"
        analysis.sampleProperty = responseData.properties[0]
      } else if (Array.isArray(responseData)) {
        analysis.hasResults = true
        analysis.resultCount = responseData.length
        analysis.dataStructure = "direct array"
        analysis.sampleProperty = responseData[0]
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      apiKeyStatus: {
        exists: !!apiKey,
        length: apiKey?.length || 0,
        preview: apiKey?.substring(0, 10) + "..." + apiKey?.slice(-5),
        note: "This should be your RapidAPI key for Zillow access",
      },
      testRequest: {
        url: testUrl,
        method: "POST",
        prompt: testPrompt,
      },
      response: {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        data: responseData,
        error: responseError,
        rawResponse: rawResponse.substring(0, 2000), // First 2000 chars
      },
      analysis,
      recommendations: [
        "Check if your RapidAPI subscription for Zillow is active",
        "Verify you have credits remaining",
        "Test with different prompt variations",
        "Check the response structure to understand data format",
      ],
    })
  } catch (error) {
    console.error("Debug test failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
