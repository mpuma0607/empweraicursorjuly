"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import OpenAI from "openai"

// Initialize OpenAI client for image generation
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type FormData = {
  primaryTopic: string
  alternateTopic: string
  imageChoice: "own" | "generate"
  customImage: File | null
  wantBranding: boolean
  selectedBrand: string
  customLogo: File | null
  includeContact: boolean
  name: string
  email: string
  phone: string
  contentType: string
  tonality: string
  language: string
}

export async function generateContent(formData: FormData) {
  const topic = formData.primaryTopic || formData.alternateTopic
  const { language, contentType, tonality } = formData

  console.log("Starting content generation with:", {
    topic,
    imageChoice: formData.imageChoice,
    wantBranding: formData.wantBranding,
    selectedBrand: formData.selectedBrand,
    hasCustomImage: !!formData.customImage,
    hasCustomLogo: !!formData.customLogo,
  })

  // Generate the text content using AI SDK
  const prompt = `
Write a ${contentType.toLowerCase()} in English with a ${tonality.toLowerCase()} voice about "${topic}". 
Audience is consumers (buyers/sellers/homeowners). Produce only the ${contentType.toLowerCase()} text itself—no labels, no headings, no explanation, no hashtags unless it's a social post, and never mention images or visuals as a separate instruction.

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
- Output only the ${contentType.toLowerCase()} content with no prefaces or postfaces.
- No asterisks, no em dashes. Use simple punctuation and clean spacing.

${formData.includeContact ? `Sign with your name: ${formData.name}.` : ""}
${formData.includeContact ? `Include contact: ${formData.email}.` : ""}`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.7,
      prompt,
    })

    console.log("Text generation successful")

    // Handle image generation and processing
    let imageUrl = ""

    if (formData.imageChoice === "own" && formData.customImage) {
      console.log("Processing custom image...")
      imageUrl = await processCustomImage(formData)
    } else {
      console.log("Generating AI image...")
      imageUrl = await generateAndProcessImage(formData, topic)
    }

    console.log("Final image URL:", imageUrl)

    return {
      text,
      imageUrl,
    }
  } catch (error) {
    console.error("Detailed error in generateContent:", error)
    if (error instanceof Error) {
      throw new Error(`Content generation failed: ${error.message}`)
    }
    throw new Error("Failed to generate content - unknown error")
  }
}

async function processCustomImage(formData: FormData): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  console.log("Cloudinary config:", { cloudName: !!cloudName, uploadPreset: !!uploadPreset })

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing")
  }

  if (!formData.customImage) {
    throw new Error("No custom image provided")
  }

  try {
    console.log("Preparing custom image for upload...")
    console.log("Image details:", {
      name: formData.customImage.name,
      size: formData.customImage.size,
      type: formData.customImage.type,
    })

    // Convert File to Blob for FormData upload
    const arrayBuffer = await formData.customImage.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: formData.customImage.type })

    console.log("Creating FormData for upload...")

    // Create FormData for upload
    const uploadFormData = new FormData()
    uploadFormData.append("file", blob, formData.customImage.name)
    uploadFormData.append("upload_preset", uploadPreset)
    uploadFormData.append("folder", "logos")

    console.log("Uploading to Cloudinary with FormData...")

    // Upload to Cloudinary using FormData
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadFormData,
    })

    const uploadResult = await uploadResponse.json()

    console.log("Cloudinary upload response:", {
      ok: uploadResponse.ok,
      status: uploadResponse.status,
      result: uploadResult,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResult.error?.message || JSON.stringify(uploadResult)}`)
    }

    console.log("Custom image uploaded successfully, building transformation URL...")

    // Apply transformations and return final URL
    return buildTransformationUrl(uploadResult.public_id, formData)
  } catch (error) {
    console.error("Detailed error in processCustomImage:", error)
    if (error instanceof Error) {
      throw new Error(`Custom image processing failed: ${error.message}`)
    }
    throw new Error("Failed to process custom image - unknown error")
  }
}

async function generateAndProcessImage(formData: FormData, topic: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing")
  }

  try {
    console.log("Generating image with DALL-E...")

    // Generate image using OpenAI DALL-E
    const imagePrompt = `Create a professional, high-quality real estate themed image for: ${topic}. 
    Style: Modern, clean, professional
    Colors: Warm, inviting, professional real estate colors
    Content: Should be relevant to real estate and the topic
    Quality: High resolution, suitable for social media
    Avoid: Text, logos, or branding in the generated image`

    const imageResponse = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    })

    const generatedImageUrl = imageResponse.data?.[0]?.url
    if (!generatedImageUrl) {
      throw new Error("Failed to generate image")
    }

    console.log("DALL-E image generated, uploading to Cloudinary...")

    // Upload generated image to Cloudinary - using logos folder (same as custom images)
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: generatedImageUrl,
        upload_preset: uploadPreset,
        folder: "logos",
      }),
    })

    const uploadResult = await uploadResponse.json()

    console.log("AI image upload response:", {
      ok: uploadResponse.ok,
      status: uploadResponse.status,
      result: uploadResult,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResult.error?.message || JSON.stringify(uploadResult)}`)
    }

    console.log("AI image uploaded successfully, building transformation URL...")

    // Apply transformations and return final URL
    return buildTransformationUrl(uploadResult.public_id, formData)
  } catch (error) {
    console.error("Detailed error in generateAndProcessImage:", error)
    if (error instanceof Error) {
      throw new Error(`AI image generation failed: ${error.message}`)
    }
    throw new Error("Failed to generate and process image - unknown error")
  }
}

async function buildTransformationUrl(baseImagePublicId: string, formData: FormData): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    throw new Error("Cloudinary configuration missing")
  }

  console.log("Building transformation URL for:", {
    baseImagePublicId,
    wantBranding: formData.wantBranding,
    selectedBrand: formData.selectedBrand,
    hasCustomLogo: !!formData.customLogo,
    includeContact: formData.includeContact,
  })

  // Start with base transformation
  let transformationUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_1200,h_630`

  // Add logo overlay if branding is requested
  if (formData.wantBranding) {
    if (formData.selectedBrand) {
      console.log("Adding preset brand logo:", formData.selectedBrand)
      // Use preset brand logo with correct Cloudinary syntax
      transformationUrl += `/l_${formData.selectedBrand}/w_150/fl_layer_apply,g_south_east,x_30,y_30`
    } else if (formData.customLogo) {
      console.log("Uploading and adding custom logo...")
      try {
        // Upload custom logo first and get its public_id
        const logoPublicId = await uploadCustomLogo(formData.customLogo)
        console.log("Custom logo uploaded with public_id:", logoPublicId)
        transformationUrl += `/l_logos:${logoPublicId}/w_150/fl_layer_apply,g_south_east,x_30,y_30`
      } catch (error) {
        console.error("Failed to upload custom logo:", error)
        throw new Error(`Custom logo upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
  }

  // Add contact info text overlay if requested
  if (formData.includeContact && formData.name) {
    console.log("Adding contact info overlay...")
    const contactParts = [formData.name, formData.email, formData.phone].filter(Boolean)
    const contactText = contactParts.join(" | ")
    const encodedContact = encodeURIComponent(contactText)
    transformationUrl += `/l_text:Arial_24_bold:${encodedContact}/co_white/fl_layer_apply,g_south_west,x_30,y_30`
  }

  // Add the base image public_id at the end
  transformationUrl += `/${baseImagePublicId}`

  console.log("Final transformation URL:", transformationUrl)

  return transformationUrl
}

async function uploadCustomLogo(logoFile: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    throw new Error("Cloudinary configuration missing")
  }

  console.log("=== CUSTOM LOGO UPLOAD START (FormData Method) ===")
  console.log("Logo file details:", {
    name: logoFile.name,
    size: logoFile.size,
    type: logoFile.type,
  })

  try {
    // Convert File to Blob for FormData upload (same as processCustomImage)
    console.log("Converting File to ArrayBuffer...")
    const arrayBuffer = await logoFile.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: logoFile.type })

    console.log("Creating FormData for logo upload...")

    // Create FormData for upload - SAME METHOD AS processCustomImage
    const uploadFormData = new FormData()
    uploadFormData.append("file", blob, logoFile.name)
    uploadFormData.append("upload_preset", "agent_logo_upload")
    uploadFormData.append("folder", "logos")

    console.log("Uploading logo with FormData (NO base64)...")

    // Upload using FormData - SAME METHOD AS processCustomImage
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadFormData, // Pure FormData, no JSON
    })

    const result = await uploadResponse.json()

    console.log("Logo upload response:", {
      ok: uploadResponse.ok,
      status: uploadResponse.status,
      result: result,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Logo upload failed: ${result.error?.message || JSON.stringify(result)}`)
    }

    // Extract clean public_id (remove logos/ prefix if present)
    let publicId = result.public_id
    console.log("Original logo public_id:", publicId)

    if (publicId.startsWith("logos/")) {
      publicId = publicId.replace("logos/", "")
      console.log("Cleaned logo public_id:", publicId)
    }

    console.log("=== CUSTOM LOGO UPLOAD SUCCESS ===")
    return publicId
  } catch (error) {
    console.error("=== CUSTOM LOGO UPLOAD ERROR ===")
    console.error("Error details:", error)
    if (error instanceof Error) {
      throw new Error(`Logo upload failed: ${error.message}`)
    }
    throw new Error("Failed to upload custom logo - unknown error")
  }
}
