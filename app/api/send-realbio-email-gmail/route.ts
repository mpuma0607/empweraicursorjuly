import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 REALBIO EMAIL GMAIL API - Starting request')
    
    const { to, subject, body, from } = await request.json()
    console.log('📧 Request data:', { to, subject, body: body?.substring(0, 100) + '...', from })

    // Validate required fields
    if (!to || !subject || !body || !from) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body, from' },
        { status: 400 }
      )
    }

    console.log('🔐 Checking OAuth tokens for:', from)
    // Check if user has valid tokens
    if (!(await oauthTokens.hasValidTokens(from, 'google'))) {
      console.log('❌ No valid OAuth tokens found')
      return NextResponse.json(
        { error: 'Gmail account not connected or tokens expired' },
        { status: 401 }
      )
    }

    console.log('✅ OAuth tokens validated, getting tokens')
    const tokens = await oauthTokens.get(from, 'google')
    if (!tokens) {
      console.log('❌ Failed to get OAuth tokens')
      return NextResponse.json(
        { error: 'Gmail account not connected or tokens expired' },
        { status: 401 }
      )
    }
    
    console.log('📝 Creating email message')
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

    console.log('📤 Sending email via Gmail API')
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
      console.error('❌ Gmail API error:', errorData)
      throw new Error(`Gmail API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const result = await response.json()
    console.log('✅ Gmail API success:', result.id)
    
    console.log('🔄 Updating last used time')
    // Update last used time
    await oauthTokens.updateLastUsed(from, 'google')
    
    console.log('✅ RealBio email sent successfully via Gmail:', result.id)
    
    return NextResponse.json({ 
      success: true, 
      messageId: result.id,
      message: 'RealBio content sent successfully via Gmail'
    })

  } catch (error) {
    console.error('❌ Error sending realbio email via Gmail:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    )
  }
}
