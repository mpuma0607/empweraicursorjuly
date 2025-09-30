import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { title, startTime, endTime, description, attendees, userEmail } = await req.json()

    if (!title || !startTime || !endTime || !userEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, startTime, endTime, userEmail' 
      }, { status: 400 })
    }

    console.log('AI Assistant creating calendar event:', { title, startTime, endTime, userEmail })

    // Check Gmail connection first (Google Calendar)
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
        error: 'No calendar connection found. Please connect Gmail or Outlook first.' 
      }, { status: 400 })
    }

    // Try Gmail/Google Calendar first, then Outlook
    if (gmailConnected) {
      try {
        const calendarResponse = await fetch(`${req.nextUrl.origin}/api/calendar/create-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail
          },
          body: JSON.stringify({
            title,
            startTime,
            endTime,
            description,
            attendees: attendees || []
          })
        })

        if (calendarResponse.ok) {
          const result = await calendarResponse.json()
          return NextResponse.json({ 
            success: true, 
            message: 'Calendar event created successfully via Google Calendar',
            eventId: result.eventId,
            calendarLink: result.calendarLink
          })
        } else {
          const error = await calendarResponse.text()
          console.error('Google Calendar create failed:', error)
          // Fall through to try Outlook
        }
      } catch (error) {
        console.error('Google Calendar error:', error)
        // Fall through to try Outlook
      }
    }

    if (outlookConnected) {
      try {
        // For Outlook, we'll use the same calendar API but it should handle Outlook OAuth
        const calendarResponse = await fetch(`${req.nextUrl.origin}/api/calendar/create-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail
          },
          body: JSON.stringify({
            title,
            startTime,
            endTime,
            description,
            attendees: attendees || []
          })
        })

        if (calendarResponse.ok) {
          const result = await calendarResponse.json()
          return NextResponse.json({ 
            success: true, 
            message: 'Calendar event created successfully via Outlook',
            eventId: result.eventId,
            calendarLink: result.calendarLink
          })
        } else {
          const error = await calendarResponse.text()
          console.error('Outlook Calendar create failed:', error)
          return NextResponse.json({ 
            error: 'Failed to create calendar event via both Google Calendar and Outlook' 
          }, { status: 500 })
        }
      } catch (error) {
        console.error('Outlook Calendar error:', error)
        return NextResponse.json({ 
          error: 'Failed to create calendar event via both Google Calendar and Outlook' 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      error: 'No working calendar connection found' 
    }, { status: 400 })

  } catch (error) {
    console.error('AI Assistant calendar create error:', error)
    return NextResponse.json({ 
      error: 'Failed to create calendar event' 
    }, { status: 500 })
  }
}
