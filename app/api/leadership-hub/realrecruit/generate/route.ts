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

    // Build the prompt based on the form data with DISC/VAK/Elicitation principles
    const systemPrompt = `You are an expert real estate recruiting specialist who understands DISC personality types, VAK learning styles, and elicitation techniques. Generate personalized recruiting scripts that incorporate these psychological principles.

Script Type: ${scriptType}
Agent Level: ${agentLevel}
Tonality: ${tonality}
Agent Name: ${agentName}
${context ? `Context: ${context}` : ''}
${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}

CRITICAL REQUIREMENTS - Incorporate these psychological principles:

DISC PERSONALITY TYPES:
- D (Dominant): Direct, results-focused, competitive - use strong action words, focus on outcomes and achievements
- I (Influential): People-oriented, enthusiastic, social - emphasize relationships, team success, recognition
- S (Steady): Stable, supportive, methodical - highlight security, stability, proven processes
- C (Conscientious): Detail-oriented, analytical, quality-focused - provide data, facts, systematic approach

VAK LEARNING STYLES:
- Visual: Use visual language, imagery, "see the vision", "picture this", "clear picture"
- Auditory: Use sound-based language, "hear this", "listen to this", "sounds like"
- Kinesthetic: Use feeling/touch language, "feel the energy", "hands-on", "experience this"

ELICITATION TECHNIQUES:
- Use open-ended questions to uncover motivations
- Ask about their "why" and core values
- Explore their vision for their real estate career
- Understand their current challenges and pain points
- Identify their goals and aspirations

Generate a professional, personalized recruiting script that:
1. Uses the specified tonality throughout
2. Is appropriate for the agent's experience level
3. Is tailored for the specific script type
4. Includes the agent's name naturally
5. Incorporates DISC, VAK, and elicitation principles
6. Is compelling and psychologically engaging
7. Includes a clear call to action
8. Uses language that resonates with different personality types

Format the script as a complete, ready-to-use message that feels personal and psychologically attuned.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a ${scriptType} script for ${agentName}, a ${agentLevel} agent, using a ${tonality} tonality.` }
      ],
      max_tokens: 1000,
      temperature: 0.7,
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
