import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET(request: NextRequest) {
  try {
    console.log("Testing email functionality...")
    console.log("Gmail User:", process.env.GMAIL_USER)
    console.log("Gmail App Password exists:", !!process.env.GMAIL_APP_PASSWORD)

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    console.log("Verifying transporter...")
    await transporter.verify()
    console.log("Transporter verified successfully!")

    return NextResponse.json({
      success: true,
      message: "Email configuration is working correctly",
      gmailUser: process.env.GMAIL_USER,
    })
  } catch (error) {
    console.error("Email test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
