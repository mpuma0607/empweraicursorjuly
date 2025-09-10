import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, name, profile, planData } = await request.json()

    if (!to || !name || !profile || !planData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Sending RealCoach plan email via Resend to:", to)

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #b6a888, #9c8a6b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Your RealCoach AI Action Plan</h1>
          <p style="color: white; margin: 15px 0 0 0; font-size: 16px;">Personalized 4-Week Action Plan - The Next Level U</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Hi ${name},</h2>
          
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
            Your personalized RealCoach AI action plan is ready! This comprehensive 4-week plan is designed 
            specifically for your goals, preferences, and constraints to help you achieve your real estate success.
          </p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #b6a888;">
            <h4 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 16px;">🎯 Your North Star Goals:</h4>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 5px;">Annual Closings: ${profile.targetUnits}</li>
              <li style="margin-bottom: 5px;">Annual GCI: $${(profile.targetUnits * profile.avgPricePoint * 0.03).toLocaleString()}</li>
              <li style="margin-bottom: 5px;">Weekly Closings: ${Math.round((profile.targetUnits / 12 / 4.33) * 10) / 10}</li>
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px;">💡 What's Included in Your Plan:</h4>
            <ul style="color: #78350f; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 5px;">Personalized channel recommendations based on your preferences</li>
              <li style="margin-bottom: 5px;">Weekly playbook with specific activities for each channel</li>
              <li style="margin-bottom: 5px;">Micro-skills training suggestions for your focus areas</li>
              <li style="margin-bottom: 5px;">Weekly KPI targets to track your progress</li>
              <li style="margin-bottom: 5px;">Time block scheduling for consistent execution</li>
              <li>Calendar integration to ensure you follow through</li>
            </ul>
          </div>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
            <h4 style="color: #065f46; margin: 0 0 15px 0; font-size: 16px;">🚀 Your Next Steps:</h4>
            <ol style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 5px;">Start with your primary channel this week</li>
              <li style="margin-bottom: 5px;">Add your time blocks to your calendar</li>
              <li style="margin-bottom: 5px;">Track your progress using the KPI targets</li>
              <li style="margin-bottom: 5px;">Review and adjust your plan weekly</li>
              <li>Focus on consistency over perfection</li>
            </ol>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
            I've attached your complete action plan as a PDF for easy reference. This plan is tailored 
            specifically to your situation and will evolve with you as you grow in your real estate career.
          </p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">📊 Your Recommended Channels:</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              ${planData.recommendedChannels?.map((channel: any, index: number) => 
                `${index + 1}. ${channel.name} (Score: ${channel.score}/3)`
              ).join(' • ') || 'Based on your preferences and energy levels'}
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong>Mike Puma</strong><br>
            The Next Level U Team<br>
            <a href="mailto:MikePuma@c21be.com" style="color: #b6a888; text-decoration: none;">MikePuma@c21be.com</a>
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 25px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 The Next Level U. Empowering real estate professionals with AI-powered tools.
          </p>
        </div>
      </div>
    `

    const response = await resend.emails.send({
      from: "RealCoach AI - The Next Level U <noreply@marketing.getempowerai.com>",
      to: [to],
      subject: `Your RealCoach AI Action Plan - ${new Date().toLocaleDateString()}`,
      html: emailHtml,
      attachments: [
        {
          filename: `RealCoach_Action_Plan_${name.replace(/\s+/g, "_")}.pdf`,
          content: planData.pdfBuffer, // This will be the PDF buffer from the frontend
        },
      ],
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
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "RealCoach plan email sent successfully",
      messageId: response.data?.id,
    })
  } catch (error) {
    console.error("RealCoach plan email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 }
    )
  }
}
