import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    console.log('📧 OUTLOOK EMAIL API - Starting request')
    
    const formData = await request.formData()
    const to = formData.get('to') as string
    const subject = formData.get('subject') as string
    const body = formData.get('body') as string
    const from = formData.get('from') as string

    console.log('📧 Request data:', { to, subject, body: body?.substring(0, 100) + '...', from })

    // Validate required fields
    if (!to || !subject || !body || !from) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body, from' },
        { status: 400 }
      )
    }

    console.log('🔐 Checking Microsoft OAuth tokens for:', from)
    
    // Check if user has valid Microsoft tokens
    if (!(await oauthTokens.hasValidTokens(from, 'microsoft'))) {
      console.log('❌ No valid Microsoft OAuth tokens found')
      return NextResponse.json(
        { error: 'Microsoft account not connected or tokens expired' },
        { status: 401 }
      )
    }

    console.log('✅ Microsoft OAuth tokens validated, getting tokens')
    const tokens = await oauthTokens.get(from, 'microsoft')
    if (!tokens) {
      console.log('❌ Failed to get Microsoft OAuth tokens')
      return NextResponse.json(
        { error: 'Microsoft account not connected or tokens expired' },
        { status: 401 }
      )
    }

    // Get attachments (same methodology as Gmail API)
    const attachments: { file: File; name: string }[] = []
    for (let i = 0; i < 10; i++) { // Check up to 10 attachments
      const attachment = formData.get(`attachment_${i}`) as File
      if (attachment && attachment.size > 0) {
        attachments.push({ file: attachment, name: attachment.name })
        console.log(`📎 Found attachment ${i}:`, attachment.name, attachment.size, 'bytes')
      }
    }

    console.log('📎 Total attachments:', attachments.length)

    // Convert attachments to Microsoft Graph format
    const graphAttachments: any[] = []
    for (const attachment of attachments) {
      try {
        const fileBuffer = Buffer.from(await attachment.file.arrayBuffer())
        const base64Content = fileBuffer.toString('base64')
        const mimeType = attachment.file.type || 'application/octet-stream'
        
        graphAttachments.push({
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: attachment.name,
          contentType: mimeType,
          contentBytes: base64Content
        })
        
        console.log(`✅ Processed attachment: ${attachment.name} (${fileBuffer.length} bytes, ${mimeType})`)
      } catch (error) {
        console.error(`❌ Failed to process attachment ${attachment.name}:`, error)
      }
    }

    // Create email message for Microsoft Graph (simplified format)
    const emailMessage = {
      subject: subject,
      body: {
        contentType: "Text",
        content: body
      },
      toRecipients: [
        {
          emailAddress: {
            address: to
          }
        }
      ]
    }
    
    // Add attachments only if they exist
    if (graphAttachments.length > 0) {
      emailMessage.attachments = graphAttachments
    }

    console.log('📤 Sending email via Microsoft Graph...')
    console.log('📧 Email message:', JSON.stringify(emailMessage, null, 2))
    console.log('🔑 Using access token (first 20 chars):', tokens.accessToken.substring(0, 20) + '...')
    
    // Send email via Microsoft Graph API
    const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailMessage)
    })

    console.log('📡 Microsoft Graph response status:', graphResponse.status)

    if (!graphResponse.ok) {
      let errorData
      try {
        errorData = await graphResponse.json()
      } catch {
        errorData = await graphResponse.text()
      }
      console.error('❌ Microsoft Graph API error:', errorData)
      return NextResponse.json(
        { 
          error: 'Failed to send email via Microsoft Graph',
          details: errorData,
          status: graphResponse.status
        },
        { status: 502 }
      )
    }

    // Update last used time
    await oauthTokens.updateLastUsed(from, 'microsoft')

    console.log('✅ Outlook email sent successfully')

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully via Microsoft Outlook'
    })

  } catch (error) {
    console.error('❌ Error sending Outlook email:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send email',
        details: {
          message: "An unexpected error occurred while sending the email",
          originalError: error instanceof Error ? error.message : String(error)
        }
      },
      { status: 500 }
    )
  }
}
