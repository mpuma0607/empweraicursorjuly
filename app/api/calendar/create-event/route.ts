import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface CreateEventRequest {
  title: string
  description: string
  startDateTime: string
  duration: number // minutes
  attendees?: string[]
  location?: string
  userEmail: string
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, startDateTime, duration, attendees, location, userEmail }: CreateEventRequest = await request.json()

    if (!title || !description || !startDateTime || !duration || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's OAuth tokens
    const tokens = await sql`
      SELECT access_token, refresh_token, expires_at 
      FROM oauth_tokens 
      WHERE user_email = ${userEmail} 
      AND provider = 'google' 
      AND scope LIKE '%calendar%'
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

    // Create calendar event
    const startDate = new Date(startDateTime)
    const endDate = new Date(startDate.getTime() + duration * 60000)

    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      attendees: attendees?.map(email => ({ email })) || [],
      location: location || undefined
    }

    const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json()
      console.error('Google Calendar API error:', errorData)
      return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 })
    }

    const eventData = await calendarResponse.json()

    return NextResponse.json({
      success: true,
      eventId: eventData.id,
      eventLink: eventData.htmlLink,
      message: "Event created successfully"
    })

  } catch (error) {
    console.error('Error creating calendar event:', error)
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 })
  }
}
