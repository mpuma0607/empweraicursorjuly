import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    console.log("=== Cloudinary Debug ===")
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME)
    console.log("API Key exists:", !!process.env.CLOUDINARY_API_KEY)
    console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET)

    // Test basic connection
    const testResult = await cloudinary.api.resources({
      type: "upload",
      max_results: 5,
    })

    console.log("Basic connection test successful")
    console.log("Total resources found:", testResult.resources.length)

    // Test specific folder searches
    const foldersToTest = [
      "social-content",
      "social-content/unbranded",
      "social-content/unbranded/motivational",
      "social-content/unbranded/educational",
      "social-content/unbranded/entertaining",
      "social-content/unbranded/engaging",
      "social-content/unbranded/prospecting",
    ]

    const folderResults: Record<string, any> = {}

    for (const folder of foldersToTest) {
      try {
        const result = await cloudinary.search
          .expression(`folder:${folder}`)
          .max_results(10)
          .execute()

        folderResults[folder] = {
          found: result.resources.length,
          resources: result.resources.map((r: any) => ({
            public_id: r.public_id,
            filename: r.filename,
            format: r.format,
          })),
        }
      } catch (error) {
        folderResults[folder] = {
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cloudinary debug completed",
      config: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      },
      basicTest: {
        totalResources: testResult.resources.length,
        sampleResources: testResult.resources.slice(0, 3).map((r: any) => ({
          public_id: r.public_id,
          filename: r.filename,
        })),
      },
      folderResults,
    })
  } catch (error) {
    console.error("Cloudinary debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        config: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          hasApiKey: !!process.env.CLOUDINARY_API_KEY,
          hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        },
      },
      { status: 500 }
    )
  }
} 