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
You are writing a professional biography for ${formData.name}, an agent with ${formData.brokerage}. 
Details: ${formData.timeInIndustry} years in real estate. Origin: ${formData.origin}. Areas served: ${formData.areasServed}. Personal interests: ${formData.hobbies}. Contact: ${formData.email}. Language: English.

Goal: Build instant trust and connection with consumers. 
Tone: warm, authentic, confident — no clichés. Flow like a story: start with a natural introduction, share strengths, describe client experience, weave in a personal touch, then invite connection. 

Embed commands: "Imagine having a guide who understands every step…" 
Use sensory language: clients should see the process clearly, hear guidance, feel supported. 
Appeal across DISC: authority for D/C, warmth for I/S. 

Deliver 3 versions:
1. Short (80–100 words) — sharp snapshot, easy to paste.  
2. Standard (150–180 words) — fuller story with balance of personal + professional.  
3. Social caption (≤550 characters) — engaging, natural, single CTA.  

All versions must sound human, conversational, and natural.`

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
