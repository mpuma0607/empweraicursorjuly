import { NextRequest, NextResponse } from "next/server"

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// fetch http(s) into a Blob
async function fetchToBlob(url: string, mime = "image/png") {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const ab = await res.arrayBuffer();
  return new Blob([ab], { type: mime });
}

// turn data: URL into a Blob
function dataUrlToBlob(dataUrl: string) {
  const m = /^data:(.+);base64,(.*)$/.exec(dataUrl);
  if (!m) throw new Error("Invalid data URL");
  const [, mime, b64] = m;
  const bin = Buffer.from(b64, "base64");
  return new Blob([bin], { type: mime });
}

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

    const OPENAI_API_KEY = need("OPENAI_API_KEY")

    // Convert blob URLs to image blobs
    let imageBlob: Blob
    let maskBlob: Blob | null = null

    if (/^https?:\/\//i.test(originalImage)) {
      imageBlob = await fetchToBlob(originalImage)
    } else if (originalImage.startsWith("data:")) {
      imageBlob = dataUrlToBlob(originalImage)
    } else {
      return NextResponse.json(
        { error: "originalImage must be http(s) or a data: URL" },
        { status: 400 }
      )
    }

    // Use the staged image as a mask/reference
    if (/^https?:\/\//i.test(stagedImage)) {
      maskBlob = await fetchToBlob(stagedImage)
    } else if (stagedImage.startsWith("data:")) {
      maskBlob = dataUrlToBlob(stagedImage)
    }

    // Create a prompt that incorporates the edit instructions
    const prompt = [
      `Virtual-stage this ${roomType} in ${style} style.`,
      colorPalette ? `Palette: ${colorPalette}.` : null,
      `Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art.`,
      `Preserve architecture (windows, doors, trim, flooring). Realistic perspective, scale, and shadows.`,
      `Edit instructions: ${instructions}`,
      `Photorealistic, listing-quality output.`
    ].filter(Boolean).join(" ")

    console.log('🎨 Generated prompt:', prompt)

    // Build outbound form to OpenAI (same as original StageIT)
    const aiForm = new FormData()
    aiForm.append("model", "gpt-image-1")
    aiForm.append("prompt", prompt)
    aiForm.append("size", "1024x1024")
    aiForm.append("image", imageBlob, "image.png")
    if (maskBlob) aiForm.append("mask", maskBlob, "mask.png")

    console.log(`Sending request to OpenAI with prompt: ${prompt.substring(0, 100)}...`)

    const aiRes = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: aiForm,
    })

    console.log(`OpenAI response status: ${aiRes.status} ${aiRes.statusText}`)

    if (!aiRes.ok) {
      let errorDetails
      try {
        errorDetails = await aiRes.json()
        console.error("OpenAI JSON error response:", errorDetails)
      } catch (jsonError) {
        try {
          const errorText = await aiRes.text()
          console.error("OpenAI text error response:", errorText)
          errorDetails = { text: errorText }
        } catch (textError) {
          console.error("Failed to read error response:", textError)
          errorDetails = { message: `OpenAI error ${aiRes.status}: ${aiRes.statusText}` }
        }
      }
      
      return NextResponse.json(
        { 
          error: errorDetails?.error?.message || errorDetails?.text || `OpenAI error ${aiRes.status}`, 
          details: errorDetails,
          status: aiRes.status,
          statusText: aiRes.statusText
        },
        { status: 502 }
      )
    }

    const json = await aiRes.json()
    const b64 = json?.data?.[0]?.b64_json
    if (!b64) throw new Error("OpenAI returned no image data")

    const bin = Buffer.from(b64, "base64")
    
    console.log('✅ Successfully generated edited staged image')

    return new Response(bin, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(bin.length),
        "Cache-Control": "no-store",
        "Content-Disposition": 'inline; filename="staged-edit.png"',
      },
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