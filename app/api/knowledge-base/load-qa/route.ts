import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('userEmail')

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 })
    }

    // Load Q&A pairs from database
    const qaPairs = await sql`
      SELECT id, question, answer, category, created_at
      FROM knowledge_base 
      WHERE user_email = ${userEmail}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ 
      success: true, 
      qaPairs: qaPairs.map(qa => ({
        id: qa.id.toString(),
        question: qa.question,
        answer: qa.answer,
        category: qa.category,
        created_at: qa.created_at.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error loading Q&A pairs:', error)
    return NextResponse.json({ 
      error: 'Failed to load Q&A pairs' 
    }, { status: 500 })
  }
}
