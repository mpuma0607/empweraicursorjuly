"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function generateBusinessPlan(formData: {
  businessType: string
  targetMarket: string
  goals: string
  timeline: string
  budget: string
  experience: string
}) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a comprehensive business plan for a real estate professional with the following details:
      
Business Type: ${formData.businessType}
Target Market: ${formData.targetMarket}
Goals: ${formData.goals}
Timeline: ${formData.timeline}
Budget: ${formData.budget}
Experience Level: ${formData.experience}

Please provide a detailed business plan including:
1. Executive Summary
2. Market Analysis
3. Marketing Strategy
4. Financial Projections
5. Action Steps
6. Timeline and Milestones

Format the response in a professional, easy-to-read structure.`,
    })

    return { success: true, content: text }
  } catch (error) {
    console.error("Error generating business plan:", error)
    return { success: false, error: "Failed to generate business plan" }
  }
}

export async function generateDescription(formData: {
  propertyType: string
  bedrooms: string
  bathrooms: string
  squareFootage: string
  features: string
  location: string
  price: string
}) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a compelling real estate listing description for:
      
Property Type: ${formData.propertyType}
Bedrooms: ${formData.bedrooms}
Bathrooms: ${formData.bathrooms}
Square Footage: ${formData.squareFootage}
Key Features: ${formData.features}
Location: ${formData.location}
Price: ${formData.price}

Write an engaging, professional listing description that highlights the property's best features and appeals to potential buyers. Use descriptive language that helps buyers visualize living in the space.`,
    })

    return { success: true, content: text }
  } catch (error) {
    console.error("Error generating description:", error)
    return { success: false, error: "Failed to generate description" }
  }
}

export async function sendEmail(to: string, subject: string, content: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "The Next Level U <noreply@thenextlevelu.com>",
      to: [to],
      subject: subject,
      html: content,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
