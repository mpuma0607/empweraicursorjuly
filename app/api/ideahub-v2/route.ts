import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === "send-email") {
      const { to, name, content, imageUrl } = data

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your IdeaHub V2 Content is Ready!</h2>
          <p>Hi ${name},</p>
          <p>Here's your generated social media content:</p>
          
          ${imageUrl ? `<img src="${imageUrl}" alt="Generated content image" style="max-width: 100%; height: auto; margin: 20px 0;" />` : ""}
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${content}</pre>
          </div>
          
          <p>Best regards,<br>The IdeaHub V2 Team</p>
        </div>
      `

      const result = await resend.emails.send({
        from: "IdeaHub V2 <noreply@yourdomain.com>",
        to: [to],
        subject: "Your IdeaHub V2 Content is Ready!",
        html: emailHtml,
      })

      return NextResponse.json({ success: true, data: result })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
