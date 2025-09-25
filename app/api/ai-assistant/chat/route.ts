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
    const { message, userContext, conversationHistory, knowledgeResults } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build knowledge base context
    let knowledgeContext = ''
    if (knowledgeResults && knowledgeResults.length > 0) {
      knowledgeContext = '\n\nRelevant Knowledge Base Information:\n'
      knowledgeResults.forEach((result: any, index: number) => {
        knowledgeContext += `${index + 1}. Q: ${result.question}\nA: ${result.answer}\n\n`
      })
    }

    // Build system prompt based on user context
    let systemPrompt = `You are an AI trainer and coach for real estate professionals. You help users navigate the platform, answer questions, and assist with real estate tasks while always directing them to relevant resources on the platform.

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

${knowledgeContext}

CORE BEHAVIOR:
1. Act as a trainer/coach who guides users to the right platform resources
2. Always provide specific links to relevant pages on the platform
3. Use the base URL: https://www.getempowerai.com
4. Be creative and helpful when creating content or scripts
5. Link to relevant platform pages after providing answers

KEY PLATFORM LINKS TO USE:
- Branded Social Graphics: https://www.getempowerai.com/marketing-hub/dynamic-branded-content
- Seller Process: https://www.getempowerai.com/seller-process (7Ps of working with sellers)
- Buyer Process: https://www.getempowerai.com/buyer-process
- Listing Process: https://www.getempowerai.com/listing-process
- Marketing Hub: https://www.getempowerai.com/marketing-hub
- Lead Hub: https://www.getempowerai.com/lead-hub
- AI Hub: https://www.getempowerai.com/ai-hub

IMPORTANT: 
1. If the user's query is directly answered by the "Relevant Knowledge Base Information" above, prioritize and use that information directly.
2. Always include relevant platform links in your responses.
3. When including URLs, format them as proper HTML links using <a href="URL" target="_blank">link text</a> so they are clickable.
4. Be helpful, professional, and specific to real estate.

EMAIL SENDING CAPABILITIES:
If the user asks you to send an email (like "email john@example.com about meeting on Tuesday"), you can send emails using their connected Gmail or Outlook account. 

To send an email, respond with a special JSON format:
{
  "action": "send_email",
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content"
}

CALENDAR CAPABILITIES:
If the user asks you to create a calendar event or meeting (like "schedule a meeting with john@example.com on Tuesday at 2pm"), you can create calendar events using their connected Gmail or Outlook account.

To create a calendar event, respond with a special JSON format:
{
  "action": "create_calendar_event",
  "title": "Meeting Title",
  "startTime": "2024-01-15T14:00:00",
  "endTime": "2024-01-15T15:00:00",
  "description": "Meeting description",
  "attendees": ["john@example.com"]
}

This will automatically create the calendar event using their connected calendar account.`

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
      temperature: 0.04, // 4% creativity for consistent, professional trainer responses
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

    // Check if the response contains an email action
    try {
      const emailActionMatch = response.match(/\{[\s\S]*"action":\s*"send_email"[\s\S]*\}/)
      if (emailActionMatch) {
        const emailAction = JSON.parse(emailActionMatch[0])
        
        if (emailAction.action === 'send_email' && emailAction.to && emailAction.subject && emailAction.body) {
          console.log('AI Assistant attempting to send email:', emailAction)
          
          // Send the email
          const emailResponse = await fetch(`${req.nextUrl.origin}/api/ai-assistant/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: emailAction.to,
              subject: emailAction.subject,
              body: emailAction.body,
              userEmail: userContext?.email
            })
          })

          if (emailResponse.ok) {
            const emailResult = await emailResponse.json()
            return NextResponse.json({ 
              response: `✅ Email sent successfully to ${emailAction.to}!\n\nSubject: ${emailAction.subject}\n\n${emailAction.body}`,
              emailSent: true,
              emailResult
            })
          } else {
            const error = await emailResponse.text()
            return NextResponse.json({ 
              response: `❌ Failed to send email: ${error}`,
              emailSent: false
            })
          }
        }
      }
    } catch (error) {
      console.error('Error parsing email action:', error)
      // Continue with normal response if parsing fails
    }

    // Check if the response contains a calendar action
    try {
      const calendarActionMatch = response.match(/\{[\s\S]*"action":\s*"create_calendar_event"[\s\S]*\}/)
      if (calendarActionMatch) {
        const calendarAction = JSON.parse(calendarActionMatch[0])
        
        if (calendarAction.action === 'create_calendar_event' && calendarAction.title && calendarAction.startTime && calendarAction.endTime) {
          console.log('AI Assistant attempting to create calendar event:', calendarAction)
          
          // Create the calendar event
          const calendarResponse = await fetch(`${req.nextUrl.origin}/api/ai-assistant/create-calendar-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: calendarAction.title,
              startTime: calendarAction.startTime,
              endTime: calendarAction.endTime,
              description: calendarAction.description || '',
              attendees: calendarAction.attendees || [],
              userEmail: userContext?.email
            })
          })

          if (calendarResponse.ok) {
            const calendarResult = await calendarResponse.json()
            return NextResponse.json({ 
              response: `✅ Calendar event created successfully!\n\nTitle: ${calendarAction.title}\nTime: ${new Date(calendarAction.startTime).toLocaleString()} - ${new Date(calendarAction.endTime).toLocaleString()}\nAttendees: ${calendarAction.attendees?.join(', ') || 'None'}`,
              calendarCreated: true,
              calendarResult
            })
          } else {
            const error = await calendarResponse.text()
            return NextResponse.json({ 
              response: `❌ Failed to create calendar event: ${error}`,
              calendarCreated: false
            })
          }
        }
      }
    } catch (error) {
      console.error('Error parsing calendar action:', error)
      // Continue with normal response if parsing fails
    }

    return NextResponse.json({ response })

  } catch (error) {
    console.error('AI Assistant API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
