import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    // Check if user has Follow Up Boss tokens
    const hasTokens = await oauthTokens.hasValidTokens(userEmail, 'followupboss')
    
    if (!hasTokens) {
      return NextResponse.json({
        connected: false,
        provider: 'followupboss'
      })
    }

    // Get the tokens to verify they still work
    const tokens = await oauthTokens.get(userEmail, 'followupboss')
    
    if (!tokens) {
      return NextResponse.json({
        connected: false,
        provider: 'followupboss'
      })
    }

    // Test the API key by calling the identity endpoint
    const response = await fetch('https://api.followupboss.com/v1/identity', {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${tokens.accessToken}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'X-System': process.env.FUB_X_SYSTEM || 'EmpowerAI',
        'X-System-Key': process.env.FUB_X_SYSTEM_KEY || ''
      }
    })

    if (!response.ok) {
      // API key is invalid, mark as disconnected
      await oauthTokens.remove(userEmail, 'followupboss')
      return NextResponse.json({
        connected: false,
        provider: 'followupboss'
      })
    }

    const userInfo = await response.json()

    return NextResponse.json({
      connected: true,
      provider: 'followupboss',
      user: userInfo
    })

  } catch (error) {
    console.error('Error checking Follow Up Boss status:', error)
    return NextResponse.json({
      connected: false,
      provider: 'followupboss'
    })
  }
}
