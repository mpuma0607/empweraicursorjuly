import { type NextRequest, NextResponse } from "next/server"
import { getUserAnalytics } from "@/lib/tracking"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    const userAnalytics = await getUserAnalytics(days)

    return NextResponse.json(userAnalytics)
  } catch (error) {
    console.error("Error getting user analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
