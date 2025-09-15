import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface RecurringEventConfig {
  title: string
  description: string
  startDateTime: string
  duration: number // minutes
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly'
  occurrences: number
  attendees?: string[]
  location?: string
  userEmail: string
}

export async function POST(request: NextRequest) {
  try {
    const config: RecurringEventConfig = await request.json()

    if (!config.title || !config.description || !config.startDateTime || !config.duration || !config.userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
    const startDate = new Date(config.startDateTime)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Calculate interval based on frequency
    let intervalDays = 1
    switch (config.frequency) {
      case 'daily':
        intervalDays = 1
        break
      case 'weekly':
        intervalDays = 7
        break
      case 'bi-weekly':
        intervalDays = 14
        break
      case 'monthly':
        intervalDays = 30
        break
    }

    // Create each event
    for (let i = 0; i < config.occurrences; i++) {
      const eventDate = new Date(startDate.getTime() + (i * intervalDays * 24 * 60 * 60 * 1000))
      const endDate = new Date(eventDate.getTime() + config.duration * 60000)

      // Generate title with occurrence number if multiple
      const eventTitle = config.occurrences > 1 
        ? `${config.title} #${i + 1}` 
        : config.title

      const event = {
        summary: eventTitle,
        description: config.description,
        start: {
          dateTime: eventDate.toISOString(),
          timeZone: timeZone
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: timeZone
        },
        attendees: config.attendees?.map(email => ({ email })) || [],
        location: config.location || undefined
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
            date: eventDate.toISOString(),
            title: eventTitle
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
      message: `Successfully created ${createdEvents.length} of ${config.occurrences} events`
    })

  } catch (error) {
    console.error('Error creating recurring events:', error)
    return NextResponse.json({ error: "Failed to create recurring events" }, { status: 500 })
  }
}
