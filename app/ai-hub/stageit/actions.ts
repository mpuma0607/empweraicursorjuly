"use server"

import { generateText } from "ai"
import OpenAI from "openai"

const openaiInstance = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface StagingRequest {
  roomType: string
  style: string
  colorPalette: string
  furnitureDensity: 'minimal' | 'moderate' | 'luxurious'
  lighting: string
  targetMarket: string
  additionalFeatures: string[]
  propertyValue: 'starter' | 'mid-range' | 'luxury'
  imageDescription?: string
}

export interface StagingResult {
  id: string
  originalImage: string
  stagedImage: string
  style: string
  prompt: string
  metadata: StagingRequest
  createdAt: Date
  aiDescription: string
}

export async function generateVirtualStaging(
  stagingRequest: StagingRequest,
  imageUrl: string
): Promise<StagingResult[]> {
  try {
    console.log('StageIT: Starting AI image staging...')
    console.log('StageIT: Staging request:', stagingRequest)
    
    // Convert image URL to base64 for OpenAI API
    const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer())
    const base64Image = Buffer.from(imageBuffer)
    
    // Build the comprehensive AI prompt for virtual staging
    const prompt = buildStagingPrompt(stagingRequest, imageUrl)
    console.log('StageIT: Generated prompt length:', prompt.length)
    
    console.log('StageIT: Calling OpenAI gpt-image-1 API...')
    
    // Call OpenAI gpt-image-1 for actual image editing
    const response = await openaiInstance.images.edit({
      image: base64Image,
      prompt: prompt,
      n: 2, // Generate 2 variations
      size: "1024x1024",
      response_format: "url"
    })
    
    console.log('StageIT: Generated', response.data.length, 'staged images')
    
    // Create results with actual staged images
    const results: StagingResult[] = response.data.map((imageData, index) => ({
      id: `staging-${Date.now()}-${index + 1}`,
      originalImage: imageUrl,
      stagedImage: imageData.url!, // The actual staged image from OpenAI!
      style: stagingRequest.style,
      prompt: prompt,
      metadata: stagingRequest,
      createdAt: new Date(),
      aiDescription: `AI-generated ${stagingRequest.style} staging for ${stagingRequest.roomType}`
    }))
    
    return results
    
  } catch (error) {
    console.error('StageIT: Error in image staging:', error)
    throw new Error('Failed to generate staged images. Please try again.')
  }
}

function buildStagingPrompt(stagingRequest: StagingRequest, imageUrl: string): string {
  const {
    roomType,
    style,
    colorPalette,
    furnitureDensity,
    lighting,
    targetMarket,
    propertyValue,
    additionalFeatures
  } = stagingRequest

  return `You are a world-class interior designer and virtual staging expert. 

I have uploaded a photo of a ${roomType} that needs virtual staging. 

STAGING REQUIREMENTS:
- Design Style: ${style}
- Color Palette: ${colorPalette}
- Furniture Density: ${furnitureDensity}
- Lighting Style: ${lighting}
- Target Market: ${targetMarket}
- Property Value Range: ${propertyValue}
- Additional Features: ${additionalFeatures.join(', ') || 'None specified'}

TASK:
Create a detailed, professional description of how this ${roomType} should be virtually staged. Focus on:

1. **Furniture Selection & Placement**: What specific furniture pieces would work best for this style and room type?
2. **Color Scheme**: How to implement the ${colorPalette} palette effectively
3. **Lighting Design**: How to achieve the ${lighting} lighting effect
4. **Accessories & Décor**: What finishing touches would complete the look?
5. **Market Appeal**: How to make this staging appeal to ${targetMarket} buyers
6. **Value Enhancement**: How this staging will increase the perceived value for ${propertyValue} properties

STYLE GUIDELINES:
- ${style === 'coastal' ? 'Use beach-inspired colors, natural materials, and breezy, relaxed furniture' : ''}
- ${style === 'modern' ? 'Focus on clean lines, minimal clutter, and contemporary furniture with sleek finishes' : ''}
- ${style === 'traditional' ? 'Emphasize classic furniture, rich fabrics, and timeless design elements' : ''}
- ${style === 'rustic' ? 'Incorporate natural wood, warm textures, and country-inspired furnishings' : ''}
- ${style === 'industrial' ? 'Use metal accents, exposed elements, and urban, warehouse-inspired pieces' : ''}
- ${style === 'scandinavian' ? 'Focus on light woods, neutral colors, and functional, minimalist design' : ''}
- ${style === 'mediterranean' ? 'Use warm earth tones, wrought iron, and Old World charm' : ''}
- ${style === 'contemporary' ? 'Blend modern and traditional elements with current design trends' : ''}
- ${style === 'luxury' ? 'Incorporate high-end materials, sophisticated furnishings, and premium finishes' : ''}
- ${style === 'mid-century' ? 'Use retro furniture, clean lines, and 1950s-60s design elements' : ''}
- ${style === 'bohemian' ? 'Layer textures, mix patterns, and create an eclectic, artistic feel' : ''}
- ${style === 'asian-fusion' ? 'Blend Eastern and Western design elements with zen-inspired simplicity' : ''}

OUTPUT FORMAT:
Provide a comprehensive staging plan that a virtual staging artist could follow to create the final image. Be specific about furniture types, colors, placement, and overall aesthetic goals.

Remember: This staging should help potential buyers visualize themselves living in this space and increase the property's market appeal.`
}

// Future: Add actual image generation integration
export async function generateStagedImage(
  originalImage: string,
  stagingPrompt: string
): Promise<string> {
  // This would integrate with:
  // - DALL-E 3 for image generation
  // - Midjourney API
  // - Stable Diffusion
  // - Or other AI image generation services
  
  // For now, return the original image
  // In production, this would call the AI image generation API
  return originalImage
}
