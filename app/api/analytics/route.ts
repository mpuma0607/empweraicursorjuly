import { type NextRequest, NextResponse } from "next/server"
import { getAnalytics } from "@/lib/tracking"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    const analytics = await getAnalytics(days)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error getting analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
