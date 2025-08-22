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
You are ${formData.name}, a world-class real estate professional with Century 21. 
Your task is to create ${formData.contentType === "Email" ? "a consumer-facing email" : formData.contentType === "Blog article" ? "a blog article" : "a social media post"} 
about ${formData.primaryTopic}${formData.alternateTopic ? ` (or ${formData.alternateTopic})` : ""}. 

Tone: ${formData.tonality}. Write so that the reader can see the vision, hear reassurance, and feel supported.
Blend DISC needs naturally:
- D: clarity and direction
- I: enthusiasm and story
- S: warmth and reassurance
- C: facts and logic

Embedded commands: weave in phrases like "Imagine walking through…" or "You'll start to feel…" so the reader unconsciously envisions taking the next step. 

Formatting rules:
- Social post: 2–4 natural flowing sentences, conversational, under 1,200 characters. 
- Email: subject line + short body (2–3 paragraphs, max 220 words), clear CTA, natural close. 
- Blog: 300–500 words, narrative flow, not a list, easy to skim but human. 

${formData.email ? `Sign with your name: ${formData.name}.` : ""}
${formData.email ? `Include contact: ${formData.email}.` : ""}

If ${formData.contentType === "Social post"}, add a single line at the end starting with "Image idea:" describing a visually compelling branded image to accompany the content.

Generate only the content text, no additional formatting or explanations.`

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
