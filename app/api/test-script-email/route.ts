import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST() {
  try {
    console.log("=== SCRIPT EMAIL TEST ===")
    console.log("API Key exists:", !!process.env.RESEND_API_KEY)
    console.log("API Key preview:", process.env.RESEND_API_KEY?.substring(0, 10) + "...")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("Is Vercel:", !!process.env.VERCEL)

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing!")
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY environment variable is not set",
        details: {
          message: "The RESEND_API_KEY environment variable is required for sending emails",
          solution: "Add RESEND_API_KEY to your environment variables or deployment configuration",
          currentEnv: process.env.NODE_ENV,
          isVercel: !!process.env.VERCEL
        }
      }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const response = await resend.emails.send({
      from: "Empower AI <scripts@getempowerai.com>",
      to: ["test@example.com"], // Test email
      subject: "Script Email Test - Empower AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Script Email Test
          </h2>
          <p>This is a test email to verify the script email system is working.</p>
          <p>If you're seeing this, the email integration is working correctly!</p>
        </div>
      `,
    })

    console.log("Resend response:", response)

    if (response.error) {
      return NextResponse.json({
        success: false,
        error: response.error.message,
        details: response.error,
      })
    }

    return NextResponse.json({
      success: true,
      messageId: response.data?.id,
      message: "Test email sent successfully",
      envInfo: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        environment: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL
      }
    })
  } catch (error) {
    console.error("Script email test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
      envInfo: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        environment: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL
      }
    })
  }
}
