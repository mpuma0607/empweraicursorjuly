import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = parseInt(params.id.replace('agent_', ''))
    const { name, email, phone, level, goals, notes } = await req.json()

    if (!agentId) {
      return NextResponse.json({ error: 'Invalid agent ID' }, { status: 400 })
    }

    if (!name || !email) {
      return NextResponse.json({ 
        error: 'Name and email are required' 
      }, { status: 400 })
    }

    // Update agent in database
    const result = await sql`
      UPDATE agents 
      SET name = ${name}, 
          email = ${email}, 
          phone = ${phone || ''}, 
          level = ${level || 'New Agent'}, 
          goals = ${goals || ''}, 
          notes = ${notes || ''}
      WHERE id = ${agentId}
      RETURNING id, name, email, phone, level, goals, notes, join_date, last_contact
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const agent = {
      id: `agent_${result[0].id}`,
      name: result[0].name,
      email: result[0].email,
      phone: result[0].phone,
      level: result[0].level,
      goals: result[0].goals,
      notes: result[0].notes,
      joinDate: result[0].join_date,
      lastContact: result[0].last_contact
    }

    return NextResponse.json({
      success: true,
      agent
    })

  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json({
      error: 'Failed to update agent'
    }, { status: 500 })
  }
}
