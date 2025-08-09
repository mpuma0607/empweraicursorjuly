"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type ScriptFormData = {
  agentName: string
  brokerageName: string
  scriptType: string
  topic: string
  customTopic: string
  additionalDetails: string
  agentEmail: string
}

export async function generateScript(formData: ScriptFormData) {
  try {
    // Determine the actual topic to use
    const actualTopic = formData.topic === "other" ? formData.customTopic : formData.topic

    // Convert topic value to readable format
    const topicMap: { [key: string]: string } = {
      "expired-listing": "Expired Listing",
      "first-time-homebuyer": "First Time Homebuyer",
      "past-client": "Past Client",
      neighbor: "Neighbor",
      fsbo: "FSBO (For Sale By Owner)",
      "homeowner-high-equity": "Homeowner with High Equity",
      foreclosure: "Foreclosure",
      rental: "Rental",
      divorce: "Divorce",
      "just-sold": "Just Sold",
    }

    const readableTopic = topicMap[formData.topic] || actualTopic

    const prompt = `Take on the role of an expert real estate scriptwriter and communication strategist for ${formData.brokerageName}, a professional real estate brokerage.

Using the information provided:

Script Type: ${formData.scriptType}
Topic: ${readableTopic}
Agent Name: ${formData.agentName}
${formData.additionalDetails ? `Additional Details: ${formData.additionalDetails}` : ""}

Your task:
Write a custom, compelling, and highly effective real estate script tailored to the selected topic and audience.

Must-Haves in Every Script:
• Speak from the perspective of a local, trusted real estate expert named ${formData.agentName}
• Ensure the tone is professional, polished, and human
• Leverage DISC behavioral principles to speak effectively to everyone so each script should take into account:
  - D (Dominance): Direct, results-driven, time-sensitive phrasing
  - I (Influence): Friendly, energetic, story-based language  
  - S (Steadiness): Reassuring, supportive, relationship-based phrasing
  - C (Conscientiousness): Detailed, factual, logic-based language

• Use VAK sensory language throughout to connect emotionally and mentally:
  - Visual cues: see, picture, imagine, look at
  - Auditory cues: hear, tell, listen, sound like
  - Kinesthetic cues: feel, touch, sense, experience

Format:
• Structure the script in a clean, organized format for easy delivery
• Provide optional alternate phrasing where appropriate (e.g., "If you're more data-driven, you might say it this way...")
• End with a clear, confident call-to-action that feels natural for the setting (e.g., "Let's connect this week" or "Would it be helpful if I showed you some local insights?")

The script should be appropriate for ${formData.scriptType} communication and feel natural and conversational while being highly effective.`

    const { text: generatedScript } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return {
      script: generatedScript,
    }
  } catch (error) {
    console.error("Error generating script:", error)
    throw new Error("Failed to generate script. Please try again.")
  }
}
