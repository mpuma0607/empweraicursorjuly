import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (email) {
      // If email is provided, check specific user's OAuth status
      console.log("Checking Beggins Google OAuth status for specific email:", email)

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
    } else {
      // If no email provided, check all Beggins OAuth tokens (like Empower endpoint)
      console.log("Checking Beggins Google OAuth status for all users")
      
      const allEmails = await oauthTokens.getAllEmails()
      console.log('Checking Beggins OAuth status for emails:', allEmails)
      
      // Find the first user with valid Beggins tokens
      for (const email of allEmails) {
        if (await oauthTokens.hasValidTokens(email, "century21-beggins")) {
          const tokens = await oauthTokens.get(email, "century21-beggins")
          
          if (tokens) {
            // Update last used time
            await oauthTokens.updateLastUsed(email, "century21-beggins")
            
            console.log(`Found valid Beggins OAuth tokens for ${email}`)
            
            return NextResponse.json({
              status: {
                connected: true,
                provider: "google",
                tenant: "century21-beggins",
                email: tokens.userEmail,
                connectedAt: tokens.createdAt,
                scopes: tokens.scopes,
                lastUsed: tokens.lastUsed
              }
            })
          }
        }
      }
      
      // No valid Beggins tokens found
      console.log('No valid Beggins OAuth tokens found')
      return NextResponse.json({
        status: {
          connected: false,
          provider: "google",
          tenant: "century21-beggins",
          email: undefined,
          connectedAt: undefined,
          scopes: undefined,
          lastUsed: undefined
        }
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
