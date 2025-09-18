import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'

const FUB_API_BASE = 'https://api.followupboss.com/v1'

export async function POST(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    const { contactId, activityType, notes, agentName } = await request.json()

    console.log('Activity logging request:', {
      userEmail,
      contactId,
      activityType,
      notes: notes?.substring(0, 50) + '...',
      agentName
    })

    if (!userEmail || !contactId || !activityType || !notes) {
      console.error('Missing required fields:', { userEmail, contactId, activityType, notes: !!notes })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the user's FUB API key
    const tokens = await oauthTokens.get(userEmail, 'followupboss')
    
    if (!tokens) {
      return NextResponse.json(
        { error: 'Follow Up Boss not connected' },
        { status: 401 }
      )
    }

    // Create note in Follow Up Boss
    const noteContent = `${activityType.toUpperCase()}: ${notes}\n\nLogged via EmpowerAI by ${agentName}`
    
    console.log('Creating FUB note:', {
      personId: parseInt(contactId),
      contentLength: noteContent.length,
      hasXSystem: !!process.env.FUB_X_SYSTEM,
      hasXSystemKey: !!process.env.FUB_X_SYSTEM_KEY
    })
    
    const response = await fetch(`${FUB_API_BASE}/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${tokens.accessToken}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'X-System': process.env.FUB_X_SYSTEM || 'EmpowerAI',
        'X-System-Key': process.env.FUB_X_SYSTEM_KEY || ''
      },
      body: JSON.stringify({
        personId: parseInt(contactId),
        body: noteContent
      })
    })
    
    console.log('FUB API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FUB API error:', response.status, errorText)
      
      if (response.status === 401) {
        await oauthTokens.remove(userEmail, 'followupboss')
        return NextResponse.json(
          { error: 'Follow Up Boss connection expired. Please reconnect.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to log activity to Follow Up Boss' },
        { status: 500 }
      )
    }

    const noteData = await response.json()
    console.log('Activity logged to FUB for user:', userEmail, 'contact:', contactId)

    return NextResponse.json({
      success: true,
      noteId: noteData.id
    })

  } catch (error) {
    console.error('Error logging activity to Follow Up Boss:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
