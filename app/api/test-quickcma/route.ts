import { NextResponse } from "next/server"
import { analyzeComparables } from "@/components/actions"

export async function GET() {
  return NextResponse.json({ 
    message: "Use POST method with address in body",
    example: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { address: "123 Main St, New York, NY 10001" }
    }
  })
}

export async function POST(request: Request) {
  try {
    const { address } = await request.json()
    
    if (!address) {
      return NextResponse.json({ 
        error: "Address is required",
        testAddress: "123 Main St, New York, NY 10001"
      })
    }

    console.log("=== QuickCMA Test ===")
    console.log("Testing address:", address)
    console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
    console.log("RAPIDAPI_ZILLOW_KEY exists:", !!process.env.RAPIDAPI_ZILLOW_KEY)

    // Test the actual analyzeComparables function
    const result = await analyzeComparables(address)

    return NextResponse.json({
      success: true,
      message: "QuickCMA test completed",
      result: {
        hasError: 'error' in result ? result.error : false,
        errorMessage: 'message' in result ? result.message : null,
        hasAnalysisText: !!result.analysisText,
        hasComparables: result.comparableData?.comparables?.length > 0,
        totalComparables: result.comparableData?.totalComparables || 0,
        address: result.address
      },
      debug: {
        openaiKeyExists: !!process.env.OPENAI_API_KEY,
        zillowKeyExists: !!process.env.RAPIDAPI_ZILLOW_KEY,
        databaseUrlExists: !!process.env.DATABASE_URL
      }
    })

  } catch (error) {
    console.error("QuickCMA Test Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      debug: {
        openaiKeyExists: !!process.env.OPENAI_API_KEY,
        zillowKeyExists: !!process.env.RAPIDAPI_ZILLOW_KEY,
        databaseUrlExists: !!process.env.DATABASE_URL
      }
    }, { status: 500 })
  }
} 