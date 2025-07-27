import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, address, analysisText, comparableData } = body

    if (!email || !address || !analysisText || !comparableData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
            ${address}
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
                <span style="font-size: 18px; font-weight: bold;">$${comparableData.summary.averagePrice.toLocaleString()}</span>
              </div>
              <div>
                <strong style="color: #2563eb;">Average Size:</strong><br>
                <span style="font-size: 18px; font-weight: bold;">${comparableData.summary.averageSqft.toLocaleString()} sq ft</span>
              </div>
              <div>
                <strong style="color: #7c3aed;">Comparables:</strong><br>
                <span style="font-size: 18px; font-weight: bold;">${comparableData.totalComparables} properties</span>
              </div>
            </div>
          </div>

          <!-- Top Comparables -->
          <h2 style="color: #1e293b; margin-bottom: 20px;">Top Comparable Properties</h2>
          ${comparableData.comparables
            .slice(0, 5)
            .map(
              (comp, index) => `
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
              <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
                ${index + 1}. ${comp.address || "Address not available"}
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; font-size: 14px;">
                <div><strong>Price:</strong> $${comp.price?.toLocaleString() || "N/A"}</div>
                <div><strong>Bed/Bath:</strong> ${comp.bedrooms || 0}BR/${comp.bathrooms || 0}BA</div>
                <div><strong>Sq Ft:</strong> ${comp.sqft?.toLocaleString() || "N/A"}</div>
                <div><strong>$/Sq Ft:</strong> $${comp.pricePerSqft || "N/A"}</div>
              </div>
            </div>
          `,
            )
            .join("")}

          <!-- AI Analysis -->
          <div style="margin-top: 30px;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">AI Market Analysis</h2>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              ${analysisText.replace(/\n/g, "<br>")}
            </div>
          </div>

          <!-- Guidelines -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0;"><strong>Professional Use Guidelines:</strong></p>
            <ul style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>This CMA is generated using current market data and AI analysis</li>
              <li>Verify all property details independently before making decisions</li>
              <li>Consider local market conditions and property-specific factors</li>
              <li>Consult with local real estate professionals for detailed analysis</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0 0 10px 0;">Thank you for using QuickCMA AI by The Next Level U.</p>
            <p style="margin: 0;">For more tools and insights, visit <a href="https://thenextlevelu.com" style="color: #2563eb; text-decoration: none;">thenextlevelu.com</a></p>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} The Next Level U. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()} • ${comparableData.totalComparables} comparables analyzed</p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: "QuickCMA AI <noreply@marketing.thenextlevelu.com>",
      to: [email],
      subject: `CMA Report: ${address.split(",")[0]}`,
      html: emailHtml,
    })

    if (result.error) {
      console.error("Resend API error:", result.error)
      return NextResponse.json({ error: `Failed to send email: ${result.error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: result.data?.id })
  } catch (error) {
    console.error("Error in send-cma-email route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
