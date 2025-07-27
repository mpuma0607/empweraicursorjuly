import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("PDF extraction API called")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("File received:", file.name, file.size, file.type)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log("File converted to buffer, size:", buffer.length)

    // Try to import and use pdf-parse
    try {
      // Use require instead of import to avoid build issues
      const pdfParse = require("pdf-parse")

      console.log("pdf-parse loaded successfully")

      // Extract text from PDF with minimal options
      const data = await pdfParse(buffer)
      const text = data.text

      console.log("Text extracted successfully, length:", text.length)

      if (!text || text.trim().length === 0) {
        throw new Error("No text could be extracted from the PDF")
      }

      // Limit to first 35,000 words (like your Zapier code)
      const words = text.split(" ").filter((word) => word.trim().length > 0)
      const limitedText = words.slice(0, 35000).join(" ")

      console.log("Words processed:", words.length, "Limited to:", Math.min(words.length, 35000))

      return NextResponse.json({
        text: limitedText,
        wordCount: Math.min(words.length, 35000),
        originalWordCount: words.length,
        truncated: words.length > 35000,
      })
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError)

      // Return a helpful error that suggests manual input
      return NextResponse.json(
        {
          error: "PDF text extraction failed",
          details: "Please copy and paste the contract text manually",
          suggestion: "manual_input_required",
        },
        { status: 422 },
      )
    }
  } catch (error) {
    console.error("General PDF extraction error:", error)
    return NextResponse.json(
      {
        error: "Failed to process PDF file",
        details: error instanceof Error ? error.message : "Unknown error",
        suggestion: "manual_input_required",
      },
      { status: 500 },
    )
  }
}
