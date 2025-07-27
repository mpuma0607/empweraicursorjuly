import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all environment variables that might be related
    const envVars = Object.keys(process.env)
      .filter((key) => key.includes("ZILLOW") || key.includes("RAPID") || key.includes("API") || key.includes("KEY"))
      .reduce(
        (acc, key) => {
          acc[key] = process.env[key] ? `${process.env[key].substring(0, 10)}...` : "undefined"
          return acc
        },
        {} as Record<string, string>,
      )

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environmentVariables: envVars,
      specificChecks: {
        ZILLOW_API_KEY: !!process.env.ZILLOW_API_KEY,
        Zillow_API_KEY: !!process.env["Zillow_API_KEY"],
        RAPIDAPI_KEY: !!process.env.RAPIDAPI_KEY,
        X_RAPIDAPI_KEY: !!process.env.X_RAPIDAPI_KEY,
      },
      allZillowVars: Object.keys(process.env)
        .filter((key) => key.toLowerCase().includes("zillow"))
        .map((key) => ({
          name: key,
          exists: !!process.env[key],
          length: process.env[key]?.length || 0,
        })),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
