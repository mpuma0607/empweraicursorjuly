import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question, answer, category, userEmail } = await req.json()

    if (!question || !answer || !userEmail) {
      return NextResponse.json({ 
        error: 'Question, answer, and user email are required' 
      }, { status: 400 })
    }

    // Create Q&A pair
    const qaPair = {
      id: `qa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: question.trim(),
      answer: answer.trim(),
      category: category?.trim() || 'General',
      created_at: new Date().toISOString(),
      user_email: userEmail
    }

    // TODO: Store in database and create embeddings
    // For now, we'll just return the created data
    // In the next step, we'll add database storage and vector embeddings

    return NextResponse.json({ 
      success: true, 
      qaPair,
      message: 'Q&A pair added successfully'
    })

  } catch (error) {
    console.error('Error adding Q&A:', error)
    return NextResponse.json({ 
      error: 'Failed to add Q&A pair' 
    }, { status: 500 })
  }
}
