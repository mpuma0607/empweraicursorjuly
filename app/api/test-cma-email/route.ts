import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST() {
  try {
    console.log("=== CMA EMAIL TEST ===")
    console.log("API Key exists:", !!process.env.RESEND_API_KEY)
    console.log("API Key preview:", process.env.RESEND_API_KEY?.substring(0, 10) + "...")

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Test data similar to what the CMA would send
    const testData = {
      email: "mikepuma@c21be.com",
      address: "123 Test Street, Test City, CA 90210",
      analysisText: "This is a test CMA analysis text to verify the email functionality is working correctly.",
      comparableData: {
        totalComparables: 5,
        summary: {
          averagePrice: 750000,
          averageSqft: 2500,
          priceRange: { min: 650000, max: 850000 }
        },
        comparables: [
          {
            address: "456 Test Ave, Test City, CA 90210",
            price: 750000,
            bedrooms: 3,
            bathrooms: 2,
            sqft: 2500,
            pricePerSqft: 300
          }
        ]
      }
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🏠 QuickCMA Report</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 18px;">
            Comparative Market Analysis
          </p>
          <p style="color: #bfdbfe; margin: 5px 0 0 0; font-size: 16px;">
            ${testData.address}
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          <!-- Market Summary -->
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">Market Summary</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
              <div>
                <strong style="color: #059669;">Average Price:</strong><br>
                <span style="font-size: 18px; font-weight: bold;">$${testData.comparableData.summary.averagePrice.toLocaleString()}</span>
              </div>
              <div>
                <strong style="color: #2563eb;">Average Size:</strong><br>
                <span style="font-size: 18px; font-weight: bold;">${testData.comparableData.summary.averageSqft.toLocaleString()} sq ft</span>
              </div>
              <div>
                <strong style="color: #7c3aed;">Comparables:</strong><br>
                <span style="font-size: 18px; font-weight: bold;">${testData.comparableData.totalComparables} properties</span>
              </div>
            </div>
          </div>

          <!-- AI Analysis -->
          <div style="margin-top: 30px;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">AI Market Analysis</h2>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              ${testData.analysisText}
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0 0 10px 0;">This is a TEST email from QuickCMA AI by The Next Level U.</p>
            <p style="margin: 0;">For more tools and insights, visit <a href="https://getempowerai.com" style="color: #2563eb; text-decoration: none;">getempowerai.com</a></p>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} The Next Level U. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()} • ${testData.comparableData.totalComparables} comparables analyzed</p>
        </div>
      </div>
    `

    const response = await resend.emails.send({
      from: "QuickCMA AI <noreply@marketing.getempowerai.com>",
      to: [testData.email],
      subject: `TEST CMA Report: ${testData.address.split(",")[0]}`,
      html: emailHtml,
    })

    console.log("Resend response:", response)

    if (response.error) {
      return NextResponse.json({
        success: false,
        error: response.error.message,
        details: response.error,
      })
    }

    return NextResponse.json({
      success: true,
      messageId: response.data?.id,
      message: "Test CMA email sent successfully to mikepuma@c21be.com",
    })
  } catch (error) {
    console.error("CMA email test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    })
  }
}
