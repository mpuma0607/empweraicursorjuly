import { NextRequest, NextResponse } from 'next/server'

// Improved CSV parser function
function parseCSV(csvText: string) {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  console.log('Total lines in CSV:', lines.length)
  console.log('First few lines:', lines.slice(0, 3))
  
  // Get headers from first line
  const headers = parseCSVLine(lines[0])
  console.log('Headers found:', headers)
  
  // Parse data rows
  const records = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    console.log(`Line ${i}: ${values.length} values, headers: ${headers.length}`)
    
    if (values.length >= headers.length) {
      const record: any = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ''
      })
      records.push(record)
    } else {
      console.log(`Skipping line ${i} - not enough values:`, values)
    }
  }
  
  console.log('Total records parsed:', records.length)
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
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Handle escaped quotes ""
        current += '"'
        i++ // Skip next quote
      } else {
        inQuotes = !inQuotes
      }
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
    console.log('First record:', firstRecord)
    console.log('Available columns:', Object.keys(firstRecord))
    
    // Try to find question and answer columns with flexible matching
    const questionKey = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('question') || 
      key.toLowerCase().includes('q') ||
      key.toLowerCase().includes('ask')
    )
    
    const answerKey = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('answer') || 
      key.toLowerCase().includes('response') ||
      key.toLowerCase().includes('reply') ||
      key.toLowerCase().includes('a')
    )
    
    if (!questionKey || !answerKey) {
      return NextResponse.json({ 
        error: `CSV must have question and answer columns. Found columns: ${Object.keys(firstRecord).join(', ')}` 
      }, { status: 400 })
    }
    
    console.log('Using question column:', questionKey)
    console.log('Using answer column:', answerKey)

    // Process Q&A pairs using flexible column names
    const qaPairs = records.map((record: any, index: number) => ({
      id: `qa_${Date.now()}_${index}`,
      question: record[questionKey]?.trim() || '',
      answer: record[answerKey]?.trim() || '',
      category: record.category?.trim() || record.Category?.trim() || 'General',
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
