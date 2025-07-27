import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Environment Variables Test",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "NOT_FOUND",
    apiKey: process.env.CLOUDINARY_API_KEY ? "FOUND" : "NOT_FOUND",
    apiSecret: process.env.CLOUDINARY_API_SECRET ? "FOUND" : "NOT_FOUND",
    databaseUrl: process.env.DATABASE_URL ? "FOUND" : "NOT_FOUND",
    openaiKey: process.env.OPENAI_API_KEY ? "FOUND" : "NOT_FOUND",
    allEnvVars: Object.keys(process.env).filter(key => key.includes('CLOUDINARY')),
  })
} 