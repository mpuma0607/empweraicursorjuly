import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  console.log("=== TEST ZILLOW API ENDPOINT STARTED ===")

  try {
    // Check if API key exists
    const apiKey = process.env.X_RAPIDAPI_KEY

    console.log("API Key exists:", !!apiKey)
    console.log("API Key length:", apiKey?.length || 0)

    if (!apiKey) {
      console.log("API Key missing")
      return NextResponse.json(
        {
          error: "X_RAPIDAPI_KEY not found in environment variables",
          available_vars: Object.keys(process.env)
            .filter((key) => !key.includes("SECRET") && !key.includes("KEY"))
            .map((key) => key),
        },
        { status: 400 },
      )
    }

    // Test a simple API call
    const testUrl = "https://zillow-working-api.p.rapidapi.com/autocomplete?location=Miami,%20FL"

    console.log("Testing API with URL:", testUrl)
    console.log("API Key (first 5 chars):", apiKey.substring(0, 5) + "...")

    try {
      const response = await fetch(testUrl, {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "zillow-working-api.p.rapidapi.com",
          "X-RapidAPI-Key": apiKey,
        },
        // Remove cache: "no-store" to fix deployment issue
      })

      console.log("Response status:", response.status)

      // Get response headers safely
      const headers = {}
      try {
        response.headers.forEach((value, key) => {
          headers[key] = value
        })
        console.log("Response headers:", headers)
      } catch (headerError) {
        console.error("Error reading headers:", headerError)
      }

      if (!response.ok) {
        let errorText = ""
        try {
          errorText = await response.text()
          console.log("Error response body:", errorText)
        } catch (textError) {
          console.error("Error reading response text:", textError)
          errorText = "Could not read error response"
        }

        return NextResponse.json(
          {
            error: `API call failed with status: ${response.status}`,
            status: response.status,
            statusText: response.statusText,
            errorBody: errorText,
            headers: headers,
          },
          { status: 500 },
        )
      }

      let data
      try {
        data = await response.json()
        console.log("Success response (first 100 chars):", JSON.stringify(data).substring(0, 100) + "...")
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError)
        return NextResponse.json(
          {
            error: "Failed to parse API response as JSON",
            message: jsonError instanceof Error ? jsonError.message : "Unknown JSON parsing error",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        status: response.status,
        data: data,
        message: "API connection successful!",
      })
    } catch (fetchError) {
      console.error("Fetch error details:", fetchError)
      return NextResponse.json(
        {
          error: "Error during API fetch",
          message: fetchError instanceof Error ? fetchError.message : "Unknown fetch error",
          stack: fetchError instanceof Error ? fetchError.stack : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Global error:", error)
    return NextResponse.json(
      {
        error: "Unhandled exception",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  } finally {
    console.log("=== TEST ZILLOW API ENDPOINT COMPLETED ===")
  }
}
