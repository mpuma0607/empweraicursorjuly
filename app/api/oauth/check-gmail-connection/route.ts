import { NextResponse } from "next/server"

export async function GET() {
  try {
    // For now, we'll check if Gmail credentials are available
    // In a real implementation, you'd check OAuth tokens
    const hasGmailCredentials = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
    
    return NextResponse.json({
      connected: hasGmailCredentials,
      message: hasGmailCredentials ? "Gmail credentials available" : "Gmail credentials not configured"
    })
  } catch (error) {
    console.error("Error checking Gmail connection:", error)
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
