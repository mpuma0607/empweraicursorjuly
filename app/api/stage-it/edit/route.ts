import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { originalImage, stagedImage, instructions, roomType, style, colorPalette } = await request.json()

    if (!originalImage || !stagedImage || !instructions) {
      return NextResponse.json(
        { error: 'Missing required fields: originalImage, stagedImage, instructions' },
        { status: 400 }
      )
    }

    console.log('🎨 STAGE-IT EDIT API - Starting image edit')
    console.log('📝 Instructions:', instructions)
    console.log('🏠 Room Type:', roomType, 'Style:', style)

    // Create a detailed prompt for the vision model
    const systemPrompt = `You are a professional virtual staging expert. You will be given:
1. An original room image
2. A staged version of that room
3. Specific edit instructions from the user

Your task is to analyze both images and the user's instructions, then generate a new staged image that incorporates the requested changes while maintaining the overall style and quality.

Guidelines:
- Maintain the original room's structure and layout
- Keep the same ${style} style and ${colorPalette} color palette
- Only make the specific changes requested by the user
- Ensure the final image looks professional and realistic
- If the user wants to remove something, make sure it's completely removed
- If the user wants to move something, position it naturally
- Maintain proper lighting and shadows
- Keep the image quality high and professional

User's edit instructions: "${instructions}"

Generate a new staged image that incorporates these changes while maintaining the ${style} style for this ${roomType}.`

    // Use GPT-4 Vision to analyze the images and generate a new staging prompt
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze these two images and the user's instructions, then provide a detailed prompt for generating a new staged image that incorporates the requested changes.

Original room image:`
            },
            {
              type: "image_url",
              image_url: {
                url: originalImage
              }
            },
            {
              type: "text",
              text: "Current staged image:"
            },
            {
              type: "image_url",
              image_url: {
                url: stagedImage
              }
            },
            {
              type: "text",
              text: `User's edit instructions: "${instructions}"

Please provide a detailed prompt for DALL-E to generate a new staged image that incorporates these changes while maintaining the ${style} style for this ${roomType}.`
            }
          ]
        }
      ],
      max_tokens: 1000
    })

    const stagingPrompt = visionResponse.choices[0]?.message?.content

    if (!stagingPrompt) {
      throw new Error('Failed to generate staging prompt')
    }

    console.log('🎨 Generated staging prompt:', stagingPrompt)

    // Generate the new staged image using DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: stagingPrompt,
      size: "1024x1024",
      quality: "hd",
      n: 1
    })

    const newStagedImageUrl = imageResponse.data[0]?.url

    if (!newStagedImageUrl) {
      throw new Error('Failed to generate new staged image')
    }

    console.log('✅ Successfully generated edited staged image')

    return NextResponse.json({
      success: true,
      stagedImage: newStagedImageUrl,
      instructions: instructions,
      prompt: stagingPrompt
    })

  } catch (error) {
    console.error('❌ Error in stage-it edit API:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to edit staged image', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
