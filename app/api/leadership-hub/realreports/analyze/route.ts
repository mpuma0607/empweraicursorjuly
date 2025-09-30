import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'

const sql = neon(process.env.DATABASE_URL!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Enhanced CSV Parser
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    console.log('CSV has less than 2 lines')
    return []
  }

  // Find the header row (look for the first line with multiple columns)
  let headerIndex = 0
  for (let i = 0; i < lines.length; i++) {
    const columns = lines[i].split(',').length
    if (columns > 1) {
      headerIndex = i
      break
    }
  }

  const headerLine = lines[headerIndex]
  console.log('Header line:', headerLine)
  
  // Parse headers more carefully
  const headers = parseCSVLine(headerLine)
  console.log('Parsed headers:', headers)

  const records = []

  // Process data rows
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line) {
      const values = parseCSVLine(line)
      if (values.length > 0) {
        const record: any = {}
        headers.forEach((header, index) => {
          const cleanHeader = header.trim().replace(/"/g, '').toLowerCase()
          record[cleanHeader] = values[index] ? values[index].trim().replace(/"/g, '') : ''
        })
        records.push(record)
      }
    }
  }

  console.log('Parsed records count:', records.length)
  return records
}

// Helper function to parse CSV line handling quotes and commas
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

export async function POST(req: NextRequest) {
  try {
    const { reportId } = await req.json()

    console.log('RealReports analyze called with reportId:', reportId)

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 })
    }

    // Get report data from database
    const reportData = await sql`
      SELECT name, type, file_data, custom_instructions, status
      FROM reports 
      WHERE id = ${parseInt(reportId.replace('report_', ''))}
    `

    if (reportData.length === 0) {
      console.log('Report not found in database')
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const report = reportData[0]
    console.log('Found report:', report.name, 'Type:', report.type)

    // Parse the actual file data (CSV only for now)
    let data = []
    if (report.type.includes('csv')) {
      const csvText = Buffer.from(report.file_data).toString('utf-8')
      console.log('CSV text length:', csvText.length)
      console.log('First 500 chars of CSV:', csvText.substring(0, 500))
      
      data = parseCSV(csvText)
      console.log('Parsed data rows:', data.length)
      console.log('First few rows:', data.slice(0, 3))
    } else {
      // For Excel files, we'll provide a message to convert to CSV
      return NextResponse.json({
        error: 'Excel files not supported yet. Please convert to CSV format.'
      }, { status: 400 })
    }
    
    if (data.length === 0) {
      console.log('No data found in file - CSV might be empty or malformed')
      return NextResponse.json({ error: 'No data found in file. Please check your CSV format.' }, { status: 400 })
    }

    // Analyze the actual data
    const analysisPrompt = `You are a financial analyst. Analyze this data and provide insights. The data could be any type of financial report (commissions, expenses, revenue, agent performance, etc.).

Data Sample: ${JSON.stringify(data.slice(0, 5))}
Total Records: ${data.length}
Custom Instructions: ${report.custom_instructions || 'Analyze the data and provide key insights'}

Instructions:
1. Look at the column headers to understand what type of data this is
2. Identify key metrics, trends, and patterns
3. Calculate relevant statistics (totals, averages, growth rates, etc.)
4. Provide actionable insights based on the data
5. Don't make up specific numbers - work with what's in the data

Please provide a JSON response with:
{
  "insights": "Detailed analysis based on the actual data",
  "summary": "Executive summary of key findings", 
  "trends": ["Trend 1", "Trend 2", "Trend 3"],
  "keyMetrics": {
    "Metric Name": "Calculated Value",
    "Another Metric": "Calculated Value"
  }
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a financial analyst specializing in real estate data. Always respond with valid JSON format as requested.' },
        { role: 'user', content: analysisPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.2,
    })

    const analysisText = completion.choices[0]?.message?.content || 'Analysis failed'
    
    console.log('AI analysis response:', analysisText.substring(0, 200) + '...')
    
    // Try to parse JSON response, fallback to structured response
    let analysis
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.log('JSON parse failed, using fallback:', parseError)
      // Fallback if AI doesn't return JSON
      analysis = {
        insights: analysisText,
        summary: "AI analysis completed. See insights for details.",
        trends: ["Data analysis completed"],
        keyMetrics: { "Records Analyzed": data.length.toString() }
      }
    }

    // Update report with analysis results
    await sql`
      UPDATE reports 
      SET status = 'completed',
          insights = ${analysis.insights || 'Analysis completed'},
          summary = ${analysis.summary || 'Summary generated'},
          trends = ${analysis.trends || ['Analysis completed']},
          key_metrics = ${JSON.stringify(analysis.keyMetrics || { "Records Analyzed": data.length.toString() })}
      WHERE id = ${parseInt(reportId.replace('report_', ''))}
    `

    return NextResponse.json({
      success: true,
      insights: analysis.insights || 'Analysis completed',
      summary: analysis.summary || 'Summary generated',
      trends: analysis.trends || ['Analysis completed'],
      keyMetrics: analysis.keyMetrics || { "Records Analyzed": data.length.toString() }
    })

  } catch (error) {
    console.error('Error analyzing report:', error)
    return NextResponse.json({
      error: 'Failed to analyze report'
    }, { status: 500 })
  }
}
