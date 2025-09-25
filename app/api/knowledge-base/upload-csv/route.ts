import { NextRequest, NextResponse } from 'next/server'

// Improved CSV parser function
function parseCSV(csvText: string) {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  // Get headers from first line
  const headers = parseCSVLine(lines[0])
  
  // Parse data rows
  const records = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
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

// Parse a single CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

export async function POST(req: NextRequest) {
  try {
    console.log('CSV upload API called')
    const formData = await req.formData()
    const file = formData.get('file') as File
    const userEmail = formData.get('userEmail') as string

    console.log('File:', file?.name, file?.size, 'bytes')
    console.log('User email:', userEmail)

    if (!file || !userEmail) {
      console.error('Missing file or user email')
      return NextResponse.json({ error: 'File and user email are required' }, { status: 400 })
    }

    // Read and parse CSV
    const csvText = await file.text()
    console.log('CSV text length:', csvText.length)
    const records = parseCSV(csvText)
    console.log('Parsed records:', records.length)

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
