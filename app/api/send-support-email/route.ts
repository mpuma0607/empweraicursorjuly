import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  console.log("Support email API called")

  try {
    const body = await request.json()
    console.log("Request body:", body)

    const { name, email, phone, issue } = body

    // Validate required fields
    if (!name || !email || !issue) {
      console.log("Missing required fields:", { name: !!name, email: !!email, issue: !!issue })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Attempting to send email with Resend...")

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Support Request</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0;">The Next Level U Portal</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 20px;">Support Request Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 120px;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${phone || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Issue:</td>
                <td style="padding: 10px 0; color: #374151; line-height: 1.6;">${issue.replace(/\n/g, "<br>")}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Submitted:</strong> ${new Date().toLocaleString("en-US", {
                  timeZone: "America/New_York",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </p>
            </div>
          </div>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            The Next Level U Portal Support System
          </p>
        </div>
      </div>
    `

    const emailData = {
      from: "The Next Level U Portal <noreply@marketing.thenextlevelu.com>",
      to: ["MikePuma@c21be.com", "Jimmymcnally@c21be.com"],
      subject: `Support Request from ${name}`,
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
