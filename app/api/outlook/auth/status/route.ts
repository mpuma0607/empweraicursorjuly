import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('email')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking Microsoft OAuth status for:', userEmail)

    // Check if user has valid Microsoft tokens
    const hasValidTokens = await oauthTokens.hasValidTokens(userEmail, 'microsoft')
    
    if (hasValidTokens) {
      // Get token details
      const tokens = await oauthTokens.get(userEmail, 'microsoft')
      
      return NextResponse.json({
        connected: true,
        provider: 'microsoft',
        email: userEmail,
        scopes: tokens?.scopes || [],
        expiresAt: tokens?.expiresAt,
        lastUsed: tokens?.lastUsed
      })
    }

    return NextResponse.json({
      connected: false,
      provider: 'microsoft',
      email: userEmail
    })

  } catch (error) {
    console.error('❌ Microsoft OAuth status check error:', error)
    return NextResponse.json(
      { 
        connected: false,
        error: 'Failed to check Microsoft OAuth status'
      },
      { status: 500 }
    )
  }
}
