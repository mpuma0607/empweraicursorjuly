import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Check if we're in preview/development mode
  const isPreview = process.env.VERCEL_ENV === "preview" || !process.env.VERCEL

  if (isPreview) {
    return NextResponse.json({
      message: "⚠️ API testing not available in preview mode",
      reason: "External HTTP requests are blocked in preview environment",
      suggestion: "Deploy to production or staging to test scraping functionality",
      environment: {
        VERCEL_ENV: process.env.VERCEL_ENV || "development",
        isVercel: !!process.env.VERCEL,
        hasRequiredEnvVars: {
          BRIGHT_DATA_PUPPETEER_ENDPOINT: !!process.env.BRIGHT_DATA_PUPPETEER_ENDPOINT,
          BRIGHT_DATA_USERNAME: !!process.env.BRIGHT_DATA_USERNAME,
          BRIGHT_DATA_PASSWORD: !!process.env.BRIGHT_DATA_PASSWORD,
        },
      },
    })
  }

  // Your original working code would go here for production
  return NextResponse.json({
    message: "Production scraping tests would run here",
    timestamp: new Date().toISOString(),
  })
}
