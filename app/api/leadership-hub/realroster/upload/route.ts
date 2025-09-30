import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Enhanced CSV Parser
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    console.log('CSV has less than 2 lines')
    return []
  }

  // Find the header row (look for the first line with multiple columns)
  let headerIndex = 0
  for (let i = 0; i < lines.length; i++) {
    const columns = lines[i].split(',').length
    if (columns > 1) {
      headerIndex = i
      break
    }
  }

  const headerLine = lines[headerIndex]
  console.log('Header line:', headerLine)
  
  // Parse headers more carefully
  const headers = parseCSVLine(headerLine)
  console.log('Parsed headers:', headers)

  const records = []

  // Process data rows
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line) {
      const values = parseCSVLine(line)
      if (values.length > 0) {
        const record: any = {}
        headers.forEach((header, index) => {
          const cleanHeader = header.trim().replace(/"/g, '').toLowerCase()
          record[cleanHeader] = values[index] ? values[index].trim().replace(/"/g, '') : ''
        })
        records.push(record)
      }
    }
  }

  console.log('Parsed records count:', records.length)
  return records
}

// Helper function to parse CSV line handling quotes and commas
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

export async function POST(req: NextRequest) {
  try {
    console.log('RealRoster upload API called')
    const formData = await req.formData()
    const file = formData.get('file') as File

    console.log('File received:', file?.name, file?.size)

    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const csvText = await file.text()
    console.log('CSV text length:', csvText.length)
    
    const records = parseCSV(csvText)
    console.log('Parsed records:', records.length)

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
    console.log('Processing', records.length, 'records')
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      console.log(`Record ${i}:`, record)
      
      // More flexible name matching
      const name = record.name || record.full_name || record.agent_name || record['agent name'] || 
                   record['full name'] || record.first_name || record.last_name || 
                   (record.first_name && record.last_name ? `${record.first_name} ${record.last_name}` : null) || 'Unknown'
      
      // More flexible email matching
      const email = record.email || record.email_address || record['email address'] || 
                   record['e-mail'] || record['email'] || ''
      
      // More flexible phone matching
      const phone = record.phone || record.phone_number || record.telephone || record['phone number'] || 
                   record['phone'] || record['mobile'] || record['cell'] || ''
      
      // More flexible level matching
      const level = record.level || record.agent_level || record.experience || record['agent level'] || 
                   record['experience level'] || record['level'] || 'New Agent'
      
      const agent = {
        id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        email: email,
        phone: phone,
        level: level,
        goals: record.goals || record.objectives || record['goals'] || '',
        notes: record.notes || record.comments || record['notes'] || '',
        joinDate: record.join_date || record.start_date || record['join date'] || record['start date'] || new Date().toISOString().split('T')[0],
        lastContact: record.last_contact || record['last contact'] || record['last_contact'] || ''
      }

      console.log('Processing agent:', agent.name, agent.email)

      // Only insert if we have at least a name
      if (agent.name !== 'Unknown') {
        try {
          await sql`
            INSERT INTO agents (name, email, phone, level, goals, notes, join_date, last_contact)
            VALUES (${agent.name}, ${agent.email}, ${agent.phone}, ${agent.level}, ${agent.goals}, ${agent.notes}, ${agent.joinDate}, ${agent.lastContact})
          `
          agents.push(agent)
          console.log('Successfully inserted agent:', agent.name)
        } catch (insertError) {
          console.error('Error inserting agent:', insertError)
          // Continue with other agents
        }
      } else {
        console.log('Skipping record with no valid name:', record)
      }
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
