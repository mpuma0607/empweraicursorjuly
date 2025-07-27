import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, base64Image } = await request.json()

    console.log("=== BIZPLAN WALLPAPER EMAIL DEBUG ===")
    console.log("Recipient:", email)
    console.log("Has RESEND_API_KEY:", !!process.env.RESEND_API_KEY)
    console.log("Has base64Image:", !!base64Image)

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing!")
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 })
    }

    if (!base64Image) {
      console.error("No wallpaper image provided!")
      return NextResponse.json({ error: "No wallpaper image provided" }, { status: 400 })
    }

    // Convert base64 to buffer for attachment
    const buffer = Buffer.from(base64Image, "base64")

    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 600px; 
                margin: 0 auto; 
                background: #f5f5f5;
            }
            .container {
                background: white;
                margin: 20px;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header { 
                background: linear-gradient(135deg, #10b981, #059669);
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
            }
            .content { 
                padding: 30px 20px; 
            }
            .goal-box {
                background: #f0fdf4;
                border: 2px solid #10b981;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            }
            .instructions {
                background: #fef3c7;
                border: 2px solid #f59e0b;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .instructions h3 {
                color: #92400e;
                margin-top: 0;
            }
            .step {
                margin: 10px 0;
                padding: 10px;
                background: white;
                border-radius: 5px;
            }
            .footer {
                background: #f1f5f9;
                padding: 20px;
                text-align: center;
                color: #64748b;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📱 Your Daily Goal Wallpaper</h1>
                <p>BizPlan AI - The Next Level U</p>
            </div>
            
            <div class="content">
                <p>Hi ${name},</p>
                <p>Here's your personalized phone wallpaper to keep your daily goals visible and top of mind!</p>
                
                <div class="goal-box">
                    <h3>🎯 Your Daily Accountability Tool</h3>
                    <p>This wallpaper will remind you of your daily contact goals every time you pick up your phone!</p>
                </div>
                
                <div class="instructions">
                    <h3>📲 How to Set as Your Phone Wallpaper:</h3>
                    
                    <div class="step">
                        <strong>Step 1:</strong> Download the attached wallpaper image to your phone
                    </div>
                    
                    <div class="step">
                        <strong>Step 2:</strong> Open your phone's Settings → Wallpaper/Display
                    </div>
                    
                    <div class="step">
                        <strong>Step 3:</strong> Select the downloaded image and set as wallpaper
                    </div>
                    
                    <div class="step">
                        <strong>Step 4:</strong> Choose "Lock Screen" or "Both" for maximum visibility
                    </div>
                </div>
                
                <p><strong>Why This Works:</strong> Visual reminders increase goal achievement by 42%! You'll see your daily contact goal every time you pick up your phone (96+ times per day).</p>
                
                <p>Stay consistent, track your progress, and crush your 90-day business plan goals!</p>
                
                <p>Best of luck!</p>
                <p><strong>The Next Level U Team</strong></p>
            </div>
            
            <div class="footer">
                <p>Generated by BizPlan AI - The Next Level U</p>
                <p>Questions? Contact us at Mikepuma@c21be.com</p>
            </div>
        </div>
    </body>
    </html>
    `

    console.log("Attempting to send BizPlan wallpaper email via Resend...")

    const { data, error } = await resend.emails.send({
      from: "BizPlan AI - The Next Level U <noreply@marketing.thenextlevelu.com>",
      to: [email],
      subject: `📱 Your Daily Goal Wallpaper - 90-Day Business Plan`,
      html: emailContent,
      attachments: [
        {
          filename: `${name.replace(/\s+/g, "-")}-daily-goals-wallpaper.png`,
          content: buffer,
        },
      ],
    })

    if (error) {
      console.error("Resend API error:", error)
      return NextResponse.json(
        {
          error: "Failed to send wallpaper email",
          details: error.message || error,
          resendError: error,
        },
        { status: 500 },
      )
    }

    console.log("BizPlan wallpaper email sent successfully with Resend:", data)
    return NextResponse.json({
      success: true,
      message: "Wallpaper sent to your email successfully!",
      id: data?.id,
      data: data,
    })
  } catch (error) {
    console.error("BizPlan wallpaper email error:", error)
    return NextResponse.json(
      {
        error: "Failed to send wallpaper email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
