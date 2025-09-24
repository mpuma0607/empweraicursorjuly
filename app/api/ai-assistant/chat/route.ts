import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface UserContext {
  email: string
  gmailConnected: boolean
  outlookConnected: boolean
  fubConnected: boolean
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, userContext, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build system prompt based on user context
    let systemPrompt = `You are an AI assistant for a real estate platform. You help users navigate the platform, answer questions, and assist with real estate tasks.

Platform Features:
- ScriptIT: AI-powered script generation for real estate communications
- ListIT: AI-powered listing descriptions
- StageIT: Virtual staging for property photos
- Lead Hub: CRM integration with Follow Up Boss
- Email Integration: Gmail and Outlook integration
- Calendar Integration: Schedule management
- Analytics: User activity tracking

User Context:
- Email: ${userContext?.email || 'Not available'}
- Gmail Connected: ${userContext?.gmailConnected ? 'Yes' : 'No'}
- Outlook Connected: ${userContext?.outlookConnected ? 'Yes' : 'No'}
- FUB CRM Connected: ${userContext?.fubConnected ? 'Yes' : 'No'}

Based on the user's connections, you can:
${userContext?.gmailConnected || userContext?.outlookConnected ? '- Help with email management and sending\n' : ''}
${userContext?.gmailConnected || userContext?.outlookConnected ? '- Assist with calendar scheduling\n' : ''}
${userContext?.fubConnected ? '- Help with CRM tasks and lead management\n' : ''}

Always be helpful, professional, and specific to real estate. If you don't know something, say so and offer to help them find the right resource.`

    // Prepare conversation history
    const messages: Message[] = [
      { role: 'assistant', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

    return NextResponse.json({ response })

  } catch (error) {
    console.error('AI Assistant API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
