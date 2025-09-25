import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log('📧 Email API called')
    const { to, subject, body, userEmail } = await req.json()
    console.log('📧 Email request data:', { to, subject, userEmail })

    if (!to || !subject || !body || !userEmail) {
      console.log('❌ Missing required fields')
      return NextResponse.json({ 
        error: 'Missing required fields: to, subject, body, userEmail' 
      }, { status: 400 })
    }

    console.log('AI Assistant sending email:', { to, subject, userEmail })

    // Check Gmail connection first
    let gmailConnected = false
    try {
      const googleResponse = await fetch(`${req.nextUrl.origin}/api/auth/google/status`, {
        headers: {
          'x-user-email': userEmail
        }
      })
      if (googleResponse.ok) {
        const data = await googleResponse.json()
        gmailConnected = data.connected
      }
    } catch (error) {
      console.error('Error checking Gmail:', error)
    }

    // Check Outlook connection
    let outlookConnected = false
    try {
      const microsoftResponse = await fetch(`${req.nextUrl.origin}/api/outlook/auth/status?email=${encodeURIComponent(userEmail)}`)
      if (microsoftResponse.ok) {
        const data = await microsoftResponse.json()
        outlookConnected = data.connected
      }
    } catch (error) {
      console.error('Error checking Outlook:', error)
    }

    if (!gmailConnected && !outlookConnected) {
      return NextResponse.json({ 
        error: 'No email connection found. Please connect Gmail or Outlook first.' 
      }, { status: 400 })
    }

    // Try Gmail first, then Outlook
    if (gmailConnected) {
      try {
        const gmailResponse = await fetch(`${req.nextUrl.origin}/api/send-gmail-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail
          },
          body: JSON.stringify({
            to,
            subject,
            body,
            isHtml: true
          })
        })

        if (gmailResponse.ok) {
          const result = await gmailResponse.json()
          return NextResponse.json({ 
            success: true, 
            message: 'Email sent successfully via Gmail',
            messageId: result.messageId
          })
        } else {
          const error = await gmailResponse.text()
          console.error('Gmail send failed:', error)
          // Fall through to try Outlook
        }
      } catch (error) {
        console.error('Gmail send error:', error)
        // Fall through to try Outlook
      }
    }

    if (outlookConnected) {
      try {
        const outlookResponse = await fetch(`${req.nextUrl.origin}/api/send-outlook-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail
          },
          body: JSON.stringify({
            to,
            subject,
            body,
            isHtml: true
          })
        })

        if (outlookResponse.ok) {
          const result = await outlookResponse.json()
          return NextResponse.json({ 
            success: true, 
            message: 'Email sent successfully via Outlook',
            messageId: result.messageId
          })
        } else {
          const error = await outlookResponse.text()
          console.error('Outlook send failed:', error)
          return NextResponse.json({ 
            error: 'Failed to send email via both Gmail and Outlook' 
          }, { status: 500 })
        }
      } catch (error) {
        console.error('Outlook send error:', error)
        return NextResponse.json({ 
          error: 'Failed to send email via both Gmail and Outlook' 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      error: 'No working email connection found' 
    }, { status: 400 })

  } catch (error) {
    console.error('AI Assistant email send error:', error)
    return NextResponse.json({ 
      error: 'Failed to send email' 
    }, { status: 500 })
  }
}
