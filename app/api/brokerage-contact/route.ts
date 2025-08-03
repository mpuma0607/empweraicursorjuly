import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  console.log("Brokerage contact API called")

  try {
    const body = await request.json()
    console.log("Request body:", body)

    const { name, email, phone, agentCount, message } = body

    // Validate required fields
    if (!name || !email || !phone || !agentCount) {
      console.log("Missing required fields:", { name: !!name, email: !!email, phone: !!phone, agentCount: !!agentCount })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Attempting to send brokerage contact email with Resend...")

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #b6a888 0%, #a39577 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Brokerage/Team Plan Inquiry</h1>
          <p style="color: #f5f5f5; margin: 10px 0 0 0;">Empower AI Platform</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 20px;">Brokerage Contact Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 150px;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Number of Agents:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${agentCount}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Message:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${message}</td>
              </tr>
              ` : ''}
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong>Inquiry Details:</strong><br>
                This inquiry was submitted from the Empower AI consumer home page for a Brokerage/Team Plan.
                Please follow up with the contact to discuss pricing and implementation options.
              </p>
            </div>
          </div>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            Empower AI Platform - Brokerage Contact System
          </p>
        </div>
      </div>
    `

    const emailData = {
      from: "Empower AI Platform <noreply@marketing.getempowerai.com>",
      to: ["MikePuma@c21be.com"],
      subject: `Brokerage/Team Plan Inquiry from ${name}`,
      html: emailHtml,
      replyTo: email,
    }

    console.log("Email data:", { ...emailData, html: "HTML content prepared" })

    const { data, error } = await resend.emails.send(emailData)

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: error,
          message: "Email service error",
        },
        { status: 500 },
      )
    }

    console.log("Email sent successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        message: "Server error occurred",
      },
      { status: 500 },
    )
  }
} 