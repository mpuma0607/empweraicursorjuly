import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Simple CSV parser
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const records = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const record: any = {}
      headers.forEach((header, index) => {
        record[header.toLowerCase()] = values[index] || ''
      })
      records.push(record)
    }
  }

  return records
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const csvText = await file.text()
    const records = parseCSV(csvText)

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

    // Process and insert agents
    const agents = []
    for (const record of records) {
      const agent = {
        id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: record.name || record.full_name || record.agent_name || 'Unknown',
        email: record.email || record.email_address || '',
        phone: record.phone || record.phone_number || record.telephone || '',
        level: record.level || record.agent_level || record.experience || 'New Agent',
        goals: record.goals || record.objectives || '',
        notes: record.notes || record.comments || '',
        joinDate: record.join_date || record.start_date || new Date().toISOString().split('T')[0],
        lastContact: record.last_contact || ''
      }

      // Insert into database
      await sql`
        INSERT INTO agents (name, email, phone, level, goals, notes, join_date, last_contact)
        VALUES (${agent.name}, ${agent.email}, ${agent.phone}, ${agent.level}, ${agent.goals}, ${agent.notes}, ${agent.joinDate}, ${agent.lastContact})
      `

      agents.push(agent)
    }

    return NextResponse.json({
      success: true,
      agents,
      message: `Successfully processed ${agents.length} agents`
    })

  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({
      error: 'Failed to process CSV file'
    }, { status: 500 })
  }
}
