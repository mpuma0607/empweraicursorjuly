import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'

const FUB_API_BASE = 'https://api.followupboss.com/v1'

interface FUBUser {
  id: number
  name: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, userEmail } = await request.json()

    if (!apiKey || !userEmail) {
      return NextResponse.json(
        { error: 'API key and user email are required' },
        { status: 400 }
      )
    }

    // Test the API key by calling the identity endpoint
    const response = await fetch(`${FUB_API_BASE}/identity`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'X-System': process.env.FUB_X_SYSTEM || 'EmpowerAI',
        'X-System-Key': process.env.FUB_X_SYSTEM_KEY || ''
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FUB API error:', response.status, errorText)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your Follow Up Boss API key.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to connect to Follow Up Boss. Please try again.' },
        { status: 500 }
      )
    }

    const userInfo = await response.json() as FUBUser

    // Store the API key and user info in our oauth_tokens table
    // We'll use a special format for FUB since it's not OAuth
    await oauthTokens.store(userEmail, {
      accessToken: apiKey, // Store API key as access token
      provider: 'followupboss',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      scopes: ['api_access']
    })

    // Store user info separately (we'll need to extend the oauth_tokens table for this)
    // For now, let's just return success
    console.log(`Connected Follow Up Boss for ${userEmail}:`, userInfo)

    return NextResponse.json({
      success: true,
      user: userInfo,
      message: `Successfully connected to Follow Up Boss as ${userInfo.name}`
    })

  } catch (error) {
    console.error('Error connecting to Follow Up Boss:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
