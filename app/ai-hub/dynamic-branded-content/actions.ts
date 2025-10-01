"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import OpenAI from "openai"

// Initialize OpenAI client for image generation
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type FormData = {
  topic: string
  imageChoice: "own" | "generate"
  customImage: File | null
  wantBranding: boolean
  brandingChoice: "saved-brand" | "saved-logo" | "dropdown" | "upload"
  selectedBrand: string
  customLogo: File | null
  savedLogoUrl?: string | null
  includeContact: boolean
  name: string
  email: string
  phone: string
  contentType: string
  tonality: string
  language: string
}

export async function generateDynamicContent(formData: FormData) {
  const { topic, language, contentType, tonality } = formData

  console.log("Starting dynamic content generation with:", {
    topic,
    imageChoice: formData.imageChoice,
    wantBranding: formData.wantBranding,
    brandingChoice: formData.brandingChoice,
    selectedBrand: formData.selectedBrand,
    hasCustomImage: !!formData.customImage,
    hasCustomLogo: !!formData.customLogo,
    hasSavedLogoUrl: !!formData.savedLogoUrl,
  })

  // Generate the text content using AI SDK
  const prompt = `You are {{agentName}} representing {{brand}}. Write a short social caption that pairs with a branded image about {{topic}} for {{audience}} to inspire them to SEE possibility, HEAR a confident guide, and FEEL ready to act.

Rules:
- 1 hook line
- 2 value lines using VAK phrasing
- 1 CTA with an embedded command (e.g., "**Tap to** explore your options today")
- 5–8 hashtags (localized if sensible)
- Keep under 550 characters.
- Tone: warm + pro.
- Output in {{language}}.

Content Type: ${contentType}
Topic: ${topic}
Language: ${language}
Tone: ${tonality}

Generate only the content text, no additional formatting or explanations.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 1, // GPT-5 only supports default temperature (1)
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
    console.error("Detailed error in generateDynamicContent:", error)
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
    uploadFormData.append("folder", "dynamic-content")

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
    // Generate image using OpenAI DALL-E with enhanced, contextual prompting
    const imagePrompt = `Create a stunning, photorealistic real estate image for social media that perfectly captures: ${topic}

PHOTOGRAPHY STYLE:
- Professional real estate photography aesthetic
- Shot with high-end DSLR camera (Canon 5D Mark IV or similar)
- Natural lighting with golden hour warmth when applicable
- Sharp focus, beautiful depth of field, professionally composed
- Magazine-quality, aspirational lifestyle imagery

CONTEXTUAL REQUIREMENTS FOR "${topic}":
- The image must be HIGHLY RELEVANT and contextual to this specific topic
- If about buyers/sellers, show real people in authentic moments (diverse, relatable, happy)
- If about homes, showcase beautiful residential architecture with curb appeal
- If about tips/advice, show the lifestyle benefit or outcome
- If about market trends, show upscale neighborhoods or modern homes
- If about investment, show luxury properties or successful homeowners

VISUAL ELEMENTS:
- Include relevant human elements when contextually appropriate (people viewing homes, families, agents helping clients)
- Showcase beautiful homes: modern architecture, classic charm, or coastal properties
- Capture emotional moments: joy of homeownership, excitement of touring, satisfaction of closing
- Use aspirational settings: well-designed interiors, manicured landscapes, inviting curb appeal

TECHNICAL SPECIFICATIONS:
- Photorealistic, NOT illustrated or cartoon style
- High resolution, optimized for Instagram/Facebook
- Vivid colors with professional color grading
- Leave the bottom right area slightly less busy for logo placement
- NO text, numbers, signs, or any written content in the image
- Professional composition following rule of thirds

LIGHTING & MOOD:
- Natural, warm lighting that creates an inviting atmosphere
- Bright and optimistic feel that inspires action
- Professionally lit to highlight architectural details
- Golden hour or soft daylight aesthetic

The final image should look like it belongs in a luxury real estate magazine - professional, aspirational, and perfectly aligned with the topic.`

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
    // Upload generated image to Cloudinary
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: generatedImageUrl,
        upload_preset: uploadPreset,
        folder: "dynamic-content",
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
    brandingChoice: formData.brandingChoice,
    selectedBrand: formData.selectedBrand,
    hasCustomLogo: !!formData.customLogo,
    hasSavedLogoUrl: !!formData.savedLogoUrl,
    includeContact: formData.includeContact,
  })

  // Start with base transformation - social media optimized size
  let transformationUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_1200,h_630`

  // Add logo overlay if branding is requested
  if (formData.wantBranding) {
    if (formData.brandingChoice === "saved-brand" && formData.selectedBrand) {
      console.log("Adding saved brand logo:", formData.selectedBrand)
      // Use saved brand logo with correct Cloudinary syntax
      transformationUrl += `/l_${formData.selectedBrand}/w_150/fl_layer_apply,g_south_east,x_30,y_30`
    } else if (formData.brandingChoice === "saved-logo" && formData.savedLogoUrl) {
      console.log("Using saved logo URL from profile:", formData.savedLogoUrl)
      // Extract public_id from saved logo URL for overlay
      const publicIdMatch = formData.savedLogoUrl.match(/\/([^/]+)\.(jpg|jpeg|png|gif|webp)$/i)
      if (publicIdMatch) {
        const savedLogoPublicId = publicIdMatch[1]
        transformationUrl += `/l_branding-logos:${savedLogoPublicId}/w_150/fl_layer_apply,g_south_east,x_30,y_30`
      }
    } else if (formData.brandingChoice === "dropdown" && formData.selectedBrand) {
      console.log("Adding dropdown selected brand:", formData.selectedBrand)
      transformationUrl += `/l_${formData.selectedBrand}/w_150/fl_layer_apply,g_south_east,x_30,y_30`
    } else if (formData.brandingChoice === "upload" && formData.customLogo) {
      console.log("Uploading and adding custom logo...")
      try {
        // Upload custom logo first and get its public_id
        const logoPublicId = await uploadCustomLogo(formData.customLogo)
        console.log("Custom logo uploaded with public_id:", logoPublicId)
        transformationUrl += `/l_dynamic-content:${logoPublicId}/w_150/fl_layer_apply,g_south_east,x_30,y_30`
      } catch (error) {
        console.error("Failed to upload custom logo:", error)
        throw new Error(`Custom logo upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
  }

  // Add contact info text overlay if requested - WHITE TEXT for visibility
  if (formData.includeContact && formData.name) {
    console.log("Adding contact info overlay in WHITE text...")
    const contactParts = [formData.name, formData.email, formData.phone].filter(Boolean)
    const contactText = contactParts.join(" | ")
    const encodedContact = encodeURIComponent(contactText)
    // WHITE text with black outline for maximum visibility
    transformationUrl += `/l_text:Arial_24_bold:${encodedContact}/co_white/bo_2px_solid_black/fl_layer_apply,g_south_west,x_30,y_30`
  }

  // Add the base image public_id at the end
  transformationUrl += `/${baseImagePublicId}`

  console.log("Final transformation URL:", transformationUrl)
  return transformationUrl
}

async function uploadCustomLogo(logoFile: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing")
  }

  console.log("=== CUSTOM LOGO UPLOAD START (FormData Method) ===")
  console.log("Logo file details:", {
    name: logoFile.name,
    size: logoFile.size,
    type: logoFile.type,
  })

  try {
    // Convert File to Blob for FormData upload
    console.log("Converting File to ArrayBuffer...")
    const arrayBuffer = await logoFile.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: logoFile.type })

    console.log("Creating FormData for logo upload...")
    // Create FormData for upload
    const uploadFormData = new FormData()
    uploadFormData.append("file", blob, logoFile.name)
    uploadFormData.append("upload_preset", uploadPreset)
    uploadFormData.append("folder", "dynamic-content")

    console.log("Uploading logo with FormData...")
    // Upload using FormData
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadFormData,
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

    // Extract clean public_id (remove dynamic-content/ prefix if present)
    let publicId = result.public_id
    console.log("Original logo public_id:", publicId)

    if (publicId.startsWith("dynamic-content/")) {
      publicId = publicId.replace("dynamic-content/", "")
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