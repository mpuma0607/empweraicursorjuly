import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.RAPIDAPI_ZILLOW_KEY

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "RAPIDAPI_ZILLOW_KEY not found in environment variables",
      })
    }

    // Test multiple address formats
    const testCases = [
      {
        name: "Original Format",
        street: encodeURIComponent("28702 falling leaves way"),
        citystatezip: encodeURIComponent("wesley chapel fl 33543"),
      },
      {
        name: "Different Address",
        street: encodeURIComponent("123 main street"),
        citystatezip: encodeURIComponent("miami fl 33101"),
      },
      {
        name: "Simplified Format",
        street: encodeURIComponent("123 Main St"),
        citystatezip: encodeURIComponent("Miami FL 33101"),
      },
    ]

    const results = []

    for (const testCase of testCases) {
      const testUrl = `https://zillow-working-api.p.rapidapi.com/skip/byaddress?street=${testCase.street}&citystatezip=${testCase.citystatezip}&page=1`

      try {
        const response = await fetch(testUrl, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "zillow-working-api.p.rapidapi.com",
          },
        })

        const responseText = await response.text()
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch {
          responseData = responseText
        }

        results.push({
          testCase: testCase.name,
          success: response.ok,
          status: response.status,
          url: testUrl,
          data: responseData,
        })
      } catch (error) {
        results.push({
          testCase: testCase.name,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
