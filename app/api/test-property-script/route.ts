import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Property Script API is working",
    testData: {
      propertyAddress: "123 Main Street, Tampa, FL 33543",
      ownerNames: ["John Smith", "Jane Smith"],
      propertyType: "Single Family Home",
      estimatedValue: "$350,000",
      propertyDetails: "3 bed, 2 bath, 1,500 sq ft",
      deliveryMethod: "phone",
      prospectType: "fsbo",
      tonality: "Professional & Authoritative",
      agentName: "Test Agent",
      brokerageName: "Test Brokerage",
      agentEmail: "test@example.com"
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to the actual property script API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/generate-property-script`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Test property script error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to test property script generation"
    }, { status: 500 })
  }
} 