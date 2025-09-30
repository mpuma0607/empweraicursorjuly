import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { title, content, type, tool } = await req.json()

    console.log('Save to creations called:', { title, type, tool })

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Create creations table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS creations (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT,
        tool TEXT,
        user_email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Get user email from headers
    const userEmail = req.headers.get('x-user-email') || 'mikepuma@c21be.com'

    // Insert creation
    const result = await sql`
      INSERT INTO creations (title, content, type, tool, user_email)
      VALUES (${title}, ${content}, ${type || 'script'}, ${tool || 'Unknown'}, ${userEmail})
      RETURNING id
    `

    return NextResponse.json({ 
      success: true, 
      creationId: result[0].id,
      message: 'Saved to creations successfully'
    })

  } catch (error) {
    console.error('Save to creations error:', error)
    return NextResponse.json({ error: 'Failed to save to creations' }, { status: 500 })
  }
}
