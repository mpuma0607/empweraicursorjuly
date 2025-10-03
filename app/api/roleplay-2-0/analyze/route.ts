import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { audio, duration, userEmail } = await req.json()

    if (!audio) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 })
    }

    console.log('=== RolePlay 2.0 Analysis ===')
    console.log('Duration:', duration, 'seconds')
    console.log('User email:', userEmail)

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audio, 'base64')
    
    // Create a temporary file for the audio
    const audioFile = new File([audioBuffer], 'conversation.webm', { type: 'audio/webm' })
    
    // Transcribe audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word']
    })

    console.log('Transcription completed')
    console.log('Text length:', transcription.text.length)

    // Analyze the conversation using GPT-4
    const analysisPrompt = `
You are an expert sales coach analyzing a role-play conversation. Analyze the following conversation transcript and provide detailed feedback on the agent's performance.

CONVERSATION TRANSCRIPT:
${transcription.text}

ANALYSIS REQUIREMENTS:

1. TONE & DELIVERY (1-10):
   - Look for "up swings" (statements that sound like questions) - these are BAD and show lack of confidence
   - Look for "down swings" (confident, declarative statements) - these are GOOD and show authority
   - Analyze pacing, rhythm, energy levels, and overall delivery confidence

2. VAK MATCHING (1-10):
   - Visual: "I can see...", "Let me show you...", "Picture this...", "Looks like..."
   - Auditory: "I hear you...", "That sounds...", "Tell me more...", "Listen to this..."
   - Kinesthetic: "I feel...", "Let's walk through...", "Get a sense of...", "Touch base..."
   - Score how well they matched the customer's communication style

3. DISC ADAPTATION (1-10):
   - Dominant: Direct, results-focused, "Let's get this done"
   - Influential: Enthusiastic, people-focused, "This is exciting!"
   - Steady: Patient, relationship-focused, "Let's take our time"
   - Conscientious: Detail-oriented, process-focused, "Let me explain the steps"
   - Score how well they adapted to the customer's personality type

4. NLP TECHNIQUES (1-10):
   - Mirror matching: Language patterns, energy levels, speaking pace
   - Rapport building: Connection techniques, finding common ground
   - Objection handling: How they respond to resistance or concerns
   - Closing techniques: Natural progression to next steps
   - Embedded commands and suggestions

5. SPECIFIC FEEDBACK:
   - Identify specific up swings with timestamps (BAD)
   - Identify specific down swings with timestamps (GOOD)
   - Note VAK matching examples with timestamps
   - Note DISC adaptation examples with timestamps
   - Note NLP technique examples with timestamps
   - Provide actionable improvement suggestions

RESPONSE FORMAT (JSON):
{
  "overallScore": number (1-10),
  "toneScore": number (1-10),
  "vakScore": number (1-10),
  "discScore": number (1-10),
  "nlpScore": number (1-10),
  "feedback": [
    "Specific feedback item 1",
    "Specific feedback item 2",
    "etc..."
  ],
  "upswings": [
    {
      "timestamp": "1:23",
      "text": "I think the price is around 500k?"
    }
  ],
  "downswings": [
    {
      "timestamp": "2:15",
      "text": "The price is around 500k."
    }
  ],
  "vakMatches": [
    {
      "timestamp": "0:45",
      "technique": "Used visual language 'I can see' with visual customer",
      "score": 8
    }
  ],
  "discAdaptations": [
    {
      "timestamp": "1:30",
      "technique": "Adapted to Dominant style with direct approach",
      "score": 7
    }
  ],
  "nlpTechniques": [
    {
      "timestamp": "0:20",
      "technique": "Mirror matched customer's energy level",
      "score": 9
    }
  ]
}

IMPORTANT:
- Up swings are BAD (sounds like questions, lacks confidence)
- Down swings are GOOD (confident statements, shows authority)
- Be specific with timestamps and exact quotes
- Focus on actionable feedback for improvement
- Score harshly on up swings and reward down swings
`

    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    const analysisText = analysisResponse.choices[0]?.message?.content
    if (!analysisText) {
      throw new Error('No analysis response from OpenAI')
    }

    console.log('Analysis completed')

    // Parse the JSON response
    let analysisData
    try {
      analysisData = JSON.parse(analysisText)
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError)
      // Fallback analysis if JSON parsing fails
      analysisData = {
        overallScore: 6,
        toneScore: 6,
        vakScore: 6,
        discScore: 6,
        nlpScore: 6,
        feedback: [
          "Analysis completed but formatting issues detected. Please try again for detailed feedback.",
          "Conversation was recorded and transcribed successfully."
        ],
        upswings: [],
        downswings: [],
        vakMatches: [],
        discAdaptations: [],
        nlpTechniques: []
      }
    }

    console.log('Analysis data:', analysisData)

    return NextResponse.json(analysisData)

  } catch (error) {
    console.error('RolePlay 2.0 Analysis Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze conversation' },
      { status: 500 }
    )
  }
}
