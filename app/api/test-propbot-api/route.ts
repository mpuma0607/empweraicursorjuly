import { NextResponse } from "next/server"

export async function GET() {
  console.log("=== TEST PROPBOT API ENDPOINT STARTED ===")

  try {
    // Check for API key with multiple possible names
    const apiKey = process.env.RAPIDAPI_ZILLOW_KEY || process.env.X_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY
    
    if (!apiKey) {
      console.error("No API key found. Available env vars:", Object.keys(process.env).filter(key => key.includes('RAPID')))
      return NextResponse.json({
        error: "Zillow API key not configured",
        availableVars: Object.keys(process.env).filter(key => key.includes('RAPID'))
      }, { status: 400 })
    }

    console.log("Using API key (first 5 chars):", apiKey.substring(0, 5) + "...")

    // First test a simple endpoint to verify connectivity
    console.log("Testing basic connectivity...")
    const testUrl = "https://zillow-working-api.p.rapidapi.com/autocomplete?location=Miami,%20FL"
    
    const basicResponse = await fetch(testUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "zillow-working-api.p.rapidapi.com",
      },
    })

    console.log("Basic test response status:", basicResponse.status)
    
    if (!basicResponse.ok) {
      const errorText = await basicResponse.text()
      console.error("Basic test failed:", errorText)
      return NextResponse.json({
        error: `Basic API test failed with status: ${basicResponse.status}`,
        status: basicResponse.status,
        statusText: basicResponse.statusText,
        errorBody: errorText,
      }, { status: 500 })
    }

    console.log("Basic connectivity test passed!")

    // Now test the PropBot specific endpoint
    console.log("Testing PropBot specific endpoint...")
    const params = new URLSearchParams({
      ai_search_prompt: "3 bedroom homes in Tampa under $400,000",
      page: "1",
      sortOrder: "Homes_for_you",
    })

    const apiUrl = `https://zillow-working-api.p.rapidapi.com/search/by-ai-prompt?${params.toString()}`
    console.log("Testing API with URL:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "zillow-working-api.p.rapidapi.com",
      },
    })

    console.log("PropBot API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("PropBot API call failed:", errorText)
      return NextResponse.json({
        error: `PropBot API call failed with status: ${response.status}`,
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
      }, { status: 500 })
    }

    const data = await response.json()
    console.log("Success response structure:", Object.keys(data))
    console.log("Response sample (first 500 chars):", JSON.stringify(data).substring(0, 500))

    // Check for properties in different possible locations
    let propertyCount = 0
    let properties = []
    
    if (data.searchResults && Array.isArray(data.searchResults)) {
      properties = data.searchResults
      propertyCount = properties.length
      console.log(`Found ${propertyCount} properties in searchResults`)
    } else if (data.results && Array.isArray(data.results)) {
      properties = data.results
      propertyCount = properties.length
      console.log(`Found ${propertyCount} properties in results`)
    } else if (Array.isArray(data)) {
      properties = data
      propertyCount = properties.length
      console.log(`Found ${propertyCount} properties in root array`)
    } else {
      console.log("No properties found in expected locations")
      console.log("Full response structure:", JSON.stringify(data, null, 2))
    }

    return NextResponse.json({
      success: true,
      status: response.status,
      propertyCount,
      responseStructure: Object.keys(data),
      sampleProperty: properties.length > 0 ? properties[0] : null,
      message: `Found ${propertyCount} properties in API response`,
    })

  } catch (error) {
    console.error("Global error:", error)
    return NextResponse.json({
      error: "Unhandled exception",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  } finally {
    console.log("=== TEST PROPBOT API ENDPOINT COMPLETED ===")
  }
} 