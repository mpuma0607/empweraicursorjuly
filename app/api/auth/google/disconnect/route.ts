import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Determine the current tenant from the request hostname
    const host = request.headers.get('host') || ''
    const tenant = host.includes('beggins') || host.includes('begginsuniversity') 
      ? 'century21-beggins' 
      : 'empower-ai'
    
    console.log('OAuth Disconnect - Email:', email, 'Tenant:', tenant, 'Host:', host)

    // Remove OAuth tokens for the appropriate tenant
    await oauthTokens.remove(email, tenant)

    console.log(`OAuth tokens removed for ${email} on tenant ${tenant}`)

    return NextResponse.json({
      success: true,
      message: 'Gmail disconnected successfully',
      tenant: tenant
    })
  } catch (error) {
    console.error('Error disconnecting Gmail:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail' },
      { status: 500 }
    )
  }
}
