import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'

export async function POST(request: NextRequest) {
  try {
    const { from, to, subject, content } = await request.json()

    // Check if user has valid Google OAuth tokens
    const hasValidTokens = await oauthTokens.hasValidTokens(from, 'google')
    if (!hasValidTokens) {
      return NextResponse.json(
        { error: 'No valid Google OAuth tokens found. Please connect your Gmail account first.' },
        { status: 401 }
      )
    }

    // Get OAuth tokens
    const tokens = await oauthTokens.get(from, 'google')
    if (!tokens) {
      return NextResponse.json(
        { error: 'Failed to retrieve OAuth tokens' },
        { status: 500 }
      )
    }

    // Create email message
    const message = {
      raw: Buffer.from(
        `To: ${to}\r\n` +
        `From: ${from}\r\n` +
        `Subject: ${subject}\r\n` +
        `Content-Type: text/html; charset=utf-8\r\n` +
        `\r\n` +
        `${content}`
      ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }

    // Send email via Gmail API
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gmail API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to send email via Gmail API' },
        { status: response.status }
      )
    }

    // Update last used timestamp
    await oauthTokens.updateLastUsed(from, 'google')

    return NextResponse.json({ success: true, message: 'Email sent successfully' })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
