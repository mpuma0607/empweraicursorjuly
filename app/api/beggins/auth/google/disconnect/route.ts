import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    console.log("Disconnecting Beggins Google OAuth for email:", email)

    // Remove OAuth tokens for Beggins tenant
    const removeResult = await oauthTokens.remove(email, "century21-beggins")

    if (removeResult.success) {
      console.log("Successfully disconnected Beggins Google OAuth for:", email)
      return NextResponse.json({
        success: true,
        message: "Google account disconnected successfully",
        tenant: "century21-beggins",
      })
    } else {
      console.error("Failed to disconnect Beggins Google OAuth:", removeResult.error)
      return NextResponse.json(
        {
          success: false,
          error: removeResult.error || "Failed to disconnect Google account",
          tenant: "century21-beggins",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error disconnecting Beggins Google OAuth:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        tenant: "century21-beggins",
      },
      { status: 500 }
    )
  }
}
