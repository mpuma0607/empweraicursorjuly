import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    console.log("Testing Resend integration...")
    console.log("API Key exists:", !!process.env.RESEND_API_KEY)

    const response = await resend.emails.send({
      from: "The Next Level U <noreply@thenextlevelu.com>",
      to: ["test@example.com"], // Replace with your email for testing
      subject: "Resend Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Resend Integration Test</h1>
          <p>This is a test email to verify Resend is working properly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    })

    console.log("Resend response:", response)

    if (response.error) {
      console.error("Resend error:", response.error)
      return NextResponse.json(
        {
          success: false,
          error: response.error.message,
          details: response.error,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      messageId: response.data?.id,
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 },
    )
  }
}
