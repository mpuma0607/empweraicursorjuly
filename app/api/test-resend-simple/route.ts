import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST() {
  try {
    console.log("=== RESEND SIMPLE TEST ===")
    console.log("API Key exists:", !!process.env.RESEND_API_KEY)
    console.log("API Key preview:", process.env.RESEND_API_KEY?.substring(0, 10) + "...")

    const resend = new Resend(process.env.RESEND_API_KEY)

    const response = await resend.emails.send({
      from: "The Next Level U <noreply@marketing.thenextlevelu.com>",
      to: ["mikepuma@c21be.com"], // Using your email for testing
      subject: "Resend Test - The Next Level U Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #b6a888, #a89977); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Resend Test Successful!</h1>
            <p style="color: white; margin: 10px 0 0 0;">The Next Level U Portal Email System</p>
          </div>
          <div style="padding: 20px;">
            <p>This is a test email from your Next Level U Portal using Resend.</p>
            <p>If you're seeing this, the email integration is working correctly!</p>
          </div>
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
      message: "Test email sent successfully to mikepuma@c21be.com",
    })
  } catch (error) {
    console.error("Simple test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    })
  }
}
