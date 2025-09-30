import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const customInstructions = formData.get('customInstructions') as string

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Create reports table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        file_data BYTEA,
        custom_instructions TEXT,
        status TEXT DEFAULT 'processing',
        insights TEXT,
        summary TEXT,
        trends TEXT[],
        key_metrics JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    
    // Insert report record
    const result = await sql`
      INSERT INTO reports (name, type, file_data, custom_instructions, status)
      VALUES (${file.name}, ${file.type}, ${fileBuffer}, ${customInstructions || ''}, 'processing')
      RETURNING id
    `

    const reportId = `report_${result[0].id}`

    return NextResponse.json({
      success: true,
      reportId,
      reportType: file.type.includes('csv') ? 'CSV Report' : 'Excel Report',
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Error uploading report:', error)
    return NextResponse.json({
      error: 'Failed to upload report'
    }, { status: 500 })
  }
}
