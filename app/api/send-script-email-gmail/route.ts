import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 SCRIPT EMAIL GMAIL API - Starting request')
    
    const formData = await request.formData()
    const to = formData.get('to') as string
    const subject = formData.get('subject') as string
    const body = formData.get('body') as string
    const from = formData.get('from') as string
    const contentType = formData.get('contentType') as string || 'script'

    console.log('📧 Request data:', { to, subject, body: body?.substring(0, 100) + '...', from })

    // Validate required fields
    if (!to || !subject || !body || !from) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body, from' },
        { status: 400 }
      )
    }

    // Get attachments
    const attachments: { file: File; name: string }[] = []
    for (let i = 0; i < 10; i++) { // Check up to 10 attachments
      const attachment = formData.get(`attachment_${i}`) as File
      if (attachment && attachment.size > 0) {
        attachments.push({ file: attachment, name: attachment.name })
      }
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
    
    console.log('📝 Creating email message with attachments')
    // Create the email message with attachments
    let message: string
    
    if (attachments.length > 0) {
      // Create multipart message with attachments
      const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      let messageParts = [
        `To: ${to}`,
        `From: ${from}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        `Content-Type: text/html; charset=utf-8`,
        '',
        body.replace(/\n/g, '<br>'),
        ''
      ]

      // Add attachments
      for (const attachment of attachments) {
        const fileBuffer = Buffer.from(await attachment.file.arrayBuffer())
        const encodedFile = fileBuffer.toString('base64')
        const mimeType = attachment.file.type || 'application/octet-stream'
        
        messageParts.push(
          `--${boundary}`,
          `Content-Type: ${mimeType}`,
          `Content-Disposition: attachment; filename="${attachment.name}"`,
          `Content-Transfer-Encoding: base64`,
          '',
          encodedFile,
          ''
        )
      }

      messageParts.push(`--${boundary}--`)
      message = messageParts.join('\n')
    } else {
      // Simple text message
      message = [
        `To: ${to}`,
        `From: ${from}`,
        `Subject: ${subject}`,
        `Content-Type: text/html; charset=utf-8`,
        '',
        body.replace(/\n/g, '<br>')
      ].join('\n')
    }

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
    
    console.log('✅ Script email sent successfully via Gmail:', result.id)
    
    return NextResponse.json({ 
      success: true, 
      messageId: result.id,
      message: 'Script sent successfully via Gmail'
    })

  } catch (error) {
    console.error('❌ Error sending script email via Gmail:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    )
  }
}
