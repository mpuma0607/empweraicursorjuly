import { type NextRequest, NextResponse } from "next/server"
import { getUserDetailAnalytics } from "@/lib/tracking"

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")
    const userEmail = decodeURIComponent(params.email)

    const userDetailAnalytics = await getUserDetailAnalytics(userEmail, days)

    return NextResponse.json(userDetailAnalytics)
  } catch (error) {
    console.error("Error getting user detail analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
