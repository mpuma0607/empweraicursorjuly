import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { query, userEmail } = await req.json()

    if (!query || !userEmail) {
      return NextResponse.json({ 
        error: 'Query and user email are required' 
      }, { status: 400 })
    }

    console.log('Searching knowledge base for:', query, 'user:', userEmail)

    // Search the knowledge base for relevant Q&A pairs
    const results = await sql`
      SELECT id, question, answer, category
      FROM knowledge_base 
      WHERE user_email = ${userEmail}
      AND (
        LOWER(question) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(answer) LIKE LOWER(${'%' + query + '%'})
      )
      ORDER BY 
        CASE 
          WHEN LOWER(question) LIKE LOWER(${'%' + query + '%'}) THEN 1
          ELSE 2
        END,
        LENGTH(question) ASC
      LIMIT 5
    `

    console.log('Found', results.length, 'relevant Q&A pairs')

    return NextResponse.json({ 
      success: true, 
      results: results.map(qa => ({
        id: qa.id.toString(),
        question: qa.question,
        answer: qa.answer,
        category: qa.category,
        score: 0.9 // Simple scoring for now
      })),
      query: query
    })

  } catch (error) {
    console.error('Error searching knowledge base:', error)
    return NextResponse.json({ 
      error: 'Failed to search knowledge base' 
    }, { status: 500 })
  }
}
