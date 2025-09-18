import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'

const FUB_API_BASE = 'https://api.followupboss.com/v1'

export async function POST(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    const { contactId, message, messageType } = await request.json()

    if (!userEmail || !contactId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the user's FUB API key
    const tokens = await oauthTokens.get(userEmail, 'followupboss')
    
    if (!tokens) {
      return NextResponse.json(
        { error: 'Follow Up Boss not connected' },
        { status: 401 }
      )
    }

    const headers = {
      'Authorization': `Basic ${Buffer.from(`${tokens.accessToken}:`).toString('base64')}`,
      'Content-Type': 'application/json',
      'X-System': process.env.FUB_X_SYSTEM || 'EmpowerAI',
      'X-System-Key': process.env.FUB_X_SYSTEM_KEY || ''
    }

    // Send text message via FUB API
    const response = await fetch(`${FUB_API_BASE}/textMessages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        personId: parseInt(contactId),
        message: message,
        type: messageType || 'outbound' // or 'zillow' if that's supported
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FUB Text API error:', response.status, errorText)
      
      if (response.status === 401) {
        await oauthTokens.remove(userEmail, 'followupboss')
        return NextResponse.json(
          { error: 'Follow Up Boss connection expired. Please reconnect.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to send text message' },
        { status: 500 }
      )
    }

    const textData = await response.json()
    console.log('Text message sent via FUB for user:', userEmail, 'contact:', contactId)

    return NextResponse.json({
      success: true,
      messageId: textData.id
    })

  } catch (error) {
    console.error('Error sending text via Follow Up Boss:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


