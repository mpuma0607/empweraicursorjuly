import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'

export async function GET(request: NextRequest) {
  try {
    console.log('FUB Status API: Request received')
    const userEmail = request.headers.get('x-user-email')
    console.log('FUB Status API: User email:', userEmail)

    if (!userEmail) {
      console.log('FUB Status API: No user email provided')
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    // Check environment variables
    const xSystem = process.env.FUB_X_SYSTEM
    const xSystemKey = process.env.FUB_X_SYSTEM_KEY
    console.log('FUB Status API: Environment variables:', { 
      hasXSystem: !!xSystem, 
      hasXSystemKey: !!xSystemKey 
    })

    if (!xSystem || !xSystemKey) {
      console.error('FUB Status API: Missing environment variables')
      return NextResponse.json({
        connected: false,
        provider: 'followupboss',
        error: 'Follow Up Boss integration not configured'
      })
    }

    // Check if user has Follow Up Boss tokens
    console.log('FUB Status API: Checking for existing tokens')
    const hasTokens = await oauthTokens.hasValidTokens(userEmail, 'followupboss')
    console.log('FUB Status API: Has tokens:', hasTokens)
    
    if (!hasTokens) {
      console.log('FUB Status API: No valid tokens found')
      return NextResponse.json({
        connected: false,
        provider: 'followupboss'
      })
    }

    // Get the tokens to verify they still work
    console.log('FUB Status API: Getting tokens for verification')
    const tokens = await oauthTokens.get(userEmail, 'followupboss')
    
    if (!tokens) {
      console.log('FUB Status API: Failed to retrieve tokens')
      return NextResponse.json({
        connected: false,
        provider: 'followupboss'
      })
    }

    // Test the API key by calling the identity endpoint
    console.log('FUB Status API: Testing API key with identity endpoint')
    const response = await fetch('https://api.followupboss.com/v1/identity', {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${tokens.accessToken}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'X-System': xSystem,
        'X-System-Key': xSystemKey
      }
    })

    console.log('FUB Status API: Identity response:', response.status, response.statusText)

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
