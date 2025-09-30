import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    // Get all agents from database
    const agents = await sql`
      SELECT id, name, email, phone, level, goals, notes, join_date, last_contact
      FROM agents
      ORDER BY created_at DESC
    `

    const formattedAgents = agents.map(agent => ({
      id: `agent_${agent.id}`,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      level: agent.level,
      goals: agent.goals,
      notes: agent.notes,
      joinDate: agent.join_date,
      lastContact: agent.last_contact
    }))

    return NextResponse.json({
      success: true,
      agents: formattedAgents
    })

  } catch (error) {
    console.error('Error loading agents:', error)
    return NextResponse.json({
      error: 'Failed to load agents'
    }, { status: 500 })
  }
}
