import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      )
    }

    console.log("Checking Beggins Google OAuth status for email:", email)

    // Check if user has valid OAuth tokens for Beggins tenant
    const hasValidTokens = await oauthTokens.hasValidTokens(email, "century21-beggins")

    if (hasValidTokens.success && hasValidTokens.hasValid) {
      console.log("Beggins user has valid OAuth tokens:", email)
      
      // Update last used timestamp
      await oauthTokens.updateLastUsed(email, "century21-beggins")
      
      return NextResponse.json({
        status: {
          connected: true,
          provider: "google",
          tenant: "century21-beggins",
          lastChecked: new Date().toISOString(),
        },
      })
    } else {
      console.log("Beggins user has no valid OAuth tokens:", email)
      return NextResponse.json({
        status: {
          connected: false,
          provider: "google",
          tenant: "century21-beggins",
          lastChecked: new Date().toISOString(),
          error: hasValidTokens.error || "No valid tokens found",
        },
      })
    }
  } catch (error) {
    console.error("Error checking Beggins Google OAuth status:", error)
    return NextResponse.json(
      {
        status: {
          connected: false,
          provider: "google",
          tenant: "century21-beggins",
          lastChecked: new Date().toISOString(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    )
  }
}
