import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'

const FUB_API_BASE = 'https://api.followupboss.com/v1'

interface FUBEvent {
  id: number
  type: string
  created: string
  property?: {
    street: string
    city: string
    state: string
    zipCode?: string
  }
  message?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userEmail = request.headers.get('x-user-email')
    const contactId = params.id

    if (!userEmail || !contactId) {
      return NextResponse.json(
        { error: 'User email and contact ID are required' },
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

    const authHeader = `Basic ${Buffer.from(`${tokens.accessToken}:`).toString('base64')}`
    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
      'X-System': process.env.FUB_X_SYSTEM || 'EmpowerAI',
      'X-System-Key': process.env.FUB_X_SYSTEM_KEY || ''
    }

    // Get contact details
    const contactResponse = await fetch(`${FUB_API_BASE}/people/${contactId}`, {
      headers
    })

    if (!contactResponse.ok) {
      const errorText = await contactResponse.text()
      console.error('FUB contact API error:', contactResponse.status, errorText)
      
      if (contactResponse.status === 401) {
        await oauthTokens.remove(userEmail, 'followupboss')
        return NextResponse.json(
          { error: 'Follow Up Boss connection expired. Please reconnect.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Contact not found or access denied' },
        { status: 404 }
      )
    }

    const contact = await contactResponse.json()

    // Get contact's recent events/activities
    const eventsResponse = await fetch(`${FUB_API_BASE}/events?personId=${contactId}&limit=10`, {
      headers
    })

    let events: FUBEvent[] = []
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json()
      events = eventsData.events || []
    }

    // Transform contact data
    const transformedContact = {
      id: contact.id,
      name: contact.name,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.emails?.[0]?.value || '',
      phone: contact.phones?.[0]?.value || '',
      address: contact.addresses?.[0] ? {
        street: contact.addresses[0].street,
        city: contact.addresses[0].city,
        state: contact.addresses[0].state,
        zipCode: contact.addresses[0].code,
        full: `${contact.addresses[0].street}, ${contact.addresses[0].city}, ${contact.addresses[0].state} ${contact.addresses[0].code}`.trim()
      } : null,
      source: contact.source,
      stage: contact.stage,
      created: contact.created,
      updated: contact.updated,
      lastActivity: contact.lastActivity,
      // Recent activity/inquiry information
      recentInquiry: events.find(e => e.type === 'PropertyInquiry' || e.type === 'WebInquiry'),
      recentEvents: events.slice(0, 5).map(event => ({
        id: event.id,
        type: event.type,
        created: event.created,
        property: event.property ? {
          address: event.property.street,
          city: event.property.city,
          state: event.property.state,
          full: `${event.property.street}, ${event.property.city}, ${event.property.state}`.trim()
        } : null,
        message: event.message
      }))
    }

    return NextResponse.json({
      contact: transformedContact
    })

  } catch (error) {
    console.error('Error fetching Follow Up Boss contact details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
