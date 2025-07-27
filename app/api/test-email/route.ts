import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    console.log("=== EMAIL DEBUG START ===")
    console.log("Environment variables:")
    console.log("GMAIL_USER:", process.env.GMAIL_USER)
    console.log("GMAIL_APP_PASSWORD exists:", !!process.env.GMAIL_APP_PASSWORD)
    console.log("GMAIL_APP_PASSWORD length:", process.env.GMAIL_APP_PASSWORD?.length || 0)

    const { email } = await request.json()
    console.log("Target email:", email)

    // Try multiple configurations
    const configs = [
      {
        name: "Gmail with your account",
        config: {
          service: "gmail",
          auth: {
            user: "Mikepuma@c21be.com",
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        },
      },
      {
        name: "Gmail SMTP direct",
        config: {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "Mikepuma@c21be.com",
            pass: process.env.GMAIL_APP_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      },
      {
        name: "Gmail with env variable",
        config: {
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        },
      },
    ]

    for (const { name, config } of configs) {
      try {
        console.log(`\n--- Testing ${name} ---`)
        const transporter = nodemailer.createTransporter(config)

        // Test connection
        await transporter.verify()
        console.log(`✅ ${name}: Connection verified`)

        // Try to send email
        const result = await transporter.sendMail({
          from: config.auth.user,
          to: email,
          subject: "BizPlan AI Test Email",
          html: `
            <h2>Test Email from BizPlan AI</h2>
            <p>This is a test email to verify the email functionality is working.</p>
            <p>Configuration used: ${name}</p>
            <p>Sent at: ${new Date().toLocaleString()}</p>
          `,
        })

        console.log(`✅ ${name}: Email sent successfully!`, result.messageId)
        return NextResponse.json({
          success: true,
          message: `Email sent successfully using ${name}`,
          messageId: result.messageId,
          config: name,
        })
      } catch (error) {
        console.log(`❌ ${name}: Failed -`, error instanceof Error ? error.message : error)
        continue
      }
    }

    return NextResponse.json({ error: "All email configurations failed" }, { status: 500 })
  } catch (error) {
    console.error("=== EMAIL DEBUG ERROR ===", error)
    return NextResponse.json(
      {
        error: "Email test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
