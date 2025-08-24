import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const allEmails = await oauthTokens.getAllEmails()
    const debugInfo = {
      totalStoredEmails: allEmails.length,
      emails: allEmails,
      details: await Promise.all(allEmails.map(async email => {
        const tokens = await oauthTokens.get(email)
        if (!tokens) return { email, status: 'no_tokens' }

        const now = new Date()
        const isExpired = tokens.expiresAt < now
        const isValid = await oauthTokens.hasValidTokens(email)

        return {
          email: tokens.userEmail,
          hasAccessToken: !!tokens.accessToken,
          hasRefreshToken: !!tokens.refreshToken,
          expiresAt: tokens.expiresAt,
          isExpired,
          isValid,
          scopes: tokens.scopes,
          createdAt: tokens.createdAt,
          lastUsed: tokens.lastUsed
        }
      }))
    }
    
    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to get debug info' },
      { status: 500 }
    )
  }
}
