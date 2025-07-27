import { type NextRequest, NextResponse } from "next/server"

// Replace with your actual forum domain
const FORUM_DOMAIN = "creativehub-uxdhuqrk.websitetoolbox.com"

export async function GET(request: NextRequest) {
  try {
    // Get auth token from query params
    const searchParams = request.nextUrl.searchParams
    const authToken = searchParams.get("authtoken")
    const redirectUrl = searchParams.get("redirect") || "/"

    // Validate required parameters
    if (!authToken) {
      return NextResponse.json({ error: "Auth token is required" }, { status: 400 })
    }

    // Construct the logout URL
    const logoutUrl = `https://${FORUM_DOMAIN}/register/logout?authtoken=${authToken}`

    // Make the request to Website Toolbox logout API
    await fetch(logoutUrl, {
      method: "GET",
    })

    // Return success
    return NextResponse.json({ success: true, redirect: redirectUrl })
  } catch (error) {
    console.error("Logout API Error:", error)
    return NextResponse.json({ error: "Failed to logout from community" }, { status: 500 })
  }
}
