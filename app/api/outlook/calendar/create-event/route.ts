import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    console.log('📅 OUTLOOK CALENDAR API - Creating event')
    
    const { 
      userEmail, 
      title, 
      description, 
      startTime, 
      endTime, 
      attendees = [],
      location = '',
      isAllDay = false 
    } = await request.json()

    // Validate required fields
    if (!userEmail || !title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, title, startTime, endTime' },
        { status: 400 }
      )
    }

    console.log('🔐 Checking Microsoft OAuth tokens for:', userEmail)
    
    // Check if user has valid Microsoft tokens
    if (!(await oauthTokens.hasValidTokens(userEmail, 'microsoft'))) {
      console.log('❌ No valid Microsoft OAuth tokens found')
      return NextResponse.json(
        { error: 'Microsoft account not connected or tokens expired' },
        { status: 401 }
      )
    }

    const tokens = await oauthTokens.get(userEmail, 'microsoft')
    if (!tokens) {
      return NextResponse.json(
        { error: 'Microsoft account not connected or tokens expired' },
        { status: 401 }
      )
    }

    // Format attendees for Microsoft Graph
    const graphAttendees = attendees.map((email: string) => ({
      emailAddress: {
        address: email,
        name: email
      },
      type: 'required'
    }))

    // Create event for Microsoft Graph
    const event = {
      subject: title,
      body: {
        contentType: 'HTML',
        content: description || ''
      },
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'UTC'
      },
      isAllDay: isAllDay,
      location: location ? {
        displayName: location
      } : undefined,
      attendees: graphAttendees.length > 0 ? graphAttendees : undefined
    }

    console.log('📅 Creating event via Microsoft Graph...')
    
    // Create event via Microsoft Graph API
    const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    })

    if (!graphResponse.ok) {
      const errorData = await graphResponse.text()
      console.error('❌ Microsoft Graph Calendar API error:', errorData)
      return NextResponse.json(
        { 
          error: 'Failed to create calendar event',
          details: errorData
        },
        { status: 502 }
      )
    }

    const eventData = await graphResponse.json()

    // Update last used time
    await oauthTokens.updateLastUsed(userEmail, 'microsoft')

    console.log('✅ Outlook calendar event created successfully:', eventData.id)

    return NextResponse.json({
      success: true,
      eventId: eventData.id,
      message: 'Calendar event created successfully'
    })

  } catch (error) {
    console.error('❌ Error creating Outlook calendar event:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create calendar event',
        details: {
          message: "An unexpected error occurred while creating the calendar event",
          originalError: error instanceof Error ? error.message : String(error)
        }
      },
      { status: 500 }
    )
  }
}
