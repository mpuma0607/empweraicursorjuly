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

    console.log('Calendar API called with:', { title, userEmail, startDateTime, duration })

    if (!title || !description || !startDateTime || !duration || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

    // Get user's OAuth tokens - check both Google and Microsoft
    let tokens
    let provider: 'google' | 'microsoft' | null = null
    
    try {
      // First try Google Calendar tokens
      const googleTokens = await sql`
        SELECT access_token, refresh_token, expires_at, scopes, provider
        FROM oauth_tokens 
        WHERE user_email = ${userEmail} 
        AND provider = 'google' 
        AND 'https://www.googleapis.com/auth/calendar.events' = ANY(scopes)
        ORDER BY created_at DESC 
        LIMIT 1
      `
      
      // Then try Microsoft Calendar tokens
      const microsoftTokens = await sql`
        SELECT access_token, refresh_token, expires_at, scopes, provider
        FROM oauth_tokens 
        WHERE user_email = ${userEmail} 
        AND provider = 'microsoft'
        ORDER BY created_at DESC 
        LIMIT 1
      `
      
      console.log('Google tokens found:', googleTokens.length)
      console.log('Microsoft tokens found:', microsoftTokens.length)
      
      // Prefer Google if available, otherwise use Microsoft
      if (googleTokens.length > 0) {
        tokens = googleTokens
        provider = 'google'
        console.log('Using Google Calendar for user:', userEmail)
      } else if (microsoftTokens.length > 0) {
        tokens = microsoftTokens
        provider = 'microsoft'
        console.log('Using Microsoft Calendar for user:', userEmail)
      } else {
        tokens = []
        console.log('No calendar tokens found for user:', userEmail)
      }
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

    // Create calendar event with validation
    console.log('Raw startDateTime received:', startDateTime, 'Type:', typeof startDateTime)
    
    const startDate = new Date(startDateTime)
    console.log('Parsed startDate:', startDate, 'Valid:', !isNaN(startDate.getTime()))
    
    if (isNaN(startDate.getTime())) {
      console.error('Invalid startDateTime:', startDateTime)
      return NextResponse.json({ 
        error: "Invalid date/time format", 
        details: `Could not parse date: ${startDateTime}` 
      }, { status: 400 })
    }
    
    const endDate = new Date(startDate.getTime() + duration * 60000)
    console.log('Calculated endDate:', endDate, 'Valid:', !isNaN(endDate.getTime()))
    
    if (isNaN(endDate.getTime())) {
      console.error('Invalid endDate calculated from:', startDate, 'duration:', duration)
      return NextResponse.json({ 
        error: "Invalid end date calculation", 
        details: `Could not calculate end date from start: ${startDate.toISOString()}, duration: ${duration} minutes` 
      }, { status: 400 })
    }

    let calendarResponse
    let eventData
    
    if (provider === 'google') {
      // Google Calendar event format
      const event = {
        summary: title,
        description: description,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'America/New_York'
        },
        attendees: attendees?.map(email => ({ email })) || [],
        location: location || undefined
      }

      console.log('Creating Google Calendar event with:', event)

      try {
        calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        })
        console.log('Google Calendar API response status:', calendarResponse.status)
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
          error: "Failed to create Google calendar event", 
          details: errorData.error?.message || 'Unknown error',
          status: calendarResponse.status
        }, { status: 500 })
      }

      eventData = await calendarResponse.json()
      
    } else if (provider === 'microsoft') {
      // Microsoft Calendar event format
      const event = {
        subject: title,
        body: {
          contentType: 'Text',
          content: description
        },
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'America/New_York'
        },
        attendees: attendees?.map(email => ({
          emailAddress: { address: email, name: email },
          type: 'required'
        })) || [],
        location: location ? { displayName: location } : undefined
      }

      console.log('Creating Microsoft Calendar event with:', event)

      try {
        calendarResponse = await fetch('https://graph.microsoft.com/v1.0/me/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        })
        console.log('Microsoft Calendar API response status:', calendarResponse.status)
      } catch (fetchError) {
        console.error('Microsoft Calendar API fetch error:', fetchError)
        return NextResponse.json({ 
          error: "Failed to call Microsoft Calendar API", 
          details: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
        }, { status: 500 })
      }

      if (!calendarResponse.ok) {
        const errorData = await calendarResponse.json()
        console.error('Microsoft Calendar API error:', errorData)
        return NextResponse.json({ 
          error: "Failed to create Microsoft calendar event", 
          details: errorData.error?.message || 'Unknown error',
          status: calendarResponse.status
        }, { status: 500 })
      }

      eventData = await calendarResponse.json()
    }

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
