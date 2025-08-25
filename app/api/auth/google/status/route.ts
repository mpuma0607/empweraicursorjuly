import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Determine the current tenant from the request hostname
    const host = request.headers.get('host') || ''
    const tenant = host.includes('beggins') || host.includes('begginsuniversity') 
      ? 'century21-beggins' 
      : 'empower-ai'
    
    console.log('OAuth Status Check - Email:', email, 'Tenant:', tenant, 'Host:', host)

    // Check OAuth status for the appropriate tenant
    const hasValidTokens = await oauthTokens.hasValidTokens(email, tenant)

    if (hasValidTokens.success && hasValidTokens.hasValid) {
      console.log(`User has valid OAuth tokens on tenant ${tenant}:`, email)
      await oauthTokens.updateLastUsed(email, tenant)
      return NextResponse.json({
        status: {
          connected: true,
          provider: "google",
          tenant: tenant,
          lastChecked: new Date().toISOString(),
        },
      })
    } else {
      console.log(`User has no valid OAuth tokens on tenant ${tenant}:`, email)
      return NextResponse.json({
        status: {
          connected: false,
          provider: "google",
          tenant: tenant,
          lastChecked: new Date().toISOString(),
          error: hasValidTokens.error || "No valid tokens found",
        },
      })
    }
  } catch (error) {
    console.error('Error checking OAuth status:', error)
    return NextResponse.json(
      {
        status: {
          connected: false,
          provider: "google",
          tenant: "unknown",
          lastChecked: new Date().toISOString(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    )
  }
}
