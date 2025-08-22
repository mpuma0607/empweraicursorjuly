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
Generate: Real estate agent bio
Style: Professional, engaging, trust-building
Agent: ${formData.name}
Brokerage: ${formData.brokerage}
Time in Industry: ${formData.timeInIndustry}
Origin: ${formData.origin}
Areas Served: ${formData.areasServed}
Hobbies: ${formData.hobbies}

Create:
- Professional introduction
- Key achievements
- Specialties and expertise
- Call-to-action`

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
