import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }

    console.log('🔌 Disconnecting Microsoft OAuth for:', email)

    // Get tokens before removing them (for revocation)
    const tokens = await oauthTokens.get(email, 'microsoft')
    
    if (tokens) {
      try {
        // Revoke the token with Microsoft
        await fetch('https://graph.microsoft.com/v1.0/me/revokeSignInSessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('✅ Microsoft token revoked')
      } catch (revokeError) {
        console.warn('⚠️ Failed to revoke Microsoft token:', revokeError)
        // Continue with local removal even if revocation fails
      }
    }

    // Remove tokens from database (soft delete)
    await oauthTokens.remove(email, 'microsoft')

    console.log(`✅ Microsoft OAuth disconnected for: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Microsoft account disconnected successfully'
    })

  } catch (error) {
    console.error('❌ Microsoft OAuth disconnect error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to disconnect Microsoft account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
