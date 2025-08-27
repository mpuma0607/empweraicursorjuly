"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type BioFormData = {
  name: string
  brokerage: string
  timeInIndustry: string
  origin: string
  areasServed: string
  hobbies: string
  email: string
}

export async function generateAgentBio(formData: BioFormData) {
  try {
    const prompt = `
You are a world-class biography writer and SEO strategist. Write ONE single, comprehensive professional biography for ${formData.name}, a real estate agent with ${formData.brokerage}.

Agent Details:
- Experience: ${formData.timeInIndustry} years in real estate
- Origin/Background: ${formData.origin}
- Areas served: ${formData.areasServed}
- Personal interests: ${formData.hobbies}
- Contact: ${formData.email}
- Language: English

Primary Goal:
- Build instant trust and connection with home buyers, sellers, and investors.
- Optimize the bio so it ranks well on Google, Realtor.com, Zillow, and AI-driven search engines.

Tone & Style:
- Warm, authentic, confident — no clichés, no generic fluff.
- Flow like a compelling story with natural transitions.
- Use varied sentence structures, avoid repetition.

Structure:
1. Start with a natural introduction that establishes credibility and local expertise.
2. Highlight strengths, track record, and real estate philosophy.
3. Describe the client experience — what it feels like to work with ${formData.name}.
4. Weave in personal details that create connection and memorability.
5. End with a call-to-action that naturally includes ${formData.areasServed} and ${formData.brokerage}.

Psychological Layering:
- **VAK Language**:
   - Visual: "Picture yourself..."
   - Auditory: "You'll hear the confidence..."
   - Kinesthetic: "Feel the peace of mind..."
- **NLP Embedded Commands**: "Imagine having a guide who...", "Notice how smooth the process feels..."
- **DISC Appeal**:
   - Clear facts and authority for D/C personalities.
   - Warmth and story for I/S personalities.

SEO Optimization:
- Naturally repeat ${formData.name}, ${formData.brokerage}, and ${formData.areasServed}.
- Include related real estate terms: "real estate advisor," "property specialist," "local expert."
- Keep the length between 200–300 words.

Final Output:
- A single enhanced biography that reads naturally, feels human, and is optimized for both people and AI search engines.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.7,
      prompt,
    })

    return {
      bio: text,
    }
  } catch (error) {
    console.error("Error generating agent bio:", error)
    throw new Error("Failed to generate agent bio. Please try again.")
  }
}
