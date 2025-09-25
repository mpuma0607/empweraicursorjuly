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
    console.log('🔍 DEBUGGING: Let me check what\'s actually in the database...')
    console.log('🚀 FORCE REDEPLOY - DEBUGGING ACTIVE')

    // First, let's see what Q&A pairs exist (GLOBAL, not user-specific)
    const allQAs = await sql`
      SELECT id, question, answer, category
      FROM knowledge_base 
      LIMIT 10
    `
    console.log('📊 TOTAL Q&A PAIRS IN DATABASE:', allQAs.length)
    console.log('📋 Sample Q&A pairs:', allQAs.slice(0, 3))
    
    if (allQAs.length === 0) {
      console.log('🚨 CRITICAL: NO Q&A DATA FOUND IN DATABASE!')
      console.log('🚨 This means the CSV upload failed or data was not saved!')
    }
    
    // Debug: Show all questions to see what's actually stored
    if (allQAs.length > 0) {
      console.log('🔍 All stored questions:')
      allQAs.forEach((qa, index) => {
        console.log(`${index + 1}. Q: "${qa.question}"`)
        console.log(`   A: "${qa.answer.substring(0, 100)}..."`)
      })
      
      // Check if any questions contain "moxi" or "training"
      const moxiQuestions = allQAs.filter(qa => 
        qa.question.toLowerCase().includes('moxi') || 
        qa.answer.toLowerCase().includes('moxi') ||
        qa.question.toLowerCase().includes('training') || 
        qa.answer.toLowerCase().includes('training')
      )
      console.log('🎯 Moxi/Training related Q&A:', moxiQuestions.length)
      moxiQuestions.forEach((qa, index) => {
        console.log(`   ${index + 1}. Q: "${qa.question}"`)
        console.log(`      A: "${qa.answer.substring(0, 100)}..."`)
      })
    } else {
      console.log('❌ NO Q&A DATA FOUND FOR USER:', userEmail)
    }
    
    // Search the knowledge base for relevant Q&A pairs (GLOBAL, not user-specific)
    // Use flexible matching with multiple search approaches
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
    console.log('🔍 Search terms:', searchTerms)
    
    console.log('🔍 Searching for query:', query)
    console.log('🔍 Search pattern:', `%${query}%`)
    
    const results = await sql`
      SELECT id, question, answer, category
      FROM knowledge_base 
      WHERE (
        LOWER(question) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(answer) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(question) LIKE LOWER(${'%' + query.toLowerCase() + '%'}) OR
        LOWER(answer) LIKE LOWER(${'%' + query.toLowerCase() + '%'})
      )
      ORDER BY 
        CASE 
          WHEN LOWER(question) LIKE LOWER(${'%' + query + '%'}) THEN 1
          WHEN LOWER(answer) LIKE LOWER(${'%' + query + '%'}) THEN 2
          ELSE 3
        END,
        LENGTH(question) ASC
      LIMIT 5
    `

    console.log('Found', results.length, 'relevant Q&A pairs')
    console.log('🔍 Search results:', results)
    
    // Test a simple search to see if the database is working
    const testResults = await sql`
      SELECT id, question, answer, category
      FROM knowledge_base 
      WHERE question LIKE '%moxi%'
      LIMIT 3
    `
    console.log('🧪 Test search for "moxi":', testResults.length, 'results')
    console.log('🧪 Test results:', testResults)

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
