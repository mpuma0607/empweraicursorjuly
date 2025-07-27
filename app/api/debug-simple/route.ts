import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("=== Simple Debug Endpoint ===")

  try {
    const url = new URL(request.url)
    const testType = url.searchParams.get("type") || "basic"

    console.log("Test type:", testType)

    const results = {
      success: true,
      timestamp: new Date().toISOString(),
      testType,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL ? "true" : "false",
        hasNextPublicBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        hasBrightDataEndpoint: !!process.env.BRIGHT_DATA_PUPPETEER_ENDPOINT,
        hasBrightDataUsername: !!process.env.BRIGHT_DATA_USERNAME,
        hasBrightDataPassword: !!process.env.BRIGHT_DATA_PASSWORD,
        hasScraperApiKey: !!process.env.SCRAPERAPI_KEY,
      },
      tests: [],
    }

    // Only run tests if requested
    if (testType === "fetch" || testType === "all") {
      console.log("Testing basic fetch...")

      try {
        const testResponse = await fetch("https://httpbin.org/json", {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Debug/1.0)",
          },
        })

        const testData = await testResponse.text()

        results.tests.push({
          name: "basic-fetch",
          success: testResponse.ok,
          status: testResponse.status,
          dataLength: testData.length,
          preview: testData.substring(0, 100),
        })
      } catch (fetchError) {
        results.tests.push({
          name: "basic-fetch",
          success: false,
          error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        })
      }
    }

    if (testType === "truepeoplesearch" || testType === "all") {
      console.log("Testing TruePeopleSearch...")

      try {
        const tpsUrl = "https://www.truepeoplesearch.com/results?name=John&lastname=Smith"

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const tpsResponse = await fetch(tpsUrl, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const tpsData = await tpsResponse.text()

        results.tests.push({
          name: "truepeoplesearch",
          success: tpsResponse.ok,
          status: tpsResponse.status,
          dataLength: tpsData.length,
          blocked: tpsData.includes("blocked") || tpsData.includes("captcha"),
          preview: tpsData.substring(0, 200),
        })
      } catch (tpsError) {
        results.tests.push({
          name: "truepeoplesearch",
          success: false,
          error: tpsError instanceof Error ? tpsError.message : String(tpsError),
        })
      }
    }

    console.log("Debug results:", JSON.stringify(results, null, 2))

    return NextResponse.json(results)
  } catch (error) {
    console.error("Debug endpoint error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
