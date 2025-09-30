import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, level, goals, notes } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ 
        error: 'Name and email are required' 
      }, { status: 400 })
    }

    // Create agents table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        level TEXT,
        join_date DATE DEFAULT CURRENT_DATE,
        goals TEXT,
        notes TEXT,
        last_contact TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insert new agent
    const result = await sql`
      INSERT INTO agents (name, email, phone, level, goals, notes)
      VALUES (${name}, ${email}, ${phone || ''}, ${level || 'New Agent'}, ${goals || ''}, ${notes || ''})
      RETURNING id, name, email, phone, level, goals, notes, join_date, last_contact
    `

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
    console.error('Error adding agent:', error)
    return NextResponse.json({
      error: 'Failed to add agent'
    }, { status: 500 })
  }
}
