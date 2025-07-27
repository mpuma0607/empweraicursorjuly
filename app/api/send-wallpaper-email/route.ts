import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, base64Image } = await request.json()

    if (!email || !name || !base64Image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert base64 to buffer for attachment
    const wallpaperBuffer = Buffer.from(base64Image, "base64")

    const { data, error } = await resend.emails.send({
      from: "The Next Level U <noreply@marketing.thenextlevelu.com>",
      to: [email],
      subject: `Your Daily Goals Wallpaper - BizPlan AI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Your Daily Goals Wallpaper is Ready!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              Stay accountable to your daily activity targets
            </p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${name}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Attached is your personalized daily goals wallpaper designed to keep you accountable every day. 
              Every time you look at your phone, you'll be reminded of your daily contact targets.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
              <h3 style="color: #1f2937; margin-top: 0;">📱 How to Set Your Wallpaper:</h3>
              <ol style="color: #4b5563; line-height: 1.8;">
                <li>Download the attached image to your phone</li>
                <li>Open the image in your photo gallery</li>
                <li>Tap the share/options button</li>
                <li>Select "Use as Wallpaper" or "Set as Wallpaper"</li>
                <li>Choose "Lock Screen" or "Both" for maximum impact</li>
              </ol>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-weight: 500;">
                💡 Pro Tip: Visual reminders increase goal achievement by 42%!
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              © The Next Level U - BizPlan AI
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `daily-goals-wallpaper-${name.replace(/\s+/g, "-")}.png`,
          content: wallpaperBuffer,
        },
      ],
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
