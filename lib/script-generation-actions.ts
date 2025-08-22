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

    const prompt = `
Generate: Personalized property outreach script
Style: Professional, engaging, conversion-focused
Target: Property owners for real estate opportunities

Property: ${propertyAddress}
Owner: ${ownerNames.join(', ')}
Type: ${propertyType || 'Residential'}
Value: ${estimatedValue || 'Not specified'}
Details: ${propertyDetails || 'Standard residential property'}

Create:
- Personalized introduction
- Property-specific value proposition
- Call-to-action
- Professional closing`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.7,
      prompt,
    })

    return {
      script: text,
    }
  } catch (error) {
    console.error("Error generating script:", error)
    throw new Error("Failed to generate script. Please try again.")
  }
}
