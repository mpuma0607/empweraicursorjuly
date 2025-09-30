import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'
import * as XLSX from 'xlsx'

const sql = neon(process.env.DATABASE_URL!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// CSV Parser
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const records = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const record: any = {}
      headers.forEach((header, index) => {
        record[header.toLowerCase()] = values[index] || ''
      })
      records.push(record)
    }
  }

  return records
}

// Excel Parser
function parseExcel(buffer: Buffer): any[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json(worksheet)
}

export async function POST(req: NextRequest) {
  try {
    const { reportId } = await req.json()

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
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const report = reportData[0]

    // Parse the actual file data
    let data = []
    if (report.type.includes('csv')) {
      const csvText = Buffer.from(report.file_data).toString('utf-8')
      data = parseCSV(csvText)
    } else if (report.type.includes('sheet') || report.type.includes('excel')) {
      data = parseExcel(Buffer.from(report.file_data))
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'No data found in file' }, { status: 400 })
    }

    // Analyze the actual data
    const analysisPrompt = `Analyze this financial/real estate data and provide insights:

Data: ${JSON.stringify(data.slice(0, 10))} // First 10 rows for context
Custom Instructions: ${report.custom_instructions || 'Provide general financial analysis'}

Please provide:
1. Key metrics and statistics
2. Trends and patterns
3. Executive summary
4. Actionable insights

Format as JSON with: insights, summary, trends (array), keyMetrics (object)`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a financial analyst specializing in real estate data. Provide detailed, actionable insights.' },
        { role: 'user', content: analysisPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    })

    const analysisText = completion.choices[0]?.message?.content || 'Analysis failed'
    
    // Try to parse JSON response, fallback to structured response
    let analysis
    try {
      analysis = JSON.parse(analysisText)
    } catch {
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
