import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const to = formData.get('to') as string
    const subject = formData.get('subject') as string
    const body = formData.get('body') as string
    const from = formData.get('from') as string
    const contentType = formData.get('contentType') as string || 'cma'

    // Validate required fields
    if (!to || !subject || !body || !from) {
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

    // Check if user has valid tokens
    if (!(await oauthTokens.hasValidTokens(from))) {
      return NextResponse.json(
        { error: 'Gmail account not connected or tokens expired' },
        { status: 401 }
      )
    }

    const tokens = await oauthTokens.get(from)
    if (!tokens) {
      return NextResponse.json(
        { error: 'Gmail account not connected or tokens expired' },
        { status: 401 }
      )
    }
    
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
    await oauthTokens.updateLastUsed(from)
    
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
