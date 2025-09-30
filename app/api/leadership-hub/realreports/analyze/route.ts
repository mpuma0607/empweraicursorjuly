import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'

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
      data = parseCSV(csvText)
    } else {
      // For Excel files, we'll provide a message to convert to CSV
      return NextResponse.json({
        error: 'Excel files not supported yet. Please convert to CSV format.'
      }, { status: 400 })
    }

    console.log('Parsed data rows:', data.length)
    
    if (data.length === 0) {
      console.log('No data found in file')
      return NextResponse.json({ error: 'No data found in file' }, { status: 400 })
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
