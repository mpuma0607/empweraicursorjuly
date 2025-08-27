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
You are writing a single, comprehensive professional biography for ${formData.name}, an agent with ${formData.brokerage}. 
Details: ${formData.timeInIndustry} years in real estate. Origin: ${formData.origin}. Areas served: ${formData.areasServed}. Personal interests: ${formData.hobbies}. Contact: ${formData.email}. Language: English.

Goal: Build instant trust and connection with consumers through one beautiful, enhanced professional bio. 
Tone: warm, authentic, confident — no clichés. Flow like a compelling story that draws readers in.

Structure: Start with a natural introduction that establishes credibility, share key strengths and experience, describe the client experience and what sets them apart, weave in personal touches that create connection, then invite action.

VAK Language Integration:
- Visual: "Picture yourself working with someone who sees every detail..."
- Auditory: "You'll hear the confidence in their voice when they guide you..."
- Kinesthetic: "Feel the peace of mind that comes with having an expert by your side..."

NLP Embedded Commands: "Imagine having a guide who understands every step…", "You'll start to realize the difference experience makes...", "Notice how the process becomes seamless..."

DISC Appeal: Authority and clarity for D/C types, warmth and relationship-building for I/S types.

Length: 200-300 words for a comprehensive, professional bio that tells a complete story.

Write ONE enhanced professional bio that sounds human, conversational, and natural.`

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
