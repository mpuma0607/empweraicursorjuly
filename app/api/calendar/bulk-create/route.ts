import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface BulkEvent {
  title: string
  description: string
  startDateTime: string
  duration: number // minutes
  attendees?: string[]
  location?: string
}

interface BulkCreateRequest {
  events: BulkEvent[]
  userEmail: string
}

export async function POST(request: NextRequest) {
  try {
    const { events }: Omit<BulkCreateRequest, 'userEmail'> = await request.json()

    // Get user email from the request headers
    const userEmail = request.headers.get('x-user-email') || request.headers.get('user-email')

    if (!events || !Array.isArray(events) || events.length === 0 || !userEmail) {
      return NextResponse.json({ error: "Missing required fields or user not authenticated" }, { status: 400 })
    }

    // Get user's OAuth tokens
    const tokens = await sql`
      SELECT access_token, refresh_token, expires_at 
      FROM oauth_tokens 
      WHERE user_email = ${userEmail} 
      AND provider = 'google' 
      AND 'https://www.googleapis.com/auth/calendar.events' = ANY(scopes)
      ORDER BY created_at DESC 
      LIMIT 1
    `

    if (tokens.length === 0) {
      return NextResponse.json({ error: "No Google Calendar access found. Please reconnect your email." }, { status: 401 })
    }

    const token = tokens[0]
    const now = new Date()
    const expiresAt = new Date(token.expires_at)

    let accessToken = token.access_token

    // Refresh token if needed
    if (now >= expiresAt) {
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
          client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
          refresh_token: token.refresh_token,
          grant_type: 'refresh_token'
        })
      })

      if (!refreshResponse.ok) {
        return NextResponse.json({ error: "Failed to refresh Google access token" }, { status: 401 })
      }

      const refreshData = await refreshResponse.json()
      accessToken = refreshData.access_token

      // Update token in database
      await sql`
        UPDATE oauth_tokens 
        SET access_token = ${refreshData.access_token}, 
            expires_at = ${new Date(Date.now() + refreshData.expires_in * 1000).toISOString()}
        WHERE user_email = ${userEmail} AND provider = 'google'
      `
    }

    const createdEvents = []
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Create each event
    for (let i = 0; i < events.length; i++) {
      const eventConfig = events[i]
      const startDate = new Date(eventConfig.startDateTime)
      const endDate = new Date(startDate.getTime() + eventConfig.duration * 60000)

      const event = {
        summary: eventConfig.title,
        description: eventConfig.description,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: timeZone
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: timeZone
        },
        attendees: eventConfig.attendees?.map(email => ({ email })) || [],
        location: eventConfig.location || undefined
      }

      try {
        const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        })

        if (calendarResponse.ok) {
          const eventData = await calendarResponse.json()
          createdEvents.push({
            eventId: eventData.id,
            eventLink: eventData.htmlLink,
            date: startDate.toISOString(),
            title: eventConfig.title
          })
        } else {
          console.error(`Failed to create event ${i + 1}:`, await calendarResponse.text())
        }
      } catch (error) {
        console.error(`Error creating event ${i + 1}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      createdEvents,
      totalCreated: createdEvents.length,
      totalRequested: events.length,
      message: `Successfully created ${createdEvents.length} of ${events.length} events`
    })

  } catch (error) {
    console.error('Error creating bulk events:', error)
    return NextResponse.json({ error: "Failed to create bulk events" }, { status: 500 })
  }
}
