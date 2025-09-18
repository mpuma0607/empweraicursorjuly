import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'

const FUB_API_BASE = 'https://api.followupboss.com/v1'

interface FUBContact {
  id: number
  name: string
  firstName: string
  lastName: string
  emails: Array<{ value: string; type?: string }>
  phones: Array<{ value: string; type?: string }>
  addresses: Array<{
    street: string
    city: string
    state: string
    code: string
    country?: string
  }>
  source: string
  stage: string
  created: string
  updated: string
  lastActivity: string
  assignedTo?: {
    id: number
    name: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const stage = searchParams.get('stage') || ''

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
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

    // Build query parameters for FUB API
    const params = new URLSearchParams()
    params.set('limit', limit.toString())
    
    if (search) {
      // FUB supports searching by name, email, phone
      params.set('name', search)
    }
    
    if (stage) {
      params.set('stage', stage)
    }

    // Call FUB API to get contacts
    const response = await fetch(`${FUB_API_BASE}/people?${params.toString()}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${tokens.accessToken}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'X-System': process.env.FUB_X_SYSTEM || 'EmpowerAI',
        'X-System-Key': process.env.FUB_X_SYSTEM_KEY || ''
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FUB API error:', response.status, errorText)
      
      if (response.status === 401) {
        // API key is invalid, remove it
        await oauthTokens.remove(userEmail, 'followupboss')
        return NextResponse.json(
          { error: 'Follow Up Boss connection expired. Please reconnect.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch contacts from Follow Up Boss' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // Debug: Log the first contact to see all available fields
    if (data.people && data.people.length > 0) {
      console.log('FUB API Debug - First contact fields:', Object.keys(data.people[0]))
      console.log('FUB API Debug - First contact data:', data.people[0])
    }
    
    // Transform the data to a consistent format
    const contacts = data.people?.map((contact: FUBContact) => ({
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
      assignedAgent: contact.assignedTo?.name || 'Unassigned'
    })) || []

    return NextResponse.json({
      contacts,
      total: data._metadata?.total || contacts.length,
      hasMore: data._metadata?.next ? true : false
    })

  } catch (error) {
    console.error('Error fetching Follow Up Boss contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
