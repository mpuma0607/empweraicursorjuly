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
    const { title, description, startDateTime, duration, attendees, location }: Omit<CreateEventRequest, 'userEmail'> = await request.json()

    // Get user email from the request headers (set by middleware or session)
    const userEmail = request.headers.get('x-user-email') || request.headers.get('user-email')
    
    console.log('Calendar API called with:', { title, userEmail, startDateTime, duration })

    if (!title || !description || !startDateTime || !duration || !userEmail) {
      return NextResponse.json({ error: "Missing required fields or user not authenticated" }, { status: 400 })
    }

    // Test database connection
    try {
      await sql`SELECT 1 as test`
      console.log('Database connection successful')
    } catch (dbTestError) {
      console.error('Database connection test failed:', dbTestError)
      return NextResponse.json({ 
        error: "Database connection failed", 
        details: dbTestError instanceof Error ? dbTestError.message : 'Unknown database error'
      }, { status: 500 })
    }

    // Get user's OAuth tokens - check for calendar.events scope specifically
    let tokens
    try {
      tokens = await sql`
        SELECT access_token, refresh_token, expires_at, scopes
        FROM oauth_tokens 
        WHERE user_email = ${userEmail} 
        AND provider = 'google' 
        AND 'https://www.googleapis.com/auth/calendar.events' = ANY(scopes)
        ORDER BY created_at DESC 
        LIMIT 1
      `
      console.log('Found tokens for user:', userEmail, 'Count:', tokens.length, 'Scopes:', tokens[0]?.scopes)
    } catch (dbError) {
      console.error('Database query error:', dbError)
      return NextResponse.json({ 
        error: "Database query failed", 
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }

    if (tokens.length === 0) {
      console.log('No Google Calendar tokens found for user:', userEmail)
      return NextResponse.json({ 
        error: "No Google Calendar access found. Please connect your Google account first.", 
        details: "Go to your profile and connect your Google account to enable calendar integration."
      }, { status: 401 })
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
        timeZone: 'America/New_York' // Use specific timezone instead of auto-detection
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/New_York'
      },
      attendees: attendees?.map(email => ({ email })) || [],
      location: location || undefined
    }

    console.log('Creating calendar event with:', event)

    let calendarResponse
    try {
      calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
      console.log('Calendar API response status:', calendarResponse.status)
    } catch (fetchError) {
      console.error('Google Calendar API fetch error:', fetchError)
      return NextResponse.json({ 
        error: "Failed to call Google Calendar API", 
        details: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
      }, { status: 500 })
    }

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json()
      console.error('Google Calendar API error:', errorData)
      return NextResponse.json({ 
        error: "Failed to create calendar event", 
        details: errorData.error?.message || 'Unknown error',
        status: calendarResponse.status
      }, { status: 500 })
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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: "Failed to create calendar event", 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
