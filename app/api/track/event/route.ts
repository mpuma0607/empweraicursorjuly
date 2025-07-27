import { type NextRequest, NextResponse } from "next/server"
import { trackEvent } from "@/lib/tracking"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, eventType, eventData } = await request.json()

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "Session ID and event type are required" }, { status: 400 })
    }

    await trackEvent(sessionId, eventType, eventData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
