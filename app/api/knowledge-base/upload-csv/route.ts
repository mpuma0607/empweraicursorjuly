import { NextRequest, NextResponse } from 'next/server'

// Improved CSV parser function that handles multi-line fields
function parseCSV(csvText: string) {
  console.log('CSV text length:', csvText.length)
  console.log('First 500 chars:', csvText.substring(0, 500))
  
  // Split by lines but reconstruct proper CSV rows
  const lines = csvText.split('\n')
  console.log('Raw lines count:', lines.length)
  
  // Reconstruct proper CSV rows (handle multi-line fields)
  const csvRows = []
  let currentRow = ''
  let inQuotes = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check if we're starting a new field or continuing one
    if (!inQuotes && line.includes(',')) {
      // This looks like a new row
      if (currentRow) {
        csvRows.push(currentRow)
        currentRow = line
      } else {
        currentRow = line
      }
    } else {
      // This is a continuation of a multi-line field
      currentRow += '\n' + line
    }
    
    // Check if we're in quotes
    const quoteCount = (line.match(/"/g) || []).length
    if (quoteCount % 2 === 1) {
      inQuotes = !inQuotes
    }
  }
  
  // Add the last row
  if (currentRow) {
    csvRows.push(currentRow)
  }
  
  console.log('Reconstructed CSV rows:', csvRows.length)
  console.log('First few rows:', csvRows.slice(0, 3))
  
  if (csvRows.length === 0) return []
  
  // Get headers from first row
  const headers = parseCSVLine(csvRows[0])
  console.log('Headers found:', headers)
  
  // Parse data rows
  const records = []
  for (let i = 1; i < csvRows.length; i++) {
    const values = parseCSVLine(csvRows[i])
    console.log(`Row ${i}: ${values.length} values, headers: ${headers.length}`)
    
    if (values.length >= headers.length) {
      const record: any = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ''
      })
      records.push(record)
    } else {
      console.log(`Skipping row ${i} - not enough values:`, values)
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

  console.log('File:', file?.name, file?.size, 'bytes')

  if (!file) {
    console.error('Missing file')
    return NextResponse.json({ error: 'File is required' }, { status: 400 })
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

    // Process Q&A pairs using flexible column names (GLOBAL, not user-specific)
    const qaPairs = records.map((record: any, index: number) => ({
      id: `qa_${Date.now()}_${index}`,
      question: record[questionKey]?.trim() || '',
      answer: record[answerKey]?.trim() || '',
      category: record.category?.trim() || record.Category?.trim() || 'General',
      created_at: new Date().toISOString()
    }))

    // Store in database
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    
    // Create knowledge_base table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        user_email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Insert Q&A pairs into database (GLOBAL, not user-specific)
    console.log('💾 Inserting Q&A pairs into database...')
    for (const qa of qaPairs) {
      console.log('📝 Inserting:', qa.question.substring(0, 50) + '...')
      await sql`
        INSERT INTO knowledge_base (question, answer, category)
        VALUES (${qa.question}, ${qa.answer}, ${qa.category})
      `
    }
    console.log('✅ Successfully inserted', qaPairs.length, 'Q&A pairs')

    return NextResponse.json({ 
      success: true, 
      qaPairs,
      message: `Successfully processed and saved ${qaPairs.length} Q&A pairs`
    })

  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({ 
      error: 'Failed to process CSV file' 
    }, { status: 500 })
  }
}
