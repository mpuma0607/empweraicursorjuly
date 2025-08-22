import { NextRequest, NextResponse } from "next/server"
import { getUserBrandingProfile } from "@/app/profile/branding/actions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const tenantId = searchParams.get("tenantId")

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: "Missing userId or tenantId" },
        { status: 400 }
      )
    }

    const profile = await getUserBrandingProfile(userId, tenantId)
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching user branding profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}
