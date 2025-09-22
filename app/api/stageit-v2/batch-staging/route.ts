import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const STAGING_STYLES = [
  {
    id: 'modern',
    name: 'Modern',
    prompt: 'Virtual-stage this room in modern style. IMPORTANT: Do not add windows, doors, or any architectural elements that don\'t exist in the original room. Only add furniture, decor, and staging elements. Preserve the exact room layout and architecture. Clean lines, neutral colors, contemporary furniture, minimalist decor, and sleek finishes. Use white, gray, and black color palette with geometric shapes and modern lighting. Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art. Preserve architecture (windows, doors, trim, flooring) exactly as shown. Realistic perspective, scale, and shadows. Photorealistic, listing-quality output.'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    prompt: 'Virtual-stage this room in Scandinavian style. IMPORTANT: Do not add windows, doors, or any architectural elements that don\'t exist in the original room. Only add furniture, decor, and staging elements. Preserve the exact room layout and architecture. Light woods, minimal furniture, hygge aesthetic, natural textures, white and light wood tones, cozy textiles, and simple, functional design elements. Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art. Preserve architecture (windows, doors, trim, flooring) exactly as shown. Realistic perspective, scale, and shadows. Photorealistic, listing-quality output.'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    prompt: 'Virtual-stage this room in industrial style. IMPORTANT: Do not add windows, doors, or any architectural elements that don\'t exist in the original room. Only add furniture, decor, and staging elements. Preserve the exact room layout and architecture. Exposed brick walls, metal accents, urban loft feel, concrete elements, dark wood, steel fixtures, Edison bulb lighting, and raw, unfinished textures. Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art. Preserve architecture (windows, doors, trim, flooring) exactly as shown. Realistic perspective, scale, and shadows. Photorealistic, listing-quality output.'
  },
  {
    id: 'midcentury',
    name: 'Midcentury',
    prompt: 'Virtual-stage this room in midcentury modern style. IMPORTANT: Do not add windows, doors, or any architectural elements that don\'t exist in the original room. Only add furniture, decor, and staging elements. Preserve the exact room layout and architecture. 1950s-60s furniture, bold colors, geometric patterns, teak wood, orange and mustard accents, atomic age design, and retro futuristic elements. Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art. Preserve architecture (windows, doors, trim, flooring) exactly as shown. Realistic perspective, scale, and shadows. Photorealistic, listing-quality output.'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    prompt: 'Virtual-stage this room in luxury style. IMPORTANT: Do not add windows, doors, or any architectural elements that don\'t exist in the original room. Only add furniture, decor, and staging elements. Preserve the exact room layout and architecture. High-end finishes, marble surfaces, gold accents, plush fabrics, crystal chandeliers, ornate details, rich colors, and sophisticated furniture pieces. Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art. Preserve architecture (windows, doors, trim, flooring) exactly as shown. Realistic perspective, scale, and shadows. Photorealistic, listing-quality output.'
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse',
    prompt: 'Virtual-stage this room in farmhouse style. IMPORTANT: Do not add windows, doors, or any architectural elements that don\'t exist in the original room. Only add furniture, decor, and staging elements. Preserve the exact room layout and architecture. Rustic charm, shiplap walls, vintage elements, distressed wood, neutral colors, floral patterns, mason jar lighting, and cozy, country-inspired decor. Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art. Preserve architecture (windows, doors, trim, flooring) exactly as shown. Realistic perspective, scale, and shadows. Photorealistic, listing-quality output.'
  },
  {
    id: 'coastal',
    name: 'Coastal',
    prompt: 'Virtual-stage this room in coastal style. IMPORTANT: Do not add windows, doors, or any architectural elements that don\'t exist in the original room. Only add furniture, decor, and staging elements. Preserve the exact room layout and architecture. Nautical themes, light blues and whites, beachy vibes, natural textures, rope accents, driftwood elements, seashell decor, and ocean-inspired colors. Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art. Preserve architecture (windows, doors, trim, flooring) exactly as shown. Realistic perspective, scale, and shadows. Photorealistic, listing-quality output.'
  }
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const roomType = formData.get('roomType') as string
    const userEmail = formData.get('userEmail') as string

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!roomType) {
      return NextResponse.json({ error: 'Room type is required' }, { status: 400 })
    }

    // Convert image to base64
    const imageBuffer = await image.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const mimeType = image.type

    console.log(`Starting batch staging for ${roomType} - ${STAGING_STYLES.length} styles`)

    // Process all styles in parallel
    const stagingPromises = STAGING_STYLES.map(async (style, index) => {
      try {
        console.log(`Processing style ${index + 1}/${STAGING_STYLES.length}: ${style.name}`)
        
        // Use the same API format as original StageIT
        const aiForm = new FormData()
        aiForm.append("model", "gpt-image-1")
        aiForm.append("prompt", `${style.prompt} for a ${roomType.toLowerCase()}.`)
        aiForm.append("size", "1024x1024")
        aiForm.append("image", imageBuffer, "image.png")

        const aiRes = await fetch("https://api.openai.com/v1/images/edits", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          body: aiForm,
        })

        if (!aiRes.ok) {
          const errorDetails = await aiRes.json().catch(() => ({ error: { message: `OpenAI error ${aiRes.status}` } }))
          throw new Error(errorDetails?.error?.message || `OpenAI error ${aiRes.status}`)
        }

        const json = await aiRes.json()
        const imageUrl = json?.data?.[0]?.url

        return {
          style: style.id,
          name: style.name,
          url: imageUrl,
          success: true
        }
      } catch (error) {
        console.error(`Error processing ${style.name}:`, error)
        return {
          style: style.id,
          name: style.name,
          url: null,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    // Wait for all styles to complete
    const results = await Promise.all(stagingPromises)
    
    // Add original image
    const originalImageUrl = `data:${mimeType};base64,${base64Image}`
    
    const allResults = [
      ...results,
      {
        style: 'original',
        name: 'Original',
        url: originalImageUrl,
        isOriginal: true,
        success: true
      }
    ]

    const successfulResults = allResults.filter(result => result.success)
    const failedResults = allResults.filter(result => !result.success)

    console.log(`Batch staging completed: ${successfulResults.length} successful, ${failedResults.length} failed`)

    return NextResponse.json({
      success: true,
      results: allResults,
      stats: {
        total: allResults.length,
        successful: successfulResults.length,
        failed: failedResults.length
      },
      roomType,
      processedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Batch staging error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process batch staging',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
