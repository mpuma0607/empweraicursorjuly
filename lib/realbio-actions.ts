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
    const prompt = `You are an expert prompt engineer and professional real estate copywriter. Write a compelling, first-person real estate agent bio that is polished, professional, and emotionally resonant. The bio should instantly connect with all personality types—visual (use words like see, show, picture), auditory (hear, tell, listen), and kinesthetic (feel, experience, guide)—by weaving in sensory-based language throughout.

Here are the required details to include:

Name: ${formData.name}
Brokerage: ${formData.brokerage}
Time in Industry: ${formData.timeInIndustry}
Origin: ${formData.origin}
Areas Served: ${formData.areasServed}
Hobbies: ${formData.hobbies}

Ensure the bio communicates the agent's passion for helping clients buy, sell, invest, or rent. Emphasize their ability to guide people through every step of the process with confidence, clarity, and care. Highlight any unique strategies or perspectives they bring that set them apart in the real estate world.

The tone should reflect warmth, trustworthiness, and professionalism—sounding human, not robotic. Each bio should feel personal, distinct, and aligned with the agent's personality and brand.

Avoid clichés. Write like you're telling a story that helps the reader see the person, hear their values, and feel inspired to work with them.

The bio should be approximately 150-250 words and written in first person.`

    const { text: generatedBio } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return {
      bio: generatedBio,
    }
  } catch (error) {
    console.error("Error generating agent bio:", error)
    throw new Error("Failed to generate agent bio. Please try again.")
  }
}
