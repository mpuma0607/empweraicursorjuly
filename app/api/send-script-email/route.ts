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

    // Encode the message for Gmail API
    const encodedMessage = Buffer.from(message).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Send email using Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gmail API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to send email via Gmail API' },
        { status: 500 }
      )
    }

    // Update last used time
    oauthTokens.updateLastUsed(from)

    console.log(`Email sent successfully from ${from} to ${to}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    })

  } catch (error) {
    console.error('Error sending script email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
