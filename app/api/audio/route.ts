import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("file") || "advanced-fsbo-follow-up.mp3"

  try {
    const filePath = path.join(process.cwd(), "public", "audio", filename)

    // Check if file exists
    await fs.access(filePath)

    // Read the file
    const fileBuffer = await fs.readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "File not found or not readable",
        filename,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 404 },
    )
  }
}
