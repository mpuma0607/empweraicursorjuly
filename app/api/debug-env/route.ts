import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    // Critical for Quick CMA
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing",
    RAPIDAPI_ZILLOW_KEY: process.env.RAPIDAPI_ZILLOW_KEY ? "✅ Set" : "❌ Missing",
    DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
    
    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
    
    // Email
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing",
    
    // Other
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY ? "✅ Set" : "❌ Missing",
    API_KEY: process.env.API_KEY ? "✅ Set" : "❌ Missing",
    
    // Environment info
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL ? "true" : "false",
    VERCEL_ENV: process.env.VERCEL_ENV,
  }

  return NextResponse.json({
    message: "Environment Variables Debug",
    timestamp: new Date().toISOString(),
    environment: envVars,
    criticalIssues: {
      missingOpenAI: !process.env.OPENAI_API_KEY,
      missingZillow: !process.env.RAPIDAPI_ZILLOW_KEY,
      missingDatabase: !process.env.DATABASE_URL,
    }
  })
} 