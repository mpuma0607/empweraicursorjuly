import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, address, summary, rawData, additionalData } = await request.json()

    if (!email || !address || !summary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Parse the summary into sections for better email formatting
    const sections = summary.split("##").filter((section: string) => section.trim())
    const formattedSections = sections.map((section: string) => {
      const lines = section.trim().split("\n")
      const title = lines[0]
        .trim()
        .replace(/[🏠👤📞🏘️💼📋]/gu, "")
        .trim()
      const content = lines.slice(1).join("\n").trim()
      return { title, content }
    })

    const sectionsHtml = formattedSections
      .map(
        (section: any) => `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
          ${section.title}
        </h3>
        <div style="color: #374151; line-height: 1.7; white-space: pre-wrap; font-size: 14px;">
          ${section.content}
        </div>
      </div>
    `,
      )
      .join("")

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Property Owner Report - Who's Who AI</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 0; background-color: #f8fafc; }
            .container { background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .address { font-size: 20px; margin-bottom: 15px; opacity: 0.95; }
            .badge { background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; }
            .highlight { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .data-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .timestamp { font-size: 12px; color: #94a3b8; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏠 Who's Who AI</div>
              <div class="address">${address}</div>
              <div class="badge">PROFESSIONAL PROPERTY OWNER REPORT</div>
            </div>
            
            <div class="content">
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 10px;">Property Owner Research Summary</h2>
                <p style="color: #64748b; font-size: 16px; margin: 0;">
                  Comprehensive skip trace analysis with AI-powered insights
                </p>
              </div>

              ${sectionsHtml}
              
              <div class="highlight">
                <h4 style="color: #0c4a6e; margin-top: 0; font-size: 16px;">🔒 Professional Use Guidelines</h4>
                <ul style="color: #0c4a6e; margin: 10px 0; padding-left: 20px;">
                  <li>Use this information professionally and ethically</li>
                  <li>Respect privacy and follow all applicable laws</li>
                  <li>Verify information through multiple sources when possible</li>
                  <li>Keep this information confidential and secure</li>
                </ul>
              </div>

              ${
                additionalData
                  ? `
              <div class="data-section">
                <h4 style="color: #7c3aed; margin-top: 0;">📞 Enhanced Contact Information</h4>
                <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">
                  Additional contact details were retrieved and included in the analysis above.
                </p>
              </div>
              `
                  : ""
              }
            </div>
            
            <div class="footer">
              <p style="margin: 0; font-weight: 600; color: #475569;">The Next Level U - Who's Who AI</p>
              <p style="margin: 5px 0; color: #64748b;">Professional property owner research powered by AI</p>
              <div class="timestamp">
                Generated on ${new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} at ${new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: "The Next Level U <noreply@thenextlevelu.com>",
      to: [email],
      subject: `🏠 Property Owner Report - ${address}`,
      html: emailHtml,
    })

    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
