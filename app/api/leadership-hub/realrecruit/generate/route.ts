import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { agentName, agentLevel, scriptType, tonality, context, customInstructions } = await req.json()

    if (!agentName || !agentLevel || !scriptType || !tonality) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Build the prompt based on the form data with subtle psychological principles
    const systemPrompt = `You are an expert real estate recruiting specialist. Generate natural, engaging recruiting scripts that subtly incorporate psychological principles to create compelling, personalized messages.

Script Type: ${scriptType}
Agent Level: ${agentLevel}
Tonality: ${tonality}
Delivery Method: ${deliveryType}
Agent Name: ${agentName}
${context ? `Context: ${context}` : ''}
${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}

SCRIPT REQUIREMENTS:
1. Use the specified tonality naturally throughout
2. Tailor content to the agent's experience level
3. Format for the specified delivery method (email, phone, text, social DM, in-person)
4. Include the agent's name naturally and personally
5. Create curiosity and desire to discuss further
6. Use embedded commands and subtle psychological triggers
7. Include a clear, compelling call to action
8. Make it sound natural and conversational, not scripted

PSYCHOLOGICAL ELEMENTS (subtly integrated):
- Use embedded commands that create curiosity ("I'd love to hear your thoughts on...")
- Include visual language for impact ("picture this opportunity", "see yourself succeeding")
- Ask open-ended questions that elicit responses ("What's driving you in real estate?")
- Create urgency without pressure ("I have a few spots opening up...")
- Use social proof and testimonials naturally
- Address potential objections preemptively

The script should feel like a natural conversation starter that makes the recipient want to respond and learn more. Avoid being overly psychological or formulaic - make it sound authentic and engaging.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a ${scriptType} script for ${agentName}, a ${agentLevel} agent, using a ${tonality} tonality, delivered via ${deliveryType}.` }
      ],
      max_tokens: 1200,
      temperature: 0.8,
    })

    const script = completion.choices[0]?.message?.content || 'Failed to generate script'

    return NextResponse.json({ 
      success: true,
      script: script
    })

  } catch (error) {
    console.error('RealRecruit API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate script' 
    }, { status: 500 })
  }
}
