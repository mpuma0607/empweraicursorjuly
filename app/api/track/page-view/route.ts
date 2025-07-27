import { type NextRequest, NextResponse } from "next/server"
import { createOrUpdateSession, trackPageView } from "@/lib/tracking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, pagePath, pageTitle, referrer, userAgent } = body

    if (!sessionId || !pagePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get IP address from request
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || request.ip || "unknown"

    // Create or update session
    await createOrUpdateSession(sessionId, userAgent, ipAddress)

    // Track page view
    await trackPageView(sessionId, pagePath, pageTitle, referrer)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
