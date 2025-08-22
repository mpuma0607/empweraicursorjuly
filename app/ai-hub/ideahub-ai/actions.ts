"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import OpenAI from "openai"

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type FormData = {
  primaryTopic: string
  alternateTopic: string
  language: string
  name: string
  email: string
  contentType: string
  tonality: string
}

async function addLogoToImage(imageUrl: string): Promise<string> {
  try {
    // For Next.js, we'll return the original image URL since we can't process images server-side
    // In a full Next.js environment, this would use Sharp for image processing
    console.log("Image processing skipped in browser environment")
    return imageUrl
  } catch (error) {
    console.error("Error with image processing:", error)
    return imageUrl
  }
}

export async function generateContent(formData: FormData) {
  try {
    // Determine the topic to use
    const topicToUse = formData.primaryTopic || formData.alternateTopic
    if (!topicToUse) {
      throw new Error("Please provide either a selected topic or custom topic")
    }

    // Generate content type specific prompts with appropriate length constraints
    let contentTypeInstructions = ""
    let characterLimit = ""

    switch (formData.contentType) {
      case "Social post":
        contentTypeInstructions =
          "Create a professional social media post that is engaging and shareable. Focus on being concise while still providing value."
        characterLimit = "Keep the post under 280 characters to ensure it works well across all social platforms."
        break
      case "Text message":
        contentTypeInstructions =
          "Create a brief, friendly text message that gets straight to the point. Use a conversational tone appropriate for SMS."
        characterLimit = "Keep the message under 160 characters to fit in a single SMS."
        break
      case "Email":
        contentTypeInstructions =
          "Create a professional email with a clear subject line, proper greeting, informative body content, and appropriate closing. Structure it with proper email formatting."
        characterLimit = "Write a complete email with full details and explanations."
        break
      case "Blog article":
        contentTypeInstructions =
          "Create a comprehensive blog article with an engaging title, introduction, main content with subheadings, and conclusion. Make it informative and valuable for readers."
        characterLimit = "Write a full-length article with detailed explanations and examples."
        break
      default:
        contentTypeInstructions = "Create a professional social media post that is engaging and shareable."
        characterLimit = "Keep the post under 280 characters."
    }

    const prompt = `
Write a ${formData.contentType.toLowerCase()} in English with a ${formData.tonality.toLowerCase()} voice about "${formData.primaryTopic}${formData.alternateTopic ? ` (or ${formData.alternateTopic})` : ""}". 
Audience is consumers (buyers/sellers/homeowners). Produce only the ${formData.contentType.toLowerCase()} text itself—no labels, no headings, no explanation, no hashtags unless it's a social post, and never mention images or visuals as a separate instruction.

Style targets:
- Natural cadence that sounds spoken, not listy. Mix short and medium sentences.
- VAK language woven into normal phrasing so readers can see possibilities, hear reassurance, and feel momentum.
- Embedded commands blended into sentences (e.g., "imagine walking in," "notice how the plan comes together," "go ahead and pick a time that works").
- Subtle DISC coverage: clear direction and options (D), friendly enthusiasm (I), calm reassurance (S), and a touch of practical detail or logic (C).

Channel rules:
- If Social post: 2–4 flowing sentences, light and shareable, soft CTA at the end. Up to ~900–1200 characters maximum. Hashtags optional (0–3) and only if they feel natural at the end.
- If Email: Subject line first, then greeting and 2–3 short paragraphs (≤ 220 words total), and a plain CTA line to reply or schedule. No bullets.
- If Blog article: 300–500 words, conversational narrative with clear arc and a single CTA in the final lines. No headings.
- If Text message: 1–2 warm, direct sentences (≤ 240 characters), one simple CTA. No links unless natural.

Important output constraints:
- Output only the ${formData.contentType.toLowerCase()} content with no prefaces or postfaces.
- No asterisks, no em dashes. Use simple punctuation and clean spacing.

${formData.email ? `Sign with your name: ${formData.name}.` : ""}
${formData.email ? `Include contact: ${formData.email}.` : ""}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.7,
      prompt,
    })

    // Generate image
    const imagePrompt = `You are an elite graphic designer for a Century 21 real estate brokerage. Your task is to create a **realistic, photo-quality, high-definition image** to accompany the following social media post:

${text.substring(0, 300)}...

Design requirements:
- The image must align visually and emotionally with the message or theme of the post
- Use **vivid color, natural lighting, professional composition, and realistic textures**
- Ensure it's **scroll-stopping** and optimized for social platforms (Instagram, Facebook, LinkedIn)
- **Do not include any text or captions** on the image itself
- Leave some space in the bottom right corner for branding

This image should look like it was taken by a professional photographer and should enhance the brand's credibility and aesthetic appeal.`

    const imageResponse = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    })

    const generatedImageUrl = imageResponse.data?.[0]?.url
    if (!generatedImageUrl) {
      throw new Error("Failed to generate image")
    }

    // In browser environment, use original image URL
    const processedImageUrl = await addLogoToImage(generatedImageUrl)

    return {
      text: text,
      imageUrl: processedImageUrl,
      imageBuffer: null, // No buffer processing in browser environment
    }
  } catch (error) {
    console.error("Error generating content:", error)
    throw new Error("Failed to generate content. Please try again.")
  }
}
