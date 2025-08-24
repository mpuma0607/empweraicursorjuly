import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, from } = await request.json()

    // Validate required fields
    if (!to || !subject || !body || !from) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body, from' },
        { status: 400 }
      )
    }

    // Check if user has valid tokens
    if (!oauthTokens.hasValidTokens(from)) {
      return NextResponse.json(
        { error: 'Gmail account not connected or tokens expired' },
        { status: 401 }
      )
    }

    const tokens = oauthTokens.get(from)!
    
    // Create the email message
    const message = [
      `To: ${to}`,
      `From: ${from}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n')

    // Encode the message in base64
    const encodedMessage = Buffer.from(message).toString('base64')
    const encodedMessageUrlSafe = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

    // Send email using Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessageUrlSafe
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gmail API error:', errorData)
      throw new Error(`Gmail API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const result = await response.json()
    
    // Update last used time
    oauthTokens.updateLastUsed(from)
    
    console.log('CMA email sent successfully via Gmail:', result.id)
    
    return NextResponse.json({ 
      success: true, 
      messageId: result.id,
      message: 'CMA report sent successfully via Gmail'
    })

  } catch (error) {
    console.error('Error sending CMA email via Gmail:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    )
  }
}
