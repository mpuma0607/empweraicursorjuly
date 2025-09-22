import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const STAGING_STYLES = [
  {
    id: 'modern',
    name: 'Modern',
    prompt: 'Transform this room into a modern style with clean lines, neutral colors, contemporary furniture, minimalist decor, and sleek finishes. Use white, gray, and black color palette with geometric shapes and modern lighting.'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    prompt: 'Transform this room into a Scandinavian style with light woods, minimal furniture, hygge aesthetic, natural textures, white and light wood tones, cozy textiles, and simple, functional design elements.'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    prompt: 'Transform this room into an industrial style with exposed brick walls, metal accents, urban loft feel, concrete elements, dark wood, steel fixtures, Edison bulb lighting, and raw, unfinished textures.'
  },
  {
    id: 'midcentury',
    name: 'Midcentury',
    prompt: 'Transform this room into a midcentury modern style with 1950s-60s furniture, bold colors, geometric patterns, teak wood, orange and mustard accents, atomic age design, and retro futuristic elements.'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    prompt: 'Transform this room into a luxury style with high-end finishes, marble surfaces, gold accents, plush fabrics, crystal chandeliers, ornate details, rich colors, and sophisticated furniture pieces.'
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse',
    prompt: 'Transform this room into a farmhouse style with rustic charm, shiplap walls, vintage elements, distressed wood, neutral colors, floral patterns, mason jar lighting, and cozy, country-inspired decor.'
  },
  {
    id: 'coastal',
    name: 'Coastal',
    prompt: 'Transform this room into a coastal style with nautical themes, light blues and whites, beachy vibes, natural textures, rope accents, driftwood elements, seashell decor, and ocean-inspired colors.'
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
        
        const response = await openai.images.edit({
          image: imageBuffer,
          prompt: `${style.prompt} for a ${roomType.toLowerCase()}. Make it look professional and realistic for real estate staging.`,
          n: 1,
          size: '1024x1024',
          response_format: 'url'
        })

        return {
          style: style.id,
          name: style.name,
          url: response.data[0].url,
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
