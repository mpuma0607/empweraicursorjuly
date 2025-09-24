import { NextRequest, NextResponse } from 'next/server'

// Simple CSV parser function
function parseCSV(csvText: string) {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  // Get headers from first line
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  // Parse data rows
  const records = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    if (values.length === headers.length) {
      const record: any = {}
      headers.forEach((header, index) => {
        record[header] = values[index]
      })
      records.push(record)
    }
  }
  
  return records
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const userEmail = formData.get('userEmail') as string

    if (!file || !userEmail) {
      return NextResponse.json({ error: 'File and user email are required' }, { status: 400 })
    }

    // Read and parse CSV
    const csvText = await file.text()
    const records = parseCSV(csvText)

    // Validate CSV format
    if (records.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }

    const firstRecord = records[0]
    if (!firstRecord.question || !firstRecord.answer) {
      return NextResponse.json({ 
        error: 'CSV must have "question" and "answer" columns' 
      }, { status: 400 })
    }

    // Process Q&A pairs
    const qaPairs = records.map((record: any, index: number) => ({
      id: `qa_${Date.now()}_${index}`,
      question: record.question.trim(),
      answer: record.answer.trim(),
      category: record.category?.trim() || 'General',
      created_at: new Date().toISOString(),
      user_email: userEmail
    }))

    // TODO: Store in database and create embeddings
    // For now, we'll just return the processed data
    // In the next step, we'll add database storage and vector embeddings

    return NextResponse.json({ 
      success: true, 
      qaPairs,
      message: `Successfully processed ${qaPairs.length} Q&A pairs`
    })

  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({ 
      error: 'Failed to process CSV file' 
    }, { status: 500 })
  }
}
