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

    // Test with the correct endpoint format
    const testStreet = encodeURIComponent("28702 falling leaves way")
    const testCityStateZip = encodeURIComponent("wesley chapel fl 33543")
    const testUrl = `https://zillow-working-api.p.rapidapi.com/skip/byaddress?street=${testStreet}&citystatezip=${testCityStateZip}&page=1`

    console.log("Testing URL:", testUrl)

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

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: testUrl,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
